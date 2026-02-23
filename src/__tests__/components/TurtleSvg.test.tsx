import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { TurtleSvg } from "@/components/ui/TurtleSvg";

describe("TurtleSvg", () => {
  it("renders the SVG element", () => {
    const { container } = render(<TurtleSvg />);
    const svg = container.querySelector("svg");
    expect(svg).toBeInTheDocument();
  });

  it("has explicit width of 100", () => {
    const { container } = render(<TurtleSvg />);
    const svg = container.querySelector("svg");
    expect(svg).toHaveAttribute("width", "100");
  });

  it("has explicit height of 100", () => {
    const { container } = render(<TurtleSvg />);
    const svg = container.querySelector("svg");
    expect(svg).toHaveAttribute("height", "100");
  });

  it("has role='img' for accessibility", () => {
    render(<TurtleSvg />);
    const svg = screen.getByRole("img");
    expect(svg).toBeInTheDocument();
  });

  it("has aria-label 'TaskFlow turtle mascot'", () => {
    render(<TurtleSvg />);
    const svg = screen.getByRole("img", { name: "TaskFlow turtle mascot" });
    expect(svg).toBeInTheDocument();
  });

  it("contains green fill colors for body and shell", () => {
    const { container } = render(<TurtleSvg />);
    const elements = container.querySelectorAll("[fill]");
    const fills = Array.from(elements).map((el) => el.getAttribute("fill"));
    const greenFills = fills.filter(
      (fill) =>
        fill &&
        (fill.toLowerCase().includes("#4ade80") ||
          fill.toLowerCase().includes("#16a34a") ||
          fill.toLowerCase().includes("#15803d") ||
          fill.toLowerCase().includes("green"))
    );
    expect(greenFills.length).toBeGreaterThan(0);
  });

  it("uses the correct xmlns attribute", () => {
    const { container } = render(<TurtleSvg />);
    const svg = container.querySelector("svg");
    expect(svg).toHaveAttribute("xmlns", "http://www.w3.org/2000/svg");
  });

  it("renders ellipses for body and shell", () => {
    const { container } = render(<TurtleSvg />);
    const ellipses = container.querySelectorAll("ellipse");
    expect(ellipses.length).toBeGreaterThan(0);
  });

  it("renders circles for eyes", () => {
    const { container } = render(<TurtleSvg />);
    const circles = container.querySelectorAll("circle");
    expect(circles.length).toBeGreaterThan(0);
  });

  it("renders a path for the smile", () => {
    const { container } = render(<TurtleSvg />);
    const paths = container.querySelectorAll("path");
    expect(paths.length).toBeGreaterThan(0);
  });
});
