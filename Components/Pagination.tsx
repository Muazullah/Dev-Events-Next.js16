"use client";

import Link from "next/link";

export default function Pagination({
    currentPage,
    totalPages,
    totalCount,
    search,
    tag,
    mode,
}: {
    currentPage: number;
    totalPages: number;
    totalCount: number;
    search?: string;
    tag?: string;
    mode?: string;
}) {
    if (totalPages <= 1) return null;

    const buildHref = (page: number) => {
        const params = new URLSearchParams();
        params.set("page", String(page));
        if (search) params.set("search", search);
        if (tag) params.set("tag", tag);
        if (mode) params.set("mode", mode);
        return `/events?${params.toString()}`;
    };

    const getPageNumbers = () => {
        const pages: (number | string)[] = [];
        if (totalPages <= 7) {
            for (let i = 1; i <= totalPages; i++) pages.push(i);
            return pages;
        }
        pages.push(1);
        if (currentPage > 3) pages.push("...");
        const start = Math.max(2, currentPage - 1);
        const end = Math.min(totalPages - 1, currentPage + 1);
        for (let i = start; i <= end; i++) pages.push(i);
        if (currentPage < totalPages - 2) pages.push("...");
        pages.push(totalPages);
        return pages;
    };

    return (
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-12 pt-6 border-t border-white/[0.06]">
            <p className="text-sm text-light-200/40">
                Page <span className="text-white font-medium">{currentPage}</span> of <span className="text-white font-medium">{totalPages}</span>
                <span className="text-light-200/20 mx-2">·</span>
                <span className="text-light-200/30">{totalCount} events</span>
            </p>

            <nav className="flex items-center gap-1.5">
                <Link
                    href={buildHref(currentPage - 1)}
                    className={`flex items-center gap-1 px-3.5 py-2 rounded-lg text-sm font-medium transition-all duration-300 ${currentPage <= 1
                            ? "text-light-200/20 pointer-events-none"
                            : "text-light-200 hover:text-white hover:bg-white/[0.06]"
                        }`}
                >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                    Prev
                </Link>

                {getPageNumbers().map((page, idx) =>
                    page === "..." ? (
                        <span key={`dots-${idx}`} className="px-2 text-light-200/20 text-sm">···</span>
                    ) : (
                        <Link
                            key={page}
                            href={buildHref(page as number)}
                            className={`min-w-[36px] h-9 flex items-center justify-center rounded-lg text-sm font-medium transition-all duration-300 ${currentPage === page
                                    ? "bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg shadow-indigo-500/20"
                                    : "text-light-200 hover:text-white hover:bg-white/[0.06]"
                                }`}
                        >
                            {page}
                        </Link>
                    )
                )}

                <Link
                    href={buildHref(currentPage + 1)}
                    className={`flex items-center gap-1 px-3.5 py-2 rounded-lg text-sm font-medium transition-all duration-300 ${currentPage >= totalPages
                            ? "text-light-200/20 pointer-events-none"
                            : "text-light-200 hover:text-white hover:bg-white/[0.06]"
                        }`}
                >
                    Next
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                </Link>
            </nav>
        </div>
    );
}