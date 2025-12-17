import { config } from "dotenv";
import { and, eq, lt, or } from "drizzle-orm";
import cron from "node-cron";
import path from "path";
import { fileURLToPath } from "url";
import { } from "zod";
import { db, jobTable } from "./db/schema.js";
import { worker } from "./worker.js";

const __filename = fileURLToPath(import.meta.url);
const __dirnmae = path.dirname(__filename);
const root = path.resolve(__dirnmae, "..", "..");
const envPath = path.join(root, ".env");

config({
	path: envPath,
});

// cron.schedule("*/30 * * * *", async () => {
cron.schedule("* 3 * * * *", async () => {
	// delete every assets after 30 minutes whether it's status is FAILED | COMPLETED
	// from updated at
	const currentTime = new Date();
	const min = currentTime.getMinutes() + 30;
	currentTime.setMinutes(min);
	const dbResponse = await db
		.select()
		.from(jobTable)
		.where(
			and(
				lt(jobTable.updated_at, currentTime),
				or(
					eq(jobTable.status, "FAILED"),
					eq(jobTable.status, "COMPLETED"),
				),
			),
		);
	console.log("Run at every 30 minutes", dbResponse);
});

await worker.run();
