import { MetadataRoute } from 'next';
import Event from '@/database/event.model';
import connectDB from '@/lib/mongodb';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';

    try {
        await connectDB();
        const events = await Event.find().lean();

        const eventUrls = events.map((event: any) => ({
            url: `${baseUrl}/events/${event.slug}`,
            lastModified: event.updatedAt || event.createdAt,
            changeFrequency: 'weekly' as const,
            priority: 0.8,
        }));

        return [
            {
                url: baseUrl,
                lastModified: new Date(),
                changeFrequency: 'daily',
                priority: 1,
            },
            {
                url: `${baseUrl}/events`,
                lastModified: new Date(),
                changeFrequency: 'daily',
                priority: 0.9,
            },
            ...eventUrls,
        ];
    } catch (error) {
        console.error('[Sitemap]', error);
        // Return a basic sitemap if database connection fails during build
        return [
            {
                url: baseUrl,
                lastModified: new Date(),
                changeFrequency: 'daily',
                priority: 1,
            },
        ];
    }
}