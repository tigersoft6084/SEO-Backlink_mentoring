import { bulkCompetitiveAnalysisEndpoint } from "./bulkCompetitorsDomainEndpoint.ts";
import { bulkDomainSearchEndpoint } from "./bulkDomainSearchEndpoint.ts";
import { bulkKeywordSearchEndpoint } from "./bulkKeywordSearchEndpoint.ts";
import { fetchBoosterlinkEndpoint } from "./marketplaces/boosterlinkEndpoint.ts";
import { fetchDevelinkEndpoint } from "./marketplaces/develinkEndpoint.ts";

import { fetcherefererEndpoint } from "./marketplaces/erefererEndpoint.ts";
import { fetchGetalinkEndpoint } from "./marketplaces/getalinkEndpoint.ts";
import { fetchLinkavistarEndpoint } from "./marketplaces/linkavistaEndpoint.ts";
import { fetchLinkbuildersEndpoint } from "./marketplaces/linkbuildersEndpoint.ts";
import { fetchMistergoodlinkEndpoint } from "./marketplaces/mistergoodlinkEndpoint.ts";
import { fetchPaperclubEndpoint } from "./marketplaces/paperclubEndpoint.ts";
import { fetchprensalinkEndpoint } from "./marketplaces/prensalinkEndpoint.ts";
import { fetchSeoJungleEndpoint } from "./marketplaces/seojungleEndpoint.ts";
import { myTestEndpoint } from "./myTest.ts";


export const customEndpoints = [
    bulkKeywordSearchEndpoint,
    bulkDomainSearchEndpoint,
    fetchPaperclubEndpoint,
    bulkCompetitiveAnalysisEndpoint,
    fetchLinkbuildersEndpoint,
    fetchprensalinkEndpoint,
    fetchSeoJungleEndpoint,
    fetcherefererEndpoint,
    fetchMistergoodlinkEndpoint,
    fetchBoosterlinkEndpoint,
    fetchLinkavistarEndpoint,
    fetchGetalinkEndpoint,
    fetchDevelinkEndpoint,
    myTestEndpoint
];
