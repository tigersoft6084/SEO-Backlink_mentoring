import { getAllDataFromPaperclub } from "../getAllDataFromMarketplaces/paperclub.ts";
import { getTokenForPaperClub } from "../getTokensOrCookiesFromMarketplaces/paperclub.ts";


// Function to process URLs in batches with p-limit
export const getBacklinksDataFromPaperclub = async () => {

  try{
    const Token = await getTokenForPaperClub();

    if (!Token) {
      throw new Error("API token is missing");
    }

    const allData = await getAllDataFromPaperclub(Token);

    return allData;

  }catch(error){
    if (error instanceof Error) {
      console.error('Error fetching data:', error.message);
    } else {
        console.error('Error fetching data:', error);
    }

    return "";
  }

};