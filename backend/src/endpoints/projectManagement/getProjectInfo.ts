import { withErrorHandling } from "@/middleware/errorMiddleware.ts";
import { normalizeDomain } from "@/utils/domainUtils.ts";
import { Endpoint, PayloadRequest } from "payload";

interface BacklinkData {
    domain: string;
    rd: number;
    tf: number;
    cf: number;
    price: number;
    ttf : string;
    source: string;
    allSources: { marketplace_source: string; price: number }[];
}

// Define the Project interface
interface Project {
    projectName: string;
    domainName: string;
    favourites?: string[]; // Favourites is optional, as it may not always be provided
}

export const getUserProjectInfo: Endpoint = {
    path: "/getProjectItemInfo",
    method: 'get',

    handler: withErrorHandling(async (req: PayloadRequest): Promise<Response> => {

        const { payload } = req;

        // CORS headers
        const corsHeaders = {
            "Access-Control-Allow-Origin": "*", // You can replace '*' with specific domains for security reasons
            "Access-Control-Allow-Methods": "GET, OPTIONS, PUT, POST, DELETE",
            "Access-Control-Allow-Headers": "Content-Type, Authorization",
            "Access-Control-Allow-Credentials": "true"
        };

        if (req.method === "OPTIONS") {
            // Handle preflight requests
            return new Response(null, {
                status: 204,
                headers: {
                    ...corsHeaders
                },
            });
        }

        const { email, projectName } = req.query;

        if (!email || !projectName) {
            return new Response(
                JSON.stringify({ error: "Both email and projectName are required" }),
                {
                    status: 400,
                    headers: {
                        "Content-Type": "application/json",
                        ...corsHeaders
                    },
                }
            );
        }

        // Fetch the user by email
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
                        ...corsHeaders
                    },
                }
            );
        }

        // Extract the user's projects and ensure it's an array of Project
        const user = users.docs[0];

        // If projects exist, narrow down the type to Project[]
        let projects: Project[] = [];

        if (Array.isArray(user.projects)) {
            projects = user.projects as Project[]; // Type assertion to Project[] if it's an array
        } else {
            // Handle case where projects might not be an array or may be undefined
            return new Response(
                JSON.stringify({ error: "User projects are not available or not in the expected format" }),
                {
                    status: 500,
                    headers: {
                        "Content-Type": "application/json",
                        ...corsHeaders
                    },
                }
            );
        }

        // Find the project that matches the provided projectName
        const matchingProject = projects.find((project) => project.projectName === projectName);

        if (!matchingProject) {
            return new Response(
                JSON.stringify({ error: `Project not found for projectName: ${projectName}` }),
                {
                    status: 404,
                    headers: {
                        "Content-Type": "application/json",
                        ...corsHeaders
                    },
                }
            );
        }

        const favouriteProjectName = matchingProject.projectName;
        const favouritesLength = matchingProject.favourites?.length;

        const domains = matchingProject.favourites || [];

        const batchSize = 1000;
        const backlinksData: { docs: {
            domain : string;
            marketplaces : [
                {
                    marketplace_source : string;
                    price : number;
                }
            ]
            keyword : string;
            ttf : string;
            rd : number;
            tf : number;
            cf : number;
        }[] } = { docs: [] };

        // Batch process the domains to avoid query size limits
        for (let i = 0; i < domains.length; i += batchSize) {
            const batch = domains.slice(i, i + batchSize);
            const result = await req.payload.find({
                collection: 'backlinks',
                where: { domain: { in: batch } },
                limit: batchSize,
            });

            const mappedDocs = result.docs.map((doc: any) => ({
                ...doc,
                allSources: doc.marketplaces.map((marketplace: {marketplace_source : string; price : number}) => ({
                    marketplace_source: marketplace.marketplace_source,
                    price: marketplace.price,
                })),
            }));

            backlinksData.docs.push(...mappedDocs);
        }

        // Filter to get unique domains with the smallest price
        const backlinksMap: Record<string, BacklinkData> = {};

        const backlinkPromises = backlinksData.docs.map((doc) => {
            const normalizedDocDomain = normalizeDomain(doc.domain);

            if (normalizedDocDomain) {
            const existingBacklink = backlinksMap[doc.domain];

                const minMarketplace = doc.marketplaces.reduce((min, current) =>
                    current.price < min.price ? current : min
                );

                if (!existingBacklink || minMarketplace.price < existingBacklink.price) {
                    backlinksMap[doc.domain] = {
                        domain: doc.domain,
                        rd: doc.rd || 0,
                        tf: doc.tf || 0,
                        cf: doc.cf || 0,
                        price: minMarketplace.price,
                        ttf : doc.ttf ? doc.ttf : "",
                        source: minMarketplace.marketplace_source,
                        allSources: doc.marketplaces.map((marketplace) => ({
                        marketplace_source: marketplace.marketplace_source,
                        price: marketplace.price,
                        })),
                    };
                }
            }
        });

        await Promise.all(backlinkPromises);

        const backlinks = Object.values(backlinksMap);

        const foundDomains = backlinks.map((backlink) => backlink.domain);
        const minPrice = backlinks.reduce(
            (total, backlink) => total + backlink.price,
            0
        );
        const avgPrice = Math.floor(minPrice / foundDomains.length);
        const maxPrice = backlinks
            .map((backlink) => Math.max(...backlink.allSources.map((source) => source.price)))
            .reduce((sum, price) => sum + price, 0);

        const aboutPrice = [favouritesLength, avgPrice, minPrice, maxPrice];



        // Respond with the processed data
        return new Response(
            JSON.stringify({
                keys: [favouriteProjectName],
                aboutPrice,
                backlinks,
            }),
            { status: 200, headers: { 'Content-Type': 'application/json', ...corsHeaders } }
        );
    })
};
