import { bulkCompetitiveAnalysisEndpoint } from "./bulkCompetitorsDomainEndpoint.ts";
import { bulkDomainSearchEndpoint } from "./bulkDomainSearchEndpoint.ts";
import { bulkKeywordSearchEndpoint } from "./bulkKeywordSearchEndpoint.ts";
import { expiredDomainEndpoint } from "./expiredDomainEndpoint.ts";
import { fetchBoosterlinkEndpoint } from "./marketplaces/boosterlinkEndpoint.ts";
import { fetchLinkbuildersEndpoint } from "./marketplaces/linkbuildersEndpoint.ts";
import { fetchprensalinkEndpoint } from "./marketplaces/prensalinkEndpoint.ts";
import { fetchSeoJungleEndpoint } from "./marketplaces/seojungleEndpoint.ts";
import { myTestEndpoint } from "./myTest.ts";


export const customEndpoints = [
    bulkKeywordSearchEndpoint,
    bulkDomainSearchEndpoint,
    bulkCompetitiveAnalysisEndpoint,
    expiredDomainEndpoint,
    fetchLinkbuildersEndpoint,
    fetchprensalinkEndpoint,
    fetchSeoJungleEndpoint,
    fetchBoosterlinkEndpoint,
    myTestEndpoint
];
