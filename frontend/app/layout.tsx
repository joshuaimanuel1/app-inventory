import "./globals.css";

import Navbar from "@/components/ui/Navbar";

import ToasterProvider from "@/components/providers/ToasterProvider";

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
      <body className="bg-gray-950 text-gray-100 min-h-screen antialiased">
        {/* Navbar */}
        <Navbar />

        {/* Main Content */}
        <main className="max-w-6xl mx-auto px-6 py-10">{children}</main>

        {/* Toast Provider */}
        <ToasterProvider />
      </body>
    </html>
  );
}
