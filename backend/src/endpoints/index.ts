import { bulkCompetitiveAnalysisEndpoint } from "./bulkCompetitorsDomainEndpoint.ts";
import { bulkDomainSearchEndpoint } from "./bulkDomainSearchEndpoint.ts";
import { bulkKeywordSearchEndpoint } from "./bulkKeywordSearchEndpoint.ts";
import { expiredDomainEndpoint } from "./expiredDomainEndpoint.ts";
import { fetchLinkbuildersEndpoint } from "./marketplaces/linkbuildersEndpoint.ts";
import { fetchprensalinkEndpoint } from "./marketplaces/prensalinkEndpoint.ts";
import { fetchSeoJungleEndpoint } from "./marketplaces/seojungleEndpoint.ts";
import { myTestEndpoint } from "./myTest.ts";
import { getPlansFromDbEndpoint } from "./paypal/getPlansFromDbEndpoint.ts";
import { getUserPlan } from "./paypal/getUserPlansEndpoint.ts";
import { paypalSubscriptionEndpoint } from "./paypal/paypalSubscriptionEndpont.ts";
import { saveSubscriptionToUserCollection } from "./paypal/saveSubscriptionEndpoint.ts";
import { removeFavoriteFromProject } from "./projectManagement/deleteProject.ts";
import { getUserProjects } from "./projectManagement/getProject.ts";
import { addProjectToUser } from "./projectManagement/postProject.ts";
import { updateUserProject } from "./projectManagement/putProject.ts";


export const customEndpoints = [
    bulkKeywordSearchEndpoint,
    bulkDomainSearchEndpoint,
    bulkCompetitiveAnalysisEndpoint,
    expiredDomainEndpoint,
    paypalSubscriptionEndpoint,
    getPlansFromDbEndpoint,
    saveSubscriptionToUserCollection,
    getUserPlan,
    getUserProjects,
    addProjectToUser,
    updateUserProject,
    removeFavoriteFromProject,
    fetchLinkbuildersEndpoint,
    fetchprensalinkEndpoint,
    fetchSeoJungleEndpoint,
    myTestEndpoint
];
