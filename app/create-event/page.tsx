import { redirect } from "next/navigation";
import { isAdmin } from "@/lib/isAdmin";
import CreateEventForm from "@/components-temp/CreateEventForm";

export default async function CreateEventPage() {
    const admin = await isAdmin();

    if (!admin) {
        redirect("/");
    }

    return <CreateEventForm />;
}