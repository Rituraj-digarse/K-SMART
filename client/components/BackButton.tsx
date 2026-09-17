import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";

type BackButtonProps = {
  to?: string;
  label?: string;
  className?: string;
  onClick?: () => void;
};

export function BackButton({ to, label = "Back", className, onClick }: BackButtonProps) {
  const navigate = useNavigate();
  const goBack = () => { if (onClick) onClick(); else if (to) navigate(to); else navigate(-1); };
  return <button type="button" className={cn("back-link", className)} onClick={goBack}><ArrowLeft size={15} /> {label}</button>;
}
