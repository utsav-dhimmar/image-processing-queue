import { resizeImage } from "@/processors/imageTask.js";
import { db, jobTable } from "@app/api/src/db/schema.js";
import { Job, Worker } from "bullmq";
import { eq } from "drizzle-orm";
import IORedis from "ioredis";

// @ts-ignore
const connection = new IORedis({ maxRetriesPerRequest: null });

async function notifyDB(
	job: Job,
	status: typeof jobTable.$inferSelect.status,
	// path: typeof jobTable.$inferSelect.result_url,
) {
	try {
		// find the data with that uuid and update the status

		// Apply more check
		// const isjobExists = await db
		// 	.select({ id: jobTable.id })
		// 	.from(jobTable)
		// 	.where(eq(jobTable.job_id, uuid))
		// 	.limit(1);
		// db.transaction(async tx => {

		const [updatedJob] = await db
			.update(jobTable)
			.set({
				status: status,

				result_url: job.data.result_path,
			})
			.where(eq(jobTable.job_id, job.id as string))
			.returning({
				id: jobTable.id,
				job_id: jobTable.job_id,
				result_url: jobTable.result_url,
			});

		console.log({ updatedJob, job });
		console.log(
			`job with ${updatedJob?.id} and job_id - ${updatedJob?.job_id} is updated to ${status}`,
		);
		// });
	} catch (e: unknown) {
		console.log(`[notifyDB] error`);
		console.log(e);
	}
}

export const worker = new Worker(
	"jobQueue",
	async job => {
		// console.log("at worker", { job });

		try {
			// const p = new Promise(res => setTimeout(res, 10000));
			// await p.then(res => console.log("promise complete"));
			const output = await resizeImage(job.data.path);
			if (!output) {
			}
			await job.updateData({
				...job.data,
				result_path: output?.processedImage,
			});
		} catch (error) {}
	},
	{ connection, concurrency: 5, autorun: false },
);

// await worker.run();

// worker.on("completed", job => {
// 	console.log("Done", job);
// });

worker.on("active", job => {
	console.log(
		`Job ${job.id} is now active. data ${JSON.stringify(job.data)}`,
	);
});

worker.on("completed", async job => {
	// @ts-ignore
	await notifyDB(job, "COMPLETED");

	console.log(`Job ${job.id} is complete. data ${JSON.stringify(job.data)}`);
});

worker.on("failed", async job => {
	// @ts-ignore
	await notifyDB(job, "FAILED");
	console.log(`Job is failed`);
	console.error(JSON.stringify(job));
});
