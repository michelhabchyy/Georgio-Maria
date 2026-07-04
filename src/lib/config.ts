// ─────────────────────────────────────────────────────────────────────────
//  EDIT ME  —  everything about the party lives here.
//  Swap the [placeholders] for your real details, save, done.
// ─────────────────────────────────────────────────────────────────────────

export const party = {
  // Small line above the title.
  eyebrow: "You're Invited! SHHHH 🤫",

  // The big title of the invitation.
  title: "He's about to ask her forever!",

  // Who / what it's for. Leave "" to hide.
  subtitle: "Georgio & Maria",

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
  note: "",

  // The big reminder that it's a secret.
  secretNote: "Our little secret, until the right moment!",

  // Lettering on the front of the closed envelope (elegant script).
  envelopeText: "Can you keep a secret?",
  // Small line under it — set to "" to hide.
  envelopeSubtext: "",

  // Signature at the bottom of the invitation. Leave "" to hide.
  signature: "With love, Georgio & Maria",

  // RSVP form options.
  rsvp: {
    prompt: "Will you join us?",
    intro: "Add your name and a message to confirm you'll be there.",
    // Show a "+1" checkbox so guests can bring one extra person.
    askPlusOne: true,
    plusOneLabel: "I'm bringing a +1",
    // Let guests leave a short note.
    askMessage: true,
    messageLabel: "A message for the couple",
    // Shown after they RSVP yes.
    thanksYes: "Your place is saved — we can't wait to celebrate with you.",
    // Shown after they RSVP no.
    thanksNo: "You'll be dearly missed. Thank you for letting us know.",
  },
} as const;
