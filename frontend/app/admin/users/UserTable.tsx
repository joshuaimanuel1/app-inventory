"use client";

import { useEffect, useState } from "react";
import { getToken } from "@/src/lib/auth";
import UserRow from "./UserRow";

interface User {
  id: number;
  email: string;
  role: "USER" | "ADMIN";
  createdAt: string;
}

export default function UserTable() {
  const token = getToken();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchUsers = async () => {
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/admin/users`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      const result = await res.json();
      setUsers(result.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  if (loading) {
    return <p className="text-gray-400">Loading users...</p>;
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full border border-gray-800">
        <thead className="bg-gray-900">
          <tr>
            <th className="p-3 text-left">ID</th>
            <th className="p-3 text-left">Email</th>
            <th className="p-3 text-left">Role</th>
            <th className="p-3 text-left">Created</th>
            <th className="p-3 text-left">Actions</th>
          </tr>
        </thead>

        <tbody>
          {users.map((user) => (
            <UserRow key={user.id} user={user} refresh={fetchUsers} />
          ))}
        </tbody>
      </table>
    </div>
  );
}
