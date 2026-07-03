"use client";

import { useActionState, useEffect, useRef, useState } from "react";
import { rsvp, type RsvpResult } from "./actions";
import { party } from "@/lib/config";

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
            <span className="env-flap" />
            <span className="env-seal">{party.sealInitials}</span>
          </button>
        </div>
        <p
          className={`text-sm uppercase tracking-[0.35em] text-[#8a7b60] ${
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
          <p className="mt-14 text-center font-serif text-lg italic text-[#7c6c52]">
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
    <section className="rounded-[20px] border border-[#d8c6a0] bg-[#f8f2e4] px-7 py-12 text-center shadow-[0_30px_60px_-30px_rgba(90,68,34,0.5)] sm:px-12">
      <p className="text-xs uppercase tracking-[0.35em] text-[#a5865a]">
        {party.eyebrow}
      </p>

      <h1 className="mt-6 font-serif text-4xl leading-tight text-[#4a4034] sm:text-5xl">
        {party.title}
      </h1>
      {party.subtitle && (
        <p className="mt-3 font-serif text-xl italic text-[#7c6c52]">
          {party.subtitle}
        </p>
      )}

      <Ornament />

      <dl className="flex flex-col gap-5">
        <Detail label="When" value={[party.date, party.time]} />
        <Detail label="Where" value={[party.location, party.address]} />
        <Detail label="Dress" value={[party.dressCode]} />
      </dl>

      {party.note && (
        <p className="mx-auto mt-8 max-w-sm text-sm leading-relaxed text-[#8a7b60]">
          {party.note}
        </p>
      )}

      {party.secretNote && (
        <p className="mx-auto mt-6 max-w-sm rounded-2xl border border-[#d3bd93] bg-[#efe4cc] px-5 py-3 text-sm leading-relaxed text-[#6f5f43]">
          🤫 {party.secretNote}
        </p>
      )}
    </section>
  );
}

// One "When / Where / Dress" row; hidden entirely if it has no values.
function Detail({ label, value }: { label: string; value: string[] }) {
  const parts = value.filter(Boolean);
  if (parts.length === 0) return null;
  return (
    <div>
      <dt className="text-xs uppercase tracking-[0.3em] text-[#a5865a]">
        {label}
      </dt>
      <dd className="mt-1 font-serif text-lg text-[#4a4034]">
        {parts.map((p, i) => (
          <span key={i} className="block">
            {p}
          </span>
        ))}
      </dd>
    </div>
  );
}

function Ornament() {
  return (
    <div className="my-8 flex items-center justify-center gap-3 text-[#c2a877]">
      <span className="h-px w-14 bg-[#d8c6a0]" />
      <span className="text-lg">❦</span>
      <span className="h-px w-14 bg-[#d8c6a0]" />
    </div>
  );
}

function ScrollHint() {
  return (
    <div className="animate-softpulse mt-8 flex flex-col items-center gap-1 text-[#a5865a]">
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
      className="mt-12 rounded-[20px] border border-[#d8c6a0] bg-[#f8f2e4] px-7 py-10 shadow-[0_30px_60px_-30px_rgba(90,68,34,0.5)] sm:px-12"
    >
      {state?.ok ? (
        <div className="flex flex-col items-center gap-4 text-center">
          <div className="text-5xl">{state.attending ? "🎉" : "💛"}</div>
          <p className="max-w-sm font-serif text-xl text-[#4a4034]">
            {state.attending ? party.rsvp.thanksYes : party.rsvp.thanksNo}
          </p>
          {!state.saved && (
            <p className="text-xs text-[#a5967a]">
              (Shown here only — connect the database to keep RSVPs.)
            </p>
          )}
        </div>
      ) : (
        <form action={formAction} className="flex flex-col gap-5">
          <div className="text-center">
            <h2 className="font-serif text-2xl text-[#4a4034]">
              {party.rsvp.prompt}
            </h2>
            <p className="mt-2 text-sm text-[#8a7b60]">{party.rsvp.intro}</p>
          </div>

          <input
            name="name"
            required
            placeholder="Your name"
            className="w-full rounded-xl border border-[#d8c6a0] bg-[#fffdf7] px-4 py-3 text-[#4a4034] placeholder:text-[#b3a488] focus:border-[#a5865a] focus:outline-none"
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

          {party.rsvp.askMessage && (
            <textarea
              name="message"
              rows={4}
              placeholder={party.rsvp.messageLabel}
              className="w-full rounded-xl border border-[#d8c6a0] bg-[#fffdf7] px-4 py-3 text-[#4a4034] placeholder:text-[#b3a488] focus:border-[#a5865a] focus:outline-none"
            />
          )}

          {state?.error && (
            <p className="text-sm text-[#b0553f]">{state.error}</p>
          )}

          <button
            type="submit"
            disabled={pending}
            className="rounded-full bg-[#a5865a] px-8 py-3 font-medium text-[#fdf8ee] shadow-lg shadow-[#a5865a]/30 transition-transform hover:scale-[1.02] hover:bg-[#94764c] disabled:opacity-60"
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
          ? "border-[#a5865a] bg-[#efe4cc] text-[#4a4034]"
          : "border-[#d8c6a0] text-[#8a7b60] hover:text-[#4a4034]"
      }`}
    >
      {label}
    </button>
  );
}
