"use server";

import { ensureSchema, getSql, hasDatabase } from "@/lib/db";

export type RsvpResult = {
  ok: boolean;
  attending: boolean;
  // true  -> written to the database
  // false -> shown on screen only (no DATABASE_URL yet, or a write error)
  saved: boolean;
  error?: string;
};

// Records a guest's RSVP. Called from the client via <form action>.
// Degrades gracefully: if the database isn't wired up yet, the guest still
// sees a confirmation — we just can't persist it.
export async function rsvp(
  _prev: RsvpResult | null,
  formData: FormData
): Promise<RsvpResult> {
  const name = String(formData.get("name") ?? "").trim();
  const attending = String(formData.get("attending") ?? "yes") === "yes";
  const guestsRaw = parseInt(String(formData.get("guests") ?? "0"), 10);
  const guests = Number.isFinite(guestsRaw)
    ? Math.max(0, Math.min(guestsRaw, 20))
    : 0;
  const message = String(formData.get("message") ?? "").trim();

  if (!name) {
    return { ok: false, attending, saved: false, error: "Please enter your name." };
  }

  if (!hasDatabase()) {
    return { ok: true, attending, saved: false };
  }

  try {
    await ensureSchema();
    const sql = getSql();
    await sql`
      INSERT INTO party_rsvps (name, attending, guests, message)
      VALUES (${name}, ${attending}, ${attending ? guests : 0}, ${message || null})
    `;
    return { ok: true, attending, saved: true };
  } catch (err) {
    // The guest's confirmation should never fail because the DB hiccuped.
    return { ok: true, attending, saved: false, error: (err as Error).message };
  }
}
