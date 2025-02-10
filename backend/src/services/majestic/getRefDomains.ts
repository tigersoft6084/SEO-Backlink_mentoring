import { MAJESTIC_URL } from "@/globals/globalURLs.ts";
import { ErrorHandler } from "@/handlers/errorHandler.ts";
import { axiosInstance } from "@/utils/axiosInstance.ts";
import { isValidDomain } from "@/utils/domainUtils.ts"

interface RefDomainResponse{
    DataTables : {
        Results : {
            Data : Array<{
                Domain : string,
                RefDomains : number,
                TrustFlow : number,
                CitationFlow : number,
                TopicalTrustFlow_Topic_0 : string,
                Title : string,
                Language : string
            }>
        }
    }
}

interface RefDomainResult{
    domain : string;
    tf : number,
    cf : number,
    rd : number,
    ttf : string,
    title : string,
    language : string
}

export const fetchRefDomains = async(domain : string) : Promise<RefDomainResult[] | null> => {

    if(!isValidDomain(domain)){
        console.error(`Invalid domain format : ${domain}`);
        return null;
    }

    const MAJESTIC_API_KEY = process.env.MAJESTIC_API_KEY;

    if(!MAJESTIC_API_KEY){
        throw new Error('Majestic API key is missing');
    }

    const results : RefDomainResult[] = [];

    try{

        const response = await axiosInstance.get(`${MAJESTIC_URL}?app_api_key=${MAJESTIC_API_KEY}&cmd=GetRefDomains&item0=${domain}&Count=50000&datasource=fresh`)

        const reponseData : RefDomainResponse = response.data;

        if(reponseData?.DataTables?.Results?.Data){
            const data = reponseData?.DataTables?.Results?.Data;

            data.forEach((domainData) => {
                results.push({
                    domain : domainData.Domain,
                    tf : domainData.TrustFlow,
                    cf : domainData.CitationFlow,
                    rd : domainData.RefDomains,
                    ttf : domainData.TopicalTrustFlow_Topic_0,
                    title : domainData.Title,
                    language : domainData.Language

                })
            })

            return results;
        }

        return null;

    }catch(error){
        const { errorDetails, status } = ErrorHandler.handle(error, "Error Formatting Data For Paperclub");
        console.log(errorDetails, status);
        return null;
    }
}