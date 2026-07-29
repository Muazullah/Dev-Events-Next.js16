'use client';

import { generateICSFile } from '@/lib/calendar';

interface Props {
    title: string;
    description: string;
    location: string;
    date: string;
    time: string;
    slug: string;
}

export default function AddToCalendar({ title, description, location, date, time, slug }: Props) {
    const handleDownload = () => {
        const icsContent = generateICSFile({
            title,
            description,
            location,
            startDate: date,
            startTime: time,
            slug,
        });

        const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', `${slug}.ics`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
    };

    const handleGoogleCalendar = () => {
        const [year, month, day] = date.split('-');
        const [hours, minutes] = time.split(':');
        const startDate = new Date(Number(year), Number(month) - 1, Number(day), Number(hours), Number(minutes));
        const endDate = new Date(startDate.getTime() + 2 * 60 * 60 * 1000);

        const params = new URLSearchParams({
            action: 'TEMPLATE',
            text: title,
            dates: `${startDate.toISOString().replace(/[-:]/g, '').split('.')[0]}Z/${endDate.toISOString().replace(/[-:]/g, '').split('.')[0]}Z`,
            details: description,
            location,
        });

        window.open(`https://calendar.google.com/calendar/render?${params.toString()}`, '_blank');
    };

    return (
        <div className="flex flex-col gap-3">
            <p className="text-xs font-medium text-light-200/40 uppercase tracking-wider">Add to Calendar</p>
            <div className="grid grid-cols-2 gap-2">
                <button
                    onClick={handleGoogleCalendar}
                    className="flex items-center justify-center gap-2 px-3 py-2.5 bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.06] hover:border-indigo-500/30 text-white text-xs rounded-lg transition-all duration-300 hover:scale-[1.02]"
                >
                    <svg className="w-4 h-4 text-indigo-400" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M12.48 10.92v3.28h7.84c-.24 1.84-.853 3.187-1.787 4.133-1.147 1.147-2.933 2.4-6.053 2.4-4.827 0-8.6-3.893-8.6-8.72s3.773-8.72 8.6-8.72c2.6 0 4.507 1.027 5.907 2.347l2.307-2.307C18.747 1.44 16.133 0 12.48 0 5.867 0 .307 5.387.307 12s5.56 12 12.173 12c3.573 0 6.267-1.173 8.373-3.36 2.16-2.16 2.84-5.213 2.84-7.667 0-.76-.053-1.467-.173-2.053H12.48z" />
                    </svg>
                    Google
                </button>
                <button
                    onClick={handleDownload}
                    className="flex items-center justify-center gap-2 px-3 py-2.5 bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.06] hover:border-cyan-500/30 text-white text-xs rounded-lg transition-all duration-300 hover:scale-[1.02]"
                >
                    <svg className="w-4 h-4 text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                    </svg>
                    .ics File
                </button>
            </div>
        </div>
    );
}