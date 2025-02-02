import payload, { PayloadRequest } from "payload";

// ✅ Define a Project Interface for Type Safety
interface Project {
    projectName: string;
    domainName: string;
    favourites: string[];
}

export async function GET(req: PayloadRequest) {

    const { email } = req.query;

    try {

        if (!email) {
            return new Response(
                JSON.stringify({ error: "Email is required" }),
                {
                    status: 400,
                    headers: {
                        "Content-Type": "application/json",
                        "Access-Control-Allow-Origin": "*",
                    },
                }
            );
        }

        // 🔍 Find user by email
        const users = await payload.find({
            collection: "users",
            where: { email: { equals: email } },
            limit : 1
        });

        if (!users.docs.length) {
            return new Response(
                JSON.stringify(`❌ Error: User not found for email: ${email}`),
                {
                    status: 400,
                    headers: {
                        "Content-Type": "application/json",
                        "Access-Control-Allow-Origin": "*",
                    },
                }
            );
        }

        const user = users.docs[0];

        return new Response(JSON.stringify(user.projects ?? []), { status: 200 });
    } catch (error) {
        console.error(`❌ Error fetching projects for email: ${email}`, error);
        return new Response(JSON.stringify({ error: "Internal server error" }), { status: 500 });
    }
}

export async function POST(req: PayloadRequest) : Promise<Response> {

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

    let projectName: string | undefined;
    let domainName: string | undefined;
    let favourites: string[] | undefined;
    let email: string | undefined;

    try {

        if(req.json){
            const body = await req.json();
            email = body?.email;
            projectName = body?.projectName;
            domainName = body?.domainName;
            favourites = body?.favourites;
        }

        if (!email) {
            return new Response(
                JSON.stringify({ error: "Email is required" }),
                {
                    status: 400,
                    headers: {
                        "Content-Type": "application/json",
                        "Access-Control-Allow-Origin": "*",
                    },
                }
            );
        }

        if(!projectName || !domainName || !favourites){
            return new Response(
                JSON.stringify({ error: "Missing projectName, domainName, or favourites" }),
                {
                    status: 400,
                    headers: {
                        "Content-Type": "application/json",
                        "Access-Control-Allow-Origin": "*",
                    },
                }
            );
        }

        // 🔍 Find user by email
        const users = await payload.find({
            collection: "users",
            where: { email: { equals: email } },
            limit : 1
        });

        if (!users.docs.length) {
            return new Response(
                JSON.stringify(`❌ Error: User not found for email: ${email}`),
                {
                    status: 400,
                    headers: {
                        "Content-Type": "application/json",
                        "Access-Control-Allow-Origin": "*",
                    },
                }
            );
        }

        const user = users.docs[0];

        // ✅ Ensure `projects` is an array
        const existingProjects: Project[] = Array.isArray(user.projects) ? (user.projects as Project[]) : [];

        // ✅ Define new project correctly
        const newProject: Project = { projectName, domainName, favourites };

        // ✅ Update project list
        const updatedProjects: Project[] = [...existingProjects, newProject];

        // ✅ Update user data in Payload CMS
        await payload.update({
            collection: "users",
            where: {
                email: {
                    equals: email,
                },
            },
            data: { projects: updatedProjects },
        });

        return new Response(JSON.stringify({ message: "Project added successfully", project: newProject }),
            {
            status: 201,
            });
    } catch (error) {
        console.error(`❌ Error adding project for email: ${email}`, error);
        return new Response(JSON.stringify({ error: "Internal server error" }), { status: 500 });
    }
}

export async function PUT(req: PayloadRequest) {

    const {payload} = req;

    if (req.method === "OPTIONS") {
        // Handle preflight requests
        return new Response(null, {
            status: 204,
            headers: {
                "Access-Control-Allow-Origin": "*",
                "Access-Control-Allow-Methods": "PUT, OPTIONS",
                "Access-Control-Allow-Headers": "Content-Type, Authorization",
            },
        });
    }
    let projectName: string | undefined;
    let domainName: string | undefined;
    let favourites: string[] | undefined;
    let email: string | undefined;

    try {

        if(req.json){
            const body = await req.json();
            email = body?.email;
            projectName = body?.projectName;
            domainName = body?.domainName;
            favourites = body?.favourites;
        }

        if (!email) {
            return new Response(
                JSON.stringify({ error: "Email is required" }),
                {
                    status: 400,
                    headers: {
                        "Content-Type": "application/json",
                        "Access-Control-Allow-Origin": "*",
                    },
                }
            );
        }

        // 🔍 Find user by email
        const users = await payload.find({
            collection: "users",
            where: { email: { equals: email } },
            limit : 1
        });


        if (!users.docs.length) {
            return new Response(
                JSON.stringify(`❌ Error: User not found for email: ${email}`),
                {
                    status: 400,
                    headers: {
                        "Content-Type": "application/json",
                        "Access-Control-Allow-Origin": "*",
                    },
                }
            );
        }

        const user = users.docs[0];

        // ✅ Ensure projects array is correctly typed
        const existingProjects: Project[] = Array.isArray(user.projects) ? (user.projects as Project[]) : [];

        // 🔥 Efficiently update projects
        let updated = false;
        const updatedProjects: Project[] = existingProjects.map((project) => {
            if (project.projectName === projectName) {
                if (!domainName || !favourites) {
                    throw new Error("domainName and favourites must be defined");
                }
                updated = true;
                return { ...project, domainName, favourites };
            }
            return project;
        });

        if (!updated) {
            return new Response(JSON.stringify({ error: "Project not found" }), { status: 404 });
        }

        await payload.update({
            collection: "users",
            where: {
                email: {
                    equals: email,
                },
            },
            data: { projects: updatedProjects },
        });

        return new Response(JSON.stringify({ message: "Project updated successfully" }), { status: 200 });
    } catch (error) {
        console.error(`❌ Error updating project for email: ${email}`, error);
        return new Response(JSON.stringify({ error: "Internal server error" }), { status: 500 });
    }
}

export async function DELETE(req: PayloadRequest) {

    const { payload } = req;

    if (req.method === "OPTIONS") {
        // Handle preflight requests
        return new Response(null, {
            status: 204,
            headers: {
                "Access-Control-Allow-Origin": "*",
                "Access-Control-Allow-Methods": "DELETE, OPTIONS",
                "Access-Control-Allow-Headers": "Content-Type, Authorization",
            },
        });
    }

    let projectName: string | undefined;
    let email: string | undefined;
    let favouriteToRemove: string | undefined
    try {
        if(req.json){
            const body = await req.json();
            email = body?.email;
            projectName = body?.projectName;
            favouriteToRemove = body?.favToRemove;
        }

        if (!email) {
            return new Response(
                JSON.stringify({ error: "Email is required" }),
                {
                    status: 400,
                    headers: {
                        "Content-Type": "application/json",
                        "Access-Control-Allow-Origin": "*",
                    },
                }
            );
        }

        // 🔍 Find user by email
        const users = await payload.find({
            collection: "users",
            where: { email: { equals: email } },
            limit : 1
        });

        if (!users.docs.length) {
            return new Response(
                JSON.stringify(`❌ Error: User not found for email: ${email}`),
                {
                    status: 400,
                    headers: {
                        "Content-Type": "application/json",
                        "Access-Control-Allow-Origin": "*",
                    },
                }
            );
        }

        const user = users.docs[0];

        // ✅ Ensure projects array is correctly typed
        const existingProjects: Project[] = Array.isArray(user.projects) ? (user.projects as Project[]) : [];

        // 🔥 Remove specific favorite efficiently
        let updated = false;
        const updatedProjects: Project[] = existingProjects.map((project) => {
            if (project.projectName === projectName) {
                const newFavourites = project.favourites.filter((fav) => fav !== favouriteToRemove);
                if (newFavourites.length !== project.favourites.length) {
                updated = true;
                }
                return { ...project, favourites: newFavourites };
            }
            return project;
        });

        if (!updated) {
            return new Response(JSON.stringify({ error: "Favorite not found in project" }), { status: 404 });
        }

        await payload.update({
            collection: "users",
            where: { email: { equals: email } },
            data: { projects: updatedProjects },
        });

        return new Response(null, { status: 204 });
    } catch (error) {
        console.error(`❌ Error removing favorite '${favouriteToRemove}' from project '${projectName}' for email: ${email}`, error);
        return new Response(JSON.stringify({ error: "Internal server error" }), { status: 500 });
    }
}
