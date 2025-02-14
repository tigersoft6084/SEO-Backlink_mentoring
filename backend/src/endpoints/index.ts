import { bulkCompetitiveAnalysisEndpoint } from "./bulkCompetitorsDomainEndpoint.ts";
import { bulkDomainSearchEndpoint } from "./bulkDomainSearchEndpoint.ts";
import { bulkKeywordSearchEndpoint } from "./bulkKeywordSearchEndpoint.ts";
import { keywordSearchEndpoint } from "./dataForSeo/keywordSearchEndpoint.ts";
import { expiredDomainEndpoint } from "./expiredDomainEndpoint.ts";
import { myTestEndpoint } from "./myTest.ts";
import { getPlansFromDbEndpoint } from "./paypal/getPlansFromDbEndpoint.ts";
import { getUserPlan } from "./paypal/getUserPlansFromDbEndpoint.ts";
import { paypalSubscriptionEndpoint } from "./paypal/createSubscriptionEndpont.ts";
import { saveSubscriptionToUserCollection } from "./paypal/saveSubscriptionToDbEndpoint.ts";
import { removeFavoriteFromProject } from "./projectManagement/deleteProject.ts";
import { getUserProjects } from "./projectManagement/getProject.ts";
import { addProjectToUser } from "./projectManagement/postProject.ts";
import { updateUserProject } from "./projectManagement/putProject.ts";
import { paypalWebhook } from "./paypal/paypalWebhookEndpoint.ts";
import { getUserDataForRefreshPageEndpoint } from "./getUserDataForRefreshPageEndpoint.ts";
import { showSubscriptionEndpoint } from "./paypal/showSubscriptionEndpoint.ts";
import { verifyApiKey } from "./chromeExtension/apiKey.ts";
import { getMarketPlaces } from "./chromeExtension/getMarketplaces.ts";
import { updateLocationEndpoint } from "./updateLocationEndpoint.ts";
import { serpScannerEndpoint } from "./serpScannerEndpoint.ts";
import { saveUsedFeaturesToUserCollection } from "./paypal/saveUsedFeaturesToDbEndpoint.ts";
import { googleAuthEndpoint } from "./auth/googleAuthEndpoint.ts";
import { getUserProjectInfo } from "./projectManagement/getProjectInfo.ts";


export const customEndpoints = [
    googleAuthEndpoint,
    bulkKeywordSearchEndpoint,
    keywordSearchEndpoint,
    bulkDomainSearchEndpoint,
    bulkCompetitiveAnalysisEndpoint,
    expiredDomainEndpoint,
    serpScannerEndpoint,
    paypalSubscriptionEndpoint,
    paypalWebhook,
    getPlansFromDbEndpoint,
    saveSubscriptionToUserCollection,
    saveUsedFeaturesToUserCollection,
    showSubscriptionEndpoint,
    getUserPlan,
    getUserProjects,
    addProjectToUser,
    updateUserProject,
    getUserProjectInfo,
    getUserDataForRefreshPageEndpoint,
    removeFavoriteFromProject,
    verifyApiKey,
    getMarketPlaces,
    updateLocationEndpoint,
    myTestEndpoint,
];
