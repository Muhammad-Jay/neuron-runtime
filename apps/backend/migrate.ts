import { drizzle } from 'drizzle-orm/postgres-js';
import { migrate } from 'drizzle-orm/postgres-js/migrator';
import * as postgres from "postgres";
import * as dotenv from 'dotenv';

dotenv.config({ path: '.env' });

const connectionString = process.env.DATABASE_URL!;
const sql = postgres(connectionString, { max: 1 });
const db = drizzle(sql);

async function main() {
    try {
        await migrate(db, { migrationsFolder: 'src/db/migrations' });
        process.exit(0);
    } catch (error) {
        console.error('Error applying migrations:', error);
        process.exit(1);
    } finally {
        await sql.end();
    }
}

main();
