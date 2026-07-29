"use client";

import { useState, useEffect } from "react";
import { loadStripe } from "@stripe/stripe-js";
import {
    Elements,
    PaymentElement,
    useStripe,
    useElements,
} from "@stripe/react-stripe-js";
import { createPaymentIntent } from "@/lib/actions/payment.actions";

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);

function CheckoutForm({ eventId, slug }: { eventId: string; slug: string }) {
    const stripe = useStripe();
    const elements = useElements();
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState("");

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError("");

        if (!stripe || !elements) {
            setError("Payment system not ready. Please wait...");
            setIsLoading(false);
            return;
        }

        const { error: submitError } = await elements.submit();
        if (submitError) {
            setError(submitError.message || "Payment failed");
            setIsLoading(false);
            return;
        }

        const { error: confirmError } = await stripe.confirmPayment({
            elements,
            confirmParams: {
                return_url: `${window.location.origin}/payment/success?slug=${slug}&eventId=${eventId}`,
            },
        });

        if (confirmError) {
            setError(confirmError.message || "Payment failed");
        }

        setIsLoading(false);
    };

    return (
        <form onSubmit={handleSubmit} className="flex flex-col gap-6">
            <div className="p-5 rounded-xl bg-white/[0.02] border border-white/[0.06]">
                <PaymentElement
                    options={{
                        layout: "tabs",
                    }}
                />
            </div>

            {error && (
                <div className="flex items-center gap-3 p-4 bg-red-500/10 border border-red-500/20 rounded-xl">
                    <svg className="w-5 h-5 text-red-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <p className="text-red-400 text-sm">{error}</p>
                </div>
            )}

            <button
                type="submit"
                disabled={isLoading || !stripe}
                className="w-full p-4 bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-400 hover:to-orange-400 text-black font-bold rounded-xl transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 shadow-lg shadow-yellow-500/20 flex items-center justify-center gap-2"
            >
                {isLoading ? (
                    <>
                        <div className="w-5 h-5 border-2 border-black/30 border-t-black rounded-full animate-spin" />
                        Processing...
                    </>
                ) : (
                    <>
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
                        </svg>
                        Pay Now
                    </>
                )}
            </button>
        </form>
    );
}

export default function PaymentForm({
    eventId,
    slug,
}: {
    eventId: string;
    slug: string;
}) {
    const [clientSecret, setClientSecret] = useState("");
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        createPaymentIntent({ eventId, slug }).then((result) => {
            setLoading(false);
            if (result.success && result.clientSecret) {
                setClientSecret(result.clientSecret);
            } else {
                setError(result.error || "Failed to initialize payment");
            }
        });
    }, [eventId, slug]);

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center py-16 gap-4">
                <div className="relative">
                    <div className="w-10 h-10 rounded-full border-2 border-yellow-500/20 border-t-yellow-500 animate-spin" />
                    <div className="absolute inset-0 w-10 h-10 rounded-full border-2 border-orange-500/20 border-t-orange-500 animate-spin" style={{ animationDuration: "1.5s", animationDirection: "reverse" }} />
                </div>
                <p className="text-light-200/40 text-sm animate-pulse">Initializing payment...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex items-center gap-3 p-6 bg-red-500/10 border border-red-500/20 rounded-xl">
                <svg className="w-6 h-6 text-red-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <p className="text-red-400">{error}</p>
            </div>
        );
    }

    return (
        <Elements stripe={stripePromise} options={{ clientSecret }}>
            <CheckoutForm eventId={eventId} slug={slug} />
        </Elements>
    );
}