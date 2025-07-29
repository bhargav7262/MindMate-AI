import './globals.css';
import Link from 'next/link';
import { ClerkProvider } from '@clerk/nextjs';
import { SignedIn, SignedOut, UserButton, SignInButton } from '@clerk/nextjs';

export const metadata = {
  title: 'AIMed++',
  description: 'Your AI Mental Health Companion',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body>
          <header className="flex items-center justify-between px-6 py-4 shadow-md" style={{ background: 'var(--background)', color: 'var(--foreground)' }}>
            <h1 className="text-xl font-bold">AIMed++</h1>
            <nav className="space-x-4 text-sm font-medium flex items-center">
              <Link href="/chat" className="hover:underline">Chat</Link>
              <Link href="/journal" className="hover:underline">Journal</Link>
              <Link href="/resources" className="hover:underline">Resources</Link>
              <Link href="/profile" className="hover:underline">Profile</Link>

              {/* Show Sign Out + Profile when signed in */}
              <SignedIn>
                <UserButton afterSignOutUrl="/" />
              </SignedIn>

              {/* Show Sign In button when signed out */}
              <SignedOut>
                <SignInButton mode="modal">
                  <button className="bg-blue-600 text-white px-4 py-1 rounded hover:bg-blue-700 transition">Sign In</button>
                </SignInButton>
              </SignedOut>
            </nav>
          </header>
          <main className="p-6">{children}</main>
        </body>
      </html>
    </ClerkProvider>
  );
}
