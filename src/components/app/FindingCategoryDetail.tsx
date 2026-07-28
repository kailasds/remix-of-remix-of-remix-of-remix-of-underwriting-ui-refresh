import { Fragment, useRef, useState, type ComponentType, type ReactNode } from "react";
import { createPortal } from "react-dom";
import {
  ShieldCheck, MapPin, FileCheck2, DollarSign, History, Handshake, Scale,
  CheckCircle2, Sparkles, ChevronDown, ChevronRight, AlertTriangle, FileText, X,
  Building2, Users, ClipboardCheck, Building, CloudLightning, Layers, Percent,
  TrendingDown, UserCircle, TrendingUp,
} from "lucide-react";
import {
  identityDetail, locationDetail, documentsDetail, coverageDetail, lossDetail,
  brokerDetail, complianceDetail, type FindingStatus, type FieldDiscrepancy,
} from "../../lib/journey";
import type { FindingCategory } from "./JourneySteps";

const STATUS_META: Record<FindingStatus, { label: string; cls: string; dot: string }> = {
  verified: { label: "Verified", cls: "bg-leaf/10 text-leaf border-leaf/25", dot: "bg-leaf" },
  review: { label: "Needs Review", cls: "bg-amber-100/70 text-amber-800 border-amber-300/60", dot: "bg-amber-500" },
  missing: { label: "Missing Info", cls: "bg-coral/10 text-coral border-coral/25", dot: "bg-coral" },
  recommendation: { label: "AI Recommendation", cls: "bg-electric/10 text-electric border-electric/25", dot: "bg-electric" },
};

function ObservationBanner({
  icon: Icon, title, status, observation, recommendation,
}: {
  icon: ComponentType<{ className?: string }>;
  title: string;
  status: FindingStatus;
  observation: string;
  recommendation: string;
}) {
  const meta = STATUS_META[status];
  return (
    <div className="rounded-2xl border border-mist/70 bg-gradient-to-br from-snow/60 to-white p-5">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2 text-[15px] font-semibold text-ink">
          <Icon className="h-4 w-4 text-electric" /> {title}
        </div>
        <span className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-[10.5px] font-semibold ${meta.cls}`}>
          <span className={`h-1.5 w-1.5 rounded-full ${meta.dot}`} /> {meta.label}
        </span>
      </div>
      <p className="mt-2 text-[13.5px] leading-relaxed text-ink">{observation}</p>
      <div className="mt-3 flex items-start gap-1.5 rounded-lg border border-electric/25 bg-ice/30 p-3">
        <Sparkles className="h-3.5 w-3.5 mt-0.5 text-electric shrink-0" />
        <p className="text-[12.5px] leading-relaxed text-ink">{recommendation}</p>
      </div>
    </div>
  );
}

/** Small inline icon that opens a preview of the source document for the value it sits next to. */
function SourceButton({ label, onOpen }: { label: string; onOpen: (label: string) => void }) {
  return (
    <button
      onClick={(e) => { e.stopPropagation(); onOpen(label); }}
      title={`Preview ${label}`}
      className="inline-grid h-5 w-5 shrink-0 place-items-center rounded-md text-fog hover:text-electric hover:bg-ice/50 transition-colors"
    >
      <FileText className="h-3.5 w-3.5" />
    </button>
  );
}

/** Mocked document preview shown when a SourceButton is clicked. */
function SourcePreviewModal({ label, onClose }: { label: string; onClose: () => void }) {
  return (
    <div
      className="fixed inset-0 z-50 grid place-items-center bg-ink/40 p-6"
      onClick={onClose}
    >
      <div
        className="w-full max-w-sm rounded-2xl border border-mist/70 bg-white shadow-xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between gap-2 px-4 py-3 border-b border-mist/60">
          <div className="flex items-center gap-2 min-w-0">
            <FileText className="h-4 w-4 text-electric shrink-0" />
            <span className="text-[13px] font-semibold text-ink truncate">{label}</span>
          </div>
          <button onClick={onClose} className="rounded-md p-1 text-fog hover:text-ink hover:bg-mist/60 shrink-0">
            <X className="h-3.5 w-3.5" />
          </button>
        </div>
        <div className="p-4">
          <div className="h-56 rounded-lg bg-gradient-to-b from-snow to-mist/40 border border-mist/50 overflow-hidden relative">
            <div className="absolute inset-4 space-y-2">
              <div className="h-1.5 rounded bg-mist/80 w-2/3" />
              <div className="h-1 rounded bg-mist/60 w-full mt-3" />
              <div className="h-1 rounded bg-mist/60 w-full" />
              <div className="h-1 rounded bg-mist/60 w-5/6" />
              <div className="h-1 rounded bg-mist/60 w-full mt-3" />
              <div className="h-1 rounded bg-mist/60 w-4/5" />
              <div className="h-1 rounded bg-mist/60 w-full" />
              <div className="h-1 rounded bg-mist/60 w-2/3" />
            </div>
          </div>
          <p className="mt-3 text-[11px] text-smoke">Preview is illustrative — connect a document store to render the live page.</p>
        </div>
      </div>
    </div>
  );
}

/** Inline "why this was flagged / how to resolve it" detail, expanded under a table row. */
function WhyResolvePanel({ reason, resolution, colSpan }: { reason: string; resolution: string; colSpan: number }) {
  return (
    <tr className="bg-snow/40">
      <td colSpan={colSpan} className="px-4 py-3 border-t border-mist/50">
        <div className="grid grid-cols-2 gap-4">
          <div className="flex items-start gap-1.5">
            <AlertTriangle className="h-3.5 w-3.5 mt-0.5 text-amber-600 shrink-0" />
            <div>
              <div className="text-[10px] font-semibold text-fog">Why flagged</div>
              <p className="mt-0.5 text-[12px] text-ink leading-relaxed">{reason}</p>
            </div>
          </div>
          <div className="rounded-lg border border-electric/25 bg-ice/30 p-2.5">
            <div className="flex items-start gap-1.5">
              <Sparkles className="h-3.5 w-3.5 mt-0.5 text-electric shrink-0" />
              <div>
                <div className="text-[10px] font-semibold text-electric">How to resolve</div>
                <p className="mt-0.5 text-[12px] text-ink leading-relaxed">{resolution}</p>
              </div>
            </div>
          </div>
        </div>
      </td>
    </tr>
  );
}

/** Chevron toggle used on rows that have a WhyResolvePanel to expand. */
function ExpandToggle({ open }: { open: boolean }) {
  return open ? (
    <ChevronDown className="h-3.5 w-3.5 text-electric" />
  ) : (
    <ChevronRight className="h-3.5 w-3.5 text-fog" />
  );
}

function MetricRow({ items }: { items: { label: string; value: string }[] }) {
  return (
    <div className={`grid gap-3`} style={{ gridTemplateColumns: `repeat(${items.length}, minmax(0, 1fr))` }}>
      {items.map((m) => (
        <div key={m.label} className="rounded-xl border border-mist/70 bg-white p-3.5">
          <div className="text-[10.5px] font-semibold text-fog">{m.label}</div>
          <div className="mt-1 text-[16px] font-semibold text-ink">{m.value}</div>
        </div>
      ))}
    </div>
  );
}

function LabelValueGrid({
  items, onOpenSource, sourceTag = true,
}: {
  items: { k: string; v: string; source?: string; discrepancy?: FieldDiscrepancy }[];
  onOpenSource?: (label: string) => void;
  /** Show the source as a named tag instead of an icon-only button. */
  sourceTag?: boolean;
}) {
  return (
    <dl className="grid grid-cols-2 gap-x-6 gap-y-2">
      {items.map((r) => (
        <div key={r.k} className="flex items-baseline justify-between gap-2 text-[12.5px] border-b border-mist/40 py-1.5">
          <dt className="text-smoke">{r.k}</dt>
          <dd className="text-ink font-medium text-right flex items-center justify-end gap-1.5">
            {r.v}
            {r.discrepancy && <DiscrepancyWarning discrepancy={r.discrepancy} />}
            {r.source && onOpenSource && (
              sourceTag
                ? <SourceTag label={r.source} onOpen={onOpenSource} />
                : <SourceButton label={r.source} onOpen={onOpenSource} />
            )}
          </dd>
        </div>
      ))}
    </dl>
  );
}

/** Clickable source tag showing the document name, used where the citation itself is worth surfacing inline. */
function SourceTag({ label, onOpen }: { label: string; onOpen: (label: string) => void }) {
  return (
    <button
      onClick={(e) => { e.stopPropagation(); onOpen(label); }}
      title={`Preview ${label}`}
      className="inline-flex min-w-0 max-w-[130px] items-center gap-1 rounded-md border border-mist/70 bg-white px-1.5 py-0.5 text-[10.5px] font-medium text-smoke transition-colors hover:border-electric/40 hover:text-electric"
    >
      <FileText className="h-3 w-3 shrink-0 text-electric" />
      <span className="truncate">{label}</span>
    </button>
  );
}

/** Warning icon shown next to a value with conflicting extractions; hover reveals the conflicting values and AI's pick. */
function DiscrepancyWarning({ discrepancy }: { discrepancy: FieldDiscrepancy }) {
  const [pos, setPos] = useState<{ top: number; right: number } | null>(null);
  const ref = useRef<HTMLSpanElement>(null);
  const tooltipWidth = 256;

  const show = () => {
    const rect = ref.current?.getBoundingClientRect();
    if (!rect) return;
    setPos({ top: rect.bottom + 8, right: Math.max(8, window.innerWidth - rect.right) });
  };

  return (
    <span ref={ref} className="relative inline-flex shrink-0" onMouseEnter={show} onMouseLeave={() => setPos(null)}>
      <AlertTriangle className="h-3.5 w-3.5 text-amber-600 cursor-help" />
      {pos && createPortal(
        <div
          className="fixed z-50 rounded-lg border border-mist/70 bg-white p-3 text-left shadow-lg"
          style={{ top: pos.top, right: pos.right, width: tooltipWidth }}
        >
          <div className="mb-1.5 text-[10px] font-semibold text-amber-700">
            {discrepancy.values.length} different values found
          </div>
          <ul className="mb-2 space-y-1.5">
            {discrepancy.values.map((v, i) => (
              <li key={i} className="text-[11.5px] leading-tight">
                <span className="font-medium text-ink">{v.value}</span>
                <span className="block text-[10px] text-smoke">{v.source}</span>
              </li>
            ))}
          </ul>
          <div className="flex items-start gap-1.5 rounded-md border border-electric/25 bg-ice/30 p-2">
            <Sparkles className="h-3 w-3 mt-0.5 shrink-0 text-electric" />
            <span className="text-[11px] leading-snug text-ink">{discrepancy.recommendation}</span>
          </div>
        </div>,
        document.body
      )}
    </span>
  );
}

function SectionCard({
  title, icon: Icon, tone = "text-electric", children,
}: {
  title: string;
  icon: ComponentType<{ className?: string }>;
  tone?: string;
  children: ReactNode;
}) {
  return (
    <div className="rounded-xl border border-mist/70 bg-white overflow-hidden">
      <div className="flex items-center gap-2 px-4 py-3 border-b border-mist/60 text-[13.5px] font-semibold text-ink">
        <Icon className={`h-4 w-4 shrink-0 ${tone}`} />
        {title}
      </div>
      {children}
    </div>
  );
}

function Chip({ tone, label }: { tone: "leaf" | "amber" | "coral" | "electric" | "smoke"; label: string }) {
  const map: Record<string, string> = {
    leaf: "border-leaf/25 bg-leaf/10 text-leaf",
    amber: "border-amber-300/60 bg-amber-100/70 text-amber-800",
    coral: "border-coral/30 bg-coral/10 text-coral",
    electric: "border-electric/25 bg-electric/10 text-electric",
    smoke: "border-mist bg-snow text-smoke",
  };
  return (
    <span className={`inline-flex items-center rounded-md border px-2 py-0.5 text-[10.5px] font-semibold ${map[tone]}`}>
      {label}
    </span>
  );
}

/* ─────────────── Business Identity ─────────────── */

function IdentitySection() {
  const d = identityDetail;
  const [preview, setPreview] = useState<string | null>(null);
  return (
    <div className="space-y-5">
      <ObservationBanner icon={ShieldCheck} title="Business Identity" status={d.status} observation={d.observation} recommendation={d.recommendation} />
      <SectionCard title="Entity Profile" icon={Building2} tone="text-electric">
        <div className="p-4"><LabelValueGrid items={d.profile} onOpenSource={setPreview} /></div>
      </SectionCard>
      <SectionCard title="Principals & Ownership" icon={Users} tone="text-iris">
        <table className="w-full text-[12px]">
          <thead>
            <tr className="bg-snow/60 text-[12.5px] font-semibold text-ink">
              <th className="text-left px-4 py-2.5">Name</th>
              <th className="text-left px-4 py-2.5">Title</th>
              <th className="text-left px-4 py-2.5">Ownership</th>
              <th className="text-left px-4 py-2.5">Screening</th>
              <th className="px-2 py-2.5" />
            </tr>
          </thead>
          <tbody>
            {d.principals.map((p) => (
              <tr key={p.name} className="border-t border-mist/50">
                <td className="px-4 py-2.5 font-medium text-ink">{p.name}</td>
                <td className="px-4 py-2.5 text-ink">{p.title}</td>
                <td className="px-4 py-2.5 text-ink tabular-nums">{p.ownership}</td>
                <td className="px-4 py-2.5"><Chip tone="leaf" label={p.screening} /></td>
                <td className="px-2 py-2.5"><SourceTag label={p.source} onOpen={setPreview} /></td>
              </tr>
            ))}
          </tbody>
        </table>
      </SectionCard>
      <SectionCard title="Verification Checklist" icon={ClipboardCheck} tone="text-leaf">
        <div className="divide-y divide-mist/50">
          {d.verification.map((v) => (
            <div key={v.check} className="flex items-center gap-2.5 px-4 py-3">
              <CheckCircle2 className="h-3.5 w-3.5 text-leaf shrink-0" />
              <div className="min-w-0 flex-1">
                <div className="text-[12.5px] font-medium text-ink">{v.check}</div>
                <div className="text-[11.5px] text-smoke">{v.result}</div>
              </div>
              <SourceTag label={v.source} onOpen={setPreview} />
            </div>
          ))}
        </div>
      </SectionCard>
      {preview && <SourcePreviewModal label={preview} onClose={() => setPreview(null)} />}
    </div>
  );
}

/* ─────────────── Location & Property ─────────────── */

function LocationSection() {
  const d = locationDetail;
  const [expanded, setExpanded] = useState<string | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const colCount = 10;
  return (
    <div className="space-y-5">
      <ObservationBanner icon={MapPin} title="Location & Property" status={d.status} observation={d.observation} recommendation={d.recommendation} />
      <SectionCard title="Schedule of Locations" icon={MapPin} tone="text-electric">
        <div className="overflow-x-auto">
          <table className="w-full text-[12px]">
            <thead>
              <tr className="bg-snow/60 text-[12.5px] font-semibold text-ink">
                <th className="text-left px-4 py-2.5">Address</th>
                <th className="text-left px-4 py-2.5">Occupancy</th>
                <th className="text-left px-4 py-2.5">Construction</th>
                <th className="text-left px-4 py-2.5">Protection</th>
                <th className="text-left px-4 py-2.5">Built</th>
                <th className="text-left px-4 py-2.5">Sq Ft</th>
                <th className="text-left px-4 py-2.5">TIV</th>
                <th className="text-left px-4 py-2.5">Source</th>
                <th className="text-left px-4 py-2.5">On SOV</th>
                <th className="px-2 py-2.5" />
              </tr>
            </thead>
            <tbody>
              {d.schedule.map((loc) => {
                const flagged = Boolean(loc.reason);
                const isOpen = expanded === loc.address;
                return (
                  <Fragment key={loc.address}>
                    <tr
                      onClick={() => flagged && setExpanded(isOpen ? null : loc.address)}
                      className={`border-t border-mist/50 ${flagged ? "cursor-pointer hover:bg-snow/60" : ""} ${isOpen ? "bg-ice/20" : ""}`}
                    >
                      <td className="px-4 py-2.5">
                        <div className="font-medium text-ink whitespace-nowrap">{loc.address}</div>
                        <div className="text-[10.5px] text-fog">{loc.role}</div>
                      </td>
                      <td className="px-4 py-2.5 text-ink whitespace-nowrap">{loc.occupancy}</td>
                      <td className="px-4 py-2.5 text-ink whitespace-nowrap">{loc.construction}</td>
                      <td className="px-4 py-2.5 text-ink">{loc.protectionClass}</td>
                      <td className="px-4 py-2.5 text-ink tabular-nums">{loc.yearBuilt}</td>
                      <td className="px-4 py-2.5 text-ink tabular-nums whitespace-nowrap">{loc.sqft}</td>
                      <td className="px-4 py-2.5 text-ink tabular-nums whitespace-nowrap">{loc.tiv}</td>
                      <td className="px-4 py-2.5"><SourceTag label={loc.source} onOpen={setPreview} /></td>
                      <td className="px-4 py-2.5">
                        {loc.onSov ? <Chip tone="leaf" label="Yes" /> : <Chip tone="coral" label="Missing" />}
                      </td>
                      <td className="px-2 py-2.5">{flagged && <ExpandToggle open={isOpen} />}</td>
                    </tr>
                    {isOpen && loc.reason && loc.resolution && (
                      <WhyResolvePanel reason={loc.reason} resolution={loc.resolution} colSpan={colCount} />
                    )}
                  </Fragment>
                );
              })}
            </tbody>
          </table>
        </div>
      </SectionCard>
      <div className="grid grid-cols-2 gap-5">
        <SectionCard title="COPE Profile (Primary)" icon={Building} tone="text-amber-600">
          <div className="p-4 space-y-2.5">
            {d.cope.map((c) => (
              <div key={c.label} className="text-[12.5px]">
                <div className="text-[10.5px] font-semibold text-fog">{c.label}</div>
                <div className="mt-0.5 flex items-center justify-between gap-2">
                  <span className="text-ink">{c.value}</span>
                  <SourceTag label={c.source} onOpen={setPreview} />
                </div>
              </div>
            ))}
          </div>
        </SectionCard>
        <SectionCard title="CAT Exposure Summary" icon={CloudLightning} tone="text-coral">
          <div className="p-4 space-y-2.5">
            {d.catExposure.map((c) => (
              <div key={c.label} className="flex items-baseline justify-between gap-2 text-[12.5px] border-b border-mist/40 pb-2 last:border-b-0 last:pb-0">
                <div>
                  <div className="text-smoke">{c.label}</div>
                  <div className="text-ink font-medium">{c.value}</div>
                </div>
                <SourceTag label={c.source} onOpen={setPreview} />
              </div>
            ))}
          </div>
        </SectionCard>
      </div>
      {preview && <SourcePreviewModal label={preview} onClose={() => setPreview(null)} />}
    </div>
  );
}

/* ─────────────── Documents ─────────────── */

function DocumentsSection() {
  const d = documentsDetail;
  const [expanded, setExpanded] = useState<string | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  return (
    <div className="space-y-5">
      <ObservationBanner icon={FileCheck2} title="Document Intelligence" status={d.status} observation={d.observation} recommendation={d.recommendation} />
      <MetricRow items={d.stats} />
      <SectionCard title="Document Checklist" icon={FileCheck2} tone="text-electric">
        <table className="w-full text-[12px]">
          <thead>
            <tr className="bg-snow/60 text-[12.5px] font-semibold text-ink">
              <th className="text-left px-4 py-2.5">Document</th>
              <th className="text-left px-4 py-2.5">Status</th>
              <th className="text-left px-4 py-2.5">Detail</th>
              <th className="text-right px-4 py-2.5">Pages</th>
              <th className="px-2 py-2.5" />
            </tr>
          </thead>
          <tbody>
            {d.checklist.map((doc) => {
              const flagged = Boolean(doc.reason);
              const isOpen = expanded === doc.doc;
              return (
                <Fragment key={doc.doc}>
                  <tr
                    onClick={() => flagged && setExpanded(isOpen ? null : doc.doc)}
                    className={`border-t border-mist/50 ${flagged ? "cursor-pointer hover:bg-snow/60" : ""} ${isOpen ? "bg-ice/20" : ""}`}
                  >
                    <td className="px-4 py-2.5 font-medium text-ink whitespace-nowrap">
                      <div className="flex items-center gap-1.5">
                        <SourceButton label={doc.doc} onOpen={setPreview} />
                        {doc.doc}
                      </div>
                    </td>
                    <td className="px-4 py-2.5">
                      <Chip tone={doc.status === "Received" ? "leaf" : doc.status === "Stale" ? "amber" : "coral"} label={doc.status} />
                    </td>
                    <td className="px-4 py-2.5 text-smoke">{doc.detail}</td>
                    <td className="px-4 py-2.5 text-right text-ink tabular-nums">{doc.pages}</td>
                    <td className="px-2 py-2.5">{flagged && <ExpandToggle open={isOpen} />}</td>
                  </tr>
                  {isOpen && doc.reason && doc.resolution && (
                    <WhyResolvePanel reason={doc.reason} resolution={doc.resolution} colSpan={5} />
                  )}
                </Fragment>
              );
            })}
          </tbody>
        </table>
      </SectionCard>
      {preview && <SourcePreviewModal label={preview} onClose={() => setPreview(null)} />}
    </div>
  );
}

/* ─────────────── Coverage ─────────────── */

function CoverageSection() {
  const d = coverageDetail;
  const [expanded, setExpanded] = useState<string | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const colCount = 8;
  return (
    <div className="space-y-5">
      <ObservationBanner icon={DollarSign} title="Coverage Review" status={d.status} observation={d.observation} recommendation={d.recommendation} />
      <SectionCard title="Schedule of Coverages" icon={DollarSign} tone="text-leaf">
        <div className="overflow-x-auto">
          <table className="w-full text-[12px]">
            <thead>
              <tr className="bg-snow/60 text-[12.5px] font-semibold text-ink">
                <th className="text-left px-4 py-2.5">Coverage Part</th>
                <th className="text-left px-4 py-2.5">Requested</th>
                <th className="text-left px-4 py-2.5">AI Recommended</th>
                <th className="text-left px-4 py-2.5">Deductible</th>
                <th className="text-left px-4 py-2.5">Valuation</th>
                <th className="text-left px-4 py-2.5">Source</th>
                <th className="text-left px-4 py-2.5">Status</th>
                <th className="px-2 py-2.5" />
              </tr>
            </thead>
            <tbody>
              {d.schedule.map((c) => {
                const flagged = Boolean(c.reason);
                const isOpen = expanded === c.part;
                return (
                  <Fragment key={c.part}>
                    <tr
                      onClick={() => flagged && setExpanded(isOpen ? null : c.part)}
                      className={`border-t border-mist/50 ${flagged ? "cursor-pointer hover:bg-snow/60" : ""} ${isOpen ? "bg-ice/20" : ""}`}
                    >
                      <td className="px-4 py-2.5 font-medium text-ink whitespace-nowrap">{c.part}</td>
                      <td className="px-4 py-2.5 text-smoke whitespace-nowrap">{c.requested}</td>
                      <td className="px-4 py-2.5 text-ink font-medium whitespace-nowrap">{c.recommended}</td>
                      <td className="px-4 py-2.5 text-ink whitespace-nowrap">{c.deductible}</td>
                      <td className="px-4 py-2.5 text-ink whitespace-nowrap">{c.valuation}</td>
                      <td className="px-4 py-2.5"><SourceTag label={c.source} onOpen={setPreview} /></td>
                      <td className="px-4 py-2.5">
                        <Chip tone={c.status === "verified" ? "leaf" : c.status === "review" ? "amber" : "electric"} label={STATUS_META[c.status as FindingStatus].label} />
                      </td>
                      <td className="px-2 py-2.5">{flagged && <ExpandToggle open={isOpen} />}</td>
                    </tr>
                    {isOpen && c.reason && c.resolution && (
                      <WhyResolvePanel reason={c.reason} resolution={c.resolution} colSpan={colCount} />
                    )}
                  </Fragment>
                );
              })}
            </tbody>
          </table>
        </div>
        <div className="px-4 py-2.5 border-t border-mist/50 text-[11.5px] text-smoke">Coinsurance: <span className="text-ink font-medium">{d.coinsurance}</span></div>
      </SectionCard>
      <div className="grid grid-cols-2 gap-5">
        <SectionCard title="Sublimits & Endorsements" icon={Layers} tone="text-iris">
          <div className="divide-y divide-mist/50">
            {d.endorsements.map((e) => (
              <div key={e.code} className="px-4 py-2.5">
                <div className="flex items-baseline justify-between gap-2">
                  <span className="text-[12.5px] font-semibold text-ink">{e.name}</span>
                  <span className="text-[10.5px] font-mono text-electric shrink-0">{e.code}</span>
                </div>
                <div className="flex items-center justify-between gap-2">
                  <span className="text-[11.5px] text-smoke">{e.why}</span>
                  <SourceTag label={e.source} onOpen={setPreview} />
                </div>
              </div>
            ))}
          </div>
        </SectionCard>
        <SectionCard title="Deductible Schedule" icon={Percent} tone="text-amber-600">
          <table className="w-full text-[12px]">
            <tbody>
              {d.deductibles.map((p) => (
                <tr key={p.peril} className="border-t border-mist/50 first:border-t-0">
                  <td className="px-4 py-2.5 font-medium text-ink whitespace-nowrap">{p.peril}</td>
                  <td className="px-4 py-2.5 text-ink whitespace-nowrap">{p.deductible}</td>
                  <td className="px-4 py-2.5 text-smoke">{p.basis}</td>
                  <td className="px-2 py-2.5"><SourceTag label={p.source} onOpen={setPreview} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </SectionCard>
      </div>
      {preview && <SourcePreviewModal label={preview} onClose={() => setPreview(null)} />}
    </div>
  );
}

/* ─────────────── Loss History ─────────────── */

function LossSection() {
  const d = lossDetail;
  const [expanded, setExpanded] = useState<string | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const colCount = 9;
  return (
    <div className="space-y-5">
      <ObservationBanner icon={History} title="Loss History" status={d.status} observation={d.observation} recommendation={d.recommendation} />
      <MetricRow items={d.kpis} />
      <SectionCard title="5-Year Loss Run" icon={TrendingDown} tone="text-coral">
        <table className="w-full text-[12px]">
          <thead>
            <tr className="bg-snow/60 text-[12.5px] font-semibold text-ink">
              <th className="text-left px-4 py-2.5">Date of Loss</th>
              <th className="text-left px-4 py-2.5">Cause</th>
              <th className="text-left px-4 py-2.5">Line</th>
              <th className="text-left px-4 py-2.5">Source</th>
              <th className="text-left px-4 py-2.5">Status</th>
              <th className="text-right px-4 py-2.5">Paid</th>
              <th className="text-right px-4 py-2.5">Reserved</th>
              <th className="text-right px-4 py-2.5">Incurred</th>
              <th className="px-2 py-2.5" />
            </tr>
          </thead>
          <tbody>
            {d.claims.map((c) => {
              const flagged = Boolean(c.reason);
              const isOpen = expanded === c.date;
              return (
                <Fragment key={c.date}>
                  <tr
                    onClick={() => flagged && setExpanded(isOpen ? null : c.date)}
                    className={`border-t border-mist/50 ${flagged ? "cursor-pointer hover:bg-snow/60" : ""} ${isOpen ? "bg-ice/20" : ""}`}
                  >
                    <td className="px-4 py-2.5 text-ink tabular-nums whitespace-nowrap">{c.date}</td>
                    <td className="px-4 py-2.5 text-ink whitespace-nowrap">{c.cause}</td>
                    <td className="px-4 py-2.5 text-smoke">{c.line}</td>
                    <td className="px-4 py-2.5"><SourceTag label={c.source} onOpen={setPreview} /></td>
                    <td className="px-4 py-2.5"><Chip tone={c.status === "Open" ? "amber" : "leaf"} label={c.status} /></td>
                    <td className="px-4 py-2.5 text-right text-ink tabular-nums">${c.paid.toLocaleString()}</td>
                    <td className="px-4 py-2.5 text-right text-ink tabular-nums">${c.reserved.toLocaleString()}</td>
                    <td className="px-4 py-2.5 text-right font-semibold text-ink tabular-nums">${c.incurred.toLocaleString()}</td>
                    <td className="px-2 py-2.5">{flagged && <ExpandToggle open={isOpen} />}</td>
                  </tr>
                  {isOpen && c.reason && c.resolution && (
                    <WhyResolvePanel reason={c.reason} resolution={c.resolution} colSpan={colCount} />
                  )}
                </Fragment>
              );
            })}
          </tbody>
          <tfoot className="bg-snow/40">
            <tr className="border-t border-mist/60">
              <td colSpan={7} className="px-4 py-2 text-right text-smoke">Total incurred</td>
              <td className="px-4 py-2 text-right font-semibold text-electric tabular-nums">
                ${d.claims.reduce((s, c) => s + c.incurred, 0).toLocaleString()}
              </td>
              <td />
            </tr>
          </tfoot>
        </table>
      </SectionCard>
      {preview && <SourcePreviewModal label={preview} onClose={() => setPreview(null)} />}
    </div>
  );
}

/* ─────────────── Broker ─────────────── */

function BrokerSection() {
  const d = brokerDetail;
  const [preview, setPreview] = useState<string | null>(null);
  return (
    <div className="space-y-5">
      <ObservationBanner icon={Handshake} title="Broker Review" status={d.status} observation={d.observation} recommendation={d.recommendation} />
      <div className="grid grid-cols-2 gap-5">
        <SectionCard title="Producer Profile" icon={UserCircle} tone="text-electric">
          <div className="p-4"><LabelValueGrid items={d.profile} onOpenSource={setPreview} /></div>
        </SectionCard>
        <SectionCard title="Performance" icon={TrendingUp} tone="text-leaf">
          <div className="p-4 grid grid-cols-2 gap-3">
            {d.metrics.map((m) => (
              <div key={m.label}>
                <div className="text-[10.5px] font-semibold text-fog">{m.label}</div>
                <div className="mt-1 flex items-center gap-1.5">
                  <span className="text-[16px] font-semibold text-ink">{m.value}</span>
                  <SourceTag label={m.source} onOpen={setPreview} />
                </div>
              </div>
            ))}
          </div>
        </SectionCard>
      </div>
      <SectionCard title="Recent Submissions" icon={History} tone="text-iris">
        <table className="w-full text-[12px]">
          <thead>
            <tr className="bg-snow/60 text-[12.5px] font-semibold text-ink">
              <th className="text-left px-4 py-2.5">Reference</th>
              <th className="text-left px-4 py-2.5">Insured</th>
              <th className="text-left px-4 py-2.5">Line</th>
              <th className="text-left px-4 py-2.5">Status</th>
            </tr>
          </thead>
          <tbody>
            {d.recentSubmissions.map((s) => (
              <tr key={s.ref} className="border-t border-mist/50">
                <td className="px-4 py-2.5 font-mono text-[11px] text-ink">{s.ref}</td>
                <td className="px-4 py-2.5 text-ink whitespace-nowrap">{s.insured}</td>
                <td className="px-4 py-2.5 text-smoke whitespace-nowrap">{s.line}</td>
                <td className="px-4 py-2.5">
                  <Chip tone={s.status === "Bound" ? "leaf" : "electric"} label={s.status} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </SectionCard>
      {preview && <SourcePreviewModal label={preview} onClose={() => setPreview(null)} />}
    </div>
  );
}

/* ─────────────── Compliance ─────────────── */

function ComplianceSection() {
  const d = complianceDetail;
  const [preview, setPreview] = useState<string | null>(null);
  return (
    <div className="space-y-5">
      <ObservationBanner icon={Scale} title="Compliance Summary" status={d.status} observation={d.observation} recommendation={d.recommendation} />
      <SectionCard title="Regulatory Checklist" icon={ShieldCheck} tone="text-leaf">
        <div className="divide-y divide-mist/50">
          {d.checklist.map((c) => (
            <div key={c.check} className="flex items-center gap-2.5 px-4 py-3">
              <CheckCircle2 className="h-3.5 w-3.5 text-leaf shrink-0" />
              <div className="min-w-0 flex-1">
                <div className="text-[12.5px] font-medium text-ink">{c.check}</div>
                <div className="text-[11.5px] text-smoke">{c.result}</div>
              </div>
              <SourceTag label={c.source} onOpen={setPreview} />
            </div>
          ))}
        </div>
      </SectionCard>
      {preview && <SourcePreviewModal label={preview} onClose={() => setPreview(null)} />}
    </div>
  );
}

/* ─────────────── Entry point ─────────────── */

export function FindingCategoryDetail({ category }: { category: FindingCategory }) {
  switch (category) {
    case "identity": return <IdentitySection />;
    case "location": return <LocationSection />;
    case "documents": return <DocumentsSection />;
    case "coverage": return <CoverageSection />;
    case "loss": return <LossSection />;
    case "broker": return <BrokerSection />;
    case "compliance": return <ComplianceSection />;
    default: return null;
  }
}
