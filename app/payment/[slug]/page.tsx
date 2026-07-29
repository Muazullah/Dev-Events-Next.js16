import { notFound, redirect } from "next/navigation";
import { auth } from "@clerk/nextjs/server";
import { headers } from "next/headers";
import { getEventBySlug } from "@/lib/actions/event.actions";
import PaymentForm from "../../../components-temp/PaymentForm";

export default async function PaymentPage({ params }: { params: Promise<{ slug: string }> }) {
    await headers();

    const { userId } = await auth();
    if (!userId) {
        redirect("/sign-in");
    }

    const { slug } = await params;
    const event = await getEventBySlug(slug);

    if (!event || !event.isPaid) {
        return notFound();
    }

    return (
        <section className="mt-20 max-w-2xl mx-auto px-4">
            <div className="mb-8">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-yellow-500/10 border border-yellow-500/20 text-yellow-400 text-xs font-medium mb-4">
                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                    Secure Checkout
                </div>
                <h1 className="text-3xl font-bold mb-2">Complete Payment</h1>
                <p className="text-light-200/50 text-sm">You are booking: <span className="text-white font-medium">{event.title}</span></p>
            </div>

            <div className="glass-strong rounded-xl p-6 mb-8">
                <div className="flex justify-between items-center mb-4 pb-4 border-b border-white/[0.06]">
                    <span className="text-light-200/50 text-sm">Event</span>
                    <span className="font-bold text-white">{event.title}</span>
                </div>
                <div className="flex justify-between items-center mb-4 pb-4 border-b border-white/[0.06]">
                    <span className="text-light-200/50 text-sm">Date & Time</span>
                    <span className="text-white">{event.date} at {event.time}</span>
                </div>
                <div className="flex justify-between items-center mb-4 pb-4 border-b border-white/[0.06]">
                    <span className="text-light-200/50 text-sm">Location</span>
                    <span className="text-white">{event.location}</span>
                </div>
                <div className="flex justify-between items-center pt-2">
                    <span className="text-lg font-bold text-white">Total</span>
                    <span className="text-3xl font-bold text-gradient">
                        {event.currency} {event.price}
                    </span>
                </div>
            </div>

            <PaymentForm
                eventId={String(event._id)}
                slug={event.slug}
            />
        </section>
    );
}