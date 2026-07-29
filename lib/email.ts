import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);
const fromEmail = process.env.RESEND_FROM_EMAIL || 'onboarding@resend.dev';

export async function sendBookingConfirmation({
    to,
    eventTitle,
    eventDate,
    eventTime,
    eventLocation,
    eventSlug,
}: {
    to: string;
    eventTitle: string;
    eventDate: string;
    eventTime: string;
    eventLocation: string;
    eventSlug: string;
}) {
    try {
        const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
        
        const { data, error } = await resend.emails.send({
            from: `Dev Events <${fromEmail}>`,
            to: [to],
            subject: `✅ Booking Confirmed: ${eventTitle}`,
            html: `
                <!DOCTYPE html>
                <html>
                <head>
                    <meta charset="utf-8">
                    <meta name="viewport" content="width=device-width, initial-scale=1.0">
                    <title>Booking Confirmation</title>
                    <style>
                        body { font-family: 'Segoe UI', Arial, sans-serif; background: #0d161a; color: #ffffff; margin: 0; padding: 0; }
                        .container { max-width: 600px; margin: 0 auto; padding: 40px 20px; }
                        .header { text-align: center; padding-bottom: 30px; border-bottom: 1px solid #182830; }
                        .logo { font-size: 24px; font-weight: bold; color: #59deca; margin-bottom: 10px; }
                        .content { padding: 30px 0; }
                        .event-card { background: #182830; border-radius: 12px; padding: 24px; margin: 20px 0; border: 1px solid #151024; }
                        .event-title { font-size: 20px; font-weight: bold; margin-bottom: 16px; color: #ffffff; }
                        .detail-row { display: flex; align-items: center; gap: 12px; margin-bottom: 12px; color: #bdbdbd; }
                        .detail-icon { width: 20px; text-align: center; }
                        .cta-button { display: inline-block; background: #59deca; color: #000000; padding: 14px 32px; text-decoration: none; border-radius: 8px; font-weight: bold; margin-top: 20px; }
                        .footer { text-align: center; padding-top: 30px; border-top: 1px solid #182830; color: #666; font-size: 12px; }
                    </style>
                </head>
                <body>
                    <div class="container">
                        <div class="header">
                            <div class="logo">Dev Events</div>
                            <p style="color: #bdbdbd;">Your spot is confirmed!</p>
                        </div>
                        
                        <div class="content">
                            <p>Hi there,</p>
                            <p>Great news! Your booking has been confirmed. Here are the details:</p>
                            
                            <div class="event-card">
                                <div class="event-title">${eventTitle}</div>
                                
                                <div class="detail-row">
                                    <span class="detail-icon">📅</span>
                                    <span>${eventDate}</span>
                                </div>
                                <div class="detail-row">
                                    <span class="detail-icon">🕐</span>
                                    <span>${eventTime}</span>
                                </div>
                                <div class="detail-row">
                                    <span class="detail-icon">📍</span>
                                    <span>${eventLocation}</span>
                                </div>
                            </div>
                            
                            <a href="${baseUrl}/events/${eventSlug}" class="cta-button">View Event Details</a>
                            
                            <p style="margin-top: 24px; color: #bdbdbd; font-size: 14px;">
                                You can cancel your booking anytime from your <a href="${baseUrl}/my-bookings" style="color: #59deca;">My Bookings</a> page.
                            </p>
                        </div>
                        
                        <div class="footer">
                            <p>Dev Events - The hub for every dev event you mustn't miss</p>
                            <p style="margin-top: 8px;">${baseUrl}</p>
                        </div>
                    </div>
                </body>
                </html>
            `,
        });

        if (error) {
            console.error('[sendBookingConfirmation] Resend error:', error);
            return { success: false, error: error.message };
        }

        console.log('[sendBookingConfirmation] Email sent:', data?.id);
        return { success: true, id: data?.id };
    } catch (error: unknown) {
        const message = error instanceof Error ? error.message : 'Unknown error';
        console.error('[sendBookingConfirmation]', error);
        return { success: false, error: message };
    }
}

export async function sendEventReminder({
    to,
    eventTitle,
    eventDate,
    eventTime,
    eventLocation,
}: {
    to: string;
    eventTitle: string;
    eventDate: string;
    eventTime: string;
    eventLocation: string;
}) {
    try {
        const { data, error } = await resend.emails.send({
            from: `Dev Events <${fromEmail}>`,
            to: [to],
            subject: `⏰ Reminder: ${eventTitle} is tomorrow!`,
            html: `
                <!DOCTYPE html>
                <html>
                <head>
                    <meta charset="utf-8">
                    <style>
                        body { font-family: 'Segoe UI', Arial, sans-serif; background: #0d161a; color: #ffffff; margin: 0; padding: 0; }
                        .container { max-width: 600px; margin: 0 auto; padding: 40px 20px; }
                        .header { text-align: center; padding-bottom: 30px; }
                        .logo { font-size: 24px; font-weight: bold; color: #59deca; }
                        .content { padding: 20px 0; }
                        .reminder-box { background: #182830; border-radius: 12px; padding: 24px; margin: 20px 0; border-left: 4px solid #59deca; }
                        .footer { text-align: center; padding-top: 30px; color: #666; font-size: 12px; }
                    </style>
                </head>
                <body>
                    <div class="container">
                        <div class="header">
                            <div class="logo">Dev Events</div>
                        </div>
                        
                        <div class="content">
                            <h2 style="color: #ffffff;">Event Reminder</h2>
                            <p>Hi there,</p>
                            <p>Just a friendly reminder that <strong>${eventTitle}</strong> is happening tomorrow!</p>
                            
                            <div class="reminder-box">
                                <p><strong>📅 Date:</strong> ${eventDate}</p>
                                <p><strong>🕐 Time:</strong> ${eventTime}</p>
                                <p><strong>📍 Location:</strong> ${eventLocation}</p>
                            </div>
                            
                            <p>Looking forward to seeing you there! 🚀</p>
                        </div>
                        
                        <div class="footer">
                            <p>Dev Events</p>
                        </div>
                    </div>
                </body>
                </html>
            `,
        });

        if (error) {
            console.error('[sendEventReminder] Resend error:', error);
            return { success: false, error: error.message };
        }

        return { success: true, id: data?.id };
    } catch (error: unknown) {
        const message = error instanceof Error ? error.message : 'Unknown error';
        console.error('[sendEventReminder]', error);
        return { success: false, error: message };
    }
}

export async function sendCancellationConfirmation({
    to,
    eventTitle,
    eventDate,
}: {
    to: string;
    eventTitle: string;
    eventDate: string;
}) {
    try {
        const { data, error } = await resend.emails.send({
            from: `Dev Events <${fromEmail}>`,
            to: [to],
            subject: `❌ Booking Cancelled: ${eventTitle}`,
            html: `
                <!DOCTYPE html>
                <html>
                <head>
                    <meta charset="utf-8">
                    <style>
                        body { font-family: 'Segoe UI', Arial, sans-serif; background: #0d161a; color: #ffffff; margin: 0; padding: 0; }
                        .container { max-width: 600px; margin: 0 auto; padding: 40px 20px; }
                        .content { padding: 20px 0; }
                        .cancel-box { background: #182830; border-radius: 12px; padding: 24px; margin: 20px 0; border-left: 4px solid #ef4444; }
                    </style>
                </head>
                <body>
                    <div class="container">
                        <div class="content">
                            <h2 style="color: #ef4444;">Booking Cancelled</h2>
                            <p>Hi there,</p>
                            <p>Your booking for <strong>${eventTitle}</strong> on ${eventDate} has been cancelled.</p>
                            
                            <div class="cancel-box">
                                <p style="color: #bdbdbd;">If you didn't request this cancellation, please contact us immediately.</p>
                            </div>
                            
                            <p>We hope to see you at future events!</p>
                        </div>
                    </div>
                </body>
                </html>
            `,
        });

        if (error) {
            return { success: false, error: error.message };
        }

        return { success: true, id: data?.id };
    } catch (error: unknown) {
        const message = error instanceof Error ? error.message : 'Unknown error';
        return { success: false, error: message };
    }
}

export async function sendWaitlistNotification({
    to,
    eventTitle,
    eventSlug,
}: {
    to: string;
    eventTitle: string;
    eventSlug: string;
}) {
    try {
        const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
        
        const { data, error } = await resend.emails.send({
            from: `Dev Events <${fromEmail}>`,
            to: [to],
            subject: `🎉 Spot Available: ${eventTitle}`,
            html: `
                <!DOCTYPE html>
                <html>
                <head>
                    <meta charset="utf-8">
                    <style>
                        body { font-family: 'Segoe UI', Arial, sans-serif; background: #0d161a; color: #ffffff; margin: 0; padding: 0; }
                        .container { max-width: 600px; margin: 0 auto; padding: 40px 20px; }
                        .cta-button { display: inline-block; background: #59deca; color: #000000; padding: 14px 32px; text-decoration: none; border-radius: 8px; font-weight: bold; margin-top: 20px; }
                    </style>
                </head>
                <body>
                    <div class="container">
                        <h2 style="color: #59deca;">Good News! 🎉</h2>
                        <p>A spot has opened up for <strong>${eventTitle}</strong>.</p>
                        <p>Since you were on the waitlist, you now have the chance to book!</p>
                        
                        <a href="${baseUrl}/events/${eventSlug}" class="cta-button">Book Now</a>
                        
                        <p style="color: #666; margin-top: 24px; font-size: 12px;">
                            This link is valid for 24 hours. After that, the spot will be offered to the next person on the waitlist.
                        </p>
                    </div>
                </body>
                </html>
            `,
        });

        if (error) {
            return { success: false, error: error.message };
        }

        return { success: true, id: data?.id };
    } catch (error: unknown) {
        const message = error instanceof Error ? error.message : 'Unknown error';
        return { success: false, error: message };
    }
}