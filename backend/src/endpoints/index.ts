import { bulkCompetitiveAnalysisEndpoint } from "./bulkCompetitorsDomainEndpoint.ts";
import { bulkDomainSearchEndpoint } from "./bulkDomainSearchEndpoint.ts";
import { bulkKeywordSearchEndpoint } from "./bulkKeywordSearchEndpoint.ts";
import { keywordSearchEndpoint } from "./dataForSeo/keywordSearchEndpoint.ts";
import { expiredDomainEndpoint } from "./expiredDomainEndpoint.ts";
import { fetchprensalinkEndpoint } from "./marketplaces/prensalinkEndpoint.ts";
import { myTestEndpoint } from "./myTest.ts";
import { getPlansFromDbEndpoint } from "./paypal/getPlansFromDbEndpoint.ts";
import { getUserPlan } from "./paypal/getUserPlansFromDbEndpoint.ts";
import { paypalSubscriptionEndpoint } from "./paypal/createSubscriptionEndpont.ts";
import { saveSubscriptionToUserCollection } from "./paypal/saveSubscriptionToDbEndpoint.ts";
import { removeFavoriteFromProject } from "./projectManagement/deleteProject.ts";
import { getUserProjects } from "./projectManagement/getProject.ts";
import { addProjectToUser } from "./projectManagement/postProject.ts";
import { updateUserProject } from "./projectManagement/putProject.ts";
import { mytttEndpoint } from "./test.ts";
import { paypalWebhook } from "./paypal/paypalWebhookEndpoint.ts";
import { getUserDataForRefreshPageEndpoint } from "./getUserDataForRefreshPageEndpoint.ts";


export const customEndpoints = [
    bulkKeywordSearchEndpoint,
    keywordSearchEndpoint,
    bulkDomainSearchEndpoint,
    bulkCompetitiveAnalysisEndpoint,
    expiredDomainEndpoint,
    paypalSubscriptionEndpoint,
    paypalWebhook,
    getPlansFromDbEndpoint,
    saveSubscriptionToUserCollection,
    getUserPlan,
    getUserProjects,
    addProjectToUser,
    updateUserProject,
    getUserDataForRefreshPageEndpoint,
    removeFavoriteFromProject,
    fetchprensalinkEndpoint,
    myTestEndpoint,
    mytttEndpoint
];
