import { currentUser } from "@clerk/nextjs/server";
import { ADMIN_EMAILS } from "./admin";

export async function isAdmin() {
    const user = await currentUser();
    if (!user) return false;
    return ADMIN_EMAILS.includes(user.emailAddresses[0]?.emailAddress);
}