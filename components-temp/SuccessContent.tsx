'use client';

import { useState, useEffect, useCallback } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { createBooking } from '@/lib/actions/booking.actions';

export default function SuccessContent() {
    const searchParams = useSearchParams();
    const slug = searchParams.get('slug');
    const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
    const [message, setMessage] = useState('');

    const confirmBooking = useCallback(async () => {
        if (!slug) {
            setStatus('error');
            setMessage('Invalid request');
            return;
        }

        const eventId = searchParams.get('eventId');

        if (eventId) {
            const result = await createBooking({ eventId, slug });
            if (result.success || result.error === 'Already booked for this event') {
                setStatus('success');
            } else {
                setStatus('error');
                setMessage(result.error || 'Booking failed');
            }
        } else {
            setStatus('success');
        }
    }, [slug, searchParams]);

    useEffect(() => {
        confirmBooking();
    }, [confirmBooking]);

    if (status === 'loading') {
        return (
            <>
                <div className="w-20 h-20 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
                    <div className="w-8 h-8 border-4 border-green-500 border-t-transparent rounded-full animate-spin" />
                </div>
                <h1 className="text-2xl font-bold mb-2">Confirming your booking...</h1>
            </>
        );
    }

    if (status === 'error') {
        return (
            <>
                <div className="w-20 h-20 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
                    <span className="text-4xl">⚠</span>
                </div>
                <h1 className="text-2xl font-bold mb-2 text-red-400">Something went wrong</h1>
                <p className="text-light-200 mb-6">{message}</p>
                <Link href="/" className="inline-block px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                    Go Home
                </Link>
            </>
        );
    }

    return (
        <>
            <div className="w-20 h-20 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-4xl">✓</span>
            </div>
            <h1 className="text-3xl font-bold mb-2 text-green-400">Payment Successful!</h1>
            <p className="text-light-200 mb-8">Your spot has been booked. See you at the event!</p>

            <div className="flex gap-4 justify-center">
                <Link
                    href={`/events/${slug}`}
                    className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                    View Event
                </Link>
                <Link
                    href="/my-bookings"
                    className="px-6 py-3 border border-white/30 text-white rounded-lg hover:bg-white/10"
                >
                    My Bookings
                </Link>
            </div>
        </>
    );
}