"use client";

import Link from "next/link";
import { useAuth } from "@/lib/auth-context";
import { useState } from "react";

const NAV_LINKS = [
  { href: "/properties?purpose=SALE", label: "Buy" },
  { href: "/properties?purpose=RENT", label: "Rent" },
  { href: "/properties?investment=true", label: "Invest" },
  { href: "/properties", label: "Properties" },
];

export default function Navbar() {
  const { user, logout } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <nav className="bg-white shadow-sm border-b border-gray-100 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link href="/" className="flex items-center space-x-2">
              <svg className="w-9 h-9" viewBox="0 0 44 44" aria-hidden="true">
                <rect width="44" height="44" rx="12" fill="#12284c" />
                <path
                  d="M12 24 L22 14 L32 24 M16 22 V32 H28 V22"
                  fill="none"
                  stroke="#ff8a65"
                  strokeWidth="3"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              <span className="text-xl font-extrabold text-primary-700 hidden sm:block">RealEstate</span>
            </Link>
          </div>

          <div className="hidden md:flex items-center space-x-4">
            {NAV_LINKS.map((l) => (
              <Link
                key={l.label}
                href={l.href}
                className="text-gray-600 hover:text-primary-600 px-3 py-2 text-sm font-medium transition-colors"
              >
                {l.label}
              </Link>
            ))}
            {user ? (
              <>
                <Link
                  href="/dashboard"
                  className="text-gray-600 hover:text-primary-600 px-3 py-2 text-sm font-medium transition-colors"
                >
                  Dashboard
                </Link>
                <Link
                  href="/dashboard/new"
                  className="bg-accent-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-accent-700 transition-colors"
                >
                  + Add Property
                </Link>
                <div className="flex items-center space-x-3 pl-3 border-l border-gray-200">
                  <span className="text-sm text-gray-500">{user.name}</span>
                  <button
                    onClick={logout}
                    className="text-sm text-gray-500 hover:text-red-600 transition-colors"
                  >
                    Logout
                  </button>
                </div>
              </>
            ) : (
              <div className="flex items-center space-x-3">
                <Link
                  href="/login"
                  className="text-gray-600 hover:text-primary-600 px-3 py-2 text-sm font-medium transition-colors"
                >
                  Login
                </Link>
                <Link
                  href="/register"
                  className="bg-primary-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-primary-700 transition-colors"
                >
                  Register
                </Link>
              </div>
            )}
          </div>

          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="md:hidden flex items-center p-2"
            aria-label={mobileOpen ? "Close menu" : "Open menu"}
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {mobileOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>
      </div>

      {mobileOpen && (
        <div className="md:hidden border-t border-gray-100 bg-white">
          <div className="px-4 py-3 space-y-2">
            {NAV_LINKS.map((l) => (
              <Link
                key={l.label}
                href={l.href}
                className="block px-3 py-2 text-gray-600 hover:bg-gray-50 rounded-lg"
                onClick={() => setMobileOpen(false)}
              >
                {l.label}
              </Link>
            ))}
            {user ? (
              <>
                <Link
                  href="/dashboard"
                  className="block px-3 py-2 text-gray-600 hover:bg-gray-50 rounded-lg"
                  onClick={() => setMobileOpen(false)}
                >
                  Dashboard
                </Link>
                <Link
                  href="/dashboard/new"
                  className="block px-3 py-2 text-accent-700 font-medium hover:bg-gray-50 rounded-lg"
                  onClick={() => setMobileOpen(false)}
                >
                  + Add Property
                </Link>
                <button
                  onClick={() => { logout(); setMobileOpen(false); }}
                  className="block w-full text-left px-3 py-2 text-red-600 hover:bg-gray-50 rounded-lg"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link
                  href="/login"
                  className="block px-3 py-2 text-gray-600 hover:bg-gray-50 rounded-lg"
                  onClick={() => setMobileOpen(false)}
                >
                  Login
                </Link>
                <Link
                  href="/register"
                  className="block px-3 py-2 text-primary-600 font-medium hover:bg-gray-50 rounded-lg"
                  onClick={() => setMobileOpen(false)}
                >
                  Register
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}