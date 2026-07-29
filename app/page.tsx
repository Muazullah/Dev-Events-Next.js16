import { Suspense } from "react";
import { headers } from "next/headers";
import EventCard from "@/components/EventCard";
import ExploreBtn from "@/components/ExploreBtn";
import { IEvent } from "@/database";
import { getAllEvents } from "@/lib/actions/event.actions";
import Link from "next/link";

export const metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000"),
  title: "Dev Events — Discover Developer Events",
  description: "The hub for every dev event you mustn't miss",
};

async function EventsGrid() {
  await headers();
  const events = await getAllEvents();

  if (!events || events.length === 0) {
    return (
      <div className="text-center py-20">
        <div className="w-16 h-16 bg-dark-200 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg className="w-8 h-8 text-light-200/50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5" />
          </svg>
        </div>
        <h3 className="text-xl font-bold text-white mb-2">No events yet</h3>
        <p className="text-light-200/60">Check back soon for upcoming developer events!</p>
      </div>
    );
  }

  return (
    <ul className="events">
      {events.map((event: IEvent) => (
        <li key={event.slug} className="animate-fade-in">
          <EventCard {...event} />
        </li>
      ))}
    </ul>
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

export default async function HomePage() {
  await headers();

  return (
    <section className="relative">
      {/* Hero Section */}
      <div className="flex flex-col items-center justify-center min-h-[70vh] text-center px-4">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-sm font-medium mb-6 animate-fade-in">
          <span className="w-2 h-2 rounded-full bg-indigo-400 animate-pulse" />
          Discover Amazing Events
        </div>

        <h1 className="max-w-4xl leading-tight mb-6">
          The Hub for Every
          <br />
          <span className="bg-gradient-to-r from-cyan-400 via-indigo-400 to-purple-400 bg-clip-text text-transparent">
            Developer Event
          </span>
        </h1>

        <p className="text-light-200/70 text-lg max-w-xl leading-relaxed mb-8">
          Discover, book, and attend the best developer conferences, hackathons, and meetups from around the world.
        </p>

        <div className="flex flex-col sm:flex-row gap-4">
          <ExploreBtn />
          <Link
            href="/events"
            className="glass flex items-center gap-2 px-8 py-3.5 rounded-full text-white font-medium hover:border-indigo-500/30 transition-all duration-300 hover:scale-105"
          >
            Browse All Events
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </Link>
        </div>
      </div>

      {/* Featured Events */}
      <div id="events" className="mt-10 space-y-8">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-2xl font-bold text-white">Featured Events</h3>
            <p className="text-light-200/50 text-sm mt-1">Hand-picked events for you</p>
          </div>
          <Link
            href="/events"
            className="text-indigo-400 text-sm font-medium hover:text-indigo-300 transition-colors flex items-center gap-1"
          >
            View All
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </Link>
        </div>

        <Suspense fallback={<EventsSkeleton />}>
          <EventsGrid />
        </Suspense>
      </div>
    </section>
  );
}