import { db, jobTable } from "@/db/schema.js";
import { addInQueue } from "@/queue/queue.js";
import { eq } from "drizzle-orm";
import type { Request, Response } from "express";
import path from "path";

export const uploadController = async (req: Request, res: Response) => {
	// 1. store in server for few time ✅
	// 2. put in queue and get job id ✅
	// 3. set job id , status and attempt amout in db ✅
	// 4. send job id (db) so user can check status ✅

	// TODO: apply validation
	const { operation, value } = req.body;
	const imageStoreDir = req.file?.destination as string;
	const imageName = req.file?.filename as string;
	const imagePath: string = path.join(imageStoreDir, imageName);

	const newJob = await db
		.insert(jobTable)
		.values({
			status: "PENDING",
			temp_path: imagePath,
		})
		.returning({ insertedId: jobTable.id, insertedUUID: jobTable.job_id });
	const imageData = {
		operation: operation,
		path: imagePath,
		value: value,
		jobId: newJob[0]?.insertedUUID as string,
	};
	const jobId = (await addInQueue(imageData)).id;
	return res.json({
		message: "added in queue wait for few moments",
		id: newJob[0]?.insertedId,
	});
};

export const statusCheckController = async (
	req: Request<{ id: string }>,
	res: Response,
) => {
	const id = req.params.id;

	const [statusInfo] = await db
		.select()
		.from(jobTable)
		.where(eq(jobTable.id, Number(id)));
	console.log(statusInfo);
	// TODO : complete it
	// if(!statusInfo){}
	const download_url = `${req.host}/r/${statusInfo?.result_url?.split("\\").pop()}`;
	return res.json({
		statusInfo,
		download_url,
	});
};

export const getAllInfo = async (req: Request, res: Response) => {
	const allJobs = await db.select().from(jobTable);
	return res.json({
		jobs: allJobs,
	});
};
