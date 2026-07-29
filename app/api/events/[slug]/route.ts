import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { isAdmin } from "@/lib/isAdmin";
import connectDB from "@/lib/mongodb";
import Event from "@/database/event.model";
import cloudinary from "@/lib/cloudinary";
import { revalidatePath } from "next/cache";
import { headers } from "next/headers";

type RouteParams = {
  params: Promise<{ slug: string }>;
};

async function checkAdminWithRetry(retries = 3): Promise<boolean> {
  for (let i = 0; i < retries; i++) {
    try {
      return await isAdmin();
    } catch (err) {
      if (i === retries - 1) throw err;
      await new Promise(r => setTimeout(r, 500));
    }
  }
  return false;
}

export async function GET(
  req: NextRequest,
  { params }: RouteParams
): Promise<NextResponse> {
  try {
    await headers();
    await connectDB();
    const { slug } = await params;

    if (!slug?.trim()) {
      return NextResponse.json(
        { message: "Invalid or missing slug" },
        { status: 400 }
      );
    }

    const event = await Event.findOne({ slug: slug.trim().toLowerCase() }).lean();

    if (!event) {
      return NextResponse.json(
        { message: `Event with slug '${slug}' not found` },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { message: "Event fetched successfully", event },
      { status: 200 }
    );
  } catch (error) {
    if (process.env.NODE_ENV === "development") {
      console.error("[GET /api/events/[slug]]", error);
    }
    return NextResponse.json(
      { message: "Failed to fetch event", error: String(error) },
      { status: 500 }
    );
  }
}

export async function PATCH(
  req: NextRequest,
  { params }: RouteParams
): Promise<NextResponse> {
  try {
    await headers();

    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ message: "Please sign in." }, { status: 401 });
    }

    const admin = await checkAdminWithRetry();
    if (!admin) {
      return NextResponse.json(
        { message: "Only admins can edit events." },
        { status: 403 }
      );
    }

    await connectDB();
    const { slug } = await params;

    const existingEvent = await Event.findOne({ slug: slug.trim().toLowerCase() });
    if (!existingEvent) {
      return NextResponse.json(
        { message: "Event not found" },
        { status: 404 }
      );
    }

    const formData = await req.formData();

    const title = (formData.get("title") as string)?.trim();
    const description = (formData.get("description") as string)?.trim();
    const overview = (formData.get("overview") as string)?.trim();
    const venue = (formData.get("venue") as string)?.trim();
    const location = (formData.get("location") as string)?.trim();
    const date = formData.get("date") as string;
    const time = formData.get("time") as string;
    const mode = formData.get("mode") as string;
    const audience = (formData.get("audience") as string)?.trim();
    const organizer = (formData.get("organizer") as string)?.trim();
    const isPaid = formData.get("isPaid") === "true";
    const price = parseFloat(formData.get("price") as string) || 0;
    const currency = (formData.get("currency") as string) || "PKR";
    const capacity = parseInt(formData.get("capacity") as string) || 100;
    const imageFile = formData.get("image") as File | null;

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

    let newSlug = existingEvent.slug;
    if (title !== existingEvent.title) {
      const baseSlug = title
        .toLowerCase()
        .replace(/[^a-z0-9\s-]/g, "")
        .replace(/\s+/g, "-")
        .replace(/-+/g, "-")
        .replace(/^-|-$/g, "");

      let candidate = baseSlug;
      let counter = 1;
      while (
        await Event.findOne({
          slug: candidate,
          _id: { $ne: existingEvent._id },
        })
      ) {
        candidate = `${baseSlug}-${counter}`;
        counter++;
      }
      newSlug = candidate;
    }

    let imageUrl = existingEvent.image;

    if (imageFile && imageFile.size > 0) {
      try {
        const arrayBuffer = await imageFile.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);

        const result = await new Promise<{ secure_url: string; public_id: string }>(
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

        imageUrl = result.secure_url;

        const oldPublicId = extractPublicId(existingEvent.image);
        if (oldPublicId) {
          cloudinary.uploader.destroy(oldPublicId).catch((err) =>
            console.error("Failed to delete old image:", err)
          );
        }
      } catch (error) {
        console.error("Image upload failed:", error);
        return NextResponse.json(
          { message: "Image upload failed" },
          { status: 500 }
        );
      }
    }

    const updatedEvent = await Event.findByIdAndUpdate(
      existingEvent._id,
      {
        $set: {
          title,
          slug: newSlug,
          description,
          overview,
          venue,
          location,
          date,
          time,
          mode,
          audience,
          organizer,
          tags,
          agenda,
          image: imageUrl,
          isPaid,
          price,
          currency,
          capacity,
          updatedAt: new Date(),
        },
      },
      { new: true, runValidators: true }
    );

    revalidatePath("/");
    revalidatePath("/events");
    revalidatePath(`/events/${slug}`);
    if (newSlug !== slug) {
      revalidatePath(`/events/${newSlug}`);
    }

    return NextResponse.json(
      {
        message: "Event updated successfully",
        event: updatedEvent,
        redirectSlug: newSlug !== slug ? newSlug : null,
      },
      { status: 200 }
    );
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Unknown error";
    console.error("[PATCH /api/events/[slug]]", error);
    return NextResponse.json(
      { message: "Event update failed", error: message },
      { status: 500 }
    );
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: RouteParams
): Promise<NextResponse> {
  try {
    await headers();

    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ message: "Please sign in." }, { status: 401 });
    }

    const admin = await checkAdminWithRetry();
    if (!admin) {
      return NextResponse.json(
        { message: "Only admins can delete events." },
        { status: 403 }
      );
    }

    await connectDB();
    const { slug } = await params;

    const event = await Event.findOne({ slug: slug.trim().toLowerCase() });
    if (!event) {
      return NextResponse.json(
        { message: "Event not found" },
        { status: 404 }
      );
    }

    const publicId = extractPublicId(event.image);
    if (publicId) {
      try {
        await cloudinary.uploader.destroy(publicId);
      } catch (err) {
        console.error("Failed to delete image:", err);
      }
    }

    await Event.findByIdAndDelete(event._id);

    revalidatePath("/");
    revalidatePath("/events");

    return NextResponse.json(
      { message: "Event deleted successfully" },
      { status: 200 }
    );
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Unknown error";
    console.error("[DELETE /api/events/[slug]]", error);
    return NextResponse.json(
      { message: "Event deletion failed", error: message },
      { status: 500 }
    );
  }
}

function extractPublicId(url: string): string | null {
  if (!url?.includes("cloudinary.com")) return null;
  const match = url.match(/\/image\/upload\/(?:v\d+\/)?(.+?)\.[a-zA-Z]+$/);
  return match ? match[1] : null;
}