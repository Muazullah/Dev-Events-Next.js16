'use server';

import { auth, currentUser } from "@clerk/nextjs/server";
import { headers } from "next/headers";
import { revalidatePath } from "next/cache";
import Booking from '@/database/booking.model';
import Event from '@/database/event.model';
import connectDB from "@/lib/mongodb";
import { sendBookingConfirmation, sendCancellationConfirmation } from "@/lib/email";
import { IEvent } from '@/database/event.model';

export async function createBooking({
    eventId,
    slug,
    userId: passedUserId,
    email: passedEmail
}: {
    eventId: string;
    slug: string;
    userId?: string;
    email?: string;
}) {
    try {
        await headers();

        const { userId: authUserId } = await auth();
        const userId = passedUserId || authUserId;

        if (!userId) {
            return { success: false, error: 'Not authenticated' };
        }

        const user = passedEmail ? { emailAddresses: [{ emailAddress: passedEmail }] } : await currentUser();
        const email = user?.emailAddresses[0]?.emailAddress || '';

        await connectDB();

        const event = await Event.findById(eventId).lean() as IEvent | null;
        if (!event) {
            return { success: false, error: 'Event not found' };
        }

        if (event.bookingsCount >= event.capacity) {
            return { success: false, error: 'Event is fully booked' };
        }

        const existing = await Booking.findOne({ eventId, userId });
        if (existing) {
            if (existing.status === 'cancelled') {
                existing.status = 'confirmed';
                existing.email = email;
                await existing.save();

                await Event.findByIdAndUpdate(eventId, { $inc: { bookingsCount: 1 } });

                revalidatePath(`/events/${slug}`);
                return { success: true, booking: JSON.parse(JSON.stringify(existing)) };
            }
            return { success: false, error: 'Already booked for this event' };
        }

        const booking = await Booking.create({ eventId, userId, email });

        await Event.findByIdAndUpdate(eventId, { $inc: { bookingsCount: 1 } });

        await sendBookingConfirmation({
            to: email,
            eventTitle: event.title,
            eventDate: event.date,
            eventTime: event.time,
            eventLocation: event.location,
            eventSlug: slug,
        });

        revalidatePath(`/events/${slug}`);

        return { success: true, booking: JSON.parse(JSON.stringify(booking)) };
    } catch (error: unknown) {
        const message = error instanceof Error ? error.message : 'Unknown error';
        console.error('[createBooking]', error);
        return { success: false, error: message };
    }
}

export async function getMyBookings() {
    try {
        await headers();

        const { userId } = await auth();
        if (!userId) {
            return { success: false, error: 'Not authenticated', bookings: [] };
        }

        await connectDB();

        const bookings = await Booking.find({ userId, status: 'confirmed' })
            .populate('eventId')
            .sort({ createdAt: -1 })
            .lean();

        return { success: true, bookings: JSON.parse(JSON.stringify(bookings)) };
    } catch (error: unknown) {
        const message = error instanceof Error ? error.message : 'Unknown error';
        console.error('[getMyBookings]', error);
        return { success: false, error: message, bookings: [] };
    }
}

export async function cancelBooking(bookingId: string) {
    try {
        await headers();

        const { userId } = await auth();
        if (!userId) {
            return { success: false, error: 'Not authenticated' };
        }

        await connectDB();

        const booking = await Booking.findOne({ _id: bookingId, userId }).lean() as {
            _id: string;
            status: string;
            eventId: string;
            email: string
        } | null;

        if (!booking) {
            return { success: false, error: 'Booking not found' };
        }

        if (booking.status === 'cancelled') {
            return { success: false, error: 'Already cancelled' };
        }

        const event = await Event.findById(booking.eventId).lean() as IEvent | null;

        await Booking.findByIdAndUpdate(bookingId, { status: 'cancelled' });

        await Event.findByIdAndUpdate(booking.eventId, { $inc: { bookingsCount: -1 } });

        if (event) {
            await sendCancellationConfirmation({
                to: booking.email,
                eventTitle: event.title,
                eventDate: event.date,
            });
        }

        revalidatePath('/my-bookings');

        return { success: true, booking: JSON.parse(JSON.stringify(booking)) };
    } catch (error: unknown) {
        const message = error instanceof Error ? error.message : 'Unknown error';
        console.error('[cancelBooking]', error);
        return { success: false, error: message };
    }
}

export async function getBookingStatus(eventId: string) {
    try {
        await headers();
        const { userId } = await auth();
        if (!userId) return { isBooked: false, status: null };

        await connectDB();
        const booking = await Booking.findOne({ eventId, userId }).lean() as {
            status: string
        } | null;

        return {
            isBooked: !!booking && booking.status === 'confirmed',
            status: booking?.status || null,
        };
    } catch {
        return { isBooked: false, status: null };
    }
}