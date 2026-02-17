import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi, beforeEach, afterEach } from "vitest";
import { Footer } from "@/components/ui/Footer";

describe("Footer Back-to-Top Button (US-004)", () => {
  beforeEach(() => {
    // Mock window.scrollTo since jsdom doesn't implement it
    Object.defineProperty(window, "scrollTo", {
      value: vi.fn(),
      writable: true,
    });
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("displays a 'Back to Top' button in the footer", () => {
    render(<Footer />);
    const button = screen.getByRole("button", { name: /scroll to top/i });
    expect(button).toBeInTheDocument();
  });

  it("the button has aria-label='Scroll to top'", () => {
    render(<Footer />);
    const button = screen.getByRole("button", { name: /scroll to top/i });
    expect(button).toHaveAttribute("aria-label", "Scroll to top");
  });

  it("the button is a <button> element", () => {
    const { container } = render(<Footer />);
    const button = container.querySelector('button[aria-label="Scroll to top"]');
    expect(button).toBeInTheDocument();
    expect(button!.tagName.toLowerCase()).toBe("button");
  });

  it("displays a text label 'Back to Top' inside the button", () => {
    render(<Footer />);
    const button = screen.getByRole("button", { name: /scroll to top/i });
    expect(button.textContent).toMatch(/back to top/i);
  });

  it("contains an upward arrow SVG icon inside the button", () => {
    const { container } = render(<Footer />);
    const button = container.querySelector('button[aria-label="Scroll to top"]');
    const svg = button?.querySelector("svg");
    expect(svg).toBeInTheDocument();
  });

  it("the arrow SVG icon has aria-hidden='true'", () => {
    const { container } = render(<Footer />);
    const button = container.querySelector('button[aria-label="Scroll to top"]');
    const svg = button?.querySelector("svg");
    expect(svg).toHaveAttribute("aria-hidden", "true");
  });

  it("clicking the button calls window.scrollTo with smooth behavior", async () => {
    const user = userEvent.setup();
    render(<Footer />);
    const button = screen.getByRole("button", { name: /scroll to top/i });
    await user.click(button);
    expect(window.scrollTo).toHaveBeenCalledWith({ top: 0, behavior: "smooth" });
  });

  it("clicking the button scrolls to the very top (top: 0)", async () => {
    const user = userEvent.setup();
    render(<Footer />);
    const button = screen.getByRole("button", { name: /scroll to top/i });
    await user.click(button);
    expect(window.scrollTo).toHaveBeenCalledWith(
      expect.objectContaining({ top: 0 })
    );
  });

  it("the button is styled as a pill/rounded shape (rounded-full class)", () => {
    const { container } = render(<Footer />);
    const button = container.querySelector('button[aria-label="Scroll to top"]');
    expect(button?.className).toMatch(/rounded-full|rounded-pill/);
  });

  it("the button has a contrasting background color (white or pink-200) against pink footer", () => {
    const { container } = render(<Footer />);
    const button = container.querySelector('button[aria-label="Scroll to top"]');
    const hasContrastingColor =
      button?.className.includes("bg-white") ||
      button?.className.includes("bg-pink-1") ||
      button?.className.includes("bg-pink-2") ||
      button?.className.includes("bg-pink-3");
    expect(hasContrastingColor).toBe(true);
  });

  it("the button has a hover animation class (translate, shadow, or color shift)", () => {
    const { container } = render(<Footer />);
    const button = container.querySelector('button[aria-label="Scroll to top"]');
    const hasHoverAnimation =
      button?.className.includes("hover:-translate") ||
      button?.className.includes("hover:translate") ||
      button?.className.includes("hover:shadow") ||
      button?.className.includes("hover:bg-") ||
      button?.className.includes("hover:scale");
    expect(hasHoverAnimation).toBe(true);
  });

  it("the button has a visible focus ring class for accessibility", () => {
    const { container } = render(<Footer />);
    const button = container.querySelector('button[aria-label="Scroll to top"]');
    expect(button?.className).toMatch(/focus:ring/);
  });

  it("the button has focus:outline-none to use custom focus ring", () => {
    const { container } = render(<Footer />);
    const button = container.querySelector('button[aria-label="Scroll to top"]');
    expect(button?.className).toMatch(/focus:outline-none/);
  });

  it("the button has a minimum height of at least 44px via min-h class", () => {
    const { container } = render(<Footer />);
    const button = container.querySelector('button[aria-label="Scroll to top"]');
    // min-h-[44px] or py-3 with adequate base height
    const hasMobileTargetSize =
      button?.className.includes("min-h-[44px]") ||
      button?.className.includes("min-h-11") ||
      button?.className.includes("py-3") ||
      button?.className.includes("py-4");
    expect(hasMobileTargetSize).toBe(true);
  });

  it("the button has a minimum width for tap targeting", () => {
    const { container } = render(<Footer />);
    const button = container.querySelector('button[aria-label="Scroll to top"]');
    const hasMinWidth =
      button?.className.includes("min-w-[44px]") ||
      button?.className.includes("min-w-11") ||
      button?.className.includes("px-") ||
      button?.className.includes("px-4") ||
      button?.className.includes("px-5") ||
      button?.className.includes("px-6");
    expect(hasMinWidth).toBe(true);
  });

  it("the button container uses flex justify-center so button is centered on mobile", () => {
    const { container } = render(<Footer />);
    const button = container.querySelector('button[aria-label="Scroll to top"]');
    const wrapper = button?.closest("div");
    expect(wrapper?.className).toMatch(/justify-center/);
  });

  it("the button has dark mode color classes", () => {
    const { container } = render(<Footer />);
    const button = container.querySelector('button[aria-label="Scroll to top"]');
    expect(button?.className).toMatch(/dark:/);
  });

  it("the button has dark mode background adjustment", () => {
    const { container } = render(<Footer />);
    const button = container.querySelector('button[aria-label="Scroll to top"]');
    const hasDarkBg = button?.className.includes("dark:bg-");
    expect(hasDarkBg).toBe(true);
  });

  it("the button has dark mode text color class", () => {
    const { container } = render(<Footer />);
    const button = container.querySelector('button[aria-label="Scroll to top"]');
    const hasDarkText = button?.className.includes("dark:text-");
    expect(hasDarkText).toBe(true);
  });

  it("the button appears in the footer after the newsletter section", () => {
    const { container } = render(<Footer />);
    const form = container.querySelector('form[aria-label="Newsletter signup"]');
    const button = container.querySelector('button[aria-label="Scroll to top"]');
    expect(form).toBeInTheDocument();
    expect(button).toBeInTheDocument();
    // Back-to-Top button should come after newsletter form in DOM
    const formPosition = form!.compareDocumentPosition(button!);
    // DOCUMENT_POSITION_FOLLOWING = 4 means button comes after form
    expect(formPosition & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy();
  });

  it("the button has transition classes for smooth animation", () => {
    const { container } = render(<Footer />);
    const button = container.querySelector('button[aria-label="Scroll to top"]');
    expect(button?.className).toMatch(/transition/);
  });

  it("the button type is 'button' to prevent accidental form submission", () => {
    const { container } = render(<Footer />);
    const button = container.querySelector('button[aria-label="Scroll to top"]');
    expect(button).toHaveAttribute("type", "button");
  });
});
