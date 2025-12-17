import { config } from "dotenv";
import { sql } from "drizzle-orm";
import { drizzle } from "drizzle-orm/node-postgres";
import {
    integer,
    pgTable,
    timestamp,
    uuid,
    varchar,
} from "drizzle-orm/pg-core";
config({ path: "../.env" });
export const db = drizzle({
	connection: `postgresql://${process.env.DB_USER}:${process.env.DB_PASSWORD}@localhost:5432/${process.env.DB_NAME}`,
});

async function dbConnectionCheck() {
	try {
		const res = await db.execute(sql`SELECT 1`);
		console.log("DB connected success");
	} catch (e: unknown) {
		console.error(`DB connection failed !! errors `);
		console.log(e);
		process.exit(1);
	}
}
dbConnectionCheck();

export const operation_typesTable = pgTable("operation_types", {
	id: integer().primaryKey().generatedAlwaysAsIdentity(),
	name: varchar({
		length: 50,
		enum: ["GRAYSCALE", "RESIZE", "COMPRESS"],
	}).notNull(),
});

export const operationTable = pgTable("operation", {
	id: integer().primaryKey().generatedAlwaysAsIdentity(),
	value: varchar({
		length: 255,
	}).notNull(),
	type_of_operation: integer()
		.notNull()
		.references(() => operation_typesTable.id),

	created_at: timestamp("created_at", { withTimezone: true })
		.notNull()
		.defaultNow(), // Sets the creation time by default
	updated_at: timestamp("updated_at", { mode: "date" })
		.notNull()
		.defaultNow() // Sets an initial value
		.$onUpdate(() => new Date()),
});

export const jobTable = pgTable("jobs", {
	id: integer().primaryKey().generatedAlwaysAsIdentity(),
	job_id: uuid().defaultRandom().unique("unique_job_id"),
	temp_path: varchar({
		length: 255,
	}).notNull(),
	status: varchar({
		enum: ["PENDING", "PROCESSING", "COMPLETED", "FAILED"],
	}),

	operation_id: integer().references(() => operationTable.id),
	result_url: varchar().unique(),
	created_at: timestamp("created_at", { withTimezone: true })
		.notNull()
		.defaultNow(), // Sets the creation time by default
	updated_at: timestamp("updated_at", { mode: "date" })
		.notNull()
		.defaultNow() // Sets an initial value
		.$onUpdate(() => new Date()),
});
