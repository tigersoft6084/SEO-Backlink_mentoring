/**
     * Middleware to handle errors for API handlers.
     * @param handler The API handler function.
     * @returns A wrapped function with error handling.
 */
import { handleErrorResponse } from "@/utils/responseUtils.ts";
import { PayloadRequest } from 'payload';

export const withErrorHandling = (handler: (req: PayloadRequest) => Promise<Response>) => {

    return async (req: PayloadRequest) : Promise<Response> => {

        try {

            // Execute the original handler
            return await handler(req);

        } catch (error) {

            // Send a standardized error response
            return handleErrorResponse(error as Error, 'API Middleware');

        }

    };

};