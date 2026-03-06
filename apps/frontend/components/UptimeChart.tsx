"use client";

import React, { useState } from "react";

type UptimeStatus = "good" | "bad" | "unknown";

interface UptimeChartProps {
    ticks: UptimeStatus[];
    /** Number of minutes each tick represents */
    windowMinutes?: number;
}

export function UptimeChart({ ticks, windowMinutes = 3 }: UptimeChartProps) {
    const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

    const getTimeLabel = (index: number) => {
        const minutesAgo = (ticks.length - index) * windowMinutes;
        const time = new Date(Date.now() - minutesAgo * 60 * 1000);
        return time.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
    };

    const getStatusLabel = (status: UptimeStatus) => {
        switch (status) {
            case "good":
                return "Operational";
            case "bad":
                return "Issue Detected";
            case "unknown":
                return "No Data";
        }
    };

    return (
        <div className="relative">
            <div className="flex gap-1 items-end">
                {ticks.map((tick, index) => (
                    <div
                        key={index}
                        className="relative flex-1 group"
                        onMouseEnter={() => setHoveredIndex(index)}
                        onMouseLeave={() => setHoveredIndex(null)}
                    >
                        {/* Tooltip */}
                        {hoveredIndex === index && (
                            <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 z-10 animate-fade-in pointer-events-none">
                                <div className="glass-surface-strong rounded-lg px-3 py-2 text-xs whitespace-nowrap shadow-xl">
                                    <p className="text-slate-300 font-medium">
                                        {getTimeLabel(index)}
                                    </p>
                                    <p
                                        className={`font-semibold mt-0.5 ${tick === "good"
                                                ? "text-emerald-400"
                                                : tick === "bad"
                                                    ? "text-red-400"
                                                    : "text-slate-500"
                                            }`}
                                    >
                                        {getStatusLabel(tick)}
                                    </p>
                                </div>
                                {/* Arrow */}
                                <div className="w-2 h-2 glass-surface-strong rotate-45 absolute left-1/2 -translate-x-1/2 -bottom-1" />
                            </div>
                        )}

                        {/* Bar */}
                        <div
                            className={`h-8 rounded-md transition-all duration-150 cursor-pointer ${tick === "good"
                                    ? "bg-emerald-500/80 hover:bg-emerald-400"
                                    : tick === "bad"
                                        ? "bg-red-500/80 hover:bg-red-400"
                                        : "bg-slate-700/60 hover:bg-slate-600"
                                } ${hoveredIndex === index ? "scale-y-110 origin-bottom" : ""}`}
                        />
                    </div>
                ))}
            </div>

            {/* Time labels */}
            <div className="flex justify-between mt-1.5">
                <span className="text-[10px] text-slate-500">30 min ago</span>
                <span className="text-[10px] text-slate-500">now</span>
            </div>
        </div>
    );
}
