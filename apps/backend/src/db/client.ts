import { drizzle } from "drizzle-orm/postgres-js";
import * as dotenv from "dotenv";
import * as schema from "../schemas/index";
import postgres from "postgres";

dotenv.config({ path: ".env" });

if (!process.env.DATABASE_URL) {
    throw new Error("DATABASE_URL is not set in .env");
}

const connectionString = process.env.DATABASE_URL;

const client = postgres(connectionString, {
    prepare: false,
});

export const db = drizzle(client, { schema });