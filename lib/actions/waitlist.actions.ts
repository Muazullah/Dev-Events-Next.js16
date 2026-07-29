'use server';

import { auth, currentUser } from "@clerk/nextjs/server";
import { headers } from "next/headers";
import Waitlist from '@/database/waitlist.model';
import Event from '@/database/event.model';
import connectDB from "@/lib/mongodb";
import { IEvent } from '@/database/event.model';

export async function joinWaitlist({ eventId }: { eventId: string }) {
    try {
        await headers();

        const { userId } = await auth();
        if (!userId) {
            return { success: false, error: 'Not authenticated' };
        }

        const user = await currentUser();
        const email = user?.emailAddresses[0]?.emailAddress || '';

        await connectDB();

        const event = await Event.findById(eventId).lean() as IEvent | null;
        if (!event) {
            return { success: false, error: 'Event not found' };
        }

        if (event.bookingsCount < event.capacity) {
            return { success: false, error: 'Event still has spots available' };
        }

        const existing = await Waitlist.findOne({ eventId, userId }).lean() as { _id: string } | null;
        if (existing) {
            return { success: false, error: 'You are already on the waitlist' };
        }

        const waitlist = await Waitlist.create({ eventId, userId, email });

        return { success: true, waitlist: JSON.parse(JSON.stringify(waitlist)) };
    } catch (error: unknown) {
        const message = error instanceof Error ? error.message : 'Unknown error';
        console.error('[joinWaitlist]', error);
        return { success: false, error: message };
    }
}