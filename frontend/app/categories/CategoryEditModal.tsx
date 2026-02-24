"use client";

import { useState } from "react";
import { getToken } from "@/src/lib/auth";
import { useRouter } from "next/navigation";
import Modal from "@/components/ui/Modal";

interface Props {
  id: number;
  defaultName: string;
}

export default function CategoryEditModal({ id, defaultName }: Props) {
  const [isOpen, setIsOpen] = useState(false);
  const [name, setName] = useState(defaultName);
  const router = useRouter();
  const token = getToken();

  const handleUpdate = async () => {
    if (!name.trim()) return;

    await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/categories/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ name }),
    });

    setIsOpen(false);
    router.refresh();
  };

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="absolute top-3 right-3 p-2 bg-blue-500/10 text-blue-400 rounded-lg hover:bg-blue-500/25 hover:text-blue-300 transition-all duration-200"
        aria-label="Edit Kategori"
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

      <Modal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        title="Edit Category"
      >
        <div className="flex flex-col gap-3">
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="px-3 py-2 bg-gray-800 border border-gray-700 rounded"
          />

          <button
            onClick={handleUpdate}
            className="bg-blue-600 hover:bg-blue-700 text-white py-2 rounded"
          >
            Save Changes
          </button>
        </div>
      </Modal>
    </>
  );
}
