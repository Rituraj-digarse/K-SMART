import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { centres as initialCentres, farmer, farmers, govPolicy as initialPolicy, notifications as initialNotifications, payments as initialPayments, procurementRecords as initialRecords, staffCredentials, tokens as initialTokens, type TokenStatus } from "@/data/mockData";

export type Role = "farmer" | "officer" | "operator" | "admin";
export type CurrentUser = { id: string; role: Role; name: string; mobile?: string };
export type LiveToken = (typeof initialTokens)[number];
export type LiveCentre = (typeof initialCentres)[number];
export type LivePayment = (typeof initialPayments)[number];
export type LiveRecord = (typeof initialRecords)[number] & { farmerId?: string; otpConfirmed?: boolean; timestamp?: string };
export type ActionResult = { ok: boolean; error?: string };

type AuthContextValue = {
  currentUser: CurrentUser | null; tokens: LiveToken[]; centres: LiveCentre[]; policy: typeof initialPolicy; records: LiveRecord[]; payments: LivePayment[]; notifications: typeof initialNotifications;
  loginFarmer: (mobile: string, otp: string) => ActionResult;
  loginStaff: (role: Exclude<Role, "farmer">, id: string, password: string) => boolean;
  requestToken: (input: { farmerId: string; centreId: string; requestedDate: string; expectedQuantity: number }) => ActionResult;
  updateTokenStatus: (tokenId: string, status: TokenStatus, reason?: string) => Promise<ActionResult>;
  approveBatch: (tokenIds: string[]) => Promise<ActionResult>;
  completeProcurement: (tokenId: string, actualQuantity: number, otp: string) => Promise<ActionResult>;
  updateCentre: (centreId: string, patch: Partial<LiveCentre>) => Promise<ActionResult>;
  addCentre: (centre: Omit<LiveCentre, "id">) => Promise<ActionResult>;
  updatePolicy: (next: Partial<typeof initialPolicy>) => Promise<ActionResult>;
  logout: () => void;
};

const AuthContext = createContext<AuthContextValue | null>(null);
const todayLabel = "21 Mar 2024";
const wait = () => new Promise<void>((resolve) => window.setTimeout(resolve, 500));

export function AuthProvider({ children }: { children: ReactNode }) {
  const [currentUser, setCurrentUser] = useState<CurrentUser | null>(() => { try { return JSON.parse(localStorage.getItem("uparjan-user") || "null"); } catch { return null; } });
  const [tokens, setTokens] = useState<LiveToken[]>(initialTokens);
  const [centres, setCentres] = useState<LiveCentre[]>(initialCentres);
  const [policy, setPolicy] = useState(initialPolicy);
  const [records, setRecords] = useState<LiveRecord[]>(initialRecords);
  const [payments, setPayments] = useState<LivePayment[]>(initialPayments);
  const [notifications, setNotifications] = useState(initialNotifications);
  useEffect(() => { if (currentUser) localStorage.setItem("uparjan-user", JSON.stringify(currentUser)); else localStorage.removeItem("uparjan-user"); }, [currentUser]);
  const notify = (title: string, message: string, farmerId = farmer.id) => setNotifications((items) => [{ channel: "In-App", title, message, time: "Just now", unread: true, farmerId }, ...items]);
  const value = useMemo<AuthContextValue>(() => ({
    currentUser, tokens, centres, policy, records, payments, notifications,
    loginFarmer: (mobile, otp) => { if (!/^\d{6}$/.test(otp)) return { ok: false, error: "Enter the 6-digit OTP to continue." }; const found = farmers.find((item) => item.mobile === mobile.replace(/\D/g, "")); if (!found) return { ok: false, error: "No registered farmer found with this number." }; setCurrentUser({ id: found.id, role: "farmer", name: found.name, mobile: found.mobile }); return { ok: true }; },
    loginStaff: (role, id, password) => { const found = staffCredentials[role].find((item) => item.id === id && item.password === password); if (!found) return false; setCurrentUser({ id: found.id, role, name: found.name }); return true; },
    requestToken: ({ farmerId, centreId, requestedDate, expectedQuantity }) => { const remaining = farmer.verifiedLandArea * policy.procurementLimitPerAcre - records.filter((item) => item.farmerId === farmerId).reduce((sum, item) => sum + item.quantity, 0); const visitDate = new Date(requestedDate); const lastDate = new Date("2024-03-18"); lastDate.setDate(lastDate.getDate() + 8); if (visitDate <= new Date("2024-03-20") || visitDate > lastDate) return { ok: false, error: "Choose a visit date inside your active 9-day slot, at least one day from today." }; if (expectedQuantity <= 0 || expectedQuantity > remaining) return { ok: false, error: `Expected quantity must be between 1 and ${remaining} quintals.` }; const dailyCount = tokens.filter((item) => item.centreId === centreId && item.requestedDate === requestedDate).length; const next = { id: `token-${Date.now()}`, tokenNumber: `TKN-${centreId}-${requestedDate.replace(/\s/g, "-")}-${String(dailyCount + 1).padStart(4, "0")}`, shortReference: `T-${String(454 + dailyCount).padStart(4, "0")}`, slotId: "slot-001", farmerId, centreId, requestedDate, expectedQuantity, status: "Waiting for Approval" as TokenStatus, batchId: null, createdAt: "Just now", approvedAt: null, completedAt: null } as LiveToken; setTokens((items) => [...items, next]); notify("Token requested", "Your request is being reviewed.", farmerId); return { ok: true }; },
    updateTokenStatus: async (tokenId, status) => { await wait(); if (currentUser?.role !== "officer") return { ok: false, error: "Access denied — insufficient permissions." }; const token = tokens.find((item) => item.id === tokenId); setTokens((items) => items.map((item) => item.id === tokenId ? { ...item, status, approvedAt: status === "Approved" ? "Just now" : item.approvedAt } : item)); if (token) notify(status === "Approved" ? "Token approved" : `Token ${status.toLowerCase()}`, status === "Approved" ? "You can come now." : `Your token is now ${status}.`, token.farmerId); return { ok: true }; },
    approveBatch: async (tokenIds) => { await wait(); if (currentUser?.role !== "officer") return { ok: false, error: "Access denied — insufficient permissions." }; if (!tokenIds.length) return { ok: false, error: "Select at least one token." }; const selected = tokens.filter((token) => tokenIds.includes(token.id)); const centre = centres[0]; const used = tokens.filter((token) => token.centreId === centre?.id && token.requestedDate === todayLabel && token.status === "Approved").reduce((sum, token) => sum + token.expectedQuantity, 0) + records.filter((record) => record.date === todayLabel && record.centre === centre?.name).reduce((sum, record) => sum + record.quantity, 0); const total = selected.reduce((sum, token) => sum + token.expectedQuantity, 0); if (!centre || total > centre.dailyWeighingCapacity - used) return { ok: false, error: "Daily capacity exceeded." }; setTokens((items) => items.map((token) => tokenIds.includes(token.id) ? { ...token, status: "Approved", batchId: `batch-${Date.now()}`, approvedAt: "Just now" } : token)); selected.forEach((token) => notify("Token approved", "You can come now.", token.farmerId)); return { ok: true }; },
    completeProcurement: async (tokenId, actualQuantity, otp) => { await wait(); if (currentUser?.role !== "operator") return { ok: false, error: "Access denied — insufficient permissions." }; if (otp !== "123456") return { ok: false, error: "OTP did not match. Use demo OTP 123456." }; const token = tokens.find((item) => item.id === tokenId); if (!token || token.status !== "Approved") return { ok: false, error: "Only an approved token can be completed." }; const amount = actualQuantity * policy.msp; const record = { id: `record-${Date.now()}`, date: todayLabel, centre: centres.find((item) => item.id === token.centreId)?.name || "Procurement Centre", quantity: actualQuantity, amount, paymentStatus: "Payment Pending", farmerId: token.farmerId, otpConfirmed: true, timestamp: "Just now" } as LiveRecord; setRecords((items) => [record, ...items]); setPayments((items) => [{ id: `payment-${Date.now()}`, procurementRecordId: record.id, farmerId: token.farmerId, centreId: token.centreId, actualQuantity, msp: policy.msp, amount, status: "Payment Pending", date: todayLabel }, ...items]); setTokens((items) => items.map((item) => item.id === tokenId ? { ...item, status: "Completed", completedAt: "Just now" } : item)); return { ok: true }; },
    updateCentre: async (centreId, patch) => { await wait(); if (currentUser?.role !== "admin") return { ok: false, error: "Access denied — insufficient permissions." }; setCentres((items) => items.map((centre) => centre.id === centreId ? { ...centre, ...patch } : centre)); return { ok: true }; },
    addCentre: async (centre) => { await wait(); if (currentUser?.role !== "admin") return { ok: false, error: "Access denied — insufficient permissions." }; setCentres((items) => [...items, { ...centre, id: `centre-${Date.now()}` }]); return { ok: true }; },
    updatePolicy: async (next) => { await wait(); if (currentUser?.role !== "admin") return { ok: false, error: "Access denied — insufficient permissions." }; setPolicy((current) => ({ ...current, ...next })); return { ok: true }; },
    logout: () => setCurrentUser(null),
  }), [currentUser, tokens, centres, policy, records, payments, notifications]);
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
export function useAuth() { const context = useContext(AuthContext); if (!context) throw new Error("useAuth must be used inside AuthProvider"); return context; }
