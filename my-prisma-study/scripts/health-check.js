const path = require("path");
const { Client } = require("pg");
require("dotenv").config({ path: path.join(__dirname, "..", ".env") });

const PORT = process.env.PORT || 5001;
const API_BASE = process.env.API_BASE_URL || `http://localhost:${PORT}`;

async function checkDb() {
  const databaseUrl = process.env.DATABASE_URL || process.env.DIRECT_URL;
  if (!databaseUrl) {
    throw new Error("DATABASE_URL / DIRECT_URL 未配置");
  }

  const client = new Client({
    connectionString: databaseUrl,
    ssl: { rejectUnauthorized: false },
  });

  await client.connect();
  await client.query("SELECT 1");
  await client.end();
}

async function checkApi() {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 5000);
  try {
    const response = await fetch(`${API_BASE}/api/health`, {
      signal: controller.signal,
    });
    if (!response.ok) {
      const text = await response.text();
      throw new Error(text || `HTTP ${response.status}`);
    }
    return await response.json();
  } finally {
    clearTimeout(timeoutId);
  }
}

async function main() {
  try {
    await checkDb();
    console.log("[OK] Database connection");
  } catch (error) {
    console.error("[FAIL] Database connection:", error.message);
  }

  try {
    const data = await checkApi();
    console.log("[OK] API health:", data);
  } catch (error) {
    const detail = error.message;
    console.error("[FAIL] API health:", detail);
  }
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
