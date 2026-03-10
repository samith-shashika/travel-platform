"use client";
import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { useState } from "react";

export default function Navbar() {
  const { data: session } = useSession();
  const [open, setOpen] = useState(false);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-black/20 backdrop-blur-md border-b border-white/10">
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <span className="text-2xl">✈️</span>
          <span className="text-xl font-black text-white tracking-tight">Wandr</span>
        </Link>

        {/* Desktop */}
        <div className="hidden md:flex items-center gap-8">
          <Link href="/feed" className="text-white/80 hover:text-white text-sm font-medium transition-colors">
            Explore
          </Link>
          {session ? (
            <>
              <Link href="/create" className="text-white/80 hover:text-white text-sm font-medium transition-colors">
                List Experience
              </Link>
              <span className="text-white/60 text-sm">Hi, {session.user.name.split(" ")[0]}</span>
              <button
                onClick={() => signOut({ callbackUrl: "/" })}
                className="bg-white/10 hover:bg-white/20 text-white text-sm font-medium px-4 py-2 rounded-full transition-colors border border-white/20 cursor-pointer"
              >
                Sign Out
              </button>
            </>
          ) : (
            <>
              <Link href="/login" className="text-white/80 hover:text-white text-sm font-medium transition-colors">
                Sign In
              </Link>
              <Link href="/register" className="bg-amber-400 hover:bg-amber-300 text-black text-sm font-bold px-5 py-2 rounded-full transition-colors">
                Get Started
              </Link>
            </>
          )}
        </div>

        {/* Mobile toggle */}
        <button onClick={() => setOpen(!open)} className="md:hidden text-white p-2">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            {open
              ? <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              : <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            }
          </svg>
        </button>
      </div>

      {/* Mobile menu */}
      {open && (
        <div className="md:hidden bg-black/90 backdrop-blur-md border-t border-white/10 px-6 py-4 space-y-3">
          <Link href="/feed" onClick={() => setOpen(false)} className="block text-white/80 hover:text-white py-2 text-sm">Explore</Link>
          {session ? (
            <>
              <Link href="/create" onClick={() => setOpen(false)} className="block text-white/80 hover:text-white py-2 text-sm">List Experience</Link>
              <button onClick={() => { signOut({ callbackUrl: "/" }); setOpen(false); }} className="block text-red-400 py-2 text-sm cursor-pointer">Sign Out</button>
            </>
          ) : (
            <>
              <Link href="/login" onClick={() => setOpen(false)} className="block text-white/80 hover:text-white py-2 text-sm">Sign In</Link>
              <Link href="/register" onClick={() => setOpen(false)} className="block text-amber-400 font-bold py-2 text-sm">Get Started</Link>
            </>
          )}
        </div>
      )}
    </nav>
  );
}