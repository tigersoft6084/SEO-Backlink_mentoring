import { axiosInstance } from '@/utils/axiosInstance.ts';
import { ErrorHandler } from '@/handlers/errorHandler.ts';
import FormData from 'form-data';
import { getFormDataFromGrowwer } from '../formattingFetchedDataFromMarketplaces/growwer.ts';

export const fetchDataFromGrowwer = async (url: string, cookie: string, page : number) => {
    try {
        // Create FormData object
        const formData = new FormData();
        formData.append("filters[country][field]", "country");
        formData.append("filters[country][operator]", "IN");
        formData.append("filters[language][field]", "language");
        formData.append("filters[language][operator]", "IN");
        formData.append("filters[link_addition_offer_link_type][field]", "link_addition_offer_link_type");
        formData.append("filters[link_addition_offer_link_type][operator]", "IN");
        formData.append("filters[link_addition_offer_link_type][value]", "");
        formData.append("filters[link_addition_offer_price][field]", "link_addition_offer_price");
        formData.append("filters[link_addition_offer_price][operator]", "<>");
        formData.append("filters[new][field]", "new");
        formData.append("filters[new][operator]", "=");
        formData.append("filters[post_offer_advertising_labelling_policy][field]", "post_offer_advertising_labelling_policy");
        formData.append("filters[post_offer_advertising_labelling_policy][operator]", "=");
        formData.append("filters[post_offer_extra_service_type][field]", "post_offer_extra_service_type");
        formData.append("filters[post_offer_extra_service_type][operator]", "=");
        formData.append("filters[post_offer_link_type][field]", "post_offer_link_type");
        formData.append("filters[post_offer_link_type][operator]", "IN");
        formData.append("filters[post_offer_link_type][value]", "");
        formData.append("filters[post_offer_promoted_social_network][field]", "post_offer_promoted_social_network");
        formData.append("filters[post_offer_promoted_social_network][operator]", "IN");
        formData.append("filters[project_affinity_not_banned_project_topics][field]", "project_affinity_not_banned_project_topics");
        formData.append("filters[project_affinity_not_banned_project_topics][operator]", "<>");
        formData.append("filters[project_affinity_ranks_some_goal_keyword][field]", "project_affinity_ranks_some_goal_keyword");
        formData.append("filters[project_affinity_ranks_some_goal_keyword][operator]", "IN");
        formData.append("filters[project_affinity_ranks_some_goal_keyword][value]", "");
        formData.append("filters[project_media_state_affinity][field]", "project_media_state_affinity");
        formData.append("filters[project_media_state_affinity][operator]", "IN");
        formData.append("filters[project_media_state_affinity][value]", "");
        formData.append("filters[project_media_state_bought][field]", "project_media_state_bought");
        formData.append("filters[project_media_state_bought][operator]", "=");
        formData.append("filters[project_media_state_discarded][field]", "project_media_state_discarded");
        formData.append("filters[project_media_state_discarded][operator]", "=");
        formData.append("filters[project_media_state_favorite][field]", "project_media_state_favorite");
        formData.append("filters[project_media_state_favorite][operator]", "=");
        formData.append("filters[project_media_state_flash_offer][field]", "project_media_state_flash_offer");
        formData.append("filters[project_media_state_flash_offer][operator]", "=");
        formData.append("filters[project_media_state_requested][field]", "project_media_state_requested");
        formData.append("filters[project_media_state_requested][operator]", "=");
        formData.append("filters[range_max_link_addition_offer_price][field]", "range_max_link_addition_offer_price");
        formData.append("filters[range_max_link_addition_offer_price][operator]", "<=");
        formData.append("filters[range_max_link_addition_offer_price][value]", "");
        formData.append("filters[range_max_post_offer_price][field]", "range_max_post_offer_price");
        formData.append("filters[range_max_post_offer_price][operator]", "<=");
        formData.append("filters[range_max_post_offer_price][value]", "");
        formData.append("filters[range_max_website_domain_rating][field]", "range_max_website_domain_rating");
        formData.append("filters[range_max_website_domain_rating][operator]", "<=");
        formData.append("filters[range_max_website_domain_rating][value]", "")
        formData.append("filters[range_max_website_organic_traffic][field]", "range_max_website_organic_traffic");
        formData.append("filters[range_max_website_organic_traffic][operator]", "<=");
        formData.append("filters[range_max_website_organic_traffic][value]", "");
        formData.append("filters[range_max_website_ratio_linked_to_referring_domains][field]", "range_max_website_ratio_linked_to_referring_domains");
        formData.append("filters[range_max_website_ratio_linked_to_referring_domains][operator]", "<=");
        formData.append("filters[range_max_website_ratio_linked_to_referring_domains][value]", "")
        formData.append("filters[range_min_link_addition_offer_price][field]", "range_min_link_addition_offer_price");
        formData.append("filters[range_min_link_addition_offer_price][operator]", ">=");
        formData.append("filters[range_min_link_addition_offer_price][value]", "");
        formData.append("filters[range_min_post_offer_price][field]", "range_min_post_offer_price");
        formData.append("filters[range_min_post_offer_price][operator]", ">=");
        formData.append("filters[range_min_post_offer_price][value]", "");
        formData.append("filters[range_min_website_domain_rating][field]", "range_min_website_domain_rating");
        formData.append("filters[range_min_website_domain_rating][operator]", ">=");
        formData.append("filters[range_min_website_domain_rating][value]", "");
        formData.append("filters[range_min_website_organic_traffic][field]", "range_min_website_organic_traffic");
        formData.append("filters[range_min_website_organic_traffic][operator]", ">=");
        formData.append("filters[range_min_website_organic_traffic][value]", "");
        formData.append("filters[range_min_website_ratio_linked_to_referring_domains][field]", "range_min_website_ratio_linked_to_referring_domains");
        formData.append("filters[range_min_website_ratio_linked_to_referring_domains][operator]", ">=");
        formData.append("filters[range_min_website_ratio_linked_to_referring_domains][value]", "");
        formData.append("filters[topics][field]", "topics");
        formData.append("filters[topics][operator]", "IN");
        formData.append("filters[url][field]", "url");
        formData.append("filters[url][operator]", "CONTAINS");
        formData.append("filters[url][value]", "");
        formData.append("filters[website_traffic_trend_valuation][field]", "website_traffic_trend_valuation");
        formData.append("filters[website_traffic_trend_valuation][operator]", "=");
        formData.append("filters[website_type][field]", "website_type");
        formData.append("filters[website_type][operator]", "IN");
        formData.append("filters[website_type][value]", "");
        formData.append("limit", "100");
        formData.append("offset", "33100");
        formData.append("order", "");
        formData.append("order_by", "");

        const response = await axiosInstance.post(url, formData, {

            headers: {
                Cookie: cookie,
                "Accept" : '*/*',
                ...formData.getHeaders(),
                'HOST' : 'tool.growwer.com'
            },
        });

        const fomattedData = getFormDataFromGrowwer(response.data.items);
        return fomattedData;
    } catch (error) {
        const { errorDetails, status } = ErrorHandler.handle(error, "No Growwer data received.");
        return new Response(JSON.stringify(errorDetails), {
            status,
            headers: { "Content-Type": "application/json" },
        });
    }
};
