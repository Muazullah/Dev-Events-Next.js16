"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { cancelBooking } from "@/lib/actions/booking.actions";

interface BookingEvent {
    _id: string;
    title: string;
    slug: string;
    image: string;
    date: string;
    time: string;
    location: string;
}

interface Booking {
    _id: string;
    eventId: BookingEvent | null;
    status: string;
    createdAt: string;
}

export default function MyBookingsList({ bookings }: { bookings: Booking[] }) {
    const router = useRouter();
    const [cancellingId, setCancellingId] = useState<string | null>(null);

    const handleCancel = async (bookingId: string) => {
        setCancellingId(bookingId);
        const { success, error } = await cancelBooking(bookingId);

        if (success) {
            router.refresh();
        } else {
            alert(error || "Failed to cancel");
            setCancellingId(null);
        }
    };

    const validBookings = bookings.filter((booking) => booking.eventId !== null);

    if (validBookings.length === 0) {
        return (
            <div className="text-center py-20">
                <div className="w-20 h-20 bg-dark-200/50 rounded-full flex items-center justify-center mx-auto mb-6 border border-white/[0.06]">
                    <svg className="w-10 h-10 text-light-200/20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                    </svg>
                </div>
                <h3 className="text-xl font-bold text-white mb-2">No bookings yet</h3>
                <p className="text-light-200/40 text-sm max-w-md mx-auto mb-6">You have not booked any events yet. Browse our upcoming events and secure your spot!</p>
                <Link href="/events" className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl text-sm font-medium hover:scale-[1.02] transition-transform">
                    Browse Events
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                    </svg>
                </Link>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {validBookings.map((booking) => {
                const event = booking.eventId!;
                return (
                    <div
                        key={booking._id}
                        className="glass-strong rounded-xl overflow-hidden flex flex-col sm:flex-row group hover:border-indigo-500/20 transition-all duration-500"
                    >
                        <div className="relative w-full sm:w-52 h-52 sm:h-auto flex-shrink-0 overflow-hidden">
                            <Image
                                src={event.image}
                                alt={event.title}
                                fill
                                className="object-cover transition-transform duration-700 group-hover:scale-110"
                            />
                            <div className="absolute inset-0 bg-gradient-to-r from-transparent to-dark-100/20" />
                        </div>

                        <div className="flex-1 p-6 flex flex-col justify-between">
                            <div>
                                <div className="flex items-center justify-between mb-3">
                                    <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-400 bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/20">
                                        Confirmed
                                    </span>
                                    <span className="text-xs text-light-200/30">
                                        Booked {new Date(booking.createdAt).toLocaleDateString()}
                                    </span>
                                </div>

                                <h3 className="text-xl font-bold mb-3 group-hover:text-indigo-400 transition-colors">
                                    <Link href={`/events/${event.slug}`} className="hover:underline decoration-indigo-500/50 underline-offset-4">
                                        {event.title}
                                    </Link>
                                </h3>

                                <div className="flex flex-wrap gap-4 text-sm text-light-200/50">
                                    <div className="flex items-center gap-2">
                                        <div className="w-7 h-7 rounded-lg bg-indigo-500/10 flex items-center justify-center">
                                            <svg className="w-3.5 h-3.5 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                            </svg>
                                        </div>
                                        {event.date}
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <div className="w-7 h-7 rounded-lg bg-cyan-500/10 flex items-center justify-center">
                                            <svg className="w-3.5 h-3.5 text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                            </svg>
                                        </div>
                                        {event.time}
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <div className="w-7 h-7 rounded-lg bg-purple-500/10 flex items-center justify-center">
                                            <svg className="w-3.5 h-3.5 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                            </svg>
                                        </div>
                                        {event.location}
                                    </div>
                                </div>
                            </div>

                            <div className="flex gap-3 mt-5 pt-5 border-t border-white/[0.04]">
                                <Link
                                    href={`/events/${event.slug}`}
                                    className="flex-1 text-center py-2.5 bg-indigo-600/80 hover:bg-indigo-600 text-white rounded-lg transition-all duration-300 font-medium text-sm flex items-center justify-center gap-2 hover:scale-[1.02]"
                                >
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                    </svg>
                                    View Event
                                </Link>
                                <button
                                    onClick={() => handleCancel(booking._id)}
                                    disabled={cancellingId === booking._id}
                                    className="flex-1 py-2.5 border border-red-500/20 text-red-400/70 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-all duration-300 font-medium text-sm flex items-center justify-center gap-2 disabled:opacity-50"
                                >
                                    {cancellingId === booking._id ? (
                                        <>
                                            <div className="w-3.5 h-3.5 border-2 border-red-400/30 border-t-red-400 rounded-full animate-spin" />
                                            Cancelling...
                                        </>
                                    ) : (
                                        <>
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                            </svg>
                                            Cancel
                                        </>
                                    )}
                                </button>
                            </div>
                        </div>
                    </div>
                );
            })}
        </div>
    );
}