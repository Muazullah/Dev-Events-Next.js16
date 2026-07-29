// lib/validation.ts
import { z } from 'zod';

export const eventSchema = z.object({
    title: z.string().min(3, 'Title must be at least 3 characters').max(100),
    description: z.string().min(10, 'Description must be at least 10 characters').max(1000),
    overview: z.string().min(5, 'Overview must be at least 5 characters').max(500),
    venue: z.string().min(2, 'Venue is required'),
    location: z.string().min(2, 'Location is required'),
    date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Invalid date format (YYYY-MM-DD)'),
    time: z.string().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, 'Invalid time format (HH:MM)'),
    mode: z.enum(['online', 'offline', 'hybrid']),
    audience: z.string().min(2, 'Audience is required'),
    organizer: z.string().min(2, 'Organizer is required'),
    tags: z.array(z.string()).min(1, 'At least one tag is required'),
    agenda: z.array(z.string()).min(1, 'At least one agenda item is required'),
    isPaid: z.boolean().default(false),
    price: z.number().min(0, 'Price cannot be negative').default(0),
    currency: z.enum(['PKR', 'USD']).default('PKR'),
    capacity: z.number().min(1, 'Capacity must be at least 1').default(100),
});

export type EventFormData = z.infer<typeof eventSchema>;