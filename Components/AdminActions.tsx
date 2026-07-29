"use client";

import { useUser } from "@clerk/nextjs";
import Link from "next/link";
import DeleteEventButton from "./DeleteEventButton";

const ADMIN_EMAIL = "muazullah3@gmail.com";

export default function AdminActions({ slug }: { slug: string }) {
    const { user } = useUser();
    const isAdmin = user?.primaryEmailAddress?.emailAddress === ADMIN_EMAIL;

    if (!isAdmin) return null;

    return (
        <div className="flex flex-col gap-3 mt-6 pt-6 border-t border-white/[0.06]">
            <p className="text-[10px] font-bold text-light-200/30 uppercase tracking-wider mb-1">Admin Actions</p>
            <Link
                href={`/events/${slug}/edit`}
                className="w-full py-3 bg-emerald-600/80 hover:bg-emerald-600 text-white text-center rounded-lg transition-all duration-300 hover:scale-[1.02] font-medium text-sm flex items-center justify-center gap-2"
            >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
                Edit Event
            </Link>
            <DeleteEventButton slug={slug} />
        </div>
    );
}