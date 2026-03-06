"use client";

import React, { useState, useMemo } from "react";
import { Plus, RefreshCw } from "lucide-react";
import { useWebsites } from "@/hooks/useWebsites";
import axios from "axios";
import { API_BACKEND_URL } from "@/config";
import { useAuth } from "@clerk/nextjs";

import { DashboardStats } from "@/components/DashboardStats";
import { WebsiteCard, type ProcessedWebsite } from "@/components/WebsiteCard";
import { AddWebsiteModal } from "@/components/AddWebsiteModal";
import { EmptyState } from "@/components/EmptyState";

type UptimeStatus = "good" | "bad" | "unknown";

function LoadingSkeleton() {
  return (
    <div className="space-y-6 animate-fade-in">
      {/* Stats skeleton */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        {[1, 2, 3].map((i) => (
          <div key={i} className="glass-surface rounded-xl p-5 h-20">
            <div className="h-3 w-20 bg-white/5 rounded animate-shimmer mb-3" />
            <div className="h-6 w-16 bg-white/5 rounded animate-shimmer" />
          </div>
        ))}
      </div>
      {/* Card skeletons */}
      {[1, 2, 3].map((i) => (
        <div key={i} className="glass-surface rounded-xl p-5 h-20">
          <div className="flex items-center gap-3">
            <div className="w-3 h-3 rounded-full bg-white/5 animate-shimmer" />
            <div className="h-4 w-48 bg-white/5 rounded animate-shimmer" />
          </div>
        </div>
      ))}
    </div>
  );
}

export default function Dashboard() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { websites, refreshWebsites, loading, error } = useWebsites();
  const { getToken } = useAuth();

  const processedWebsites = useMemo<ProcessedWebsite[]>(() => {
    return websites.map((website) => {
      const sortedTicks = [...website.ticks].sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );

      const now = Date.now();
      const snappedNow =
        Math.floor(now / (3 * 60 * 1000)) * (3 * 60 * 1000);
      const thirtyMinutesAgo = new Date(snappedNow - 30 * 60 * 1000);
      const recentTicks = sortedTicks.filter(
        (tick) => new Date(tick.createdAt) > thirtyMinutesAgo
      );

      // Aggregate into 3-minute windows
      const windows: UptimeStatus[] = [];
      for (let i = 0; i < 10; i++) {
        const windowStart = new Date(snappedNow - (i + 1) * 3 * 60 * 1000);
        const windowEnd = new Date(snappedNow - i * 3 * 60 * 1000);

        const windowTicks = recentTicks.filter((tick) => {
          const tickTime = new Date(tick.createdAt);
          return tickTime >= windowStart && tickTime < windowEnd;
        });

        const upTicks = windowTicks.filter(
          (tick) => tick.status === "Good"
        ).length;
        windows[9 - i] =
          windowTicks.length === 0
            ? "unknown"
            : upTicks / windowTicks.length > 0.5
              ? "good"
              : "bad";
      }

      const totalTicks = sortedTicks.length;
      const upTicks = sortedTicks.filter(
        (tick) => tick.status === "Good"
      ).length;
      const uptimePercentage =
        totalTicks === 0 ? 100 : (upTicks / totalTicks) * 100;

      const currentStatus = windows[windows.length - 1];

      const lastChecked = sortedTicks[0]
        ? new Date(sortedTicks[0].createdAt).toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        })
        : "Never";

      // Calculate average latency from recent good ticks
      const goodRecentTicks = recentTicks.filter((t) => t.status === "Good");
      const avgLatency =
        goodRecentTicks.length > 0
          ? Math.round(
            goodRecentTicks.reduce((sum, t) => sum + t.latency, 0) /
            goodRecentTicks.length
          )
          : 0;

      return {
        id: website.id,
        url: website.url,
        paused: website.paused,
        status: currentStatus,
        uptimePercentage,
        lastChecked,
        uptimeTicks: windows,
        avgLatency,
      };
    });
  }, [websites]);

  // Compute dashboard stats
  const stats = useMemo(() => {
    const active = processedWebsites.filter((w) => !w.paused);
    const paused = processedWebsites.filter((w) => w.paused);
    const avgUptime =
      active.length > 0
        ? active.reduce((sum, w) => sum + w.uptimePercentage, 0) /
        active.length
        : 100;
    const issues = active.filter((w) => w.status === "bad").length;

    return {
      totalMonitored: active.length,
      averageUptime: avgUptime,
      issueCount: issues,
      pausedCount: paused.length,
    };
  }, [processedWebsites]);

  const handleDelete = async (websiteId: string) => {
    try {
      const token = await getToken();
      if (!token) {
        alert("Authentication token not available.");
        return;
      }
      await axios.delete(`${API_BACKEND_URL}/api/v1/website/`, {
        data: { websiteId },
        headers: { Authorization: token },
      });
      await refreshWebsites();
    } catch (err) {
      console.error("Error deleting website:", err);
      alert("Failed to delete website");
    }
  };

  const handlePause = async (websiteId: string) => {
    try {
      const token = await getToken();
      if (!token) {
        alert("Authentication token not available.");
        return;
      }
      await axios.put(
        `${API_BACKEND_URL}/api/v1/website/pause`,
        { websiteId },
        { headers: { Authorization: token } }
      );
      await refreshWebsites();
    } catch (err) {
      console.error("Error toggling pause:", err);
      alert("Failed to toggle pause");
    }
  };

  return (
    <div className="min-h-screen bg-slate-950">
      {/* Gradient background accents */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-emerald-500/5 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl" />
      </div>

      <div className="relative max-w-5xl mx-auto pt-24 pb-8 px-4 sm:px-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold text-white">
              Monitoring Dashboard
            </h1>
            <p className="text-sm text-slate-500 mt-1">
              Track website uptime and performance in real-time
            </p>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => refreshWebsites()}
              className="p-2.5 rounded-xl glass-surface text-slate-400 hover:text-emerald-400 hover:border-emerald-500/20 transition-all duration-200"
              title="Refresh"
            >
              <RefreshCw className="w-4 h-4" />
            </button>
            <button
              onClick={() => setIsModalOpen(true)}
              className="flex items-center gap-2 px-5 py-2.5 bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl font-semibold text-sm transition-all duration-200 hover:shadow-lg hover:shadow-emerald-500/25"
            >
              <Plus className="w-4 h-4" />
              <span className="hidden sm:inline">Add Website</span>
            </button>
          </div>
        </div>

        {/* Error banner */}
        {error && (
          <div className="mb-6 p-4 rounded-xl border border-red-500/20 bg-red-500/5 animate-slide-up">
            <p className="text-red-400 text-sm">{error}</p>
          </div>
        )}

        {/* Loading state */}
        {loading && <LoadingSkeleton />}

        {/* Content */}
        {!loading && (
          <>
            {processedWebsites.length === 0 ? (
              <EmptyState onAddWebsite={() => setIsModalOpen(true)} />
            ) : (
              <>
                {/* Stats */}
                <DashboardStats {...stats} />

                {/* Website cards */}
                <div className="space-y-3">
                  {processedWebsites.map((website) => (
                    <WebsiteCard
                      key={website.id}
                      website={website}
                      onDelete={handleDelete}
                      onPause={handlePause}
                    />
                  ))}
                </div>
              </>
            )}
          </>
        )}
      </div>

      {/* Modal */}
      <AddWebsiteModal
        isOpen={isModalOpen}
        onClose={async (url) => {
          if (url === null) {
            setIsModalOpen(false);
            return;
          }
          try {
            const token = await getToken();
            if (!token) {
              alert(
                "Authentication token not available. Please try logging in again."
              );
              setIsModalOpen(false);
              return;
            }
            setIsModalOpen(false);
            await axios.post(
              `${API_BACKEND_URL}/api/v1/website`,
              { url },
              { headers: { Authorization: token } }
            );
            await refreshWebsites();
          } catch (err) {
            console.error("Error adding website:", err);
            if (axios.isAxiosError(err)) {
              if (
                err.code === "ECONNREFUSED" ||
                err.message === "Network Error"
              ) {
                alert(
                  "Cannot connect to API server. Please make sure the API server is running on port 8080."
                );
              } else {
                alert(
                  err.response?.data?.message ||
                  err.message ||
                  "Failed to add website"
                );
              }
            } else {
              alert("An unexpected error occurred");
            }
          }
        }}
      />
    </div>
  );
}