import type { ReactNode } from "react";
import type { Role } from "@/context/AuthContext";
import { hasPermission, type StaffPermission } from "@/auth/permissions";

export function PermissionGate({ requires, role, children }: { requires: StaffPermission; role?: Role; children: ReactNode }) {
  return hasPermission(role, requires) ? <>{children}</> : null;
}
