// src/components/Navbar.tsx
import Link from "next/link";

export default function Navbar() {
  return (
    <nav className="bg-indigo-800 text-white px-6 py-4 flex justify-between items-center shadow-md">
      <Link href="/" className="text-2xl font-bold">AIMed++</Link>
      <div className="space-x-4">
        <Link href="/" className="hover:underline">Home</Link>
        <Link href="/chat" className="hover:underline">Chat</Link>
        <Link href="/about" className="hover:underline">About</Link>
      </div>
    </nav>
  );
}
