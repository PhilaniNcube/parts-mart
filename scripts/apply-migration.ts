import { createClient } from "@libsql/client";
import { readFileSync, readdirSync } from "node:fs";

async function main() {
  const sqlFiles = readdirSync("drizzle").filter((f) => f.endsWith(".sql")).sort();
  if (!sqlFiles.length) throw new Error("No migration SQL files found in drizzle/");
  const sqlPath = `drizzle/${sqlFiles[sqlFiles.length - 1]}`;
  console.log(`Reading ${sqlPath}…`);

  const client = createClient({ url: "file:local.db" });
  const sql = readFileSync(sqlPath, "utf8");

  const statements = sql
    .split("--> statement-breakpoint")
    .map((s) => s.replace(/;$/, "").trim())
    .filter((s: string) => s.length > 0 && !s.startsWith("--"));

  console.log(`Applying ${statements.length} statements…`);
  for (const stmt of statements) {
    try {
      await client.execute(stmt);
    } catch (e) {
      console.error("Failed on:", stmt.slice(0, 80), "\n", e);
    }
  }

  try {
    await client.execute(
      "CREATE TABLE IF NOT EXISTS `__drizzle_migrations` (id INTEGER PRIMARY KEY AUTOINCREMENT, hash TEXT NOT NULL, created_at NUMERIC)",
    );
  } catch {}

  const r = await client.execute("SELECT name FROM sqlite_master WHERE type='table' ORDER BY name");
  console.log("Tables:", r.rows.map((x) => String(x.name)).join(", "));
}

main().catch(console.error);