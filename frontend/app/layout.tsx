import "./globals.css";
import Link from "next/link";

export const metadata = {
  title: "Inventory App",
  description: "Inventory Management System",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-gray-950 text-gray-100 min-h-screen">
        <nav className="border-b border-gray-800 bg-gray-900">
          <div className="max-w-6xl mx-auto px-6 py-4 flex justify-between items-center">
            <h1 className="text-xl font-bold">Inventory App</h1>

            <div className="flex gap-6 text-sm">
              <Link href="/categories" className="hover:text-blue-400">
                Categories
              </Link>
              <Link href="/inventories" className="hover:text-blue-400">
                Inventories
              </Link>
              <Link href="/stock-histories">Stock Histories</Link>
            </div>
          </div>
        </nav>

        <main className="max-w-6xl mx-auto px-6 py-10">{children}</main>
      </body>
    </html>
  );
}
