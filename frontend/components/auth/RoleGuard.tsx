"use client";

import { useEffect, useState } from "react";
import { getRole } from "@/src/lib/auth";

interface Props {
  allowed: ("ADMIN" | "USER")[];
  children: React.ReactNode;
}

export default function RoleGuard({ allowed, children }: Props) {
  const [isAllowed, setIsAllowed] = useState(false);

  useEffect(() => {
    const role = getRole();
    if (role && allowed.includes(role)) {
      setIsAllowed(true);
    }
  }, [allowed]);

  if (!isAllowed) return null;

  return <>{children}</>;
}
