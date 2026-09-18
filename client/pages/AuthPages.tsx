import { useEffect, useState } from "react";
import { Link, Navigate, useNavigate, useParams } from "react-router-dom";
import { ArrowRight, CheckCircle2, Eye, EyeOff, KeyRound, Leaf, LockKeyhole, Phone, ShieldCheck } from "lucide-react";
import { useAuth, type Role } from "@/context/AuthContext";
import { BackButton } from "@/components/BackButton";
import { apiRequest } from "@/lib/api";

const roleInfo = {
  farmer: { title: "Farmer Login", subtitle: "Access your procurement slot, token and payment details", icon: "👨‍🌾", label: "Farmer portal" },
  admin: { title: "Government / Admin Login", subtitle: "Configure policies, centres and system operations", icon: "🏛️", label: "Role: Government / Admin" },
  officer: { title: "Procurement Officer Login", subtitle: "Manage centre capacity, batches and approvals", icon: "👮", label: "Role: Procurement Officer" },
  operator: { title: "Operator Login", subtitle: "Enter receipts and confirm farmer procurements", icon: "🧑‍💼", label: "Role: Centre Operator" },
} as const;

function AuthFrame({ children, role, title, subtitle }: { children: React.ReactNode; role?: Role; title: string; subtitle: string }) {
  return <div className="auth-page"><div className="demo-mode-banner" role="status">Demo Mode · Simulated data for SIH26032 prototype</div><div className="tricolor" /><div className="auth-top"><span>भारत सरकार | Government of India</span><span>e-Uparjan · Smart Procurement System</span></div><main className="auth-main"><BackButton onClick={() => { if (window.history.length > 1) window.history.back(); else window.location.assign("/roles"); }} /><div className="auth-card"><div className="auth-brand"><div className="auth-emblem"><Leaf size={26} /></div><div><strong>ई-उपार्जन <span>e-Uparjan</span></strong><small>Department of Food & Civil Supplies</small></div></div><div className="auth-heading"><div className="auth-role-icon">{role ? roleInfo[role].icon : "👋"}</div><div><span className="eyebrow">{role ? roleInfo[role].label.toUpperCase() : "SECURE ACCESS"}</span><h1>{title}</h1><p>{subtitle}</p></div></div>{children}<div className="auth-security"><ShieldCheck size={15} /><span>Your information is protected under government security guidelines.</span></div></div></main><footer className="auth-footer"><span>e-Uparjan · Smart Procurement & Token Management System</span><span>Terms · Privacy · Sitemap · Contact · Last updated: 18 March 2024</span></footer><div className="auth-help"><Phone size={14} /> Farmer helpline <strong>1800-233-4250</strong> · Available 8:00 AM – 8:00 PM</div></div>;
}

export function RoleSelection() {
  const roles: Role[] = ["farmer", "admin", "officer", "operator"];
  return <AuthFrame title="Choose your portal" subtitle="Select the login that matches your role in the procurement process."><div className="role-grid">{roles.map((role) => { const tile = <><span className="tile-icon">{roleInfo[role].icon}</span><span><strong>{roleInfo[role].title.replace(" Login", "")}</strong><small>{roleInfo[role].subtitle}</small></span><ArrowRight className="tile-arrow" size={18} /> </>; return role === "operator" ? <a href="/operator-dashboard.html" className="role-tile" key={role}>{tile}</a> : role === "officer" ? <a href="/procurement-dashboard.html" className="role-tile" key={role}>{tile}</a> : <Link to={`/login/${role}`} className="role-tile" key={role}>{tile}</Link>; })}</div><p className="auth-note">Staff roles are restricted to authorized government credentials. Your role is verified securely during login.</p></AuthFrame>;
}

export function FarmerLogin() {
  const navigate = useNavigate(); const { loginFarmer } = useAuth(); const [mobile, setMobile] = useState(""); const [otp, setOtp] = useState(""); const [sent, setSent] = useState(false); const [cooldown, setCooldown] = useState(0); const [error, setError] = useState(""); const [submitting, setSubmitting] = useState(false);
  useEffect(() => { if (!cooldown) return; const timer = window.setInterval(() => setCooldown((value) => value - 1), 1000); return () => window.clearInterval(timer); }, [cooldown]);

  const sendOtp = async () => {
    const normalizedMobile = mobile.replace(/\D/g, "");
    if (!/^\d{10}$/.test(normalizedMobile)) {
      setError("Enter a valid 10-digit mobile number.");
      return;
    }

    setError("");
    setSubmitting(true);

    try {
      await apiRequest<{ success: boolean; message?: string }>("/auth/send-otp", {
        method: "POST",
        body: JSON.stringify({ mobile: normalizedMobile }),
      });
      setSent(true);
      setCooldown(30);
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : "Unable to send OTP. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const verify = async () => {
    if (!/^\d{6}$/.test(otp)) {
      setError("Enter the 6-digit OTP to continue.");
      return;
    }

    setError("");
    setSubmitting(true);
    const result = await loginFarmer(mobile, otp);
    setSubmitting(false);

    if (!result.ok) {
      setError(result.error || "Unable to verify OTP.");
      return;
    }

    navigate("/");
  };

  return <AuthFrame role="farmer" title="Farmer Login" subtitle="Use your registered mobile number to continue."><div className="simple-form"><label>Mobile number<input aria-label="10-digit mobile number" aria-invalid={Boolean(error && !sent)} inputMode="numeric" maxLength={10} value={mobile} onChange={(event) => { setError(""); setMobile(event.target.value.replace(/\D/g, "")); }} placeholder="Enter 10-digit mobile number" /></label><button className="primary-button auth-button" onClick={sendOtp} disabled={submitting || (sent && cooldown > 0)}>{submitting ? "Sending…" : sent ? cooldown ? `Resend OTP in ${cooldown}s` : "Resend OTP" : "Send OTP"}<ArrowRight size={16} /></button>{sent && <div className="otp-block"><div className="demo-note"><CheckCircle2 size={15} /> Demo OTP is available in the backend console for this local setup.</div><label>Enter 6-digit OTP<input aria-label="6-digit one-time password" aria-invalid={Boolean(error && sent)} inputMode="numeric" maxLength={6} value={otp} onChange={(event) => { setError(""); setOtp(event.target.value.replace(/\D/g, "")); }} placeholder="• • • • • •" /></label><button className="primary-button auth-button" onClick={verify} disabled={submitting}>{submitting ? "Verifying…" : "Verify & Login"} <ArrowRight size={16} /></button></div>}{error && <div className="form-error" role="alert">{error}{error.includes("No registered") && <Link to="/roles"> Choose another portal</Link>}</div>}</div><div className="auth-note left"><LockKeyhole size={14} /> We will never ask for your OTP over a phone call.</div></AuthFrame>;
}

export function StaffLogin() {
  const { role = "admin" } = useParams<{ role: Exclude<Role, "farmer"> }>(); const staffRole = (role === "officer" || role === "operator" || role === "admin") ? role : "admin"; const navigate = useNavigate(); const { loginStaff } = useAuth(); const [id, setId] = useState(""); const [password, setPassword] = useState(""); const [showPassword, setShowPassword] = useState(false); const [error, setError] = useState(""); const info = roleInfo[staffRole];
  const submit = () => { if (!loginStaff(staffRole, id, password)) { setError("Invalid ID or password."); return; } navigate(`/${staffRole}/dashboard`); };
  return <AuthFrame role={staffRole} title={info.title} subtitle={info.subtitle}><div className="simple-form"><label>Official {staffRole === "admin" ? "Admin ID" : `${staffRole[0].toUpperCase()}${staffRole.slice(1)} ID`}<div className="input-with-icon"><KeyRound size={16} /><input value={id} onChange={(event) => setId(event.target.value)} placeholder={staffRole === "admin" ? "e.g. ADM1001" : "Enter official ID"} /></div></label><label>Password<div className="input-with-icon"><LockKeyhole size={16} /><input type={showPassword ? "text" : "password"} value={password} onChange={(event) => setPassword(event.target.value)} placeholder="Enter password" /><button type="button" className="eye-button" aria-label={showPassword ? "Hide password" : "Show password"} onClick={() => setShowPassword(!showPassword)}>{showPassword ? <EyeOff aria-hidden="true" size={16} /> : <Eye aria-hidden="true" size={16} />}</button></div></label>{error && <div className="form-error" role="alert">{error}</div>}<button className="primary-button auth-button" onClick={submit}>Login securely <ArrowRight size={16} /></button></div><div className="authorized-note"><LockKeyhole size={15} /><div><strong>For authorized government personnel only</strong><span>Forgot password? Contact IT Support</span></div></div></AuthFrame>;
}

export function PortalPlaceholder() { const { role } = useParams(); const { currentUser, logout } = useAuth(); if (!currentUser || currentUser.role !== role) return <Navigate to={`/login/${role}`} replace />; return <div className="portal-placeholder"><div className="placeholder-box"><BackButton to="/roles" /><div className="auth-emblem"><Leaf size={26} /></div><span className="eyebrow">{role?.toUpperCase()} PORTAL</span><h1>Dashboard ready for {currentUser.name}</h1><p>This role-specific workspace is connected to the shared mock authentication context. Continue building this dashboard from the existing portal components.</p><button className="primary-button" onClick={logout}>Sign out</button><Link to="/" className="outline-button">Return to farmer overview</Link></div></div>; }

export default { RoleSelection, FarmerLogin, StaffLogin, PortalPlaceholder };
