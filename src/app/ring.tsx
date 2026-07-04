// An aesthetic solitaire engagement ring, drawn as inline SVG so it stays crisp
// at any size and needs no external asset. Gold band + faceted diamond, with a
// few sparkles that twinkle (see .sparkle / .animate-floaty in globals.css).

const STAR =
  "M0,-7 L1.4,-1.4 L7,0 L1.4,1.4 L0,7 L-1.4,1.4 L-7,0 L-1.4,-1.4 Z";

export default function RingGraphic({
  className = "",
}: {
  className?: string;
}) {
  return (
    <svg
      viewBox="0 0 200 200"
      className={className}
      role="img"
      aria-label="An engagement ring"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <linearGradient id="ringBand" x1="15%" y1="0%" x2="85%" y2="100%">
          <stop offset="0" stopColor="#f4dcab" />
          <stop offset="0.45" stopColor="#cba86c" />
          <stop offset="0.8" stopColor="#9c7a49" />
          <stop offset="1" stopColor="#7f603a" />
        </linearGradient>
        <linearGradient id="gemLight" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#fffdf7" />
          <stop offset="1" stopColor="#ece0c6" />
        </linearGradient>
        <linearGradient id="gemMid" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#f5ecd6" />
          <stop offset="1" stopColor="#d6c197" />
        </linearGradient>
        <linearGradient id="gemDeep" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#e9dabb" />
          <stop offset="1" stopColor="#c3ad82" />
        </linearGradient>
        <radialGradient id="gemGlow" cx="50%" cy="42%" r="60%">
          <stop offset="0" stopColor="#fffef9" stopOpacity="0.85" />
          <stop offset="1" stopColor="#fffef9" stopOpacity="0" />
        </radialGradient>
        <radialGradient id="floorShadow" cx="50%" cy="50%" r="50%">
          <stop offset="0" stopColor="#6f5330" stopOpacity="0.28" />
          <stop offset="1" stopColor="#6f5330" stopOpacity="0" />
        </radialGradient>
      </defs>

      {/* soft cast shadow to ground the ring */}
      <ellipse cx="100" cy="180" rx="52" ry="9" fill="url(#floorShadow)" />

      <g className="animate-floaty">
        {/* band */}
        <ellipse
          cx="100"
          cy="146"
          rx="45"
          ry="45"
          stroke="url(#ringBand)"
          strokeWidth="9"
        />
        {/* band top highlight */}
        <path
          d="M62 132 A45 45 0 0 1 100 101"
          stroke="#fbeecb"
          strokeOpacity="0.7"
          strokeWidth="2.5"
          strokeLinecap="round"
        />

        {/* setting / basket under the gem */}
        <path d="M86 96 L100 108 L114 96 Z" fill="url(#ringBand)" />

        {/* diamond */}
        <g>
          {/* facets */}
          <path d="M78 40 L122 40 L138 58 L62 58 Z" fill="url(#gemMid)" />
          <path d="M62 58 L138 58 L100 106 Z" fill="url(#gemDeep)" />
          <path d="M62 58 L100 58 L100 106 Z" fill="url(#gemMid)" />
          <path d="M86 40 L114 40 L124 56 L76 56 Z" fill="url(#gemLight)" />
          <path d="M100 40 L114 40 L124 56 L100 56 Z" fill="url(#gemMid)" />
          {/* facet edges */}
          <g
            stroke="#b9975f"
            strokeOpacity="0.5"
            strokeWidth="0.8"
            strokeLinejoin="round"
          >
            <path d="M78 40 L122 40 L138 58 L100 106 L62 58 Z" />
            <path d="M76 56 L124 56" />
            <path d="M100 56 L100 106" />
            <path d="M86 40 L76 56 M114 40 L124 56" />
            <path d="M62 58 L100 106 L138 58" />
          </g>
          {/* inner glow */}
          <ellipse cx="100" cy="52" rx="24" ry="12" fill="url(#gemGlow)" />
        </g>
      </g>

      {/* sparkles */}
      <g fill="#fffdf5">
        <path
          className="sparkle"
          style={{ animationDelay: "0s" }}
          d={STAR}
          transform="translate(132 44) scale(1.1)"
        />
        <path
          className="sparkle"
          style={{ animationDelay: "0.8s" }}
          d={STAR}
          transform="translate(70 34) scale(0.7)"
        />
        <path
          className="sparkle"
          style={{ animationDelay: "1.5s" }}
          d={STAR}
          transform="translate(150 78) scale(0.5)"
        />
      </g>
    </svg>
  );
}
