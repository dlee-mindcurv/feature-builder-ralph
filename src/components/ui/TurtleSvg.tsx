export function TurtleSvg() {
  return (
    <svg
      width="100"
      height="100"
      viewBox="0 0 100 100"
      role="img"
      aria-label="TaskFlow turtle mascot"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Body */}
      <ellipse cx="50" cy="58" rx="22" ry="16" fill="#4ade80" />

      {/* Shell */}
      <ellipse cx="50" cy="50" rx="22" ry="18" fill="#16a34a" />

      {/* Shell pattern */}
      <ellipse cx="50" cy="50" rx="13" ry="11" fill="#15803d" />
      <line x1="50" y1="39" x2="50" y2="61" stroke="#166534" strokeWidth="1.5" />
      <line x1="38" y1="46" x2="62" y2="46" stroke="#166534" strokeWidth="1.5" />
      <line x1="40" y1="54" x2="60" y2="54" stroke="#166534" strokeWidth="1.5" />

      {/* Head */}
      <ellipse cx="50" cy="33" rx="9" ry="8" fill="#4ade80" />

      {/* Eyes */}
      <circle cx="46" cy="30" r="2.5" fill="white" />
      <circle cx="54" cy="30" r="2.5" fill="white" />
      <circle cx="46.5" cy="30.5" r="1.2" fill="#1e293b" />
      <circle cx="54.5" cy="30.5" r="1.2" fill="#1e293b" />

      {/* Eye shine */}
      <circle cx="47" cy="29.8" r="0.5" fill="white" />
      <circle cx="55" cy="29.8" r="0.5" fill="white" />

      {/* Smile */}
      <path d="M 45 35 Q 50 39 55 35" stroke="#166534" strokeWidth="1.5" fill="none" strokeLinecap="round" />

      {/* Front legs */}
      <ellipse cx="30" cy="55" rx="7" ry="5" fill="#4ade80" transform="rotate(-20 30 55)" />
      <ellipse cx="70" cy="55" rx="7" ry="5" fill="#4ade80" transform="rotate(20 70 55)" />

      {/* Back legs */}
      <ellipse cx="34" cy="68" rx="7" ry="5" fill="#4ade80" transform="rotate(20 34 68)" />
      <ellipse cx="66" cy="68" rx="7" ry="5" fill="#4ade80" transform="rotate(-20 66 68)" />

      {/* Tail */}
      <ellipse cx="50" cy="74" rx="4" ry="6" fill="#4ade80" />
    </svg>
  );
}
