import { ROOTPATH } from "@/constants.js";
import multer from "multer";
import path from "path";

const uploaddir = path.join(ROOTPATH, "uploads", "raw");
const storage = multer.diskStorage({
	destination: function (req, res, cb) {
		cb(null, uploaddir);
	},
	filename: function (req, file, cb) {
		cb(
			null,

			`${Date.now()}__${file.originalname.replaceAll(" ", "_")}`,
		);
	},
});

export const uploadWithMulter = multer({ storage });
