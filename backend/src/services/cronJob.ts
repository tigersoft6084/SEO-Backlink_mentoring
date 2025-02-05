import cron from "node-cron";
import { getBacklinksDataFromEreferer } from "./marketPlacesService/getBacklinksFromMarketplaces/ereferer.ts";
import { getBacklinksDataFromDevelink } from "./marketPlacesService/getBacklinksFromMarketplaces/develink.ts";
import { Payload } from "payload";
import { getBacklinksDataFromGetalink } from "./marketPlacesService/getBacklinksFromMarketplaces/getalink.ts";
import { getBacklinksDataFromLinkaVista } from "./marketPlacesService/getBacklinksFromMarketplaces/linkavista.ts";
import { getBacklinksDataFromPaperclub } from "./marketPlacesService/getBacklinksFromMarketplaces/paperclub.ts";
import { getBacklinksDataFromMistergoodlink } from "./marketPlacesService/getBacklinksFromMarketplaces/mistergoodlink.ts";
import { getBacklinksDataFromLinkatomic } from "./marketPlacesService/getBacklinksFromMarketplaces/linkatomic.ts";
import { getBacklinksDataFromUnancor } from "./marketPlacesService/getBacklinksFromMarketplaces/unancor.ts";
import { getBacklinksDataFromBoosterlink } from "./marketPlacesService/getBacklinksFromMarketplaces/boosterlink.ts";
import { getBacklinksDataFromLinkbuilders } from "./marketPlacesService/getBacklinksFromMarketplaces/linkbuilders.ts";
import { getBacklinksDataFromSeojungle } from "./marketPlacesService/getBacklinksFromMarketplaces/seojungle.ts";
import { getBacklinksDataFromMynilinks } from "./marketPlacesService/getBacklinksFromMarketplaces/mynilinks.ts";

/**
 * Logs messages to the console or a log file
 */
const log = (message: string): void => {
    console.log(`[${new Date().toISOString()}] ${message}`);
};

export const startCronJob = async(payload : Payload): Promise<void> => {

    // Test schedule: Runs every month for testing
    const schedule = "23 8 3 * *"; // Change to "0 0 1 * *" for monthly execution

    cron.schedule(schedule, async () => {

        log("<<<<<<<<<<<<<<<<<<<<<<<<<<...................Starting backlink data update.....................>>>>>>>>>>>>>>>>>>>>>>>>>>>");

        try {
            // Call the first function

            log("<<<<<<<<<<<<<<<<<<<<<<<....................Fetching data from Boosterlink........................>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>");

            await getBacklinksDataFromBoosterlink(payload); // Pass the payload object

            log("~~~~~~~~~~~~~~~~~~~~~~~~~~~~Completed fetching data from Boosterlink.~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~");

            log("<<<<<<<<<<<<<<<<<<<<<<<....................Fetching data from Ereferer........................>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>");

            await getBacklinksDataFromEreferer(payload); // Pass the payload object

            log("~~~~~~~~~~~~~~~~~~~~~~~~~~~~Completed fetching data from Ereferer.~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~");

            // Call the second function
            log("<<<<<<<<<<<<<<<<<<<<<<.....................Fetching data from Develink.........................>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>");

            await getBacklinksDataFromDevelink(payload); // Pass the payload object

            log("~~~~~~~~~~~~~~~~~~~~~~~~~~~~Completed fetching data from Develink.~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~");

            log("<<<<<<<<<<<<<<<<<<<<<<.....................Fetching data from Getalink..........................>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>");

            await getBacklinksDataFromGetalink(payload);

            log("~~~~~~~~~~~~~~~~~~~~~~~~~~~~Completed fetching data from Getalink.~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~")

            log("<<<<<<<<<<<<<<<<<<<<<<.....................Fetching data from LinkaVista..........................>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>");

            await getBacklinksDataFromLinkaVista(payload);

            log("~~~~~~~~~~~~~~~~~~~~~~~~~~~~Completed fetching data from LinkaVista.~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~")

            log("<<<<<<<<<<<<<<<<<<<<<<.....................Fetching data from Linkbuilders..........................>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>");

            await getBacklinksDataFromLinkbuilders(payload);

            log("~~~~~~~~~~~~~~~~~~~~~~~~~~~~Completed fetching data from Linkbuilders.~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~")

            log("<<<<<<<<<<<<<<<<<<<<<<.....................Fetching data from Paperclub..........................>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>");

            await getBacklinksDataFromPaperclub(payload);

            log("~~~~~~~~~~~~~~~~~~~~~~~~~~~~Completed fetching data from Paperclub.~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~")

            log("<<<<<<<<<<<<<<<<<<<<<<.....................Fetching data from Mistergoodlink..........................>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>");

            await getBacklinksDataFromMistergoodlink(payload);

            log("~~~~~~~~~~~~~~~~~~~~~~~~~~~~Completed fetching data from Mistergoodlink.~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~")

            log("<<<<<<<<<<<<<<<<<<<<<<.....................Fetching data from Linkatomic..........................>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>");

            await getBacklinksDataFromLinkatomic(payload);

            log("~~~~~~~~~~~~~~~~~~~~~~~~~~~~Completed fetching data from Linkatomic.~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~")

            log("<<<<<<<<<<<<<<<<<<<<<<.....................Fetching data from Seojungle..........................>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>");

            await getBacklinksDataFromSeojungle(payload);

            log("~~~~~~~~~~~~~~~~~~~~~~~~~~~~Completed fetching data from Seojungle.~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~")

            log("<<<<<<<<<<<<<<<<<<<<<<.....................Fetching data from Unancor..........................>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>");

            await getBacklinksDataFromUnancor(payload);

            log("~~~~~~~~~~~~~~~~~~~~~~~~~~~~Completed fetching data from Unancor.~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~")

            log("<<<<<<<<<<<<<<<<<<<<<<.....................Fetching data from Mynilinks..........................>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>");

            await getBacklinksDataFromMynilinks(payload);

            log("~~~~~~~~~~~~~~~~~~~~~~~~~~~~Completed fetching data from Mynilinks.~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~")

        } catch (error) {
            log(`Error occurred: ${(error as Error).message}`);
        }

        log("~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~Backlink data update job completed.~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~");
    });

    log("<<<<<<<<<<<<<<<<<<<<<<<<..........................Cron job scheduled..............................>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>");
};
