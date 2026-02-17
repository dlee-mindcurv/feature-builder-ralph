import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { Footer } from "@/components/ui/Footer";

describe("Footer", () => {
  it("renders a semantic footer element", () => {
    const { container } = render(<Footer />);
    const footer = container.querySelector("footer");
    expect(footer).toBeInTheDocument();
  });

  it("displays the TaskFlow brand name", () => {
    render(<Footer />);
    expect(screen.getByText("TaskFlow")).toBeInTheDocument();
  });

  it("displays the copyright line with 2026", () => {
    render(<Footer />);
    expect(screen.getByText(/TaskFlow 2026/i)).toBeInTheDocument();
  });

  it("includes at least three navigation links", () => {
    render(<Footer />);
    const nav = screen.getByRole("navigation", { name: /footer navigation/i });
    const links = nav.querySelectorAll("a");
    expect(links.length).toBeGreaterThanOrEqual(3);
  });

  it("includes a Home navigation link", () => {
    render(<Footer />);
    expect(screen.getByRole("link", { name: "Home" })).toBeInTheDocument();
  });

  it("includes an About navigation link", () => {
    render(<Footer />);
    expect(screen.getByRole("link", { name: "About" })).toBeInTheDocument();
  });

  it("includes a Privacy navigation link", () => {
    render(<Footer />);
    expect(screen.getByRole("link", { name: "Privacy" })).toBeInTheDocument();
  });

  it("navigation links point to correct hrefs", () => {
    render(<Footer />);
    expect(screen.getByRole("link", { name: "Home" })).toHaveAttribute("href", "/");
    expect(screen.getByRole("link", { name: "About" })).toHaveAttribute("href", "/about");
    expect(screen.getByRole("link", { name: "Privacy" })).toHaveAttribute("href", "/privacy");
  });

  it("applies pink gradient background classes", () => {
    const { container } = render(<Footer />);
    const footer = container.querySelector("footer");
    expect(footer?.className).toMatch(/from-pink-\d+/);
    expect(footer?.className).toMatch(/to-pink-\d+/);
  });

  it("applies dark mode pink variant class", () => {
    const { container } = render(<Footer />);
    const footer = container.querySelector("footer");
    expect(footer?.className).toMatch(/dark:.*pink-\d+/);
  });

  it("has aria-hidden SVG decorative elements", () => {
    const { container } = render(<Footer />);
    const hiddenSvgs = container.querySelectorAll('svg[aria-hidden="true"]');
    expect(hiddenSvgs.length).toBeGreaterThanOrEqual(1);
  });

  it("footer nav links have hover and focus styles", () => {
    render(<Footer />);
    const homeLink = screen.getByRole("link", { name: "Home" });
    expect(homeLink.className).toMatch(/hover:/);
    expect(homeLink.className).toMatch(/focus:/);
  });

  it("footer content container uses flex layout for responsive design", () => {
    const { container } = render(<Footer />);
    const flexContainer = container.querySelector(".flex.flex-col");
    expect(flexContainer).toBeInTheDocument();
  });

  it("footer content switches to horizontal layout on desktop", () => {
    const { container } = render(<Footer />);
    const responsiveContainer = container.querySelector(".md\\:flex-row");
    expect(responsiveContainer).toBeInTheDocument();
  });

  it("footer nav list uses vertical stacking on mobile and horizontal on desktop", () => {
    const { container } = render(<Footer />);
    const navList = container.querySelector("ul.flex-col");
    expect(navList).toBeInTheDocument();
    expect(navList?.className).toMatch(/md:flex-row/);
  });
});
