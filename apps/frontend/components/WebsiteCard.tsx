"use client";

import React, { useState } from "react";
import { ChevronDown, Trash2, Pause, Play, Clock, Zap } from "lucide-react";
import { StatusIndicator } from "./StatusIndicator";
import { UptimeChart } from "./UptimeChart";

type UptimeStatus = "good" | "bad" | "unknown";

export interface ProcessedWebsite {
    id: string;
    url: string;
    paused: boolean;
    status: UptimeStatus;
    uptimePercentage: number;
    lastChecked: string;
    uptimeTicks: UptimeStatus[];
    avgLatency: number;
}

interface WebsiteCardProps {
    website: ProcessedWebsite;
    onDelete: (id: string) => void;
    onPause: (id: string) => void;
}

export function WebsiteCard({ website, onDelete, onPause }: WebsiteCardProps) {
    const [isExpanded, setIsExpanded] = useState(false);

    const displayUrl = (() => {
        try {
            const u = new URL(website.url);
            return u.hostname;
        } catch {
            return website.url;
        }
    })();

    return (
        <div
            className={`glass-surface rounded-xl overflow-hidden transition-all duration-300 animate-slide-up ${website.paused ? "opacity-50" : "hover:border-white/20"
                }`}
        >
            {/* Header row */}
            <div
                className="p-4 sm:p-5 cursor-pointer flex items-center justify-between gap-4 group"
                onClick={() => setIsExpanded(!isExpanded)}
            >
                {/* Left: Status + URL */}
                <div className="flex items-center gap-3 min-w-0">
                    <StatusIndicator
                        status={website.paused ? "unknown" : website.status}
                        size="md"
                    />
                    <div className="min-w-0">
                        <div className="flex items-center gap-2">
                            <h3
                                className={`font-semibold truncate ${website.paused ? "text-slate-500" : "text-white"
                                    }`}
                            >
                                {displayUrl}
                            </h3>
                            {website.paused && (
                                <span className="shrink-0 text-[10px] font-semibold px-2 py-0.5 rounded-full bg-yellow-500/15 text-yellow-500 border border-yellow-500/20 uppercase tracking-wider">
                                    Paused
                                </span>
                            )}
                        </div>
                        <p className="text-xs text-slate-500 truncate mt-0.5">
                            {website.url}
                        </p>
                    </div>
                </div>

                {/* Right: Uptime + Actions */}
                <div className="flex items-center gap-2 sm:gap-3 shrink-0">
                    {/* Uptime badge */}
                    {!website.paused && (
                        <div
                            className={`hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-semibold ${website.uptimePercentage >= 99
                                    ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                                    : website.uptimePercentage >= 95
                                        ? "bg-yellow-500/10 text-yellow-400 border border-yellow-500/20"
                                        : "bg-red-500/10 text-red-400 border border-red-500/20"
                                }`}
                        >
                            {website.uptimePercentage.toFixed(1)}%
                        </div>
                    )}

                    {/* Pause/Resume */}
                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            onPause(website.id);
                        }}
                        className={`p-2 rounded-lg transition-all duration-200 ${website.paused
                                ? "text-emerald-400 hover:bg-emerald-500/10 hover:text-emerald-300"
                                : "text-slate-500 hover:bg-yellow-500/10 hover:text-yellow-400"
                            }`}
                        title={website.paused ? "Resume monitoring" : "Pause monitoring"}
                    >
                        {website.paused ? (
                            <Play className="w-4 h-4" />
                        ) : (
                            <Pause className="w-4 h-4" />
                        )}
                    </button>

                    {/* Delete */}
                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            if (confirm("Are you sure you want to delete this website?")) {
                                onDelete(website.id);
                            }
                        }}
                        className="p-2 rounded-lg text-slate-500 hover:bg-red-500/10 hover:text-red-400 transition-all duration-200"
                        title="Delete website"
                    >
                        <Trash2 className="w-4 h-4" />
                    </button>

                    {/* Expand chevron */}
                    <div
                        className={`p-1 text-slate-500 transition-transform duration-200 ${isExpanded ? "rotate-180" : ""
                            }`}
                    >
                        <ChevronDown className="w-4 h-4" />
                    </div>
                </div>
            </div>

            {/* Expanded content */}
            {isExpanded && (
                <div className="px-4 sm:px-5 pb-5 border-t border-white/5 card-expand-enter">
                    {website.paused ? (
                        <div className="pt-4">
                            <p className="text-sm text-yellow-500/80">
                                Monitoring is paused. Click the play button to resume tracking
                                this website.
                            </p>
                        </div>
                    ) : (
                        <div className="pt-4 space-y-4">
                            {/* Uptime Chart */}
                            <div>
                                <p className="text-xs font-medium text-slate-400 mb-2 uppercase tracking-wider">
                                    Last 30 Minutes
                                </p>
                                <UptimeChart ticks={website.uptimeTicks} />
                            </div>

                            {/* Stats row */}
                            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                                <div className="glass-surface rounded-lg p-3">
                                    <div className="flex items-center gap-1.5 text-slate-400 mb-1">
                                        <Zap className="w-3 h-3" />
                                        <span className="text-[10px] font-medium uppercase tracking-wider">
                                            Avg Latency
                                        </span>
                                    </div>
                                    <p className="text-sm font-semibold text-white">
                                        {website.avgLatency > 0
                                            ? `${website.avgLatency}ms`
                                            : "N/A"}
                                    </p>
                                </div>

                                <div className="glass-surface rounded-lg p-3">
                                    <div className="flex items-center gap-1.5 text-slate-400 mb-1">
                                        <Clock className="w-3 h-3" />
                                        <span className="text-[10px] font-medium uppercase tracking-wider">
                                            Last Check
                                        </span>
                                    </div>
                                    <p className="text-sm font-semibold text-white">
                                        {website.lastChecked}
                                    </p>
                                </div>

                                <div className="glass-surface rounded-lg p-3 col-span-2 sm:col-span-1">
                                    <div className="flex items-center gap-1.5 text-slate-400 mb-1">
                                        <span className="text-[10px] font-medium uppercase tracking-wider">
                                            Uptime
                                        </span>
                                    </div>
                                    <p
                                        className={`text-sm font-semibold ${website.uptimePercentage >= 99
                                                ? "text-emerald-400"
                                                : website.uptimePercentage >= 95
                                                    ? "text-yellow-400"
                                                    : "text-red-400"
                                            }`}
                                    >
                                        {website.uptimePercentage.toFixed(2)}%
                                    </p>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
