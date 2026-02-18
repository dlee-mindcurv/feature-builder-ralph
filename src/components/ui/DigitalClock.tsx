"use client";

import { useEffect, useId, useRef, useState } from "react";

interface ClockState {
  time: string;
  showColons: boolean;
}

const MOTIVATIONAL_QUOTES = [
  "The best time to start is now.",
  "Stay focused, stay sharp.",
  "One task at a time.",
  "You are making progress.",
  "Tick tock, time to rock.",
  "Small steps lead to big wins.",
  "Every second counts.",
];

const KONAMI_CODE = [
  "ArrowUp",
  "ArrowUp",
  "ArrowDown",
  "ArrowDown",
  "ArrowLeft",
  "ArrowRight",
  "ArrowLeft",
  "ArrowRight",
  "b",
  "a",
];

const NEON_COLORS = [
  "#ff0000", // red
  "#00ff00", // green
  "#ffaa00", // amber
  "#00ffff", // cyan
  "#ff00ff", // magenta
];

function getClockState(date: Date): ClockState {
  const hh = String(date.getHours()).padStart(2, "0");
  const mm = String(date.getMinutes()).padStart(2, "0");
  const ss = String(date.getSeconds()).padStart(2, "0");
  const showColons = date.getSeconds() % 2 === 0;
  return {
    time: `${hh}${mm}${ss}`,
    showColons,
  };
}

function getRandomQuote(): string {
  const index = Math.floor(Math.random() * MOTIVATIONAL_QUOTES.length);
  return MOTIVATIONAL_QUOTES[index];
}

export function DigitalClock() {
  const [clockState, setClockState] = useState<ClockState>(() =>
    getClockState(new Date())
  );
  const [isHovered, setIsHovered] = useState(false);
  const [isColorCycling, setIsColorCycling] = useState(false);
  const [colorIndex, setColorIndex] = useState(0);
  const [isFlashing, setIsFlashing] = useState(false);
  const currentQuoteRef = useRef<string>(getRandomQuote());
  const konamiProgressRef = useRef<number>(0);
  const tooltipId = useId();

  // Clock update interval
  useEffect(() => {
    const interval = setInterval(() => {
      setClockState(getClockState(new Date()));
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  // Color cycling interval
  useEffect(() => {
    if (!isColorCycling) return;
    const interval = setInterval(() => {
      setColorIndex((prev) => (prev + 1) % NEON_COLORS.length);
    }, 500);
    return () => clearInterval(interval);
  }, [isColorCycling]);

  // Konami Code keyboard listener
  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      const expected = KONAMI_CODE[konamiProgressRef.current];
      if (event.key === expected) {
        konamiProgressRef.current += 1;
        if (konamiProgressRef.current === KONAMI_CODE.length) {
          konamiProgressRef.current = 0;
          setIsColorCycling((prev) => {
            const next = !prev;
            if (!next) {
              // Deactivating: reset color index to 0 (red)
              setColorIndex(0);
            }
            return next;
          });
          // Trigger flash animation
          setIsFlashing(true);
          setTimeout(() => setIsFlashing(false), 300);
        }
      } else {
        // Reset progress, but check if current key starts a new sequence
        konamiProgressRef.current = 0;
        if (event.key === KONAMI_CODE[0]) {
          konamiProgressRef.current = 1;
        }
      }
    }

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const { time, showColons } = clockState;
  const hh = time.slice(0, 2);
  const mm = time.slice(2, 4);
  const ss = time.slice(4, 6);

  const currentColor = isColorCycling ? NEON_COLORS[colorIndex] : "#ff0000";

  function handleMouseEnter() {
    currentQuoteRef.current = getRandomQuote();
    setIsHovered(true);
  }

  function handleMouseLeave() {
    setIsHovered(false);
  }

  return (
    <div className="relative flex justify-center">
      {isHovered && (
        <div
          id={tooltipId}
          role="tooltip"
          className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 z-10"
        >
          <div
            className="rounded-md px-3 py-2 font-mono text-sm whitespace-nowrap"
            style={{ backgroundColor: "#000000", color: "#ff0000", border: "1px solid #ff0000" }}
          >
            {currentQuoteRef.current}
          </div>
          {/* Arrow/caret pointing down toward the clock */}
          <div
            className="absolute left-1/2 -translate-x-1/2 top-full"
            style={{
              width: 0,
              height: 0,
              borderLeft: "6px solid transparent",
              borderRight: "6px solid transparent",
              borderTop: "6px solid #ff0000",
            }}
          />
        </div>
      )}
      {/* Flash overlay */}
      {isFlashing && (
        <div
          data-testid="konami-flash"
          className="absolute inset-0 rounded-lg pointer-events-none z-20"
          style={{
            backgroundColor: "white",
            animation: "konamiFlash 300ms ease-out forwards",
          }}
        />
      )}
      <style>{`
        @keyframes konamiFlash {
          0% { opacity: 1; }
          100% { opacity: 0; }
        }
      `}</style>
      <a
        href="https://www.nba.com"
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Visit NBA.com"
        aria-describedby={isHovered ? tooltipId : undefined}
        data-testid="digital-clock"
        className="relative cursor-pointer rounded-lg px-6 py-3 bg-black font-mono text-2xl tracking-widest hover:brightness-125 hover:shadow-[0_0_12px_rgba(255,0,0,0.6)] transition-all duration-200"
        style={{ color: currentColor, backgroundColor: "#000000" }}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        {hh}
        <span
          data-testid="clock-colon"
          style={{ visibility: showColons ? "visible" : "hidden", display: "inline-block", width: "0.5ch" }}
        >
          :
        </span>
        {mm}
        <span
          data-testid="clock-colon"
          style={{ visibility: showColons ? "visible" : "hidden", display: "inline-block", width: "0.5ch" }}
        >
          :
        </span>
        {ss}
      </a>
    </div>
  );
}
