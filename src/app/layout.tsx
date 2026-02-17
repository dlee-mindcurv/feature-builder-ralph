import type { Metadata } from "next";
import { ThemeProvider } from "@/context/ThemeContext";
import { TaskProvider } from "@/context/TaskContext";
import { Footer } from "@/components/ui/Footer";
import "./globals.css";

export const metadata: Metadata = {
  title: "TaskFlow",
  description: "A simple task management application",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="min-h-screen antialiased flex flex-col">
        <ThemeProvider>
          <TaskProvider>
            <div className="flex-1">{children}</div>
            <Footer />
          </TaskProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
