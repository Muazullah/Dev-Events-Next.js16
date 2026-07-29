export function generateICSFile({
    title,
    description,
    location,
    startDate,
    startTime,
    duration = 2, // hours
    slug,
}: {
    title: string;
    description: string;
    location: string;
    startDate: string; // YYYY-MM-DD
    startTime: string; // HH:MM
    duration?: number;
    slug: string;
}) {
    const [year, month, day] = startDate.split('-').map(Number);
    const [hours, minutes] = startTime.split(':').map(Number);

    const start = new Date(year, month - 1, day, hours, minutes);
    const end = new Date(start.getTime() + duration * 60 * 60 * 1000);

    const formatDate = (date: Date) => {
        return date.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
    };

    const icsContent = [
        'BEGIN:VCALENDAR',
        'VERSION:2.0',
        'PRODID:-//Dev Events//Dev Events//EN',
        'BEGIN:VEVENT',
        `DTSTART:${formatDate(start)}`,
        `DTEND:${formatDate(end)}`,
        `SUMMARY:${title}`,
        `DESCRIPTION:${description.replace(/\n/g, '\\n')}`,
        `LOCATION:${location}`,
        `UID:${slug}@devevents.com`,
        'END:VEVENT',
        'END:VCALENDAR',
    ].join('\r\n');

    return icsContent;
}