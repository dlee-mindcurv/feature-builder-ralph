import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import Footer from "@/components/ui/Footer";

describe("Footer", () => {
  it("renders as a semantic footer element", () => {
    const { container } = render(<Footer />);
    const footer = container.querySelector("footer");
    expect(footer).toBeInTheDocument();
  });

  it("displays the TaskFlow brand name", () => {
    render(<Footer />);
    expect(screen.getByRole("heading", { name: "TaskFlow" })).toBeInTheDocument();
  });

  it("displays the copyright line with current year", () => {
    render(<Footer />);
    expect(screen.getByText(/© 2026 TaskFlow/i)).toBeInTheDocument();
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

  it("has pink color scheme with gradient classes", () => {
    const { container } = render(<Footer />);
    const footer = container.querySelector("footer");
    expect(footer?.className).toContain("bg-gradient-to-r");
    expect(footer?.className).toContain("from-pink-400");
    expect(footer?.className).toContain("to-pink-600");
  });

  it("has dark mode pink variant classes", () => {
    const { container } = render(<Footer />);
    const footer = container.querySelector("footer");
    expect(footer?.className).toContain("dark:from-pink-900");
    expect(footer?.className).toContain("dark:to-pink-900");
  });

  it("includes decorative wave SVG with aria-hidden", () => {
    const { container } = render(<Footer />);
    const svg = container.querySelector("svg[aria-hidden='true']");
    expect(svg).toBeInTheDocument();
  });

  it("has animation on brand name", () => {
    render(<Footer />);
    const heading = screen.getByRole("heading", { name: "TaskFlow" });
    expect(heading.className).toContain("animate-pulse");
  });

  it("has responsive flex layout classes", () => {
    const { container } = render(<Footer />);
    const contentWrapper = container.querySelector(".flex.flex-col.md\\:flex-row");
    expect(contentWrapper).toBeInTheDocument();
  });

  it("has visible hover states on navigation links", () => {
    render(<Footer />);
    const homeLink = screen.getByRole("link", { name: "Home" });
    expect(homeLink.className).toContain("hover:text-pink-100");
    expect(homeLink.className).toContain("hover:scale-110");
  });

  it("has visible focus states on navigation links", () => {
    render(<Footer />);
    const homeLink = screen.getByRole("link", { name: "Home" });
    expect(homeLink.className).toContain("focus:outline-none");
    expect(homeLink.className).toContain("focus:ring-2");
    expect(homeLink.className).toContain("focus:ring-white");
  });

  it("renders navigation as a nav element", () => {
    const { container } = render(<Footer />);
    const nav = container.querySelector("nav");
    expect(nav).toBeInTheDocument();
  });

  // US-002: Footer Social Media Icons
  describe("Social Media Icons", () => {
    it("displays at least four social media icons", () => {
      render(<Footer />);
      const githubLink = screen.getByRole("link", { name: /GitHub/i });
      const twitterLink = screen.getByRole("link", { name: /Twitter/i });
      const linkedinLink = screen.getByRole("link", { name: /LinkedIn/i });
      const discordLink = screen.getByRole("link", { name: /Discord/i });

      expect(githubLink).toBeInTheDocument();
      expect(twitterLink).toBeInTheDocument();
      expect(linkedinLink).toBeInTheDocument();
      expect(discordLink).toBeInTheDocument();
    });

    it("each icon link has target='_blank' attribute", () => {
      render(<Footer />);
      const githubLink = screen.getByRole("link", { name: /GitHub/i });
      const twitterLink = screen.getByRole("link", { name: /Twitter/i });
      const linkedinLink = screen.getByRole("link", { name: /LinkedIn/i });
      const discordLink = screen.getByRole("link", { name: /Discord/i });

      expect(githubLink).toHaveAttribute("target", "_blank");
      expect(twitterLink).toHaveAttribute("target", "_blank");
      expect(linkedinLink).toHaveAttribute("target", "_blank");
      expect(discordLink).toHaveAttribute("target", "_blank");
    });

    it("each icon link has rel='noopener noreferrer' attribute", () => {
      render(<Footer />);
      const githubLink = screen.getByRole("link", { name: /GitHub/i });
      const twitterLink = screen.getByRole("link", { name: /Twitter/i });
      const linkedinLink = screen.getByRole("link", { name: /LinkedIn/i });
      const discordLink = screen.getByRole("link", { name: /Discord/i });

      expect(githubLink).toHaveAttribute("rel", "noopener noreferrer");
      expect(twitterLink).toHaveAttribute("rel", "noopener noreferrer");
      expect(linkedinLink).toHaveAttribute("rel", "noopener noreferrer");
      expect(discordLink).toHaveAttribute("rel", "noopener noreferrer");
    });

    it("each icon link has a descriptive aria-label", () => {
      render(<Footer />);
      const githubLink = screen.getByRole("link", { name: "Visit TaskFlow on GitHub" });
      const twitterLink = screen.getByRole("link", { name: "Visit TaskFlow on Twitter" });
      const linkedinLink = screen.getByRole("link", { name: "Visit TaskFlow on LinkedIn" });
      const discordLink = screen.getByRole("link", { name: "Visit TaskFlow on Discord" });

      expect(githubLink).toBeInTheDocument();
      expect(twitterLink).toBeInTheDocument();
      expect(linkedinLink).toBeInTheDocument();
      expect(discordLink).toBeInTheDocument();
    });

    it("each icon contains an SVG with consistent sizing", () => {
      const { container } = render(<Footer />);
      const socialIcons = container.querySelectorAll("a[target='_blank'] svg");

      expect(socialIcons.length).toBeGreaterThanOrEqual(4);
      socialIcons.forEach((svg) => {
        const svgClass = svg.getAttribute("class") || "";
        expect(svgClass).toContain("w-6");
        expect(svgClass).toContain("h-6");
      });
    });

    it("icons have hover effects with scale and glow", () => {
      render(<Footer />);
      const githubLink = screen.getByRole("link", { name: /GitHub/i });

      expect(githubLink.className).toContain("hover:scale-110");
      expect(githubLink.className).toContain("hover:drop-shadow-");
    });

    it("icons are centered in a flex container", () => {
      const { container } = render(<Footer />);
      const socialContainer = container.querySelector(".flex.justify-center.items-center.gap-6");

      expect(socialContainer).toBeInTheDocument();
    });

    it("social icons section has proper spacing and border", () => {
      const { container } = render(<Footer />);
      const socialContainer = container.querySelector(".flex.justify-center.items-center.gap-6");

      expect(socialContainer?.className).toContain("mt-6");
      expect(socialContainer?.className).toContain("md:mt-8");
      expect(socialContainer?.className).toContain("pt-6");
      expect(socialContainer?.className).toContain("border-t");
      expect(socialContainer?.className).toContain("border-pink-300");
      expect(socialContainer?.className).toContain("dark:border-pink-700");
    });

    it("icons have white default color with hover states", () => {
      render(<Footer />);
      const githubLink = screen.getByRole("link", { name: /GitHub/i });

      expect(githubLink.className).toContain("text-white");
      expect(githubLink.className).toContain("hover:text-pink-100");
    });

    it("icons have accessible focus states", () => {
      render(<Footer />);
      const githubLink = screen.getByRole("link", { name: /GitHub/i });

      expect(githubLink.className).toContain("focus:outline-none");
      expect(githubLink.className).toContain("focus:ring-2");
      expect(githubLink.className).toContain("focus:ring-white");
    });

    it("each icon link has correct href attributes", () => {
      render(<Footer />);
      const githubLink = screen.getByRole("link", { name: /GitHub/i });
      const twitterLink = screen.getByRole("link", { name: /Twitter/i });
      const linkedinLink = screen.getByRole("link", { name: /LinkedIn/i });
      const discordLink = screen.getByRole("link", { name: /Discord/i });

      expect(githubLink).toHaveAttribute("href", "https://github.com/taskflow");
      expect(twitterLink).toHaveAttribute("href", "https://twitter.com/taskflow");
      expect(linkedinLink).toHaveAttribute("href", "https://linkedin.com/company/taskflow");
      expect(discordLink).toHaveAttribute("href", "https://discord.gg/taskflow");
    });
  });

  // US-003: Footer Newsletter Signup
  describe("Newsletter Signup", () => {
    it("displays newsletter heading 'Stay in the loop'", () => {
      render(<Footer />);
      expect(screen.getByRole("heading", { name: "Stay in the loop" })).toBeInTheDocument();
    });

    it("displays email input with correct type and placeholder", () => {
      render(<Footer />);
      const emailInput = screen.getByPlaceholderText("Enter your email");
      expect(emailInput).toBeInTheDocument();
      expect(emailInput).toHaveAttribute("type", "email");
    });

    it("displays subscribe button", () => {
      render(<Footer />);
      expect(screen.getByRole("button", { name: "Subscribe" })).toBeInTheDocument();
    });

    it("shows error message when empty form is submitted", async () => {
      const user = userEvent.setup();
      render(<Footer />);

      const submitButton = screen.getByRole("button", { name: "Subscribe" });
      await user.click(submitButton);

      expect(screen.getByRole("alert")).toHaveTextContent("Email is required");
    });

    it("shows error message when invalid email is submitted", async () => {
      const user = userEvent.setup();
      const { container } = render(<Footer />);

      const emailInput = screen.getByPlaceholderText("Enter your email") as HTMLInputElement;
      const submitButton = screen.getByRole("button", { name: "Subscribe" });

      await user.type(emailInput, "invalid-email");
      await user.click(submitButton);

      // Wait for error to appear
      const error = await screen.findByText("Please enter a valid email address");
      expect(error).toBeInTheDocument();
    });

    it("shows success message when valid email is submitted", async () => {
      const user = userEvent.setup();
      render(<Footer />);

      const emailInput = screen.getByPlaceholderText("Enter your email");
      const submitButton = screen.getByRole("button", { name: "Subscribe" });

      await user.type(emailInput, "test@example.com");
      await user.click(submitButton);

      expect(screen.getByText("Thanks for subscribing!")).toBeInTheDocument();
      expect(screen.queryByPlaceholderText("Enter your email")).not.toBeInTheDocument();
    });

    it("clears error when user types valid email and resubmits", async () => {
      const user = userEvent.setup();
      render(<Footer />);

      const emailInput = screen.getByPlaceholderText("Enter your email") as HTMLInputElement;
      const submitButton = screen.getByRole("button", { name: "Subscribe" });

      // First submit with invalid email
      await user.type(emailInput, "invalid");
      await user.click(submitButton);

      // Wait for error to appear
      const error = await screen.findByText("Please enter a valid email address");
      expect(error).toBeInTheDocument();

      // Clear and submit with valid email
      await user.clear(emailInput);
      await user.type(emailInput, "valid@example.com");
      await user.click(submitButton);

      expect(screen.queryByText("Please enter a valid email address")).not.toBeInTheDocument();
      expect(screen.getByText("Thanks for subscribing!")).toBeInTheDocument();
    });

    it("has newsletter section with proper styling", () => {
      const { container } = render(<Footer />);
      const newsletterSection = container.querySelector(".w-full.mt-6.md\\:mt-8.pt-6.border-t");
      expect(newsletterSection).toBeInTheDocument();
    });

    it("email input has accessible attributes", () => {
      render(<Footer />);
      const emailInput = screen.getByPlaceholderText("Enter your email");
      expect(emailInput).toHaveAttribute("aria-label", "Email address");
    });

    it("email input has focus styles", () => {
      render(<Footer />);
      const emailInput = screen.getByPlaceholderText("Enter your email");
      expect(emailInput.className).toContain("focus:outline-none");
      expect(emailInput.className).toContain("focus:ring-2");
    });

    it("submit button has focus styles", () => {
      render(<Footer />);
      const submitButton = screen.getByRole("button", { name: "Subscribe" });
      expect(submitButton.className).toContain("focus:outline-none");
      expect(submitButton.className).toContain("focus:ring-2");
    });

    it("email input and button have pink theme styling", () => {
      render(<Footer />);
      const emailInput = screen.getByPlaceholderText("Enter your email");
      const submitButton = screen.getByRole("button", { name: "Subscribe" });

      expect(emailInput.className).toContain("bg-white");
      expect(emailInput.className).toContain("dark:bg-pink-950");
      expect(submitButton.className).toContain("bg-pink-700");
      expect(submitButton.className).toContain("dark:bg-pink-600");
    });

    it("newsletter section has dark mode border styling", () => {
      const { container } = render(<Footer />);
      const newsletterSection = container.querySelector(".border-pink-300.dark\\:border-pink-700");
      expect(newsletterSection).toBeInTheDocument();
    });
  });

  // US-004: Footer Back-to-Top Button
  describe("Back to Top Button", () => {
    it("renders Back to Top button with text label", () => {
      render(<Footer />);
      const backToTopButton = screen.getByRole("button", { name: "Scroll to top" });
      expect(backToTopButton).toBeInTheDocument();
      expect(backToTopButton).toHaveTextContent("Back to Top");
    });

    it("button has correct aria-label", () => {
      render(<Footer />);
      const backToTopButton = screen.getByRole("button", { name: "Scroll to top" });
      expect(backToTopButton).toHaveAttribute("aria-label", "Scroll to top");
    });

    it("button is a button element", () => {
      render(<Footer />);
      const backToTopButton = screen.getByRole("button", { name: "Scroll to top" });
      expect(backToTopButton.tagName).toBe("BUTTON");
    });

    it("clicking button calls window.scrollTo with smooth behavior", async () => {
      const user = userEvent.setup();
      const scrollToMock = vi.fn();
      window.scrollTo = scrollToMock;

      render(<Footer />);
      const backToTopButton = screen.getByRole("button", { name: "Scroll to top" });
      await user.click(backToTopButton);

      expect(scrollToMock).toHaveBeenCalledWith({ top: 0, behavior: "smooth" });
    });

    it("button contains SVG arrow icon", () => {
      const { container } = render(<Footer />);
      const backToTopButton = screen.getByRole("button", { name: "Scroll to top" });
      const svg = backToTopButton.querySelector("svg");
      expect(svg).toBeInTheDocument();
    });

    it("button has pill/rounded shape styling", () => {
      render(<Footer />);
      const backToTopButton = screen.getByRole("button", { name: "Scroll to top" });
      expect(backToTopButton.className).toContain("rounded-full");
    });

    it("button has contrasting colors against pink footer", () => {
      render(<Footer />);
      const backToTopButton = screen.getByRole("button", { name: "Scroll to top" });
      expect(backToTopButton.className).toContain("bg-white");
      expect(backToTopButton.className).toContain("text-pink-600");
    });

    it("button has dark mode color adjustments", () => {
      render(<Footer />);
      const backToTopButton = screen.getByRole("button", { name: "Scroll to top" });
      expect(backToTopButton.className).toContain("dark:bg-pink-200");
      expect(backToTopButton.className).toContain("dark:text-pink-900");
    });

    it("button has hover animation effects", () => {
      render(<Footer />);
      const backToTopButton = screen.getByRole("button", { name: "Scroll to top" });
      expect(backToTopButton.className).toContain("hover:scale-105");
      expect(backToTopButton.className).toContain("hover:-translate-y-1");
      expect(backToTopButton.className).toContain("hover:bg-pink-200");
    });

    it("button has accessible focus ring", () => {
      render(<Footer />);
      const backToTopButton = screen.getByRole("button", { name: "Scroll to top" });
      expect(backToTopButton.className).toContain("focus:outline-none");
      expect(backToTopButton.className).toContain("focus:ring-2");
      expect(backToTopButton.className).toContain("focus:ring-white");
    });

    it("button meets minimum touch target size", () => {
      render(<Footer />);
      const backToTopButton = screen.getByRole("button", { name: "Scroll to top" });
      expect(backToTopButton.className).toContain("min-h-[44px]");
    });

    it("button is centered on mobile", () => {
      const { container } = render(<Footer />);
      const buttonContainer = container.querySelector(".flex.justify-center");
      expect(buttonContainer).toBeInTheDocument();
    });
  });
});
