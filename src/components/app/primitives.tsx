import type { ReactNode } from "react";

export function Card({ className = "", children }: { className?: string; children: ReactNode }) {
  return <div className={`rounded-2xl border border-mist/70 bg-white ${className}`}>{children}</div>;
}

export function Eyebrow({ children, className = "" }: { children: ReactNode; className?: string }) {
  return <div className={`text-[10.5px] font-semibold uppercase tracking-[0.16em] text-fog ${className}`}>{children}</div>;
}

export function PillButton({ children, variant = "primary", className = "", ...props }: any) {
  const base = "inline-flex items-center gap-1.5 rounded-full px-4 py-2 text-[13px] font-medium tracking-tight transition-colors disabled:opacity-50";
  const v = variant === "primary"
    ? "bg-[#0d111b] text-white hover:bg-[#1a1f2e] shadow-[0_1px_2px_rgba(0,0,0,.15)]"
    : variant === "ghost"
      ? "text-ink hover:bg-snow"
      : "border border-mist bg-white text-ink hover:bg-snow";
  return <button {...props} className={`${base} ${v} ${className}`}>{children}</button>;
}

const chipTones: Record<string, string> = {
  new: "bg-ice text-[#0d5a8e]",
  progress: "bg-[#fff4d6] text-[#8a5a00]",
  approved: "bg-[#e2f5cf] text-[#3d6a04]",
  referred: "bg-lavender text-[#3f2fa8]",
  declined: "bg-[#ffe2e2] text-[#a02929]",
  neutral: "bg-snow text-smoke",
};

export function StatusChip({ status }: { status: string }) {
  const key = status.toLowerCase().replace(/\s/g, "") as keyof typeof chipTones;
  const map: Record<string, keyof typeof chipTones> = {
    new: "new", inprogress: "progress", approved: "approved", referred: "referred", declined: "declined",
  };
  const tone = chipTones[map[key] ?? "neutral"];
  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-medium ${tone}`}>
      <span className="h-1.5 w-1.5 rounded-full bg-current opacity-70" />
      {status}
    </span>
  );
}

export function ProgressBar({ value, tone = "electric" }: { value: number; tone?: "electric" | "leaf" | "coral" | "iris" }) {
  const bg: Record<string, string> = { electric: "bg-electric", leaf: "bg-leaf", coral: "bg-coral", iris: "bg-iris" };
  return (
    <div className="h-1.5 w-full overflow-hidden rounded-full bg-snow">
      <div className={`h-full rounded-full ${bg[tone]} transition-all`} style={{ width: `${Math.max(0, Math.min(100, value))}%` }} />
    </div>
  );
}

export function RiskDot({ score }: { score: number }) {
  const tone = score < 40 ? "bg-leaf" : score < 65 ? "bg-[#f5a623]" : "bg-coral";
  return (
    <span className="inline-flex items-center gap-2 text-[12px] font-semibold text-ink">
      <span className={`h-2 w-2 rounded-full ${tone}`} />
      {score}
    </span>
  );
}
