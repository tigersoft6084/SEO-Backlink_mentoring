import { PayloadRequest } from "payload";

export const googleAuthHandler = async(req: PayloadRequest) : Promise<Response> => {

    const { payload } = req;

    if (req.method === "OPTIONS") {
        // Handle preflight requests
        return new Response(null, {
            status: 204,
            headers: {
                "Access-Control-Allow-Origin": "*",
                "Access-Control-Allow-Methods": "POST, OPTIONS",
                "Access-Control-Allow-Headers": "Content-Type, Authorization",
            },
        });
    }

    let email;
    let name: string | undefined;

    if (req.json) {
        const body = await req.json();
        email = body?.email;
        name = body?.name;
    }

    const sanitizedEmail: string = email.trim();

      // Find user by email
    const existingUser = await payload.find({
        collection: "users",
        where: { email: { equals: sanitizedEmail } },
    });

    let user;
    if (!existingUser.docs.length) {
        // ✅ Create user with properly validated email
        user = await payload.create({
            collection: "users",
            data: {
                email: sanitizedEmail,
                username: name || "Unknown User", // Default name if undefined
                authProvider: "google",
                role : "user"
            },
        });
    } else {
        user = existingUser.docs[0];
    }


    return new Response(
        JSON.stringify({ user }),
        { status: 200, headers: { 'Content-Type': 'application/json' } }
    );
}
