import { isAdmin } from "@/lib/isAdmin";
import Navbar from "@/components/Navbar";

export default async function NavbarWrapper() {
    const admin = await isAdmin();
    return <Navbar isAdmin={admin} />;
}