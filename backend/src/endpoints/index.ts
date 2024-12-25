import { fetchSerpEndpoint } from './fetchSerpEndpoint';
import { fetchPaperclubEndpoint } from './paperclubEndpoint';
import { fetchLinkbuildersEndpoint } from './linkbuildersEndpoint';
import { fetchprensalinkEndpoint } from './prensalinkEndpoint';
import { myTestEndpoint } from './myTest';

export const customEndpoints = [
    fetchSerpEndpoint,
    fetchPaperclubEndpoint,
    fetchLinkbuildersEndpoint,
    fetchprensalinkEndpoint,
    myTestEndpoint
];
