"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { getToken, logout } from "@/src/lib/auth";
import { useRouter, usePathname } from "next/navigation";
import RoleGuard from "../auth/RoleGuard";

export default function Navbar() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const router = useRouter();
  const pathname = usePathname(); //trigger on route change

  useEffect(() => {
    setIsLoggedIn(!!getToken());
  }, [pathname]); //setiap pindah halaman, cek ulang

  const handleLogout = () => {
    logout();
    setIsLoggedIn(false);
    router.replace("/login");
    router.refresh(); //force re-render
  };

  return (
    <nav className="border-b border-gray-800 bg-gray-900">
      <div className="max-w-6xl mx-auto px-6 py-4 flex justify-between items-center">
        <Link href="/" className="text-xl font-bold">
          Inventory App
        </Link>

        <div className="flex gap-6 text-sm items-center">
          {isLoggedIn ? (
            <>
              <Link href="/categories" className="hover:text-blue-400">
                Categories
              </Link>
              <Link href="/inventories" className="hover:text-blue-400">
                Inventories
              </Link>
              <Link href="/stock-histories" className="hover:text-blue-400">
                Stock Histories
              </Link>

              <RoleGuard allowed={["ADMIN"]}>
                <Link href="/admin" className="hover:text-blue-400">
                  Admin Panel
                </Link>
              </RoleGuard>

              <button
                onClick={handleLogout}
                className="text-red-400 hover:text-red-300"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link href="/login" className="hover:text-blue-400">
                Login
              </Link>
              <Link href="/register" className="hover:text-blue-400">
                Register
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
