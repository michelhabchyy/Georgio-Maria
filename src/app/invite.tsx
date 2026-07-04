"use client";

import { useActionState, useEffect, useRef, useState } from "react";
import { rsvp, type RsvpResult } from "./actions";
import { party } from "@/lib/config";

// The user clicks the text and the invitation is shown.
export default function Invite() {
  const [revealed, setRevealed] = useState(false);

  if (revealed) return <Invitation />;
  return <Intro onOpen={() => setRevealed(true)} />;
}

// Just the "Can you keep a secret?" line with a "tap to open" prompt, centered.
function Intro({ onOpen }: { onOpen: () => void }) {
  const [fading, setFading] = useState(false);

  function open() {
    if (fading) return;
    setFading(true);
    setTimeout(onOpen, 550);
  }

  return (
    <div className={`reveal-scene ${fading ? "is-fading" : ""}`}>
      <button
        type="button"
        onClick={open}
        aria-label="Open the invitation"
        className="flex cursor-pointer flex-col items-center gap-6 border-0 bg-transparent p-8 transition-transform hover:scale-[1.02]"
      >
        <p className="font-display text-4xl leading-tight text-[#6a58a0] sm:text-5xl">
          {party.envelopeText}
        </p>
        <p className="font-sans text-[11px] uppercase tracking-[0.45em] text-[#9a86c4] animate-softpulse">
          tap to open
        </p>
      </button>
    </div>
  );
}

// The full invitation shown after the envelope is clicked.
function Invitation() {
  return (
    <div className="flex min-h-dvh flex-col items-center px-5 py-16 sm:py-24">
      <div className="animate-rise w-full max-w-lg">
        <Letter />
        <EventFlow />
        <ScrollHint />
        <RsvpSection />
        {party.signature && (
          <div className="mt-16 text-center font-script text-2xl leading-snug text-[#8b78b8]">
            {party.signature.split(/,\s*/).map((line, i, arr) => (
              <p key={i}>{i < arr.length - 1 ? `${line},` : line}</p>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

// The invitation itself.
function Letter() {
  return (
    <section className="lux-card overflow-hidden rounded-[26px] px-7 py-14 text-center sm:px-14">
      {party.eyebrow && (
        <p className="mb-6 font-script text-7xl leading-none text-[#33303d] sm:text-8xl">
          {party.eyebrow}
        </p>
      )}

      <h1 className="font-display text-[2.6rem] font-semibold leading-[1.08] text-[#6a58a0] sm:text-6xl">
        {party.title}
      </h1>
      {party.subtitle && (
        <p className="mt-3 font-script text-3xl text-[#8b78b8]">
          {party.subtitle}
        </p>
      )}

      <Ornament />

      <dl className="flex flex-col gap-7">
        <Detail label="" value={[party.date, party.time]} />
        <Detail
          label=""
          value={[party.location, party.address]}
          href={party.mapUrl}
        />
        <Detail label="Attire" value={[party.dressCode]} />
      </dl>

      {party.note && (
        <p className="mx-auto mt-10 max-w-sm font-display text-base leading-relaxed text-[#9f95bd]">
          {party.note}
        </p>
      )}

      {party.secretNote && (
        <p className="mx-auto mt-10 max-w-xs border-t border-[#dcdae6] pt-6 font-display text-base italic leading-relaxed text-[#8b78b8]">
          {party.secretNote}
        </p>
      )}
    </section>
  );
}

// One detail row; hidden entirely if it has no values.
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
      <dt className="font-sans text-[10px] uppercase tracking-[0.4em] text-[#9494a8]">
        {label}
      </dt>
      <dd className="mt-1.5 font-display text-2xl text-[#6a58a0]">
        {parts.map((p, i) => (
          <span key={i} className="block leading-snug">
            {p}
          </span>
        ))}
      </dd>
      {href && (
        <a
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-3 inline-block border-b border-[#d3d0e0] pb-0.5 font-sans text-[11px] uppercase tracking-[0.25em] text-[#9494a8] transition-colors hover:border-[#9494a8] hover:text-[#6a58a0]"
        >
          View on map
        </a>
      )}
    </div>
  );
}

function Ornament() {
  return (
    <div className="my-10 flex items-center justify-center gap-4">
      <span className="gold-rule w-20" />
      <span className="text-[0.6rem] text-[#9494a8]">◆</span>
      <span className="gold-rule w-20" />
    </div>
  );
}

// A horizontal timeline of the evening — nodes on a line, no times.
function EventFlow() {
  const t = party.timeline;
  if (!t?.steps?.length) return null;
  const inset = `${50 / t.steps.length}%`;

  return (
    <section className="lux-card mt-14 rounded-[26px] px-6 py-12 sm:px-14">
      {t.label && (
        <p className="text-center font-sans text-[11px] uppercase tracking-[0.4em] text-[#9494a8]">
          {t.label}
        </p>
      )}

      <div className="relative mt-9 flex items-start justify-between">
        {/* the connecting line, running between the first and last node */}
        <div
          className="absolute top-7 h-px bg-gradient-to-r from-transparent via-[#c9c9d6] to-transparent"
          style={{ left: inset, right: inset }}
        />
        {t.steps.map((step, i) => (
          <div
            key={i}
            className="relative flex flex-1 flex-col items-center gap-3 px-1 text-center"
          >
            <div className="grid h-14 w-14 place-items-center rounded-full border border-[#dcdae6] bg-[#faf9fe] text-[#8b78b8] shadow-[0_6px_14px_-8px_rgba(90,80,130,0.5)]">
              <StepIcon name={step.icon} />
            </div>
            <span className="font-display text-sm leading-tight text-[#6a58a0] sm:text-base">
              {step.label}
            </span>
          </div>
        ))}
      </div>

      {t.closing && (
        <p className="mx-auto mt-10 max-w-sm border-t border-[#dcdae6] pt-6 text-center font-display text-base italic leading-relaxed text-[#8b78b8]">
          {t.closing}
        </p>
      )}
    </section>
  );
}

// Simple line icons for the timeline nodes.
function StepIcon({ name }: { name: string }) {
  const p = {
    width: 24,
    height: 24,
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 1.5,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
    "aria-hidden": true,
  };
  switch (name) {
    case "glass":
      return (
        <svg {...p}>
          <path d="M7 3h10l-1.2 7.2a4 4 0 0 1-7.6 0z" />
          <path d="M12 13v6" />
          <path d="M9 20h6" />
        </svg>
      );
    case "dish":
      return (
        <svg {...p}>
          <circle cx="12" cy="12" r="7.5" />
          <circle cx="12" cy="12" r="3" />
        </svg>
      );
    case "music":
      return (
        <svg {...p}>
          <path d="M9 18V6l9-2v11" />
          <circle cx="7" cy="18" r="2" />
          <circle cx="16" cy="15" r="2" />
        </svg>
      );
    case "heart":
      return (
        <svg {...p}>
          <path d="M12 20s-7-4.5-7-10a4 4 0 0 1 7-2.6A4 4 0 0 1 19 10c0 5.5-7 10-7 10z" />
        </svg>
      );
    default:
      return (
        <svg {...p}>
          <circle cx="12" cy="12" r="3" />
        </svg>
      );
  }
}

function ScrollHint() {
  return (
    <div className="mt-10 flex flex-col items-center gap-2.5">
      <span className="font-sans text-[10px] uppercase tracking-[0.45em] text-[#9494a8]">
        Scroll
      </span>
      <span className="animate-softpulse h-9 w-px bg-gradient-to-b from-[#9494a8] to-transparent" />
    </div>
  );
}

// Name + message + optional +1, submitted to the couple.
function RsvpSection() {
  const [attending, setAttending] = useState<"yes" | "no">("yes");
  const [state, formAction, pending] = useActionState<
    RsvpResult | null,
    FormData
  >(rsvp, null);
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (state?.ok) sectionRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [state]);

  return (
    <section
      ref={sectionRef}
      className="lux-card mt-14 rounded-[26px] px-7 py-12 sm:px-14"
    >
      {state?.ok ? (
        <div className="flex flex-col items-center gap-5 text-center">
          <p className="font-script text-3xl text-[#8b78b8]">Thank you</p>
          <p className="max-w-sm font-display text-xl leading-relaxed text-[#6a58a0]">
            {state.attending ? party.rsvp.thanksYes : party.rsvp.thanksNo}
          </p>
          {!state.saved && (
            <p className="font-sans text-xs text-[#a99cbd]">
              (Shown here only — connect the database to keep RSVPs.)
            </p>
          )}
        </div>
      ) : (
        <form action={formAction} className="flex flex-col gap-5">
          <div className="text-center">
            <h2 className="font-display text-3xl font-medium text-[#6a58a0]">
              {party.rsvp.prompt}
            </h2>
            <p className="mt-2 font-display text-base text-[#9f95bd]">
              {party.rsvp.intro}
            </p>
          </div>

          <input
            name="name"
            required
            placeholder="Your name"
            className="w-full rounded-xl border border-[#dcdae6] bg-[#fbfaff] px-4 py-3.5 font-display text-lg text-[#6a58a0] placeholder:text-[#b8aac4] focus:border-[#9494a8] focus:outline-none"
          />

          <input type="hidden" name="attending" value={attending} />
          <div className="flex gap-3">
            <Choice
              active={attending === "yes"}
              onClick={() => setAttending("yes")}
              label="Joyfully accepts"
            />
            <Choice
              active={attending === "no"}
              onClick={() => setAttending("no")}
              label="Regretfully declines"
            />
          </div>

          {party.rsvp.askPlusOne && attending === "yes" && (
            <label className="flex cursor-pointer items-center gap-3 rounded-xl border border-[#dcdae6] bg-[#fbfaff] px-4 py-3.5 font-display text-base text-[#6a58a0] transition-colors hover:border-[#9494a8]">
              <input
                type="checkbox"
                name="guests"
                value="1"
                className="h-5 w-5 accent-[#9494a8]"
              />
              {party.rsvp.plusOneLabel}
            </label>
          )}

          {party.rsvp.askMessage && (
            <textarea
              name="message"
              rows={4}
              placeholder={party.rsvp.messageLabel}
              className="w-full rounded-xl border border-[#dcdae6] bg-[#fbfaff] px-4 py-3.5 font-display text-lg text-[#6a58a0] placeholder:text-[#b8aac4] focus:border-[#9494a8] focus:outline-none"
            />
          )}

          {state?.error && (
            <p className="font-sans text-sm text-[#b0553f]">{state.error}</p>
          )}

          <button
            type="submit"
            disabled={pending}
            className="mt-2 rounded-full bg-gradient-to-b from-[#ececf3] to-[#bcbcce] px-8 py-4 font-sans text-sm font-semibold uppercase tracking-[0.2em] text-[#5b4d8a] shadow-[0_14px_28px_-10px_rgba(120,120,150,0.5),inset_0_1px_0_rgba(255,255,255,0.7)] transition-transform hover:scale-[1.015] hover:from-[#f2f2f7] hover:to-[#c7c7d6] disabled:opacity-60"
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
      className={`flex-1 rounded-xl border px-4 py-3 font-sans text-xs font-medium uppercase tracking-[0.15em] transition-colors ${
        active
          ? "border-[#6a58a0] bg-[#6a58a0] text-[#ffffff]"
          : "border-[#dcdae6] text-[#9f95bd] hover:text-[#6a58a0]"
      }`}
    >
      {label}
    </button>
  );
}
