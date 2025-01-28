import { ErrorHandler } from "@/handlers/errorHandler.ts";
import { axiosInstance } from "@/utils/axiosInstance.ts"
import { getFormDataFromUnancor } from "../formattingFetchedDataFromMarketplaces/unancor.ts";

export const fetchDataFromUnancor = async(url : string, cookieAndCsrfToken : {CSRF_TOKEN : string, COOKIE : string}, page : number) => {

    try{

        const requestBody = {
            "_token": cookieAndCsrfToken.CSRF_TOKEN,
            "components": [
                {
                    "snapshot": "{\"data\":{\"mountedActions\":[[],{\"s\":\"arr\"}],\"mountedActionsArguments\":[[],{\"s\":\"arr\"}],\"mountedActionsData\":[[],{\"s\":\"arr\"}],\"defaultAction\":null,\"defaultActionArguments\":null,\"componentFileAttachments\":[[],{\"s\":\"arr\"}],\"mountedFormComponentActions\":[[],{\"s\":\"arr\"}],\"mountedFormComponentActionsArguments\":[[],{\"s\":\"arr\"}],\"mountedFormComponentActionsData\":[[],{\"s\":\"arr\"}],\"mountedFormComponentActionsComponents\":[[],{\"s\":\"arr\"}],\"mountedInfolistActions\":[[],{\"s\":\"arr\"}],\"mountedInfolistActionsData\":[[],{\"s\":\"arr\"}],\"mountedInfolistActionsComponent\":null,\"mountedInfolistActionsInfolist\":null,\"isTableLoaded\":false,\"tableGrouping\":null,\"tableGroupingDirection\":null,\"tableRecordsPerPage\":10,\"isTableReordering\":false,\"tableColumnSearches\":[[],{\"s\":\"arr\"}],\"tableSearch\":\"\",\"tableSortColumn\":null,\"tableSortDirection\":null,\"toggledTableColumns\":[{\"name\":true,\"spam_level\":true,\"domain\":[{\"metrics\":[{\"ahrefs_DR\":true,\"majestic_TF\":true,\"traffic\":true,\"ahrefs_positions\":true,\"sistrix_rank\":true,\"ahrefs_refdomains\":true},{\"s\":\"arr\"}]},{\"s\":\"arr\"}],\"accepted_links\":true,\"options\":[{\"sponsored\":true},{\"s\":\"arr\"}],\"prices\":[{\"sale_price\":true},{\"s\":\"arr\"}]},{\"s\":\"arr\"}],\"mountedTableActions\":[[],{\"s\":\"arr\"}],\"mountedTableActionsData\":[[],{\"s\":\"arr\"}],\"mountedTableActionsArguments\":[[],{\"s\":\"arr\"}],\"mountedTableActionRecord\":null,\"defaultTableAction\":null,\"defaultTableActionArguments\":null,\"defaultTableActionRecord\":null,\"selectedTableRecords\":[[],{\"s\":\"arr\"}],\"mountedTableBulkAction\":null,\"mountedTableBulkActionData\":[[],{\"s\":\"arr\"}],\"tableFilters\":[{\"local_seo\":[{\"country_id\":null,\"region_id\":null,\"language_id\":[[],{\"s\":\"arr\"}]},{\"s\":\"arr\"}],\"theme_id\":[{\"values\":[[],{\"s\":\"arr\"}]},{\"s\":\"arr\"}],\"has_categories\":[{\"value\":null},{\"s\":\"arr\"}],\"spam_level\":[{\"value\":null},{\"s\":\"arr\"}],\"link_types\":[{\"value\":null},{\"s\":\"arr\"}],\"orientation\":[{\"value\":null},{\"s\":\"arr\"}],\"blog\":[{\"value\":null},{\"s\":\"arr\"}],\"sale_price\":[{\"min_sale_price\":null,\"max_sale_price\":null},{\"s\":\"arr\"}],\"hide_sponsored\":[{\"isActive\":false},{\"s\":\"arr\"}],\"show_offers\":[{\"isActive\":false},{\"s\":\"arr\"}],\"seo_filters\":[{\"seo_filters\":false,\"ahrefs_DR\":null,\"ahrefs_traffic\":null,\"ahrefs_positions\":null,\"ahrefs_refdomains\":null,\"ahrefs_obdl\":null,\"majestic_TF\":null,\"majestic_CF\":null,\"majestic_links\":null,\"majestic_refdomains\":null,\"sistrix_rank\":null},{\"s\":\"arr\"}]},{\"s\":\"arr\"}],\"tableDeferredFilters\":null,\"paginators\":[{\"page\":762},{\"s\":\"arr\"}],\"isMounted\":true,\"defaultViewIsActive\":false,\"activePresetView\":null,\"currentPresetView\":null,\"activeUserView\":null},\"memo\":{\"id\":\"4MghN5QWTVX0nVVvio8z\",\"name\":\"app.filament.user.pages.marketplace\",\"path\":\"marketplace\",\"method\":\"GET\",\"children\":[],\"scripts\":[],\"assets\":[],\"errors\":[],\"locale\":\"en\"},\"checksum\":\"3be94e3126a7b19ae89f66500e3723496f3e7a6dab5c8b59d2cff89f53a79955\"}",
                    "updates": {},
                    "calls": [
                        { "path": "", "method": "gotoPage", "params": [page, "page"] },
                        { "path": "", "method": "gotoPage", "params": [page, "page"] },
                        { "path": "", "method": "gotoPage", "params": [page, "page"] },
                        { "path": "", "method": "gotoPage", "params": [page, "page"] },
                        { "path": "", "method": "gotoPage", "params": [page, "page"] }
                    ]
                }
            ]
        };

        const response = await axiosInstance.post(url, requestBody, {
            headers : {
                Cookie : cookieAndCsrfToken.COOKIE,
                'sec-ch-ua-platform': '"Windows"',
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/132.0.0.0 Safari/537.36',
                'sec-ch-ua': '"Not A(Brand";v="8", "Chromium";v="132", "Google Chrome";v="132"',
                'Content-Type': 'application/json',
                'X-Livewire': '', // Adjust if the value is necessary
                'sec-ch-ua-mobile': '?0',
                'Accept': '*/*',
                'Sec-Fetch-Site': 'same-origin',
                'Sec-Fetch-Mode': 'cors',
                'Sec-Fetch-Dest': 'empty',
                'Host': 'app.unancor.com',
            }
        })

        const formattedData = getFormDataFromUnancor(response.data.components[0].effects.html)

        return formattedData;

    }catch(error){

        const { errorDetails, status } = ErrorHandler.handle(error, `No Develink data received.`);

        return new Response(JSON.stringify(errorDetails), {
            status,
            headers: { "Content-Type": "application/json" },
        });

    }
}