import { notFound } from "next/navigation";
import { IEvent } from "@/database";
import { getEventBySlug, getSimilarEventsBySlug } from "@/lib/actions/event.actions";
import EventContent from "@/components-temp/EventContent";

export default async function EventDetails({ slug }: { slug: string }) {
    const event = await getEventBySlug(slug);

    if (!event) {
        return notFound();
    }

    const similar: IEvent[] = await getSimilarEventsBySlug(slug);

    return (
        <EventContent
            event={event}
            similarEvents={similar}
        />
    );
}