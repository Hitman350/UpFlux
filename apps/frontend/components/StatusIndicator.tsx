"use client";

import React from "react";

type StatusType = "good" | "bad" | "unknown";

interface StatusIndicatorProps {
    status: StatusType;
    size?: "sm" | "md" | "lg";
}

export function StatusIndicator({ status, size = "md" }: StatusIndicatorProps) {
    const sizeClasses = {
        sm: "w-2 h-2",
        md: "w-3 h-3",
        lg: "w-4 h-4",
    };

    const colorClasses = {
        good: "bg-emerald-500 animate-pulse-green",
        bad: "bg-red-500 animate-pulse-red",
        unknown: "bg-slate-500",
    };

    return (
        <div className="relative flex items-center justify-center">
            <div
                className={`${sizeClasses[size]} rounded-full ${colorClasses[status]}`}
            />
        </div>
    );
}
