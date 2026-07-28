import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { Search, Plus, RefreshCw, Filter, ArrowRight, Upload, Database, Building2, FileSpreadsheet, PenLine, X, CheckCircle2, Loader2, Sparkles } from "lucide-react";
import { cases, formatUSD, type CaseRow } from "../lib/mock";
import { Card, Eyebrow, ProgressBar, RiskDot, PillButton } from "../components/app/primitives";
import { FindingPill, type FindingState } from "../components/app/finding";

export const Route = createFileRoute("/_app/queue")({
  head: () => ({ meta: [{ title: "My Queue · Aegis Underwriting" }] }),
  component: Queue,
});

function Queue() {
  const [q, setQ] = useState("");
  const [status, setStatus] = useState("All");
  const [selected, setSelected] = useState<string[]>([]);
  const [openCreate, setOpenCreate] = useState(false);

  const filtered = cases.filter((c) => (status === "All" || c.status === status) && (q === "" || (c.insured + c.ref + c.broker).toLowerCase().includes(q.toLowerCase())));

  return (
    <div className="w-full px-8 py-8">
      <div className="mb-6 flex items-end justify-between animate-fade-up">
        <div>
          <Eyebrow>Submission workspace</Eyebrow>
          <h1 className="mt-2 text-[30px] font-semibold text-ink">My Queue</h1>
          <p className="mt-2 text-[14px] text-smoke">Review assigned submissions or create a new case by uploading supporting documents.</p>
        </div>
        <div className="flex gap-2">
          <PillButton variant="secondary"><RefreshCw className="h-3.5 w-3.5" /> Refresh</PillButton>
          <PillButton onClick={() => setOpenCreate(true)}><Plus className="h-3.5 w-3.5" /> Create case</PillButton>
        </div>
      </div>

      <Card className="overflow-hidden">
        <div className="flex flex-wrap items-center gap-3 border-b border-mist/60 px-6 py-4">
          <div className="relative flex-1 min-w-[280px]">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-fog" />
            <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search reference, insured, or broker…" className="h-10 w-full rounded-full border border-mist bg-white pl-9 pr-4 text-[13px] placeholder:text-fog focus:border-electric focus:outline-none" />
          </div>
          <div className="flex items-center gap-1 rounded-full border border-mist bg-white p-1">
            {(["All", "New", "In Progress", "Approved", "Referred"] as const).map((s) => (
              <button key={s} onClick={() => setStatus(s)} className={`rounded-full px-3 py-1.5 text-[12px] font-medium tracking-tight transition-colors ${status === s ? "bg-[#0d111b] text-white" : "text-smoke hover:text-ink"}`}>{s}</button>
            ))}
          </div>
          <button className="inline-flex items-center gap-1.5 rounded-full border border-mist bg-white px-3 py-2 text-[12px] font-medium text-ink hover:bg-snow"><Filter className="h-3.5 w-3.5" /> Filters</button>
          <div className="ml-auto text-[12px] text-smoke">{filtered.length} submissions</div>
        </div>

        {selected.length > 0 && (
          <div className="flex items-center gap-3 border-b border-electric/30 bg-ice/50 px-6 py-2.5 text-[13px]">
            <span className="font-medium text-ink">{selected.length} selected</span>
            <button className="text-electric hover:underline">Assign</button>
            <button className="text-electric hover:underline">Export</button>
            <button onClick={() => setSelected([])} className="ml-auto text-smoke hover:text-ink">Clear</button>
          </div>
        )}

        <div className="overflow-x-auto">
          <table className="w-full text-[13px]">
            <thead className="sticky top-0">
              <tr className="border-b border-mist/60 bg-snow/60 text-left text-[10.5px] text-fog">
                <th className="w-10 py-3 pl-6 align-middle"><input type="checkbox" checked={selected.length === filtered.length && filtered.length > 0} onChange={(e) => setSelected(e.target.checked ? filtered.map(c => c.id) : [])} className="h-3.5 w-3.5 rounded border-mist accent-electric" /></th>
                <th className="py-3 px-3 font-medium whitespace-nowrap">Reference</th>
                <th className="py-3 px-3 font-medium">Insured</th>
                <th className="py-3 px-3 font-medium">Product</th>
                <th className="py-3 px-3 font-medium whitespace-nowrap">Sum insured</th>
                <th className="py-3 px-3 font-medium">Broker</th>
                <th className="py-3 px-3 font-medium min-w-[80px] whitespace-nowrap">Risk</th>
                <th className="py-3 px-3 font-medium min-w-[160px] whitespace-nowrap">Completeness</th>
                <th className="py-3 px-3 font-medium min-w-[150px] whitespace-nowrap">Status</th>
                <th className="py-3 px-3 font-medium whitespace-nowrap">Due</th>
                <th className="py-3 pr-6 pl-3 font-medium"></th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((c) => (
                <tr key={c.id} className="group border-b border-mist/40 last:border-0 transition-colors hover:bg-snow/60">
                  <td className="py-3 pl-6 align-middle"><input type="checkbox" checked={selected.includes(c.id)} onChange={(e) => setSelected(e.target.checked ? [...selected, c.id] : selected.filter(x => x !== c.id))} className="h-3.5 w-3.5 rounded border-mist accent-electric" /></td>
                  <td className="py-3 px-3 align-middle whitespace-nowrap"><Link to="/case/$id" params={{ id: c.id }} className="font-medium text-electric hover:underline">{c.ref}</Link></td>
                  <td className="py-3 px-3 align-middle font-medium text-ink max-w-[220px] truncate">{c.insured}</td>
                  <td className="py-3 px-3 align-middle max-w-[200px] truncate text-smoke">{c.product}</td>
                  <td className="py-3 px-3 align-middle tabular-nums text-ink whitespace-nowrap">{formatUSD(c.sumInsured)}</td>
                  <td className="py-3 px-3 align-middle max-w-[160px] truncate text-smoke">{c.broker}</td>
                  <td className="py-3 px-3 align-middle"><RiskDot score={c.riskScore} /></td>
                  <td className="py-3 px-3 align-middle">
                    <div className="flex items-center gap-2">
                      <div className="w-20"><ProgressBar value={c.completeness} tone={c.completeness > 80 ? "leaf" : c.completeness > 60 ? "electric" : "coral"} /></div>
                      <span className="tabular-nums text-[12px] text-smoke">{c.completeness}%</span>
                    </div>
                  </td>
                  <td className="py-3 px-3 align-middle"><AIStatus c={c} /></td>
                  <td className="py-3 px-3 align-middle tabular-nums text-[12.5px] text-smoke whitespace-nowrap">{c.due}</td>
                  <td className="py-3 pr-6 pl-3 align-middle">
                    <Link to="/case/$id" params={{ id: c.id }}>
                      <button className={`inline-flex items-center gap-1 rounded-full px-3 py-1.5 text-[12px] font-medium transition-colors ${c.status === "In Progress" ? "bg-[#fff4d6] text-[#8a5a00] hover:bg-[#ffe8b0]" : "bg-[#0d111b] text-white hover:bg-[#1a1f2e]"}`}>
                        {c.status === "In Progress" ? "Resume" : "Process"} <ArrowRight className="h-3 w-3" />
                      </button>
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filtered.length === 0 && (
          <div className="flex flex-col items-center justify-center py-16">
            <div className="grid h-14 w-14 place-items-center rounded-2xl bg-snow"><Search className="h-6 w-6 text-fog" /></div>
            <div className="mt-4 text-[14px] font-medium text-ink">No submissions match</div>
            <div className="mt-1 text-[12px] text-smoke">Try clearing filters or search terms.</div>
          </div>
        )}
      </Card>

      {openCreate && <CreateCaseModal onClose={() => setOpenCreate(false)} />}
    </div>
  );
}

function AIStatus({ c }: { c: CaseRow }) {
  // Map legacy case status + completeness into the AI-first workflow states.
  let state: FindingState = "verified";
  let label = "Ready for Decision";
  if (c.status === "New" && c.completeness < 70) { state = "recommendation"; label = "Waiting for AI"; }
  else if (c.status === "Referred") { state = "recommendation"; label = "AI Recommendation"; }
  else if (c.status === "In Progress" && c.completeness < 80) { state = "review"; label = "Needs Review"; }
  else if (c.status === "In Progress") { state = "review"; label = "Needs Review"; }
  else if (c.status === "Approved") { state = "verified"; label = "Verified"; }
  else if (c.status === "Declined") { state = "missing"; label = "Missing Information"; }
  else if (c.completeness < 60) { state = "missing"; label = "Missing Information"; }
  return <FindingPill state={state} label={label} />;
}



const sources = [
  { key: "upload", label: "Upload documents", desc: "PDF, DOCX, XLSX, PNG, JPG", icon: Upload },
  { key: "salesforce", label: "Salesforce", desc: "Import from Salesforce CRM", icon: Database },
  { key: "guidewire", label: "Guidewire", desc: "Pull from policy admin", icon: Building2 },
  { key: "sharepoint", label: "SharePoint", desc: "Sync from document library", icon: FileSpreadsheet },
  { key: "manual", label: "Manual entry", desc: "Enter details by hand", icon: PenLine },
];

const agents = [
  { name: "Reading ACORD", desc: "Parsing PDF structure" },
  { name: "OCR", desc: "Extracting text from scans" },
  { name: "Business Identification", desc: "Insured, NAICS, FEIN" },
  { name: "Coverage Extraction", desc: "Lines, limits, deductibles" },
  { name: "Loss History", desc: "5-year loss run analysis" },
  { name: "Guideline Matching", desc: "Appetite & exclusions" },
  { name: "Risk Assessment", desc: "Perils, exposures, scoring" },
  { name: "Pricing Analysis", desc: "Rate & premium indication" },
  { name: "Summary Generation", desc: "AI-drafted case brief" },
];

const agentFindings: string[] = [
  "Parsed 12 pages across ACORD 125 and ACORD 140.",
  "Extracted text from 3 scanned pages with high fidelity.",
  "Matched insured on ACORD 125 and 140. Address disagrees between two documents.",
  "Identified 4 coverage lines with consistent limits.",
  "Found 3 loss events over 5 years — no catastrophic claims.",
  "Compared against Coastal Property Appetite v2026.5 — within appetite.",
  "Composite risk 62 · property and flood are the top drivers.",
  "Rate 1.68% — 4% below benchmark for the class.",
  "Prepared brief. 18 verified, 1 needs review, 4 missing items.",
];

function CreateCaseModal({ onClose }: { onClose: () => void }) {
  const [step, setStep] = useState(1);
  const [source, setSource] = useState("upload");
  const [files, setFiles] = useState<{ name: string; size: string }[]>([]);
  const [progress, setProgress] = useState<Record<number, "queued" | "running" | "done">>({});

  function startProcessing() {
    setStep(3);
    const seq = agents.map((_, i) => i);
    seq.forEach((i) => {
      setTimeout(() => setProgress((p) => ({ ...p, [i]: "running" })), 200 + i * 700);
      setTimeout(() => setProgress((p) => ({ ...p, [i]: "done" })), 200 + i * 700 + 900);
    });
    setTimeout(() => setStep(4), 200 + agents.length * 700 + 800);
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#0d111b]/40 backdrop-blur-sm animate-fade-up">
      <div className="flex w-full max-w-[720px] max-h-[85vh] flex-col rounded-3xl bg-white shadow-[0_24px_80px_rgba(15,20,35,.25)] overflow-hidden">
        <div className="px-8 pt-8">
          <div className="mb-6 flex items-start justify-between">
            <div>
              <Eyebrow>Step {step} of 4</Eyebrow>
              <h2 className="mt-1 text-[22px] font-semibold text-ink">
                {step === 1 && "Choose a submission source"}
                {step === 2 && "Upload supporting documents"}
                {step === 3 && "AI agents at work"}
                {step === 4 && "Case created"}
              </h2>
            </div>
            <button onClick={onClose} className="grid h-8 w-8 place-items-center rounded-full text-smoke hover:bg-snow"><X className="h-4 w-4" /></button>
          </div>

          <div className="mb-6 flex gap-1.5">
            {[1, 2, 3, 4].map((s) => (
              <div key={s} className={`h-1 flex-1 rounded-full transition-colors ${s <= step ? "bg-[#0d111b]" : "bg-mist"}`} />
            ))}
          </div>
        </div>

        <div className="flex-1 min-h-0 overflow-y-auto px-8 pb-2">

        {step === 1 && (
          <div className="grid grid-cols-2 gap-3">
            {sources.map((s) => {
              const Icon = s.icon;
              const active = source === s.key;
              return (
                <button key={s.key} onClick={() => setSource(s.key)} className={`flex items-center gap-3 rounded-2xl border p-4 text-left transition-colors ${active ? "border-[#0d111b] bg-snow" : "border-mist hover:bg-snow/50"}`}>
                  <span className={`grid h-10 w-10 place-items-center rounded-xl ${active ? "bg-[#0d111b] text-white" : "bg-snow text-ink"}`}><Icon className="h-4.5 w-4.5" /></span>
                  <div>
                    <div className="text-[14px] font-medium text-ink">{s.label}</div>
                    <div className="text-[12px] text-smoke">{s.desc}</div>
                  </div>
                </button>
              );
            })}
          </div>
        )}

        {step === 2 && (
          <div>
            <label className="flex cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed border-mist bg-snow/40 py-10 transition-colors hover:border-electric hover:bg-ice/30">
              <Upload className="h-6 w-6 text-electric" />
              <div className="mt-3 text-[14px] font-medium text-ink">Drag and drop documents</div>
              <div className="mt-1 text-[12px] text-smoke">or <span className="text-electric">browse from your computer</span></div>
              <input type="file" multiple className="hidden" onChange={(e) => {
                const list = Array.from(e.target.files ?? []).map(f => ({ name: f.name, size: (f.size/1024/1024).toFixed(1) + " MB" }));
                setFiles([...files, ...list]);
              }} />
            </label>
            {files.length === 0 && (
              <button onClick={() => setFiles([{ name: "Acord-125.pdf", size: "1.6 MB" }, { name: "Acord-140.pdf", size: "1.0 MB" }, { name: "Loss-runs-5yr.xlsx", size: "0.4 MB" }])} className="mt-3 text-[12px] text-electric hover:underline">Use sample documents</button>
            )}
            {files.length > 0 && (
              <ul className="mt-4 space-y-2">
                {files.map((f, i) => (
                  <li key={i} className="flex items-center gap-3 rounded-xl border border-mist bg-white px-4 py-2.5 text-[13px]">
                    <span className="grid h-8 w-8 place-items-center rounded-lg bg-blush/40 text-[10px] font-bold text-magenta">PDF</span>
                    <span className="font-medium text-ink">{f.name}</span>
                    <span className="ml-auto text-[12px] text-smoke">{f.size}</span>
                    <CheckCircle2 className="h-4 w-4 text-leaf" />
                  </li>
                ))}
              </ul>
            )}
          </div>
        )}

        {step === 3 && (
          <div className="space-y-2">
            {agents.map((a, i) => {
              const st = progress[i] ?? "queued";
              const finding = agentFindings[i];
              return (
                <div key={a.name} className={`rounded-xl border transition-colors ${st === "done" ? "border-leaf/30 bg-leaf/[0.06]" : st === "running" ? "border-electric/40 bg-ice/40" : "border-mist bg-white"}`}>
                  <div className="flex items-center gap-3 px-4 py-2.5">
                    <span className={`grid h-7 w-7 place-items-center rounded-full ${st === "done" ? "bg-leaf text-white" : st === "running" ? "bg-electric text-white" : "bg-snow text-fog"}`}>
                      {st === "done" ? <CheckCircle2 className="h-3.5 w-3.5" /> : st === "running" ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <span className="h-1.5 w-1.5 rounded-full bg-current" />}
                    </span>
                    <div className="flex-1">
                      <div className="text-[13px] font-medium text-ink">{a.name}</div>
                      <div className="text-[11.5px] text-smoke">{a.desc}</div>
                    </div>
                    {st === "running" && <span className="text-[11px] font-medium text-electric">Reasoning…</span>}
                    {st === "done" && <span className="text-[11px] font-medium text-leaf">Complete</span>}
                  </div>
                  {st === "done" && finding && (
                    <div className="border-t border-leaf/20 px-4 py-2 text-[12px] text-ink animate-fade-up flex items-start gap-2">
                      <Sparkles className="h-3 w-3 text-electric mt-0.5 flex-shrink-0" />
                      <span>{finding}</span>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}

        {step === 4 && (
          <div className="flex flex-col items-center py-8 text-center">
            <div className="grid h-16 w-16 place-items-center rounded-full bg-electric/15"><Sparkles className="h-8 w-8 text-electric" /></div>
            <h3 className="mt-4 text-[20px] font-semibold text-ink">AI completed the first review</h3>
            <p className="mt-1 max-w-md text-[13px] text-smoke">I reviewed all uploaded documents and prepared an underwriting brief. Most information is verified — only a few items need your attention.</p>
            <div className="mt-5 flex gap-2 text-[12px]">
              <FindingPill state="verified" label="18 verified" />
              <FindingPill state="review" label="1 needs review" />
              <FindingPill state="missing" label="4 missing" />
            </div>
            <div className="mt-6 flex gap-2">
              <Link to="/case/$id" params={{ id: "151" }}><PillButton>Open AI Workspace <ArrowRight className="h-3.5 w-3.5" /></PillButton></Link>
              <PillButton variant="secondary" onClick={onClose}>Close</PillButton>
            </div>
          </div>
        )}
        </div>

        <div className="flex items-center justify-between border-t border-mist/60 px-8 py-6">
          <button onClick={onClose} className="text-[13px] text-smoke hover:text-ink">Cancel</button>
          <div className="flex gap-2">
            {step > 1 && step < 4 && <PillButton variant="secondary" onClick={() => setStep(step - 1)}>Back</PillButton>}
            {step === 1 && <PillButton onClick={() => setStep(2)}>Continue <ArrowRight className="h-3.5 w-3.5" /></PillButton>}
            {step === 2 && <PillButton onClick={startProcessing} disabled={files.length === 0}><Sparkles className="h-3.5 w-3.5" /> Start AI processing</PillButton>}
          </div>
        </div>
      </div>
    </div>
  );
}
