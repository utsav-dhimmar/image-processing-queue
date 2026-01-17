import { addJobs } from "@/queue/index.js";
import { db, jobTable } from "@app/api/src/db/schema.js";
import { and, eq, lt, or } from "drizzle-orm";
import fs from "fs/promises";
import type { TaskFn } from "node-cron";

const doesFileExits = async (filePath: string) => {
	try {
		await fs.access(filePath, fs.constants.F_OK);
		return true;
	} catch (e) {
		console.log(`File not found ${filePath}`);
		return false;
	}
};

export const deleteFile = async (filePath: string) => {
	try {
		if (await doesFileExits(filePath)) {
			await fs.unlink(filePath);
			console.log(`${filePath} deleted sucessfully`);
		}
	} catch (error) {
		console.log(`[ERROR] unable to delete ${filePath}`);
		console.log(error);
	}
};

export const deleteAssetsFromServer: TaskFn = async () => {
	// delete every assets after 30 minutes whether it's status is FAILED | COMPLETED
	// from updated at

	const currentTime = new Date();
	const min = currentTime.getMinutes() - 2;
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

	dbResponse.forEach(async ({ result_url, temp_path }) => {
		if (result_url && temp_path) {
			await addJobs(result_url);
			await addJobs(temp_path);
		}
	});
};
