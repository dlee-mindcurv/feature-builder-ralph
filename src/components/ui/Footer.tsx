"use client";

import Link from "next/link";
import { useState, FormEvent } from "react";

// Wave SVG hoisted outside component for performance (rendering-hoist-jsx)
const WaveSVG = (
  <svg
    className="absolute top-0 left-0 w-full h-12 transform -translate-y-full"
    viewBox="0 0 1200 120"
    preserveAspectRatio="none"
    aria-hidden="true"
  >
    <path
      d="M0,0V46.29c47.79,22.2,103.59,32.17,158,28,70.36-5.37,136.33-33.31,206.8-37.5C438.64,32.43,512.34,53.67,583,72.05c69.27,18,138.3,24.88,209.4,13.08,36.15-6,69.85-17.84,104.45-29.34C989.49,25,1113-14.29,1200,52.47V0Z"
      fill="currentColor"
      className="text-pink-400 dark:text-pink-900"
    />
  </svg>
);

// Social media icon data hoisted outside component (rendering-hoist-jsx)
const socialLinks = [
  {
    name: "GitHub",
    href: "https://github.com/taskflow",
    ariaLabel: "Visit TaskFlow on GitHub",
    icon: (
      <svg
        className="w-6 h-6"
        fill="currentColor"
        viewBox="0 0 24 24"
        aria-hidden="true"
      >
        <path
          fillRule="evenodd"
          d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
          clipRule="evenodd"
        />
      </svg>
    ),
  },
  {
    name: "Twitter",
    href: "https://twitter.com/taskflow",
    ariaLabel: "Visit TaskFlow on Twitter",
    icon: (
      <svg
        className="w-6 h-6"
        fill="currentColor"
        viewBox="0 0 24 24"
        aria-hidden="true"
      >
        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
      </svg>
    ),
  },
  {
    name: "LinkedIn",
    href: "https://linkedin.com/company/taskflow",
    ariaLabel: "Visit TaskFlow on LinkedIn",
    icon: (
      <svg
        className="w-6 h-6"
        fill="currentColor"
        viewBox="0 0 24 24"
        aria-hidden="true"
      >
        <path
          fillRule="evenodd"
          d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"
          clipRule="evenodd"
        />
      </svg>
    ),
  },
  {
    name: "Discord",
    href: "https://discord.gg/taskflow",
    ariaLabel: "Visit TaskFlow on Discord",
    icon: (
      <svg
        className="w-6 h-6"
        fill="currentColor"
        viewBox="0 0 24 24"
        aria-hidden="true"
      >
        <path d="M20.317 4.37a19.791 19.791 0 00-4.885-1.515.074.074 0 00-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 00-5.487 0 12.64 12.64 0 00-.617-1.25.077.077 0 00-.079-.037A19.736 19.736 0 003.677 4.37a.07.07 0 00-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 00.031.057 19.9 19.9 0 005.993 3.03.078.078 0 00.084-.028 14.09 14.09 0 001.226-1.994.076.076 0 00-.041-.106 13.107 13.107 0 01-1.872-.892.077.077 0 01-.008-.128 10.2 10.2 0 00.372-.292.074.074 0 01.077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 01.078.01c.12.098.246.198.373.292a.077.077 0 01-.006.127 12.299 12.299 0 01-1.873.892.077.077 0 00-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 00.084.028 19.839 19.839 0 006.002-3.03.077.077 0 00.032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 00-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z" />
      </svg>
    ),
  },
];

// Up arrow icon hoisted outside component (rendering-hoist-jsx)
const UpArrowIcon = (
  <svg
    className="w-5 h-5"
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
    aria-hidden="true"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M5 10l7-7m0 0l7 7m-7-7v18"
    />
  </svg>
);

export default function Footer() {
  const currentYear = 2026;
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);

  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");

    if (!email.trim()) {
      setError("Email is required");
      return;
    }

    if (!validateEmail(email)) {
      setError("Please enter a valid email address");
      return;
    }

    // Successful submission
    setIsSubmitted(true);
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <footer className="relative mt-auto bg-gradient-to-r from-pink-400 via-pink-500 to-pink-600 dark:from-pink-900 dark:via-pink-800 dark:to-pink-900 text-white">
      {WaveSVG}

      <div className="container mx-auto px-4 py-8 md:py-12">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6 md:gap-8">
          {/* Brand Section */}
          <div className="text-center md:text-left">
            <h2 className="text-2xl md:text-3xl font-bold tracking-wide animate-pulse">
              TaskFlow
            </h2>
            <p className="text-sm mt-1 text-pink-100 dark:text-pink-300">
              &copy; {currentYear} TaskFlow
            </p>
          </div>

          {/* Navigation Links */}
          <nav className="flex flex-col md:flex-row items-center gap-4 md:gap-6">
            <Link
              href="/"
              className="text-lg font-medium hover:text-pink-100 hover:scale-110 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-pink-500 rounded px-2 py-1 transition-all duration-200"
            >
              Home
            </Link>
            <Link
              href="/about"
              className="text-lg font-medium hover:text-pink-100 hover:scale-110 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-pink-500 rounded px-2 py-1 transition-all duration-200"
            >
              About
            </Link>
            <Link
              href="/privacy"
              className="text-lg font-medium hover:text-pink-100 hover:scale-110 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-pink-500 rounded px-2 py-1 transition-all duration-200"
            >
              Privacy
            </Link>
          </nav>
        </div>

        {/* Social Media Icons */}
        <div className="flex justify-center items-center gap-6 mt-6 md:mt-8 pt-6 border-t border-pink-300 dark:border-pink-700">
          {socialLinks.map((social) => (
            <a
              key={social.name}
              href={social.href}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={social.ariaLabel}
              className="text-white hover:text-pink-100 hover:scale-110 hover:drop-shadow-[0_0_8px_rgba(255,255,255,0.8)] focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-pink-500 rounded transition-all duration-200"
            >
              {social.icon}
            </a>
          ))}
        </div>

        {/* Newsletter Signup Section */}
        <div className="w-full mt-6 md:mt-8 pt-6 border-t border-pink-300 dark:border-pink-700">
          <div className="max-w-md mx-auto text-center">
            <h3 className="text-xl md:text-2xl font-bold mb-3">
              Stay in the loop
            </h3>
            {isSubmitted ? (
              <div className="text-pink-100 dark:text-pink-200 font-medium text-lg">
                Thanks for subscribing!
              </div>
            ) : (
              <form onSubmit={handleSubmit} noValidate className="space-y-3">
                <div className="flex flex-col sm:flex-row gap-2">
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email"
                    className="flex-1 px-4 py-2 rounded-md bg-white dark:bg-pink-950 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-pink-300 border-2 border-transparent focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-pink-500"
                    aria-label="Email address"
                    aria-invalid={error ? "true" : "false"}
                    aria-describedby={error ? "email-error" : undefined}
                  />
                  <button
                    type="submit"
                    className="px-6 py-2 bg-pink-700 dark:bg-pink-600 hover:bg-pink-800 dark:hover:bg-pink-700 text-white font-medium rounded-md focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-pink-500 transition-colors duration-200"
                  >
                    Subscribe
                  </button>
                </div>
                {error ? (
                  <p
                    id="email-error"
                    className="text-sm text-pink-100 dark:text-pink-200 font-medium"
                    role="alert"
                  >
                    {error}
                  </p>
                ) : null}
              </form>
            )}
          </div>
        </div>

        {/* Back to Top Button */}
        <div className="flex justify-center mt-6 md:mt-8">
          <button
            onClick={scrollToTop}
            aria-label="Scroll to top"
            className="flex items-center gap-2 px-6 py-3 min-h-[44px] bg-white dark:bg-pink-200 text-pink-600 dark:text-pink-900 font-medium rounded-full hover:bg-pink-200 dark:hover:bg-white hover:scale-105 hover:-translate-y-1 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-pink-500 transition-all duration-200 shadow-lg"
          >
            {UpArrowIcon}
            <span>Back to Top</span>
          </button>
        </div>
      </div>
    </footer>
  );
}
