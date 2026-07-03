import { neon } from "@neondatabase/serverless";

// A single place to talk to the Neon Postgres database.
// DATABASE_URL is set as an environment variable:
//   - locally in `.env.local`
//   - on Render in the service's "Environment" settings
//
// `sql` is a tagged-template function:
//   const rows = await sql`SELECT * FROM proposals WHERE id = ${id}`;
// Values passed via ${...} are sent as parameters, so this is safe from SQL injection.

export function getSql() {
  const url = process.env.DATABASE_URL;
  if (!url) {
    throw new Error(
      "DATABASE_URL is not set. Add it to .env.local (locally) or the Render environment (in production)."
    );
  }
  return neon(url);
}

// Convenience: true when a database is configured. Lets pages/health checks
// degrade gracefully before the database is wired up.
export function hasDatabase(): boolean {
  return Boolean(process.env.DATABASE_URL);
}

// Creates the RSVP table if it doesn't exist yet. Safe to call on every
// write — `IF NOT EXISTS` makes it a no-op once the table is there.
export async function ensureSchema() {
  const sql = getSql();
  await sql`
    CREATE TABLE IF NOT EXISTS party_rsvps (
      id         SERIAL PRIMARY KEY,
      name       TEXT NOT NULL,
      attending  BOOLEAN NOT NULL,
      guests     INTEGER NOT NULL DEFAULT 0,
      message    TEXT,
      created_at TIMESTAMPTZ NOT NULL DEFAULT now()
    )
  `;
}
