import { notFound } from "next/navigation";
import { getEventBySlug, getSimilarEventsBySlug } from "@/lib/actions/event.actions";
import EventContent from "@/components-temp/EventContent";



export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params;
    const event = await getEventBySlug(slug);

    if (!event) {
        return {
            title: 'Event Not Found | Dev Events',
            metadataBase: new URL(process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000"),
        };
    }

    return {
        title: `${event.title} | Dev Events`,
        description: event.overview,
        metadataBase: new URL(process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000"),
        openGraph: {
            title: event.title,
            description: event.overview,
            images: [event.image],
        },
    };
}

export default async function EventPage({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params;
    const event = await getEventBySlug(slug);

    if (!event) {
        return notFound();
    }

    const similarEvents = await getSimilarEventsBySlug(slug);

    // Serialize before passing to client components
    const serializedEvent = JSON.parse(JSON.stringify(event));
    const serializedSimilar = JSON.parse(JSON.stringify(similarEvents));

    return <EventContent event={serializedEvent} similarEvents={serializedSimilar} />;
}