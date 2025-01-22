import cron from "node-cron";
import { getBacklinksDataFromEreferer } from "./marketPlacesService/getBacklinksFromMarketplaces/ereferer.ts";
import { getBacklinksDataFromDevelink } from "./marketPlacesService/getBacklinksFromMarketplaces/develink.ts";
import { Payload } from "payload";

/**
 * Logs messages to the console or a log file
 */
const log = (message: string): void => {
    console.log(`[${new Date().toISOString()}] ${message}`);
};

export const startCronJob = async(payload : Payload): Promise<void> => {

    // Test schedule: Runs every month for testing
    const schedule = "3 0 22 * *"; // Change to "0 0 1 * *" for monthly execution

    cron.schedule(schedule, async () => {

        log("Starting backlink data update...");

        try {
            // Call the first function
            log("Fetching data from Ereferer...");

            await getBacklinksDataFromEreferer(payload); // Pass the payload object

            log("Completed fetching data from Ereferer.");

            // Call the second function
            log("Fetching data from Develink...");

            await getBacklinksDataFromDevelink(payload); // Pass the payload object

            log("Completed fetching data from Develink.");

        } catch (error) {
            log(`Error occurred: ${(error as Error).message}`);
        }

        log("Backlink data update job completed.");
    });

    log("<<<<<<<<<<<<<<<<<<<<<<<<..........................Cron job scheduled..............................>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>");
};
