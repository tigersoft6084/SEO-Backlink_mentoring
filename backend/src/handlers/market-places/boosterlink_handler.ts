import { PayloadRequest } from "payload";
import { MARKETPLACE_NAME_BOOSTERLINK, COLLECTION_NAME_BACKLINK } from "@/global/strings.ts";
import { getBacklinksDataFromBoosterlink } from "@/services/marketPlacesService/getBacklinksFromMarketplaces/boosterlink.ts";
import { handleNoDataResponse, handleSuccessResponse } from "@/utils/responseUtils.ts";

export const boosterlinkHandler = async (req: PayloadRequest) : Promise<Response> => {

    const { payload } = req;

    const BoosterlinkData = await getBacklinksDataFromBoosterlink();

    if (!Array.isArray(BoosterlinkData) || BoosterlinkData.length === 0) {
        return handleNoDataResponse(MARKETPLACE_NAME_BOOSTERLINK);
    }

    const totalItems = BoosterlinkData.length;
    let processedItems = 0;

    const savePromises = BoosterlinkData.map(async (item) => {
        const title = String(item.title);
        const TF = Number(item.tf);
        const price = Number(item.price);

        if (isNaN(TF) || isNaN(price)) {
            throw new Error(`Invalid data received: TF=${item.tf}, price=${item.price}`);
        }

        const existingEntry = await payload.find({
            collection: COLLECTION_NAME_BACKLINK,
            where: {
                domain: { equals: item.domain },
                source: { equals: MARKETPLACE_NAME_BOOSTERLINK },
            },
        });

        if (existingEntry && existingEntry.totalDocs > 0) {
            const entryToUpdate = existingEntry.docs[0];
            await payload.update({
                collection: COLLECTION_NAME_BACKLINK,
                id: entryToUpdate.id,
                data: {
                    TF,
                    price,
                    dateFetched: new Date().toISOString(),
                },
            });
        } else {
            await payload.create({
                collection: COLLECTION_NAME_BACKLINK,
                data: {
                    domain: item.domain,
                    TF,
                    price,
                    Title: title,
                    source: MARKETPLACE_NAME_BOOSTERLINK,
                    dateFetched: new Date().toISOString(),
                },
            });
        }

        processedItems += 1;
        const progress = Math.round((processedItems / totalItems) * 100);
        console.log(`${MARKETPLACE_NAME_BOOSTERLINK} database uploading progress: ${progress}%`);
    });

    await Promise.all(savePromises);

    return handleSuccessResponse(BoosterlinkData, MARKETPLACE_NAME_BOOSTERLINK);
};
