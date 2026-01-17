import { config } from "dotenv";
import { defineConfig } from "drizzle-kit";

config({ path: "../.env" });

export default defineConfig({
	out: "./drizzle",
	schema: "./src/db/schema.ts",
	dialect: "postgresql",
	dbCredentials: {
		url: `postgresql://${process.env.DB_USER}:${process.env.DB_PASSWORD}@localhost:5432/${process.env.DB_NAME}`,
	},
});
