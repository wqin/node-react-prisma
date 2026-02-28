const path = require("path");
require("dotenv").config({ path: path.join(__dirname, "..", ".env") });
const { Client } = require("pg");

async function ensureBookTable(client) {
  // Create table if missing (includes description)
  await client.query(`
    CREATE TABLE IF NOT EXISTS "Book" (
      id SERIAL PRIMARY KEY,
      title TEXT NOT NULL,
      quantity INTEGER NOT NULL DEFAULT 1,
      description TEXT NOT NULL DEFAULT '',
      "updatedAt" TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      "createdAt" TIMESTAMPTZ NOT NULL DEFAULT NOW()
    );
  `);

  // Ensure description column exists for older schemas
  await client.query(`
    ALTER TABLE "Book"
    ADD COLUMN IF NOT EXISTS description TEXT NOT NULL DEFAULT '';
  `);
}

async function main() {
  const databaseUrl = process.env.DATABASE_URL || process.env.DIRECT_URL;
  if (!databaseUrl) {
    console.error("Missing DATABASE_URL / DIRECT_URL in environment");
    process.exit(1);
  }

  const useSsl = process.env.DATABASE_SSL === "true";
  const client = new Client({
    connectionString: databaseUrl,
    ssl: useSsl ? { rejectUnauthorized: false } : false,
  });

  try {
    await client.connect();
    await ensureBookTable(client);
    console.log("Book table ensured (description column present).");
  } catch (err) {
    console.error(err);
    process.exitCode = 1;
  } finally {
    await client.end();
  }
}

main();
