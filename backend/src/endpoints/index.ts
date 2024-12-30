import { fetchSerpEndpoint } from './fetchSerpEndpoint';
import { fetchPaperclubEndpoint } from './paperclubEndpoint';
import { fetchLinkbuildersEndpoint } from './linkbuildersEndpoint';
import { fetchprensalinkEndpoint } from './prensalinkEndpoint';
import { myTestEndpoint } from './myTest';
import { fetchSeoJungleEndpoint } from './seojungleEndpoint';

export const customEndpoints = [
    fetchSerpEndpoint,
    fetchPaperclubEndpoint,
    fetchLinkbuildersEndpoint,
    fetchprensalinkEndpoint,
    fetchSeoJungleEndpoint,
    myTestEndpoint
];
