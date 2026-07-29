import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { isAdmin } from "@/lib/isAdmin";
import connectDB from "@/lib/mongodb";
import Event from "@/database/event.model";
import cloudinary from "@/lib/cloudinary";
import { revalidatePath } from "next/cache";
import { headers } from "next/headers";

export async function GET(request: NextRequest) {
    try {
        await headers();
        await connectDB();

        const { searchParams } = new URL(request.url);

        const page = Math.max(1, parseInt(searchParams.get("page") || "1", 10));
        const limit = Math.min(50, Math.max(1, parseInt(searchParams.get("limit") || "9", 10)));
        const search = searchParams.get("search")?.trim();
        const tag = searchParams.get("tag")?.trim().toLowerCase();
        const mode = searchParams.get("mode")?.trim();
        const isPaid = searchParams.get("isPaid");

        const query: Record<string, unknown> = {};

        if (search) {
            query.$or = [
                { title: { $regex: search, $options: "i" } },
                { description: { $regex: search, $options: "i" } },
            ];
        }

        if (tag) {
            query.tags = { $in: [tag] };
        }

        if (mode && ["online", "offline", "hybrid"].includes(mode)) {
            query.mode = mode;
        }

        if (isPaid !== undefined && isPaid !== "") {
            query.isPaid = isPaid === "true";
        }

        const skip = (page - 1) * limit;

        const [events, totalCount] = await Promise.all([
            Event.find(query).sort({ createdAt: -1 }).skip(skip).limit(limit).lean(),
            Event.countDocuments(query),
        ]);

        const totalPages = Math.ceil(totalCount / limit);

        return NextResponse.json({
            events,
            pagination: {
                page,
                limit,
                totalCount,
                totalPages,
                hasNextPage: page < totalPages,
                hasPrevPage: page > 1,
            },
        });
    } catch (error) {
        console.error("[GET /api/events]", error);
        return NextResponse.json(
            { message: "Failed to fetch events" },
            { status: 500 }
        );
    }
}

export async function POST(req: NextRequest) {
    await headers();

    const { userId } = await auth();
    if (!userId) {
        return NextResponse.json(
            { message: "Please sign in." },
            { status: 401 }
        );
    }

    const admin = await isAdmin();
    if (!admin) {
        return NextResponse.json(
            { message: "Only admins can create events." },
            { status: 403 }
        );
    }

    try {
        await connectDB();
        const formData = await req.formData();

        const title = (formData.get("title") as string)?.trim();
        const description = (formData.get("description") as string)?.trim();
        const overview = (formData.get("overview") as string)?.trim();
        const venue = (formData.get("venue") as string)?.trim();
        const location = (formData.get("location") as string)?.trim();
        const date = formData.get("date") as string;
        const time = formData.get("time") as string;
        const mode = (formData.get("mode") as string) || "online";
        const audience = (formData.get("audience") as string)?.trim();
        const organizer = (formData.get("organizer") as string)?.trim();
        const isPaid = formData.get("isPaid") === "true";
        const price = parseFloat(formData.get("price") as string) || 0;
        const currency = (formData.get("currency") as string) || "PKR";
        const capacity = parseInt(formData.get("capacity") as string) || 100;

        let tags: string[] = [];
        let agenda: string[] = [];
        try {
            const tagsRaw = formData.get("tags") as string;
            const agendaRaw = formData.get("agenda") as string;
            if (tagsRaw) tags = JSON.parse(tagsRaw);
            if (agendaRaw) agenda = JSON.parse(agendaRaw);
        } catch {
            return NextResponse.json(
                { message: "Invalid tags or agenda format" },
                { status: 400 }
            );
        }

        if (!title || title.length < 3) {
            return NextResponse.json(
                { message: "Title must be at least 3 characters" },
                { status: 400 }
            );
        }

        if (isPaid && price <= 0) {
            return NextResponse.json(
                { message: "Paid events must have a price greater than 0" },
                { status: 400 }
            );
        }

        const file = formData.get("image") as File;
        if (!file || file.size === 0) {
            return NextResponse.json(
                { message: "Image file is required" },
                { status: 400 }
            );
        }

        const arrayBuffer = await file.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);

        const uploadResult = await new Promise<{ secure_url: string; public_id: string }>(
            (resolve, reject) => {
                cloudinary.uploader.upload_stream(
                    { folder: "events", resource_type: "image" },
                    (error, result) => {
                        if (error || !result) reject(error);
                        else resolve(result as { secure_url: string; public_id: string });
                    }
                ).end(buffer);
            }
        );

        const baseSlug = title
            .toLowerCase()
            .replace(/[^a-z0-9\s-]/g, "")
            .replace(/\s+/g, "-")
            .replace(/-+/g, "-")
            .replace(/^-|-$/g, "");

        let slug = baseSlug;
        let counter = 1;
        while (await Event.findOne({ slug })) {
            slug = `${baseSlug}-${counter}`;
            counter++;
        }

        const event = await Event.create({
            title,
            slug,
            description,
            overview,
            image: uploadResult.secure_url,
            venue,
            location,
            date,
            time,
            mode,
            audience,
            organizer,
            tags,
            agenda,
            isPaid,
            price,
            currency,
            capacity,
            bookingsCount: 0,
        });

        revalidatePath("/");
        revalidatePath("/events");

        return NextResponse.json(
            { message: "Event created successfully", event },
            { status: 201 }
        );
    } catch (error: any) {
        console.error("[POST /api/events]", error);
        return NextResponse.json(
            { message: "Event creation failed", error: error.message },
            { status: 500 }
        );
    }
}