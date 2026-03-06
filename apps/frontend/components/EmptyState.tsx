"use client";

import React from "react";
import { Globe, Plus } from "lucide-react";

interface EmptyStateProps {
    onAddWebsite: () => void;
}

export function EmptyState({ onAddWebsite }: EmptyStateProps) {
    return (
        <div className="flex flex-col items-center justify-center py-24 animate-fade-in">
            {/* Glow background */}
            <div className="relative mb-8">
                <div className="absolute inset-0 bg-emerald-500/20 rounded-full blur-3xl scale-150" />
                <div className="relative glass-surface rounded-full p-6">
                    <Globe className="w-12 h-12 text-emerald-400" />
                </div>
            </div>

            <h3 className="text-xl font-semibold text-white mb-2">
                No websites monitored yet
            </h3>
            <p className="text-slate-400 text-sm mb-8 text-center max-w-sm">
                Start monitoring your first website to track uptime, response times, and get instant alerts when something goes wrong.
            </p>

            <button
                onClick={onAddWebsite}
                className="flex items-center gap-2 px-6 py-3 bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl font-semibold transition-all duration-200 hover:scale-105 hover:shadow-lg hover:shadow-emerald-500/25"
            >
                <Plus className="w-5 h-5" />
                Add Your First Website
            </button>
        </div>
    );
}
