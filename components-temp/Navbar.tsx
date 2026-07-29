"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
    SignedIn,
    SignedOut,
    SignInButton,
    UserButton,
} from "@clerk/nextjs";

export default function Navbar({ isAdmin }: { isAdmin: boolean }) {
    const [menuOpen, setMenuOpen] = useState(false);

    const toggleMenu = () => setMenuOpen(!menuOpen);
    const closeMenu = () => setMenuOpen(false);

    const navLinks = (
        <>
            <li onClick={closeMenu}>
                <Link href="/" className="block py-2 text-sm font-medium text-light-200 hover:text-white transition-colors relative group">
                    Home
                    <span className="absolute -bottom-0.5 left-0 w-0 h-0.5 bg-indigo-500 transition-all duration-300 group-hover:w-full" />
                </Link>
            </li>
            <li onClick={closeMenu}>
                <Link href="/events" className="block py-2 text-sm font-medium text-light-200 hover:text-white transition-colors relative group">
                    All Events
                    <span className="absolute -bottom-0.5 left-0 w-0 h-0.5 bg-indigo-500 transition-all duration-300 group-hover:w-full" />
                </Link>
            </li>
            <SignedIn>
                <li onClick={closeMenu}>
                    <Link href="/my-bookings" className="block py-2 text-sm font-medium text-light-200 hover:text-white transition-colors relative group">
                        My Bookings
                        <span className="absolute -bottom-0.5 left-0 w-0 h-0.5 bg-indigo-500 transition-all duration-300 group-hover:w-full" />
                    </Link>
                </li>
            </SignedIn>
            {isAdmin && (
                <>
                    <li onClick={closeMenu}>
                        {/* Changed text-indigo-400 to text-light-200 */}
                        <Link href="/create-event" className="block py-2 text-sm font-medium text-light-200 hover:text-white transition-colors relative group">
                            Create Event
                            <span className="absolute -bottom-0.5 left-0 w-0 h-0.5 bg-indigo-500 transition-all duration-300 group-hover:w-full" />
                        </Link>
                    </li>
                    <li onClick={closeMenu}>
                        {/* Changed text-indigo-400 to text-light-200 */}
                        <Link href="/admin" className="block py-2 text-sm font-medium text-light-200 hover:text-white transition-colors relative group">
                            Dashboard
                            <span className="absolute -bottom-0.5 left-0 w-0 h-0.5 bg-indigo-500 transition-all duration-300 group-hover:w-full" />
                        </Link>
                    </li>
                </>
            )}
        </>
    );

    return (
        <header className="sticky top-0 z-50 transition-all duration-300">
            <div className="absolute inset-0 bg-[#0f0f16]/70 backdrop-blur-2xl border-b border-white/[0.06]" />
            <nav className="relative flex items-center justify-between mx-auto container sm:px-10 px-5 py-4">
                {/* Logo */}
                <Link href="/" className="flex items-center gap-2.5 group" onClick={closeMenu}>
                    <div className="relative w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center group-hover:scale-110 transition-transform">
                        <span className="text-white text-xs font-bold">DE</span>
                    </div>
                    <p className="text-xl font-bold italic max-sm:hidden text-white group-hover:text-indigo-400 transition-colors">
                        Dev Events
                    </p>
                </Link>

                {/* Desktop Nav */}
                <ul className="hidden md:flex items-center gap-8 list-none">
                    {navLinks}
                </ul>

                {/* Desktop Auth */}
                <div className="hidden md:flex items-center gap-3">
                    <SignedOut>
                        <SignInButton mode="modal">
                            <button className="bg-indigo-600 hover:bg-indigo-500 text-white px-5 py-2 rounded-lg text-sm font-medium transition-all duration-300 hover:scale-105 active:scale-95">
                                Sign In
                            </button>
                        </SignInButton>
                    </SignedOut>
                    <SignedIn>
                        <UserButton
                            afterSignOutUrl="/"
                            appearance={{
                                elements: {
                                    avatarBox: "w-9 h-9 rounded-full ring-2 ring-indigo-500/30",
                                }
                            }}
                        />
                    </SignedIn>
                </div>

                {/* Mobile Menu Button */}
                <button
                    onClick={toggleMenu}
                    className="md:hidden relative z-10 flex flex-col gap-1.5 p-2"
                    aria-label="Toggle menu"
                    aria-expanded={menuOpen}
                >
                    <span className={`block w-6 h-0.5 bg-white transition-all duration-300 ${menuOpen ? 'rotate-45 translate-y-2' : ''}`} />
                    <span className={`block w-6 h-0.5 bg-white transition-all duration-300 ${menuOpen ? 'opacity-0' : ''}`} />
                    <span className={`block w-6 h-0.5 bg-white transition-all duration-300 ${menuOpen ? '-rotate-45 -translate-y-2' : ''}`} />
                </button>
            </nav>

            {/* Mobile Menu */}
            <div className={`md:hidden relative overflow-hidden transition-all duration-300 ${menuOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'}`}>
                <div className="absolute inset-0 bg-[#0f0f16]/95 backdrop-blur-2xl border-b border-white/[0.06]" />
                <div className="relative mx-auto container sm:px-10 px-5 pb-4">
                    <ul className="flex flex-col gap-2 list-none py-4">
                        {navLinks}
                    </ul>

                    <div className="pt-4 border-t border-white/[0.06]">
                        <SignedOut>
                            <SignInButton mode="modal">
                                <button
                                    className="w-full bg-indigo-600 hover:bg-indigo-500 text-white px-4 py-3 rounded-lg transition-colors font-medium text-sm"
                                    onClick={closeMenu}
                                >
                                    Sign In
                                </button>
                            </SignInButton>
                        </SignedOut>
                        <SignedIn>
                            <div className="flex items-center gap-3">
                                <span className="text-light-200/60 text-sm">Signed in as</span>
                                <UserButton afterSignOutUrl="/" />
                            </div>
                        </SignedIn>
                    </div>
                </div>
            </div>
        </header>
    );
}