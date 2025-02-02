import { withErrorHandling } from "@/middleware/errorMiddleware.ts";
import { Project } from "@/types/project.js";
import { Endpoint, PayloadRequest } from "payload";

export const removeFavoriteFromProject: Endpoint = {
    path: "/remove-project",
    method: "delete",
    handler: withErrorHandling(async (req: PayloadRequest): Promise<Response> => {
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
        let favouriteToRemove: string | undefined;

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

        const users = await payload.find({
            collection: "users",
            where: { email: { equals: email } },
            limit: 1,
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

        let updated = false;
        let updatedProjects: Project[];

        if (projectName) {
            // 🔥 Remove entire project if no favourite is specified
            updatedProjects = existingProjects.filter(project => project.projectName !== projectName);
            updated = updatedProjects.length !== existingProjects.length;
        } else {
            // 🔥 Remove specific favorite efficiently
            updatedProjects = existingProjects.map((project) => {
                if (project.projectName === projectName && favouriteToRemove) {
                    const newFavourites = project.favourites.filter((fav) => fav !== favouriteToRemove);
                    if (newFavourites.length !== project.favourites.length) {
                        updated = true;
                    }
                    return { ...project, favourites: newFavourites };
                }
                return project;
            });
        }

        if (!updated) {
            return new Response(JSON.stringify({ error: "Favorite not found in project" }), { status: 404 });
        }

        await payload.update({
            collection: "users",
            where: { email: { equals: email } },
            data: { projects: updatedProjects },
        });

        return new Response(JSON.stringify({ message: "Favorite removed successfully" }), { status: 200 });
    }),
};
