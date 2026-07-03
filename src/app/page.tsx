import Invite from "./invite";

export default function Home() {
  return (
    <main className="relative flex flex-1 items-center justify-center overflow-hidden bg-neutral-950 p-8">
      {/* Soft rose glow behind everything. */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(60%_50%_at_50%_30%,rgba(244,63,94,0.22),transparent_70%)]"
      />
      <div className="relative z-10 w-full max-w-2xl py-12">
        <Invite />
      </div>
    </main>
  );
}
