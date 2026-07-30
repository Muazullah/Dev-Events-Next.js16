"use client";

import { useState, useEffect } from "react";

export default function Footer() {
    const [year, setYear] = useState(2024); // Fallback year for SSR

    useEffect(() => {
        // Only run on the client side after hydration
        setYear(new Date().getFullYear());
    }, []);

    return (
        <footer className="relative z-10 border-t border-white/[0.06] mt-20">
            <div className="mx-auto container sm:px-10 px-5 py-8">
                <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                    <div className="flex items-center gap-2">
                        <span className="text-lg font-bold italic text-white">EventNode</span>
                    </div>
                    <p className="text-light-200/60 text-sm">
                        The hub for every event you mustn&apos;t miss
                    </p>
                    <p className="text-light-200/40 text-xs">
                        © {year} EventNode. All rights reserved.
                    </p>
                </div>
            </div>
        </footer>
    );
}