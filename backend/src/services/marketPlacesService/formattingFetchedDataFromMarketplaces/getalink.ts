import { ErrorHandler } from "@/handlers/errorHandler.ts";
import { FetchedBackLinkDataFromMarketplace } from "@/types/backlink.ts";
interface GetalinkResponse {
    data: {
        url: string;
        tf: number;
        cf: number;
        rd: number;
        precio_usuario: number;
        idioma : string;
        medio_categorias : {
            category : {
                id : number;
                nombre : string;
                estado : number;
            };
            extra : number | null;
        }[];
    }[];
}

export const getFormDataFromGetalink = async (response: string): Promise<FetchedBackLinkDataFromMarketplace[] | null> => {
    // Ensure response is valid
    if (!response) {
        throw new Error("No response data");
    }

    try {
        // If `response` is a string, parse it
        const GetalinkResponse : GetalinkResponse = typeof response === "string" ? JSON.parse(response) : response;

        // Validate that the parsed response has a `data` property
        if (!GetalinkResponse.data || !Array.isArray(GetalinkResponse.data)) {
            throw new Error("Invalid response format: missing 'data' array");
        }

        // Extract relevant data
        const extractedData: FetchedBackLinkDataFromMarketplace[] = GetalinkResponse.data.map((item) => {
            let domain = "";

            if (item.url) {
                try {
                    // If the `url` contains a valid URL, extract the hostname
                    domain = new URL(item.url).hostname;
                } catch {
                    // If the `url` is not a valid URL, assume it is a domain name
                    domain = item.url;
                }
            }

            const formattedDomain = domain
                .replace(/^(https?:\/\/)?(www\.)?/, "") // Remove protocol and "www."
                .replace(/\/$/, ""); // Remove trailing slash

                const largestTTF = item.medio_categorias?.length
                    ? item.medio_categorias.reduce(
                        (
                            max: {
                                category: { id: number; nombre: string; estado: number };
                                extra: number | null;
                            },
                            current: {
                                category: { id: number; nombre: string; estado: number };
                                extra: number | null;
                            }
                        ) => {
                            // Skip entries with missing or invalid category
                            if (!current || !current.category) {
                                console.warn("Invalid or missing category in medio_categorias:", current);
                                return max;
                            }

                            // Always pick the first valid category if `max.extra` and `current.extra` are null
                            if (max.extra === null && current.extra === null) {
                                return max.category.id === 0 ? current : max;
                            }

                            const currentCategory = {
                                category: {
                                    id: current.category.id,
                                    nombre: current.category.nombre, // Map 'nombre' to 'name'
                                    estado: current.category.estado, // Map 'estado' to 'status'
                                },
                                extra: current.extra, // May be null
                            };

                            // Handle null `extra` values by comparing only if `current.extra` exists
                            return currentCategory.extra !== null && (max.extra === null || currentCategory.extra > max.extra)
                                ? currentCategory
                                : max;
                        },
                        {
                            category: { id: 0, nombre: "", estado: 0 },
                            extra: null,
                        }
                    )
                : { category: { id: 0, nombre: "", estado: 0 }, extra: null };

            return {
                domain : formattedDomain || "unknown", // Use the processed domain or extracted hostname
                tf: item.tf || 0, // Default to 0 if tf is missing
                cf: item.cf || 0, // Default to 0 if cf is missing
                rd: item.rd || 0, // Default to 0 if rd is missing
                price: item.precio_usuario || 0, // Default to 0 if price is missing
                language : item.idioma || '',
                ttf : largestTTF.category.nombre,
            };
        });

        return extractedData;

    } catch (error) {
        const { errorDetails, status } = ErrorHandler.handle(error, "Error Formatting Data For Getalink");

        console.log(errorDetails, status);

        return null;
    }
};
