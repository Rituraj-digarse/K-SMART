import { Link } from "react-router-dom";
import { ArrowLeft, LockKeyhole } from "lucide-react";

export default function AccessDenied() {
  return <div className="portal-placeholder"><div className="placeholder-box" role="alert"><div className="auth-emblem denied-icon"><LockKeyhole size={25} /></div><span className="eyebrow">ACCESS DENIED</span><h1>You do not have permission</h1><p>Your current role cannot access this page. Please return to your portal or sign in with an authorized account.</p><div className="placeholder-actions"><Link to="/roles" className="primary-button">Choose another portal</Link><Link to="/" className="outline-button"><ArrowLeft size={15} /> Return home</Link></div></div></div>;
}
