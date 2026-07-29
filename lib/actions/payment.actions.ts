'use server';

import { auth, currentUser } from "@clerk/nextjs/server";
import { headers } from "next/headers";
import { stripe, formatAmountForStripe, getMinimumAmount } from "@/lib/stripe";
import Event from "@/database/event.model";
import connectDB from "@/lib/mongodb";
import { IEvent } from '@/database/event.model';

export async function createPaymentIntent({
    eventId,
    slug,
}: {
    eventId: string;
    slug: string;
}) {
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

        if (!event.isPaid || event.price <= 0) {
            return { success: false, error: 'This event is free' };
        }

        if (event.bookingsCount >= event.capacity) {
            return { success: false, error: 'Event is fully booked' };
        }

        // Check minimum amount
        const minAmount = getMinimumAmount(event.currency);
        if (event.price < minAmount) {
            return { 
                success: false, 
                error: `Price must be at least ${event.currency} ${minAmount} for Stripe payments` 
            };
        }

        const amount = formatAmountForStripe(event.price, event.currency.toLowerCase());

        const paymentIntent = await stripe.paymentIntents.create({
            amount,
            currency: event.currency.toLowerCase(),
            metadata: {
                eventId,
                userId,
                slug,
                email,
            },
            automatic_payment_methods: {
                enabled: true,
            },
        });

        return {
            success: true,
            clientSecret: paymentIntent.client_secret,
            amount: event.price,
            currency: event.currency,
        };
    } catch (error: unknown) {
        const message = error instanceof Error ? error.message : 'Unknown error';
        console.error('[createPaymentIntent]', error);
        return { success: false, error: message };
    }
}