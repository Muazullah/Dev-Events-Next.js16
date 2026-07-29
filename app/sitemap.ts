import { MetadataRoute } from 'next';
import { getAllEvents } from '@/lib/actions/event.actions';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    const events = await getAllEvents();
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';

    const eventUrls = events.map((event) => ({
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
}