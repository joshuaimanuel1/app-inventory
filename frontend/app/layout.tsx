import "./globals.css";

import Navbar from "@/components/ui/Navbar";
import { Toaster } from "@/components/ui/sonner";

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
    <html lang="en" suppressHydrationWarning>
      <body
        className="
          min-h-screen
          bg-background
          text-foreground
          antialiased
        "
      >
        {/* Navbar */}
        <Navbar />

        {/* Main Content */}
        <main
          className="
            max-w-7xl
            mx-auto
            px-6
            py-10
          "
        >
          {children}
        </main>

        {/* 3. Pasang Toaster premium kita di sini */}
        <Toaster />
      </body>
    </html>
  );
}
