"use client";

import { useActionState, useEffect, useRef, useState } from "react";
import { rsvp, type RsvpResult } from "./actions";
import { party } from "@/lib/config";
import RingGraphic from "./ring";

type Stage = "sealed" | "opening" | "pulling" | "revealed" | "done";

// The envelope opens (a pre-rendered video if one is configured, otherwise the
// built-in CSS envelope), then the full invitation is revealed underneath.
export default function Invite() {
  const [revealed, setRevealed] = useState(false);
  const reveal = () => setRevealed(true);

  return (
    <>
      {party.intro.video ? (
        <VideoIntro onReveal={reveal} />
      ) : (
        <CssIntro onReveal={reveal} />
      )}
      {revealed && <Invitation />}
    </>
  );
}

// The full invitation shown after the envelope opens.
function Invitation() {
  return (
    <div className="flex min-h-dvh flex-col items-center px-5 py-16 sm:py-24">
      <div className="animate-rise w-full max-w-lg">
        <Letter />
        <ScrollHint />
        <RsvpSection />
        {party.signature && (
          <p className="mt-16 text-center font-script text-2xl text-[#6b5385]">
            {party.signature}
          </p>
        )}
      </div>
    </div>
  );
}

// ── Video intro ───────────────────────────────────────────────────────────
// Full-screen overlay → tap to open → play the envelope video → fade away to
// reveal the invitation. Same technique as the reference site.
function VideoIntro({ onReveal }: { onReveal: () => void }) {
  const [started, setStarted] = useState(false);
  const [fading, setFading] = useState(false);
  const [gone, setGone] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const finishedRef = useRef(false);

  // Skip the intro entirely if it already played this session.
  useEffect(() => {
    if (party.intro.oncePerSession && sessionStorage.getItem("introSeen")) {
      onReveal();
      setGone(true);
    }
  }, [onReveal]);

  function start() {
    if (started) return;
    setStarted(true);
    const v = videoRef.current;
    if (!v) return finish();
    v.play().catch(() => finish());
  }

  function finish() {
    if (finishedRef.current) return;
    finishedRef.current = true;
    if (party.intro.oncePerSession) {
      try {
        sessionStorage.setItem("introSeen", "1");
      } catch {}
    }
    onReveal(); // mount the invitation underneath
    setFading(true); // fade the overlay away
    setTimeout(() => setGone(true), 700);
  }

  if (gone) return null;

  return (
    <div
      className={`intro-overlay ${fading ? "is-fading" : ""}`}
      onClick={start}
      role="button"
      tabIndex={0}
      aria-label="Open the invitation"
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") start();
      }}
    >
      <video
        ref={videoRef}
        className="intro-video"
        src={party.intro.video}
        poster={party.intro.poster || undefined}
        preload="auto"
        playsInline
        onEnded={finish}
        onError={finish}
        onTimeUpdate={(e) => {
          const v = e.currentTarget;
          if (v.duration && v.duration - v.currentTime <= 0.4) finish();
        }}
      />
      {!started && (
        <div className="intro-tap">
          <p className="font-script text-4xl leading-none text-[#5a4278]">
            {party.envelopeText}
          </p>
          <p className="font-sans text-[11px] uppercase tracking-[0.45em] text-[#8a6fb8] animate-softpulse">
            tap to open
          </p>
        </div>
      )}
    </div>
  );
}

// ── CSS envelope fallback ─────────────────────────────────────────────────
// The built-in four-flap envelope; used when no intro video is configured.
function CssIntro({ onReveal }: { onReveal: () => void }) {
  const [stage, setStage] = useState<Stage>("sealed");

  function open() {
    if (stage !== "sealed") return;
    setStage("opening"); // flap lifts
    setTimeout(() => setStage("pulling"), 800); // letter slides out
    setTimeout(() => {
      setStage("revealed"); // crossfade to invitation
      onReveal();
    }, 2200);
    setTimeout(() => setStage("done"), 3000); // remove the overlay
  }

  if (stage === "done") return null;

  const isOpen = stage === "opening" || stage === "pulling" || stage === "revealed";
  const isPulled = stage === "pulling" || stage === "revealed";

  return (
    <div className={`reveal-scene ${stage === "revealed" ? "is-fading" : ""}`}>
      <button
        type="button"
        onClick={open}
        aria-label="Open the invitation"
        className="cursor-pointer border-0 bg-transparent p-0"
      >
        <div
          className={`env-stage ${isOpen ? "is-open" : ""} ${
            isPulled ? "is-pulled" : ""
          }`}
        >
          <div className="env-back" />
          <div className="pull-card">
            <Cover />
          </div>
          <div className="flap flap-left" />
          <div className="flap flap-right" />
          <div className="flap flap-bottom" />
          <div className="env-names">
            <span className="n">{party.coupleOne}</span>
            <span className="andw">and</span>
            <span className="n">{party.coupleTwo}</span>
          </div>
          <div className="flap flap-top" />
        </div>
      </button>

      <div
        className={`flex flex-col items-center gap-3 transition-opacity duration-500 ${
          stage === "sealed" ? "opacity-100" : "opacity-0"
        }`}
      >
        <p className="font-script text-3xl leading-none text-[#8a6fb8]">
          {party.envelopeText}
        </p>
        <p className="font-sans text-[11px] uppercase tracking-[0.45em] text-[#9a86c4] animate-softpulse">
          tap to open
        </p>
      </div>
    </div>
  );
}

// The teaser printed on the letter as it's drawn out — mirrors the top of the
// invitation so the crossfade feels continuous.
function Cover() {
  return (
    <div className="flex flex-col items-center px-4 text-center">
      <RingGraphic className="h-11 w-11" />
      <p className="mt-1 font-display text-sm font-semibold leading-tight text-[#3a2b53]">
        {party.title}
      </p>
      {party.subtitle && (
        <p className="font-script text-base leading-tight text-[#6b5385]">
          {party.subtitle}
        </p>
      )}
    </div>
  );
}

// The invitation itself.
function Letter() {
  return (
    <section className="lux-card overflow-hidden rounded-[26px] px-7 py-14 text-center sm:px-14">
      <RingGraphic className="mx-auto -mt-2 mb-3 h-28 w-28 sm:h-32 sm:w-32" />

      <p className="font-sans text-[11px] uppercase tracking-[0.5em] text-[#a07a3f]">
        {party.eyebrow}
      </p>

      <h1 className="mt-6 font-display text-[2.6rem] font-semibold leading-[1.08] text-[#3a2b53] sm:text-6xl">
        {party.title}
      </h1>
      {party.subtitle && (
        <p className="mt-3 font-script text-3xl text-[#6b5385]">
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
        <p className="mx-auto mt-10 max-w-sm font-display text-base leading-relaxed text-[#8c7ea0]">
          {party.note}
        </p>
      )}

      {party.secretNote && (
        <p className="mx-auto mt-10 max-w-xs border-t border-[#e3d7bf] pt-6 font-display text-base italic leading-relaxed text-[#6b5385]">
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
      <dt className="font-sans text-[10px] uppercase tracking-[0.4em] text-[#a07a3f]">
        {label}
      </dt>
      <dd className="mt-1.5 font-display text-2xl text-[#3a2b53]">
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
          className="mt-3 inline-block border-b border-[#d8c9a8] pb-0.5 font-sans text-[11px] uppercase tracking-[0.25em] text-[#a07a3f] transition-colors hover:border-[#b0894f] hover:text-[#3a2b53]"
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
      <span className="text-[0.6rem] text-[#b0894f]">◆</span>
      <span className="gold-rule w-20" />
    </div>
  );
}

function ScrollHint() {
  return (
    <div className="mt-10 flex flex-col items-center gap-2.5">
      <span className="font-sans text-[10px] uppercase tracking-[0.45em] text-[#a07a3f]">
        Scroll
      </span>
      <span className="animate-softpulse h-9 w-px bg-gradient-to-b from-[#b0894f] to-transparent" />
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
          {state.attending && <RingGraphic className="h-20 w-20" />}
          <p className="font-script text-3xl text-[#6b5385]">Thank you</p>
          <p className="max-w-sm font-display text-xl leading-relaxed text-[#3a2b53]">
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
            <h2 className="font-display text-3xl font-medium text-[#3a2b53]">
              {party.rsvp.prompt}
            </h2>
            <p className="mt-2 font-display text-base text-[#8c7ea0]">
              {party.rsvp.intro}
            </p>
          </div>

          <input
            name="name"
            required
            placeholder="Your name"
            className="w-full rounded-xl border border-[#e3d7bf] bg-[#fdfaf3] px-4 py-3.5 font-display text-lg text-[#3a2b53] placeholder:text-[#b8aac4] focus:border-[#b0894f] focus:outline-none"
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
            <label className="flex cursor-pointer items-center gap-3 rounded-xl border border-[#e3d7bf] bg-[#fdfaf3] px-4 py-3.5 font-display text-base text-[#3a2b53] transition-colors hover:border-[#b0894f]">
              <input
                type="checkbox"
                name="guests"
                value="1"
                className="h-5 w-5 accent-[#b0894f]"
              />
              {party.rsvp.plusOneLabel}
            </label>
          )}

          {party.rsvp.askMessage && (
            <textarea
              name="message"
              rows={4}
              placeholder={party.rsvp.messageLabel}
              className="w-full rounded-xl border border-[#e3d7bf] bg-[#fdfaf3] px-4 py-3.5 font-display text-lg text-[#3a2b53] placeholder:text-[#b8aac4] focus:border-[#b0894f] focus:outline-none"
            />
          )}

          {state?.error && (
            <p className="font-sans text-sm text-[#b0553f]">{state.error}</p>
          )}

          <button
            type="submit"
            disabled={pending}
            className="mt-2 rounded-full bg-gradient-to-b from-[#d8bd84] to-[#b3894c] px-8 py-4 font-sans text-sm font-semibold uppercase tracking-[0.2em] text-[#3a2b53] shadow-[0_14px_28px_-10px_rgba(120,90,40,0.6),inset_0_1px_0_rgba(255,255,255,0.5)] transition-transform hover:scale-[1.015] hover:from-[#e2c890] hover:to-[#bd935a] disabled:opacity-60"
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
          ? "border-[#3a2b53] bg-[#3a2b53] text-[#f7f0e4]"
          : "border-[#e3d7bf] text-[#8c7ea0] hover:text-[#3a2b53]"
      }`}
    >
      {label}
    </button>
  );
}
