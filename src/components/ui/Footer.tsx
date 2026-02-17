import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="relative bg-gradient-to-r from-pink-400 to-pink-600 dark:from-pink-900 dark:to-pink-800 text-white mt-auto">
      {/* Funky wave SVG decoration at the top */}
      <svg
        className="absolute top-0 left-0 w-full h-8 -mt-8"
        viewBox="0 0 1200 120"
        preserveAspectRatio="none"
        aria-hidden="true"
      >
        <path
          d="M0,0 C150,80 350,80 600,40 C850,0 1050,0 1200,40 L1200,120 L0,120 Z"
          className="fill-pink-400 dark:fill-pink-900"
        />
      </svg>

      <div className="container mx-auto px-4 py-8">
        {/* Mobile: vertical layout, Desktop: horizontal layout */}
        <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-6 text-center md:text-left">
          {/* Brand section */}
          <div className="space-y-2">
            <h2 className="text-2xl font-bold tracking-wide">TaskFlow</h2>
            <p className="text-pink-100 dark:text-pink-200 text-sm">
              &copy; TaskFlow 2026
            </p>
          </div>

          {/* Navigation links */}
          <nav className="flex flex-col md:flex-row gap-4 md:gap-6" aria-label="Footer navigation">
            <Link
              href="/"
              className="text-white hover:text-pink-100 dark:hover:text-pink-300 focus:text-pink-100 dark:focus:text-pink-300 focus:outline-none focus:underline transition-colors duration-200 font-medium"
            >
              Home
            </Link>
            <Link
              href="/about"
              className="text-white hover:text-pink-100 dark:hover:text-pink-300 focus:text-pink-100 dark:focus:text-pink-300 focus:outline-none focus:underline transition-colors duration-200 font-medium"
            >
              About
            </Link>
            <Link
              href="/privacy"
              className="text-white hover:text-pink-100 dark:hover:text-pink-300 focus:text-pink-100 dark:focus:text-pink-300 focus:outline-none focus:underline transition-colors duration-200 font-medium"
            >
              Privacy
            </Link>
          </nav>
        </div>
      </div>
    </footer>
  );
}
