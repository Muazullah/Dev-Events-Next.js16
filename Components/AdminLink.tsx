import Link from "next/link";
import { isAdmin } from "@/lib/isAdmin";

export default async function AdminLink() {
    const admin = await isAdmin();

    if (!admin) return null;

    return (
        <li>
            <Link
                href="/create-event"
                className="text-sm font-medium text-indigo-400 hover:text-indigo-300 transition-colors flex items-center gap-1.5"
            >
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
                Create Event
            </Link>
        </li>
    );
}