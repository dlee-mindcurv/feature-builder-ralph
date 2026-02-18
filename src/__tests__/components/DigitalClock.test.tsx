import { render, screen, act, fireEvent } from "@testing-library/react";
import { describe, expect, it, vi, beforeEach, afterEach } from "vitest";
import { DigitalClock } from "@/components/ui/DigitalClock";

describe("DigitalClock", () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("renders a link element", () => {
    render(<DigitalClock />);
    const link = screen.getByRole("link", { name: /visit nba\.com/i });
    expect(link).toBeInTheDocument();
  });

  it("displays time in HH:MM:SS format", () => {
    // Fix the date so we can predict the output
    const fixedDate = new Date(2026, 0, 1, 14, 35, 7); // 14:35:07
    vi.setSystemTime(fixedDate);

    render(<DigitalClock />);
    // Time is split across multiple spans, so check the link's full text content
    const link = screen.getByRole("link", { name: /visit nba\.com/i });
    expect(link.textContent).toBe("14:35:07");
  });

  it("zero-pads hours, minutes, and seconds", () => {
    const fixedDate = new Date(2026, 0, 1, 3, 5, 9); // 03:05:09
    vi.setSystemTime(fixedDate);

    render(<DigitalClock />);
    const link = screen.getByRole("link", { name: /visit nba\.com/i });
    expect(link.textContent).toBe("03:05:09");
  });

  it("updates the displayed time every second", () => {
    const fixedDate = new Date(2026, 0, 1, 10, 0, 0); // 10:00:00
    vi.setSystemTime(fixedDate);

    render(<DigitalClock />);
    const link = screen.getByRole("link", { name: /visit nba\.com/i });
    expect(link.textContent).toBe("10:00:00");

    act(() => {
      vi.advanceTimersByTime(1000);
    });

    expect(link.textContent).toBe("10:00:01");
  });

  it("updates time after multiple seconds", () => {
    const fixedDate = new Date(2026, 0, 1, 10, 0, 0); // 10:00:00
    vi.setSystemTime(fixedDate);

    render(<DigitalClock />);
    const link = screen.getByRole("link", { name: /visit nba\.com/i });

    act(() => {
      vi.advanceTimersByTime(5000);
    });

    expect(link.textContent).toBe("10:00:05");
  });

  it("cleans up the interval on unmount", () => {
    const clearIntervalSpy = vi.spyOn(global, "clearInterval");

    const { unmount } = render(<DigitalClock />);
    unmount();

    expect(clearIntervalSpy).toHaveBeenCalled();
  });

  it("links to https://www.nba.com", () => {
    render(<DigitalClock />);
    const link = screen.getByRole("link", { name: /visit nba\.com/i });
    expect(link).toHaveAttribute("href", "https://www.nba.com");
  });

  it("opens in a new tab with target='_blank'", () => {
    render(<DigitalClock />);
    const link = screen.getByRole("link", { name: /visit nba\.com/i });
    expect(link).toHaveAttribute("target", "_blank");
  });

  it("has rel='noopener noreferrer' for security", () => {
    render(<DigitalClock />);
    const link = screen.getByRole("link", { name: /visit nba\.com/i });
    expect(link).toHaveAttribute("rel", "noopener noreferrer");
  });

  it("has aria-label describing the destination", () => {
    render(<DigitalClock />);
    const link = screen.getByRole("link", { name: /visit nba\.com/i });
    expect(link).toHaveAttribute("aria-label", "Visit NBA.com");
  });

  it("uses monospace font class (font-mono)", () => {
    render(<DigitalClock />);
    const link = screen.getByRole("link", { name: /visit nba\.com/i });
    expect(link.className).toMatch(/font-mono/);
  });

  it("has black background color", () => {
    render(<DigitalClock />);
    const link = screen.getByRole("link", { name: /visit nba\.com/i });
    // Checks for explicit black background via inline style or bg-black class
    const hasBlackBg =
      link.style.backgroundColor === "#000000" ||
      link.style.backgroundColor === "rgb(0, 0, 0)" ||
      link.className.includes("bg-black");
    expect(hasBlackBg).toBe(true);
  });

  it("has red text color", () => {
    render(<DigitalClock />);
    const link = screen.getByRole("link", { name: /visit nba\.com/i });
    // Checks for red color via inline style or Tailwind class
    const hasRedColor =
      link.style.color === "#ff0000" ||
      link.style.color === "rgb(255, 0, 0)" ||
      link.className.includes("text-red");
    expect(hasRedColor).toBe(true);
  });

  it("has rounded corners (rounded class)", () => {
    render(<DigitalClock />);
    const link = screen.getByRole("link", { name: /visit nba\.com/i });
    expect(link.className).toMatch(/rounded/);
  });

  it("has padding classes", () => {
    render(<DigitalClock />);
    const link = screen.getByRole("link", { name: /visit nba\.com/i });
    expect(link.className).toMatch(/p[xy]?-\d/);
  });

  it("has cursor-pointer class", () => {
    render(<DigitalClock />);
    const link = screen.getByRole("link", { name: /visit nba\.com/i });
    expect(link.className).toMatch(/cursor-pointer/);
  });

  it("has a hover state class", () => {
    render(<DigitalClock />);
    const link = screen.getByRole("link", { name: /visit nba\.com/i });
    expect(link.className).toMatch(/hover:/);
  });

  it("clock container is horizontally centered (justify-center)", () => {
    const { container } = render(<DigitalClock />);
    const wrapper = container.querySelector(".flex.justify-center");
    expect(wrapper).toBeInTheDocument();
  });

  it("displays time in 24-hour format (shows hours 0-23)", () => {
    const eveningDate = new Date(2026, 0, 1, 23, 59, 59); // 23:59:59
    vi.setSystemTime(eveningDate);

    render(<DigitalClock />);
    const link = screen.getByRole("link", { name: /visit nba\.com/i });
    expect(link.textContent).toBe("23:59:59");
  });

  // Blinking colons tests (US-002)
  describe("blinking colons", () => {
    it("renders exactly two colon spans with data-testid='clock-colon'", () => {
      render(<DigitalClock />);
      const colons = screen.getAllByTestId("clock-colon");
      expect(colons).toHaveLength(2);
    });

    it("colons are visible on even seconds", () => {
      const evenSecondDate = new Date(2026, 0, 1, 10, 0, 0); // second = 0 (even)
      vi.setSystemTime(evenSecondDate);

      render(<DigitalClock />);
      const colons = screen.getAllByTestId("clock-colon");
      colons.forEach((colon) => {
        expect(colon).toHaveStyle({ visibility: "visible" });
      });
    });

    it("colons are hidden on odd seconds", () => {
      const oddSecondDate = new Date(2026, 0, 1, 10, 0, 1); // second = 1 (odd)
      vi.setSystemTime(oddSecondDate);

      render(<DigitalClock />);
      const colons = screen.getAllByTestId("clock-colon");
      colons.forEach((colon) => {
        expect(colon).toHaveStyle({ visibility: "hidden" });
      });
    });

    it("colons toggle from visible to hidden after one second tick", () => {
      const evenSecondDate = new Date(2026, 0, 1, 10, 0, 0); // second = 0 (even)
      vi.setSystemTime(evenSecondDate);

      render(<DigitalClock />);
      const colonsBefore = screen.getAllByTestId("clock-colon");
      colonsBefore.forEach((colon) => {
        expect(colon).toHaveStyle({ visibility: "visible" });
      });

      act(() => {
        vi.advanceTimersByTime(1000);
      });

      const colonsAfter = screen.getAllByTestId("clock-colon");
      colonsAfter.forEach((colon) => {
        expect(colon).toHaveStyle({ visibility: "hidden" });
      });
    });

    it("colons toggle from hidden to visible after one second tick", () => {
      const oddSecondDate = new Date(2026, 0, 1, 10, 0, 1); // second = 1 (odd)
      vi.setSystemTime(oddSecondDate);

      render(<DigitalClock />);
      const colonsBefore = screen.getAllByTestId("clock-colon");
      colonsBefore.forEach((colon) => {
        expect(colon).toHaveStyle({ visibility: "hidden" });
      });

      act(() => {
        vi.advanceTimersByTime(1000);
      });

      const colonsAfter = screen.getAllByTestId("clock-colon");
      colonsAfter.forEach((colon) => {
        expect(colon).toHaveStyle({ visibility: "visible" });
      });
    });

    it("colons have equal-width display to prevent digit shifting", () => {
      render(<DigitalClock />);
      const colons = screen.getAllByTestId("clock-colon");
      colons.forEach((colon) => {
        expect(colon).toHaveStyle({ display: "inline-block" });
        // Width should be set so hidden colons don't collapse
        expect(colon.style.width).toBeTruthy();
      });
    });

    it("colon spans contain the colon character", () => {
      render(<DigitalClock />);
      const colons = screen.getAllByTestId("clock-colon");
      colons.forEach((colon) => {
        expect(colon.textContent).toBe(":");
      });
    });

    it("blinking is driven by the same interval as clock update (only one setInterval)", () => {
      const setIntervalSpy = vi.spyOn(global, "setInterval");
      render(<DigitalClock />);
      // Only one interval should be created for both time and colon blinking
      expect(setIntervalSpy).toHaveBeenCalledTimes(1);
      expect(setIntervalSpy).toHaveBeenCalledWith(expect.any(Function), 1000);
    });
  });

  // Konami Code Easter Egg tests (US-004)
  describe("Konami Code Easter egg", () => {
    const KONAMI_SEQUENCE = [
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

    // Neon colors in both hex and rgb representations
    const NEON_COLORS = {
      red: ["#ff0000", "rgb(255, 0, 0)"],
      green: ["#00ff00", "rgb(0, 255, 0)"],
      amber: ["#ffaa00", "rgb(255, 170, 0)"],
      cyan: ["#00ffff", "rgb(0, 255, 255)"],
      magenta: ["#ff00ff", "rgb(255, 0, 255)"],
    };

    function expectColor(
      element: HTMLElement,
      colorVariants: string[]
    ) {
      expect(colorVariants).toContain(element.style.color);
    }

    function fireKonamiSequence() {
      KONAMI_SEQUENCE.forEach((key) => {
        fireEvent.keyDown(window, { key });
      });
    }

    it("clock starts with red digit color by default (no color cycling)", () => {
      render(<DigitalClock />);
      const link = screen.getByTestId("digital-clock");
      expectColor(link, NEON_COLORS.red);
    });

    it("does not show flash overlay before Konami Code is typed", () => {
      render(<DigitalClock />);
      expect(screen.queryByTestId("konami-flash")).not.toBeInTheDocument();
    });

    it("activates color cycling after typing the full Konami Code sequence", () => {
      render(<DigitalClock />);
      const link = screen.getByTestId("digital-clock");

      act(() => {
        fireKonamiSequence();
      });

      // After activation, the color should change from the default red
      // The color should be one of the neon colors (first index = #ff0000 red,
      // but it may also still be red at index 0 before cycling starts)
      // We verify color cycling by advancing timers and checking color changes
      const colorBefore = link.style.color;

      act(() => {
        vi.advanceTimersByTime(500);
      });

      const colorAfter = link.style.color;
      // Color should have cycled to green (#00ff00)
      expectColor(link, NEON_COLORS.green);
      void colorBefore; // suppress unused variable warning
    });

    it("shows flash overlay immediately after Konami Code is typed", () => {
      render(<DigitalClock />);

      act(() => {
        fireKonamiSequence();
      });

      expect(screen.getByTestId("konami-flash")).toBeInTheDocument();
    });

    it("flash overlay disappears after 300ms", () => {
      render(<DigitalClock />);

      act(() => {
        fireKonamiSequence();
      });

      expect(screen.getByTestId("konami-flash")).toBeInTheDocument();

      act(() => {
        vi.advanceTimersByTime(300);
      });

      expect(screen.queryByTestId("konami-flash")).not.toBeInTheDocument();
    });

    it("color cycles through neon colors every 500ms when activated", () => {
      render(<DigitalClock />);
      const link = screen.getByTestId("digital-clock");

      act(() => {
        fireKonamiSequence();
      });

      // Initial: colorIndex = 0 => #ff0000 (red)
      expectColor(link, NEON_COLORS.red);

      act(() => {
        vi.advanceTimersByTime(500);
      });
      // colorIndex = 1 => #00ff00 (green)
      expectColor(link, NEON_COLORS.green);

      act(() => {
        vi.advanceTimersByTime(500);
      });
      // colorIndex = 2 => #ffaa00 (amber)
      expectColor(link, NEON_COLORS.amber);

      act(() => {
        vi.advanceTimersByTime(500);
      });
      // colorIndex = 3 => #00ffff (cyan)
      expectColor(link, NEON_COLORS.cyan);

      act(() => {
        vi.advanceTimersByTime(500);
      });
      // colorIndex = 4 => #ff00ff (magenta)
      expectColor(link, NEON_COLORS.magenta);

      act(() => {
        vi.advanceTimersByTime(500);
      });
      // colorIndex = 0 => #ff0000 (red, wraps around)
      expectColor(link, NEON_COLORS.red);
    });

    it("deactivates color cycling when Konami Code is typed a second time", () => {
      render(<DigitalClock />);
      const link = screen.getByTestId("digital-clock");

      // First Konami Code: activate
      act(() => {
        fireKonamiSequence();
      });

      // Verify cycling is active
      act(() => {
        vi.advanceTimersByTime(500);
      });
      expectColor(link, NEON_COLORS.green);

      // Second Konami Code: deactivate
      act(() => {
        fireKonamiSequence();
      });

      // After deactivation, color should return to default red
      expectColor(link, NEON_COLORS.red);

      // Verify color no longer cycles after 500ms
      const colorAfterDeactivation = link.style.color;
      act(() => {
        vi.advanceTimersByTime(500);
      });
      expect(link.style.color).toBe(colorAfterDeactivation);
    });

    it("returns to default red color after deactivation", () => {
      render(<DigitalClock />);
      const link = screen.getByTestId("digital-clock");

      // Activate
      act(() => {
        fireKonamiSequence();
      });

      // Let it cycle to a non-red color
      act(() => {
        vi.advanceTimersByTime(1000); // 2 cycles => #ffaa00 (amber)
      });
      expectColor(link, NEON_COLORS.amber);

      // Deactivate
      act(() => {
        fireKonamiSequence();
      });

      // Should be back to red
      expectColor(link, NEON_COLORS.red);
    });

    it("flash overlay appears on deactivation as well", () => {
      render(<DigitalClock />);

      // Activate
      act(() => {
        fireKonamiSequence();
      });
      // Dismiss flash
      act(() => {
        vi.advanceTimersByTime(300);
      });
      expect(screen.queryByTestId("konami-flash")).not.toBeInTheDocument();

      // Deactivate
      act(() => {
        fireKonamiSequence();
      });
      // Flash should appear again
      expect(screen.getByTestId("konami-flash")).toBeInTheDocument();
    });

    it("adds keydown listener on mount", () => {
      const addEventListenerSpy = vi.spyOn(window, "addEventListener");

      render(<DigitalClock />);

      expect(addEventListenerSpy).toHaveBeenCalledWith(
        "keydown",
        expect.any(Function)
      );
    });

    it("removes keydown listener on unmount to prevent memory leaks", () => {
      const removeEventListenerSpy = vi.spyOn(window, "removeEventListener");

      const { unmount } = render(<DigitalClock />);
      unmount();

      expect(removeEventListenerSpy).toHaveBeenCalledWith(
        "keydown",
        expect.any(Function)
      );
    });

    it("incomplete Konami Code sequence does not trigger activation", () => {
      render(<DigitalClock />);
      const link = screen.getByTestId("digital-clock");

      // Type only partial sequence (first 5 keys)
      act(() => {
        KONAMI_SEQUENCE.slice(0, 5).forEach((key) => {
          fireEvent.keyDown(window, { key });
        });
      });

      // No flash should appear
      expect(screen.queryByTestId("konami-flash")).not.toBeInTheDocument();

      // Color should still be default red
      act(() => {
        vi.advanceTimersByTime(500);
      });
      expectColor(link, NEON_COLORS.red);
    });

    it("wrong key resets the sequence progress", () => {
      render(<DigitalClock />);
      const link = screen.getByTestId("digital-clock");

      // Type part of the sequence then a wrong key
      act(() => {
        KONAMI_SEQUENCE.slice(0, 5).forEach((key) => {
          fireEvent.keyDown(window, { key });
        });
        // Wrong key
        fireEvent.keyDown(window, { key: "z" });
        // Continue with the rest of the sequence (insufficient to complete)
        KONAMI_SEQUENCE.slice(5).forEach((key) => {
          fireEvent.keyDown(window, { key });
        });
      });

      // Sequence was broken, no activation
      expect(screen.queryByTestId("konami-flash")).not.toBeInTheDocument();
      expectColor(link, NEON_COLORS.red);
    });

    it("color cycle state resets to default red on component remount", () => {
      const { unmount } = render(<DigitalClock />);

      // Activate color cycling
      act(() => {
        fireKonamiSequence();
      });

      act(() => {
        vi.advanceTimersByTime(500);
      });

      // Unmount then remount
      unmount();
      render(<DigitalClock />);

      const link = screen.getByTestId("digital-clock");
      // New instance should have default red color (state does not persist)
      expectColor(link, NEON_COLORS.red);

      // And no color cycling should happen
      act(() => {
        vi.advanceTimersByTime(500);
      });
      expectColor(link, NEON_COLORS.red);
    });

    it("color cycling interval uses 500ms", () => {
      const setIntervalSpy = vi.spyOn(global, "setInterval");

      render(<DigitalClock />);

      act(() => {
        fireKonamiSequence();
      });

      // Should have a 500ms interval for color cycling
      expect(setIntervalSpy).toHaveBeenCalledWith(expect.any(Function), 500);
    });

    it("color cycling interval is cleaned up when deactivated", () => {
      const clearIntervalSpy = vi.spyOn(global, "clearInterval");

      render(<DigitalClock />);

      // Activate
      act(() => {
        fireKonamiSequence();
      });

      // Deactivate
      act(() => {
        fireKonamiSequence();
      });

      // clearInterval should have been called to clean up the 500ms interval
      expect(clearIntervalSpy).toHaveBeenCalled();
    });
  });

  // Tooltip tests (US-003)
  describe("motivational quote tooltip", () => {
    const KNOWN_QUOTES = [
      "The best time to start is now.",
      "Stay focused, stay sharp.",
      "One task at a time.",
      "You are making progress.",
      "Tick tock, time to rock.",
      "Small steps lead to big wins.",
      "Every second counts.",
    ];

    it("tooltip is not visible initially (before hover)", () => {
      render(<DigitalClock />);
      const tooltip = screen.queryByRole("tooltip");
      expect(tooltip).not.toBeInTheDocument();
    });

    it("tooltip appears when hovering over the clock", () => {
      render(<DigitalClock />);
      const link = screen.getByRole("link", { name: /visit nba\.com/i });

      fireEvent.mouseEnter(link);

      const tooltip = screen.getByRole("tooltip");
      expect(tooltip).toBeInTheDocument();
    });

    it("tooltip disappears when the mouse leaves the clock area", () => {
      render(<DigitalClock />);
      const link = screen.getByRole("link", { name: /visit nba\.com/i });

      fireEvent.mouseEnter(link);
      expect(screen.getByRole("tooltip")).toBeInTheDocument();

      fireEvent.mouseLeave(link);
      expect(screen.queryByRole("tooltip")).not.toBeInTheDocument();
    });

    it("tooltip shows a quote from the hardcoded array", () => {
      render(<DigitalClock />);
      const link = screen.getByRole("link", { name: /visit nba\.com/i });

      fireEvent.mouseEnter(link);

      const tooltip = screen.getByRole("tooltip");
      const quoteText = tooltip.textContent ?? "";
      expect(KNOWN_QUOTES).toContain(quoteText);
    });

    it("tooltip has role='tooltip'", () => {
      render(<DigitalClock />);
      const link = screen.getByRole("link", { name: /visit nba\.com/i });

      fireEvent.mouseEnter(link);

      const tooltip = screen.getByRole("tooltip");
      expect(tooltip).toHaveAttribute("role", "tooltip");
    });

    it("clock has aria-describedby pointing to the tooltip when hovered", () => {
      render(<DigitalClock />);
      const link = screen.getByRole("link", { name: /visit nba\.com/i });

      fireEvent.mouseEnter(link);

      const tooltip = screen.getByRole("tooltip");
      const tooltipId = tooltip.getAttribute("id");
      expect(tooltipId).toBeTruthy();
      expect(link).toHaveAttribute("aria-describedby", tooltipId);
    });

    it("clock does not have aria-describedby when not hovered", () => {
      render(<DigitalClock />);
      const link = screen.getByRole("link", { name: /visit nba\.com/i });

      expect(link).not.toHaveAttribute("aria-describedby");
    });

    it("aria-describedby is removed when mouse leaves", () => {
      render(<DigitalClock />);
      const link = screen.getByRole("link", { name: /visit nba\.com/i });

      fireEvent.mouseEnter(link);
      expect(link).toHaveAttribute("aria-describedby");

      fireEvent.mouseLeave(link);
      expect(link).not.toHaveAttribute("aria-describedby");
    });

    it("tooltip quote text is positioned above the clock (absolute bottom-full)", () => {
      render(<DigitalClock />);
      const link = screen.getByRole("link", { name: /visit nba\.com/i });

      fireEvent.mouseEnter(link);

      const tooltip = screen.getByRole("tooltip");
      expect(tooltip.className).toMatch(/bottom-full/);
    });

    it("tooltip has black background styling", () => {
      render(<DigitalClock />);
      const link = screen.getByRole("link", { name: /visit nba\.com/i });

      fireEvent.mouseEnter(link);

      const tooltip = screen.getByRole("tooltip");
      // The inner styled div containing the quote text
      const styledDiv = tooltip.querySelector("div");
      expect(styledDiv).toBeTruthy();
      const bg = styledDiv!.style.backgroundColor;
      expect(bg === "#000000" || bg === "rgb(0, 0, 0)").toBe(true);
    });

    it("tooltip has red text styling", () => {
      render(<DigitalClock />);
      const link = screen.getByRole("link", { name: /visit nba\.com/i });

      fireEvent.mouseEnter(link);

      const tooltip = screen.getByRole("tooltip");
      const styledDiv = tooltip.querySelector("div");
      expect(styledDiv).toBeTruthy();
      const color = styledDiv!.style.color;
      expect(color === "#ff0000" || color === "rgb(255, 0, 0)").toBe(true);
    });

    it("tooltip uses monospace font (font-mono class)", () => {
      render(<DigitalClock />);
      const link = screen.getByRole("link", { name: /visit nba\.com/i });

      fireEvent.mouseEnter(link);

      const tooltip = screen.getByRole("tooltip");
      const styledDiv = tooltip.querySelector("div");
      expect(styledDiv).toBeTruthy();
      expect(styledDiv!.className).toMatch(/font-mono/);
    });

    it("tooltip has rounded corners (rounded class)", () => {
      render(<DigitalClock />);
      const link = screen.getByRole("link", { name: /visit nba\.com/i });

      fireEvent.mouseEnter(link);

      const tooltip = screen.getByRole("tooltip");
      const styledDiv = tooltip.querySelector("div");
      expect(styledDiv).toBeTruthy();
      expect(styledDiv!.className).toMatch(/rounded/);
    });

    it("tooltip has a downward-pointing caret arrow", () => {
      render(<DigitalClock />);
      const link = screen.getByRole("link", { name: /visit nba\.com/i });

      fireEvent.mouseEnter(link);

      const tooltip = screen.getByRole("tooltip");
      // There should be at least 2 divs: the quote container and the arrow
      const divs = tooltip.querySelectorAll("div");
      expect(divs.length).toBeGreaterThanOrEqual(2);

      // The caret div should have borderTop set (downward-pointing triangle)
      const caretDiv = divs[divs.length - 1];
      expect(caretDiv.style.borderTop).toBeTruthy();
    });

    it("selects a new random quote each time hover begins", () => {
      // Verify that Math.random is called on each mouseEnter event,
      // indicating a new quote is selected per hover rather than being cached from render.
      const randomSpy = vi.spyOn(Math, "random");

      render(<DigitalClock />);
      const link = screen.getByRole("link", { name: /visit nba\.com/i });

      // Record call count after render (initial useRef call may invoke Math.random)
      const callsAfterRender = randomSpy.mock.calls.length;

      fireEvent.mouseEnter(link);
      const firstTooltip = screen.getByRole("tooltip");
      const firstQuote = firstTooltip.textContent ?? "";

      // Math.random should have been called at least once more for the first hover
      const callsAfterFirstHover = randomSpy.mock.calls.length;
      expect(callsAfterFirstHover).toBeGreaterThan(callsAfterRender);
      expect(KNOWN_QUOTES).toContain(firstQuote);

      fireEvent.mouseLeave(link);

      fireEvent.mouseEnter(link);
      const secondTooltip = screen.getByRole("tooltip");
      const secondQuote = secondTooltip.textContent ?? "";

      // Math.random should have been called at least once more for the second hover
      const callsAfterSecondHover = randomSpy.mock.calls.length;
      expect(callsAfterSecondHover).toBeGreaterThan(callsAfterFirstHover);
      expect(KNOWN_QUOTES).toContain(secondQuote);

      randomSpy.mockRestore();
    });

    it("there are at least 5 quotes available in the hardcoded list", () => {
      // Render once and hover multiple times; since Math.random picks randomly,
      // after enough hovers we should see at least 5 distinct quotes.
      // Use a fixed sequence to deterministically cycle through quotes.
      const seenQuotes = new Set<string>();
      const randomSpy = vi.spyOn(Math, "random");

      render(<DigitalClock />);
      const link = screen.getByRole("link", { name: /visit nba\.com/i });

      // Hover once per quote index position, mapping each i to select quote[i]
      for (let i = 0; i < KNOWN_QUOTES.length; i++) {
        // mockReturnValueOnce for the mouseEnter call
        randomSpy.mockReturnValueOnce(i / KNOWN_QUOTES.length);
        fireEvent.mouseEnter(link);
        const tooltip = screen.getByRole("tooltip");
        if (tooltip.textContent) {
          seenQuotes.add(tooltip.textContent);
        }
        fireEvent.mouseLeave(link);
      }

      randomSpy.mockRestore();
      expect(seenQuotes.size).toBeGreaterThanOrEqual(5);
    });
  });
});
