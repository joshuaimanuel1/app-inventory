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
          bg-[#0B0F19] 
          text-gray-100
          antialiased
          overflow-x-hidden 
          flex flex-col
        "
      >
        <Navbar />
        <main className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex-1 flex flex-col">
          {children}
        </main>
        <Toaster />
      </body>
    </html>
  );
}
