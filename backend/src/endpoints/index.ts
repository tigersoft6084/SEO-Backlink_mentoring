import { fetchSerpEndpoint } from './fetchSerpEndpoint';
import { fetchPaperclubEndpoint } from './paperclubEndpoint';
import { fetchLinkbuildersEndpoint } from './linkbuildersEndpoint';
import { fetchprensalinkEndpoint } from './prensalinkEndpoint';
import { myTestEndpoint } from './myTest';
import { fetchSeoJungleEndpoint } from './seojungleEndpoint';
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
