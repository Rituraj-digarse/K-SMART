import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { farmers, staffCredentials } from "@/data/mockData";

export type Role = "farmer" | "officer" | "operator" | "admin";
export type CurrentUser = { id: string; role: Role; name: string; mobile?: string };

type AuthContextValue = {
  currentUser: CurrentUser | null;
  loginFarmer: (mobile: string, otp: string) => { ok: boolean; error?: string };
  loginStaff: (role: Exclude<Role, "farmer">, id: string, password: string) => boolean;
  logout: () => void;
};

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [currentUser, setCurrentUser] = useState<CurrentUser | null>(() => {
    try { return JSON.parse(localStorage.getItem("uparjan-user") || "null"); } catch { return null; }
  });
  useEffect(() => {
    if (currentUser) localStorage.setItem("uparjan-user", JSON.stringify(currentUser));
    else localStorage.removeItem("uparjan-user");
  }, [currentUser]);
  const value = useMemo<AuthContextValue>(() => ({
    currentUser,
    loginFarmer: (mobile, otp) => {
      if (!/^\d{6}$/.test(otp)) return { ok: false, error: "Enter the 6-digit OTP to continue." };
      const found = farmers.find((item) => item.mobile === mobile.replace(/\D/g, ""));
      if (!found) return { ok: false, error: "No registered farmer found with this number." };
      setCurrentUser({ id: found.id, role: "farmer", name: found.name, mobile: found.mobile });
      return { ok: true };
    },
    loginStaff: (role, id, password) => {
      const found = staffCredentials[role].find((item) => item.id === id && item.password === password);
      if (!found) return false;
      setCurrentUser({ id: found.id, role, name: found.name });
      return true;
    },
    logout: () => setCurrentUser(null),
  }), [currentUser]);
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used inside AuthProvider");
  return context;
}
