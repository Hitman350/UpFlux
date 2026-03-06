"use client";

import React from "react";
import { Activity, ArrowUp, AlertTriangle } from "lucide-react";

interface DashboardStatsProps {
    totalMonitored: number;
    averageUptime: number;
    issueCount: number;
    pausedCount: number;
}

export function DashboardStats({
    totalMonitored,
    averageUptime,
    issueCount,
    pausedCount,
}: DashboardStatsProps) {
    const stats = [
        {
            label: "Monitoring",
            value: totalMonitored,
            suffix: pausedCount > 0 ? `(${pausedCount} paused)` : "",
            icon: <Activity className="w-5 h-5" />,
            color: "text-emerald-400",
            bgGlow: "from-emerald-500/20 to-emerald-500/0",
        },
        {
            label: "Avg Uptime",
            value: `${averageUptime.toFixed(1)}%`,
            suffix: "",
            icon: <ArrowUp className="w-5 h-5" />,
            color: averageUptime >= 99 ? "text-emerald-400" : averageUptime >= 95 ? "text-yellow-400" : "text-red-400",
            bgGlow: averageUptime >= 99 ? "from-emerald-500/20 to-emerald-500/0" : averageUptime >= 95 ? "from-yellow-500/20 to-yellow-500/0" : "from-red-500/20 to-red-500/0",
        },
        {
            label: "Issues",
            value: issueCount,
            suffix: "",
            icon: <AlertTriangle className="w-5 h-5" />,
            color: issueCount === 0 ? "text-emerald-400" : "text-red-400",
            bgGlow: issueCount === 0 ? "from-emerald-500/20 to-emerald-500/0" : "from-red-500/20 to-red-500/0",
        },
    ];

    return (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
            {stats.map((stat) => (
                <div
                    key={stat.label}
                    className="glass-surface rounded-xl p-5 relative overflow-hidden group hover:scale-[1.02] transition-transform duration-200"
                >
                    {/* Glow accent */}
                    <div
                        className={`absolute inset-0 bg-gradient-to-br ${stat.bgGlow} opacity-0 group-hover:opacity-100 transition-opacity duration-300`}
                    />

                    <div className="relative flex items-center justify-between">
                        <div>
                            <p className="text-sm text-slate-400 font-medium mb-1">
                                {stat.label}
                            </p>
                            <div className="flex items-baseline gap-2">
                                <span className={`text-2xl font-bold ${stat.color}`}>
                                    {stat.value}
                                </span>
                                {stat.suffix && (
                                    <span className="text-xs text-slate-500">{stat.suffix}</span>
                                )}
                            </div>
                        </div>
                        <div className={`${stat.color} opacity-60`}>{stat.icon}</div>
                    </div>
                </div>
            ))}
        </div>
    );
}
