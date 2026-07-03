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

  // Initials on the wax seal of the envelope.
  sealInitials: "G & M",

  // Signature at the bottom of the invitation. Leave "" to hide.
  signature: "With love, Georgio & Maria",

  // RSVP form options.
  rsvp: {
    prompt: "Will you join us?",
    intro: "Add your name and a message to confirm you'll be there.",
    // Let guests say how many people are coming with them.
    askGuestCount: false,
    // Let guests leave a short note.
    askMessage: true,
    messageLabel: "A message for the couple",
    // Shown after they RSVP yes.
    thanksYes: "Your seat is saved. See you there! 🎉",
    // Shown after they RSVP no.
    thanksNo: "We'll miss you — thank you for letting us know. 💛",
  },
} as const;
