import { env } from "@/constants.js";
// import { config } from "dotenv";
import express from "express";
// config({
// 	path: "../.env",
// });
import uploadRoutes from "@/routes/routes.js";
import path from "path";
import { fileURLToPath } from "url";
const app = express();

const __filename = fileURLToPath(import.meta.url);
const __dirnmae = path.dirname(__filename);
const outpath = path.join(__dirnmae, "..", "..", "uploads", "processed");

app.use("/r", express.static(outpath));
app.use("/", uploadRoutes);

app.listen(env.PORT, () => {
	console.log(`[SERVER] running at http://localhost:${env.PORT}`);
});
