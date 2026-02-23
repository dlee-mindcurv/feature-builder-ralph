import { Logo } from "@/components/ui/Logo";
import { TurtleSvg } from "@/components/ui/TurtleSvg";

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col">
      {/* Header — US-003 will replace this with a full navigation bar */}
      <header className="border-b border-gray-200 px-6 py-4 dark:border-gray-800">
        <Logo size="md" />
      </header>

      <main className="flex-1 px-6 py-8">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          Your Tasks
        </h1>
        <p className="mt-2 text-gray-500 dark:text-gray-400">
          Get started by adding your first task.
        </p>
        <div className="mt-4">
          <TurtleSvg />
        </div>
      </main>
    </div>
  );
}
