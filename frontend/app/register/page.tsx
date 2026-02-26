"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function RegisterPage() {
  const router = useRouter();

  const [form, setForm] = useState({
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [loading, setLoading] = useState(false);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();

    // 1. buat validasi Kolom Kosong
    if (!form.email || !form.password || !form.confirmPassword) {
      toast.error("Semua kolom harus diisi");
      return;
    }

    // buat validasi format Email (Regex)
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(form.email)) {
      toast.error(
        "Masukkan format email yang valid (contoh: user@example.com)",
      );
      return;
    }

    // 3. buat validasi panjang Password
    if (form.password.length < 6) {
      toast.error("Password minimal 6 karakter");
      return;
    }

    // 4. buat validasi konfirmasi Password
    if (form.password !== form.confirmPassword) {
      toast.error("Password dan konfirmasi password tidak cocok");
      return;
    }

    try {
      setLoading(true);

      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/auth/register`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            email: form.email,
            password: form.password,
          }),
        },
      );

      const data = await res.json();

      if (!data.success) {
        throw new Error(data.message || "Register gagal");
      }

      toast.success("Register berhasil! Silakan login.");
      router.replace("/login");
    } catch (err: any) {
      toast.error(err.message || "Register gagal. Silakan coba lagi.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative flex items-center justify-center min-h-[80vh] px-4 w-full">
      <div className="absolute top-0 left-0 md:-left-20 w-[300px] md:w-[500px] h-[300px] md:h-[500px] bg-blue-600/10 rounded-full blur-[120px] -z-10 pointer-events-none" />
      <div className="absolute bottom-0 right-0 md:-right-20 w-[300px] md:w-[500px] h-[300px] md:h-[500px] bg-indigo-600/10 rounded-full blur-[120px] -z-10 pointer-events-none" />

      <div className="relative z-10 bg-[#0B0F19] p-8 sm:p-10 rounded-2xl shadow-xl w-full max-w-md border border-gray-800">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-white mb-2">Register</h1>
          <p className="text-gray-400 text-sm">
            Buat akun baru untuk mengakses aplikasi
          </p>
        </div>

        <form onSubmit={handleRegister} className="flex flex-col gap-5">
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
              placeholder="Min. 6 characters"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              className="bg-gray-900 border-gray-700 focus-visible:ring-blue-500 py-6"
            />
          </div>

          {/* Confirm Password */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-300">
              Confirm Password
            </label>
            <Input
              type="password"
              placeholder="Retype your password"
              value={form.confirmPassword}
              onChange={(e) =>
                setForm({ ...form, confirmPassword: e.target.value })
              }
              className="bg-gray-900 border-gray-700 focus-visible:ring-blue-500 py-6"
            />
          </div>

          <Button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-6 mt-2 rounded-lg font-medium transition-colors"
          >
            {loading ? "Registering..." : "Register"}
          </Button>
        </form>

        <p className="text-center text-sm text-gray-400 mt-8">
          Sudah punya akun?{" "}
          <Link
            href="/login"
            className="text-blue-400 hover:text-blue-300 font-medium transition-colors"
          >
            Login di sini
          </Link>
        </p>
      </div>
    </div>
  );
}
