import { currentUser } from "@clerk/nextjs/server";

export default async function TestPage() {
    const user = await currentUser();

    return (
        <pre>
            {JSON.stringify(user, null, 2)}
        </pre>
    );
}