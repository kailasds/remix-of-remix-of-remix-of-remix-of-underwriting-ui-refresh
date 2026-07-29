import { useState, type ComponentType } from "react";
import {
  Activity, Building2, ShieldCheck, Database, Map as MapIcon, Satellite,
  Sparkles, ChevronDown, ChevronRight, CheckCircle2, AlertTriangle,
  Flame, Droplet, Bell, Lock, Zap, TrendingUp, TrendingDown, Send,
  MapPin,
} from "lucide-react";
import {
  riskStory, riskSummaryTab, propertyDetailsTab, riskProtectionsTab,
  dataSourcesTab, mapGisTab, satelliteImageryTab, type RiskBand,
} from "../../lib/journey";
import { SectionCard, Chip, SourceTag, SourcePreviewModal } from "./FindingCategoryDetail";

/* ─────────────── Sub-tab shell ─────────────── */

type RiskTabKey = "summary" | "property" | "protections" | "sources" | "map" | "satellite";

const RISK_TABS: { key: RiskTabKey; label: string; icon: ComponentType<{ className?: string }> }[] = [
  { key: "summary", label: "Risk Summary", icon: Activity },
  { key: "property", label: "Property Details", icon: Building2 },
  { key: "protections", label: "Risk Protections", icon: ShieldCheck },
  { key: "sources", label: "Data Sources", icon: Database },
  { key: "map", label: "Map & GIS", icon: MapIcon },
  { key: "satellite", label: "Satellite Imagery", icon: Satellite },
];

export function RiskStoryDetail() {
  const [active, setActive] = useState<RiskTabKey>("summary");
  return (
    <div className="space-y-5">
      <div className="flex items-center gap-1 rounded-t-xl border-b border-mist/60 bg-ice/50 px-2 pt-1 overflow-x-auto overflow-y-hidden">
        {RISK_TABS.map((t) => {
          const isActive = active === t.key;
          const Icon = t.icon;
          return (
            <button
              key={t.key}
              onClick={() => setActive(t.key)}
              className={`relative flex items-center gap-1.5 rounded-t-lg px-3 py-2.5 text-[14.5px] font-semibold whitespace-nowrap transition-colors ${
                isActive ? "bg-white text-electric" : "text-smoke hover:text-ink hover:bg-white/50"
              }`}
            >
              <Icon className="h-3.5 w-3.5" />
              {t.label}
              {isActive && <span className="absolute inset-x-2 -bottom-px h-[2px] rounded-full bg-electric" />}
            </button>
          );
        })}
      </div>

      {active === "summary" && <RiskSummarySection />}
      {active === "property" && <PropertyDetailsSection />}
      {active === "protections" && <RiskProtectionsSection />}
      {active === "sources" && <DataSourcesSection />}
      {active === "map" && <MapGisSection />}
      {active === "satellite" && <SatelliteImagerySection />}
    </div>
  );
}

/* ─────────────── AI Summary (always on top) ─────────────── */

function bandTone(band: string): { text: string; bg: string; border: string } {
  if (/low|high confidence/i.test(band)) return { text: "text-leaf", bg: "bg-leaf/10", border: "border-leaf/25" };
  if (/high risk/i.test(band)) return { text: "text-coral", bg: "bg-coral/10", border: "border-coral/25" };
  return { text: "text-amber-700", bg: "bg-amber-100/70", border: "border-amber-300/60" };
}

function AiSummaryCard({
  band, confidence, observation, bullets,
}: { band: string; confidence: number; observation: string; bullets: string[] }) {
  const tone = bandTone(band);
  const [question, setQuestion] = useState("");
  return (
    <div className="rounded-2xl border border-electric/25 bg-gradient-to-br from-ice/40 via-white to-lavender/20 p-5">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <div className="grid h-7 w-7 place-items-center rounded-lg bg-electric/10 text-electric">
            <Sparkles className="h-3.5 w-3.5" />
          </div>
          <span className="text-[13px] font-semibold text-ink">AI Summary</span>
          <span className={`inline-flex items-center rounded-full border px-2 py-0.5 text-[10.5px] font-semibold ${tone.bg} ${tone.text} ${tone.border}`}>
            {band}
          </span>
        </div>
        <span className="text-[10.5px] font-semibold text-fog tabular-nums">{confidence}% CONFIDENCE</span>
      </div>
      <p className="mt-3 text-[13.5px] leading-relaxed text-ink">{observation}</p>
      <ul className="mt-3 space-y-1.5">
        {bullets.map((b, i) => (
          <li key={i} className="flex items-start gap-2 text-[12.5px] text-ink">
            <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-electric shrink-0" /> {b}
          </li>
        ))}
      </ul>
      <div className="mt-4 pt-3 border-t border-mist/50">
        <div className="text-[10px] font-semibold text-fog mb-1.5">ASK A FOLLOW-UP QUESTION</div>
        <div className="flex items-center gap-1.5 rounded-full border border-mist bg-white px-3 py-1.5 focus-within:border-electric transition-colors">
          <input
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            placeholder="e.g. why is the roof flagged?"
            className="flex-1 bg-transparent text-[12px] focus:outline-none placeholder:text-fog"
          />
          <button className="grid h-6 w-6 place-items-center rounded-full bg-[#0d111b] text-white shrink-0"><Send className="h-3 w-3" /></button>
        </div>
      </div>
    </div>
  );
}

/* ─────────────── Risk Summary ─────────────── */

function scoreTone(band: RiskBand) {
  return band === "Low" ? "leaf" : band === "Moderate" ? "amber" : "coral";
}
const SCORE_BAR: Record<string, string> = { leaf: "bg-leaf", amber: "bg-[#f5a623]", coral: "bg-coral" };
const SCORE_RING: Record<string, string> = { leaf: "border-leaf", amber: "border-[#f5a623]", coral: "border-coral" };
const SCORE_TEXT: Record<string, string> = { leaf: "text-leaf", amber: "text-amber-700", coral: "text-coral" };

function RiskSummarySection() {
  const d = riskSummaryTab;
  const [openPeril, setOpenPeril] = useState<string | null>(d.perils[1]?.key ?? null);
  const [preview, setPreview] = useState<string | null>(null);
  const overallTone = scoreTone(d.overall.band);
  const maxLoss = Math.max(...riskStory.lossTrends.series.map((s) => s.incurred), 1);

  return (
    <div className="space-y-5">
      <AiSummaryCard {...d.aiSummary} />

      <SectionCard title="Overall Exposure" icon={Activity} tone="text-electric">
        <div className="p-5 flex flex-wrap items-center gap-8">
          <div className="flex items-center gap-4 shrink-0">
            <div className={`grid h-20 w-20 place-items-center rounded-full border-[6px] ${SCORE_RING[overallTone]} bg-white`}>
              <span className="text-[24px] font-bold text-ink tabular-nums">{d.overall.score}</span>
            </div>
            <div>
              <div className="text-[10.5px] font-semibold text-fog">Composite Score</div>
              <div className={`text-[15px] font-semibold ${SCORE_TEXT[overallTone]}`}>{d.overall.band}</div>
            </div>
          </div>
          <div className="flex-1 min-w-[320px] grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-3">
            {d.perils.map((p) => {
              const tone = scoreTone(p.band);
              return (
                <div key={p.key}>
                  <div className="flex items-baseline justify-between text-[12px]">
                    <span className="text-ink font-medium">{p.label}</span>
                    <span className={`font-semibold tabular-nums ${SCORE_TEXT[tone]}`}>{p.score}</span>
                  </div>
                  <div className="mt-1 h-1.5 rounded-full bg-mist/60 overflow-hidden">
                    <div className={`h-full rounded-full ${SCORE_BAR[tone]}`} style={{ width: `${p.score}%` }} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </SectionCard>

      <div>
        <div className="text-[11px] font-semibold text-fog mb-2 px-1">Score derivation by peril</div>
        <div className="space-y-2.5">
          {d.derivation.map((peril) => {
            const isOpen = openPeril === peril.key;
            const tone = scoreTone(peril.band);
            return (
              <div key={peril.key} className="rounded-xl border border-mist/70 bg-white overflow-hidden">
                <button
                  onClick={() => setOpenPeril(isOpen ? null : peril.key)}
                  className="flex w-full items-center gap-2.5 px-4 py-3 text-left hover:bg-snow/50 transition-colors"
                >
                  {isOpen ? <ChevronDown className="h-3.5 w-3.5 text-electric shrink-0" /> : <ChevronRight className="h-3.5 w-3.5 text-fog shrink-0" />}
                  <span className="text-[13.5px] font-semibold text-ink flex-1">{peril.label}</span>
                  <Chip tone={tone as "leaf" | "amber" | "coral"} label={peril.band} />
                </button>
                {isOpen && (
                  <div className="border-t border-mist/60 overflow-x-auto">
                    <table className="w-full text-[12px]">
                      <thead>
                        <tr className="bg-snow/60 text-[12px] font-semibold text-ink">
                          <th className="text-left px-4 py-2.5 w-[22%]">Factor</th>
                          <th className="text-left px-4 py-2.5 w-[22%]">Value</th>
                          <th className="text-left px-4 py-2.5 w-[16%]">Data Source</th>
                          <th className="text-left px-4 py-2.5 w-[10%]">Weight</th>
                          <th className="text-left px-4 py-2.5">Direction</th>
                        </tr>
                      </thead>
                      <tbody>
                        {peril.factors.map((f) => (
                          <tr key={f.factor} className="border-t border-mist/50 align-top">
                            <td className="px-4 py-3">
                              <div className="font-medium text-ink">{f.factor}</div>
                              <div className="mt-0.5 text-[11px] text-smoke leading-snug">{f.detail}</div>
                            </td>
                            <td className="px-4 py-3 text-ink whitespace-nowrap">{f.value}</td>
                            <td className="px-4 py-3"><SourceTag label={f.source} onOpen={setPreview} /></td>
                            <td className="px-4 py-3 text-ink tabular-nums">{f.weight}%</td>
                            <td className="px-4 py-3">
                              {f.direction === "down" ? (
                                <span className="inline-flex items-center gap-1 text-[11px] font-medium text-leaf"><TrendingDown className="h-3 w-3" /> Reduces risk</span>
                              ) : (
                                <span className="inline-flex items-center gap-1 text-[11px] font-medium text-coral"><TrendingUp className="h-3 w-3" /> Increases risk</span>
                              )}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            );
          })}
        </div>
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

      {preview && <SourcePreviewModal label={preview} onClose={() => setPreview(null)} />}
    </div>
  );
}

/* ─────────────── Property Details ─────────────── */

const COPE_META = [
  { key: "C", label: "Construction" },
  { key: "O", label: "Occupancy" },
  { key: "P", label: "Protection" },
  { key: "E", label: "Exposure" },
];

function PropertyDetailsSection() {
  const d = propertyDetailsTab;
  const [preview, setPreview] = useState<string | null>(null);
  const metrics: { label: string; value: string }[] = [
    { label: "Year Built", value: `${d.yearBuilt} · renovated ${d.renovated}` },
    { label: "Stories", value: d.stories },
    { label: "Square Footage", value: d.squareFootage },
    { label: "Buildings / Dock Doors", value: d.buildingsAndDocks },
    { label: "Roof", value: d.roof },
    { label: "Sprinklered", value: d.sprinklered },
    { label: "Building Value", value: d.buildingValue },
    { label: "Contents / BI", value: d.contentsBI },
  ];
  return (
    <div className="space-y-5">
      <AiSummaryCard {...d.aiSummary} />
      <SectionCard title="Commercial Property Details" icon={Building2} tone="text-electric">
        <div className="p-4 grid grid-cols-2 gap-x-8 gap-y-3">
          {metrics.map((m) => (
            <div key={m.label} className="flex items-baseline justify-between gap-3 text-[12.5px] border-b border-mist/40 py-1.5">
              <span className="text-smoke">{m.label}</span>
              <span className="text-ink font-medium text-right">{m.value}</span>
            </div>
          ))}
        </div>
      </SectionCard>
      <SectionCard title="COPE Summary" icon={ShieldCheck} tone="text-amber-600">
        <div className="divide-y divide-mist/50">
          {d.cope.map((c, i) => (
            <div key={c.label} className="flex items-start gap-3 px-4 py-3">
              <div className="grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-[#0d111b] text-white text-[13px] font-bold">
                {COPE_META[i]?.key ?? "•"}
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-[10.5px] font-semibold text-fog">{c.label}</div>
                <div className="mt-0.5 flex items-start justify-between gap-2">
                  <span className="text-[12.5px] text-ink">{c.value}</span>
                  <SourceTag label={c.source} onOpen={setPreview} />
                </div>
              </div>
            </div>
          ))}
        </div>
      </SectionCard>
      {preview && <SourcePreviewModal label={preview} onClose={() => setPreview(null)} />}
    </div>
  );
}

/* ─────────────── Risk Protections ─────────────── */

const PROTECTION_ICONS: Record<string, ComponentType<{ className?: string }>> = {
  flame: Flame, droplet: Droplet, bell: Bell, lock: Lock, zap: Zap,
};

function RiskProtectionsSection() {
  const d = riskProtectionsTab;
  return (
    <div className="space-y-5">
      <AiSummaryCard {...d.aiSummary} />
      <div className="grid grid-cols-3 gap-4">
        {d.cards.map((c) => {
          const Icon = PROTECTION_ICONS[c.icon] ?? ShieldCheck;
          return (
            <div key={c.key} className="rounded-xl border border-mist/70 bg-white p-4">
              <div className="grid h-9 w-9 place-items-center rounded-lg bg-electric/10 text-electric mb-2.5">
                <Icon className="h-4.5 w-4.5" />
              </div>
              <div className="text-[13px] font-semibold text-ink">{c.label}</div>
              <div className="mt-1.5 space-y-1">
                {c.lines.map((l, i) => (
                  <div key={i} className="text-[11.5px] text-smoke leading-snug">{l}</div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

/* ─────────────── Data Sources ─────────────── */

function DataSourcesSection() {
  const d = dataSourcesTab;
  return (
    <div className="space-y-5">
      <AiSummaryCard {...d.aiSummary} />
      <SectionCard title="Third-Party & Submission Data Sources" icon={Database} tone="text-electric">
        <div className="overflow-x-auto">
          <table className="w-full text-[12px]">
            <thead>
              <tr className="bg-snow/60 text-[12.5px] font-semibold text-ink">
                <th className="text-left px-4 py-2.5">Source</th>
                <th className="text-left px-4 py-2.5">Type</th>
                <th className="text-left px-4 py-2.5">Last Updated</th>
                <th className="text-left px-4 py-2.5">Coverage / Confidence</th>
                <th className="text-left px-4 py-2.5">Status</th>
              </tr>
            </thead>
            <tbody>
              {d.sources.map((s) => (
                <tr key={s.name} className="border-t border-mist/50">
                  <td className="px-4 py-2.5 font-medium text-ink whitespace-nowrap">{s.name}</td>
                  <td className="px-4 py-2.5 text-ink">{s.type}</td>
                  <td className="px-4 py-2.5 text-smoke tabular-nums whitespace-nowrap">{s.lastUpdated}</td>
                  <td className="px-4 py-2.5 text-ink whitespace-nowrap">{s.coverage}</td>
                  <td className="px-4 py-2.5">
                    {s.status === "Verified" ? (
                      <Chip tone="leaf" label="Verified" />
                    ) : (
                      <Chip tone="amber" label={s.status} />
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </SectionCard>
    </div>
  );
}

/* ─────────────── Map & GIS ─────────────── */

function MapGisSection() {
  const d = mapGisTab;
  const [activeLayers, setActiveLayers] = useState<Set<string>>(
    new Set(d.layers.filter((l) => l.defaultOn).map((l) => l.key))
  );
  const toggle = (key: string) => setActiveLayers((prev) => {
    const next = new Set(prev);
    if (next.has(key)) next.delete(key); else next.add(key);
    return next;
  });

  return (
    <div className="space-y-5">
      <AiSummaryCard {...d.aiSummary} />

      <div className="grid grid-cols-2 gap-4">
        <div className="rounded-xl border border-mist/70 bg-white p-4 space-y-2">
          <div className="flex items-baseline justify-between text-[12.5px]"><span className="text-smoke">Flood Zone</span><span className="text-ink font-medium">{d.flood.zone}</span></div>
          <div className="flex items-baseline justify-between text-[12.5px]"><span className="text-smoke">Base Flood Elevation</span><span className="text-ink font-medium tabular-nums">{d.flood.bfe}</span></div>
          <div className="flex items-baseline justify-between text-[12.5px]"><span className="text-smoke">Lowest Floor Elevation</span><span className="text-ink font-medium tabular-nums">{d.flood.lowestFloor}</span></div>
          <div className="pt-1 text-[10.5px] text-fog">Last updated {d.flood.lastUpdated}</div>
        </div>
        <div className="rounded-xl border border-mist/70 bg-white p-4 space-y-2">
          <div className="flex items-baseline justify-between text-[12.5px]"><span className="text-smoke">Seismic Design Category</span><span className="text-ink font-medium">{d.seismic.category}</span></div>
          <div className="flex items-baseline justify-between text-[12.5px]"><span className="text-smoke">Peak Ground Acceleration</span><span className="text-ink font-medium tabular-nums">{d.seismic.pga}</span></div>
          <div className="flex items-baseline justify-between text-[12.5px]"><span className="text-smoke">Nearest Mapped Fault</span><span className="text-ink font-medium tabular-nums">{d.seismic.nearestFault}</span></div>
          <div className="pt-1 text-[10.5px] text-fog">Last updated {d.seismic.lastUpdated}</div>
        </div>
        <div className="rounded-xl border border-mist/70 bg-white p-4">
          <div className="flex items-center justify-between">
            <div className="text-[12.5px] font-semibold text-ink">Insured Loss Run History (5-yr)</div>
            <Chip tone="amber" label="Pending Review" />
          </div>
          <div className="mt-2 space-y-1.5">
            <div className="flex items-baseline justify-between text-[12.5px]"><span className="text-smoke">Total Claims</span><span className="text-ink font-medium">{d.lossHistory.claims}</span></div>
            <div className="flex items-baseline justify-between text-[12.5px]"><span className="text-smoke">Largest Loss</span><span className="text-ink font-medium">{d.lossHistory.largestLoss}</span></div>
            <div className="flex items-baseline justify-between text-[12.5px]"><span className="text-smoke">Open Claims</span><span className="text-ink font-medium">{d.lossHistory.openClaims}</span></div>
          </div>
          <div className="pt-1.5 text-[10.5px] text-fog">Last updated {d.lossHistory.lastUpdated}</div>
        </div>
        <div className="rounded-xl border border-mist/70 bg-white p-4">
          <div className="flex items-center justify-between">
            <div className="text-[12.5px] font-semibold text-ink">Aerial & Satellite Imagery Feed</div>
            <Chip tone="leaf" label="Verified" />
          </div>
          <div className="mt-2 space-y-1.5">
            <div className="flex items-baseline justify-between text-[12.5px]"><span className="text-smoke">Capture Date</span><span className="text-ink font-medium tabular-nums">{d.imageryFeed.captureDate}</span></div>
            <div className="flex items-baseline justify-between text-[12.5px]"><span className="text-smoke">Resolution</span><span className="text-ink font-medium">{d.imageryFeed.resolution}</span></div>
            <div className="flex items-baseline justify-between text-[12.5px]"><span className="text-smoke">Coverage</span><span className="text-ink font-medium">{d.imageryFeed.coverage}</span></div>
          </div>
          <div className="pt-1.5 text-[10.5px] text-fog">Last updated {d.imageryFeed.captureDate}</div>
        </div>
      </div>

      <SectionCard title="Map View & GIS Data Layers" icon={MapIcon} tone="text-electric">
        <div className="p-4">
          <div className="flex flex-wrap items-center gap-2">
            {d.layers.map((l) => {
              const on = activeLayers.has(l.key);
              return (
                <button
                  key={l.key}
                  onClick={() => toggle(l.key)}
                  className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-[11.5px] font-medium transition-colors ${
                    on ? "border-electric/40 bg-ice/40 text-ink" : "border-mist bg-white text-smoke hover:text-ink"
                  }`}
                >
                  <span className={`h-2 w-2 rounded-full ${on ? "" : "opacity-30"}`} style={{ background: l.color }} />
                  {l.label}
                </button>
              );
            })}
          </div>
          <div className="mt-4 relative h-[280px] rounded-xl border border-mist/60 overflow-hidden bg-[repeating-linear-gradient(0deg,#eef1f6_0px,#eef1f6_1px,transparent_1px,transparent_28px),repeating-linear-gradient(90deg,#eef1f6_0px,#eef1f6_1px,transparent_1px,transparent_28px)] bg-snow/40">
            {activeLayers.has("flood") && (
              <div className="absolute left-[8%] top-[15%] h-[55%] w-[38%] rounded-2xl bg-[#0098f2]/10 border border-[#0098f2]/30" />
            )}
            {activeLayers.has("wind") && (
              <div className="absolute inset-4 rounded-2xl border-2 border-dashed border-[#f5a623]/50" />
            )}
            {activeLayers.has("seismic") && (
              <div className="absolute right-[6%] bottom-[8%] h-2 w-2 rounded-full bg-[#e0455f]" />
            )}
            <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col items-center gap-1.5">
              <MapPin className="h-6 w-6 text-[#0d111b] drop-shadow" fill="#0d111b" />
              <span className="rounded-md bg-white/90 border border-mist/70 px-2 py-0.5 text-[10px] font-semibold text-ink">Subject Site</span>
            </div>
            {activeLayers.has("hydrant") && (
              <div className="absolute left-[62%] top-[42%] h-2 w-2 rounded-full bg-[#e0455f] ring-2 ring-white" />
            )}
            <span className="absolute bottom-2 right-3 text-[9.5px] text-fog">Illustrative overlay — connect a GIS provider to render live tiles.</span>
          </div>
        </div>
      </SectionCard>
    </div>
  );
}

/* ─────────────── Satellite Imagery ─────────────── */

const SATELLITE_PINS = [
  { x: 34, y: 38 }, { x: 52, y: 62 }, { x: 71, y: 30 }, { x: 22, y: 70 }, { x: 60, y: 78 },
];

function SatelliteImagerySection() {
  const d = satelliteImageryTab;
  return (
    <div className="space-y-5">
      <AiSummaryCard {...d.aiSummary} />
      <SectionCard title="Satellite / Aerial Imagery" icon={Satellite} tone="text-electric">
        <div className="p-4">
          <div className="flex items-center justify-between text-[11px] text-smoke mb-2">
            <span>Illustrative capture · {d.captureDate}</span>
            <span>{d.resolution}</span>
          </div>
          <div className="relative h-[300px] rounded-xl border border-mist/60 overflow-hidden bg-gradient-to-br from-[#8a9a8a] to-[#6b7d6b]">
            {/* Illustrative rooftop / parcel diagram */}
            <div className="absolute left-[10%] top-[12%] h-[62%] w-[55%] rounded-md bg-[#9aa6ad]/90 border border-white/20" />
            <div className="absolute left-[16%] top-[20%] h-[18%] w-[20%] rounded-sm bg-[#cfe0ea]/70" />
            <div className="absolute left-[14%] top-[62%] h-[6%] w-[6%] rounded-sm bg-[#2b333a]" />
            <div className="absolute left-[22%] top-[62%] h-[6%] w-[6%] rounded-sm bg-[#2b333a]" />
            <div className="absolute left-[30%] top-[62%] h-[6%] w-[6%] rounded-sm bg-[#2b333a]" />
            <div className="absolute left-[68%] top-[42%] h-[30%] w-[22%] rounded-md bg-[#9aa6ad]/70 border border-white/20" />
            <div className="absolute left-[8%] top-[78%] h-[14%] w-[30%] rounded-sm bg-[#7f8b91]/70" />
            <div className="absolute right-[6%] top-[8%] h-6 w-6 rounded-full bg-[#3f5b3f]" />
            <div className="absolute right-[12%] top-[16%] h-4 w-4 rounded-full bg-[#3f5b3f]" />
            <div className="absolute left-[8%] top-[6%] h-5 w-5 rounded-full bg-[#3f5b3f]" />
            {SATELLITE_PINS.map((p, i) => {
              const obs = d.observations[i];
              const dot = obs?.severity === "watch" ? "bg-[#f5a623]" : "bg-white";
              return (
                <span
                  key={i}
                  className={`absolute h-4 w-4 -translate-x-1/2 -translate-y-1/2 rounded-full ${dot} ring-2 ring-[#e0455f] grid place-items-center`}
                  style={{ left: `${p.x}%`, top: `${p.y}%` }}
                  title={obs?.label}
                >
                  <span className="h-1.5 w-1.5 rounded-full bg-[#e0455f]" />
                </span>
              );
            })}
          </div>

          <div className="mt-4 divide-y divide-mist/50">
            {d.observations.map((o) => (
              <div key={o.label} className="flex items-start gap-2.5 py-2.5">
                <span className={`mt-1.5 h-2 w-2 rounded-full shrink-0 ${o.severity === "watch" ? "bg-[#f5a623]" : "bg-leaf"}`} />
                <div className="min-w-0">
                  <div className="text-[12.5px] font-semibold text-ink">{o.label}</div>
                  <div className="text-[12px] text-smoke leading-snug">{o.detail}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </SectionCard>
    </div>
  );
}
