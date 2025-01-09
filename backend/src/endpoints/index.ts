import { fetchSerpEndpoint } from './fetchSerpEndpoint';
import { fetchPaperclubEndpoint } from './marketplaces/paperclubEndpoint';
import { fetchLinkbuildersEndpoint } from './marketplaces/linkbuildersEndpoint';
import { fetchprensalinkEndpoint } from './marketplaces/prensalinkEndpoint';
import { myTestEndpoint } from './myTest';
import { fetchSeoJungleEndpoint } from './marketplaces/seojungleEndpoint';
import { bulkKeywordSearchEndpoint } from './bulkKeywordSearchEndpoint';
import { fetcherefererEndpoint } from './marketplaces/erefererEndpoint';
import { fetchMistergoodlinkEndpoint } from './marketplaces/mistergoodlinkEndpoint';
import { fetchBoosterlinkEndpoint } from './marketplaces/boosterlinkEndpoint';
import { fetchLinkavistarEndpoint } from './marketplaces/linkavistaEndpoint';
import { fetchGetalinkEndpoint } from './marketplaces/getalinkEndpoint';
import { fetchDevelinkEndpoint } from './marketplaces/develinkEndpoint';

export const customEndpoints = [
    fetchSerpEndpoint,
    bulkKeywordSearchEndpoint,
    fetchPaperclubEndpoint,
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
