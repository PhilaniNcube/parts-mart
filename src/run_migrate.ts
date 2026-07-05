import { spawn } from "node:child_process";
import path from "node:path";

// Load prod env variables
try {
  (process as any).loadEnvFile(path.resolve(".env.production.local"));
  console.log("Loaded prod env variables from .env.production.local");
} catch (e) {
  console.error("Failed to load .env.production.local:", e);
  process.exit(1);
}

if (!process.env.TURSO_DATABASE_URL) {
  console.error("Error: TURSO_DATABASE_URL is empty in .env.production.local.");
  process.exit(1);
}

console.log("Migrating database:", process.env.TURSO_DATABASE_URL);

const isWindows = process.platform === "win32";
const cmd = isWindows ? "npx.cmd" : "npx";

const migrateProcess = spawn(cmd, ["drizzle-kit", "migrate"], {
  stdio: "inherit",
  env: process.env,
  shell: true,
});

migrateProcess.on("close", (code) => {
  process.exit(code ?? 0);
});
