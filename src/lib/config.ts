// ─────────────────────────────────────────────────────────────────────────
//  EDIT ME  —  everything about the party lives here.
//  Swap the [placeholders] for your real details, save, done.
// ─────────────────────────────────────────────────────────────────────────

export const party = {
  // Small line above the title.
  eyebrow: "You're invited! SHHHH 🤫",

  // The big title of the invitation.
  title: "He's Proposing!",

  // Who / what it's for. Leave "" to hide.
  subtitle: "to celebrate Maria",

  // The essentials. Any field left as "" is simply not shown.
  date: "Thursday August 13, 2026",
  time: "8:00 PM",
  location: "Villa Olea",
  address: "Mehrin",

  // Paste your Google Maps link here (e.g. https://maps.app.goo.gl/xxxx or a
  // full https://www.google.com/maps/... URL). Leave "" to hide the map link.
  mapUrl: "https://maps.app.goo.gl/4mZ7iyjarBCAyC9o6?g_st=ic",

  // Optional extras — set to "" to hide.
  dressCode: "Smart casual",
  note: "Please arrive 15 minutes early so we're all in place before she walks in.",

  // The big reminder that it's a secret.
  secretNote: "It's a surprise, kindly no word to Maria!",

  // Lettering on the front of the closed envelope (elegant script).
  envelopeText: "You're Invited",
  // Small line under it — set to "" to hide.
  envelopeSubtext: "the celebration of a lifetime",

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
    thanksNo: "We'll miss you, thank you for letting us know. 💛",
  },
} as const;
