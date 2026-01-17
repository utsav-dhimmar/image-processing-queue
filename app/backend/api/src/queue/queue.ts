import { Queue } from "bullmq";

const imageJobQueue = new Queue("jobQueue", {
	defaultJobOptions: {
		removeOnComplete: true,
	},
});

interface ImageData {
	path: string;
	operation: string;
	value: string | number | boolean;
	jobId: string;
}

export async function addInQueue(imageData: ImageData) {
	const queueResponse = await imageJobQueue.add("image", imageData, {
		attempts: 1,
		jobId: imageData.jobId,
	});
	return queueResponse;
}

async function queueItems() {
	const res = await imageJobQueue.count();
	console.log(`Total ${res} items in queue`);
}

await queueItems();
