"use client";

import { useActionState, useEffect, useRef, useState } from "react";
import { rsvp, type RsvpResult } from "./actions";
import { party } from "@/lib/config";
import RingGraphic from "./ring";

// Two acts:
//   1. a sealed envelope, centered — click to open
//   2. the opened invitation: details you scroll through, then the RSVP
export default function Invite() {
  const [opening, setOpening] = useState(false);
  const [opened, setOpened] = useState(false);

  function open() {
    if (opening) return;
    setOpening(true);
    // Let the flap finish lifting, then reveal the letter.
    setTimeout(() => setOpened(true), 850);
  }

  if (!opened) {
    return (
      <div className="flex min-h-dvh flex-col items-center justify-center gap-10 p-8">
        <div className="env-scene">
          <button
            type="button"
            onClick={open}
            aria-label="Open the invitation"
            className={`envelope ${opening ? "is-open" : ""}`}
          >
            <span className="env-body" />
            <span className="env-pocket" />
            <span className="env-front">
              <span className="env-title">{party.envelopeText}</span>
              {party.envelopeSubtext && (
                <span className="env-subtitle">{party.envelopeSubtext}</span>
              )}
            </span>
            <span className="env-flap" />
          </button>
        </div>
        <p
          className={`text-sm uppercase tracking-[0.35em] text-[#9166cc] ${
            opening ? "opacity-0" : "animate-softpulse"
          } transition-opacity`}
        >
          Tap to open
        </p>
      </div>
    );
  }

  return (
    <div className="flex min-h-dvh flex-col items-center px-5 py-14 sm:py-20">
      <div className="animate-rise w-full max-w-lg">
        <Letter />
        <ScrollHint />
        <RsvpSection />
        {party.signature && (
          <p className="mt-14 text-center font-serif text-lg italic text-[#7c5aa6]">
            {party.signature}
          </p>
        )}
      </div>
    </div>
  );
}

// The invitation itself — a sheet of cream paper.
function Letter() {
  return (
    <section className="lux-card overflow-hidden rounded-[24px] px-7 py-12 text-center sm:px-12">
      <RingGraphic className="mx-auto -mt-2 mb-2 h-32 w-32 sm:h-40 sm:w-40" />

      <p className="text-xs uppercase tracking-[0.4em] text-[#9166cc]">
        {party.eyebrow}
      </p>

      <h1 className="mt-5 font-serif text-4xl leading-tight text-[#4a2e7a] sm:text-5xl">
        {party.title}
      </h1>
      {party.subtitle && (
        <p className="mt-3 font-serif text-xl italic text-[#7c5aa6]">
          {party.subtitle}
        </p>
      )}

      <Ornament />

      <dl className="flex flex-col gap-6">
        <Detail label="" value={[party.date, party.time]} />
        <Detail
          label=""
          value={[party.location, party.address]}
          href={party.mapUrl}
        />
        <Detail label="Dress" value={[party.dressCode]} />
      </dl>

      {party.note && (
        <p className="mx-auto mt-8 max-w-sm text-sm leading-relaxed text-[#726a92]">
          {party.note}
        </p>
      )}

      {party.secretNote && (
        <p className="mx-auto mt-6 max-w-sm rounded-2xl border border-[#dcccf5] bg-[#f0e9fb] px-5 py-3 text-sm leading-relaxed text-[#5b447f]">
          🤫 {party.secretNote}
        </p>
      )}
    </section>
  );
}

// One "When / Where / Dress" row; hidden entirely if it has no values.
// Pass `href` to add a Google Maps link beneath the values.
function Detail({
  label,
  value,
  href,
}: {
  label: string;
  value: string[];
  href?: string;
}) {
  const parts = value.filter(Boolean);
  if (parts.length === 0) return null;
  return (
    <div>
      <dt className="text-xs uppercase tracking-[0.3em] text-[#9166cc]">
        {label}
      </dt>
      <dd className="mt-1 font-serif text-lg text-[#4a2e7a]">
        {parts.map((p, i) => (
          <span key={i} className="block">
            {p}
          </span>
        ))}
      </dd>
      {href && (
        <a
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-2 inline-flex items-center gap-1.5 rounded-full border border-[#e2d8f2] bg-[#ffffff]/60 px-3.5 py-1.5 text-xs font-medium tracking-wide text-[#7c5aa6] transition-colors hover:border-[#9166cc] hover:text-[#4a2e7a]"
        >
          <span aria-hidden>📍</span> View on Google Maps
        </a>
      )}
    </div>
  );
}

function Ornament() {
  return (
    <div className="my-9 flex items-center justify-center gap-4 text-[#a98fd0]">
      <span className="gold-rule w-16" />
      <span className="text-lg">❦</span>
      <span className="gold-rule w-16" />
    </div>
  );
}

function ScrollHint() {
  return (
    <div className="animate-softpulse mt-8 flex flex-col items-center gap-1 text-[#9166cc]">
      <span className="text-xs uppercase tracking-[0.3em]">Scroll to RSVP</span>
      <span aria-hidden className="text-lg">
        ↓
      </span>
    </div>
  );
}

// Name + message, submitted to the couple.
function RsvpSection() {
  const [attending, setAttending] = useState<"yes" | "no">("yes");
  const [state, formAction, pending] = useActionState<
    RsvpResult | null,
    FormData
  >(rsvp, null);
  const sectionRef = useRef<HTMLDivElement>(null);

  // When the RSVP is recorded, bring the confirmation into view.
  useEffect(() => {
    if (state?.ok) sectionRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [state]);

  return (
    <section
      ref={sectionRef}
      className="lux-card mt-12 rounded-[24px] px-7 py-10 sm:px-12"
    >
      {state?.ok ? (
        <div className="flex flex-col items-center gap-4 text-center">
          <div className="text-5xl">{state.attending ? "🎉" : "💛"}</div>
          <p className="max-w-sm font-serif text-xl text-[#4a2e7a]">
            {state.attending ? party.rsvp.thanksYes : party.rsvp.thanksNo}
          </p>
          {!state.saved && (
            <p className="text-xs text-[#9a8fc0]">
              (Shown here only — connect the database to keep RSVPs.)
            </p>
          )}
        </div>
      ) : (
        <form action={formAction} className="flex flex-col gap-5">
          <div className="text-center">
            <h2 className="font-serif text-2xl text-[#4a2e7a]">
              {party.rsvp.prompt}
            </h2>
            <p className="mt-2 text-sm text-[#726a92]">{party.rsvp.intro}</p>
          </div>

          <input
            name="name"
            required
            placeholder="Your name"
            className="w-full rounded-xl border border-[#e2d8f2] bg-[#ffffff] px-4 py-3 text-[#4a2e7a] placeholder:text-[#b3a6d0] focus:border-[#9166cc] focus:outline-none"
          />

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

          {party.rsvp.askPlusOne && attending === "yes" && (
            <label className="flex cursor-pointer items-center gap-3 rounded-xl border border-[#e2d8f2] bg-[#faf7ff] px-4 py-3 text-sm text-[#4a2e7a] transition-colors hover:border-[#8b5fbf]">
              <input
                type="checkbox"
                name="guests"
                value="1"
                className="h-5 w-5 accent-[#7a4bb8]"
              />
              {party.rsvp.plusOneLabel}
            </label>
          )}

          {party.rsvp.askMessage && (
            <textarea
              name="message"
              rows={4}
              placeholder={party.rsvp.messageLabel}
              className="w-full rounded-xl border border-[#e2d8f2] bg-[#ffffff] px-4 py-3 text-[#4a2e7a] placeholder:text-[#b3a6d0] focus:border-[#9166cc] focus:outline-none"
            />
          )}

          {state?.error && (
            <p className="text-sm text-[#b0553f]">{state.error}</p>
          )}

          <button
            type="submit"
            disabled={pending}
            className="mt-1 rounded-full bg-gradient-to-b from-[#8f63c9] to-[#6b3fa8] px-8 py-3.5 font-medium tracking-wide text-white shadow-[0_12px_24px_-8px_rgba(74,44,110,0.55),inset_0_1px_0_rgba(255,255,255,0.3)] transition-transform hover:scale-[1.02] hover:from-[#9b74d3] hover:to-[#7a4bb8] disabled:opacity-60"
          >
            {pending ? "Sending…" : "Send to the couple"}
          </button>
        </form>
      )}
    </section>
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
          ? "border-[#9166cc] bg-[#f0e9fb] text-[#4a2e7a]"
          : "border-[#e2d8f2] text-[#726a92] hover:text-[#4a2e7a]"
      }`}
    >
      {label}
    </button>
  );
}
