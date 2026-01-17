import fs from "fs/promises";
import data from "./data.json" with { type: "json" };
// type Data = typeof data

const doesFileExits = async (filePath: string) => {
	try {
		await fs.access(filePath, fs.constants.F_OK);
		return true;
	} catch (e) {
		console.log(`File not found ${filePath}`);
		return false;
	}
};

export const deleteFile = async (filePath: string) => {
	try {
		if (await doesFileExits(filePath)) {
			await fs.unlink(filePath);
			console.log(`${filePath} deleted sucessfully`);
		}
	} catch (error) {
		console.log(`[ERROR] unable to delete ${filePath}`);
		console.log(error);
	}
};

const rawFiles = data.map(d => d["temp_path"]);
const processedFiles = data.map(({ result_url }) => result_url);

processedFiles.forEach(async path => {
	await deleteFile(path);
});
