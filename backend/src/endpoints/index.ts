import { bulkCompetitiveAnalysisEndpoint } from "./bulkCompetitorsDomainEndpoint.ts";
import { bulkDomainSearchEndpoint } from "./bulkDomainSearchEndpoint.ts";
import { bulkKeywordSearchEndpoint } from "./bulkKeywordSearchEndpoint.ts";
import { expiredDomainEndpoint } from "./expiredDomainEndpoint.ts";
import { fetchBoosterlinkEndpoint } from "./marketplaces/boosterlinkEndpoint.ts";
import { fetchLinkbuildersEndpoint } from "./marketplaces/linkbuildersEndpoint.ts";
import { fetchprensalinkEndpoint } from "./marketplaces/prensalinkEndpoint.ts";
import { fetchSeoJungleEndpoint } from "./marketplaces/seojungleEndpoint.ts";
import { myTestEndpoint } from "./myTest.ts";
import { paypalSubscriptionEndpoint } from "./paypal/paypalSubscriptionEndpont.ts";


export const customEndpoints = [
    bulkKeywordSearchEndpoint,
    bulkDomainSearchEndpoint,
    bulkCompetitiveAnalysisEndpoint,
    expiredDomainEndpoint,
    paypalSubscriptionEndpoint,
    fetchLinkbuildersEndpoint,
    fetchprensalinkEndpoint,
    fetchSeoJungleEndpoint,
    fetchBoosterlinkEndpoint,
    myTestEndpoint
];
