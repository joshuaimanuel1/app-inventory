"use client";

import { getToken } from "@/src/lib/auth";
import { useState } from "react";

interface Props {
  user: {
    id: number;
    email: string;
    role: "USER" | "ADMIN";
    createdAt: string;
  };
  refresh: () => void;
}

export default function UserRow({ user, refresh }: Props) {
  const token = getToken();
  const [loading, setLoading] = useState(false);

  const handleRequest = async (url: string, options: RequestInit) => {
    setLoading(true);

    try {
      const res = await fetch(url, options);
      const result = await res.json();

      if (!res.ok) {
        throw new Error(result.message || "Operation failed");
      }

      refresh();
    } catch (err: any) {
      alert(err.message);
    } finally {
      setLoading(false);
    }
  };

  const renameUser = () => {
    const newEmail = prompt("Enter new email:", user.email);
    if (!newEmail || newEmail === user.email) return;

    handleRequest(
      `${process.env.NEXT_PUBLIC_API_URL}/api/admin/users/${user.id}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ email: newEmail }),
      },
    );
  };

  const changePassword = () => {
    const newPass = prompt("Enter new password (min 6 characters):");
    if (!newPass || newPass.length < 6) return;

    handleRequest(
      `${process.env.NEXT_PUBLIC_API_URL}/api/admin/users/${user.id}/password`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ password: newPass }),
      },
    );
  };

  const deleteUser = () => {
    if (!confirm("Delete this user permanently?")) return;

    handleRequest(
      `${process.env.NEXT_PUBLIC_API_URL}/api/admin/users/${user.id}`,
      {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );
  };

  return (
    <tr className="border-t border-gray-800 hover:bg-gray-900/40 transition">
      <td className="p-3">{user.id}</td>
      <td className="p-3 font-medium">{user.email}</td>

      <td className="p-3">
        <span
          className={
            user.role === "ADMIN"
              ? "text-green-400 font-semibold"
              : "text-gray-400"
          }
        >
          {user.role}
        </span>
      </td>

      <td className="p-3">{new Date(user.createdAt).toLocaleDateString()}</td>

      <td className="p-3 flex gap-4 text-sm">
        <button
          onClick={renameUser}
          disabled={loading}
          className="text-yellow-400 hover:text-yellow-300 disabled:opacity-50"
        >
          Rename
        </button>

        <button
          onClick={changePassword}
          disabled={loading}
          className="text-blue-400 hover:text-blue-300 disabled:opacity-50"
        >
          Change Password
        </button>

        <button
          onClick={deleteUser}
          disabled={loading}
          className="text-red-500 hover:text-red-400 disabled:opacity-50"
        >
          Delete
        </button>
      </td>
    </tr>
  );
}
