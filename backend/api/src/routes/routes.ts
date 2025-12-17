import { db, jobTable } from "@/db/schema.js";
import { and, eq, lt, or } from "drizzle-orm";
import { Router } from "express";
import {
  getAllInfo,
  statusCheckController,
  uploadController,
} from "../controllers/controller.js";
import { uploadWithMulter } from "../middleware/multer.js";

const router: Router = Router();

router.use(uploadWithMulter.single("img"));

/*
{
  path:"",
  operation:"",
  value:"",

}
*/
router.post("/upload", uploadController);

router.get("/status/:id", statusCheckController);

router.get("/all", getAllInfo);

router.get("/dev", async (req, res) => {
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

	return res.json({
		dbResponse,
	});
});
export default router;
