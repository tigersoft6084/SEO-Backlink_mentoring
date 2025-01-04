import { fetchSerpEndpoint } from './fetchSerpEndpoint';
import { fetchPaperclubEndpoint } from './marketplaces/paperclubEndpoint';
import { fetchLinkbuildersEndpoint } from './marketplaces/linkbuildersEndpoint';
import { fetchprensalinkEndpoint } from './marketplaces/prensalinkEndpoint';
import { myTestEndpoint } from './myTest';
import { fetchSeoJungleEndpoint } from './marketplaces/seojungleEndpoint';
import { bulkKeywordSearchEndpoint } from './bulkKeywordSearchEndpoint';

export const customEndpoints = [
    fetchSerpEndpoint,
    bulkKeywordSearchEndpoint,
    fetchPaperclubEndpoint,
    fetchLinkbuildersEndpoint,
    fetchprensalinkEndpoint,
    fetchSeoJungleEndpoint,
    myTestEndpoint
];
