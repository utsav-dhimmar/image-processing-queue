import { deleteFile } from "@/utils/index.js";
import { Worker } from "bullmq";
import IORedis from "ioredis";

// @ts-ignore
const connection = new IORedis({ maxRetriesPerRequest: null });

export const worker = new Worker(
	"imageDeleteQueue",
	async job => {
		await deleteFile(job.data.path);

		try {
		} catch (error) {}
	},
	{ connection, concurrency: 1, autorun: false },
);

// await worker.run();

// worker.on("completed", job => {
// 	console.log("Done", job);
// });

worker.on("active", job => {
	console.log(`Job ${job.id} is now active.`);
});

worker.on("completed", async job => {
	console.log(`Job ${job.id} is complete.`);
});

worker.on("failed", async (job, e) => {
	if (job) {
		console.log(`Job ${job.id} is failed`);
	}
	console.log(`error \n ${e.message}`);
});
