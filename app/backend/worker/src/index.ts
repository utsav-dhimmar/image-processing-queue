import { worker as imageProcessWorker } from "@/worker/img-process-worker.js";
import { config } from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirnmae = path.dirname(__filename);
const root = path.resolve(__dirnmae, "..", "..");
const envPath = path.join(root, ".env");

config({
	path: envPath,
});

// cron.schedule("*/30 * * * *", async () => {
// cron.schedule("*/1 * * * *", deleteAssetsFromServer);
// cron.schedule("* 3 * * * *", deleteAssetsFromServer);

imageProcessWorker.run();
// imageDeleteWorker.run();
