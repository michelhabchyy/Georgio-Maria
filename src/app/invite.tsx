"use client";

import { useActionState, useState } from "react";
import { rsvp, type RsvpResult } from "./actions";
import { party } from "@/lib/config";

// The invitation card plus the RSVP form. After a guest responds, the form is
// swapped for a thank-you note.
export default function Invite() {
  const [attending, setAttending] = useState<"yes" | "no">("yes");
  const [state, formAction, pending] = useActionState<
    RsvpResult | null,
    FormData
  >(rsvp, null);

  const done = state?.ok === true;

  return (
    <div className="flex flex-col items-center gap-8 text-center">
      <Invitation />

      {done ? (
        <ThankYou state={state!} />
      ) : (
        <form
          action={formAction}
          className="flex w-full max-w-sm flex-col items-stretch gap-4 text-left"
        >
          <p className="text-center text-lg font-medium text-white">
            {party.rsvp.prompt}
          </p>

          <input
            name="name"
            required
            placeholder="Your name"
            className="w-full rounded-xl border border-white/15 bg-white/5 px-4 py-3 text-white placeholder:text-white/30 focus:border-rose-400/60 focus:outline-none"
          />

          {/* Attending yes / no. */}
          <input type="hidden" name="attending" value={attending} />
          <div className="flex gap-3">
            <Choice
              active={attending === "yes"}
              onClick={() => setAttending("yes")}
              label="I'll be there"
            />
            <Choice
              active={attending === "no"}
              onClick={() => setAttending("no")}
              label="Can't make it"
            />
          </div>

          {party.rsvp.askGuestCount && attending === "yes" && (
            <label className="flex items-center justify-between gap-3 text-sm text-white/70">
              Extra guests coming with you
              <input
                name="guests"
                type="number"
                min={0}
                max={20}
                defaultValue={0}
                className="w-20 rounded-xl border border-white/15 bg-white/5 px-3 py-2 text-center text-white focus:border-rose-400/60 focus:outline-none"
              />
            </label>
          )}

          {party.rsvp.askMessage && (
            <textarea
              name="message"
              rows={2}
              placeholder={party.rsvp.messageLabel}
              className="w-full rounded-xl border border-white/15 bg-white/5 px-4 py-3 text-white placeholder:text-white/30 focus:border-rose-400/60 focus:outline-none"
            />
          )}

          {state?.error && (
            <p className="text-sm text-rose-300">{state.error}</p>
          )}

          <button
            type="submit"
            disabled={pending}
            className="rounded-full bg-rose-500 px-8 py-3 font-medium text-white shadow-lg shadow-rose-500/30 transition-transform hover:scale-[1.02] hover:bg-rose-400 disabled:opacity-60"
          >
            {pending ? "Sending…" : "Send RSVP"}
          </button>
        </form>
      )}
    </div>
  );
}

// The read-only details of the invitation.
function Invitation() {
  return (
    <div className="flex flex-col items-center gap-5">
      <p className="text-sm uppercase tracking-[0.3em] text-rose-300/80">
        {party.eyebrow}
      </p>
      <h1 className="text-4xl font-semibold tracking-tight text-white sm:text-6xl">
        {party.title}
      </h1>
      {party.subtitle && (
        <p className="text-lg text-rose-100/80">{party.subtitle}</p>
      )}

      <dl className="mt-2 grid gap-2 text-white/85">
        <Detail label="When" value={[party.date, party.time]} />
        <Detail label="Where" value={[party.location, party.address]} />
        <Detail label="Dress" value={[party.dressCode]} />
      </dl>

      {party.note && (
        <p className="max-w-md text-sm text-white/60">{party.note}</p>
      )}

      {party.secretNote && (
        <p className="mt-1 max-w-md rounded-2xl border border-rose-400/30 bg-rose-500/10 px-4 py-3 text-sm text-rose-100">
          🤫 {party.secretNote}
        </p>
      )}
    </div>
  );
}

// One "When / Where / Dress" row. Hidden entirely if it has no values.
function Detail({ label, value }: { label: string; value: string[] }) {
  const parts = value.filter(Boolean);
  if (parts.length === 0) return null;
  return (
    <div className="flex items-baseline justify-center gap-3">
      <dt className="w-14 text-right text-xs uppercase tracking-widest text-rose-300/60">
        {label}
      </dt>
      <dd className="text-left">{parts.join(" · ")}</dd>
    </div>
  );
}

function Choice({
  active,
  onClick,
  label,
}: {
  active: boolean;
  onClick: () => void;
  label: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex-1 rounded-xl border px-4 py-2.5 text-sm font-medium transition-colors ${
        active
          ? "border-rose-400 bg-rose-500/20 text-white"
          : "border-white/15 text-white/60 hover:text-white/80"
      }`}
    >
      {label}
    </button>
  );
}

function ThankYou({ state }: { state: RsvpResult }) {
  return (
    <div className="flex flex-col items-center gap-4">
      <div className="text-5xl">{state.attending ? "🎉" : "💛"}</div>
      <p className="max-w-md text-lg text-rose-100/90">
        {state.attending ? party.rsvp.thanksYes : party.rsvp.thanksNo}
      </p>
      {!state.saved && (
        <p className="text-xs text-white/30">
          (Shown here only — connect the database to keep RSVPs.)
        </p>
      )}
    </div>
  );
}
