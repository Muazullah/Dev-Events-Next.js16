import { isAdmin } from "@/lib/isAdmin";
import Navbar from "@/components-temp/Navbar";

export default async function NavbarWrapper() {
    const admin = await isAdmin();
    return <Navbar isAdmin={admin} />;
}