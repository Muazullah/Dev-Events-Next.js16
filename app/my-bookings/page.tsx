import { headers } from "next/headers";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import MyBookingsList from "@/components/MyBookingsList";
import { getMyBookings } from "@/lib/actions/booking.actions";
import Link from "next/link";

export default async function MyBookingsPage() {
    await headers();
    const { userId } = await auth();

    if (!userId) {
        redirect("/sign-in");
    }

    const { bookings } = await getMyBookings();

    return (
        <section className="mt-20 max-w-4xl mx-auto px-4">
            <div className="mb-10">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-xs font-medium mb-4">
                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                    </svg>
                    Your Account
                </div>
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold mb-2">My Bookings</h1>
                        <p className="text-light-200/50 text-sm">Manage your event registrations</p>
                    </div>
                    <Link
                        href="/events"
                        className="hidden sm:inline-flex items-center gap-2 px-5 py-2.5 bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.08] hover:border-indigo-500/30 text-white rounded-xl text-sm font-medium transition-all hover:scale-[1.02]"
                    >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                        </svg>
                        Find Events
                    </Link>
                </div>
            </div>

            <MyBookingsList bookings={bookings || []} />
        </section>
    );
}