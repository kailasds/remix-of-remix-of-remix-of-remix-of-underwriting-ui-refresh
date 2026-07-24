import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Search, Home, Shield, Anchor, Sparkles, Eye, Bookmark, Filter } from "lucide-react";
import { guidelines } from "../lib/mock";
import { Card, Eyebrow, PillButton } from "../components/app/primitives";

export const Route = createFileRoute("/_app/knowledge")({
  head: () => ({ meta: [{ title: "Knowledge Hub · Aegis Underwriting" }] }),
  component: KnowledgeHub,
});

const tintBg: Record<string, string> = { ice: "bg-ice", lavender: "bg-lavender", blush: "bg-blush" };
const tintText: Record<string, string> = { ice: "text-electric", lavender: "text-iris", blush: "text-magenta" };

function iconFor(tag: string) {
  if (tag === "Marine") return Anchor;
  if (tag === "Liability") return Shield;
  if (tag === "Specialty") return Sparkles;
  return Home;
}

function KnowledgeHub() {
  const [q, setQ] = useState("");
  const [cat, setCat] = useState("All");
  const filtered = guidelines.filter((g) => (cat === "All" || g.tag === cat) && g.title.toLowerCase().includes(q.toLowerCase()));
  return (
    <div className="mx-auto max-w-[1400px] px-8 py-8">
      <div className="mb-6 animate-fade-up">
        <Eyebrow>Reference library</Eyebrow>
        <h1 className="mt-2 text-[30px] font-semibold text-ink">Knowledge Hub</h1>
        <p className="mt-2 text-[14px] text-smoke">Underwriting policies, appetite guides, and compliance references — searchable across your workspace.</p>
      </div>

      <Card className="mb-6 flex flex-wrap items-center gap-3 p-3">
        <div className="relative flex-1 min-w-[280px]">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-fog" />
          <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search guidelines, clauses, endorsements…" className="h-10 w-full rounded-full border border-mist bg-white pl-9 pr-4 text-[13px] placeholder:text-fog focus:border-electric focus:outline-none" />
        </div>
        <div className="flex flex-wrap gap-1 rounded-full border border-mist bg-white p-1">
          {["All", "Property", "Liability", "Marine", "Specialty"].map((c) => (
            <button key={c} onClick={() => setCat(c)} className={`rounded-full px-3 py-1.5 text-[12px] font-medium transition-colors ${cat === c ? "bg-[#0d111b] text-white" : "text-smoke hover:text-ink"}`}>{c}</button>
          ))}
        </div>
        <PillButton variant="secondary"><Filter className="h-3.5 w-3.5" /> More filters</PillButton>
      </Card>

      <div className="grid grid-cols-3 gap-4">
        {filtered.map((g) => {
          const Icon = iconFor(g.tag);
          return (
            <Card key={g.title} className="group p-5 transition-shadow hover:shadow-[0_4px_20px_rgba(15,20,35,.06)] animate-fade-up">
              <div className="flex items-start gap-3">
                <span className={`grid h-11 w-11 place-items-center rounded-2xl ${tintBg[g.tint]}`}>
                  <Icon className={`h-5 w-5 ${tintText[g.tint]}`} />
                </span>
                <div className="flex-1">
                  <div className="text-[15px] font-semibold text-ink">{g.title}</div>
                  <div className="mt-1 flex items-center gap-2 text-[11.5px]">
                    <span className={`rounded-full ${tintBg[g.tint]} px-2 py-0.5 font-medium ${tintText[g.tint]}`}>{g.tag}</span>
                    <span className="text-fog">Updated {g.updated}</span>
                  </div>
                </div>
                <button className="text-fog opacity-0 transition-opacity group-hover:opacity-100"><Bookmark className="h-4 w-4" /></button>
              </div>
              <p className="mt-4 text-[13px] leading-relaxed text-smoke">{g.desc}</p>
              <div className="mt-4 flex gap-2">
                <PillButton variant="secondary"><Eye className="h-3.5 w-3.5" /> View</PillButton>
                <PillButton variant="ghost">Ask AI</PillButton>
              </div>
            </Card>
          );
        })}
      </div>

      <Card className="mt-6 p-6">
        <Eyebrow>Recently updated</Eyebrow>
        <h2 className="mt-1 text-[18px] font-semibold text-ink">Policies revised in the last 30 days</h2>
        <ul className="mt-4 divide-y divide-mist/60">
          {[
            { tag: "Property", title: "SME Property Appetite", note: "Auto-acceptance thresholds raised to $5M TIV.", when: "Jun 1, 2026" },
            { tag: "Property", title: "Flood Zone Exclusions", note: "Zone 3b reclassified — mandatory referral for all new business.", when: "May 28, 2026" },
            { tag: "Property", title: "Coastal Property Appetite", note: "Proximity limit reduced from 5km to 2km following Q1 loss review.", when: "May 15, 2026" },
          ].map((r) => (
            <li key={r.title} className="flex items-center gap-4 py-3 text-[13px]">
              <span className="rounded-full bg-ice px-2 py-0.5 text-[11px] font-medium text-electric">{r.tag}</span>
              <div>
                <div className="font-medium text-ink">{r.title}</div>
                <div className="text-[12px] text-smoke">{r.note}</div>
              </div>
              <div className="ml-auto text-[12px] text-fog">{r.when}</div>
            </li>
          ))}
        </ul>
      </Card>
    </div>
  );
}
