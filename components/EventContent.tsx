import Image from "next/image";
import { IEvent } from "@/database";
import BookEvent from "./BookEvent";
import EventCard from "./EventCard";
import { getBookingStatus } from "@/lib/actions/booking.actions";
import Link from "next/link";
import { isAdmin } from "@/lib/isAdmin";
import AddToCalendar from "./AddToCalendar";
import DeleteEventButton from "./DeleteEventButton";
import EventReviews from "./EventReviews";
import { getEventReviews } from "@/lib/actions/review.actions";
import { auth } from "@clerk/nextjs/server";

const EventDetailItem = ({
    icon,
    label,
    color = "indigo",
}: {
    icon: string;
    label: string;
    color?: "indigo" | "cyan" | "purple" | "emerald";
}) => {
    const colorMap = {
        indigo: "text-indigo-400 bg-indigo-500/10",
        cyan: "text-cyan-400 bg-cyan-500/10",
        purple: "text-purple-400 bg-purple-500/10",
        emerald: "text-emerald-400 bg-emerald-500/10",
    };

    return (
        <div className="flex items-center gap-3 p-3 rounded-lg bg-white/[0.02] border border-white/[0.04] hover:border-white/[0.08] transition-colors">
            <div className={`w-9 h-9 rounded-lg ${colorMap[color]} flex items-center justify-center flex-shrink-0`}>
                <Image src={icon} alt="" width={16} height={16} className="opacity-80" />
            </div>
            <span className="text-light-100 text-sm">{label}</span>
        </div>
    );
};

const EventAgenda = ({ agendaItems }: { agendaItems: string[] }) => (
    <div className="agenda">
        <h2 className="flex items-center gap-2 mb-4">
            <span className="w-8 h-8 rounded-lg bg-purple-500/10 text-purple-400 flex items-center justify-center text-sm">📋</span>
            Agenda
        </h2>
        <ul className="space-y-3">
            {agendaItems.map((item, index) => (
                <li key={`${item}-${index}`} className="flex items-start gap-3 text-light-100/90">
                    <span className="flex-shrink-0 w-6 h-6 rounded-full bg-indigo-500/10 text-indigo-400 text-xs font-bold flex items-center justify-center mt-0.5">
                        {index + 1}
                    </span>
                    <span className="text-sm leading-relaxed">{item}</span>
                </li>
            ))}
        </ul>
    </div>
);

const EventTags = ({ tags }: { tags: string[] }) => (
    <div className="flex flex-row gap-2 flex-wrap">
        {tags.map((tag) => (
            <span key={tag} className="pill">
                {tag}
            </span>
        ))}
    </div>
);

export default async function EventContent({
    event,
    similarEvents,
}: {
    event: IEvent;
    similarEvents: IEvent[];
}) {
    const { isBooked } = await getBookingStatus(String(event._id));
    const isFull = event.bookingsCount >= event.capacity;
    const spotsLeft = event.capacity - event.bookingsCount;
    const admin = await isAdmin();

    const { userId } = await auth();
    const reviewsData = await getEventReviews(String(event._id));
    const hasBooking = isBooked;
    const hasReviewed = reviewsData.reviews.some((r: any) => r.userId === userId);

    return (
        <section id="event" className="relative">
            {/* Header */}
            <div className="header">
                <div className="flex items-center gap-3 mb-4">
                    <span className={`text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider ${event.mode === 'online' ? 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/20' :
                        event.mode === 'hybrid' ? 'bg-purple-500/10 text-purple-400 border border-purple-500/20' :
                            'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                        }`}>
                        {event.mode}
                    </span>
                    {event.isPaid && (
                        <span className="text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider bg-yellow-500/10 text-yellow-400 border border-yellow-500/20">
                            Paid
                        </span>
                    )}
                </div>
                <h1 className="text-4xl max-sm:text-2xl font-bold mb-4 leading-tight">{event.title}</h1>
                <p className="text-light-200/70 text-lg leading-relaxed">{event.description}</p>
            </div>

            <div className="details">
                {/* Main Content */}
                <div className="content">
                    {/* Banner Image */}
                    <div className="relative rounded-xl overflow-hidden card-shadow group">
                        <Image
                            src={event.image}
                            alt="Event Banner"
                            width={800}
                            height={800}
                            className="banner"
                            priority
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-dark-100/60 via-transparent to-transparent" />
                    </div>

                    {/* Overview */}
                    <section className="flex-col-gap-2">
                        <h2 className="flex items-center gap-2">
                            <span className="w-8 h-8 rounded-lg bg-indigo-500/10 text-indigo-400 flex items-center justify-center text-sm">ℹ️</span>
                            Overview
                        </h2>
                        <p className="text-light-200/80 leading-relaxed">{event.overview}</p>
                    </section>

                    {/* Event Details Grid */}
                    <section className="flex-col-gap-2">
                        <h2 className="flex items-center gap-2">
                            <span className="w-8 h-8 rounded-lg bg-cyan-500/10 text-cyan-400 flex items-center justify-center text-sm">📅</span>
                            Event Details
                        </h2>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            <EventDetailItem icon="/icons/calendar.svg" label={event.date} color="indigo" />
                            <EventDetailItem icon="/icons/clock.svg" label={event.time} color="cyan" />

                            {/* Conditionally render location/venue if they exist */}
                            {event.location && (
                                <EventDetailItem icon="/icons/pin.svg" label={event.location} color="purple" />
                            )}
                            {event.venue && (
                                <EventDetailItem icon="/icons/venue.svg" label={event.venue} color="emerald" />
                            )}
                            <EventDetailItem icon="/icons/mode.svg" label={event.mode} color="indigo" />
                            <EventDetailItem icon="/icons/audience.svg" label={event.audience} color="cyan" />
                        </div>
                    </section>

                    <EventAgenda agendaItems={event.agenda} />

                    {/* Organizer */}
                    <section className="flex-col-gap-2">
                        <h2 className="flex items-center gap-2">
                            <span className="w-8 h-8 rounded-lg bg-emerald-500/10 text-emerald-400 flex items-center justify-center text-sm">👤</span>
                            About the Organizer
                        </h2>
                        <div className="p-4 rounded-xl bg-white/[0.02] border border-white/[0.06]">
                            <p className="text-light-200/80">{event.organizer}</p>
                        </div>
                    </section>

                    <EventTags tags={event.tags} />

                    {/* Reviews */}
                    <EventReviews
                        eventId={String(event._id)}
                        slug={event.slug}
                        reviews={reviewsData.reviews}
                        avgRating={reviewsData.avgRating}
                        totalReviews={reviewsData.totalReviews}
                        hasBooking={hasBooking}
                        hasReviewed={hasReviewed}
                    />
                </div>

                {/* Sidebar */}
                <aside className="booking lg:sticky lg:top-24">
                    <div className="signup-card">
                        <h2 className="text-xl font-bold mb-1">Book Your Spot</h2>
                        <p className="text-light-200/50 text-sm mb-4">Secure your place at this event</p>

                        {/* Price */}
                        {event.isPaid && (
                            <div className="mb-5 p-4 bg-gradient-to-r from-yellow-500/10 to-orange-500/10 border border-yellow-500/20 rounded-xl">
                                <div className="flex items-baseline gap-1">
                                    <span className="text-yellow-400 font-bold text-2xl">{event.currency}</span>
                                    <span className="text-yellow-400 font-bold text-3xl">{event.price}</span>
                                </div>
                                <p className="text-yellow-400/60 text-xs mt-1">Paid Event · Non-refundable</p>
                            </div>
                        )}

                        {/* Capacity */}
                        <div className="space-y-3 mb-5">
                            <div className="flex justify-between items-center text-sm">
                                <span className="text-light-200/60">Spots remaining</span>
                                <span className={`font-bold ${spotsLeft > 5 ? 'text-emerald-400' : spotsLeft > 0 ? 'text-yellow-400' : 'text-red-400'}`}>
                                    {spotsLeft > 0 ? `${spotsLeft} / ${event.capacity}` : 'Full'}
                                </span>
                            </div>

                            {/* Progress bar */}
                            <div className="h-2 bg-dark-300 rounded-full overflow-hidden">
                                <div
                                    className={`h-full rounded-full transition-all duration-500 ${spotsLeft === 0 ? 'bg-red-500' : spotsLeft <= 5 ? 'bg-yellow-500' : 'bg-emerald-500'
                                        }`}
                                    style={{ width: `${Math.min((event.bookingsCount / event.capacity) * 100, 100)}%` }}
                                />
                            </div>

                            <p className="text-xs text-light-200/40">
                                {event.bookingsCount > 0
                                    ? `Join ${event.bookingsCount} developer${event.bookingsCount !== 1 ? 's' : ''} who already booked`
                                    : 'Be the first to book your spot!'
                                }
                            </p>
                        </div>

                        <BookEvent
                            eventId={String(event._id)}
                            slug={event.slug}
                            isPaid={event.isPaid}
                            price={event.price}
                            currency={event.currency}
                            isFull={isFull}
                            isBooked={isBooked}
                        />

                        <div className="mt-4 pt-4 border-t border-white/[0.06]">
                            <AddToCalendar
                                title={event.title}
                                description={event.description}
                                location={event.location || event.venue}
                                date={event.date}
                                time={event.time}
                                slug={event.slug}
                            />
                        </div>

                        {/* Admin Actions */}
                        {admin && (
                            <div className="flex flex-col gap-2 mt-4 pt-4 border-t border-white/[0.06]">
                                <p className="text-[10px] font-bold text-light-200/30 uppercase tracking-wider mb-1">Admin</p>
                                <Link
                                    href={`/edit-event/${event.slug}`}
                                    className="block w-full text-center p-3 bg-emerald-600/80 hover:bg-emerald-600 text-white font-medium rounded-lg transition-all duration-300 hover:scale-[1.02] text-sm"
                                >
                                    ✏️ Edit Event
                                </Link>
                                <DeleteEventButton slug={event.slug} />
                            </div>
                        )}
                    </div>
                </aside>
            </div>

            {/* Similar Events */}
            {similarEvents.length > 0 && (
                <div className="flex w-full flex-col gap-6 pt-20">
                    <div className="flex items-center gap-3">
                        <div className="h-px flex-1 bg-gradient-to-r from-transparent via-white/10 to-transparent" />
                        <h2 className="text-xl font-bold text-light-200/60">Similar Events</h2>
                        <div className="h-px flex-1 bg-gradient-to-r from-transparent via-white/10 to-transparent" />
                    </div>
                    <div className="events">
                        {similarEvents.map((similarEvent) => (
                            <EventCard key={similarEvent.slug} {...similarEvent} />
                        ))}
                    </div>
                </div>
            )}
        </section>
    );
}