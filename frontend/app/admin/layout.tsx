"use client";

import RoleGuard from "@/components/auth/RoleGuard";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  const navItems = [
    {
      name: "Manage Users",
      href: "/admin/users",
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="18"
          height="18"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
          <circle cx="9" cy="7" r="4" />
          <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
          <path d="M16 3.13a4 4 0 0 1 0 7.75" />
        </svg>
      ),
    },
    {
      name: "Create Admin",
      href: "/admin/create-admin",
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="18"
          height="18"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
          <circle cx="9" cy="7" r="4" />
          <line x1="19" x2="19" y1="8" y2="14" />
          <line x1="22" x2="16" y1="11" y2="11" />
        </svg>
      ),
    },
  ];

  return (
    <RoleGuard allowed={["ADMIN"]}>
      <div className="flex flex-col md:flex-row gap-8 w-full min-h-[calc(100vh-120px)]">
        <aside className="w-full md:w-64 shrink-0">
          <Link href="/admin" className="block mb-6 px-3 group">
            <h2 className="text-xs font-bold text-gray-500 group-hover:text-gray-300 uppercase tracking-wider transition-colors">
              Admin Panel
            </h2>
          </Link>

          <nav className="flex flex-col gap-1.5">
            {navItems.map((item) => {
              const isActive = pathname === item.href;

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 text-sm font-medium ${
                    isActive
                      ? "bg-blue-600/10 text-blue-400 shadow-sm"
                      : "text-gray-400 hover:text-gray-200 hover:bg-gray-800/60"
                  }`}
                >
                  <span
                    className={isActive ? "text-blue-400" : "text-gray-500"}
                  >
                    {item.icon}
                  </span>
                  {item.name}
                </Link>
              );
            })}
          </nav>
        </aside>

        <main className="flex-1">
          <div className="bg-gray-900/30 border border-gray-800/60 rounded-2xl p-6 md:p-10 min-h-96 shadow-sm">
            {children}
          </div>
        </main>
      </div>
    </RoleGuard>
  );
}
