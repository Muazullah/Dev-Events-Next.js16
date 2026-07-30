'use server';

import { revalidatePath } from "next/cache";
import { headers } from "next/headers";
import Event, { IEvent } from "@/database/event.model";
import connectDB from "@/lib/mongodb";

export async function getAllEvents(): Promise<IEvent[]> {
    try {
        await headers();
        await connectDB();
        const events = await Event.find()
            .sort({ createdAt: -1 })
            .limit(100)
            .lean();
        return events as unknown as IEvent[];
    } catch (error) {
        console.error("[getAllEvents]", error);
        return [];
    }
}

// New function specifically for the home page
export async function getFeaturedEvents(): Promise<IEvent[]> {
    try {
        await headers();
        await connectDB();
        const events = await Event.find()
            .sort({ createdAt: -1 })
            .limit(9) // Fetch exactly 9 events for the 3x3 grid
            .lean();
        return events as unknown as IEvent[];
    } catch (error) {
        console.error("[getFeaturedEvents]", error);
        return [];
    }
}

export async function getEventBySlug(slug: string): Promise<IEvent | null> {
    try {
        await headers();
        await connectDB();
        const event = await Event.findOne({ slug: slug.trim().toLowerCase() }).lean() as IEvent | null;
        return event;
    } catch (error) {
        console.error("[getEventBySlug]", error);
        return null;
    }
}

export async function getSimilarEventsBySlug(slug: string): Promise<IEvent[]> {
    try {
        await headers();
        await connectDB();
        const currentEvent = await Event.findOne({ slug }).lean() as IEvent | null;

        if (!currentEvent) {
            return [];
        }

        const events = await Event.find({
            _id: { $ne: currentEvent._id },
            tags: { $in: currentEvent.tags },
        })
            .limit(3)
            .lean();

        return events as unknown as IEvent[];
    } catch (error) {
        console.error(error);
        return [];
    }
}

export async function getEventBookingsCount(eventId: string): Promise<number> {
    try {
        await headers();
        await connectDB();
        const event = await Event.findById(eventId).lean() as IEvent | null;
        return event?.bookingsCount || 0;
    } catch (error) {
        console.error("[getEventBookingsCount]", error);
        return 0;
    }
}

export async function deleteEvent(slug: string) {
    await headers();
    await connectDB();
    await Event.findOneAndDelete({ slug });
    revalidatePath("/");
}