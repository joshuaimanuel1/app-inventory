"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { getToken, logout } from "@/src/lib/auth";
import { useRouter, usePathname } from "next/navigation";
import RoleGuard from "../auth/RoleGuard";

import { cn } from "@/lib/utils";

export default function Navbar() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    setIsLoggedIn(!!getToken());
    setIsMobileMenuOpen(false);
  }, [pathname]);

  function handleLogout() {
    logout();
    setIsLoggedIn(false);
    setIsMobileMenuOpen(false);

    router.replace("/login");
    router.refresh();
  }
  function navLink(href: string, label: string, isMobile = false) {
    const active = pathname === href;

    return (
      <Link
        href={href}
        className={cn(
          "font-medium transition-colors duration-200",
          isMobile
            ? "block w-full py-3 text-base border-b border-border/50"
            : "text-sm",
          active
            ? "text-primary"
            : "text-muted-foreground hover:text-foreground",
        )}
      >
        {label}
      </Link>
    );
  }

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-border bg-card/80 backdrop-blur">
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <Link
          href="/"
          className="text-lg font-semibold text-foreground hover:text-primary transition-colors flex-shrink-0"
        >
          Inventory App
        </Link>

        <div className="hidden md:flex items-center gap-6">
          {isLoggedIn ? (
            <>
              {navLink("/categories", "Categories")}
              {navLink("/inventories", "Inventories")}
              {navLink("/stock-histories", "Stock Histories")}

              <RoleGuard allowed={["ADMIN"]}>
                {navLink("/admin", "Admin Panel")}
              </RoleGuard>

              <button
                onClick={handleLogout}
                className="text-sm font-medium text-destructive hover:text-destructive/80 transition-colors"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              {navLink("/login", "Login")}
              {navLink("/register", "Register")}
            </>
          )}
        </div>

        <div className="flex items-center md:hidden">
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="text-muted-foreground hover:text-foreground p-2 focus:outline-none"
            aria-label="Toggle menu"
          >
            {isMobileMenuOpen ? (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            ) : (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <line x1="4" y1="12" x2="20" y2="12" />
                <line x1="4" y1="6" x2="20" y2="6" />
                <line x1="4" y1="18" x2="20" y2="18" />
              </svg>
            )}
          </button>
        </div>
      </div>

      {isMobileMenuOpen && (
        <div className="md:hidden absolute top-16 left-0 w-full bg-card/95 backdrop-blur-md border-b border-border shadow-xl px-4 pt-2 pb-6 flex flex-col">
          {isLoggedIn ? (
            <>
              {navLink("/categories", "Categories", true)}
              {navLink("/inventories", "Inventories", true)}
              {navLink("/stock-histories", "Stock Histories", true)}

              <RoleGuard allowed={["ADMIN"]}>
                {navLink("/admin", "Admin Panel", true)}
              </RoleGuard>

              <button
                onClick={handleLogout}
                className="block w-full text-left py-3 text-base font-medium text-destructive hover:text-destructive/80 transition-colors mt-2"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              {navLink("/login", "Login", true)}
              {navLink("/register", "Register", true)}
            </>
          )}
        </div>
      )}
    </nav>
  );
}
