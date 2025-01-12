import { getTokenForPrensalink } from "../getTokensOrCookiesFromMarketplaces/prensalink";
import { getAllDataFromPrensalink } from "../getAllDataFromMarketplaces/prensalink";

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
