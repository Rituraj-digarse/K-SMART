import { Link } from "react-router-dom";
import { LockKeyhole } from "lucide-react";
import { BackButton } from "@/components/BackButton";

export default function AccessDenied() {
  return <div className="portal-placeholder"><div className="placeholder-box" role="alert"><div className="auth-emblem denied-icon"><LockKeyhole size={25} /></div><span className="eyebrow">ACCESS DENIED</span><h1>Access Denied — insufficient permissions</h1><p>Your current role cannot access this page. Please return to your portal or sign in with an authorized account.</p><BackButton to="/roles" /><div className="placeholder-actions"><Link to="/roles" className="primary-button">Choose another portal</Link><Link to="/" className="outline-button">Return home</Link></div></div></div>;
}
