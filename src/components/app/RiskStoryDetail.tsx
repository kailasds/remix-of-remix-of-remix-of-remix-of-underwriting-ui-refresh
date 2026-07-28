import { useState, type ComponentType } from "react";
import {
  Sparkles, MessageSquare, ChevronDown, ChevronRight, TrendingUp, TrendingDown, Minus,
  Compass, CheckCircle2, AlertTriangle, Building2, Flame, Droplet, Bell, Lock, Zap,
  Database, ShieldCheck, CircleCheck,
} from "lucide-react";
import {
  riskStory, riskScorecard, riskPropertyProfile, riskProtectionsPanel, riskDataSourcesPanel,
  type Peril, type AiInsight, type PerilBand, type FactorDirection,
} from "../../lib/journey";

/* ─────────────── Shared bits ─────────────── */

const BAND_COLOR: Record<PerilBand, string> = { low: "#5d9c06", moderate: "#f5a623", high: "#ff6363" };
const BAND_LABEL: Record<PerilBand, string> = { low: "LOW", moderate: "MODERATE", high: "HIGH" };
const BAND_CLS: Record<PerilBand, string> = {
  low: "bg-leaf/10 text-leaf border-leaf/25",
  moderate: "bg-amber-100/70 text-amber-800 border-amber-300/60",
  high: "bg-coral/10 text-coral border-coral/25",
};

function badgeTone(badge: string): PerilBand {
  const b = badge.toLowerCase();
  if (b.includes("low")) return "low";
  if (b.includes("high")) return "high";
  return "moderate";
}

/** Right-rail AI synthesis panel, mirrored across every Risk Story sub-section. */
function AiInsightPanel({ insight }: { insight: AiInsight }) {
  const tone = badgeTone(insight.badge);
  return (
    <div className="rounded-2xl border border-electric/25 bg-gradient-to-br from-ice/40 to-white p-4 self-start sticky top-4">
      <div className="flex flex-wrap items-center gap-2">
        <Sparkles className="h-3.5 w-3.5 text-electric shrink-0" />
        <span className="text-[10px] font-bold tracking-wide text-electric">AI SUMMARY</span>
        <span className={`inline-flex items-center rounded-full border px-2 py-0.5 text-[10px] font-semibold ${BAND_CLS[tone]}`}>
          {insight.badge}
        </span>
        <span className="ml-auto text-[10px] font-semibold text-fog tabular-nums">{insight.confidence}% CONFIDENCE</span>
      </div>
      <p className="mt-3 text-[12.5px] leading-relaxed text-ink">{insight.body}</p>
      <ul className="mt-3 space-y-1.5">
        {insight.bullets.map((b, i) => (
          <li key={i} className="flex items-start gap-1.5 text-[11.5px] leading-snug text-smoke">
            <span className="mt-[5px] h-1 w-1 shrink-0 rounded-full bg-electric" /> {b}
          </li>
        ))}
      </ul>
      <div className="mt-4 border-t border-mist/50 pt-3">
        <div className="mb-1.5 flex items-center gap-1.5 text-[10px] font-semibold text-fog">
          <MessageSquare className="h-3 w-3" /> ASK A FOLLOW-UP QUESTION
        </div>
        <input
          placeholder="e.g. why is wind/hail flagged?"
          className="w-full rounded-full border border-mist bg-white px-3 py-1.5 text-[11.5px] text-ink placeholder:text-fog focus:border-electric/50 focus:outline-none"
        />
      </div>
    </div>
  );
}

function RiskGauge({ score, band }: { score: number; band: PerilBand }) {
  const color = BAND_COLOR[band];
  const deg = Math.max(0, Math.min(100, score)) * 3.6;
  return (
    <div
      className="relative grid h-[92px] w-[92px] shrink-0 place-items-center rounded-full"
      style={{ background: `conic-gradient(${color} ${deg}deg, #e5e9f0 ${deg}deg 360deg)` }}
    >
      <div className="grid h-[74px] w-[74px] place-items-center rounded-full bg-white text-center">
        <div>
          <div className="text-[22px] font-bold leading-none text-ink tabular-nums">{score}</div>
          <div className="mt-1 text-[9px] font-bold tracking-wide" style={{ color }}>{BAND_LABEL[band]}</div>
        </div>
      </div>
    </div>
  );
}

function PerilMiniBar({ p }: { p: Peril }) {
  const color = BAND_COLOR[p.band];
  return (
    <div>
      <div className="flex items-baseline justify-between gap-2 text-[12px]">
        <span className="font-medium text-ink">{p.label}</span>
        <span className="font-semibold tabular-nums" style={{ color }}>{p.score}</span>
      </div>
      <div className="mt-1 h-1.5 overflow-hidden rounded-full bg-mist/50">
        <div className="h-full rounded-full transition-all" style={{ width: `${p.score}%`, background: color }} />
      </div>
    </div>
  );
}

function DirectionTag({ direction }: { direction: FactorDirection }) {
  if (direction === "increases") {
    return <span className="inline-flex items-center gap-1 text-[11px] font-medium text-coral"><TrendingUp className="h-3 w-3" /> Increases risk</span>;
  }
  if (direction === "reduces") {
    return <span className="inline-flex items-center gap-1 text-[11px] font-medium text-leaf"><TrendingDown className="h-3 w-3" /> Reduces risk</span>;
  }
  return <span className="inline-flex items-center gap-1 text-[11px] font-medium text-fog"><Minus className="h-3 w-3" /> Neutral</span>;
}

function PerilAccordion({ p, open, onToggle }: { p: Peril; open: boolean; onToggle: () => void }) {
  return (
    <div className="rounded-xl border border-mist/70 bg-white overflow-hidden">
      <button
        onClick={onToggle}
        aria-expanded={open}
        className="flex w-full items-center gap-3 px-4 py-3 text-left hover:bg-snow/50 transition-colors"
      >
        <span className="text-[13.5px] font-semibold text-ink">{p.label}</span>
        <span className={`inline-flex items-center rounded-full border px-2 py-0.5 text-[10px] font-semibold ${BAND_CLS[p.band]}`}>
          {BAND_LABEL[p.band]}
        </span>
        <span className="ml-auto text-[13px] font-semibold tabular-nums" style={{ color: BAND_COLOR[p.band] }}>{p.score}</span>
        {open ? <ChevronDown className="h-4 w-4 text-electric" /> : <ChevronRight className="h-4 w-4 text-fog" />}
      </button>
      {open && (
        <div className="border-t border-mist/60 overflow-x-auto">
          <table className="w-full text-[12px]">
            <thead>
              <tr className="bg-snow/60 text-[11.5px] font-semibold text-ink">
                <th className="text-left px-4 py-2.5 w-[32%]">Factor</th>
                <th className="text-left px-4 py-2.5 w-[22%]">Value</th>
                <th className="text-left px-4 py-2.5 w-[18%]">Data Source</th>
                <th className="text-left px-4 py-2.5 w-[10%]">Weight</th>
                <th className="text-left px-4 py-2.5 w-[18%]">Direction</th>
              </tr>
            </thead>
            <tbody>
              {p.factors.map((f) => (
                <tr key={f.factor} className="border-t border-mist/50 align-top">
                  <td className="px-4 py-2.5">
                    <div className="font-medium text-ink">{f.factor}</div>
                    <div className="mt-0.5 text-[11px] text-fog leading-snug">{f.detail}</div>
                  </td>
                  <td className="px-4 py-2.5 text-ink">{f.value}</td>
                  <td className="px-4 py-2.5">
                    <span className="inline-flex rounded-md border border-mist/70 bg-snow/60 px-1.5 py-0.5 text-[10.5px] text-smoke whitespace-nowrap">{f.source}</span>
                  </td>
                  <td className="px-4 py-2.5 text-ink font-semibold tabular-nums whitespace-nowrap">{f.weight}%</td>
                  <td className="px-4 py-2.5 whitespace-nowrap"><DirectionTag direction={f.direction} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

/* ─────────────── Risk Summary ─────────────── */

export function RiskStorySummary() {
  const [openKey, setOpenKey] = useState<string | null>("wind");
  const s = riskScorecard;
  return (
    <div className="grid grid-cols-[1fr_300px] gap-5 items-start">
      <div className="space-y-5">
        <div className="rounded-2xl border border-mist/70 bg-gradient-to-br from-snow/60 to-white p-5">
          <div className="flex items-center gap-2 text-[11px] font-semibold text-fog">
            <Compass className="h-3.5 w-3.5 text-electric" /> Overall exposure at a glance
          </div>
          <div className="mt-4 flex items-center gap-8">
            <RiskGauge score={s.overallScore} band={s.overallBand} />
            <div className="grid flex-1 grid-cols-2 gap-x-8 gap-y-3.5">
              {s.perils.map((p) => <PerilMiniBar key={p.key} p={p} />)}
            </div>
          </div>
        </div>

        <div>
          <div className="mb-2 text-[11px] font-semibold text-fog">Score derivation by peril</div>
          <div className="space-y-2">
            {s.perils.map((p) => (
              <PerilAccordion key={p.key} p={p} open={openKey === p.key} onToggle={() => setOpenKey((k) => (k === p.key ? null : p.key))} />
            ))}
          </div>
        </div>
      </div>

      <AiInsightPanel insight={s.aiSummary} />
    </div>
  );
}

/* ─────────────── Property Details ─────────────── */

export function RiskStoryProperty() {
  const d = riskPropertyProfile;
  const fields: { label: string; value: string }[][] = [
    [{ label: "Year Built", value: d.yearBuilt }, { label: "Stories", value: d.stories }],
    [{ label: "Square Footage", value: d.sqft }, { label: "Buildings / Dock Doors", value: d.buildingsDocks }],
    [{ label: "Roof", value: d.roof }, { label: "Sprinklered", value: d.sprinklered }],
    [{ label: "Building Value", value: d.buildingValue }, { label: "Contents / BI", value: d.contentsBI }],
  ];
  return (
    <div className="grid grid-cols-[1fr_300px] gap-5 items-start">
      <div className="rounded-2xl border border-mist/70 bg-white overflow-hidden">
        <div className="flex items-center gap-2 px-5 py-4 border-b border-mist/60 text-[14px] font-semibold text-ink">
          <Building2 className="h-4 w-4 text-electric" /> Commercial Property Details
        </div>
        <div className="p-5 grid grid-cols-2 gap-x-8 gap-y-4">
          {fields.map((pair, i) => (
            <div key={i} className="contents">
              {pair.map((f) => (
                <div key={f.label}>
                  <div className="text-[10.5px] font-semibold text-fog">{f.label.toUpperCase()}</div>
                  <div className="mt-1 text-[13.5px] font-medium text-ink">{f.value}</div>
                </div>
              ))}
            </div>
          ))}
        </div>
        <div className="border-t border-mist/60 px-5 py-4">
          <div className="mb-2.5 text-[10.5px] font-semibold text-fog">COPE SUMMARY</div>
          <div className="space-y-2">
            {d.cope.map((c) => (
              <div key={c.code} className="flex items-start gap-3">
                <span className="grid h-6 w-6 shrink-0 place-items-center rounded-md bg-[#0d111b] text-[11px] font-bold text-white">{c.code}</span>
                <p className="pt-0.5 text-[12.5px] leading-snug text-ink">{c.text}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
      <AiInsightPanel insight={d.aiSummary} />
    </div>
  );
}

/* ─────────────── Risk Protections ─────────────── */

const PROTECTION_ICONS: Record<string, ComponentType<{ className?: string }>> = {
  flame: Flame, droplet: Droplet, bell: Bell, lock: Lock, zap: Zap,
};

export function RiskStoryProtections() {
  const d = riskProtectionsPanel;
  return (
    <div className="grid grid-cols-[1fr_300px] gap-5 items-start">
      <div className="rounded-2xl border border-mist/70 bg-white overflow-hidden">
        <div className="flex items-center gap-2 px-5 py-4 border-b border-mist/60 text-[14px] font-semibold text-ink">
          <ShieldCheck className="h-4 w-4 text-electric" /> Risk Protections
        </div>
        <div className="p-5 grid grid-cols-2 gap-4">
          {d.items.map((it) => {
            const Icon = PROTECTION_ICONS[it.icon] ?? ShieldCheck;
            return (
              <div key={it.title} className="rounded-xl border border-mist/70 bg-snow/30 p-4">
                <div className="flex items-center gap-2">
                  <span className="grid h-7 w-7 place-items-center rounded-lg bg-electric/10 text-electric shrink-0">
                    <Icon className="h-3.5 w-3.5" />
                  </span>
                  <span className="text-[12.5px] font-semibold text-ink">{it.title}</span>
                </div>
                <ul className="mt-2.5 space-y-1">
                  {it.lines.map((l, i) => (
                    <li key={i} className="text-[11.5px] text-smoke leading-snug">{l}</li>
                  ))}
                </ul>
              </div>
            );
          })}
        </div>
      </div>
      <AiInsightPanel insight={d.aiSummary} />
    </div>
  );
}

/* ─────────────── Data Sources ─────────────── */

export function RiskStoryDataSources() {
  const d = riskDataSourcesPanel;
  return (
    <div className="grid grid-cols-[1fr_300px] gap-5 items-start">
      <div className="rounded-2xl border border-mist/70 bg-white overflow-hidden">
        <div className="flex items-center gap-2 px-5 py-4 border-b border-mist/60 text-[14px] font-semibold text-ink">
          <Database className="h-4 w-4 text-electric" /> Data Sources
        </div>
        <div className="p-5 grid grid-cols-2 gap-4">
          {d.items.map((src) => (
            <div key={src.title} className="rounded-xl border border-mist/70 bg-white p-4">
              <div className="flex items-start justify-between gap-2">
                <div className="min-w-0">
                  <div className="text-[12.5px] font-semibold text-ink leading-snug">{src.title}</div>
                  <div className="text-[10.5px] text-fog">{src.org}</div>
                </div>
                <span className="inline-flex shrink-0 items-center gap-1 rounded-full border border-leaf/25 bg-leaf/10 px-2 py-0.5 text-[10px] font-semibold text-leaf">
                  <CircleCheck className="h-3 w-3" /> Verified
                </span>
              </div>
              <dl className="mt-3 space-y-1.5">
                {src.fields.map((f) => (
                  <div key={f.k} className="flex items-baseline justify-between gap-2 text-[11.5px]">
                    <dt className="text-smoke">{f.k}</dt>
                    <dd className="text-ink font-medium text-right">{f.v}</dd>
                  </div>
                ))}
              </dl>
              <div className="mt-3 border-t border-mist/40 pt-2 text-[10px] text-fog">Last updated {src.updated}</div>
            </div>
          ))}
        </div>
      </div>
      <AiInsightPanel insight={d.aiSummary} />
    </div>
  );
}

/* ─────────────── Narrative & Drivers (prior Risk Story content) ─────────────── */

const TONE_MAP: Record<string, string> = {
  leaf: "border-leaf/25 bg-leaf/[0.05] text-leaf",
  amber: "border-amber-300/60 bg-amber-50/50 text-amber-700",
  coral: "border-coral/25 bg-coral/[0.05] text-coral",
};

export function RiskStoryNarrative() {
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
          <div key={c.label} className={`rounded-xl border p-3.5 ${TONE_MAP[c.tone] || TONE_MAP.leaf}`}>
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
