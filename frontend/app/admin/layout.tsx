import RoleGuard from "@/components/auth/RoleGuard";
import Link from "next/link";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <RoleGuard allowed={["ADMIN"]}>
      <div className="flex min-h-screen">
        {/* sidebar */}
        <aside className="w-64 bg-gray-900 border-r border-gray-800 p-6 space-y-4">
          <h2 className="text-xl font-bold mb-6">Admin Panel</h2>

          <Link href="/admin" className="block hover:text-blue-400">
            Dashboard
          </Link>

          <Link href="/admin/users" className="block hover:text-blue-400">
            Users
          </Link>

          <Link
            href="/admin/create-admin"
            className="block hover:text-blue-400"
          >
            Create Admin
          </Link>
        </aside>

        {/* CONTENT */}
        <main className="flex-1 p-10">{children}</main>
      </div>
    </RoleGuard>
  );
}
