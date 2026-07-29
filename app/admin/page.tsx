import { redirect } from "next/navigation";
import { isAdmin } from "@/lib/isAdmin";
import connectDB from "@/lib/mongodb";
import Event from "@/database/event.model";
import Booking from "@/database/booking.model";
import Link from "next/link";

export default async function AdminDashboard() {
    const admin = await isAdmin();
    if (!admin) {
        redirect("/");
    }

    await connectDB();

    const totalEvents = await Event.countDocuments();
    const totalBookings = await Booking.countDocuments({ status: "confirmed" });
    const totalRevenue = await Booking.aggregate([
        {
            $lookup: {
                from: "events",
                localField: "eventId",
                foreignField: "_id",
                as: "event",
            },
        },
        { $unwind: "$event" },
        { $match: { "event.isPaid": true, status: "confirmed" } },
        { $group: { _id: null, total: { $sum: "$event.price" } } },
    ]);

    const recentEvents = await Event.find()
        .sort({ createdAt: -1 })
        .limit(5)
        .lean();

    const popularEvents = await Event.find()
        .sort({ bookingsCount: -1 })
        .limit(5)
        .lean();

    const statCard = (label: string, value: string | number, color: string, icon: string) => (
        <div className="glass-strong p-6 rounded-xl hover:border-indigo-500/20 transition-all duration-300 group">
            <div className="flex items-center justify-between mb-4">
                <div className={`w-10 h-10 rounded-lg ${color} flex items-center justify-center`}>
                    <span className="text-lg">{icon}</span>
                </div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-light-200/30">{label}</span>
            </div>
            <p className="text-4xl font-bold text-white group-hover:text-gradient transition-all">{value}</p>
        </div>
    );

    return (
        <section className="mt-20 max-w-6xl mx-auto px-4">
            <div className="flex items-center justify-between mb-10">
                <div>
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-medium mb-3">
                        <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 animate-pulse" />
                        Admin Panel
                    </div>
                    <h1 className="text-3xl font-bold">Dashboard</h1>
                </div>
                <Link
                    href="/create-event"
                    className="hidden sm:inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white rounded-xl text-sm font-medium transition-all hover:scale-[1.02]"
                >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                    </svg>
                    New Event
                </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-10">
                {statCard("Total Events", totalEvents, "bg-indigo-500/10", "📅")}
                {statCard("Total Bookings", totalBookings, "bg-cyan-500/10", "🎫")}
                {statCard("Total Revenue", `PKR ${totalRevenue[0]?.total || 0}`, "bg-yellow-500/10", "💰")}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div className="glass-strong rounded-xl p-6">
                    <div className="flex items-center justify-between mb-5">
                        <h2 className="text-lg font-bold text-white flex items-center gap-2">
                            <span className="w-8 h-8 rounded-lg bg-indigo-500/10 text-indigo-400 flex items-center justify-center text-sm">🕐</span>
                            Recent Events
                        </h2>
                        <Link href="/events" className="text-xs text-indigo-400 hover:text-indigo-300 transition-colors">View All</Link>
                    </div>
                    <div className="space-y-3">
                        {recentEvents.length === 0 ? (
                            <p className="text-light-200/40 text-sm text-center py-4">No recent events.</p>
                        ) : (
                            recentEvents.map((event: any) => (
                                <div key={event._id} className="flex justify-between items-center p-4 bg-white/[0.02] rounded-xl border border-white/[0.04] hover:border-white/[0.08] transition-colors">
                                    <div className="min-w-0">
                                        <span className="font-medium text-white text-sm truncate block">{event.title}</span>
                                        <span className="text-xs text-light-200/30">{new Date(event.createdAt).toLocaleDateString()}</span>
                                    </div>
                                    <span className="text-xs font-bold text-cyan-400 bg-cyan-500/10 px-2.5 py-1 rounded-full flex-shrink-0">
                                        {event.bookingsCount} bookings
                                    </span>
                                </div>
                            ))
                        )}
                    </div>
                </div>

                <div className="glass-strong rounded-xl p-6">
                    <div className="flex items-center justify-between mb-5">
                        <h2 className="text-lg font-bold text-white flex items-center gap-2">
                            <span className="w-8 h-8 rounded-lg bg-yellow-500/10 text-yellow-400 flex items-center justify-center text-sm">🔥</span>
                            Popular Events
                        </h2>
                    </div>
                    <div className="space-y-3">
                        {popularEvents.length === 0 ? (
                            <p className="text-light-200/40 text-sm text-center py-4">No popular events yet.</p>
                        ) : (
                            popularEvents.map((event: any, idx: number) => (
                                <div key={event._id} className="flex justify-between items-center p-4 bg-white/[0.02] rounded-xl border border-white/[0.04] hover:border-white/[0.08] transition-colors">
                                    <div className="flex items-center gap-3 min-w-0">
                                        <span className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold ${idx === 0 ? "bg-yellow-500/20 text-yellow-400" :
                                            idx === 1 ? "bg-light-200/10 text-light-200/50" :
                                                idx === 2 ? "bg-orange-500/20 text-orange-400" :
                                                    "bg-white/[0.04] text-light-200/30"
                                            }`}>
                                            {idx + 1}
                                        </span>
                                        <span className="font-medium text-white text-sm truncate">{event.title}</span>
                                    </div>
                                    <span className="text-xs font-bold text-yellow-400 bg-yellow-500/10 px-2.5 py-1 rounded-full flex-shrink-0">
                                        {event.bookingsCount}
                                    </span>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            </div>
        </section>
    );
}