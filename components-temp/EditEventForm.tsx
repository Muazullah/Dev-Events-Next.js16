'use client';

import { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { IEvent } from '@/database';
import Image from 'next/image';

export default function EditEventForm({ event }: { event: IEvent }) {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [isPaid, setIsPaid] = useState(event.isPaid || false);
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
            const response = await fetch(`/api/events/${event.slug}`, {
                method: 'PATCH',
                body: formData,
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || 'Failed to update event');
            }

            setSuccess('Event updated successfully! Redirecting...');

            setTimeout(() => {
                const redirectSlug = data.redirectSlug || event.slug;
                router.push(`/events/${redirectSlug}`);
                router.refresh();
            }, 1500);

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
        <>
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
                        <input type="text" id="title" name="title" defaultValue={event.title} required className={inputClass} />
                    </div>

                    <div>
                        <label htmlFor="description" className={labelClass}>Description *</label>
                        <textarea id="description" name="description" defaultValue={event.description} required rows={4} className={inputClass} />
                    </div>

                    <div>
                        <label htmlFor="overview" className={labelClass}>Overview *</label>
                        <textarea id="overview" name="overview" defaultValue={event.overview} required rows={2} className={inputClass} />
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
                            <label htmlFor="venue" className={labelClass}>Venue *</label>
                            <input type="text" id="venue" name="venue" defaultValue={event.venue} required className={inputClass} />
                        </div>
                        <div>
                            <label htmlFor="location" className={labelClass}>Location *</label>
                            <input type="text" id="location" name="location" defaultValue={event.location} required className={inputClass} />
                        </div>
                        <div>
                            <label htmlFor="date" className={labelClass}>Date *</label>
                            <input type="date" id="date" name="date" defaultValue={event.date} required className={inputClass} />
                        </div>
                        <div>
                            <label htmlFor="time" className={labelClass}>Time *</label>
                            <input type="text" id="time" name="time" defaultValue={event.time} placeholder="09:00 AM" required className={inputClass} />
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
                            <select id="mode" name="mode" defaultValue={event.mode} required className={`${inputClass} appearance-none cursor-pointer`}>
                                <option value="online" className="bg-dark-200">Online</option>
                                <option value="offline" className="bg-dark-200">Offline</option>
                                <option value="hybrid" className="bg-dark-200">Hybrid</option>
                            </select>
                        </div>
                        <div>
                            <label htmlFor="audience" className={labelClass}>Audience *</label>
                            <input type="text" id="audience" name="audience" defaultValue={event.audience} required className={inputClass} />
                        </div>
                        <div>
                            <label htmlFor="organizer" className={labelClass}>Organizer *</label>
                            <input type="text" id="organizer" name="organizer" defaultValue={event.organizer} required className={inputClass} />
                        </div>
                        <div>
                            <label htmlFor="capacity" className={labelClass}>Capacity *</label>
                            <input type="number" id="capacity" name="capacity" defaultValue={event.capacity || 100} min="1" required className={inputClass} />
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
                        >
                            <span className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-transform duration-300 ${isPaid ? 'translate-x-7' : 'translate-x-1'}`} />
                        </button>
                        <label htmlFor="isPaid" className="text-sm font-medium text-white cursor-pointer" onClick={() => setIsPaid(!isPaid)}>
                            This is a Paid Event
                        </label>
                    </div>

                    {isPaid && (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 pt-4 border-t border-white/[0.06] animate-fade-in">
                            <div>
                                <label htmlFor="price" className={labelClass}>Price *</label>
                                <div className="relative">
                                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-light-200/40 text-sm">$</span>
                                    <input
                                        type="number"
                                        id="price"
                                        name="price"
                                        defaultValue={event.price || 0}
                                        min="1"
                                        required={isPaid}
                                        className={`${inputClass} pl-8`}
                                    />
                                </div>
                            </div>
                            <div>
                                <label htmlFor="currency" className={labelClass}>Currency *</label>
                                <select id="currency" name="currency" defaultValue={event.currency || 'PKR'} required={isPaid} className={`${inputClass} appearance-none cursor-pointer`}>
                                    <option value="PKR" className="bg-dark-200">PKR (Pakistani Rupee)</option>
                                    <option value="USD" className="bg-dark-200">USD (US Dollar)</option>
                                </select>
                            </div>
                        </div>
                    )}
                </div>

                {/* Image */}
                <div className={sectionClass}>
                    <h2 className="text-lg font-bold text-white flex items-center gap-2">
                        <span className="w-8 h-8 rounded-lg bg-pink-500/10 text-pink-400 flex items-center justify-center text-sm">🖼️</span>
                        Event Image
                    </h2>

                    <div
                        className={`relative border-2 border-dashed rounded-xl p-6 text-center transition-all duration-300 cursor-pointer hover:border-indigo-500/30 ${imagePreview ? 'border-indigo-500/30' : 'border-white/[0.08]'}`}
                        onClick={() => fileInputRef.current?.click()}
                    >
                        {imagePreview ? (
                            <div className="relative w-full h-48 rounded-lg overflow-hidden">
                                <Image src={imagePreview} alt="Preview" fill className="object-cover" />
                            </div>
                        ) : (
                            <div className="flex flex-col items-center gap-3">
                                <div className="relative w-full h-32 rounded-lg overflow-hidden mb-2">
                                    <Image src={event.image} alt="Current" fill className="object-cover opacity-50" />
                                    <div className="absolute inset-0 flex items-center justify-center">
                                        <p className="text-white text-sm font-medium bg-dark-100/60 px-3 py-1 rounded-full">Current Image</p>
                                    </div>
                                </div>
                                <p className="text-light-200/60 text-sm">Click to upload new image</p>
                                <p className="text-light-200/30 text-xs">Leave empty to keep current</p>
                            </div>
                        )}
                        <input
                            type="file"
                            id="image"
                            name="image"
                            accept="image/*"
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
                        <input type="text" id="tags" name="tags" defaultValue={event.tags?.join(', ')} placeholder="React, Next.js, Web" required className={inputClass} />
                    </div>

                    <div>
                        <label htmlFor="agenda" className={labelClass}>Agenda Items (comma separated) *</label>
                        <input type="text" id="agenda" name="agenda" defaultValue={event.agenda?.join(', ')} placeholder="Opening Keynote, Lunch, Closing remarks" required className={inputClass} />
                    </div>
                </div>

                {/* Actions */}
                <div className="flex gap-3">
                    <button
                        type="submit"
                        disabled={isLoading}
                        className="flex-1 p-4 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-bold rounded-xl transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 shadow-lg shadow-indigo-500/20 flex items-center justify-center gap-2"
                    >
                        {isLoading ? (
                            <>
                                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                Updating...
                            </>
                        ) : (
                            <>
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                </svg>
                                Update Event
                            </>
                        )}
                    </button>
                    <button
                        type="button"
                        onClick={() => router.back()}
                        className="px-8 py-4 border border-white/[0.08] text-light-200 rounded-xl hover:bg-white/[0.04] hover:text-white transition-all duration-300 text-sm font-medium flex items-center gap-2"
                    >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                        </svg>
                        Cancel
                    </button>
                </div>
            </form>
        </>
    );
}