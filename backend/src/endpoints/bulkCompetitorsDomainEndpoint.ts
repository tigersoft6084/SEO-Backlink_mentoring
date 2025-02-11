import { Endpoint, PayloadRequest } from "payload";
import { COLLECTION_NAME_BACKLINK } from "@/globals/strings.ts";
import { withErrorHandling } from "@/middleware/errorMiddleware.ts";
import { fetchRefDomains } from "@/services/majestic/getRefDomains.ts";
import { handleBulkCompetitiveAnalysis } from "@/handlers/getRefferingDomainsHandler.ts";

export const bulkCompetitiveAnalysisEndpoint: Endpoint = {
    path: '/bulkCompetitors',
    method: 'post',

    handler: withErrorHandling(handleBulkCompetitiveAnalysis)
};
