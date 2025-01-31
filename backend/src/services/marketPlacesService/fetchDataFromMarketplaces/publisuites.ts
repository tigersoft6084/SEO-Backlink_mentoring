import { axiosInstance } from "@/utils/axiosInstance.ts";
import { getFormDataFromPublisuites } from "../formattingFetchedDataFromMarketplaces/publisuites.ts";

export const fetchDataFromPublisuites = async (url : string, cookie : string, page : number) => {
    try{

        const buildRequestBody = () => {
            const formData = new URLSearchParams();

            // Add key-value pairs from the images
            const parameters = {
                ahrefstrafficmax: 18944180,
                ahrefstrafficmin: 0,
                analytics_max: 717754951,
                analytics_min: 0,
                blmax: 717754951,
                blmin: 0,
                cf: "0-100",
                da: "0-100",
                dr: "0-100",
                keywordsmax: 17502883,
                keywordsmin: 0,
                linksmax: 45520859,
                linksmin: 0,
                mdomainsmax: 628924,
                mdomainsmin: 0,
                mlinksmax: 345203941,
                mlinksmin: 0,
                oblmax: 995,
                oblmin: 0,
                order: "discount",
                order_dir: "desc",
                pa: "0-100",
                page: page,
                pricemax: 10000.0,
                pricemin: 1.0,
                rankmax: 9.5,
                rankmin: 0.1,
                rdmax: 974445,
                rdmin: 0,
                search: "",
                searchweb: "",
                sistrix_visibility_max: 259.7912,
                sistrix_visibility_min: 0.0,
                tf: "0-100",
                "types[]": [2, 6, 5], // Adjust if necessary
                typeview: "cards",
            };

            // Add parameters to the formData object
            Object.entries(parameters).forEach(([key, value]) => {
                if (Array.isArray(value)) {
                    // Append array values individually with the same key
                    value.forEach((item) => formData.append(key, item.toString()));
                } else {
                    formData.append(key, value.toString());
                }
            });

            return formData.toString();
        };

        // Use the buildRequestBody function to get the body
        const requestBody = buildRequestBody();

        const response = await axiosInstance.post(url, requestBody, {
            headers : {
                Cookie : cookie,
                'sec-ch-ua-platform': '"Windows"',
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/132.0.0.0 Safari/537.36',
                'sec-ch-ua': '"Not A(Brand";v="8", "Chromium";v="132", "Google Chrome";v="132"',
                'Content-Type': 'application/x-www-form-urlencoded',
                'X-Requested-With': 'XMLHttpRequest',
                'sec-ch-ua-mobile': '?0',
                'Accept': '*/*',
                'Sec-Fetch-Site': 'same-origin',
                'Sec-Fetch-Mode': 'cors',
                'Sec-Fetch-Dest': 'empty',
                'Host': 'www.publisuites.com',
            }
        })

        const formattedData = getFormDataFromPublisuites(response.data);

        return formattedData;
    }catch(error){
        console.error('Error occurred while fetching data from Publisuites:', error);

        return null;
    }
}