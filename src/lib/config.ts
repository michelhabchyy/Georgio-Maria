// ─────────────────────────────────────────────────────────────────────────
//  EDIT ME  —  everything about the party lives here.
//  Swap the [placeholders] for your real details, save, done.
// ─────────────────────────────────────────────────────────────────────────

export const party = {
  // Small line above the title.
  eyebrow: "You're invited — shhh 🤫",

  // The big title of the invitation.
  title: "A Surprise Party",

  // Who / what it's for. Leave "" to hide.
  subtitle: "to celebrate Maria",

  // The essentials. Any field left as "" is simply not shown.
  date: "[Saturday, August 30th]",
  time: "[7:00 PM]",
  location: "[Venue name]",
  address: "[Street address, city]",

  // Optional extras — set to "" to hide.
  dressCode: "[Smart casual]",
  note: "Please arrive 15 minutes early so we're all in place before she walks in.",

  // The big reminder that it's a secret.
  secretNote: "It's a surprise — please don't say a word to Maria!",

  // Who's hosting (shown at the bottom). Leave "" to hide.
  host: "Georgio",

  // RSVP form options.
  rsvp: {
    prompt: "Can you make it?",
    // Let guests say how many people are coming with them.
    askGuestCount: true,
    // Let guests leave a short note.
    askMessage: true,
    messageLabel: "Anything to add? (optional)",
    // Shown after they RSVP yes.
    thanksYes: "You're on the list. See you there! 🎉",
    // Shown after they RSVP no.
    thanksNo: "We'll miss you — thanks for letting us know. 💛",
  },
} as const;
