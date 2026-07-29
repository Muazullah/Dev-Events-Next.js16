import { Suspense } from "react";
import { headers } from "next/headers";
import EventCard from "@/components-temp/EventCard";
import SearchFilterBar from "../../components-temp/SearchFilterBar";
import Pagination from "../../components-temp/Pagination";
import { IEvent } from "@/database";
import { getAllEvents } from "@/lib/actions/event.actions";

interface EventsPageProps {
    searchParams: Promise<{
        search?: string;
        tag?: string;
        mode?: string;
        dateFilter?: string;
        page?: string;
    }>;
}

async function EventsGrid({
    search,
    tag,
    mode,
    dateFilter,
    page
}: {
    search?: string;
    tag?: string;
    mode?: string;
    dateFilter?: string;
    page?: string;
}) {
    await headers();
    const allEvents = await getAllEvents();

    let filteredEvents = allEvents;

    if (search) {
        const searchLower = search.toLowerCase();
        filteredEvents = filteredEvents.filter((event: IEvent) =>
            event.title.toLowerCase().includes(searchLower) ||
            event.description.toLowerCase().includes(searchLower)
        );
    }

    if (tag) {
        filteredEvents = filteredEvents.filter((event: IEvent) =>
            event.tags.some((t: string) => t.toLowerCase() === tag.toLowerCase())
        );
    }

    if (mode && ["online", "offline", "hybrid"].includes(mode)) {
        filteredEvents = filteredEvents.filter((event: IEvent) => event.mode === mode);
    }

    const today = new Date().toISOString().split("T")[0];
    if (dateFilter === "upcoming") {
        filteredEvents = filteredEvents.filter((event: IEvent) => event.date >= today);
    } else if (dateFilter === "past") {
        filteredEvents = filteredEvents.filter((event: IEvent) => event.date < today);
    } else if (dateFilter === "today") {
        filteredEvents = filteredEvents.filter((event: IEvent) => event.date === today);
    }

    const currentPage = Math.max(1, parseInt(page || "1", 10));
    const limit = 9;
    const totalCount = filteredEvents.length;
    const totalPages = Math.ceil(totalCount / limit) || 1;
    const skip = (currentPage - 1) * limit;
    const paginatedEvents = filteredEvents.slice(skip, skip + limit);

    if (!paginatedEvents || paginatedEvents.length === 0) {
        return (
            <div className="text-center py-20">
                <div className="w-16 h-16 bg-dark-200/50 rounded-full flex items-center justify-center mx-auto mb-4 border border-white/[0.06]">
                    <svg className="w-8 h-8 text-light-200/20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                </div>
                <h3 className="text-xl font-bold text-white mb-2">No events found</h3>
                <p className="text-light-200/40 text-sm">Try different search terms or filters.</p>
            </div>
        );
    }

    return (
        <>
            <ul className="events">
                {paginatedEvents.map((event: IEvent) => (
                    <li key={event.slug}>
                        <EventCard {...event} />
                    </li>
                ))}
            </ul>
            <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                totalCount={totalCount}
                search={search}
                tag={tag}
                mode={mode}
            />
        </>
    );
}

function EventsSkeleton() {
    return (
        <div className="events">
            {[1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className="flex flex-col gap-3">
                    <div className="h-[300px] bg-dark-200/50 rounded-xl animate-pulse border border-white/[0.04]" />
                    <div className="h-4 bg-dark-200/50 rounded w-3/4 animate-pulse" />
                    <div className="h-3 bg-dark-200/50 rounded w-1/2 animate-pulse" />
                </div>
            ))}
        </div>
    );
}

export default async function EventsPage({ searchParams }: EventsPageProps) {
    await headers();
    const params = await searchParams;

    return (
        <section className="mt-20">
            <div className="mb-8">
                <h1 className="text-3xl font-bold mb-2">All Events</h1>
                <p className="text-light-200/50 text-sm">Discover and book amazing developer events</p>
            </div>

            <SearchFilterBar
                initialSearch={params.search}
                initialTag={params.tag}
                initialMode={params.mode}
                initialDateFilter={params.dateFilter}
            />

            <Suspense fallback={<EventsSkeleton />}>
                <EventsGrid
                    search={params.search}
                    tag={params.tag}
                    mode={params.mode}
                    dateFilter={params.dateFilter}
                    page={params.page}
                />
            </Suspense>
        </section>
    );
}