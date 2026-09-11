"use client";

import { useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { loadStripe } from "@stripe/stripe-js";
import {
  Elements,
  PaymentElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";

// Initialize Stripe outside component to avoid recreating it
const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || ""
);

function CheckoutForm() {
  const stripe = useStripe();
  const elements = useElements();

  const [errorMessage, setErrorMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    setLoading(true);

    const { error } = await stripe.confirmSetup({
      elements,
      confirmParams: {
        return_url: `${window.location.origin}/checkout/success`,
      },
    });

    if (error) {
      setErrorMessage(error.message || "An unexpected error occurred.");
    }
    setLoading(false);
  };

  return (
    <form onSubmit={handleSubmit} className="w-full">
      <div className="mb-8">
        <PaymentElement className="min-h-[250px]" />
      </div>
      {errorMessage && (
        <div className="text-rose-400 bg-rose-500/10 border border-rose-500/20 p-3 rounded-lg mb-6 text-sm">
          {errorMessage}
        </div>
      )}
      <button
        type="submit"
        disabled={!stripe || loading}
        className="w-full bg-gradient-to-r from-emerald-500 to-emerald-400 hover:from-emerald-400 hover:to-emerald-300 text-slate-950 font-bold py-4 rounded-xl transition-all shadow-lg hover:shadow-emerald-500/25 disabled:opacity-50 hover:-translate-y-0.5 disabled:hover:translate-y-0 text-lg"
      >
        {loading ? "Processing..." : "Start Trial"}
      </button>
    </form>
  );
}

export default function CheckoutPage() {
  const searchParams = useSearchParams();
  const clientSecret = searchParams.get("client_secret");

  if (!clientSecret) {
    return (
      <div className="min-h-screen bg-slate-950 text-white flex flex-col items-center justify-center selection:bg-emerald-500/30">
        <p className="text-slate-400">Invalid checkout session.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-white flex flex-col items-center justify-center p-4 selection:bg-emerald-500/30">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-[20%] -left-[10%] w-[50%] h-[50%] rounded-full bg-emerald-500/10 blur-[120px]" />
      </div>

      <div className="relative z-10 w-full max-w-xl">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-extrabold mb-2 bg-clip-text text-transparent bg-gradient-to-r from-emerald-400 to-cyan-400">
            Complete Setup
          </h2>
          <p className="text-slate-400">
            Enter your card details to start your 30-day free trial. You won't
            be charged today.
          </p>
        </div>

        <div className="bg-slate-900/50 backdrop-blur-xl border border-slate-700/50 rounded-3xl p-6 md:p-10 shadow-2xl relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-b from-slate-800/20 to-transparent pointer-events-none" />
          
          <Elements
            stripe={stripePromise}
            options={{
              clientSecret,
              appearance: {
                theme: "night",
                variables: {
                  colorPrimary: "#10b981", // emerald-500
                  colorBackground: "#0f172a", // slate-900
                  colorText: "#f8fafc", // slate-50
                  colorDanger: "#fb7185", // rose-400
                  fontFamily: "system-ui, sans-serif",
                  borderRadius: "12px",
                },
                rules: {
                  '.Input': {
                    border: '1px solid #334155', // slate-700
                    boxShadow: 'none',
                  },
                  '.Input:focus': {
                    border: '1px solid #10b981',
                  }
                }
              },
            }}
          >
            <CheckoutForm />
          </Elements>
        </div>
      </div>
    </div>
  );
}
