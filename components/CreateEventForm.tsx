'use client';

import { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

export default function CreateEventForm() {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [isPaid, setIsPaid] = useState(false);
    const [currency, setCurrency] = useState('PKR');
    const [mode, setMode] = useState('online'); // Added mode state
    const [imagePreview, setImagePreview] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => setImagePreview(reader.result as string);
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');
        setSuccess('');

        const form = e.currentTarget;
        const formData = new FormData(form);

        const tagsInput = formData.get('tags') as string;
        const agendaInput = formData.get('agenda') as string;

        const tagsArray = tagsInput.split(',').map(t => t.trim()).filter(Boolean);
        const agendaArray = agendaInput.split(',').map(a => a.trim()).filter(Boolean);

        formData.set('tags', JSON.stringify(tagsArray));
        formData.set('agenda', JSON.stringify(agendaArray));
        formData.set('isPaid', isPaid ? 'true' : 'false');

        try {
            const response = await fetch('/api/events', {
                method: 'POST',
                body: formData,
            });

            if (!response.ok) {
                const data = await response.json();
                throw new Error(data.message || 'Failed to create event');
            }

            setSuccess('Event created successfully! Redirecting...');
            form.reset();
            setIsPaid(false);
            setMode('online');
            setImagePreview(null);

            setTimeout(() => {
                router.push('/');
                router.refresh();
            }, 2000);

        } catch (err: any) {
            setError(err.message || 'Something went wrong');
        } finally {
            setIsLoading(false);
        }
    };

    const inputClass = "w-full px-4 py-3 bg-dark-200/50 border border-white/[0.08] rounded-xl text-white placeholder-light-200/30 focus:outline-none focus:border-indigo-500/50 focus:ring-2 focus:ring-indigo-500/10 transition-all duration-300 text-sm";
    const labelClass = "text-sm font-medium text-light-100/80 mb-2 block";
    const sectionClass = "glass-strong p-6 rounded-xl space-y-5";

    return (
        <section className="mt-20 max-w-3xl mx-auto px-4 pb-20">
            <div className="text-center mb-10">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-medium mb-4">
                    <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 animate-pulse" />
                    Admin Panel
                </div>
                <h1 className="text-4xl max-sm:text-2xl mb-3">Create New Event</h1>
                <p className="text-light-200/50 text-sm">Fill in the details below to publish a new developer event</p>
            </div>

            {error && (
                <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-xl flex items-start gap-3 animate-fade-in">
                    <svg className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <p className="text-red-400 text-sm">{error}</p>
                </div>
            )}
            {success && (
                <div className="mb-6 p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-xl flex items-start gap-3 animate-fade-in">
                    <svg className="w-5 h-5 text-emerald-400 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <p className="text-emerald-400 text-sm">{success}</p>
                </div>
            )}

            <form onSubmit={handleSubmit} className="flex flex-col gap-6" encType="multipart/form-data">
                {/* Basic Info */}
                <div className={sectionClass}>
                    <h2 className="text-lg font-bold text-white flex items-center gap-2">
                        <span className="w-8 h-8 rounded-lg bg-indigo-500/10 text-indigo-400 flex items-center justify-center text-sm">📝</span>
                        Basic Information
                    </h2>
                    <div>
                        <label htmlFor="title" className={labelClass}>Title *</label>
                        <input type="text" id="title" name="title" required className={inputClass} placeholder="e.g. React Summit 2026" />
                    </div>
                    <div>
                        <label htmlFor="description" className={labelClass}>Description *</label>
                        <textarea id="description" name="description" required rows={4} className={inputClass} placeholder="Describe what this event is about..." />
                    </div>
                    <div>
                        <label htmlFor="overview" className={labelClass}>Overview *</label>
                        <textarea id="overview" name="overview" required rows={2} className={inputClass} placeholder="Short summary for cards and previews" />
                    </div>
                </div>

                {/* Location & Time */}
                <div className={sectionClass}>
                    <h2 className="text-lg font-bold text-white flex items-center gap-2">
                        <span className="w-8 h-8 rounded-lg bg-cyan-500/10 text-cyan-400 flex items-center justify-center text-sm">📍</span>
                        Location & Time
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                        <div>
                            <label htmlFor="venue" className={labelClass}>
                                {mode === 'online' ? 'Platform *' : 'Venue *'}
                            </label>
                            <input
                                type="text"
                                id="venue"
                                name="venue"
                                required
                                className={inputClass}
                                placeholder={mode === 'online' ? 'Zoom, Google Meet, Discord' : 'Convention Center'}
                            />
                        </div>
                        <div>
                            <label htmlFor="location" className={labelClass}>
                                {mode === 'online' ? 'Meeting Link *' : 'Location *'}
                            </label>
                            <input
                                type="text"
                                id="location"
                                name="location"
                                required
                                className={inputClass}
                                placeholder={mode === 'online' ? 'https://meet.google.com/...' : 'San Francisco, CA'}
                            />
                        </div>
                        <div>
                            <label htmlFor="date" className={labelClass}>Date *</label>
                            <input type="date" id="date" name="date" required className={inputClass} />
                        </div>
                        <div>
                            <label htmlFor="time" className={labelClass}>Time *</label>
                            <input type="text" id="time" name="time" placeholder="09:00 AM" required className={inputClass} />
                        </div>
                    </div>
                </div>

                {/* Event Details */}
                <div className={sectionClass}>
                    <h2 className="text-lg font-bold text-white flex items-center gap-2">
                        <span className="w-8 h-8 rounded-lg bg-purple-500/10 text-purple-400 flex items-center justify-center text-sm">⚙️</span>
                        Event Details
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                        <div>
                            <label htmlFor="mode" className={labelClass}>Mode *</label>
                            <select
                                id="mode"
                                name="mode"
                                required
                                className={`${inputClass} appearance-none cursor-pointer`}
                                value={mode}
                                onChange={(e) => setMode(e.target.value)}
                            >
                                <option value="online" className="bg-dark-200">Online</option>
                                <option value="offline" className="bg-dark-200">Offline</option>
                                <option value="hybrid" className="bg-dark-200">Hybrid</option>
                            </select>
                        </div>
                        <div>
                            <label htmlFor="audience" className={labelClass}>Audience *</label>
                            <input type="text" id="audience" name="audience" placeholder="e.g. Developers" required className={inputClass} />
                        </div>
                        <div>
                            <label htmlFor="organizer" className={labelClass}>Organizer *</label>
                            <input type="text" id="organizer" name="organizer" required className={inputClass} placeholder="Event organizer name" />
                        </div>
                        <div>
                            <label htmlFor="capacity" className={labelClass}>Capacity *</label>
                            <input type="number" id="capacity" name="capacity" defaultValue="100" min="1" required className={inputClass} />
                        </div>
                    </div>
                </div>

                {/* Paid Event Toggle */}
                <div className={`${sectionClass} ${isPaid ? 'border-indigo-500/20' : ''} transition-colors`}>
                    <div className="flex items-center gap-3">
                        <button
                            type="button"
                            onClick={() => setIsPaid(!isPaid)}
                            className={`relative w-12 h-6 rounded-full transition-colors duration-300 ${isPaid ? 'bg-indigo-500' : 'bg-white/10'}`}
                            aria-label="Toggle Paid Event"
                        >
                            <span className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-transform duration-300 ${isPaid ? 'translate-x-7' : 'translate-x-1'}`} />
                        </button>
                        <span className="text-sm font-medium text-white cursor-pointer" onClick={() => setIsPaid(!isPaid)}>
                            This is a Paid Event
                        </span>
                    </div>

                    {isPaid && (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 pt-4 border-t border-white/[0.06] animate-fade-in">
                            <div>
                                <label htmlFor="price" className={labelClass}>Price *</label>
                                <div className="relative">
                                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-light-200/40 text-sm font-bold">
                                        {currency === 'PKR' ? 'Rs ' : '$ '}
                                    </span>
                                    <input
                                        type="number"
                                        id="price"
                                        name="price"
                                        min="1"
                                        required={isPaid}
                                        className={`${inputClass} pl-12`}
                                        placeholder="99"
                                    />
                                </div>
                            </div>
                            <div>
                                <label htmlFor="currency" className={labelClass}>Currency *</label>
                                <select
                                    id="currency"
                                    name="currency"
                                    required={isPaid}
                                    className={`${inputClass} appearance-none cursor-pointer`}
                                    value={currency}
                                    onChange={(e) => setCurrency(e.target.value)}
                                >
                                    <option value="PKR" className="bg-dark-200">PKR (Pakistani Rupee)</option>
                                    <option value="USD" className="bg-dark-200">USD (US Dollar)</option>
                                </select>
                            </div>
                        </div>
                    )}
                </div>

                {/* Image Upload */}
                <div className={sectionClass}>
                    <h2 className="text-lg font-bold text-white flex items-center gap-2">
                        <span className="w-8 h-8 rounded-lg bg-pink-500/10 text-pink-400 flex items-center justify-center text-sm">🖼️</span>
                        Event Image
                    </h2>
                    <div
                        className={`relative border-2 border-dashed rounded-xl p-8 text-center transition-all duration-300 cursor-pointer hover:border-indigo-500/30 ${imagePreview ? 'border-indigo-500/30' : 'border-white/[0.08]'}`}
                        onClick={() => fileInputRef.current?.click()}
                    >
                        {imagePreview ? (
                            <div className="relative w-full h-48 rounded-lg overflow-hidden">
                                <Image src={imagePreview} alt="Preview" fill className="object-cover" />
                                <div className="absolute inset-0 bg-dark-100/40 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                                    <p className="text-white text-sm font-medium">Click to change</p>
                                </div>
                            </div>
                        ) : (
                            <div className="flex flex-col items-center gap-3">
                                <div className="w-12 h-12 rounded-full bg-indigo-500/10 flex items-center justify-center">
                                    <svg className="w-6 h-6 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                    </svg>
                                </div>
                                <p className="text-light-200/60 text-sm">Click to upload event banner</p>
                                <p className="text-light-200/30 text-xs">Recommended: 1200 x 600px</p>
                            </div>
                        )}
                        <input
                            type="file"
                            id="image"
                            name="image"
                            accept="image/*"
                            required
                            className="hidden"
                            ref={fileInputRef}
                            onChange={handleImageChange}
                        />
                    </div>
                </div>

                {/* Tags & Agenda */}
                <div className={sectionClass}>
                    <h2 className="text-lg font-bold text-white flex items-center gap-2">
                        <span className="w-8 h-8 rounded-lg bg-emerald-500/10 text-emerald-400 flex items-center justify-center text-sm">🏷️</span>
                        Tags & Agenda
                    </h2>
                    <div>
                        <label htmlFor="tags" className={labelClass}>Tags (comma separated) *</label>
                        <input type="text" id="tags" name="tags" placeholder="React, Next.js, Web Development" required className={inputClass} />
                        <p className="text-light-200/30 text-xs mt-1.5">Separate tags with commas</p>
                    </div>
                    <div>
                        <label htmlFor="agenda" className={labelClass}>Agenda Items (comma separated) *</label>
                        <input type="text" id="agenda" name="agenda" placeholder="Opening Keynote, Lunch Break, Closing Remarks" required className={inputClass} />
                        <p className="text-light-200/30 text-xs mt-1.5">Separate agenda items with commas</p>
                    </div>
                </div>

                <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full p-4 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-bold rounded-xl transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 shadow-lg shadow-indigo-500/20 flex items-center justify-center gap-2"
                >
                    {isLoading ? (
                        <>
                            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                            Creating Event...
                        </>
                    ) : (
                        <>
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                            </svg>
                            Create Event
                        </>
                    )}
                </button>
            </form>
        </section>
    );
}