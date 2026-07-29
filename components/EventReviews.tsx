"use client";

import { useState } from "react";
import { createReview } from "@/lib/actions/review.actions";
import { useRouter } from "next/navigation";

interface Review {
    _id: string;
    userName: string;
    rating: number;
    comment: string;
    createdAt: string;
}

export default function EventReviews({
    eventId,
    slug,
    reviews,
    avgRating,
    totalReviews,
    hasBooking,
    hasReviewed,
}: {
    eventId: string;
    slug: string;
    reviews: Review[];
    avgRating: number;
    totalReviews: number;
    hasBooking: boolean;
    hasReviewed: boolean;
}) {
    const router = useRouter();
    const [rating, setRating] = useState(5);
    const [comment, setComment] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState("");

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        setError("");

        const { success, error: err } = await createReview({
            eventId,
            slug,
            rating,
            comment,
        });

        setIsSubmitting(false);

        if (success) {
            setComment("");
            setRating(5);
            router.refresh();
        } else {
            setError(err || "Failed to submit review");
        }
    };

    const renderStars = (value: number, interactive = false, onRate?: (r: number) => void) => (
        <div className="flex gap-1">
            {[1, 2, 3, 4, 5].map((star) => (
                <button
                    key={star}
                    type="button"
                    onClick={() => interactive && onRate?.(star)}
                    disabled={!interactive}
                    className={`text-lg transition-all duration-200 ${interactive ? "cursor-pointer hover:scale-125" : "cursor-default"} ${star <= value ? "text-yellow-400 drop-shadow-[0_0_6px_rgba(250,204,21,0.4)]" : "text-white/10"
                        }`}
                >
                    ★
                </button>
            ))}
        </div>
    );

    return (
        <section className="mt-16 pt-10 border-t border-white/[0.06]">
            <div className="flex items-center gap-3 mb-8">
                <div className="w-10 h-10 rounded-xl bg-yellow-500/10 flex items-center justify-center">
                    <svg className="w-5 h-5 text-yellow-400" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                    </svg>
                </div>
                <div>
                    <h2 className="text-xl font-bold text-white">
                        Reviews {totalReviews > 0 && <span className="text-light-200/40 text-base font-normal">({totalReviews})</span>}
                    </h2>
                </div>
            </div>

            {totalReviews > 0 && (
                <div className="flex items-center gap-5 mb-10 p-5 rounded-xl bg-white/[0.02] border border-white/[0.06]">
                    <div className="text-5xl font-bold text-gradient">{avgRating}</div>
                    <div>
                        {renderStars(Math.round(avgRating))}
                        <p className="text-light-200/40 text-sm mt-1">Average rating</p>
                    </div>
                </div>
            )}

            {hasBooking && !hasReviewed && (
                <form onSubmit={handleSubmit} className="mb-10 p-6 rounded-xl bg-white/[0.02] border border-white/[0.06] hover:border-indigo-500/20 transition-colors">
                    <h3 className="text-lg font-bold text-white mb-5 flex items-center gap-2">
                        <span className="w-8 h-8 rounded-lg bg-indigo-500/10 text-indigo-400 flex items-center justify-center text-sm">✍️</span>
                        Write a Review
                    </h3>

                    <div className="mb-4">
                        <p className="text-sm text-light-200/50 mb-2">Your rating</p>
                        {renderStars(rating, true, setRating)}
                    </div>

                    <textarea
                        value={comment}
                        onChange={(e) => setComment(e.target.value)}
                        placeholder="Share your experience with this event..."
                        maxLength={500}
                        rows={3}
                        required
                        className="w-full p-4 bg-dark-200/30 rounded-xl text-white placeholder-light-200/20 focus:outline-none focus:border-indigo-500/50 focus:ring-2 focus:ring-indigo-500/10 border border-white/[0.06] transition-all text-sm resize-none"
                    />

                    <div className="flex justify-between items-center mt-4">
                        <span className="text-xs text-light-200/30">{comment.length}/500</span>
                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="px-6 py-2.5 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white rounded-lg transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] text-sm font-medium disabled:opacity-50 flex items-center gap-2"
                        >
                            {isSubmitting && <div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />}
                            {isSubmitting ? "Submitting..." : "Submit Review"}
                        </button>
                    </div>

                    {error && (
                        <div className="flex items-center gap-2 mt-3 p-3 bg-red-500/10 border border-red-500/20 rounded-lg">
                            <svg className="w-4 h-4 text-red-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            <p className="text-red-400 text-xs">{error}</p>
                        </div>
                    )}
                </form>
            )}

            {!hasBooking && (
                <div className="mb-10 p-5 rounded-xl bg-white/[0.02] border border-white/[0.06] flex items-center gap-3">
                    <svg className="w-5 h-5 text-light-200/20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <p className="text-light-200/40 text-sm">Book this event to leave a review</p>
                </div>
            )}

            <div className="space-y-4">
                {reviews.map((review) => (
                    <div key={review._id} className="p-5 rounded-xl bg-white/[0.02] border border-white/[0.06] hover:border-white/[0.1] transition-colors">
                        <div className="flex items-center justify-between mb-3">
                            <div className="flex items-center gap-3">
                                <div className="w-9 h-9 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white text-sm font-bold">
                                    {review.userName.charAt(0).toUpperCase()}
                                </div>
                                <div>
                                    <span className="font-semibold text-white text-sm">{review.userName}</span>
                                    <p className="text-light-200/30 text-[11px]">{new Date(review.createdAt).toLocaleDateString(undefined, { year: "numeric", month: "short", day: "numeric" })}</p>
                                </div>
                            </div>
                            {renderStars(review.rating)}
                        </div>
                        <p className="text-light-200/70 text-sm leading-relaxed pl-12">{review.comment}</p>
                    </div>
                ))}
            </div>
        </section>
    );
}