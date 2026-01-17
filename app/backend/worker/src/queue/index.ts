import { Queue } from "bullmq";
import { randomUUID } from "node:crypto";

const imageDelete = new Queue("imageDeleteQueue", {
	defaultJobOptions: {
		removeOnComplete: true,
		removeOnFail: true,
	},
});

export async function addJobs(path: string) {
	await imageDelete.add(randomUUID(), { path });
}

// addJobs()
