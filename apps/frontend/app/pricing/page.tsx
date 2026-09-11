"use client";

import { useAuth, useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import axios from "axios";
import { Check, Sparkles } from "lucide-react";

export default function PricingPage() {
  const { getToken, isLoaded, isSignedIn } = useAuth();
  const { user } = useUser();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [isPro, setIsPro] = useState(false);
  const [fetchingStatus, setFetchingStatus] = useState(true);

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
      setFetchingStatus(false);
    };

    fetchUserStatus();
  }, [isLoaded, isSignedIn, getToken]);

  const handleUpgrade = async () => {
    if (!isLoaded) return;
    if (!isSignedIn || !user) {
      alert("Please sign in to upgrade");
      return;
    }

    setLoading(true);
    try {
      const token = await getToken();
      const email = user.primaryEmailAddress?.emailAddress || "";

      const response = await axios.post(
        "http://localhost:8080/api/v1/subscription/create",
        { email },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      const clientSecret = response.data.clientSecret;
      if (clientSecret) {
        router.push(`/checkout?client_secret=${clientSecret}`);
      } else {
        alert("Could not initialize checkout.");
        setLoading(false);
      }
    } catch (error: any) {
      alert(
        error.response?.data?.error || error.message || "Something went wrong"
      );
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white flex flex-col items-center justify-center p-4 selection:bg-emerald-500/30">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-[20%] -left-[10%] w-[50%] h-[50%] rounded-full bg-emerald-500/10 blur-[120px]" />
        <div className="absolute top-[60%] -right-[10%] w-[40%] h-[40%] rounded-full bg-blue-500/10 blur-[100px]" />
      </div>

      <div className="relative z-10 text-center mb-16 mt-12">
        <h1 className="text-5xl md:text-6xl font-extrabold tracking-tight mb-6 bg-clip-text text-transparent bg-gradient-to-r from-emerald-400 to-cyan-400">
          Simple, transparent pricing
        </h1>
        <p className="text-lg md:text-xl text-slate-400 max-w-2xl mx-auto">
          Start with a 1-month free trial, then $10/month. Cancel anytime.
        </p>
      </div>

      <div className="relative z-10 w-full max-w-lg mb-20">
        <div className="relative bg-slate-900/50 backdrop-blur-xl border border-slate-700/50 rounded-3xl p-8 md:p-12 shadow-2xl overflow-hidden group">
          
          <div className="absolute inset-0 bg-gradient-to-b from-emerald-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

          <div className="flex justify-between items-start mb-8">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 text-sm font-medium mb-4 border border-emerald-500/20">
                <Sparkles className="w-4 h-4" />
                Recommended
              </div>
              <h2 className="text-3xl font-bold text-white mb-2">UpFlux Pro</h2>
            </div>
          </div>

          <div className="flex items-baseline gap-2 mb-8 border-b border-slate-800 pb-8">
            <span className="text-6xl font-extrabold">$10</span>
            <span className="text-slate-400 font-medium">/ month</span>
          </div>

          <ul className="space-y-5 mb-10">
            {[
              "1 Month Free Trial",
              "Unlimited website monitoring",
              "Real-time instant alerts",
              "Global validator network",
              "Priority support"
            ].map((feature, i) => (
              <li key={i} className="flex items-center gap-4">
                <div className="flex-shrink-0 w-6 h-6 rounded-full bg-emerald-500/20 flex items-center justify-center">
                  <Check className="w-4 h-4 text-emerald-500" />
                </div>
                <span className="text-slate-300 font-medium">{feature}</span>
              </li>
            ))}
          </ul>

          {fetchingStatus ? (
            <div className="w-full bg-slate-800 animate-pulse h-14 rounded-xl"></div>
          ) : (
            <button
              onClick={isPro ? () => router.push("/dashboard") : handleUpgrade}
              disabled={loading}
              className={`w-full py-4 rounded-xl font-bold text-lg transition-all duration-300 shadow-lg flex items-center justify-center gap-2 ${
                isPro
                  ? "bg-slate-800 hover:bg-slate-700 text-white border border-slate-700"
                  : "bg-gradient-to-r from-emerald-500 to-emerald-400 hover:from-emerald-400 hover:to-emerald-300 text-slate-950 hover:shadow-emerald-500/25 hover:-translate-y-0.5"
              } disabled:opacity-50 disabled:hover:translate-y-0`}
            >
              {loading
                ? "Processing..."
                : isPro
                ? "Current Plan (Go to Dashboard)"
                : "Start 1-Month Free Trial"}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
