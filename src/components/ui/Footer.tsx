"use client";

import Link from "next/link";
import { useState } from "react";
import { DigitalClock } from "./DigitalClock";

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About" },
  { href: "/privacy", label: "Privacy" },
];

const socialLinks = [
  {
    href: "https://github.com/taskflow",
    label: "Visit TaskFlow on GitHub",
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="currentColor"
        aria-hidden="true"
      >
        <path d="M12 0C5.374 0 0 5.373 0 12c0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0 1 12 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z" />
      </svg>
    ),
  },
  {
    href: "https://twitter.com/taskflow",
    label: "Visit TaskFlow on Twitter/X",
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="currentColor"
        aria-hidden="true"
      >
        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
      </svg>
    ),
  },
  {
    href: "https://linkedin.com/company/taskflow",
    label: "Visit TaskFlow on LinkedIn",
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="currentColor"
        aria-hidden="true"
      >
        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
      </svg>
    ),
  },
  {
    href: "https://discord.gg/taskflow",
    label: "Visit TaskFlow on Discord",
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="currentColor"
        aria-hidden="true"
      >
        <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057.1 18.079.11 18.1.127 18.114a19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028 14.09 14.09 0 0 0 1.226-1.994.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z" />
      </svg>
    ),
  },
];

function NewsletterSignup() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [submitted, setSubmitted] = useState(false);

  function validateEmail(value: string): boolean {
    if (!value.trim()) {
      setError("Please enter your email address.");
      return false;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(value.trim())) {
      setError("Please enter a valid email address.");
      return false;
    }
    return true;
  }

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");
    if (validateEmail(email)) {
      setSubmitted(true);
    }
  }

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    setEmail(e.target.value);
    if (error) {
      setError("");
    }
  }

  if (submitted) {
    return (
      <p
        role="status"
        className="text-center md:text-left text-white font-semibold text-lg"
      >
        Thanks for subscribing!
      </p>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      noValidate
      className="w-full"
      aria-label="Newsletter signup"
    >
      <p className="mb-3 text-white font-bold text-lg tracking-wide">
        Stay in the loop
      </p>
      <div className="flex flex-col sm:flex-row gap-2 w-full">
        <div className="flex-1">
          <label htmlFor="newsletter-email" className="sr-only">
            Email address
          </label>
          <input
            id="newsletter-email"
            type="email"
            name="email"
            value={email}
            onChange={handleChange}
            placeholder="Enter your email"
            aria-describedby={error ? "newsletter-error" : undefined}
            aria-invalid={error ? "true" : "false"}
            className="w-full px-4 py-2 rounded-lg text-gray-900 bg-white placeholder-gray-400 border-2 border-transparent focus:outline-none focus:border-pink-200 dark:bg-pink-950 dark:text-white dark:placeholder-pink-300 dark:focus:border-pink-400 transition-colors duration-200"
          />
        </div>
        <button
          type="submit"
          className="px-5 py-2 rounded-lg bg-pink-700 hover:bg-pink-800 dark:bg-pink-600 dark:hover:bg-pink-500 text-white font-semibold transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-pink-500 dark:focus:ring-offset-pink-900 whitespace-nowrap"
        >
          Subscribe
        </button>
      </div>
      {error && (
        <p
          id="newsletter-error"
          role="alert"
          className="mt-2 text-sm text-pink-100 dark:text-pink-200 font-medium"
        >
          {error}
        </p>
      )}
    </form>
  );
}

export function Footer() {
  return (
    <footer className="relative bg-gradient-to-r from-pink-400 to-pink-600 dark:from-pink-900 dark:to-pink-800 text-white">
      {/* Wave SVG top border */}
      <div className="absolute top-0 left-0 w-full overflow-hidden leading-none -translate-y-full">
        <svg
          aria-hidden="true"
          viewBox="0 0 1200 60"
          preserveAspectRatio="none"
          className="w-full h-12 fill-pink-400 dark:fill-pink-900"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d="M0,30 C300,60 900,0 1200,30 L1200,60 L0,60 Z" />
        </svg>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-10">
        {/* Desktop: horizontal layout; Mobile: vertical centered */}
        <div className="flex flex-col items-center gap-6 md:flex-row md:justify-between md:items-center">
          {/* Brand & Copyright */}
          <div className="text-center md:text-left">
            <p className="text-2xl font-extrabold tracking-widest uppercase drop-shadow-md">
              TaskFlow
            </p>
            <p className="mt-1 text-sm text-pink-100 dark:text-pink-300">
              &copy; TaskFlow 2026
            </p>
          </div>

          {/* Navigation links */}
          <nav aria-label="Footer navigation">
            <ul className="flex flex-col items-center gap-3 md:flex-row md:gap-6">
              {navLinks.map(({ href, label }) => (
                <li key={href}>
                  <Link
                    href={href}
                    className="text-white font-semibold underline-offset-4 hover:underline hover:text-pink-100 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-pink-500 dark:focus:ring-offset-pink-900 rounded transition-colors duration-200"
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>

        {/* Social Media Icons — centered on mobile, appears below nav links */}
        <div className="mt-6 flex justify-center gap-4">
          {socialLinks.map(({ href, label, icon }) => (
            <a
              key={href}
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={label}
              className="text-white dark:text-pink-200 transition-transform duration-200 hover:scale-125 hover:drop-shadow-[0_0_8px_rgba(255,182,193,0.9)] focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-pink-500 dark:focus:ring-offset-pink-900 rounded"
            >
              {icon}
            </a>
          ))}
        </div>

        {/* Newsletter Signup — full width on mobile, below social icons */}
        <div className="mt-8 w-full">
          <NewsletterSignup />
        </div>

        {/* Back to Top Button */}
        <div className="mt-8 flex justify-center">
          <button
            type="button"
            aria-label="Scroll to top"
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            className="flex items-center gap-2 px-6 py-3 min-h-[44px] min-w-[44px] rounded-full bg-white dark:bg-pink-950 text-pink-600 dark:text-pink-200 font-semibold shadow-md transition-all duration-200 hover:-translate-y-1 hover:shadow-lg hover:bg-pink-100 dark:hover:bg-pink-900 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-pink-500 dark:focus:ring-offset-pink-900 active:translate-y-0"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <path d="M12 19V5M5 12l7-7 7 7" />
            </svg>
            Back to Top
          </button>
        </div>

        {/* Digital Clock */}
        <div className="mt-8">
          <DigitalClock />
        </div>

        {/* Decorative dots pattern */}
        <div className="mt-8 flex justify-center gap-2" aria-hidden="true">
          {Array.from({ length: 7 }).map((_, i) => (
            <span
              key={i}
              className="inline-block w-2 h-2 rounded-full bg-pink-200 dark:bg-pink-700 opacity-75"
              style={{ animationDelay: `${i * 0.1}s` }}
            />
          ))}
        </div>
      </div>
    </footer>
  );
}
