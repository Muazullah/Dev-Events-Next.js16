'use client';

import { useState } from "react";
import { useRouter } from "next/navigation";
import posthog from "posthog-js";
import { createBooking } from "@/lib/actions/booking.actions";
import { joinWaitlist } from "@/lib/actions/waitlist.actions";

const BookEvent = ({
    eventId,
    slug,
    isPaid,
    price,
    currency,
    isFull,
    isBooked
}: {
    eventId: string;
    slug: string;
    isPaid: boolean;
    price: number;
    currency: string;
    isFull: boolean;
    isBooked: boolean;
}) => {
    const router = useRouter();
    const [submitted, setSubmitted] = useState(false);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        if (isPaid) {
            router.push(`/payment/${slug}`);
            return;
        }

        const { success, error: err } = await createBooking({ eventId, slug });

        setLoading(false);

        if (success) {
            setSubmitted(true);
            posthog.capture('event_booked', { eventId, slug, price: 0 });
            router.refresh();
        } else {
            setError(err || 'Booking failed');
            posthog.captureException(new Error(err || 'Booking failed'));
        }
    };

    if (isBooked) {
        return (
            <div className="flex items-center gap-3 p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-xl">
                <div className="w-10 h-10 rounded-full bg-emerald-500/20 flex items-center justify-center flex-shrink-0">
                    <svg className="w-5 h-5 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                </div>
                <div>
                    <p className="text-emerald-400 text-sm font-bold">You're booked!</p>
                    <p className="text-emerald-400/60 text-xs">See you at the event</p>
                </div>
            </div>
        );
    }

    if (isFull) {
        return (
            <div className="flex flex-col gap-4">
                <div className="flex items-center gap-3 p-4 bg-red-500/10 border border-red-500/20 rounded-xl">
                    <div className="w-10 h-10 rounded-full bg-red-500/20 flex items-center justify-center flex-shrink-0">
                        <svg className="w-5 h-5 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                    </div>
                    <div>
                        <p className="text-red-400 text-sm font-bold">Fully Booked</p>
                        <p className="text-red-400/60 text-xs">All spots have been taken</p>
                    </div>
                </div>

                <button
                    onClick={async () => {
                        setLoading(true);
                        const { success, error: err } = await joinWaitlist({ eventId });
                        setLoading(false);
                        if (success) {
                            setSubmitted(true);
                        } else {
                            setError(err || 'Failed to join waitlist');
                        }
                    }}
                    disabled={loading || submitted}
                    className="w-full p-3.5 border border-yellow-500/30 text-yellow-400 rounded-xl hover:bg-yellow-500/10 disabled:opacity-50 transition-all duration-300 text-sm font-medium flex items-center justify-center gap-2"
                >
                    {submitted ? (
                        <>
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                            On Waitlist
                        </>
                    ) : loading ? (
                        <>
                            <div className="w-4 h-4 border-2 border-yellow-400/30 border-t-yellow-400 rounded-full animate-spin" />
                            Joining...
                        </>
                    ) : (
                        <>
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            Join Waitlist
                        </>
                    )}
                </button>
                {error && <p className="text-red-400 text-xs text-center">{error}</p>}
            </div>
        );
    }

    return (
        <div id="book-event">
            {submitted ? (
                <div className="flex items-center gap-3 p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-xl">
                    <div className="w-10 h-10 rounded-full bg-emerald-500/20 flex items-center justify-center flex-shrink-0">
                        <svg className="w-5 h-5 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                    </div>
                    <div>
                        <p className="text-emerald-400 text-sm font-bold">Booking Confirmed!</p>
                        <p className="text-emerald-400/60 text-xs">Check your email for details</p>
                    </div>
                </div>
            ) : (
                <form onSubmit={handleSubmit} className="flex flex-col gap-3">
                    {error && (
                        <div className="flex items-center gap-2 p-3 bg-red-500/10 border border-red-500/20 rounded-xl">
                            <svg className="w-4 h-4 text-red-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            <p className="text-red-400 text-xs">{error}</p>
                        </div>
                    )}

                    <button
                        type="submit"
                        disabled={loading}
                        className={`w-full p-4 rounded-xl font-bold text-sm transition-all duration-300 flex items-center justify-center gap-2 ${isPaid
                            ? 'bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-400 hover:to-orange-400 text-black shadow-lg shadow-yellow-500/20'
                            : 'bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white shadow-lg shadow-indigo-500/20'
                            } disabled:opacity-50 hover:scale-[1.02] active:scale-[0.98]`}
                    >
                        {loading ? (
                            <>
                                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                Processing...
                            </>
                        ) : isPaid ? (
                            <>
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
                                </svg>
                                Pay {currency} {price} & Book
                            </>
                        ) : (
                            <>
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                Book Now — Free
                            </>
                        )}
                    </button>
                </form>
            )}
        </div>
    );
};

export default BookEvent;