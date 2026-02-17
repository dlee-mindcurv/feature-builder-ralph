import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import Footer from "@/components/ui/Footer";

describe("Footer", () => {
  it("renders a semantic footer element", () => {
    const { container } = render(<Footer />);
    const footer = container.querySelector("footer");
    expect(footer).toBeInTheDocument();
  });

  it("uses pink gradient color scheme", () => {
    const { container } = render(<Footer />);
    const footer = container.querySelector("footer");
    expect(footer?.className).toContain("bg-gradient-to-r");
    expect(footer?.className).toContain("from-pink-400");
    expect(footer?.className).toContain("to-pink-600");
  });

  it("uses darker pink variant in dark mode", () => {
    const { container } = render(<Footer />);
    const footer = container.querySelector("footer");
    expect(footer?.className).toContain("dark:from-pink-900");
    expect(footer?.className).toContain("dark:to-pink-800");
  });

  it("includes decorative SVG with aria-hidden attribute", () => {
    const { container } = render(<Footer />);
    const svg = container.querySelector("svg[aria-hidden='true']");
    expect(svg).toBeInTheDocument();
  });

  it("displays TaskFlow brand name", () => {
    render(<Footer />);
    expect(screen.getByRole("heading", { name: "TaskFlow" })).toBeInTheDocument();
  });

  it("displays copyright line with year 2026", () => {
    render(<Footer />);
    expect(screen.getByText(/TaskFlow 2026/i)).toBeInTheDocument();
  });

  it("includes Home navigation link", () => {
    render(<Footer />);
    const homeLink = screen.getByRole("link", { name: "Home" });
    expect(homeLink).toBeInTheDocument();
    expect(homeLink).toHaveAttribute("href", "/");
  });

  it("includes About navigation link", () => {
    render(<Footer />);
    const aboutLink = screen.getByRole("link", { name: "About" });
    expect(aboutLink).toBeInTheDocument();
    expect(aboutLink).toHaveAttribute("href", "/about");
  });

  it("includes Privacy navigation link", () => {
    render(<Footer />);
    const privacyLink = screen.getByRole("link", { name: "Privacy" });
    expect(privacyLink).toBeInTheDocument();
    expect(privacyLink).toHaveAttribute("href", "/privacy");
  });

  it("has at least three navigation links", () => {
    render(<Footer />);
    const nav = screen.getByRole("navigation", { name: "Footer navigation" });
    const links = nav.querySelectorAll("a");
    expect(links.length).toBeGreaterThanOrEqual(3);
  });

  it("applies hover state classes to navigation links", () => {
    render(<Footer />);
    const homeLink = screen.getByRole("link", { name: "Home" });
    expect(homeLink.className).toContain("hover:text-pink-100");
    expect(homeLink.className).toContain("dark:hover:text-pink-300");
  });

  it("applies focus state classes to navigation links", () => {
    render(<Footer />);
    const homeLink = screen.getByRole("link", { name: "Home" });
    expect(homeLink.className).toContain("focus:text-pink-100");
    expect(homeLink.className).toContain("dark:focus:text-pink-300");
  });

  it("uses responsive layout classes - mobile vertical", () => {
    const { container } = render(<Footer />);
    const layoutDiv = container.querySelector(".flex.flex-col.md\\:flex-row");
    expect(layoutDiv).toBeInTheDocument();
  });

  it("uses responsive layout classes - desktop horizontal", () => {
    const { container } = render(<Footer />);
    const layoutDiv = container.querySelector(".md\\:flex-row.md\\:justify-between");
    expect(layoutDiv).toBeInTheDocument();
  });

  it("centers content on mobile", () => {
    const { container } = render(<Footer />);
    const layoutDiv = container.querySelector(".text-center.md\\:text-left");
    expect(layoutDiv).toBeInTheDocument();
  });

  it("includes navigation with proper aria-label", () => {
    render(<Footer />);
    const nav = screen.getByRole("navigation", { name: "Footer navigation" });
    expect(nav).toBeInTheDocument();
  });
});
