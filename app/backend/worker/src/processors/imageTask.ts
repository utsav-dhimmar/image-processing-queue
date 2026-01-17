import path from "path";
import sharp, { type Sharp } from "sharp";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename); // cwd
const OUTPUTDIR = path.join(__dirname, "normal");
const INPUTDIR = path.join(__dirname, "images");
// console.log({ OUTPUTDIR, INPUTDIR, __dirname, __filename });

const cDir = __dirname;
const rootPath = path.resolve(cDir, "..", "..", "..");
const inPath = path.join(rootPath, "uploads", "raw");
const outPath = path.join(rootPath, "uploads", "processed");

export class ImageTask {
	private outPath = path.join(rootPath, "uploads", "processed");
	private inputPath = path.join(rootPath, "uploads", "raw");

	imgFullPath: string;
	imgName: string;
	actualPath: string;

	constructor(imgFullPath: string) {
		this.imgFullPath = imgFullPath;
		this.imgName = imgFullPath.split("\\").pop() || "";
		this.actualPath = path.join(inPath, this.imgName);
	}
	async grayScaleImage() {
		const res = sharp(this.actualPath).grayscale(true);
		await this.saveFile(res);
	}
	async resize(resizeOption: { height: number; width: number }) {
		const res = sharp(this.actualPath).resize({
			height: resizeOption.height,
			width: resizeOption.width,
		});
		await this.saveFile(res);
	}
	// TODO: ADD MORE
	async saveFile(res: Sharp) {
		const processedImagePath = path.join(outPath, `resize${this.imgName}`);
		await res.toFile(processedImagePath);
	}
}

// export async function grayScaleImage(imgName: string) {
// 	try {
// 		const actualPath = path.join(inPath, imgName);
// 		const processedImage = path.join(outPath, `grayscale${imgName}`);
// 		return {
// 			sharpInfo: await sharp(actualPath)
// 				.grayscale(true)
// 				.toFile(processedImage),
// 			processedImage,
// 		};
// 	} catch (e: unknown) {
// 		console.log(`Error`, e);
// 	}
// }

export async function resizeImage(imgFullPath: string) {
	try {
		const imgName = imgFullPath.split("\\").pop() || "";
		const actualPath = path.join(inPath, imgName);
		const processedImage = path.join(outPath, `resize${imgName}`);

		return {
			sharpInfo: await sharp(actualPath)
				.resize({
					width: 200,
				})
				.toFile(processedImage),
			processedImage,
		};
	} catch (e: unknown) {
		console.log(`Error`, e);
	}
}
