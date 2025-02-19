import { googleAuthHandler } from "@/handlers/auth/googeAuthHanlder.ts";
import { withErrorHandling } from "@/middleware/errorMiddleware.ts";
import { Endpoint } from "payload";

export const googleAuthEndpoint : Endpoint = {

    path : '/auth/google/callback',

    method : 'get',

    handler : withErrorHandling(googleAuthHandler)
}