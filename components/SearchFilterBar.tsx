"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

export default function SearchFilterBar({
    initialSearch = "",
    initialTag = "",
    initialMode = "",
    initialDateFilter = "",
}: {
    initialSearch?: string;
    initialTag?: string;
    initialMode?: string;
    initialDateFilter?: string;
}) {
    const router = useRouter();
    const searchParams = useSearchParams();

    const [search, setSearch] = useState(initialSearch);
    const [tag, setTag] = useState(initialTag);
    const [mode, setMode] = useState(initialMode);
    const [dateFilter, setDateFilter] = useState(initialDateFilter);

    const applyFilters = () => {
        const params = new URLSearchParams(searchParams.toString());

        if (search.trim()) params.set("search", search.trim());
        else params.delete("search");

        if (tag) params.set("tag", tag);
        else params.delete("tag");

        if (mode) params.set("mode", mode);
        else params.delete("mode");

        if (dateFilter) params.set("dateFilter", dateFilter);
        else params.delete("dateFilter");

        params.delete("page");

        router.push(`/events?${params.toString()}`);
    };

    const clearFilters = () => {
        setSearch("");
        setTag("");
        setMode("");
        setDateFilter("");
        router.push("/events");
    };

    const hasFilters = search || tag || mode || dateFilter;

    const selectClass = "px-4 py-2.5 bg-dark-200/50 border border-white/[0.08] rounded-lg text-white text-sm focus:outline-none focus:border-indigo-500/50 focus:ring-2 focus:ring-indigo-500/10 transition-all cursor-pointer appearance-none";
    const inputClass = "flex-1 px-4 py-2.5 bg-dark-200/50 border border-white/[0.08] rounded-lg text-white placeholder-light-200/30 focus:outline-none focus:border-indigo-500/50 focus:ring-2 focus:ring-indigo-500/10 transition-all text-sm";

    return (
        <div className="glass-strong rounded-xl p-5 mb-8">
            <div className="flex flex-col md:flex-row gap-3">
                {/* Search Input */}
                <div className="relative flex-1">
                    <svg className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-light-200/30" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                    <input
                        type="text"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        onKeyDown={(e) => e.key === "Enter" && applyFilters()}
                        placeholder="Search events..."
                        className={`${inputClass} pl-10`}
                    />
                </div>

                {/* Tag Filter */}
                <div className="relative">
                    <select value={tag} onChange={(e) => setTag(e.target.value)} className={selectClass}>
                        <option value="">All Tags</option>
                        <option value="react">React</option>
                        <option value="nextjs">Next.js</option>
                        <option value="javascript">JavaScript</option>
                        <option value="typescript">TypeScript</option>
                        <option value="nodejs">Node.js</option>
                        <option value="python">Python</option>
                        <option value="ai">AI</option>
                        <option value="cloud">Cloud</option>
                        <option value="devops">DevOps</option>
                    </select>
                </div>

                {/* Mode Filter */}
                <div className="relative">
                    <select value={mode} onChange={(e) => setMode(e.target.value)} className={selectClass}>
                        <option value="">All Modes</option>
                        <option value="online">Online</option>
                        <option value="offline">Offline</option>
                        <option value="hybrid">Hybrid</option>
                    </select>
                </div>

                {/* Date Filter */}
                <div className="relative">
                    <select value={dateFilter} onChange={(e) => setDateFilter(e.target.value)} className={selectClass}>
                        <option value="">All Dates</option>
                        <option value="upcoming">Upcoming</option>
                        <option value="past">Past</option>
                        <option value="today">Today</option>
                    </select>
                </div>

                {/* Search Button */}
                <button
                    onClick={applyFilters}
                    className="px-6 py-2.5 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white rounded-lg transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] font-medium text-sm shadow-lg shadow-indigo-500/20 flex items-center justify-center gap-2"
                >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                    Search
                </button>

                {/* Clear Button */}
                {hasFilters && (
                    <button
                        onClick={clearFilters}
                        className="px-4 py-2.5 text-light-200/50 hover:text-white border border-white/[0.06] hover:border-white/[0.12] rounded-lg transition-all duration-300 text-sm font-medium flex items-center gap-2"
                    >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                        Clear
                    </button>
                )}
            </div>

            {/* Active Filters */}
            {hasFilters && (
                <div className="flex flex-wrap gap-2 mt-4 pt-4 border-t border-white/[0.06]">
                    <span className="text-xs text-light-200/40 uppercase tracking-wider font-medium">Active:</span>
                    {search && (
                        <span className="text-xs px-2.5 py-1 rounded-full bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 flex items-center gap-1">
                            Search: {search}
                        </span>
                    )}
                    {tag && (
                        <span className="text-xs px-2.5 py-1 rounded-full bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 flex items-center gap-1 capitalize">
                            Tag: {tag}
                        </span>
                    )}
                    {mode && (
                        <span className="text-xs px-2.5 py-1 rounded-full bg-purple-500/10 text-purple-400 border border-purple-500/20 flex items-center gap-1 capitalize">
                            Mode: {mode}
                        </span>
                    )}
                    {dateFilter && (
                        <span className="text-xs px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 flex items-center gap-1 capitalize">
                            Date: {dateFilter}
                        </span>
                    )}
                </div>
            )}
        </div>
    );
}