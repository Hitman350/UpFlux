"use client";

import { SignedIn, SignedOut, SignInButton, UserButton, useAuth } from "@clerk/nextjs";
import { Activity } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import axios from "axios";

export function Appbar() {
    const { getToken, isLoaded, isSignedIn } = useAuth();
    const [isPro, setIsPro] = useState(false);

    useEffect(() => {
        const fetchUserStatus = async () => {
            if (isLoaded && isSignedIn) {
                try {
                    const token = await getToken();
                    const res = await axios.get("http://localhost:8080/api/v1/user/me", {
                        headers: { Authorization: `Bearer ${token}` },
                    });
                    if (res.data?.user?.plan === "PRO") {
                        setIsPro(true);
                    }
                } catch (error) {
                    console.error("Failed to fetch user status", error);
                }
            }
        };

        fetchUserStatus();
    }, [isLoaded, isSignedIn, getToken]);

    return (
        <nav className="fixed top-0 left-0 right-0 z-50 glass-surface border-b border-white/5">
            {/* Subtle bottom glow */}
            <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-emerald-500/30 to-transparent" />

            <div className="max-w-6xl mx-auto px-4 sm:px-6">
                <div className="flex items-center justify-between h-16">
                    {/* Logo */}
                    <Link href="/" className="flex items-center gap-2.5 group">
                        <div className="p-1.5 rounded-lg bg-emerald-500/10 border border-emerald-500/20 group-hover:bg-emerald-500/20 transition-colors">
                            <Activity className="w-5 h-5 text-emerald-400" />
                        </div>
                        <span className="text-lg font-bold text-white tracking-tight">
                            Up<span className="text-emerald-400">Flux</span>
                        </span>
                        {isPro && (
                            <span className="ml-1 px-1.5 py-0.5 rounded-md bg-gradient-to-r from-amber-400 to-orange-400 text-slate-900 text-[10px] font-black tracking-wide uppercase shadow-lg shadow-amber-500/20">
                                PRO
                            </span>
                        )}
                    </Link>

                    {/* Right side */}
                    <div className="flex items-center gap-4">
                        <SignedIn>
                            <Link
                                href="/dashboard"
                                className="text-sm text-slate-400 hover:text-emerald-400 transition-colors font-medium"
                            >
                                Dashboard
                            </Link>
                            <UserButton
                                appearance={{
                                    elements: {
                                        avatarBox: "w-8 h-8 ring-2 ring-emerald-500/20",
                                    },
                                }}
                            />
                        </SignedIn>
                        <SignedOut>
                            <SignInButton mode="modal">
                                <button className="text-sm text-slate-400 hover:text-white transition-colors font-medium">
                                    Sign In
                                </button>
                            </SignInButton>
                            <SignInButton mode="modal">
                                <button className="px-4 py-2 text-sm font-semibold text-white bg-emerald-500 hover:bg-emerald-600 rounded-xl transition-all duration-200 hover:shadow-lg hover:shadow-emerald-500/25">
                                    Get Started
                                </button>
                            </SignInButton>
                        </SignedOut>
                    </div>
                </div>
            </div>
        </nav>
    );
}