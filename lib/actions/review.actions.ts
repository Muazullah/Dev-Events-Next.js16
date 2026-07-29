'use server';

import { auth, currentUser } from "@clerk/nextjs/server";
import { headers } from "next/headers";
import { revalidatePath } from "next/cache";
import Review from '@/database/review.model';
import Event from '@/database/event.model';
import connectDB from "@/lib/mongodb";

export async function createReview({
    eventId,
    slug,
    rating,
    comment,
}: {
    eventId: string;
    slug: string;
    rating: number;
    comment: string;
}) {
    try {
        await headers();

        const { userId } = await auth();
        if (!userId) {
            return { success: false, error: 'Not authenticated' };
        }

        const user = await currentUser();
        const userName = user?.firstName || user?.username || 'Anonymous';

        await connectDB();

        const event = await Event.findById(eventId).lean();
        if (!event) {
            return { success: false, error: 'Event not found' };
        }

        // Check if user attended (has a booking)
        const Booking = (await import('@/database/booking.model')).default;
        const booking = await Booking.findOne({ eventId, userId, status: 'confirmed' }).lean();

        if (!booking) {
            return { success: false, error: 'You must attend this event to leave a review' };
        }

        const existing = await Review.findOne({ eventId, userId }).lean();
        if (existing) {
            return { success: false, error: 'You have already reviewed this event' };
        }

        const review = await Review.create({
            eventId,
            userId,
            userName,
            rating,
            comment,
        });

        revalidatePath(`/events/${slug}`);

        return { success: true, review: JSON.parse(JSON.stringify(review)) };
    } catch (error: any) {
        console.error('[createReview]', error);
        return { success: false, error: error.message };
    }
}

export async function getEventReviews(eventId: string) {
    try {
        await headers();
        await connectDB();

        const reviews = await Review.find({ eventId })
            .sort({ createdAt: -1 })
            .lean();

        const avgRating = reviews.length > 0
            ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
            : 0;

        return {
            success: true,
            reviews: JSON.parse(JSON.stringify(reviews)),
            avgRating: Math.round(avgRating * 10) / 10,
            totalReviews: reviews.length,
        };
    } catch (error: any) {
        console.error('[getEventReviews]', error);
        return { success: false, error: error.message, reviews: [], avgRating: 0, totalReviews: 0 };
    }
}