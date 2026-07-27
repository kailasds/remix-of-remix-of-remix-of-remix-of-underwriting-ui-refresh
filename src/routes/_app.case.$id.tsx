import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useMemo, useRef, useState, type ComponentType } from "react";
import {
  ArrowLeft, Sparkles, FileText, Home, Cloud, Shield, DollarSign, Gavel,
  ClipboardCheck, BookOpenCheck, Scale as ScaleIcon, MessagesSquare,
  CheckCircle2, Circle, ChevronDown, ChevronRight, ChevronLeft, Search,
  SlidersHorizontal, Send, MapPin, Building2, FileCheck2, Activity,
  Radio, AlertTriangle, Zap, Info,
} from "lucide-react";
import { JourneySteps, STEP_IDS } from "../components/app/JourneySteps";
import { cases, formatUSD } from "../lib/mock";

export const Route = createFileRoute("/_app/case/$id")({
  head: ({ params }) => ({ meta: [{ title: `Case ${params.id} · Aegis Underwriting` }] }),
  loader: ({ params }) => ({ c: cases.find((x) => x.id === params.id) ?? cases[0] }),
  component: CaseWorkspace,
});

/* ─────────────────────── Journey (top stepper) ─────────────────────── */

type PhaseKey = "brief" | "review" | "risk" | "quote" | "decision" | "audit";

const PHASES: { key: PhaseKey; label: string; icon: ComponentType<{ className?: string }> }[] = [
  { key: "brief",    label: "AI Brief",         icon: Sparkles },
  { key: "review",   label: "Review Findings",  icon: ClipboardCheck },
  { key: "risk",     label: "Risk Story",       icon: BookOpenCheck },
  { key: "quote",    label: "Quote",            icon: DollarSign },
  { key: "decision", label: "Decision",         icon: Gavel },
  { key: "audit",    label: "Audit Trail",      icon: ScaleIcon },
];

/* ─────────────────────── Mission Control agents ─────────────────────── */
// Agent i is wired to STEP_IDS[i] (see JourneySteps.tsx): it runs while that
// tab is being filled, and completes the instant the journey clock advances
// to the next tab — so the two panels always animate in lockstep.

type AgentStatus = "completed" | "running" | "queued";

type Agent = {
  id: string;
  name: string;
  icon: ComponentType<{ className?: string }>;
  blurb: string;
  time?: string;
  status: AgentStatus;
  steps: string[];
  lines: { text: string; tone?: "ok" | "warn" | "info" }[];
};

const PHASE_DURATION_MS = 3400;

const AGENT_DEFS: Omit<Agent, "status" | "time">[] = [
  {
    id: "doc", name: "Document Intelligence", icon: FileText,
    blurb: "Extracting and reconciling document data",
    steps: [
      "Parsing ACORD 125 and 140",
      "Running OCR on scanned pages",
      "Extracting 312 data points",
      "Cross-checking documents for discrepancies",
    ],
    lines: [
      { text: "Processed 14 documents", tone: "ok" },
      { text: "Extracted 312 data points", tone: "ok" },
      { text: "Detected 3 discrepancies", tone: "warn" },
      { text: "Confidence 96%", tone: "ok" },
    ],
  },
  {
    id: "identity", name: "Business Identity Agent", icon: Shield,
    blurb: "Verifying business identity and registration",
    steps: [
      "Verifying EIN and business registration",
      "Matching Secretary of State records",
      "Checking for adverse business records",
      "Confirming legal entity name",
    ],
    lines: [
      { text: "Verified EIN 27-1234567", tone: "ok" },
      { text: "Matched with Secretary of State", tone: "ok" },
      { text: "No adverse business records", tone: "ok" },
      { text: "Confidence 98%", tone: "ok" },
    ],
  },
  {
    id: "property", name: "Property Intelligence", icon: Home,
    blurb: "Analyzing property data",
    steps: [
      "Analyzing aerial imagery",
      "Verifying building footprint",
      "Estimating replacement cost",
      "Checking construction details",
    ],
    lines: [
      { text: "Verified building footprint via aerial imagery", tone: "ok" },
      { text: "Estimated replacement cost at $3.91M", tone: "ok" },
      { text: "Confirmed ISO Class 4 construction", tone: "ok" },
      { text: "Confidence 94%", tone: "ok" },
    ],
  },
  {
    id: "cat", name: "CAT Risk Agent", icon: Cloud,
    blurb: "Assessing catastrophe exposure",
    steps: [
      "Pulling FEMA flood zone data",
      "Modeling wind & hail exposure",
      "Cross-checking hurricane history",
      "Scoring catastrophe exposure",
    ],
    lines: [
      { text: "Modeled 1-in-100 wind loss at $214K", tone: "ok" },
      { text: "Flagged coastal flood exposure", tone: "warn" },
      { text: "Confirmed no hurricane losses in 5 years", tone: "ok" },
      { text: "Confidence 91%", tone: "ok" },
    ],
  },
  {
    id: "fraud", name: "Fraud Detection Agent", icon: Shield,
    blurb: "Screening for fraud and loss-history signals",
    steps: [
      "Screening for fraud indicators",
      "Validating loss history",
      "Cross-referencing claims database",
      "Flagging anomalies for review",
    ],
    lines: [
      { text: "No fraud indicators detected", tone: "ok" },
      { text: "Loss history validated across 3 claims", tone: "ok" },
      { text: "Confidence 99%", tone: "ok" },
    ],
  },
  {
    id: "pricing", name: "Pricing Agent", icon: DollarSign,
    blurb: "Calculating final premium",
    steps: [
      "Calculating base premium",
      "Running market comparison",
      "Applying endorsement pricing",
      "Finalizing rate indication",
    ],
    lines: [
      { text: "Calculated premium at $148,200", tone: "ok" },
      { text: "Rate 1.68% — 4% below benchmark", tone: "ok" },
      { text: "Confidence 95%", tone: "ok" },
    ],
  },
];

/* ─────────────────────── Findings (3-source cards) ─────────────────────── */

type Verdict = "discrepancy" | "mismatch" | "match" | "missing";
type Source = { doc: string; page?: string; section?: string; value: string; tone?: "match" | "conflict" | "neutral" };
type Finding = {
  id: string;
  eyebrow: string;
  category: "identity" | "property" | "documents" | "coverage" | "loss" | "broker" | "compliance";
  verdict: Verdict;
  verdictLabel: string;
  helper: string;
  sources: Source[];
  ai?: { observation?: string; recommendation: string; confidence: number };
  aggregate?: { value: string; sources: string[]; confidence: number };
  agentLabel: string;
  agentIcon: ComponentType<{ className?: string }>;
};

const FINDINGS: Finding[] = [
  {
    id: "legal-name",
    eyebrow: "Legal Business Name",
    category: "identity",
    verdict: "discrepancy",
    verdictLabel: "Discrepancy Detected",
    helper: "AI found different values across three documents.",
    agentLabel: "Business Identity Agent",
    agentIcon: Building2,
    sources: [
      { doc: "ACORD 125", section: "Named Insured", page: "Page 1", value: "Peninsula Marina Group LLC", tone: "match" },
      { doc: "ACORD 140", section: "Named Insured", page: "Page 2", value: "Peninsula Marina Group, LLC", tone: "conflict" },
      { doc: "Certificate of Insurance", section: "Named Insured", value: "Peninsula Marina Group LLC", tone: "match" },
    ],
    ai: {
      observation: "Comma placement differs on ACORD 140. Secretary of State registration confirms the LLC form.",
      recommendation: "Use “Peninsula Marina Group LLC” as the standard legal name.",
      confidence: 98,
    },
  },
  {
    id: "primary-address",
    eyebrow: "Primary Address",
    category: "property",
    verdict: "mismatch",
    verdictLabel: "Possible Mismatch",
    helper: "Address values differ across documents.",
    agentLabel: "Property Intelligence",
    agentIcon: MapPin,
    sources: [
      { doc: "ACORD 125", section: "Mailing Address", page: "Page 2", value: "1034 Park Street\nJacksonville, FL 32202", tone: "conflict" },
      { doc: "Schedule of Locations", section: "Location #1", page: "Page 3", value: "1034 Park St.\nJacksonville, FL 32202", tone: "conflict" },
      { doc: "ACORD 140", section: "Location", page: "Page 4", value: "1034 Park Street\nJacksonville, FL 32202", tone: "conflict" },
    ],
    ai: {
      observation: "Street suffix differs (“Street” vs “St.”). ZIP and city match.",
      recommendation: "Standardize to “1034 Park Street, Jacksonville, FL 32202” as per USPS format.",
      confidence: 98,
    },
  },
  {
    id: "naics",
    eyebrow: "NAICS Code",
    category: "identity",
    verdict: "match",
    verdictLabel: "Match Found",
    helper: "Values are consistent across all documents.",
    agentLabel: "Document Intelligence",
    agentIcon: FileCheck2,
    sources: [],
    aggregate: {
      value: "722511 — Full-service restaurants",
      sources: ["ACORD 125", "ACORD 140", "Certificate of Insurance"],
      confidence: 100,
    },
  },
];

const CATEGORY_TABS: { key: Finding["category"] | "all"; label: string }[] = [
  { key: "all", label: "All Findings" },
  { key: "identity", label: "Business Identity" },
  { key: "property", label: "Location & Property" },
  { key: "documents", label: "Documents" },
  { key: "coverage", label: "Coverage" },
  { key: "loss", label: "Loss History" },
  { key: "broker", label: "Broker" },
  { key: "compliance", label: "Compliance" },
];

/* ─────────────────────── Component ─────────────────────── */

function CaseWorkspace() {
  const { c } = Route.useLoaderData();
  const [confidence, setConfidence] = useState(72);
  const [askOpen, setAskOpen] = useState(false);
  const [mcCollapsed, setMcCollapsed] = useState(true);
  const [activeTab, setActiveTab] = useState<Finding["category"] | "all">("all");
  const [showDiscOnly, setShowDiscOnly] = useState(true);
  const [query, setQuery] = useState("");

  // Journey clock — the single source of truth shared by the tab stepper and
  // Mission Control. filledCount tabs are "Done"; the tab at index === filledCount
  // is being filled, and the agent at the same index is the one "running".
  const [filledCount, setFilledCount] = useState(0);
  const [activeStep, setActiveStep] = useState<string>(STEP_IDS[0]);
  const startTimeRef = useRef(Date.now());

  useEffect(() => {
    if (filledCount >= STEP_IDS.length) return;
    const t = window.setTimeout(() => {
      setFilledCount((n) => {
        const next = Math.min(STEP_IDS.length, n + 1);
        setActiveStep(STEP_IDS[Math.min(next, STEP_IDS.length - 1)]);
        return next;
      });
    }, PHASE_DURATION_MS);
    return () => window.clearTimeout(t);
  }, [filledCount]);

  useEffect(() => {
    const id = window.setInterval(() => {
      setConfidence((c) => Math.min(88, c + (Math.random() > 0.55 ? 1 : 0)));
    }, 900);
    return () => window.clearInterval(id);
  }, []);

  const agents: Agent[] = useMemo(() => AGENT_DEFS.map((def, i) => {
    const status: AgentStatus = filledCount > i ? "completed" : filledCount === i ? "running" : "queued";
    const time = status === "completed"
      ? new Date(startTimeRef.current + (i + 1) * PHASE_DURATION_MS).toLocaleTimeString([], { hour12: false })
      : undefined;
    return { ...def, status, time };
  }), [filledCount]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return FINDINGS.filter((f) => {
      if (activeTab !== "all" && f.category !== activeTab) return false;
      if (showDiscOnly && f.verdict === "match") return false;
      if (q && !(f.eyebrow.toLowerCase().includes(q) || f.helper.toLowerCase().includes(q))) return false;
      return true;
    });
  }, [activeTab, showDiscOnly, query]);

  const totalFindings = 24;
  const showingFrom = 1;
  const showingTo = Math.min(10, filtered.length);

  return (
    <div className="mx-auto max-w-[1600px] px-8 py-6">
      <Link to="/queue" className="inline-flex items-center gap-1.5 text-[12px] text-smoke hover:text-ink">
        <ArrowLeft className="h-3.5 w-3.5" /> Back to my queue
      </Link>

      {/* Full-width case header */}
      <div className="mt-4">
        <CaseHeader c={c} confidence={confidence} />
      </div>

      {/* Stepper + Mission Control, then Findings on the left */}
      <div className={`mt-5 grid gap-6 items-start ${mcCollapsed ? "grid-cols-[1fr_64px]" : "grid-cols-[1fr_400px]"}`}>
        <div className="space-y-5">
          <JourneySteps filledCount={filledCount} active={activeStep} onSelect={setActiveStep} />
        </div>

        <MissionControl agents={agents} collapsed={mcCollapsed} onToggleCollapsed={() => setMcCollapsed((v) => !v)} />
      </div>

      <AskAiFab open={askOpen} onToggle={() => setAskOpen((v) => !v)} />
    </div>
  );
}

/* ─────────────────────── Header ─────────────────────── */

function CaseHeader({ c, confidence }: { c: (typeof cases)[number]; confidence: number }) {
  return (
    <div className="rounded-2xl border border-mist/70 bg-white px-6 py-5 animate-fade-up">
      <div className="flex items-start gap-6">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 text-[11px] font-semibold tracking-[0.14em] text-fog">
            <span className="uppercase">SUB-24803</span>
            <span className="text-mist">•</span>
            <span className="uppercase text-smoke">Commercial Property</span>
          </div>
          <div className="mt-1 flex items-center gap-3">
            <h1 className="text-[26px] font-semibold leading-tight text-ink">Peninsula Marina Group</h1>
            <span className="inline-flex items-center gap-1.5 rounded-full bg-electric/10 px-2.5 py-0.5 text-[11px] font-semibold text-electric">
              <span className="h-1.5 w-1.5 rounded-full bg-electric animate-pulse-dot" /> In Progress
            </span>
          </div>
          <div className="mt-2 flex flex-wrap items-center gap-x-5 gap-y-1 text-[12px] text-smoke">
            <span><span className="text-fog">Broker:</span> <span className="text-ink font-medium">{c.broker.split(" — ")[0]}</span></span>
            <span><span className="text-fog">LOB:</span> <span className="text-ink font-medium">Commercial Property</span></span>
            <span><span className="text-fog">Effective:</span> <span className="text-ink font-medium">08/01/2026</span></span>
            <span><span className="text-fog">Location:</span> <span className="text-ink font-medium">Corpus Christi, TX</span></span>
          </div>
        </div>

        <div className="flex items-stretch gap-5 pt-1">
          <div>
            <div className="text-[10.5px] font-semibold uppercase tracking-[0.14em] text-fog">Current Recommendation</div>
            <div className="mt-1 text-[14.5px] font-semibold text-leaf">Accept with Conditions</div>
          </div>
          <div className="w-px bg-mist/70" />
          <div>
            <div className="text-[10.5px] font-semibold uppercase tracking-[0.14em] text-fog">Confidence</div>
            <div className="mt-1 flex items-center gap-2">
              <ConfidenceRing value={confidence} />
              <span className="text-[16px] font-semibold text-ink tabular-nums">{confidence}%</span>
            </div>
          </div>
          <div className="w-px bg-mist/70" />
          <div>
            <div className="text-[10.5px] font-semibold uppercase tracking-[0.14em] text-fog">Premium Estimate</div>
            <div className="mt-1 text-[16px] font-semibold text-ink">{formatUSD(148200)}</div>
            <div className="mt-0.5 text-[10.5px] text-smoke">vs Benchmark <span className="text-leaf font-semibold">↓ 4%</span></div>
          </div>
        </div>
      </div>
    </div>
  );
}

function ConfidenceRing({ value, trackColor = "var(--mist)" }: { value: number; trackColor?: string }) {
  const r = 14;
  const c = 2 * Math.PI * r;
  const off = c - (value / 100) * c;
  return (
    <svg width="34" height="34" viewBox="0 0 34 34" className="-rotate-90">
      <circle cx="17" cy="17" r={r} stroke={trackColor} strokeWidth="3" fill="none" />
      <circle cx="17" cy="17" r={r} stroke="var(--leaf)" strokeWidth="3" fill="none"
        strokeDasharray={c} strokeDashoffset={off} strokeLinecap="round"
        style={{ transition: "stroke-dashoffset 500ms ease" }} />
    </svg>
  );
}

/* ─────────────────────── Phase Stepper ─────────────────────── */

function PhaseStepper({ active }: { active: PhaseKey }) {
  const activeIdx = PHASES.findIndex((p) => p.key === active);
  return (
    <div className="rounded-2xl border border-mist/70 bg-white px-6 py-5">
      <div className="flex items-start">
        {PHASES.map((p, i) => {
          const done = i < activeIdx;
          const current = i === activeIdx;
          const Icon = p.icon;
          return (
            <div key={p.key} className="flex-1 flex items-start">
              <div className="flex flex-col items-center gap-2 min-w-[70px]" style={{ flex: "0 0 auto" }}>
                <div className={`relative grid h-9 w-9 place-items-center rounded-full border-2 transition-all ${
                  done ? "border-leaf bg-leaf text-white" :
                  current ? "border-electric bg-white text-electric animate-glow-ring" :
                  "border-mist bg-white text-fog"
                }`}>
                  {done ? <CheckCircle2 className="h-4 w-4" /> :
                   current ? <Icon className="h-4 w-4" /> :
                   <Icon className="h-4 w-4" />}
                  {current && <span className="absolute inset-0 rounded-full border-2 border-electric animate-ripple-once pointer-events-none" />}
                </div>
                <div className={`text-[11.5px] text-center leading-tight font-medium ${
                  done ? "text-ink" : current ? "text-electric font-semibold" : "text-fog"
                }`}>
                  {p.label}
                </div>
              </div>
              {i < PHASES.length - 1 && (
                <div className="flex-1 h-[2px] mt-4 mx-1 rounded-full relative overflow-hidden bg-mist/70">
                  {done && <div className="absolute inset-0 bg-leaf" />}
                  {i === activeIdx - 1 && <div className="absolute inset-0 trail-flow" />}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

/* ─────────────────────── Review Findings ─────────────────────── */

function ReviewFindings({
  findings, total, showingFrom, showingTo,
  activeTab, onTab, showDiscOnly, onToggleDisc, query, onQuery,
}: {
  findings: Finding[]; total: number; showingFrom: number; showingTo: number;
  activeTab: Finding["category"] | "all"; onTab: (k: Finding["category"] | "all") => void;
  showDiscOnly: boolean; onToggleDisc: () => void;
  query: string; onQuery: (s: string) => void;
}) {
  return (
    <div className="rounded-2xl border border-mist/70 bg-white overflow-hidden">
      <div className="px-6 pt-5 pb-3 flex items-start gap-4">
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <div className="grid h-7 w-7 place-items-center rounded-lg bg-electric/10 text-electric">
              <Sparkles className="h-3.5 w-3.5" />
            </div>
            <h2 className="text-[19px] font-semibold text-ink">Review Findings</h2>
          </div>
          <p className="mt-1 text-[12.5px] text-smoke">
            AI has extracted and reconciled information across <span className="text-ink font-medium">14 documents</span>.
            Discrepancies are grouped for underwriter review.
          </p>
        </div>
        <div className="flex items-center gap-2 pt-1">
          <div className="relative">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-fog" />
            <input
              value={query}
              onChange={(e) => onQuery(e.target.value)}
              placeholder="Search findings…"
              className="h-8 w-[200px] rounded-full border border-mist bg-white pl-8 pr-3 text-[12px] text-ink placeholder:text-fog focus:border-electric focus:outline-none"
            />
          </div>
          <button className="grid h-8 w-8 place-items-center rounded-full border border-mist bg-white text-smoke hover:text-ink">
            <SlidersHorizontal className="h-3.5 w-3.5" />
          </button>
          <label className="flex items-center gap-2 text-[12px] text-smoke cursor-pointer select-none">
            Show Discrepancies
            <button
              onClick={onToggleDisc}
              className={`relative h-5 w-9 rounded-full transition-colors ${showDiscOnly ? "bg-electric" : "bg-mist"}`}
              aria-pressed={showDiscOnly}
            >
              <span className={`absolute top-0.5 h-4 w-4 rounded-full bg-white shadow transition-all ${showDiscOnly ? "left-4" : "left-0.5"}`} />
            </button>
          </label>
        </div>
      </div>

      <div className="px-6 border-b border-mist/60">
        <div className="flex items-center gap-6 overflow-x-auto">
          {CATEGORY_TABS.map((t) => {
            const isActive = t.key === activeTab;
            return (
              <button key={t.key} onClick={() => onTab(t.key)}
                className={`relative py-3 text-[12.5px] whitespace-nowrap transition-colors ${
                  isActive ? "text-electric font-semibold" : "text-smoke hover:text-ink"
                }`}>
                {t.label}
                {isActive && <span className="absolute -bottom-px left-0 right-0 h-[2px] rounded-full bg-electric" />}
              </button>
            );
          })}
        </div>
      </div>

      <div className="p-6 space-y-5 bg-snow/30">
        {findings.length === 0 && (
          <div className="rounded-xl border border-dashed border-mist bg-white px-6 py-10 text-center text-[13px] text-smoke">
            No findings match this filter.
          </div>
        )}
        {findings.map((f, i) => <FindingCard key={f.id} f={f} delay={i * 60} />)}
      </div>

      <div className="px-6 py-3 flex items-center justify-between border-t border-mist/60 bg-white">
        <div className="text-[11.5px] text-smoke">
          Showing <span className="text-ink font-semibold">{showingFrom}</span>–<span className="text-ink font-semibold">{showingTo}</span> of <span className="text-ink font-semibold">{total}</span> findings
        </div>
        <div className="flex items-center gap-1">
          <button className="grid h-7 w-7 place-items-center rounded-full border border-mist text-smoke hover:text-ink"><ChevronLeft className="h-3.5 w-3.5" /></button>
          {[1, 2, 3].map((n) => (
            <button key={n} className={`h-7 min-w-7 px-2 rounded-full text-[11.5px] font-semibold ${
              n === 1 ? "bg-electric text-white" : "text-smoke hover:text-ink"
            }`}>{n}</button>
          ))}
          <button className="grid h-7 w-7 place-items-center rounded-full border border-mist text-smoke hover:text-ink"><ChevronRight className="h-3.5 w-3.5" /></button>
        </div>
        <div className="text-[11.5px] text-smoke inline-flex items-center gap-1">
          <span className="rounded-md border border-mist bg-white px-2 py-0.5">10 per page</span>
          <ChevronDown className="h-3 w-3 text-fog" />
        </div>
      </div>
    </div>
  );
}

/* ─────────────────────── Finding Card ─────────────────────── */

function FindingCard({ f, delay }: { f: Finding; delay: number }) {
  const badge = verdictBadge(f.verdict);
  const AgentIcon = f.agentIcon;
  return (
    <div className="rounded-2xl border border-mist/70 bg-white overflow-hidden animate-fade-up" style={{ animationDelay: `${delay}ms` }}>
      <div className="flex items-center gap-3 px-5 pt-4">
        <div className="text-[10.5px] font-semibold uppercase tracking-[0.16em] text-fog">{f.eyebrow}</div>
        <span className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10.5px] font-semibold ${badge.cls}`}>
          <badge.Icon className="h-3 w-3" /> {f.verdictLabel}
        </span>
        <span className="ml-auto inline-flex items-center gap-1.5 rounded-full bg-iris/10 px-2 py-0.5 text-[10.5px] font-medium text-iris">
          <AgentIcon className="h-3 w-3" /> analyzed by {f.agentLabel}
        </span>
      </div>
      <div className="px-5 pt-1 pb-4 text-[12.5px] text-smoke">{f.helper}</div>

      {f.sources.length > 0 && (
        <div className="px-5 pb-5 grid grid-cols-3 gap-3">
          {f.sources.map((s, i) => <SourceTile key={i} s={s} />)}
        </div>
      )}

      {f.aggregate && (
        <div className="mx-5 mb-5 rounded-xl border border-mist/70 bg-snow/40 px-4 py-3.5 flex items-center gap-5">
          <div className="flex-1">
            <div className="text-[10.5px] font-semibold uppercase tracking-[0.14em] text-fog">Extracted Value</div>
            <div className="mt-0.5 text-[13.5px] font-semibold text-ink">{f.aggregate.value}</div>
          </div>
          <div className="flex-1">
            <div className="text-[10.5px] font-semibold uppercase tracking-[0.14em] text-fog">Sources ({f.aggregate.sources.length})</div>
            <div className="mt-1 flex flex-wrap gap-1.5">
              {f.aggregate.sources.map((src) => (
                <span key={src} className="inline-flex items-center gap-1 rounded-md border border-mist bg-white px-2 py-0.5 text-[10.5px] text-ink">
                  <FileText className="h-2.5 w-2.5 text-fog" /> {src}
                </span>
              ))}
            </div>
          </div>
          <div className="w-[150px]">
            <div className="text-[10.5px] font-semibold uppercase tracking-[0.14em] text-fog">AI Confidence</div>
            <div className="mt-0.5 flex items-center gap-1.5">
              <div className="flex-1 h-1.5 rounded-full bg-mist/60 overflow-hidden">
                <div className="h-full rounded-full bg-leaf" style={{ width: `${f.aggregate.confidence}%` }} />
              </div>
              <span className="text-[11.5px] font-semibold text-ink tabular-nums">{f.aggregate.confidence}%</span>
            </div>
          </div>
          <button className="rounded-full border border-mist bg-white px-3 py-1.5 text-[11.5px] font-medium text-ink hover:bg-snow inline-flex items-center gap-1.5">
            <FileCheck2 className="h-3 w-3" /> View Details
          </button>
        </div>
      )}

      {f.ai && (
        <div className="mx-5 mb-5 rounded-xl border border-electric/25 bg-gradient-to-br from-ice/40 to-white p-4">
          <div className="flex items-start gap-4">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-1.5 text-[10.5px] font-semibold uppercase tracking-[0.14em] text-electric">
                <Sparkles className="h-3 w-3" /> AI Recommendation
              </div>
              <div className="mt-1 text-[13px] font-semibold text-ink leading-snug">{f.ai.recommendation}</div>
              {f.ai.observation && (
                <div className="mt-1 flex items-start gap-1.5 text-[11.5px] text-smoke">
                  <Info className="h-3 w-3 mt-0.5 text-fog flex-shrink-0" />
                  <span>{f.ai.observation}</span>
                </div>
              )}
            </div>
            <div className="w-[140px] flex-shrink-0">
              <div className="text-[10px] font-semibold uppercase tracking-[0.14em] text-fog">AI Confidence</div>
              <div className="mt-0.5 text-[15px] font-semibold text-electric tabular-nums">{f.ai.confidence}%</div>
              <div className="mt-1 h-1.5 rounded-full bg-mist/60 overflow-hidden">
                <div className="h-full rounded-full bg-gradient-to-r from-electric to-iris" style={{ width: `${f.ai.confidence}%` }} />
              </div>
            </div>
            <div className="flex flex-col gap-1.5 flex-shrink-0">
              <button className="rounded-full bg-electric px-3.5 py-1.5 text-[11.5px] font-semibold text-white hover:bg-electric/90 inline-flex items-center gap-1.5">
                <CheckCircle2 className="h-3 w-3" /> Accept Recommendation
              </button>
              <button className="rounded-full border border-mist bg-white px-3.5 py-1.5 text-[11.5px] font-medium text-ink hover:bg-snow inline-flex items-center gap-1.5">
                <FileCheck2 className="h-3 w-3" /> View Evidence
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function SourceTile({ s }: { s: Source }) {
  const tone = s.tone ?? "neutral";
  const barCls = tone === "match" ? "bg-leaf" : tone === "conflict" ? "bg-[#f5a623]" : "bg-mist";
  const toneChip = tone === "match" ? "bg-leaf/10 text-leaf" : tone === "conflict" ? "bg-[#f5a623]/15 text-[#8a5a00]" : "bg-mist/40 text-smoke";
  return (
    <div className="relative rounded-lg border border-mist/70 bg-white pl-3 pr-2.5 py-2 group hover:border-electric/30 transition-colors">
      <span className={`absolute left-0 top-2 bottom-2 w-[2px] rounded-full ${barCls}`} />
      <div className="flex items-center gap-1.5">
        <FileText className="h-2.5 w-2.5 text-fog flex-shrink-0" />
        <div className="text-[10.5px] font-semibold text-ink truncate">{s.doc}</div>
        {s.page && <span className="text-[9.5px] text-fog whitespace-nowrap">· {s.page}</span>}
        <span className={`ml-auto rounded-full px-1.5 py-[1px] text-[9px] font-semibold uppercase tracking-wider ${toneChip}`}>
          {tone === "match" ? "Match" : tone === "conflict" ? "Diff" : "—"}
        </span>
      </div>
      {s.section && (
        <div className="mt-0.5 text-[9.5px] text-fog truncate">{s.section}</div>
      )}
      <div className="mt-1 text-[11.5px] font-medium text-ink whitespace-pre-line leading-snug line-clamp-2">{s.value}</div>
      <button className="mt-1.5 inline-flex items-center gap-1 text-[10px] font-medium text-electric hover:underline">
        <FileCheck2 className="h-2.5 w-2.5" /> View PDF
      </button>
    </div>
  );
}

function verdictBadge(v: Verdict) {
  switch (v) {
    case "discrepancy": return { cls: "bg-coral/12 text-coral", Icon: AlertTriangle };
    case "mismatch":    return { cls: "bg-[#f5a623]/15 text-[#8a5a00]", Icon: AlertTriangle };
    case "match":       return { cls: "bg-leaf/12 text-leaf", Icon: CheckCircle2 };
    case "missing":     return { cls: "bg-coral/12 text-coral", Icon: Circle };
  }
}

/* ─────────────────────── Mission Control (redesigned) ─────────────────────── */

function MissionControl({
  agents, collapsed, onToggleCollapsed,
}: { agents: Agent[]; collapsed: boolean; onToggleCollapsed: () => void }) {
  const completed = agents.filter((a) => a.status === "completed");
  const running = agents.find((a) => a.status === "running");
  const upcoming = agents.filter((a) => a.status === "queued");
  const [openId, setOpenId] = useState<string | null>(null);

  if (collapsed) {
    const RunningIcon = running?.icon ?? Sparkles;
    return (
      <button
        onClick={onToggleCollapsed}
        title="Expand Mission Control"
        className="sticky top-[76px] flex w-16 flex-col items-center gap-3 self-start overflow-hidden rounded-2xl border border-mist/70 bg-white py-4 shadow-sm transition-colors hover:bg-snow/60"
        style={{ height: "calc(100vh - 96px)" }}
      >
        <span className="grid h-8 w-8 place-items-center rounded-lg bg-electric/10 text-electric">
          <ChevronLeft className="h-4 w-4" />
        </span>
        {running && (
          <span className="relative grid h-10 w-10 place-items-center rounded-xl bg-electric/12 text-electric">
            <RunningIcon className="h-4.5 w-4.5" />
            <span className="absolute -top-0.5 -right-0.5 h-2.5 w-2.5 rounded-full bg-electric animate-pulse-dot ring-2 ring-white" />
          </span>
        )}
        <span className="text-[10px] font-bold uppercase tracking-[0.22em] text-electric [writing-mode:vertical-rl] rotate-180">
          Mission Control
        </span>
        <span className="mt-auto inline-flex items-center gap-1 rounded-full border border-leaf/30 bg-leaf/12 px-1.5 py-1 text-leaf">
          <span className="h-1.5 w-1.5 rounded-full bg-leaf animate-pulse-dot" />
        </span>
      </button>
    );
  }

  return (
    <div
      className="sticky top-[76px] rounded-2xl border border-mist/70 bg-white overflow-hidden self-start shadow-sm flex flex-col"
      style={{ height: "calc(100vh - 96px)" }}
    >
      {/* Header (merged with live-activity banner) */}
      <div className="overflow-hidden bg-gradient-to-br from-ice/80 via-white to-lavender/60 px-5 pt-4 pb-3">
        <div className="flex items-start justify-between gap-2">
          <div>
            <div className="text-[15px] font-bold text-[#0c5a8e]">Mission Control</div>
            <div className="mt-0.5 text-[12px] text-ink/70">AI agents are collaborating in real-time</div>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <span className="inline-flex items-center gap-1 rounded-full bg-leaf/15 border border-leaf/30 px-2 py-0.5 text-[10px] font-semibold text-leaf">
              <span className="h-1.5 w-1.5 rounded-full bg-leaf animate-pulse-dot" /> Live
            </span>
            <button
              onClick={onToggleCollapsed}
              title="Collapse Mission Control"
              className="grid h-6 w-6 place-items-center rounded-full text-electric/70 transition-colors hover:bg-white/60 hover:text-electric"
            >
              <ChevronRight className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>
        {/* Animated data-stream strip — kept clear of the text above so the motion never crosses letters */}
        <div className="relative h-4 mt-2.5 -mx-1 overflow-hidden">
          <DataStreamBanner />
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-5">
        {/* Completed first (per user preference) */}
        {completed.length > 0 && (
          <section>
            <div className="text-[10px] font-bold uppercase tracking-[0.22em] text-fog mb-2 flex items-center gap-1.5">
              Completed <span className="text-fog/70 font-medium normal-case tracking-normal">· {completed.length}</span>
            </div>
            <div className="space-y-1.5">
              {completed.map((a) => (
                <CompletedRow
                  key={a.id}
                  a={a}
                  isOpen={openId === a.id}
                  onToggle={() => setOpenId((id) => (id === a.id ? null : a.id))}
                />
              ))}
            </div>
          </section>
        )}

        {/* Currently running */}
        {running && (
          <section>
            <CurrentAgentCard key={running.id} a={running} />
          </section>
        )}

        {/* Upcoming */}
        {upcoming.length > 0 && (
          <section>
            <div className="text-[10px] font-bold uppercase tracking-[0.22em] text-fog mb-2 flex items-center gap-1.5">
              Upcoming <span className="text-fog/70 font-medium normal-case tracking-normal">· {upcoming.length}</span>
            </div>
            <div className="space-y-1.5">
              {upcoming.map((a) => <QueuedRow key={a.id} a={a} />)}
            </div>
          </section>
        )}

        {/* Agent network */}
        <section className="rounded-xl border border-mist/70 bg-snow/40 px-4 py-3">
          <div className="text-[10px] font-bold uppercase tracking-[0.22em] text-electric mb-2">Agent Network</div>
          <div className="flex items-center gap-3 text-[11.5px] text-smoke">
            <span className="inline-flex items-center gap-1"><span className="h-1.5 w-1.5 rounded-full bg-leaf animate-pulse-dot" />7 Online</span>
            <span className="inline-flex items-center gap-1"><span className="h-1.5 w-1.5 rounded-full bg-electric animate-pulse-dot" />5 Busy</span>
            <span className="inline-flex items-center gap-1"><span className="h-1.5 w-1.5 rounded-full bg-mist" />12 In Queue</span>
          </div>
          <button className="mt-2 text-[11px] font-semibold text-electric hover:underline inline-flex items-center gap-1">
            View all agents <ChevronRight className="h-3 w-3" />
          </button>
        </section>
      </div>

      {/* Ask AI */}
      <div className="border-t border-mist/60 bg-snow/40 px-4 py-3">
        <div className="flex items-center gap-1.5 rounded-full border border-mist bg-white px-3 py-1.5 focus-within:border-electric transition-colors">
          <Sparkles className="h-3.5 w-3.5 text-electric flex-shrink-0" />
          <input placeholder="Ask the agents anything…"
            className="flex-1 bg-transparent text-[12px] focus:outline-none placeholder:text-fog" />
          <button className="grid h-6 w-6 place-items-center rounded-full bg-[#0d111b] text-white"><Send className="h-3 w-3" /></button>
        </div>
      </div>
    </div>
  );
}

function CompletedRow({ a, isOpen, onToggle }: { a: Agent; isOpen: boolean; onToggle: () => void }) {
  const Icon = a.icon;
  return (
    <div className="rounded-xl border border-mist/70 bg-white overflow-hidden animate-fade-up">
      <button
        onClick={onToggle}
        aria-expanded={isOpen}
        className="flex w-full items-center gap-2.5 px-3 py-2 text-left hover:bg-snow/50 transition-colors"
      >
        <div className="grid h-8 w-8 place-items-center rounded-lg bg-leaf/12 text-leaf flex-shrink-0">
          <Icon className="h-4 w-4" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="text-[12px] font-semibold text-ink truncate">{a.name}</div>
          <span className="inline-flex items-center gap-1 rounded-md bg-leaf/12 px-1.5 py-[1px] text-[9.5px] font-semibold text-leaf">
            <CheckCircle2 className="h-2.5 w-2.5" /> Completed
          </span>
        </div>
        {a.time && <div className="text-[10px] text-fog tabular-nums font-mono">{a.time}</div>}
        <ChevronDown className={`h-3.5 w-3.5 text-fog flex-shrink-0 transition-transform ${isOpen ? "rotate-180" : ""}`} />
      </button>
      {isOpen && (
        <div className="border-t border-mist/60 bg-snow/40 px-3.5 py-2.5 space-y-1.5 animate-fade-up">
          {a.lines.map((line, i) => (
            <div key={i} className="flex items-start gap-1.5 text-[11px] font-mono leading-snug">
              <span className={line.tone === "warn" ? "text-[#b5790a]" : "text-leaf"}>›</span>
              <span className="text-smoke">{line.text}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function QueuedRow({ a }: { a: Agent }) {
  const Icon = a.icon;
  return (
    <div className="flex items-center gap-2.5 rounded-xl border border-mist/60 bg-snow/50 px-3 py-2">
      <div className="grid h-8 w-8 place-items-center rounded-lg bg-mist/50 text-smoke">
        <Icon className="h-4 w-4" />
      </div>
      <div className="flex-1 min-w-0">
        <div className="text-[12px] font-medium text-smoke truncate">{a.name}</div>
      </div>
      <span className="inline-flex items-center rounded-md border border-mist bg-white px-1.5 py-[1px] text-[9.5px] font-semibold text-fog uppercase tracking-wider">
        Queued
      </span>
    </div>
  );
}

function CurrentAgentCard({ a }: { a: Agent }) {
  const Icon = a.icon;
  const items = a.steps;
  const [step, setStep] = useState(0);
  const [seconds, setSeconds] = useState(0);

  useEffect(() => {
    // Reveal all checklist items over the course of this agent's phase, so the
    // last one lands right as Mission Control marks the agent "Completed".
    const tick = Math.max(500, Math.floor(PHASE_DURATION_MS / (items.length + 1)));
    const id = window.setInterval(() => {
      setStep((s) => (s >= items.length ? s : s + 1));
      setSeconds((s) => s + Math.round(tick / 1000));
    }, tick);
    return () => window.clearInterval(id);
  }, [items.length]);

  const mm = Math.floor(seconds / 60);
  const ss = (seconds % 60).toString().padStart(2, "0");

  return (
    <div className="relative rounded-2xl border-trail bg-gradient-to-br from-white via-ice/25 to-white p-4">
      <div className="flex items-start gap-3">
        <div className="relative grid h-11 w-11 place-items-center rounded-xl bg-electric/12 text-electric flex-shrink-0">
          <Icon className="h-5 w-5" />
          <span className="absolute inset-0 rounded-xl border-2 border-electric/60 animate-ripple-once pointer-events-none" />
          <span className="absolute -top-0.5 -right-0.5 h-2.5 w-2.5 rounded-full bg-electric animate-pulse-dot ring-2 ring-white" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <div className="text-[13px] font-semibold text-ink truncate">{a.name}</div>
            <div className="ml-auto inline-flex items-center gap-1 text-[10.5px] font-mono font-semibold text-electric tabular-nums">
              <Radio className="h-3 w-3" /> {mm}:{ss}
            </div>
          </div>
          <div className="text-[11.5px] text-smoke">{a.blurb}</div>
        </div>
      </div>

      <div className="mt-3 space-y-1.5 pl-1">
        {items.map((it, i) => {
          const done = i < step;
          const current = i === step;
          return (
            <div
              key={i}
              className={`flex items-center gap-2 text-[12px] transition-colors ${
                current ? "animate-fade-up" : ""
              }`}
            >
              {done ? (
                <CheckCircle2 className="h-3.5 w-3.5 text-leaf flex-shrink-0" />
              ) : current ? (
                <span className="relative h-3.5 w-3.5 grid place-items-center flex-shrink-0">
                  <span className="h-2 w-2 rounded-full bg-electric" />
                  <span className="absolute inset-0 rounded-full border border-electric/60 animate-ripple-once" />
                </span>
              ) : (
                <Circle className="h-3.5 w-3.5 text-mist flex-shrink-0" />
              )}
              <span className={done ? "text-smoke line-through decoration-mist" : current ? "text-ink font-medium" : "text-fog"}>
                {it}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// Horizontal "tracks" with glowing packets traveling left-to-right — reads as
// data/work flowing between agents rather than a static network diagram.
const STREAM_TRACKS = [
  { y: 30, color: "#0098f2", duration: 2.6, delay: 0 },
  { y: 70, color: "#6c56fc", duration: 3.4, delay: 0.8 },
];

function DataStreamBanner() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {STREAM_TRACKS.map((t, i) => (
        <div key={i} className="absolute left-[5%] right-[5%]" style={{ top: `${t.y}%` }}>
          <div
            className="h-px w-full"
            style={{ background: `linear-gradient(90deg, transparent, ${t.color}40, transparent)` }}
          />
          <span
            className="absolute left-0 top-1/2 h-1 w-1 -translate-x-1/2 -translate-y-1/2 rounded-full"
            style={{ background: t.color, boxShadow: `0 0 4px 1px ${t.color}` }}
          />
          <span
            className="absolute right-0 top-1/2 h-1 w-1 translate-x-1/2 -translate-y-1/2 rounded-full"
            style={{ background: t.color, boxShadow: `0 0 4px 1px ${t.color}` }}
          />
          {[0, 1].map((p) => (
            <span
              key={p}
              className="absolute left-0 top-1/2 h-1.5 w-1.5 rounded-full"
              style={{
                background: t.color,
                boxShadow: `0 0 8px 2px ${t.color}`,
                animation: `packet-travel ${t.duration}s linear infinite`,
                animationDelay: `${t.delay + p * (t.duration / 2)}s`,
              }}
            />
          ))}
        </div>
      ))}
    </div>
  );
}


/* ─────────────────────── Floating Ask AI ─────────────────────── */

function AskAiFab({ open, onToggle }: { open: boolean; onToggle: () => void }) {
  return (
    <>
      {open && (
        <div className="fixed bottom-24 right-8 z-40 w-[360px] rounded-2xl border border-mist bg-white shadow-2xl overflow-hidden animate-fade-up">
          <div className="flex items-center gap-2 px-4 py-3 border-b border-mist/60 bg-gradient-to-br from-ice/60 to-white">
            <div className="grid h-7 w-7 place-items-center rounded-lg bg-white text-electric border border-electric/25">
              <Sparkles className="h-3.5 w-3.5" />
            </div>
            <div className="text-[13px] font-semibold text-ink">Ask AI</div>
            <span className="ml-auto text-[10px] font-semibold uppercase tracking-widest text-iris bg-iris/10 px-1.5 py-0.5 rounded">Beta</span>
          </div>
          <div className="p-4 space-y-2 text-[12.5px] text-smoke">
            <p>I'm following this investigation in real time. Ask me anything about the submission.</p>
            <div className="space-y-1.5">
              {["Why is the legal name flagged?", "Explain the address mismatch", "What will CAT Risk check?"].map((s) => (
                <button key={s} className="block w-full text-left rounded-lg border border-mist bg-snow/40 px-3 py-2 text-[12px] hover:border-electric/40 hover:bg-white">
                  {s}
                </button>
              ))}
            </div>
          </div>
          <div className="p-2 border-t border-mist/60 flex items-center gap-2">
            <input placeholder="Ask a question…" className="flex-1 bg-transparent px-2 py-1.5 text-[13px] focus:outline-none" />
            <button className="grid h-8 w-8 place-items-center rounded-full bg-[#0d111b] text-white"><Send className="h-3.5 w-3.5" /></button>
          </div>
        </div>
      )}
      <button
        onClick={onToggle}
        className="fixed bottom-8 right-8 z-40 inline-flex items-center gap-2 rounded-full bg-gradient-to-br from-electric to-iris pl-4 pr-5 py-3 text-white shadow-2xl hover:scale-[1.02] transition-transform"
      >
        <MessagesSquare className="h-4 w-4" />
        <span className="text-[13px] font-semibold">Ask AI</span>
        <span className="absolute inset-0 rounded-full border-2 border-electric/60 animate-ripple-once pointer-events-none" />
      </button>
    </>
  );
}
