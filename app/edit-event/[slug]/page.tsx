import { notFound, redirect } from "next/navigation";
import { isAdmin } from "@/lib/isAdmin";
import { getEventBySlug } from "@/lib/actions/event.actions";
import EditEventForm from "@/components/EditEventForm";

export default async function EditEventPage({ params }: { params: Promise<{ slug: string }> }) {
    const admin = await isAdmin();
    if (!admin) {
        redirect("/");
    }

    const { slug } = await params;
    const event = await getEventBySlug(slug);

    if (!event) {
        return notFound();
    }

    // Serialize to plain object before passing to client component
    const serializedEvent = JSON.parse(JSON.stringify(event));

    return (
        <section className="mt-20 max-w-3xl mx-auto px-4">
            <h1 className="text-3xl font-bold mb-8">Edit Event</h1>
            <EditEventForm event={serializedEvent} />
        </section>
    );
}