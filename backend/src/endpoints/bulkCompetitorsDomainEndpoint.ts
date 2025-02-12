import { Endpoint } from "payload";
import { withErrorHandling } from "@/middleware/errorMiddleware.ts";
import { handleBulkCompetitiveAnalysis } from "@/handlers/getRefferingDomainsHandler.ts";

export const bulkCompetitiveAnalysisEndpoint: Endpoint = {
    path: '/bulkCompetitors',
    method: 'post',

    handler: withErrorHandling(handleBulkCompetitiveAnalysis)
};
