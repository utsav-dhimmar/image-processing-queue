import { config } from "dotenv";
import * as z from "zod";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url)
const __dirnmae = path.dirname(__filename)
export const ROOTPATH = path.resolve(__dirnmae, "..", "..")
export const ENVPATH = path.join(ROOTPATH, ".env")


config({
	path: ENVPATH,
});

const envSchema = z.object({
	DB_USER: z.string(),
	DB_PASSWORD: z.string(),
	DB_NAME: z.string(),
	PORT: z.string(),
});
export type Env = z.infer<typeof envSchema>;

export const env: Env = envSchema.parse(process.env);

export const DATABASE_URL = `postgresql://${env.DB_USER}:${env.DB_PASSWORD}@localhost:5432/${env.DB_NAME}`;
