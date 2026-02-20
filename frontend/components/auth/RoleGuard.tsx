"use client";

import { ReactNode, useEffect, useState } from "react";
import { getRole } from "@/src/lib/auth";

interface Props {
  allowed: ("ADMIN" | "USER")[];
  children: ReactNode;
}

export default function RoleGuard({ allowed, children }: Props) {
  const [role, setRole] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    setRole(getRole());
  }, []);

  if (!mounted) return null;
  if (!role || !allowed.includes(role as any)) return null;

  return <>{children}</>;
}
