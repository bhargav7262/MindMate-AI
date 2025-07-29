// src/app/page.tsx
import Link from "next/link";

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-600 to-indigo-900 text-white flex flex-col items-center justify-center px-4 text-center">
      <h1 className="text-5xl font-bold mb-4">Welcome to AIMed++</h1>
      <p className="text-xl mb-8 max-w-2xl">
        Your AI Mental Health Companion — here to support you emotionally, listen without judgment, and guide you through tough times.
      </p>
      <Link
        href="/chat"
        className="bg-white text-indigo-700 px-6 py-3 rounded-full font-semibold shadow-lg hover:bg-indigo-100 transition"
      >
        Get Started
      </Link>
    </main>
  );
}
