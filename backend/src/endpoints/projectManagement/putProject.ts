import { withErrorHandling } from "@/middleware/errorMiddleware.ts";
import { Project } from "@/types/project.js";
import { Endpoint, PayloadRequest } from "payload";

export const updateUserProject: Endpoint = {
    path: "/put-project",
    method: "put",

    handler: withErrorHandling(async (req: PayloadRequest): Promise<Response> => {
        const { payload } = req;

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
        let favourites: string[] | undefined;
        let email: string | undefined;

        if (req.json) {
            const body = await req.json();
            email = body?.email;
            projectName = body?.projectName;
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

        const users = await payload.find({
            collection: "users",
            where: { email: { equals: email } },
            limit: 1,
        });

        if (!users.docs.length) {
            return new Response(
                JSON.stringify({ error: `User not found for email: ${email}` }),
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
        let newFavouritesAdded = false;

        const updatedProjects: Project[] = existingProjects.map((project) => {
            if (project.projectName === projectName) {
                updated = true;

                // ✅ Ensure `favourites` is always an array before modifying it
                const currentFavourites = Array.isArray(project.favourites) ? project.favourites : [];

                // ✅ Only add new favourites that do not already exist
                const uniqueNewFavourites = favourites?.filter(fav => !currentFavourites.includes(fav)) || [];

                if (uniqueNewFavourites.length > 0) {
                    newFavouritesAdded = true;
                    return {
                        ...project,
                        favourites: [...currentFavourites, ...uniqueNewFavourites], // Append new favourites
                    };
                }
            }
            return project;
        });

        if (!updated) {
            return new Response(
                JSON.stringify({ error: "Project not found" }),
                { status: 404, headers: { "Content-Type": "application/json" } }
            );
        }

        if (!newFavouritesAdded) {
            return new Response(
                JSON.stringify({ success: true, message: "No new domains added, but project is still up to date" }),
                { status: 200, headers: { "Content-Type": "application/json" } }
            );
        }

        await payload.update({
            collection: "users",
            where: { email: { equals: email } },
            data: { projects: updatedProjects },
        });

        return new Response(
            JSON.stringify({ success: true, message: "Domains saved and Project updated successfully", updatedProjects }),
            { status: 200, headers: { "Content-Type": "application/json" } }
        );
    }),
};
