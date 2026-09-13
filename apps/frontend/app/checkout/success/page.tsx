"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { loadStripe } from "@stripe/stripe-js";
import { CheckCircle } from "lucide-react";
import Link from "next/link";

import { useAuth } from "@clerk/nextjs";
import axios from "axios";

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || "pk_test_...");

export default function SuccessPage() {
  const { getToken } = useAuth();
  const searchParams = useSearchParams();
  const setupIntentClientSecret = searchParams.get("setup_intent_client_secret");
  const [status, setStatus] = useState<string | null>("loading");

  useEffect(() => {
    if (!setupIntentClientSecret) {
      setStatus("error");
      return;
    }

    stripePromise.then(async (stripe) => {
      if (!stripe) return;
      const { setupIntent, error } = await stripe.retrieveSetupIntent(setupIntentClientSecret);
      
      if (error) {
        setStatus("error");
      } else if (setupIntent && setupIntent.status === "succeeded") {
        try {
          const token = await getToken();
          await axios.post(
            "http://localhost:8080/api/v1/subscription/verify",
            {},
            { headers: { Authorization: `Bearer ${token}` } }
          );
        } catch (err) {
          console.error("Failed to verify subscription on backend:", err);
        }
        setStatus("success");
      } else {
        setStatus("error");
      }
    });
  }, [setupIntentClientSecret]);

  return (
    <div className="min-h-screen bg-slate-950 text-white flex flex-col items-center justify-center pt-24 pb-12 px-4">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8 max-w-md w-full text-center">
        {status === "loading" && <p className="text-slate-400">Verifying your trial...</p>}
        {status === "error" && <p className="text-red-400">Something went wrong. Please try again.</p>}
        {status === "success" && (
          <>
            <CheckCircle className="w-16 h-16 text-emerald-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold mb-2">Welcome to Pro!</h2>
            <p className="text-slate-400 mb-6 text-sm">
              Your 30-day free trial is now active. You won't be charged until the trial ends.
            </p>
            <Link 
              href="/dashboard"
              className="inline-block w-full bg-emerald-500 hover:bg-emerald-600 text-white font-semibold py-3 rounded-xl transition-all"
            >
              Go to Dashboard
            </Link>
          </>
        )}
      </div>
    </div>
  );
}

