import { Link } from "react-router-dom";
import { BackButton } from "@/components/BackButton";

export default function NotFound() {
  return <div className="min-h-screen bg-[#f7f9f7] flex items-center justify-center p-6"><div className="max-w-md text-center bg-white border border-[#dfe8e3] rounded-lg p-10"><BackButton /><div className="text-[#138a57] text-sm font-bold uppercase tracking-widest">e-Uparjan</div><h1 className="text-5xl font-bold text-[#102a43] mt-3">404</h1><p className="text-[#6a7b83] mt-3">This page is not available in the farmer portal.</p><Link className="inline-flex mt-6 bg-[#138a57] text-white rounded px-4 py-2 text-sm font-bold" to="/">Return to dashboard</Link></div></div>;
}
