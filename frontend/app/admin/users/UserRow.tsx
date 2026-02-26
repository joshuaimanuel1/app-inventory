"use client";

import { getToken } from "@/src/lib/auth";
import { useState } from "react";
import { toast } from "sonner";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

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

  // State untuk kontrol Modal
  const [isRenameOpen, setIsRenameOpen] = useState(false);
  const [isPasswordOpen, setIsPasswordOpen] = useState(false);

  // State untuk form input
  const [newEmail, setNewEmail] = useState(user.email);
  const [newPassword, setNewPassword] = useState("");

  const handleRequest = async (
    url: string,
    options: RequestInit,
    successMessage: string,
  ) => {
    setLoading(true);

    try {
      const res = await fetch(url, options);
      const result = await res.json();

      if (!res.ok) {
        throw new Error(result.message || "Operation failed");
      }

      toast.success(successMessage);
      refresh();
      return true;
    } catch (err: any) {
      toast.error(err.message || "An error occurred");
      return false;
    } finally {
      setLoading(false);
    }
  };

  const renameUser = async () => {
    if (!newEmail || newEmail === user.email) return;

    const success = await handleRequest(
      `${process.env.NEXT_PUBLIC_API_URL}/api/admin/users/${user.id}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ email: newEmail }),
      },
      "User email updated successfully",
    );

    if (success) setIsRenameOpen(false);
  };

  const changePassword = async () => {
    if (!newPassword || newPassword.length < 6) {
      toast.error("Password must be at least 6 characters");
      return;
    }

    const success = await handleRequest(
      `${process.env.NEXT_PUBLIC_API_URL}/api/admin/users/${user.id}/password`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ password: newPassword }),
      },
      "Password changed successfully",
    );

    if (success) {
      setIsPasswordOpen(false);
      setNewPassword("");
    }
  };

  const deleteUser = async () => {
    await handleRequest(
      `${process.env.NEXT_PUBLIC_API_URL}/api/admin/users/${user.id}`,
      {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
      "User deleted successfully",
    );
  };

  return (
    <tr className="border-t border-gray-800 hover:bg-gray-800/50 transition-colors">
      <td className="p-4 text-gray-300">{user.id}</td>
      <td className="p-4 font-medium text-gray-200">{user.email}</td>

      <td className="p-4">
        <span
          className={`px-2.5 py-1 rounded-full text-xs font-semibold ${
            user.role === "ADMIN"
              ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
              : "bg-gray-500/10 text-gray-400 border border-gray-500/20"
          }`}
        >
          {user.role}
        </span>
      </td>

      <td className="p-4 text-gray-400 text-sm">
        {new Date(user.createdAt).toLocaleDateString("en-GB", {
          day: "2-digit",
          month: "short",
          year: "numeric",
        })}
      </td>

      <td className="p-4 flex gap-2 items-center">
        <Dialog open={isRenameOpen} onOpenChange={setIsRenameOpen}>
          <DialogTrigger asChild>
            <button
              title="Rename User"
              className="p-2 bg-yellow-500/10 text-yellow-400 rounded-lg hover:bg-yellow-500/25 transition-colors disabled:opacity-50"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                <path d="M18.5 2.5a2.12 2.12 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
              </svg>
            </button>
          </DialogTrigger>
          <DialogContent className="bg-gray-900 border-gray-800 sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Rename User</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <Input
                value={newEmail}
                onChange={(e) => setNewEmail(e.target.value)}
                placeholder="Enter new email"
                className="bg-gray-900 border-gray-700"
              />
              <Button
                onClick={renameUser}
                disabled={loading}
                className="w-full bg-blue-600 hover:bg-blue-700"
              >
                {loading ? "Saving..." : "Save Changes"}
              </Button>
            </div>
          </DialogContent>
        </Dialog>

        <Dialog open={isPasswordOpen} onOpenChange={setIsPasswordOpen}>
          <DialogTrigger asChild>
            <button
              title="Change Password"
              className="p-2 bg-blue-500/10 text-blue-400 rounded-lg hover:bg-blue-500/25 transition-colors disabled:opacity-50"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <rect width="18" height="11" x="3" y="11" rx="2" ry="2" />
                <path d="M7 11V7a5 5 0 0 1 10 0v4" />
              </svg>
            </button>
          </DialogTrigger>
          <DialogContent className="bg-gray-900 border-gray-800 sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Change Password</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <Input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="Enter new password (min. 6 chars)"
                className="bg-gray-900 border-gray-700"
              />
              <Button
                onClick={changePassword}
                disabled={loading}
                className="w-full bg-blue-600 hover:bg-blue-700"
              >
                {loading ? "Updating..." : "Update Password"}
              </Button>
            </div>
          </DialogContent>
        </Dialog>

        <AlertDialog>
          <AlertDialogTrigger asChild>
            <button
              title="Delete User"
              className="p-2 bg-red-500/10 text-red-400 rounded-lg hover:bg-red-500/25 transition-colors disabled:opacity-50"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M3 6h18" />
                <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" />
                <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
                <line x1="10" y1="11" x2="10" y2="17" />
                <line x1="14" y1="11" x2="14" y2="17" />
              </svg>
            </button>
          </AlertDialogTrigger>
          <AlertDialogContent className="bg-gray-900 border-gray-800 sm:max-w-md">
            <AlertDialogHeader>
              <AlertDialogTitle className="text-gray-100">
                Delete User Permanently?
              </AlertDialogTitle>
              <AlertDialogDescription className="text-gray-400">
                This action cannot be undone. This will permanently delete the
                user account and remove their data from our servers.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter className="mt-4">
              <AlertDialogCancel className="bg-transparent border border-gray-700 text-gray-300 hover:bg-gray-800 hover:text-white font-medium rounded-md transition-colors">
                Cancel
              </AlertDialogCancel>
              <AlertDialogAction
                onClick={deleteUser}
                disabled={loading}
                className="bg-red-600 hover:bg-red-700 text-white font-medium rounded-md transition-colors border-0"
              >
                {loading ? "Deleting..." : "Delete"}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </td>
    </tr>
  );
}
