import Image from "next/image";
import Link from "next/link";

interface Props {
    title: string;
    image: string;
    slug: string;
    location: string;
    date: string;
    time: string;
    isPaid?: boolean;
    price?: number;
    currency?: string;
    bookingsCount?: number;
    capacity?: number;
    mode?: string;
    tags?: string[];
}

const EventCard = ({
    title,
    image,
    slug,
    date,
    location,
    time,
    isPaid,
    price,
    currency,
    bookingsCount,
    capacity,
    mode,
    tags,
}: Props) => {
    const isFull = capacity !== undefined && bookingsCount !== undefined && bookingsCount >= capacity;
    const spotsLeft = capacity !== undefined && bookingsCount !== undefined ? capacity - bookingsCount : null;

    return (
        <Link href={`/events/${slug}`} id="event-card" className="group relative">
            {/* Card Container */}
            <div className="relative bg-dark-200/40 rounded-xl overflow-hidden border border-white/[0.06] hover:border-indigo-500/20 transition-all duration-500 hover:shadow-[0_0_40px_-10px_rgba(99,102,241,0.15)]">
                {/* Image */}
                <div className="poster-wrapper relative">
                    <Image
                        src={image}
                        alt={title}
                        fill
                        className="poster object-cover"
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    />

                    {/* Overlay gradient */}
                    <div className="absolute inset-0 bg-gradient-to-t from-dark-100 via-transparent to-transparent opacity-60" />

                    {/* Badges */}
                    <div className="absolute top-3 left-3 flex flex-col gap-2">
                        {isFull && (
                            <span className="bg-red-500/90 backdrop-blur-sm text-white text-[10px] font-bold px-2.5 py-1 rounded-md uppercase tracking-wider">
                                Sold Out
                            </span>
                        )}
                        {mode && (
                            <span className={`text-[10px] font-bold px-2.5 py-1 rounded-md uppercase tracking-wider backdrop-blur-sm ${mode === 'online' ? 'bg-cyan-500/80 text-white' :
                                    mode === 'hybrid' ? 'bg-purple-500/80 text-white' :
                                        'bg-emerald-500/80 text-white'
                                }`}>
                                {mode}
                            </span>
                        )}
                    </div>

                    {/* Price badge */}
                    {isPaid && !isFull && (
                        <div className="absolute top-3 right-3 bg-yellow-500/90 backdrop-blur-sm text-black text-xs font-bold px-3 py-1.5 rounded-lg">
                            {currency} {price}
                        </div>
                    )}

                    {/* Spots left */}
                    {spotsLeft !== null && spotsLeft > 0 && spotsLeft <= 5 && (
                        <div className="absolute bottom-3 right-3 bg-red-500/80 backdrop-blur-sm text-white text-[10px] font-bold px-2.5 py-1 rounded-md">
                            Only {spotsLeft} left!
                        </div>
                    )}
                </div>

                {/* Content */}
                <div className="p-4 space-y-3">
                    {/* Tags */}
                    {tags && tags.length > 0 && (
                        <div className="flex flex-wrap gap-1.5">
                            {tags.slice(0, 3).map((tag) => (
                                <span key={tag} className="text-[10px] font-medium text-indigo-400 bg-indigo-500/10 px-2 py-0.5 rounded-full">
                                    {tag}
                                </span>
                            ))}
                        </div>
                    )}

                    <h3 className="title">{title}</h3>

                    <div className="datetime">
                        <div className="flex items-center gap-1.5">
                            <svg className="w-3.5 h-3.5 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                            </svg>
                            <span>{location}</span>
                        </div>
                    </div>

                    <div className="flex items-center gap-4 text-xs text-light-200/70">
                        <div className="flex items-center gap-1.5">
                            <svg className="w-3.5 h-3.5 text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                            <span>{date}</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                            <svg className="w-3.5 h-3.5 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            <span>{time}</span>
                        </div>
                    </div>

                    {/* Booking count */}
                    {bookingsCount !== undefined && bookingsCount > 0 && (
                        <div className="pt-2 border-t border-white/[0.04]">
                            <p className="text-[11px] text-light-200/50">
                                <span className="text-indigo-400 font-semibold">{bookingsCount}</span> people booked
                                {capacity && <span> · {capacity} capacity</span>}
                            </p>
                        </div>
                    )}
                </div>
            </div>
        </Link>
    );
};

export default EventCard;