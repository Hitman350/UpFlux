"use client";

import React, { useState, useEffect, useRef } from "react";
import { Globe, Loader2, X } from "lucide-react";

interface AddWebsiteModalProps {
    isOpen: boolean;
    onClose: (url: string | null) => void;
}

export function AddWebsiteModal({ isOpen, onClose }: AddWebsiteModalProps) {
    const [url, setUrl] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [validationError, setValidationError] = useState<string | null>(null);
    const inputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        if (isOpen) {
            setUrl("");
            setValidationError(null);
            setIsSubmitting(false);
            // Focus input after animation
            setTimeout(() => inputRef.current?.focus(), 100);
        }
    }, [isOpen]);

    // Keyboard support
    useEffect(() => {
        if (!isOpen) return;
        const handler = (e: KeyboardEvent) => {
            if (e.key === "Escape") onClose(null);
        };
        window.addEventListener("keydown", handler);
        return () => window.removeEventListener("keydown", handler);
    }, [isOpen, onClose]);

    const validateUrl = (value: string): boolean => {
        if (!value.trim()) {
            setValidationError("URL is required");
            return false;
        }
        try {
            const urlObj = new URL(value.startsWith("http") ? value : `https://${value}`);
            if (!urlObj.hostname.includes(".")) {
                setValidationError("Please enter a valid domain");
                return false;
            }
            setValidationError(null);
            return true;
        } catch {
            setValidationError("Please enter a valid URL");
            return false;
        }
    };

    const handleSubmit = async () => {
        const finalUrl = url.startsWith("http") ? url : `https://${url}`;
        if (!validateUrl(finalUrl)) return;
        setIsSubmitting(true);
        onClose(finalUrl);
    };

    if (!isOpen) return null;

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-fade-in-backdrop"
            onClick={(e) => { if (e.target === e.currentTarget) onClose(null); }}
        >
            {/* Backdrop */}
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />

            {/* Modal */}
            <div className="relative w-full max-w-md glass-surface-strong rounded-2xl p-6 shadow-2xl animate-fade-in">
                {/* Close button */}
                <button
                    onClick={() => onClose(null)}
                    className="absolute top-4 right-4 p-1 text-slate-400 hover:text-white transition-colors rounded-lg hover:bg-white/10"
                >
                    <X className="w-5 h-5" />
                </button>

                {/* Header */}
                <div className="flex items-center gap-3 mb-6">
                    <div className="p-2 rounded-xl bg-emerald-500/10 border border-emerald-500/20">
                        <Globe className="w-5 h-5 text-emerald-400" />
                    </div>
                    <div>
                        <h2 className="text-lg font-semibold text-white">Add Website</h2>
                        <p className="text-xs text-slate-400">Enter the URL you'd like to monitor</p>
                    </div>
                </div>

                {/* Input */}
                <div className="mb-6">
                    <label className="block text-sm font-medium text-slate-300 mb-2">
                        Website URL
                    </label>
                    <input
                        ref={inputRef}
                        type="url"
                        className={`w-full px-4 py-3 rounded-xl bg-white/5 border text-white placeholder-slate-500 outline-none transition-all duration-200 focus:ring-2 ${validationError
                                ? "border-red-500/50 focus:ring-red-500/30"
                                : "border-white/10 focus:border-emerald-500/50 focus:ring-emerald-500/30"
                            }`}
                        placeholder="https://example.com"
                        value={url}
                        onChange={(e) => {
                            setUrl(e.target.value);
                            if (validationError) validateUrl(e.target.value);
                        }}
                        onKeyDown={(e) => {
                            if (e.key === "Enter") handleSubmit();
                        }}
                    />
                    {validationError && (
                        <p className="text-red-400 text-xs mt-1.5 animate-slide-up">{validationError}</p>
                    )}
                </div>

                {/* Actions */}
                <div className="flex justify-end gap-3">
                    <button
                        onClick={() => onClose(null)}
                        className="px-4 py-2.5 text-sm font-medium text-slate-300 hover:text-white hover:bg-white/10 rounded-xl transition-all duration-200"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleSubmit}
                        disabled={isSubmitting || !url.trim()}
                        className="px-5 py-2.5 text-sm font-semibold text-white bg-emerald-500 hover:bg-emerald-600 rounded-xl transition-all duration-200 disabled:opacity-40 disabled:cursor-not-allowed hover:shadow-lg hover:shadow-emerald-500/25 flex items-center gap-2"
                    >
                        {isSubmitting ? (
                            <Loader2 className="w-4 h-4 animate-spin" />
                        ) : null}
                        Add Website
                    </button>
                </div>
            </div>
        </div>
    );
}
