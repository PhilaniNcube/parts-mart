function required(name: string, fallback?: string): string {
  const value = process.env[name] ?? fallback;
  if (!value) {
    throw new Error(`Missing required env var: ${name}`);
  }
  return value;
}

export const env = {
  TURSO_DATABASE_URL: process.env.TURSO_DATABASE_URL ?? "file:local.db",
  TURSO_AUTH_TOKEN: process.env.TURSO_AUTH_TOKEN ?? "",
  BETTER_AUTH_SECRET: required("BETTER_AUTH_SECRET", "dev-secret-change-me"),
  BETTER_AUTH_URL:
    process.env.BETTER_AUTH_URL ?? process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000",
  RESEND_API_KEY: process.env.RESEND_API_KEY ?? "",
  ALERT_FROM_EMAIL: process.env.ALERT_FROM_EMAIL ?? "alerts@example.com",
  CRON_SECRET: process.env.CRON_SECRET ?? "",
  SEED_ADMIN_EMAIL: process.env.SEED_ADMIN_EMAIL ?? "admin@partsmart.test",
  SEED_ADMIN_PASSWORD: process.env.SEED_ADMIN_PASSWORD ?? "changeme123",
} as const;