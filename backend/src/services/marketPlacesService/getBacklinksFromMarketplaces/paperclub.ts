import { ErrorHandler } from "@/handlers/errorHandler.ts";
import { getAllDataFromPaperclub } from "../getAllDataFromMarketplaces/paperclub.ts";
import { getTokenForPaperClub } from "../getTokensOrCookiesFromMarketplaces/paperclub.ts";
import { Payload } from "payload";


// Function to process URLs in batches with p-limit
export const getBacklinksDataFromPaperclub = async (payload : Payload) => {

  try{
    const Token = await getTokenForPaperClub();

    if (!Token) {
      throw new Error("API token is missing");
    }

    const allData = await getAllDataFromPaperclub(Token, payload);

    return allData;

  }catch(error){
    const { errorDetails, status } = ErrorHandler.handle(error, "Error occured from getting backlinks from Paperclub");

    return new Response(JSON.stringify(errorDetails), {
        status,
        headers: { "Content-Type": "application/json" },
    });
  }

};