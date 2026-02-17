import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import { Footer } from "@/components/ui/Footer";

describe("Footer Newsletter Signup (US-003)", () => {
  it("displays a newsletter signup section with a heading", () => {
    render(<Footer />);
    expect(screen.getByText(/stay in the loop/i)).toBeInTheDocument();
  });

  it("contains an email input with type='email'", () => {
    render(<Footer />);
    const emailInput = screen.getByRole("textbox", { name: /email address/i });
    expect(emailInput).toHaveAttribute("type", "email");
  });

  it("email input has placeholder text", () => {
    render(<Footer />);
    const emailInput = screen.getByRole("textbox", { name: /email address/i });
    expect(emailInput).toHaveAttribute("placeholder");
    const placeholder = emailInput.getAttribute("placeholder");
    expect(placeholder).toBeTruthy();
    expect(placeholder!.length).toBeGreaterThan(0);
  });

  it("contains a submit button", () => {
    render(<Footer />);
    expect(screen.getByRole("button", { name: /subscribe/i })).toBeInTheDocument();
  });

  it("submit button is of type submit", () => {
    render(<Footer />);
    const submitButton = screen.getByRole("button", { name: /subscribe/i });
    expect(submitButton).toHaveAttribute("type", "submit");
  });

  it("shows an inline error for empty email submission without page reload", async () => {
    const user = userEvent.setup();
    render(<Footer />);
    const submitButton = screen.getByRole("button", { name: /subscribe/i });
    await user.click(submitButton);
    const errorMessage = screen.getByRole("alert");
    expect(errorMessage).toBeInTheDocument();
    expect(errorMessage.textContent).toBeTruthy();
  });

  it("shows an inline error for invalid email format", async () => {
    const user = userEvent.setup();
    render(<Footer />);
    const emailInput = screen.getByRole("textbox", { name: /email address/i });
    await user.type(emailInput, "notanemail");
    const submitButton = screen.getByRole("button", { name: /subscribe/i });
    await user.click(submitButton);
    const errorMessage = screen.getByRole("alert");
    expect(errorMessage).toBeInTheDocument();
    expect(errorMessage.textContent).toMatch(/valid email/i);
  });

  it("shows error message for empty email", async () => {
    const user = userEvent.setup();
    render(<Footer />);
    const submitButton = screen.getByRole("button", { name: /subscribe/i });
    await user.click(submitButton);
    const errorMessage = screen.getByRole("alert");
    expect(errorMessage.textContent).toMatch(/email/i);
  });

  it("does not show error initially", () => {
    render(<Footer />);
    expect(screen.queryByRole("alert")).not.toBeInTheDocument();
  });

  it("displays a confirmation message after successful submission", async () => {
    const user = userEvent.setup();
    render(<Footer />);
    const emailInput = screen.getByRole("textbox", { name: /email address/i });
    await user.type(emailInput, "test@example.com");
    const submitButton = screen.getByRole("button", { name: /subscribe/i });
    await user.click(submitButton);
    expect(screen.getByText(/thanks for subscribing/i)).toBeInTheDocument();
  });

  it("hides the form input after successful submission", async () => {
    const user = userEvent.setup();
    render(<Footer />);
    const emailInput = screen.getByRole("textbox", { name: /email address/i });
    await user.type(emailInput, "user@domain.com");
    const submitButton = screen.getByRole("button", { name: /subscribe/i });
    await user.click(submitButton);
    expect(screen.queryByRole("textbox", { name: /email address/i })).not.toBeInTheDocument();
    expect(screen.queryByRole("button", { name: /subscribe/i })).not.toBeInTheDocument();
  });

  it("shows a status role element on successful submission", async () => {
    const user = userEvent.setup();
    render(<Footer />);
    const emailInput = screen.getByRole("textbox", { name: /email address/i });
    await user.type(emailInput, "valid@email.com");
    const submitButton = screen.getByRole("button", { name: /subscribe/i });
    await user.click(submitButton);
    expect(screen.getByRole("status")).toBeInTheDocument();
  });

  it("the form has an accessible label", () => {
    render(<Footer />);
    expect(screen.getByRole("form", { name: /newsletter signup/i })).toBeInTheDocument();
  });

  it("submit button has a visible focus ring class", () => {
    render(<Footer />);
    const submitButton = screen.getByRole("button", { name: /subscribe/i });
    expect(submitButton.className).toMatch(/focus:ring/);
  });

  it("email input has a focus style class", () => {
    render(<Footer />);
    const emailInput = screen.getByRole("textbox", { name: /email address/i });
    expect(emailInput.className).toMatch(/focus:/);
  });

  it("email input has aria-invalid attribute set to false by default", () => {
    render(<Footer />);
    const emailInput = screen.getByRole("textbox", { name: /email address/i });
    expect(emailInput).toHaveAttribute("aria-invalid", "false");
  });

  it("email input has aria-invalid set to true when there is an error", async () => {
    const user = userEvent.setup();
    render(<Footer />);
    const submitButton = screen.getByRole("button", { name: /subscribe/i });
    await user.click(submitButton);
    const emailInput = screen.getByRole("textbox", { name: /email address/i });
    expect(emailInput).toHaveAttribute("aria-invalid", "true");
  });

  it("email input is linked to error message via aria-describedby on error", async () => {
    const user = userEvent.setup();
    render(<Footer />);
    const submitButton = screen.getByRole("button", { name: /subscribe/i });
    await user.click(submitButton);
    const emailInput = screen.getByRole("textbox", { name: /email address/i });
    const describedById = emailInput.getAttribute("aria-describedby");
    expect(describedById).toBeTruthy();
    const errorElement = document.getElementById(describedById!);
    expect(errorElement).toBeInTheDocument();
  });

  it("newsletter section is wrapped in a full-width container", () => {
    const { container } = render(<Footer />);
    const newsletterWrapper = container.querySelector(".w-full");
    expect(newsletterWrapper).toBeInTheDocument();
  });

  it("newsletter section appears below social icons in DOM order", () => {
    const { container } = render(<Footer />);
    const socialLink = container.querySelector('a[target="_blank"]');
    const form = container.querySelector('form[aria-label="Newsletter signup"]');
    expect(socialLink).toBeInTheDocument();
    expect(form).toBeInTheDocument();
    // Newsletter section should come after social icons in DOM
    const socialPosition = socialLink!.compareDocumentPosition(form!);
    // DOCUMENT_POSITION_FOLLOWING = 4 means form comes after socialLink
    expect(socialPosition & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy();
  });

  it("submit button has dark mode styling classes", () => {
    render(<Footer />);
    const submitButton = screen.getByRole("button", { name: /subscribe/i });
    expect(submitButton.className).toMatch(/dark:/);
  });

  it("email input has dark mode styling classes", () => {
    render(<Footer />);
    const emailInput = screen.getByRole("textbox", { name: /email address/i });
    expect(emailInput.className).toMatch(/dark:/);
  });

  it("clears error when user starts typing after an error", async () => {
    const user = userEvent.setup();
    render(<Footer />);
    const submitButton = screen.getByRole("button", { name: /subscribe/i });
    await user.click(submitButton);
    expect(screen.getByRole("alert")).toBeInTheDocument();
    const emailInput = screen.getByRole("textbox", { name: /email address/i });
    await user.type(emailInput, "a");
    expect(screen.queryByRole("alert")).not.toBeInTheDocument();
  });

  it("does not submit on invalid email (no confirmation message)", async () => {
    const user = userEvent.setup();
    render(<Footer />);
    const emailInput = screen.getByRole("textbox", { name: /email address/i });
    await user.type(emailInput, "bad-email");
    const submitButton = screen.getByRole("button", { name: /subscribe/i });
    await user.click(submitButton);
    expect(screen.queryByText(/thanks for subscribing/i)).not.toBeInTheDocument();
  });
});
