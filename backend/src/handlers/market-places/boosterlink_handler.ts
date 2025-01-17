import { PayloadRequest } from "payload";
import { MARKETPLACE_NAME_BOOSTERLINK, COLLECTION_NAME_BACKLINK } from "@/global/strings.ts";
import { getBacklinksDataFromBoosterlink } from "@/services/marketPlacesService/getBacklinksFromMarketplaces/boosterlink.ts";
import { handleNoDataResponse, handleSuccessResponse } from "@/utils/responseUtils.ts";
import { ErrorHandler } from "../errorHandler.ts";
import { Marketplace } from "@/types/backlink.ts";

export const boosterlinkHandler = async (req: PayloadRequest) : Promise<Response> => {

    const { payload } = req;

    try{
        const BoosterlinkData = await getBacklinksDataFromBoosterlink();

        if (!Array.isArray(BoosterlinkData) || BoosterlinkData.length === 0) {
            return handleNoDataResponse(MARKETPLACE_NAME_BOOSTERLINK);
        }

        const totalItems = BoosterlinkData.length;
        let processedItems = 0;

        const savePromises = BoosterlinkData.map(async (item) => {
            const domain = item.domain.toLowerCase().trim();
            const TF = Number(item.tf);
            const price = Number(item.price);

            if (!domain || isNaN(TF) || isNaN(price)) {
                throw new Error(`Invalid data received for domain : ${domain}, TF=${item.tf}, price=${item.price}`);
            }

            const existingEntry = await payload.find({
                collection: COLLECTION_NAME_BACKLINK,
                where: {
                    Domain: { equals: domain },
                    "Marketplaces.Marketplace_Source": { equals: MARKETPLACE_NAME_BOOSTERLINK },
                },
                limit : 1
            });

            if (existingEntry.docs.length > 0) {
                const entryToUpdate = existingEntry.docs[0];
                const marketplaces : Marketplace[] = entryToUpdate.Marketplaces.map((marketplace: Marketplace) =>
                    marketplace.Marketplace_Source === MARKETPLACE_NAME_BOOSTERLINK
                        ? { ...marketplace, Price: price }
                        : marketplace
                    );

                    await payload.update({
                        collection: COLLECTION_NAME_BACKLINK,
                        id: entryToUpdate.id,
                        data: {
                            TF,
                            Marketplaces: marketplaces,
                            Date_Fetched: new Date().toISOString(),
                    },
                });
            } else {
                await payload.create({
                    collection: COLLECTION_NAME_BACKLINK,
                    data: {
                        Domain: item.domain,
                        TF,
                        Marketplaces: [
                            {
                                Marketplace_Source: MARKETPLACE_NAME_BOOSTERLINK,
                                Price: price,
                            },
                        ],
                        Date_Fetched: new Date().toISOString(),
                    },
                });
            }

            processedItems += 1;
            const progress = Math.round((processedItems / totalItems) * 100);
            console.log(`${MARKETPLACE_NAME_BOOSTERLINK} database uploading progress: ${progress}%`);
        });

        await Promise.all(savePromises);

        return handleSuccessResponse(BoosterlinkData, MARKETPLACE_NAME_BOOSTERLINK);

    }catch(error){
        const { errorDetails, status } = ErrorHandler.handle(error, "Processing Boosterlink Data");
        return new Response(JSON.stringify(errorDetails), {
            status,
            headers: { "Content-Type": "application/json" },
        });
    }
};
