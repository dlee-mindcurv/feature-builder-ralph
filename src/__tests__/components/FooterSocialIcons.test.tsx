import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { Footer } from "@/components/ui/Footer";

describe("Footer Social Media Icons (US-002)", () => {
  it("displays at least four social media icon links", () => {
    const { container } = render(<Footer />);
    // Social links open in _blank, so we can query by target attribute
    const socialLinks = container.querySelectorAll('a[target="_blank"]');
    expect(socialLinks.length).toBeGreaterThanOrEqual(4);
  });

  it("includes a GitHub social link", () => {
    render(<Footer />);
    expect(
      screen.getByRole("link", { name: /visit taskflow on github/i })
    ).toBeInTheDocument();
  });

  it("includes a Twitter/X social link", () => {
    render(<Footer />);
    expect(
      screen.getByRole("link", { name: /visit taskflow on twitter/i })
    ).toBeInTheDocument();
  });

  it("includes a LinkedIn social link", () => {
    render(<Footer />);
    expect(
      screen.getByRole("link", { name: /visit taskflow on linkedin/i })
    ).toBeInTheDocument();
  });

  it("includes a Discord social link", () => {
    render(<Footer />);
    expect(
      screen.getByRole("link", { name: /visit taskflow on discord/i })
    ).toBeInTheDocument();
  });

  it("each social icon link has target='_blank'", () => {
    const { container } = render(<Footer />);
    const socialLinks = container.querySelectorAll('a[target="_blank"]');
    expect(socialLinks.length).toBeGreaterThanOrEqual(4);
    socialLinks.forEach((link) => {
      expect(link).toHaveAttribute("target", "_blank");
    });
  });

  it("each social icon link has rel='noopener noreferrer'", () => {
    const { container } = render(<Footer />);
    const socialLinks = container.querySelectorAll('a[target="_blank"]');
    expect(socialLinks.length).toBeGreaterThanOrEqual(4);
    socialLinks.forEach((link) => {
      expect(link).toHaveAttribute("rel", "noopener noreferrer");
    });
  });

  it("each social icon link has a descriptive aria-label", () => {
    const { container } = render(<Footer />);
    const socialLinks = container.querySelectorAll('a[target="_blank"]');
    expect(socialLinks.length).toBeGreaterThanOrEqual(4);
    socialLinks.forEach((link) => {
      const ariaLabel = link.getAttribute("aria-label");
      expect(ariaLabel).toBeTruthy();
      expect(ariaLabel!.length).toBeGreaterThan(0);
    });
  });

  it("GitHub link has a descriptive aria-label mentioning GitHub", () => {
    render(<Footer />);
    const githubLink = screen.getByRole("link", { name: /github/i });
    expect(githubLink).toHaveAttribute("aria-label", expect.stringMatching(/github/i));
  });

  it("each social icon contains an SVG element", () => {
    const { container } = render(<Footer />);
    const socialLinks = container.querySelectorAll('a[target="_blank"]');
    expect(socialLinks.length).toBeGreaterThanOrEqual(4);
    socialLinks.forEach((link) => {
      const svg = link.querySelector("svg");
      expect(svg).toBeInTheDocument();
    });
  });

  it("social icon SVGs are sized consistently with width and height of 24", () => {
    const { container } = render(<Footer />);
    const socialLinks = container.querySelectorAll('a[target="_blank"]');
    expect(socialLinks.length).toBeGreaterThanOrEqual(4);
    socialLinks.forEach((link) => {
      const svg = link.querySelector("svg");
      expect(svg).toHaveAttribute("width", "24");
      expect(svg).toHaveAttribute("height", "24");
    });
  });

  it("social icon SVGs have aria-hidden='true' to hide them from assistive technology", () => {
    const { container } = render(<Footer />);
    const socialLinks = container.querySelectorAll('a[target="_blank"]');
    expect(socialLinks.length).toBeGreaterThanOrEqual(4);
    socialLinks.forEach((link) => {
      const svg = link.querySelector("svg");
      expect(svg).toHaveAttribute("aria-hidden", "true");
    });
  });

  it("social icons row is centered (uses justify-center)", () => {
    const { container } = render(<Footer />);
    // The container wrapping the social links should have justify-center for mobile centering
    const socialLink = container.querySelector('a[target="_blank"]');
    expect(socialLink).toBeInTheDocument();
    const socialRow = socialLink!.closest("div");
    expect(socialRow?.className).toMatch(/justify-center/);
  });

  it("social icon links have hover animation classes (scale or glow)", () => {
    const { container } = render(<Footer />);
    const socialLinks = container.querySelectorAll('a[target="_blank"]');
    expect(socialLinks.length).toBeGreaterThanOrEqual(4);
    socialLinks.forEach((link) => {
      // Should have either hover:scale or hover:drop-shadow for animation
      const hasHoverAnimation =
        link.className.includes("hover:scale") ||
        link.className.includes("hover:drop-shadow");
      expect(hasHoverAnimation).toBe(true);
    });
  });

  it("social icon links have white or light-pink color class", () => {
    const { container } = render(<Footer />);
    const socialLinks = container.querySelectorAll('a[target="_blank"]');
    expect(socialLinks.length).toBeGreaterThanOrEqual(4);
    socialLinks.forEach((link) => {
      const hasLightColor =
        link.className.includes("text-white") ||
        link.className.includes("text-pink-");
      expect(hasLightColor).toBe(true);
    });
  });

  it("social icon links have dark mode classes for visibility", () => {
    const { container } = render(<Footer />);
    const socialLinks = container.querySelectorAll('a[target="_blank"]');
    expect(socialLinks.length).toBeGreaterThanOrEqual(4);
    // At least one social link should have a dark: class for dark mode support
    const hasDarkMode = Array.from(socialLinks).some((link) =>
      link.className.includes("dark:")
    );
    expect(hasDarkMode).toBe(true);
  });

  it("social icons section appears after navigation links in DOM order", () => {
    const { container } = render(<Footer />);
    const nav = container.querySelector("nav");
    const socialRow = container.querySelector('a[target="_blank"]')?.closest("div");
    expect(nav).toBeInTheDocument();
    expect(socialRow).toBeInTheDocument();
    // Compare DOM position: nav should come before the social row
    const navPosition = nav!.compareDocumentPosition(socialRow!);
    // DOCUMENT_POSITION_FOLLOWING = 4 means socialRow comes after nav
    expect(navPosition & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy();
  });

  it("social icon links have focus styles for keyboard accessibility", () => {
    const { container } = render(<Footer />);
    const socialLinks = container.querySelectorAll('a[target="_blank"]');
    expect(socialLinks.length).toBeGreaterThanOrEqual(4);
    socialLinks.forEach((link) => {
      expect(link.className).toMatch(/focus:/);
    });
  });

  it("GitHub link points to a GitHub URL", () => {
    render(<Footer />);
    const githubLink = screen.getByRole("link", { name: /github/i });
    const href = githubLink.getAttribute("href");
    expect(href).toMatch(/github\.com/);
  });

  it("Twitter link points to a Twitter/X URL", () => {
    render(<Footer />);
    const twitterLink = screen.getByRole("link", { name: /twitter/i });
    const href = twitterLink.getAttribute("href");
    expect(href).toMatch(/twitter\.com|x\.com/);
  });

  it("LinkedIn link points to a LinkedIn URL", () => {
    render(<Footer />);
    const linkedinLink = screen.getByRole("link", { name: /linkedin/i });
    const href = linkedinLink.getAttribute("href");
    expect(href).toMatch(/linkedin\.com/);
  });

  it("Discord link points to a Discord URL", () => {
    render(<Footer />);
    const discordLink = screen.getByRole("link", { name: /discord/i });
    const href = discordLink.getAttribute("href");
    expect(href).toMatch(/discord\.(gg|com)/);
  });
});
