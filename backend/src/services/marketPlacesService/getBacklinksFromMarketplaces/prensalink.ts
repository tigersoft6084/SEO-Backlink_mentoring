import { getAllDataFromPrensalink } from "../getAllDataFromMarketplaces/prensalink.ts";
import { getTokenForPrensalink } from "../getTokensOrCookiesFromMarketplaces/prensalink.ts";


// Function to process URLs in batches with p-limit
export const getBacklinksDataFromPrensalink = async () => {

    try{
      const Token = await getTokenForPrensalink();

      if (!Token) {
        throw new Error("API token is missing");
      }

      const allData = await getAllDataFromPrensalink(Token);

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
