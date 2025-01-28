import { ErrorHandler } from "@/handlers/errorHandler.ts";
import { getAllDataFromPrensalink } from "../getAllDataFromMarketplaces/prensalink.ts";
import { getTokenForPrensalink } from "../getTokensOrCookiesFromMarketplaces/prensalink.ts";
import { Payload } from "payload";


// Function to process URLs in batches with p-limit
export const getBacklinksDataFromPrensalink = async (payload : Payload) => {

    try{
      const Token = await getTokenForPrensalink();

      if (!Token) {
        throw new Error("API token is missing");
      }

      const allData = await getAllDataFromPrensalink(Token, payload);

      return allData;

    }catch(error){

      const { errorDetails, status } = ErrorHandler.handle(error, "Error occured from getting backlinks from Prensalink");

      return new Response(JSON.stringify(errorDetails), {
          status,
          headers: { "Content-Type": "application/json" },
      });
    }

};
