import Link from "next/link";

export default function NotFound() {
    return (
        <section className="mt-20 text-center max-w-lg mx-auto px-4">
            <div className="w-24 h-24 bg-indigo-500/10 rounded-full flex items-center justify-center mx-auto mb-6 border border-indigo-500/20">
                <span className="text-5xl font-bold text-indigo-400">404</span>
            </div>
            <h1 className="text-2xl font-bold mb-3">Page Not Found</h1>
            <p className="text-light-200/50 mb-8 text-sm">The event or page you are looking for does not exist or may have been moved.</p>
            <Link href="/" className="inline-flex items-center gap-2 px-6 py-3 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl transition-all hover:scale-[1.02] text-sm font-medium">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                </svg>
                Back to Home
            </Link>
        </section>
    );
}