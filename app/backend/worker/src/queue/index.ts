import { Queue } from "bullmq";
import { randomUUID } from "node:crypto";
import IORedis from "ioredis";

// @ts-ignore
const connection = new IORedis({ maxRetriesPerRequest: null });

const imageDelete = new Queue("imageDeleteQueue", {
	connection,
	defaultJobOptions: {
		removeOnComplete: true,
		removeOnFail: true,
	},
});

export async function addJobs(path: string) {
	await imageDelete.add(randomUUID(), { path });
}

// addJobs()
