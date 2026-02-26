"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { saveAuth } from "@/src/lib/auth";
import Link from "next/link";

import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function LoginPage() {
  const router = useRouter();

  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    // 1. buat validasi Kolom Kosong
    if (!form.email || !form.password) {
      toast.error("Email dan password wajib diisi");
      return;
    }

    // 2. baut validasi Format Email (Regex)
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(form.email)) {
      toast.error(
        "Masukkan format email yang valid (contoh: user@example.com)",
      );
      return;
    }

    try {
      setLoading(true);

      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/auth/login`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(form),
        },
      );

      const data = await res.json();

      if (!data.success) {
        throw new Error(data.message || "Login failed");
      }

      // Simpan token
      const token = data.data.accessToken;
      saveAuth(token);

      toast.success("Login berhasil! Memuat dashboard...");

      router.replace("/categories");
      router.refresh();
    } catch (err: any) {
      toast.error(
        err.message || "Login gagal. Periksa kembali email dan password Anda.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-[80vh] px-4">
      <div className="bg-[#0B0F19] p-8 sm:p-10 rounded-2xl shadow-xl w-full max-w-md border border-gray-800">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-white mb-2">Login</h1>
          <p className="text-gray-400 text-sm">Selamat datang kembali!</p>
        </div>

        <form onSubmit={handleLogin} className="flex flex-col gap-5">
          {/* Email */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-300">
              Email Address
            </label>
            <Input
              type="email"
              placeholder="user@example.com"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              className="bg-gray-900 border-gray-700 focus-visible:ring-blue-500 py-6"
            />
          </div>

          {/* Password */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-300">
              Password
            </label>
            <Input
              type="password"
              placeholder="Masukkan password Anda"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              className="bg-gray-900 border-gray-700 focus-visible:ring-blue-500 py-6"
            />
          </div>

          {/* Submit Button */}
          <Button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-6 mt-2 rounded-lg font-medium transition-colors"
          >
            {loading ? "Logging in..." : "Login"}
          </Button>
        </form>

        <p className="text-center text-sm text-gray-400 mt-8">
          Belum punya akun?{" "}
          <Link
            href="/register"
            className="text-blue-400 hover:text-blue-300 font-medium transition-colors"
          >
            Register di sini
          </Link>
        </p>
      </div>
    </div>
  );
}
