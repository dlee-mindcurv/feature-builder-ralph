interface LogoProps {
  size?: "sm" | "md" | "lg";
  showText?: boolean;
}

const sizes = {
  sm: { box: 24, icon: 14, text: "text-lg" },
  md: { box: 32, icon: 18, text: "text-xl" },
  lg: { box: 48, icon: 28, text: "text-3xl" },
} as const;

export function Logo({ size = "md", showText = true }: LogoProps) {
  const { box, icon, text } = sizes[size];

  return (
    <div className="inline-flex items-center gap-2">
      <svg
        width={box}
        height={box}
        viewBox="0 0 32 32"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
      >
        <rect width="32" height="32" rx="8" fill="#3B82F6" />
        <path
          d="M9 16.5L14 21.5L23 11.5"
          stroke="white"
          strokeWidth="3"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
      {showText && (
        <span
          className={`${text} font-bold text-gray-900 dark:text-white`}
        >
          TaskFlow
        </span>
      )}
    </div>
  );
}
