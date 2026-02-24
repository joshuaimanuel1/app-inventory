"use client";

import { useState } from "react";
import { getToken } from "@/src/lib/auth";
import { useRouter } from "next/navigation";

export default function CreateAdminForm() {
  const router = useRouter();
  const token = getToken();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const handleSubmit = async () => {
    if (!email || !password) {
      setError("Email and password are required");
      return;
    }

    try {
      setLoading(true);
      setError(null);
      setSuccess(null);

      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/admin/create-admin`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ email, password }),
        },
      );

      const result = await res.json();

      if (!res.ok) {
        throw new Error(result.message || "Failed to create admin");
      }

      setSuccess("Admin created successfully ✅");
      setEmail("");
      setPassword("");

      router.refresh();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-gray-900 border border-gray-800 p-6 rounded-xl max-w-md space-y-4">
      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded"
      />

      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded"
      />

      <button
        onClick={handleSubmit}
        disabled={loading}
        className="w-full bg-blue-600 hover:bg-blue-700 disabled:opacity-50 transition px-4 py-2 rounded font-semibold"
      >
        {loading ? "Creating..." : "Create Admin"}
      </button>

      {success && <p className="text-green-400 text-sm">{success}</p>}
      {error && <p className="text-red-400 text-sm">{error}</p>}
    </div>
  );
}
