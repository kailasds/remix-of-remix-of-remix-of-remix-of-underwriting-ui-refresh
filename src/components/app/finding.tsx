import type { ReactNode } from "react";
import { CheckCircle2, AlertTriangle, CircleAlert, Sparkles, Send, MessageSquare } from "lucide-react";
import { useState } from "react";

export type FindingState = "verified" | "review" | "missing" | "recommendation";

const STATE_META: Record<FindingState, { label: string; icon: any; dot: string; text: string; bg: string; border: string; soft: string }> = {
  verified: {
    label: "Verified",
    icon: CheckCircle2,
    dot: "bg-leaf",
    text: "text-leaf",
    bg: "bg-leaf/10",
    border: "border-leaf/25",
    soft: "bg-leaf/[0.06]",
  },
  review: {
    label: "Needs Review",
    icon: AlertTriangle,
    dot: "bg-[#f5a623]",
    text: "text-[#8a5a00]",
    bg: "bg-[#fff4d6]",
    border: "border-[#f5a623]/35",
    soft: "bg-[#fffaee]",
  },
  missing: {
    label: "Missing Information",
    icon: CircleAlert,
    dot: "bg-coral",
    text: "text-coral",
    bg: "bg-coral/10",
    border: "border-coral/30",
    soft: "bg-coral/[0.05]",
  },
  recommendation: {
    label: "AI Recommendation",
    icon: Sparkles,
    dot: "bg-electric",
    text: "text-electric",
    bg: "bg-ice",
    border: "border-electric/30",
    soft: "bg-ice/50",
  },
};

export function FindingPill({ state, label, className = "" }: { state: FindingState; label?: string; className?: string }) {
  const m = STATE_META[state];
  const Icon = m.icon;
  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full ${m.bg} px-2.5 py-0.5 text-[11px] font-semibold ${m.text} ${className}`}>
      <Icon className="h-3 w-3" />
      {label ?? m.label}
    </span>
  );
}

export function FindingDot({ state }: { state: FindingState }) {
  const m = STATE_META[state];
  return <span className={`inline-block h-2 w-2 rounded-full ${m.dot}`} title={m.label} />;
}

export function FindingCard({
  state,
  eyebrow,
  title,
  summary,
  children,
  className = "",
}: {
  state: FindingState;
  eyebrow?: string;
  title: string;
  summary: string;
  children?: ReactNode;
  className?: string;
}) {
  const m = STATE_META[state];
  return (
    <div className={`rounded-2xl border ${m.border} bg-white overflow-hidden animate-fade-up ${className}`}>
      <div className={`${m.soft} px-5 py-4`}>
        <div className="flex items-start justify-between gap-4">
          <div className="min-w-0">
            {eyebrow && <div className="text-[10.5px] font-semibold text-fog">{eyebrow}</div>}
            <h3 className="mt-0.5 text-[15px] font-semibold text-ink">{title}</h3>
          </div>
          <FindingPill state={state} />
        </div>
        <p className="mt-2 text-[12.5px] leading-relaxed text-smoke">{summary}</p>
      </div>
      {children && <div className="border-t border-mist/60 p-5">{children}</div>}
    </div>
  );
}

export function AskAI({ placeholder = "Ask AI about this case…", suggestions = [] }: { placeholder?: string; suggestions?: string[] }) {
  const [q, setQ] = useState("");
  const [answer, setAnswer] = useState<string | null>(null);
  const [thinking, setThinking] = useState(false);
  function send(text: string) {
    if (!text.trim()) return;
    setQ(text);
    setThinking(true);
    setAnswer(null);
    setTimeout(() => {
      setThinking(false);
      setAnswer(mockAnswer(text));
    }, 700);
  }
  return (
    <div className="rounded-2xl border border-mist/70 bg-white p-4">
      <div className="flex items-center gap-2 text-[11px] font-semibold text-fog">
        <MessageSquare className="h-3.5 w-3.5 text-electric" /> Ask AI
      </div>
      <div className="mt-2 flex items-center gap-2 rounded-full border border-mist bg-white pl-3 pr-1 focus-within:border-electric">
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && send(q)}
          placeholder={placeholder}
          className="flex-1 bg-transparent py-2 text-[13px] placeholder:text-fog focus:outline-none"
        />
        <button onClick={() => send(q)} className="grid h-7 w-7 place-items-center rounded-full bg-[#0d111b] text-white"><Send className="h-3.5 w-3.5" /></button>
      </div>
      {suggestions.length > 0 && !answer && !thinking && (
        <div className="mt-3 flex flex-wrap gap-1.5">
          {suggestions.map((s) => (
            <button key={s} onClick={() => send(s)} className="rounded-full border border-mist bg-snow/60 px-2.5 py-1 text-[11.5px] text-smoke hover:text-ink hover:border-electric/40">
              {s}
            </button>
          ))}
        </div>
      )}
      {thinking && (
        <div className="mt-3 flex items-center gap-2 text-[12px] text-smoke">
          <span className="inline-flex gap-0.5">
            <span className="h-1.5 w-1.5 rounded-full bg-electric animate-pulse-dot" />
            <span className="h-1.5 w-1.5 rounded-full bg-electric animate-pulse-dot" style={{ animationDelay: "0.15s" }} />
            <span className="h-1.5 w-1.5 rounded-full bg-electric animate-pulse-dot" style={{ animationDelay: "0.3s" }} />
          </span>
          AI is reasoning…
        </div>
      )}
      {answer && (
        <div className="mt-3 rounded-xl bg-ice/40 border border-electric/20 px-3 py-2.5 text-[12.5px] leading-relaxed text-ink animate-fade-up">
          <div className="flex items-center gap-1.5 text-[10.5px] text-electric font-semibold mb-1"><Sparkles className="h-3 w-3" /> AI</div>
          {answer}
        </div>
      )}
    </div>
  );
}

function mockAnswer(q: string): string {
  const s = q.toLowerCase();
  if (s.includes("review") || s.includes("why")) return "The primary address differs between ACORD 125 (1034 Park Street) and the Schedule of Locations (1034 Park Avenue). ZIP and city match, so this is likely a transcription error. I recommend using the newer Schedule of Locations value.";
  if (s.includes("approv")) return "Loss history is clean over 5 years, the risk fits appetite for coastal band 3b, and premium sits 4% below benchmark. Once the address mismatch is resolved, this is a straightforward approval.";
  if (s.includes("conflict") || s.includes("document")) return "Two documents disagree on the primary street name. Open Review Findings → Business Identity to compare them side-by-side.";
  if (s.includes("broker")) return "James Jenkins Agency — Riskwell. 22 cases YTD, 71% bind rate, 42% loss ratio. Broker channel is stable, though bind rate is down 4% QoQ.";
  if (s.includes("risk") || s.includes("score")) return "Property exposure (68) and flood (42) drive most of the composite. Cyber and compliance are low. The single watch item is coastal wind — I've recommended endorsement CP-1049.";
  return "Based on the six documents I reviewed, this case is within appetite. Three findings need your attention: an address mismatch, missing building age, and confirmation of the second location.";
}
