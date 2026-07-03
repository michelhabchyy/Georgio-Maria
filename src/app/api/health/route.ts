import { getSql, hasDatabase } from "@/lib/db";

// Health check for the whole pipeline.
// Visit /api/health in the browser after deploying:
//   - { ok: true, database: "connected", time: "..." }  => Render + Neon are talking
//   - { ok: true, database: "not_configured" }          => app is up, DATABASE_URL not set yet
//   - { ok: false, ... }                                => the database URL is set but the query failed
export async function GET() {
  if (!hasDatabase()) {
    return Response.json({ ok: true, database: "not_configured" });
  }

  try {
    const sql = getSql();
    const rows = await sql`SELECT now() AS time`;
    return Response.json({
      ok: true,
      database: "connected",
      time: rows[0]?.time ?? null,
    });
  } catch (err) {
    return Response.json(
      { ok: false, database: "error", message: (err as Error).message },
      { status: 500 }
    );
  }
}
