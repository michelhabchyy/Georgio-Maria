// ─────────────────────────────────────────────────────────────────────────
//  EDIT ME  —  everything about the party lives here.
//  Swap the [placeholders] for your real details, save, done.
// ─────────────────────────────────────────────────────────────────────────

export const party = {
  // Big script line shown at the top of the invitation.
  eyebrow: "",

  // The big title of the invitation.
  title: "He's going to propose!",
  note: "",
  // Who / what it's for. Leave "" to hide.
  subtitle: "Georgio & Maria",

  // The essentials. Any field left as "" is simply not shown.
  date: "Thursday August 13, 2026",
  time: "8:00 PM",
  location: "Villa Olea - Mehrine",
  address: "",

  // Paste your Google Maps link here (e.g. https://maps.app.goo.gl/xxxx or a
  // full https://www.google.com/maps/... URL). Leave "" to hide the map link.
  mapUrl: "https://maps.app.goo.gl/4mZ7iyjarBCAyC9o6?g_st=ic",

  // Optional extras — set to "" to hide.
  dressCode: "Smart casual",
  

  // The big reminder that it's a secret.
  secretNote: "Our little secret, until the right moment!",

  // The couple's names, in white script on the front of the envelope.
  coupleOne: "Georgio",
  coupleTwo: "Maria",

  // Small script line shown over the intro (the teaser hint).
  envelopeText: "Can you keep a secret?",
  // Small line under it — set to "" to hide.
  envelopeSubtext: "",

  // A visual "flow of the evening" timeline (no times — just the moments).
  // Each step needs an `icon` (glass | dish | music | heart) and a `label`.
  timeline: {
    label: "The Evening",
    steps: [
      { icon: "glass", label: "Food & Drinks" },
      { icon: "music", label: "Dancing" },
      { icon: "heart", label: "The Celebration" },
    ],
    // Closing note under the timeline.
    closing: "No gifts, please — only your presence is required.",
  },

  // Signature at the bottom of the invitation. Leave "" to hide.
  signature: "With love, Georgio & Maria",

  // RSVP form options.
  rsvp: {
    prompt: "Will you join us?",
    intro: "Kindly confirm your name and presence before 6 of August.",
    // Show a "+1" checkbox so guests can bring one extra person.
    askPlusOne: true,
    plusOneLabel: "I'm bringing a partner along.",
    // Let guests leave a short note.
    askMessage: true,
    messageLabel: "A message for the couple",
    // Shown after they RSVP yes.
    thanksYes: "Your place is saved, we can't wait to celebrate with you.",
    // Shown after they RSVP no.
    thanksNo: "You'll be dearly missed. Thank you for letting us know.",
  },
} as const;
