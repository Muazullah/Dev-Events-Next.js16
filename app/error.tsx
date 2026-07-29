'use client';

import { useEffect } from 'react';
import Link from 'next/link';

export default function Error({
    error,
    reset,
}: {
    error: Error & { digest?: string };
    reset: () => void;
}) {
    useEffect(() => {
        console.error(error);
    }, [error]);

    return (
        <section className="mt-20 text-center max-w-lg mx-auto px-4">
            <div className="w-24 h-24 bg-red-500/10 rounded-full flex items-center justify-center mx-auto mb-6 border border-red-500/20">
                <svg className="w-12 h-12 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
            </div>
            <h1 className="text-3xl font-bold mb-3">Something went wrong</h1>
            <p className="text-light-200/50 mb-8 text-sm">{error.message}</p>
            <div className="flex gap-3 justify-center">
                <button onClick={reset} className="px-6 py-3 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl transition-all hover:scale-[1.02] text-sm font-medium flex items-center gap-2">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                    </svg>
                    Try Again
                </button>
                <Link href="/" className="px-6 py-3 border border-white/[0.08] text-light-200 hover:text-white hover:bg-white/[0.04] rounded-xl transition-all text-sm font-medium">
                    Back to Home
                </Link>
            </div>
        </section>
    );
}