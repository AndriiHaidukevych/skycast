"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState, useRef, useEffect } from "react";
import { useSession, signOut } from "@/src/lib/auth-client";
import { SearchBar } from "@/src/ui/search-bar";
import { HEADER_MESSAGES } from "./header.constants";

const { signedInAs, signOut: signOutLabel, signIn: signInLabel } = HEADER_MESSAGES;

const NAV_LINKS = [
  { label: "DASHBOARD", href: "/" },
  { label: "FAVORITES", href: "/favorites" },
] as const;

export function Header() {
  const pathname = usePathname();
  const router = useRouter();
  const { data: session } = useSession();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  async function handleSignOut() {
    setDropdownOpen(false);
    await signOut();
    router.push("/login");
  }

  const firstName = session?.user.name?.split(" ")[0] ?? session?.user.email ?? "";

  return (
    <header className="bg-surface/30 backdrop-blur-[24px] sticky top-0 z-50 border-b border-white/10 flex items-center gap-gutter w-full px-container-padding-desktop py-stack-sm">
      {/* Logo */}
      <Link
        href="/"
        className="font-display-temp text-headline-lg tracking-tight text-primary shrink-0"
      >
        SkyCast
      </Link>

      {/* Search bar with autocomplete */}
      <div className="flex-1 max-w-md hidden md:block">
        <SearchBar placeholder="Search cities..." />
      </div>

      {/* Spacer */}
      <div className="flex-1" />

      {/* Nav links */}
      <nav className="hidden md:flex items-center gap-1">
        {NAV_LINKS.map(({ label, href }) => {
          const isActive = pathname === href;
          return (
            <Link
              key={href}
              href={href}
              className={`font-label-caps text-label-caps px-4 py-2 rounded-full transition-colors whitespace-nowrap ${
                isActive
                  ? "text-primary border-b-2 border-primary"
                  : "text-on-surface-variant hover:bg-white/5"
              }`}
            >
              {label}
            </Link>
          );
        })}
      </nav>

      {/* Auth */}
      {session ? (
        <div className="relative" ref={dropdownRef}>
          <button
            onClick={() => setDropdownOpen((prev) => !prev)}
            className="flex items-center gap-2 px-3 py-2 rounded-full hover:bg-white/5 transition-colors"
          >
            <span className="material-symbols-outlined text-primary text-[20px]">
              account_circle
            </span>
            <span className="font-label-caps text-label-caps text-on-surface-variant hidden md:inline">
              Hi, {firstName}
            </span>
            <span className="material-symbols-outlined text-on-surface-variant text-[16px]">
              {dropdownOpen ? "expand_less" : "expand_more"}
            </span>
          </button>

          {dropdownOpen && (
            <div className="absolute right-0 top-full mt-2 w-48 glass-card rounded-xl overflow-hidden z-50">
              <div className="px-4 py-3 border-b border-white/10">
                <p className="font-label-caps text-label-caps text-on-surface-variant">
                  {signedInAs}
                </p>
                <p className="font-body-md text-on-surface truncate text-sm mt-0.5">
                  {session.user.email}
                </p>
              </div>
              <button
                onClick={handleSignOut}
                className="w-full flex items-center gap-2 px-4 py-3 font-label-caps text-label-caps text-error hover:bg-white/5 transition-colors text-left"
              >
                <span className="material-symbols-outlined text-[18px]">logout</span>
                {signOutLabel}
              </button>
            </div>
          )}
        </div>
      ) : (
        <Link
          href="/login"
          className="flex items-center gap-2 bg-primary/10 border border-primary/30 hover:bg-primary/20 transition-colors px-4 py-2 rounded-full font-label-caps text-label-caps text-primary whitespace-nowrap"
        >
          <span className="material-symbols-outlined text-[16px]">account_circle</span>
          {signInLabel}
        </Link>
      )}
    </header>
  );
}
