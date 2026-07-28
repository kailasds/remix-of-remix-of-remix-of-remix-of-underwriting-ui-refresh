import { Fragment, useMemo, useState, type ComponentType } from "react";
import { createPortal } from "react-dom";
import {
  Sparkles, Search, Layers, DollarSign, Gavel, ClipboardList,
  CheckCircle2, AlertTriangle, Info, Zap, TrendingUp, ShieldCheck, ChevronDown,
  Lightbulb, Compass, MessageSquare, ArrowRight, Filter, ChevronLeft, ChevronRight,
  X, FileCheck2, Loader2, MapPin, History, Handshake, Scale,
} from "lucide-react";
import {
  aiBrief, riskStory, quote, decision, auditTrail,
} from "../../lib/journey";
import { FindingCategoryDetail } from "./FindingCategoryDetail";
import { SourceChip } from "./primitives";


type Step = { id: string; label: string; blurb: string; icon: ComponentType<{ className?: string }> };

// Order: findings → risk → quote → decision → audit → brief (AI Brief is now the
// final step, presented as the AI's synthesized summary after every stage completes).
const STEPS: Step[] = [
  { id: "findings", label: "Review Findings", blurb: "Evidence-backed sections", icon: Search },
  { id: "risk", label: "Risk Story", blurb: "Narrative explanation", icon: Compass },
  { id: "quote", label: "Quote", blurb: "Pricing workspace", icon: DollarSign },
  { id: "decision", label: "Decision", blurb: "Recommendation & conditions", icon: Gavel },
  { id: "audit", label: "Audit Trail", blurb: "Chronological log", icon: ClipboardList },
  { id: "brief", label: "AI Brief", blurb: "Executive summary", icon: Sparkles },
];

// How many phases the journey auto-advances through, and how long each takes.
// Owned by the parent (CaseWorkspace) so Mission Control's agents can be driven
// by the exact same clock — see PHASE_DURATION_MS / STEP_IDS there.
export const STEP_IDS = STEPS.map((s) => s.id);

export function JourneySteps({
  filledCount,
  active,
  onSelect,
}: {
  filledCount: number;
  active: string;
  onSelect: (id: string) => void;
}) {
  return (
    <div className="rounded-2xl border border-mist/70 bg-white overflow-hidden">
      {/* Stepper header */}
      <div className="flex items-stretch border-b border-mist/60 bg-snow/40 overflow-x-auto">
        {STEPS.map((s, i) => {
          const done = i < filledCount;
          const filling = i === filledCount && filledCount < STEPS.length;
          const isActive = active === s.id;
          const Icon = s.icon;
          return (
            <button
              key={s.id}
              onClick={() => onSelect(s.id)}
              className={`group flex-1 min-w-[140px] flex items-center gap-2.5 px-4 py-3.5 border-r border-mist/60 last:border-r-0 transition-all relative ${
                isActive ? "bg-white" : "hover:bg-white/70"
              } ${filling ? "animate-tab-glow z-10 bg-white" : ""}`}
            >
              <div
                className={`grid h-7 w-7 place-items-center rounded-full text-[11px] font-semibold shrink-0 transition-colors ${
                  done ? "bg-leaf text-white" :
                  filling ? "bg-electric text-white" :
                  isActive ? "bg-electric text-white" :
                  "bg-mist/60 text-fog"
                }`}
              >
                {done ? <CheckCircle2 className="h-3.5 w-3.5" /> :
                 filling ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> :
                 <Icon className="h-3.5 w-3.5" />}
              </div>
              <div className="text-left min-w-0">
                <div className={`text-[10px] font-semibold ${filling ? "text-electric" : "text-fog"}`}>
                  {filling ? "Filling…" : done ? "Done" : `Step ${i + 1}`}
                </div>
                <div className={`text-[12.5px] font-semibold truncate ${
                  filling ? "text-electric" :
                  isActive || done ? "text-ink" :
                  "text-smoke"
                }`}>
                  {s.label}
                </div>
              </div>
              {isActive && <span className="absolute inset-x-0 bottom-0 h-[2px] bg-electric" />}
            </button>
          );
        })}
      </div>

      <div key={active} className="p-6 animate-tab-content">
        {active === "brief" && <StepBrief />}
        {active === "findings" && <StepFindings />}
        {active === "risk" && <StepRisk />}
        {active === "quote" && <StepQuote />}
        {active === "decision" && <StepDecision />}
        {active === "audit" && <StepAudit />}
      </div>
    </div>
  );
}


/* ─────────────── Step 1 · Brief ─────────────── */

function StepBrief() {
  const toneMap: Record<string, string> = {
    brand: "from-electric/10 to-white text-electric",
    leaf: "from-leaf/10 to-white text-leaf",
    amber: "from-amber-100 to-white text-amber-700",
  };
  return (
    <div className="space-y-6">
      <div>
        <div className="flex items-center gap-2 text-[11px] font-semibold text-fog">
          <Sparkles className="h-3.5 w-3.5 text-electric" /> Executive AI Summary
        </div>
        <p className="mt-2 text-[14.5px] leading-relaxed text-ink">{aiBrief.headline}</p>
      </div>

      <div className="grid grid-cols-5 gap-3">
        {aiBrief.kpis.map((k) => (
          <div key={k.label} className={`rounded-xl border border-mist/70 bg-gradient-to-br ${toneMap[k.tone] || toneMap.brand} p-3.5`}>
            <div className="text-[10.5px] font-semibold text-fog">{k.label}</div>
            <div className="mt-1 text-[18px] font-semibold text-ink tabular-nums">{k.value}</div>
            <div className="mt-0.5 text-[11px] text-smoke">{k.sub}</div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-2 gap-5">
        <div className="rounded-xl border border-mist/70 bg-snow/40 p-4">
          <div className="text-[11px] font-semibold text-fog">Submission snapshot</div>
          <dl className="mt-3 space-y-1.5">
            {aiBrief.snapshot.map((r) => (
              <div key={r.k} className="flex items-baseline justify-between gap-4 text-[12.5px]">
                <dt className="text-smoke">{r.k}</dt>
                <dd className="text-ink font-medium text-right">{r.v}</dd>
              </div>
            ))}
          </dl>
        </div>
        <div className="rounded-xl border border-electric/25 bg-gradient-to-br from-ice/40 to-white p-4">
          <div className="text-[11px] font-semibold text-fog">Current recommendation</div>
          <div className="mt-1.5 text-[20px] font-semibold text-ink">{aiBrief.recommendation}</div>
          <div className="mt-1 text-[12px] text-smoke">Overall risk rating <span className="font-semibold text-ink">{aiBrief.riskRating}</span></div>
          <div className="mt-3 flex items-center justify-between text-[11.5px]">
            <span className="text-smoke">Confidence</span>
            <span className="font-semibold text-electric tabular-nums">{aiBrief.confidence}%</span>
          </div>
          <div className="mt-1 h-1.5 rounded-full bg-mist/60 overflow-hidden">
            <div className="h-full rounded-full bg-gradient-to-r from-electric to-iris" style={{ width: `${aiBrief.confidence}%` }} />
          </div>
          <div className="mt-4 flex items-center gap-2 text-[12px] text-smoke">
            <TrendingUp className="h-3.5 w-3.5 text-electric" />
            Premium indicated <span className="font-semibold text-ink">${aiBrief.premiumIndicated.toLocaleString()}</span>
            <span>· Rate {aiBrief.rate}% ({aiBrief.benchmarkDelta}% vs class)</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-5">
        <div>
          <div className="flex items-center gap-2 text-[11px] font-semibold text-fog mb-2">
            <AlertTriangle className="h-3.5 w-3.5 text-amber-600" /> Top risks requiring human attention
          </div>
          <div className="space-y-2">
            {aiBrief.topRisks.map((r) => (
              <div key={r.title} className="rounded-xl border border-amber-200/70 bg-amber-50/40 p-3">
                <div className="flex items-center justify-between gap-2">
                  <div className="text-[13px] font-semibold text-ink">{r.title}</div>
                  <span className="text-[10px] font-semibold text-amber-700">{r.severity}</span>
                </div>
                <div className="mt-1 text-[12px] text-smoke leading-relaxed">{r.body}</div>
              </div>
            ))}
          </div>
        </div>
        <div>
          <div className="flex items-center gap-2 text-[11px] font-semibold text-fog mb-2">
            <ShieldCheck className="h-3.5 w-3.5 text-leaf" /> Positive signals
          </div>
          <div className="space-y-2">
            {aiBrief.positives.map((r) => (
              <div key={r.title} className="rounded-xl border border-leaf/25 bg-leaf/[0.05] p-3">
                <div className="text-[13px] font-semibold text-ink">{r.title}</div>
                <div className="mt-1 text-[12px] text-smoke leading-relaxed">{r.body}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-5">
        <div className="rounded-xl border border-mist/70 bg-white p-4">
          <div className="flex items-center gap-2 text-[11px] font-semibold text-fog mb-2">
            <Info className="h-3.5 w-3.5 text-electric" /> Open questions still being investigated
          </div>
          <ul className="space-y-1.5">
            {aiBrief.openQuestions.map((q) => (
              <li key={q} className="flex items-start gap-2 text-[12.5px] text-ink">
                <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-electric shrink-0" /> {q}
              </li>
            ))}
          </ul>
        </div>
        <div className="rounded-xl border border-mist/70 bg-white p-4">
          <div className="flex items-center gap-2 text-[11px] font-semibold text-fog mb-2">
            <Lightbulb className="h-3.5 w-3.5 text-electric" /> AI suggested next actions
          </div>
          <ul className="space-y-1.5">
            {aiBrief.nextActions.map((a) => (
              <li key={a.label} className="flex items-start gap-2 text-[12.5px]">
                <ArrowRight className="h-3.5 w-3.5 mt-0.5 text-electric shrink-0" />
                <span className="text-ink flex-1">{a.label}</span>
                <span className={`text-[10px] font-semibold ${a.priority === "Primary" ? "text-electric" : "text-smoke"}`}>{a.priority}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}

/* ─────────────── Step 2 · Review Findings ─────────────── */

export type FindingCategory =
  | "identity" | "location" | "documents" | "coverage" | "loss" | "broker" | "compliance";
type RowStatus = "review" | "accept" | "accepted";

type ExtractedValueEntry = {
  value: string;
  source: string;
  effective?: string;
  recommended?: boolean;
};

type FindingRowV2 = {
  id: string;
  category: FindingCategory;
  field: string;
  extractedValue: string;
  discrepancyCount: number; // 0 means "No discrepancy"
  sources: string[];
  aiRecommendation: string;
  aiRecommendationSub?: string;
  aiConfidence: number;
  status: RowStatus;
  extractedValues?: ExtractedValueEntry[];
  observation?: string;
  recommendationDetail?: string;
  evidenceDocs?: { label: string; tag?: string; date?: string }[];
};

const FINDING_CATEGORIES: { id: "all" | FindingCategory; label: string; icon: ComponentType<{ className?: string }> }[] = [
  { id: "all", label: "All Findings", icon: ClipboardList },
  { id: "identity", label: "Business Identity", icon: ShieldCheck },
  { id: "location", label: "Location & Property", icon: MapPin },
  { id: "documents", label: "Documents", icon: FileCheck2 },
  { id: "coverage", label: "Coverage", icon: DollarSign },
  { id: "loss", label: "Loss History", icon: History },
  { id: "broker", label: "Broker", icon: Handshake },
  { id: "compliance", label: "Compliance", icon: Scale },
];

const findingRowsV2: FindingRowV2[] = [
  {
    id: "legal-name", category: "identity", field: "Legal Business Name",
    extractedValue: "Coastal Ridge Cold Storage LLC",
    discrepancyCount: 3, sources: ["ACORD 125", "ACORD 140", "COI"],
    aiRecommendation: "Use \u201CCoastal Ridge Cold Storage, LLC\u201D",
    aiRecommendationSub: "(ACORD 125)", aiConfidence: 98, status: "review",
  },
  {
    id: "dba", category: "identity", field: "DBA / Trade Name",
    extractedValue: "Coastal Ridge Distribution",
    discrepancyCount: 2, sources: ["ACORD 125", "Schedule of Locations"],
    aiRecommendation: "Use \u201CCoastal Ridge Distribution\u201D",
    aiRecommendationSub: "(ACORD 125)", aiConfidence: 96, status: "accept",
  },
  {
    id: "primary-address", category: "location", field: "Primary Address",
    extractedValue: "1034 Park Street, Jacksonville, FL 32204",
    discrepancyCount: 2, sources: ["ACORD 125", "Schedule of Locations"],
    aiRecommendation: "Use \u201C1034 Park Street, Jacksonville, FL 32204\u201D",
    aiRecommendationSub: "(Schedule of Locations \u2014 newest)",
    aiConfidence: 98, status: "review",
    extractedValues: [
      { value: "1034 Park Street, Jacksonville, FL 32204", source: "Schedule of Locations (ACORD 125)", effective: "06/01/2024", recommended: true },
      { value: "103 Park St., Jacksonville, FL 32204", source: "ACORD 140 (Property Schedule)", effective: "06/01/2024" },
    ],
    observation:
      "Street suffix differs (\u201CStreet\u201D vs \u201CSt.\u201D), ZIP and city match. The Schedule of Locations is the most recent document and aligns with USPS validation.",
    recommendationDetail:
      "This value is from the most recent source and matches external validation.",
    evidenceDocs: [
      { label: "ACORD 125", tag: "Latest" },
      { label: "ACORD 140", date: "06/01/2024" },
    ],
  },
  {
    id: "year-built", category: "location", field: "Building Year Built",
    extractedValue: "2016",
    discrepancyCount: 2, sources: ["ACORD 140", "Inspection Report"],
    aiRecommendation: "Use \u201C2016\u201D",
    aiRecommendationSub: "(Inspection Report)", aiConfidence: 90, status: "accept",
  },
  {
    id: "roof-age", category: "location", field: "Roof Age",
    extractedValue: "8 years",
    discrepancyCount: 3, sources: ["Inspection Report", "Aerial Imagery", "Appraisal"],
    aiRecommendation: "Use \u201C8 years\u201D",
    aiRecommendationSub: "(Inspection Report \u2014 verified)", aiConfidence: 92, status: "accept",
  },
  {
    id: "construction", category: "location", field: "Construction Type",
    extractedValue: "Masonry",
    discrepancyCount: 0, sources: ["ACORD 140", "Inspection Report"],
    aiRecommendation: "Confirmed", aiConfidence: 99, status: "accepted",
  },
  {
    id: "building-area", category: "location", field: "Building Area (SF)",
    extractedValue: "58,400",
    discrepancyCount: 2, sources: ["ACORD 140", "Appraisal Report"],
    aiRecommendation: "Use \u201C58,400\u201D",
    aiRecommendationSub: "(ACORD 140)", aiConfidence: 95, status: "review",
  },
  {
    id: "ein", category: "identity", field: "EIN",
    extractedValue: "59-3821094",
    discrepancyCount: 0, sources: ["ACORD 125", "IRS CP-575"],
    aiRecommendation: "Confirmed", aiConfidence: 100, status: "accepted",
  },
  {
    id: "naics", category: "identity", field: "NAICS Code",
    extractedValue: "493120",
    discrepancyCount: 0, sources: ["ACORD 125", "SunBiz"],
    aiRecommendation: "Confirmed", aiConfidence: 98, status: "accepted",
  },
  {
    id: "bi-limit", category: "coverage", field: "Business Income Limit",
    extractedValue: "$500,000 (12-mo ALS)",
    discrepancyCount: 1, sources: ["ACORD 140"],
    aiRecommendation: "Increase to $850,000",
    aiRecommendationSub: "(Coverage gap model v4.2)", aiConfidence: 88, status: "review",
  },
  {
    id: "loss-ratio", category: "loss", field: "5-Year Loss Ratio",
    extractedValue: "42%",
    discrepancyCount: 0, sources: ["Chubb Loss Run"],
    aiRecommendation: "Confirmed", aiConfidence: 97, status: "accepted",
  },
  {
    id: "broker-hit", category: "broker", field: "Broker Hit Ratio",
    extractedValue: "31%",
    discrepancyCount: 0, sources: ["Producer File APEX-3421"],
    aiRecommendation: "Confirmed \u2014 top quartile", aiConfidence: 99, status: "accepted",
  },
];

function DiscrepancyChip({ count }: { count: number }) {
  if (count === 0) {
    return (
      <span className="inline-flex items-center whitespace-nowrap rounded-md border border-leaf/25 bg-leaf/10 px-2 py-0.5 text-[10.5px] font-semibold text-leaf">
        No discrepancy
      </span>
    );
  }
  const tone =
    count >= 3
      ? "border-coral/30 bg-coral/10 text-coral"
      : "border-amber-300/60 bg-amber-100/70 text-amber-800";
  return (
    <span className={`inline-flex items-center whitespace-nowrap rounded-md border px-2 py-0.5 text-[10.5px] font-semibold ${tone}`}>
      {count} different values
    </span>
  );
}

function StatusBadge({ status }: { status: RowStatus }) {
  const map: Record<RowStatus, string> = {
    review: "border-amber-300/60 bg-amber-100/70 text-amber-800",
    accept: "border-leaf/25 bg-leaf/10 text-leaf",
    accepted: "border-leaf/40 bg-leaf/15 text-leaf",
  };
  const label = status === "review" ? "Review" : status === "accept" ? "Accept" : "Accepted";
  return (
    <span className={`inline-flex items-center rounded-md border px-2 py-0.5 text-[10.5px] font-semibold ${map[status]}`}>
      {label}
    </span>
  );
}

function SideBySideModal({ row, onClose }: { row: FindingRowV2; onClose: () => void }) {
  const values = row.extractedValues ?? [];
  return createPortal(
    <div className="fixed inset-0 z-50 grid place-items-center bg-ink/40 p-6" onClick={onClose}>
      <div
        className="w-full max-w-3xl rounded-2xl border border-mist/70 bg-white shadow-xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between gap-2 px-5 py-3.5 border-b border-mist/60">
          <div>
            <div className="text-[10px] font-semibold text-fog">Side by Side Comparison</div>
            <div className="text-[14px] font-semibold text-ink">{row.field}</div>
          </div>
          <button onClick={onClose} className="rounded-md p-1.5 text-fog hover:text-ink hover:bg-mist/60">
            <X className="h-4 w-4" />
          </button>
        </div>
        <div className="grid gap-4 p-5" style={{ gridTemplateColumns: `repeat(${Math.max(values.length, 1)}, minmax(0, 1fr))` }}>
          {values.map((v, i) => (
            <div key={i} className={`rounded-xl border p-3 ${v.recommended ? "border-electric/40 bg-ice/20" : "border-mist/70 bg-white"}`}>
              <div className="flex items-center justify-between gap-2">
                <span className="text-[11.5px] font-semibold text-ink truncate">{v.source}</span>
                {v.recommended && (
                  <span className="rounded-md border border-leaf/25 bg-leaf/10 px-1.5 py-0.5 text-[9.5px] font-semibold text-leaf shrink-0">
                    Recommended
                  </span>
                )}
              </div>
              {v.effective && <div className="mt-0.5 text-[10.5px] text-fog">Effective: {v.effective}</div>}
              <div className="mt-2.5 h-40 rounded-lg bg-gradient-to-b from-snow to-mist/40 border border-mist/50 overflow-hidden relative">
                <div className="absolute inset-3 space-y-1.5">
                  <div className="h-1 rounded bg-mist/70 w-full" />
                  <div className="h-1 rounded bg-mist/70 w-5/6" />
                  <div
                    className={`inline-flex h-4 max-w-full items-center truncate rounded px-1.5 text-[9px] font-medium ${
                      v.recommended
                        ? "bg-electric/20 text-[#0c5a8e] ring-1 ring-electric/40"
                        : "bg-amber-200/70 text-amber-900 ring-1 ring-amber-400/60"
                    }`}
                  >
                    {v.value}
                  </div>
                  <div className="h-1 rounded bg-mist/60 w-4/5" />
                  <div className="h-1 rounded bg-mist/60 w-full" />
                  <div className="h-1 rounded bg-mist/60 w-2/3" />
                </div>
              </div>
              <div className="mt-2 text-[12px] font-medium text-ink">{v.value}</div>
            </div>
          ))}
        </div>
        {row.recommendationDetail && (
          <div className="mx-5 mb-5 flex items-start gap-1.5 rounded-lg border border-electric/25 bg-ice/30 p-3">
            <Sparkles className="h-3.5 w-3.5 mt-0.5 text-electric shrink-0" />
            <p className="text-[12px] leading-relaxed text-ink">{row.recommendationDetail}</p>
          </div>
        )}
      </div>
    </div>,
    document.body
  );
}

function ExpandedRow({
  row, onClose, onAccept,
}: {
  row: FindingRowV2;
  onClose: () => void;
  onAccept: () => void;
}) {
  const [compareOpen, setCompareOpen] = useState(false);
  return (
    <tr>
      <td colSpan={6} className="bg-snow/50 border-t border-mist/60 px-0 py-0">
        <div className="grid grid-cols-[1.15fr_1fr_1.1fr_1fr] gap-0 relative animate-in fade-in slide-in-from-top-1 duration-200">
          <button
            onClick={onClose}
            className="absolute top-3 right-3 rounded-md p-1 text-fog hover:text-ink hover:bg-mist/60"
            aria-label="Close"
          >
            <X className="h-3.5 w-3.5" />
          </button>

          {/* Extracted values */}
          <div className="px-5 py-4 border-r border-mist/50">
            <div className="text-[10px] font-semibold text-fog mb-2">
              Extracted Values
            </div>
            <ul className="space-y-3">
              {row.extractedValues?.map((v, i) => (
                <li key={i} className="flex gap-2">
                  <span className={`mt-0.5 h-4 w-4 grid place-items-center rounded-full text-[9px] font-semibold shrink-0 ${
                    v.recommended ? "bg-electric text-white" : "bg-mist/70 text-smoke"
                  }`}>{i + 1}</span>
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-[12px] font-medium text-ink truncate">{v.value}</span>
                      {v.recommended && (
                        <span className="rounded-md border border-leaf/25 bg-leaf/10 px-1.5 py-0.5 text-[9.5px] font-semibold text-leaf">
                          Recommended
                        </span>
                      )}
                    </div>
                    <div className="text-[10.5px] text-smoke mt-0.5">Source: {v.source}</div>
                    {v.effective && (
                      <div className="text-[10.5px] text-fog">Effective: {v.effective}</div>
                    )}
                  </div>
                </li>
              ))}
            </ul>
          </div>

          {/* Observation */}
          <div className="px-5 py-4 border-r border-mist/50">
            <div className="text-[10px] font-semibold text-fog mb-2">
              AI Observation
            </div>
            <p className="text-[12px] text-ink leading-relaxed">{row.observation}</p>
          </div>

          {/* Recommendation */}
          <div className="px-5 py-4 border-r border-mist/50">
            <div className="text-[10px] font-semibold text-fog mb-2">
              AI Recommendation
            </div>
            <div className="rounded-lg border border-electric/25 bg-ice/30 p-3">
              <div className="flex items-start gap-1.5">
                <Sparkles className="h-3.5 w-3.5 mt-0.5 text-electric shrink-0" />
                <div className="text-[12px] font-medium text-ink leading-relaxed">
                  {row.aiRecommendation}
                </div>
              </div>
              <p className="mt-2 text-[11px] text-smoke leading-relaxed">
                {row.recommendationDetail}
              </p>
            </div>
            <button
              onClick={() => { onAccept(); onClose(); }}
              className="mt-3 w-full inline-flex items-center justify-center gap-1.5 rounded-lg bg-electric px-3 py-2 text-[12px] font-semibold text-white hover:bg-electric/90 transition"
            >
              <FileCheck2 className="h-3.5 w-3.5" /> Accept Recommendation
            </button>
          </div>

          {/* Evidence preview */}
          <div className="px-5 py-4">
            <div className="text-[10px] font-semibold text-fog mb-2">
              Evidence Preview
            </div>
            <div className="grid grid-cols-2 gap-2">
              {row.evidenceDocs?.map((d, i) => (
                <div key={i} className="rounded-lg border border-mist/70 bg-white p-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[10.5px] font-semibold text-ink">{d.label}</span>
                    {d.tag && (
                      <span className="rounded bg-electric/10 px-1 py-0.5 text-[9px] font-semibold text-electric">
                        {d.tag}
                      </span>
                    )}
                    {d.date && <span className="text-[9.5px] text-fog">{d.date}</span>}
                  </div>
                  <div className="mt-1.5 h-16 rounded bg-gradient-to-b from-snow to-mist/40 border border-mist/50 overflow-hidden relative">
                    <div className="absolute inset-2 space-y-1">
                      <div className="h-1 rounded bg-mist/80 w-3/4" />
                      <div className="h-1 rounded bg-mist/70 w-full" />
                      <div className="h-1 rounded bg-mist/70 w-5/6" />
                      <div className="h-1 rounded bg-mist/60 w-2/3" />
                      <div className="h-1 rounded bg-mist/60 w-4/5" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <button
              onClick={() => setCompareOpen(true)}
              disabled={!row.extractedValues?.length}
              className="mt-3 w-full inline-flex items-center justify-center gap-1.5 rounded-lg border border-mist bg-white px-3 py-1.5 text-[11.5px] font-medium text-ink hover:bg-snow transition disabled:opacity-40 disabled:pointer-events-none"
            >
              <Layers className="h-3.5 w-3.5" /> View Side by Side
            </button>
          </div>
        </div>
      </td>
      {compareOpen && <SideBySideModal row={row} onClose={() => setCompareOpen(false)} />}
    </tr>
  );
}

function StepFindings() {
  const [rows, setRows] = useState<FindingRowV2[]>(findingRowsV2);
  const [activeCat, setActiveCat] = useState<"all" | FindingCategory>("all");
  const [query, setQuery] = useState("");
  const [showOnlyDiscrepancies, setShowOnlyDiscrepancies] = useState(true);
  const [expandedId, setExpandedId] = useState<string | null>("primary-address");
  const [page, setPage] = useState(1);
  const perPage = 10;

  const handleAccept = (id: string) => {
    setRows((prev) => prev.map((r) => (r.id === id ? { ...r, status: "accepted", discrepancyCount: 0 } : r)));
  };

  const filtered = useMemo(() => {
    return rows.filter((r) => {
      if (activeCat !== "all" && r.category !== activeCat) return false;
      if (showOnlyDiscrepancies && r.discrepancyCount === 0 && r.status === "accepted") return false;
      if (query && !r.field.toLowerCase().includes(query.toLowerCase())) return false;
      return true;
    });
  }, [rows, activeCat, showOnlyDiscrepancies, query]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / perPage));
  const start = (page - 1) * perPage;
  const paged = filtered.slice(start, start + perPage);

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-electric" />
            <h3 className="text-[17px] font-semibold text-ink">Review Findings</h3>
          </div>
          <p className="mt-1 text-[12.5px] text-smoke">
            AI has extracted and verified information from 14 documents.
          </p>
        </div>
        {activeCat === "all" && (
          <div className="flex items-center gap-2">
            <div className="relative">
              <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-fog" />
              <input
                value={query}
                onChange={(e) => { setQuery(e.target.value); setPage(1); }}
                placeholder="Search findings..."
                className="w-56 rounded-lg border border-mist bg-white pl-8 pr-3 py-2 text-[12px] text-ink placeholder:text-fog focus:outline-none focus:ring-2 focus:ring-electric/30 focus:border-electric/40"
              />
            </div>
            <button className="inline-flex items-center gap-1.5 rounded-lg border border-mist bg-white px-3 py-2 text-[12px] font-medium text-ink hover:bg-snow">
              <Filter className="h-3.5 w-3.5" /> Filter
            </button>
            <button
              onClick={() => setShowOnlyDiscrepancies((v) => !v)}
              className="inline-flex items-center gap-2 rounded-lg border border-mist bg-white px-3 py-2 text-[12px] font-medium text-ink hover:bg-snow"
            >
              Show Discrepancies
              <span className={`relative h-4 w-7 rounded-full transition-colors ${showOnlyDiscrepancies ? "bg-electric" : "bg-mist"}`}>
                <span
                  className={`absolute top-0.5 h-3 w-3 rounded-full bg-white shadow transition-all ${
                    showOnlyDiscrepancies ? "left-3.5" : "left-0.5"
                  }`}
                />
              </span>
            </button>
          </div>
        )}
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-1 rounded-t-xl border-b border-mist/60 bg-ice/50 px-2 pt-1 overflow-x-auto overflow-y-hidden">
        {FINDING_CATEGORIES.map((c) => {
          const active = activeCat === c.id;
          const Icon = c.icon;
          return (
            <button
              key={c.id}
              onClick={() => { setActiveCat(c.id); setPage(1); }}
              className={`relative flex items-center gap-1.5 rounded-t-lg px-3 py-2.5 text-[14.5px] font-semibold whitespace-nowrap transition-colors ${
                active ? "bg-white text-electric" : "text-smoke hover:text-ink hover:bg-white/50"
              }`}
            >
              <Icon className="h-3.5 w-3.5" />
              {c.label}
              {active && <span className="absolute inset-x-2 -bottom-px h-[2px] rounded-full bg-electric" />}
            </button>
          );
        })}
      </div>

      {activeCat === "all" ? (
        <>
          {/* Table */}
          <div className="rounded-xl border border-mist/70 overflow-hidden bg-white">
            <table className="w-full text-[12px]">
              <thead>
                <tr className="bg-snow/60 text-[12.5px] font-semibold text-ink">
                  <th className="text-left px-4 py-3 w-[18%]">Field</th>
                  <th className="text-left px-4 py-3 w-[18%]">Extracted Value (AI)</th>
                  <th className="text-left px-4 py-3 w-[13%]">Discrepancy</th>
                  <th className="text-left px-4 py-3 w-[13%]">Sources (Document)</th>
                  <th className="text-left px-4 py-3 w-[24%]">AI Recommendation</th>
                  <th className="text-left px-4 py-3 w-[14%]">Status</th>
                </tr>
              </thead>
              <tbody>
                {paged.map((row) => {
                  const isOpen = expandedId === row.id;
                  return (
                    <Fragment key={row.id}>
                      <tr
                        onClick={() => setExpandedId(isOpen ? null : row.id)}
                        className={`border-t border-mist/50 cursor-pointer transition-colors ${
                          isOpen ? "bg-ice/20" : "hover:bg-snow/60"
                        }`}
                      >

                        <td className="px-4 py-3 font-medium text-ink">
                          <div className="flex items-center gap-1.5 min-w-0">
                            {isOpen ? (
                              <ChevronDown className="h-3.5 w-3.5 text-electric shrink-0" />
                            ) : (
                              <ChevronRight className="h-3.5 w-3.5 text-fog shrink-0" />
                            )}
                            <span className="truncate">{row.field}</span>
                          </div>
                        </td>
                        <td className="px-4 py-3 text-ink">
                          <div className="truncate" title={row.extractedValue}>{row.extractedValue}</div>
                        </td>
                        <td className="px-4 py-3"><DiscrepancyChip count={row.discrepancyCount} /></td>
                        <td className="px-4 py-3">
                          <div className="flex flex-wrap items-center gap-1">
                            {row.sources.slice(0, 1).map((s) => <SourceChip key={s} label={s} />)}
                            {row.sources.length > 1 && (
                              <span className="text-[10.5px] font-semibold text-smoke">+{row.sources.length - 1}</span>
                            )}
                          </div>
                        </td>
                        <td className="px-4 py-3">
                          <div className="truncate text-ink" title={row.aiRecommendation}>{row.aiRecommendation}</div>
                          {row.aiRecommendationSub && (
                            <div className="truncate text-[10.5px] text-fog mt-0.5">{row.aiRecommendationSub}</div>
                          )}
                        </td>
                        <td className="px-4 py-3"><StatusBadge status={row.status} /></td>
                      </tr>
                      {isOpen && row.extractedValues && (
                        <ExpandedRow row={row} onClose={() => setExpandedId(null)} onAccept={() => handleAccept(row.id)} />
                      )}
                    </Fragment>
                  );
                })}
                {paged.length === 0 && (
                  <tr>
                    <td colSpan={6} className="px-4 py-10 text-center text-[12.5px] text-smoke">
                      No findings match your filters.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="flex items-center justify-between text-[12px] text-smoke">
            <div>
              Showing {filtered.length === 0 ? 0 : start + 1} to {Math.min(start + perPage, filtered.length)} of {filtered.length} findings
            </div>
            <div className="flex items-center gap-1">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
                className="h-7 w-7 grid place-items-center rounded-md border border-mist bg-white text-fog hover:text-ink disabled:opacity-40"
              >
                <ChevronLeft className="h-3.5 w-3.5" />
              </button>
              {Array.from({ length: totalPages }).map((_, i) => {
                const n = i + 1;
                const active = n === page;
                return (
                  <button
                    key={n}
                    onClick={() => setPage(n)}
                    className={`h-7 w-7 rounded-md text-[11.5px] font-semibold ${
                      active ? "bg-electric text-white" : "border border-mist bg-white text-smoke hover:text-ink"
                    }`}
                  >
                    {n}
                  </button>
                );
              })}
              <button
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
                className="h-7 w-7 grid place-items-center rounded-md border border-mist bg-white text-fog hover:text-ink disabled:opacity-40"
              >
                <ChevronRight className="h-3.5 w-3.5" />
              </button>
            </div>
            <div>
              <button className="inline-flex items-center gap-1 rounded-md border border-mist bg-white px-2 py-1 text-[11.5px] text-ink">
                {perPage} per page <ChevronDown className="h-3 w-3 text-fog" />
              </button>
            </div>
          </div>
        </>
      ) : (
        <FindingCategoryDetail category={activeCat} />
      )}
    </div>
  );
}

/* ─────────────── Step 3 · Risk Story ─────────────── */

function StepRisk() {
  const toneMap: Record<string, string> = {
    leaf: "border-leaf/25 bg-leaf/[0.05] text-leaf",
    amber: "border-amber-300/60 bg-amber-50/50 text-amber-700",
    coral: "border-coral/25 bg-coral/[0.05] text-coral",
  };
  const maxLoss = Math.max(...riskStory.lossTrends.series.map((s) => s.incurred), 1);
  return (
    <div className="space-y-6">
      <div className="rounded-2xl border border-mist/70 bg-gradient-to-br from-snow/60 to-white p-5">
        <div className="flex items-center gap-2 text-[11px] font-semibold text-fog">
          <Compass className="h-3.5 w-3.5 text-electric" /> Overall risk narrative
        </div>
        <p className="mt-2 text-[14px] leading-relaxed text-ink">{riskStory.narrative}</p>
      </div>

      <div className="grid grid-cols-4 gap-3">
        {riskStory.visualCards.map((c) => (
          <div key={c.label} className={`rounded-xl border p-3.5 ${toneMap[c.tone] || toneMap.leaf}`}>
            <div className="text-[10.5px] font-semibold text-fog">{c.label}</div>
            <div className="mt-1 text-[16px] font-semibold text-ink">{c.value}</div>
            <div className="mt-0.5 text-[11px] text-smoke">{c.detail}</div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-2 gap-5">
        <div className="rounded-xl border border-leaf/25 bg-leaf/[0.05] p-4">
          <div className="text-[11px] font-semibold text-leaf mb-2">Positive factors</div>
          <ul className="space-y-1.5">
            {riskStory.positives.map((p) => (
              <li key={p} className="flex items-start gap-2 text-[12.5px] text-ink">
                <CheckCircle2 className="h-3.5 w-3.5 text-leaf mt-0.5 shrink-0" /> {p}
              </li>
            ))}
          </ul>
        </div>
        <div className="rounded-xl border border-amber-300/60 bg-amber-50/50 p-4">
          <div className="text-[11px] font-semibold text-amber-700 mb-2">Watch items</div>
          <ul className="space-y-1.5">
            {riskStory.watchItems.map((p) => (
              <li key={p} className="flex items-start gap-2 text-[12.5px] text-ink">
                <AlertTriangle className="h-3.5 w-3.5 text-amber-600 mt-0.5 shrink-0" /> {p}
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="rounded-xl border border-mist/70 bg-white p-4">
        <div className="text-[11px] font-semibold text-fog mb-3">Risk drivers (weighted)</div>
        <div className="space-y-2.5">
          {riskStory.drivers.map((d) => (
            <div key={d.name}>
              <div className="flex items-baseline justify-between text-[12px]">
                <span className="text-ink font-medium">{d.name}</span>
                <span className="text-smoke">{d.note} · <span className="text-electric font-semibold tabular-nums">{d.weight}%</span></span>
              </div>
              <div className="mt-1 h-1.5 rounded-full bg-mist/60 overflow-hidden">
                <div className="h-full rounded-full bg-gradient-to-r from-electric to-iris" style={{ width: `${d.weight * 2}%` }} />
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-5">
        <div className="rounded-xl border border-mist/70 bg-white p-4">
          <div className="text-[11px] font-semibold text-fog mb-2">Suggested endorsements</div>
          <div className="space-y-2">
            {riskStory.endorsements.map((e) => (
              <div key={e.code} className="rounded-lg border border-mist/60 bg-snow/40 p-2.5">
                <div className="flex items-baseline justify-between">
                  <div className="text-[12.5px] font-semibold text-ink">{e.name}</div>
                  <span className="text-[10.5px] font-mono text-electric">{e.code}</span>
                </div>
                <div className="text-[11.5px] text-smoke">{e.why}</div>
              </div>
            ))}
          </div>
        </div>
        <div className="rounded-xl border border-mist/70 bg-white p-4">
          <div className="text-[11px] font-semibold text-fog mb-2">Loss trends (5-year)</div>
          <p className="text-[12px] text-smoke leading-relaxed">{riskStory.lossTrends.summary}</p>
          <div className="mt-3 grid grid-cols-6 gap-2 items-end h-[100px]">
            {riskStory.lossTrends.series.map((s) => (
              <div key={s.year} className="flex flex-col items-center gap-1">
                <div className="w-full rounded-t-md bg-gradient-to-t from-electric to-iris" style={{ height: `${(s.incurred / maxLoss) * 80 + 4}px` }} />
                <div className="text-[10px] text-fog">{s.year}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-5">
        {[
          { title: "Property intelligence", body: riskStory.propertyIntel },
          { title: "CAT exposure summary", body: riskStory.catExposure },
          { title: "Fraud assessment", body: riskStory.fraud },
          { title: "Financial assessment", body: riskStory.financial },
          { title: "Compliance summary", body: riskStory.compliance },
        ].map((c) => (
          <div key={c.title} className="rounded-xl border border-mist/70 bg-white p-4">
            <div className="text-[11px] font-semibold text-fog">{c.title}</div>
            <p className="mt-1.5 text-[12.5px] text-ink leading-relaxed">{c.body}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ─────────────── Step 4 · Quote ─────────────── */

function StepQuote() {
  const [ded, setDed] = useState(10);
  const premiumDelta = (10 - ded) * 640;
  const adjusted = quote.recommendedPremium - premiumDelta;
  return (
    <div className="space-y-6">
      <div className="rounded-2xl border border-electric/25 bg-gradient-to-br from-ice/40 to-white p-5">
        <div className="flex items-center gap-2 text-[11px] font-semibold text-electric">
          <Sparkles className="h-3.5 w-3.5" /> AI pricing recommendation
        </div>
        <p className="mt-2 text-[14px] leading-relaxed text-ink">{quote.recommendation}</p>
        <div className="mt-4 grid grid-cols-4 gap-3">
          <div>
            <div className="text-[10.5px] font-semibold text-fog">Recommended premium</div>
            <div className="mt-1 text-[22px] font-semibold text-ink">${quote.recommendedPremium.toLocaleString()}</div>
          </div>
          <div>
            <div className="text-[10.5px] font-semibold text-fog">Rate</div>
            <div className="mt-1 text-[22px] font-semibold text-ink">{quote.rate}%</div>
            <div className="text-[11px] text-smoke">Class benchmark {quote.benchmark}%</div>
          </div>
          <div>
            <div className="text-[10.5px] font-semibold text-fog">Expected loss ratio</div>
            <div className="mt-1 text-[22px] font-semibold text-ink">{quote.expectedLossRatio}%</div>
          </div>
          <div>
            <div className="text-[10.5px] font-semibold text-fog">Expected combined ratio</div>
            <div className="mt-1 text-[22px] font-semibold text-ink">{quote.expectedCombinedRatio}%</div>
          </div>
        </div>
      </div>

      <div className="rounded-xl border border-mist/70 bg-white overflow-hidden">
        <div className="px-4 py-3 border-b border-mist/60 text-[11px] font-semibold text-fog">Coverage breakdown</div>
        <table className="w-full text-[12.5px]">
          <thead className="bg-snow/40 text-smoke">
            <tr>
              <th className="text-left px-4 py-2 font-medium">Coverage line</th>
              <th className="text-left px-4 py-2 font-medium">Limit</th>
              <th className="text-left px-4 py-2 font-medium">Deductible</th>
              <th className="text-right px-4 py-2 font-medium">Premium</th>
            </tr>
          </thead>
          <tbody>
            {quote.coverageSummary.map((c) => (
              <tr key={c.line} className="border-t border-mist/40">
                <td className="px-4 py-2 text-ink font-medium">{c.line}</td>
                <td className="px-4 py-2 text-ink">{c.limit}</td>
                <td className="px-4 py-2 text-smoke">{c.ded}</td>
                <td className="px-4 py-2 text-right text-ink tabular-nums">${c.premium.toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
          <tfoot className="bg-snow/40">
            <tr className="border-t border-mist/60">
              <td colSpan={3} className="px-4 py-2 text-right text-smoke">Subtotal</td>
              <td className="px-4 py-2 text-right font-semibold text-ink tabular-nums">${quote.breakdown.subtotal.toLocaleString()}</td>
            </tr>
            <tr>
              <td colSpan={3} className="px-4 py-1 text-right text-smoke">Surplus lines tax (4.94%)</td>
              <td className="px-4 py-1 text-right text-ink tabular-nums">${quote.breakdown.surplusLinesTax.toLocaleString()}</td>
            </tr>
            <tr>
              <td colSpan={3} className="px-4 py-1 text-right text-smoke">Stamping fee</td>
              <td className="px-4 py-1 text-right text-ink tabular-nums">${quote.breakdown.stampingFee}</td>
            </tr>
            <tr>
              <td colSpan={3} className="px-4 py-1 text-right text-smoke">Broker commission (15%)</td>
              <td className="px-4 py-1 text-right text-ink tabular-nums">${quote.breakdown.brokerCommission.toLocaleString()}</td>
            </tr>
            <tr className="border-t border-mist/60">
              <td colSpan={3} className="px-4 py-2 text-right font-semibold text-ink">Total to broker</td>
              <td className="px-4 py-2 text-right font-semibold text-electric tabular-nums">${quote.breakdown.total.toLocaleString()}</td>
            </tr>
          </tfoot>
        </table>
      </div>

      <div className="grid grid-cols-2 gap-5">
        <div className="rounded-xl border border-mist/70 bg-white p-4">
          <div className="text-[11px] font-semibold text-fog">Deductible sensitivity</div>
          <div className="mt-3 flex items-center gap-3">
            <span className="text-[11.5px] text-smoke">AOP deductible</span>
            <input type="range" min={5} max={50} step={5} value={ded} onChange={(e) => setDed(Number(e.target.value))} className="flex-1 accent-electric" />
            <span className="text-[12.5px] font-semibold text-ink tabular-nums">${(ded * 1000).toLocaleString()}</span>
          </div>
          <div className="mt-3 rounded-lg bg-snow/40 p-3">
            <div className="text-[11px] text-smoke">Adjusted premium impact</div>
            <div className="mt-0.5 text-[18px] font-semibold text-ink tabular-nums">${adjusted.toLocaleString()}
              <span className={`ml-2 text-[12px] font-medium ${premiumDelta >= 0 ? "text-leaf" : "text-coral"}`}>
                {premiumDelta >= 0 ? "−" : "+"}${Math.abs(premiumDelta).toLocaleString()}
              </span>
            </div>
          </div>
        </div>
        <div className="rounded-xl border border-mist/70 bg-white p-4">
          <div className="text-[11px] font-semibold text-fog mb-2">Benchmark comparison</div>
          <div className="space-y-2">
            <div className="flex items-center gap-3">
              <div className="w-28 text-[11.5px] text-smoke">This risk</div>
              <div className="flex-1 h-2 rounded-full bg-mist/50 overflow-hidden"><div className="h-full bg-electric" style={{ width: `${(quote.rate / 2.4) * 100}%` }} /></div>
              <div className="w-14 text-right text-[12px] font-semibold text-ink tabular-nums">{quote.rate}%</div>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-28 text-[11.5px] text-smoke">Class benchmark</div>
              <div className="flex-1 h-2 rounded-full bg-mist/50 overflow-hidden"><div className="h-full bg-fog" style={{ width: `${(quote.benchmark / 2.4) * 100}%` }} /></div>
              <div className="w-14 text-right text-[12px] font-semibold text-ink tabular-nums">{quote.benchmark}%</div>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-28 text-[11.5px] text-smoke">Southeast avg</div>
              <div className="flex-1 h-2 rounded-full bg-mist/50 overflow-hidden"><div className="h-full bg-fog/70" style={{ width: `${(2.05 / 2.4) * 100}%` }} /></div>
              <div className="w-14 text-right text-[12px] font-semibold text-ink tabular-nums">2.05%</div>
            </div>
          </div>
        </div>
      </div>

      <div>
        <div className="text-[11px] font-semibold text-fog mb-2">Alternative pricing options</div>
        <div className="grid grid-cols-3 gap-3">
          {quote.alternatives.map((a) => {
            const rec = a.tier.startsWith("Balanced");
            return (
              <div key={a.tier} className={`rounded-xl border p-4 ${rec ? "border-electric/40 bg-ice/20" : "border-mist/70 bg-white"}`}>
                <div className="flex items-center justify-between">
                  <div className="text-[12.5px] font-semibold text-ink">{a.tier}</div>
                  {rec && <span className="text-[10px] font-semibold text-electric">AI pick</span>}
                </div>
                <div className="mt-2 text-[20px] font-semibold text-ink tabular-nums">${a.premium.toLocaleString()}</div>
                <div className="text-[11px] text-smoke">Rate {a.rate}% · {a.ded}</div>
                <p className="mt-2 text-[11.5px] text-smoke leading-relaxed">{a.notes}</p>
              </div>
            );
          })}
        </div>
      </div>

      <div className="rounded-xl border border-mist/70 bg-snow/40 p-4">
        <div className="text-[11px] font-semibold text-fog mb-2">AI pricing reasoning</div>
        <ul className="space-y-1">
          {quote.reasoning.map((r) => (
            <li key={r} className="flex items-start gap-2 text-[12.5px] text-ink">
              <Zap className="h-3 w-3 mt-1 text-electric shrink-0" /> {r}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

/* ─────────────── Step 5 · Decision ─────────────── */

function StepDecision() {
  return (
    <div className="space-y-6">
      <div className="rounded-2xl border border-electric/25 bg-gradient-to-br from-ice/40 to-white p-5">
        <div className="flex items-center gap-2 text-[11px] font-semibold text-electric">
          <Gavel className="h-3.5 w-3.5" /> Decision Agent — final recommendation
        </div>
        <div className="mt-2 flex items-baseline gap-3">
          <div className="text-[26px] font-semibold text-ink">{decision.recommendation}</div>
          <div className="text-[13px] text-electric font-semibold">Confidence {decision.confidence}%</div>
        </div>
        <p className="mt-2 text-[13.5px] leading-relaxed text-ink">{decision.summary}</p>
        <div className="mt-4 flex flex-wrap gap-2">
          <button className="rounded-full bg-leaf px-4 py-2 text-[12.5px] font-semibold text-white">Approve</button>
          <button className="rounded-full bg-[#0d111b] px-4 py-2 text-[12.5px] font-semibold text-white">Modify Conditions</button>
          <button className="rounded-full border border-mist bg-white px-4 py-2 text-[12.5px] font-medium text-smoke hover:text-ink">Refer to Senior UW</button>
          <button className="rounded-full border border-mist bg-white px-4 py-2 text-[12.5px] font-medium text-smoke hover:text-ink">Challenge AI</button>
          <button className="rounded-full border border-electric/30 bg-white px-4 py-2 text-[12.5px] font-medium text-electric hover:bg-ice/30 inline-flex items-center gap-1.5">
            <MessageSquare className="h-3.5 w-3.5" /> Discuss with AI
          </button>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div className="rounded-xl border border-leaf/25 bg-leaf/[0.05] p-4">
          <div className="text-[11px] font-semibold text-leaf mb-2">Supporting factors</div>
          <ul className="space-y-1.5">
            {decision.supporting.map((s) => (
              <li key={s} className="flex items-start gap-2 text-[12px] text-ink">
                <CheckCircle2 className="h-3 w-3 text-leaf mt-1 shrink-0" /> {s}
              </li>
            ))}
          </ul>
        </div>
        <div className="rounded-xl border border-coral/25 bg-coral/[0.05] p-4">
          <div className="text-[11px] font-semibold text-coral mb-2">Blocking issues</div>
          <ul className="space-y-1.5">
            {decision.blocking.map((s) => (
              <li key={s} className="flex items-start gap-2 text-[12px] text-ink">
                <AlertTriangle className="h-3 w-3 text-coral mt-1 shrink-0" /> {s}
              </li>
            ))}
          </ul>
        </div>
        <div className="rounded-xl border border-amber-300/60 bg-amber-50/50 p-4">
          <div className="text-[11px] font-semibold text-amber-700 mb-2">Remaining uncertainty</div>
          <ul className="space-y-1.5">
            {decision.uncertainty.map((s) => (
              <li key={s} className="flex items-start gap-2 text-[12px] text-ink">
                <Info className="h-3 w-3 text-amber-600 mt-1 shrink-0" /> {s}
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="rounded-xl border border-mist/70 bg-white p-4">
          <div className="text-[11px] font-semibold text-fog mb-2">Conditions before binding</div>
          <ul className="space-y-1.5">
            {decision.conditionsBind.map((c) => (
              <li key={c} className="flex items-start gap-2 text-[12.5px] text-ink">
                <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-electric shrink-0" /> {c}
              </li>
            ))}
          </ul>
        </div>
        <div className="rounded-xl border border-mist/70 bg-white p-4">
          <div className="text-[11px] font-semibold text-fog mb-2">Conditions after binding</div>
          <ul className="space-y-1.5">
            {decision.conditionsPost.map((c) => (
              <li key={c} className="flex items-start gap-2 text-[12.5px] text-ink">
                <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-iris shrink-0" /> {c}
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="rounded-xl border border-mist/70 bg-snow/40 p-4">
          <div className="text-[11px] font-semibold text-fog mb-2">Pricing justification</div>
          <p className="text-[12.5px] leading-relaxed text-ink">{decision.pricingJustification}</p>
          <div className="mt-3 text-[10.5px] font-semibold text-fog">Suggested endorsements</div>
          <div className="mt-1.5 flex flex-wrap gap-1.5">
            {decision.endorsements.map((e) => (
              <span key={e} className="rounded-full border border-electric/25 bg-white px-2.5 py-0.5 text-[11px] font-mono text-electric">{e}</span>
            ))}
          </div>
        </div>
        <div className="rounded-xl border border-mist/70 bg-snow/40 p-4">
          <div className="text-[11px] font-semibold text-fog mb-2">Why AI chose this recommendation</div>
          <p className="text-[12.5px] leading-relaxed text-ink">{decision.reasoning}</p>
          <div className="mt-3 rounded-lg border border-mist/60 bg-white p-3">
            <div className="text-[10.5px] font-semibold text-fog">Alternative considered</div>
            <div className="text-[12.5px] font-semibold text-ink">{decision.alternative.label}</div>
            <div className="text-[11.5px] text-smoke leading-relaxed">{decision.alternative.reason}</div>
          </div>
        </div>
      </div>

      <div className="rounded-xl border border-mist/70 bg-white p-4">
        <div className="text-[11px] font-semibold text-fog mb-1">Human review notes</div>
        <p className="text-[12.5px] leading-relaxed text-ink">{decision.humanNotes}</p>
      </div>
    </div>
  );
}

/* ─────────────── Step 6 · Audit Trail ─────────────── */

function StepAudit() {
  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-[11px] font-semibold text-fog">
          <ClipboardList className="h-3.5 w-3.5 text-electric" /> Chronological investigation notebook
        </div>
        <div className="text-[11.5px] text-smoke">{auditTrail.length} entries · started 09:40:12</div>
      </div>
      <div className="rounded-2xl border border-mist/70 bg-white overflow-hidden">
        <div className="divide-y divide-mist/50">
          {auditTrail.map((e, i) => (
            <div key={i} className="grid grid-cols-[80px_180px_1fr_120px] gap-3 px-4 py-3 hover:bg-snow/40">
              <div className="text-[11.5px] font-mono text-smoke tabular-nums">{e.time}</div>
              <div className="text-[12.5px] font-semibold text-ink">{e.agent}</div>
              <div>
                <div className="text-[12.5px] text-ink">{e.action}</div>
                {e.evidence && <div className="text-[11.5px] text-smoke mt-0.5">Evidence · {e.evidence}</div>}
                {e.recommendation && <div className="text-[11.5px] text-electric mt-0.5">Rec · {e.recommendation}</div>}
              </div>
              <div className="text-right">
                {typeof e.confidenceDelta === "number" && (
                  <div className="text-[11px] font-semibold text-leaf tabular-nums">+{e.confidenceDelta}%</div>
                )}
                {typeof e.confidence === "number" && (
                  <div className="text-[10.5px] text-smoke tabular-nums">Total {e.confidence}%</div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
