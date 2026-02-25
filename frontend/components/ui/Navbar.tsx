"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { getToken, logout } from "@/src/lib/auth";
import { useRouter, usePathname } from "next/navigation";
import RoleGuard from "../auth/RoleGuard";

import { cn } from "@/lib/utils";

export default function Navbar() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    setIsLoggedIn(!!getToken());
  }, [pathname]);

  function handleLogout() {
    logout();
    setIsLoggedIn(false);

    router.replace("/login");
    router.refresh();
  }

  function navLink(href: string, label: string) {
    const active = pathname === href;

    return (
      <Link
        href={href}
        className={cn(
          "text-sm font-medium transition-colors duration-200",
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
      <div className="container mx-auto max-w-6xl px-6 py-4 flex items-center justify-between">
        {/* Logo */}
        <Link
          href="/"
          className="text-lg font-semibold text-foreground hover:text-primary transition-colors"
        >
          Inventory App
        </Link>

        {/* Navigation */}
        <div className="flex items-center gap-6">
          {isLoggedIn ? (
            <>
              {navLink("/categories", "Categories")}
              {navLink("/inventories", "Inventories")}
              {navLink("/stock-histories", "Stock Histories")}

              <RoleGuard allowed={["ADMIN"]}>
                {navLink("/admin", "Admin Panel")}
              </RoleGuard>

              {/* Logout */}
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
      </div>
    </nav>
  );
}
