import { NextRequest, NextResponse } from 'next/server';
import { headers } from 'next/headers';
import { stripe } from '@/lib/stripe';
import { createBooking } from '@/lib/actions/booking.actions';

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!;

interface PaymentIntentMetadata {
    eventId: string;
    userId: string;
    slug: string;
    email: string;
}

export async function POST(req: NextRequest) {
    try {
        const payload = await req.text();
        const signature = (await headers()).get('stripe-signature')!;

        const event = stripe.webhooks.constructEvent(payload, signature, webhookSecret);

        if (event.type === 'payment_intent.succeeded') {
            const paymentIntent = event.data.object as unknown as { metadata: PaymentIntentMetadata };
            const { eventId, userId, slug, email } = paymentIntent.metadata;

            if (eventId && userId && slug) {
                await createBooking({ eventId, slug, userId, email });
            }
        }

        return NextResponse.json({ received: true });
    } catch (error: unknown) {
        const message = error instanceof Error ? error.message : 'Unknown error';
        console.error('[Stripe Webhook]', error);
        return NextResponse.json(
            { error: message },
            { status: 400 }
        );
    }
}