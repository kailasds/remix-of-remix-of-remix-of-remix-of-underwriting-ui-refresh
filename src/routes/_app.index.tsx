import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowUpRight, Clock, ArrowRight, Sparkles, CheckCircle2, AlertTriangle, CircleAlert, Brain, FileText } from "lucide-react";
import { AreaChart, Area, ResponsiveContainer, Tooltip, XAxis, CartesianGrid } from "recharts";
import { cases, activity, submissionTrend, formatUSD } from "../lib/mock";
import { Card, Eyebrow, StatusChip, ProgressBar, RiskDot, PillButton } from "../components/app/primitives";
import { FindingPill } from "../components/app/finding";

export const Route = createFileRoute("/_app/")({
  head: () => ({ meta: [{ title: "Dashboard · Aegis Underwriting" }] }),
  component: Dashboard,
});

const aiKpis = [
  { label: "Cases auto-completed today", value: 14, delta: "+5 vs yesterday", icon: CheckCircle2, tone: "text-leaf", bg: "bg-leaf/10" },
  { label: "Documents processed", value: 142, delta: "18 in last hour", icon: FileText, tone: "text-electric", bg: "bg-ice" },
  { label: "Avg review time saved", value: "23m", delta: "per case, vs manual", icon: Sparkles, tone: "text-iris", bg: "bg-lavender" },
  { label: "Waiting for human review", value: 8, delta: "3 urgent", icon: AlertTriangle, tone: "text-coral", bg: "bg-coral/10" },
];

function Dashboard() {
  return (
    <div className="mx-auto max-w-[1400px] px-8 py-8">
      <div className="mb-8 flex items-end justify-between animate-fade-up">
        <div>
          <Eyebrow>Workspace overview</Eyebrow>
          <h1 className="mt-2 text-[32px] font-semibold leading-none text-ink">Good afternoon, Akhil</h1>
          <p className="mt-2 text-[14px] text-smoke">Overview of underwriting activity, key metrics, and recent submissions.</p>
        </div>
        <div className="flex gap-2">
          <PillButton variant="secondary">View analytics <ArrowUpRight className="h-3.5 w-3.5" /></PillButton>
          <Link to="/queue"><PillButton>Open queue <ArrowRight className="h-3.5 w-3.5" /></PillButton></Link>
        </div>
      </div>

      <div className="mb-6 grid grid-cols-4 gap-4">
        {aiKpis.map((k) => {
          const Icon = k.icon;
          return (
            <Card key={k.label} className="p-5 transition-shadow hover:shadow-[0_2px_16px_rgba(15,20,35,.06)] animate-fade-up">
              <div className="flex items-center justify-between">
                <Eyebrow>{k.label}</Eyebrow>
                <span className={`grid h-7 w-7 place-items-center rounded-lg ${k.bg} ${k.tone}`}>
                  <Icon className="h-3.5 w-3.5" />
                </span>
              </div>
              <div className="mt-3 flex items-baseline gap-2">
                <div className="text-[36px] font-semibold leading-none tracking-tight text-ink tabular-nums">{k.value}</div>
              </div>
              <div className="mt-2 text-[12px] text-smoke">{k.delta}</div>
            </Card>
          );
        })}
      </div>

      <div className="mb-6 grid grid-cols-3 gap-4">
        <Card className="col-span-2 p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <Eyebrow>Recent AI discoveries</Eyebrow>
              <h2 className="mt-1 text-[18px] font-semibold text-ink">What AI found today</h2>
            </div>
            <Brain className="h-4 w-4 text-electric" />
          </div>
          <ul className="space-y-2.5">
            {[
              { state: "review" as const, case: "UW-151", text: "Address mismatch between ACORD 125 and Schedule of Locations for Root Down LLC" },
              { state: "missing" as const, case: "UW-149", text: "Building age and roof material missing on Meridian Coastal Homes submission" },
              { state: "recommendation" as const, case: "UW-146", text: "Recommend referring Cascade Data Center — cyber exposure exceeds appetite" },
              { state: "verified" as const, case: "UW-147", text: "Sable & Vine auto-approved — all findings verified across 4 documents" },
              { state: "recommendation" as const, case: "UW-150", text: "Recommend endorsement CP-1049 for Harborline Freight coastal exposure" },
            ].map((d, i) => (
              <li key={i} className="flex items-start gap-3 rounded-xl border border-mist/60 px-3 py-2.5 text-[13px] hover:bg-snow/60">
                <FindingPill state={d.state} className="mt-0.5" />
                <div className="flex-1 min-w-0">
                  <span className="font-medium text-electric">{d.case}</span>
                  <span className="text-fog"> · </span>
                  <span className="text-ink">{d.text}</span>
                </div>
              </li>
            ))}
          </ul>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between">
            <Eyebrow>AI operations · today</Eyebrow>
            <Sparkles className="h-4 w-4 text-electric" />
          </div>
          <div className="mt-3 text-[42px] font-semibold leading-none tracking-tight text-ink">83<span className="text-[24px] text-smoke">%</span></div>
          <div className="mt-1 text-[12px] text-smoke">of submissions handled without human input</div>
          <div className="mt-5 space-y-3">
            {[
              { label: "Documents processed", n: 142, tone: "electric" as const },
              { label: "Guidelines matched", n: 96, tone: "iris" as const },
              { label: "Referrals surfaced", n: 12, tone: "coral" as const },
            ].map((r) => (
              <div key={r.label}>
                <div className="mb-1 flex justify-between text-[12px]"><span className="text-smoke">{r.label}</span><span className="font-semibold text-ink tabular-nums">{r.n}</span></div>
                <ProgressBar value={r.n} tone={r.tone} />
              </div>
            ))}
          </div>
        </Card>
      </div>

      <div className="mb-6 grid grid-cols-3 gap-4">
        <Card className="col-span-2 p-6">
          <div className="flex items-end justify-between">
            <div>
              <Eyebrow>Submission volume · 7 days</Eyebrow>
              <h2 className="mt-2 text-[20px] font-semibold text-ink">Submissions vs approvals</h2>
            </div>
            <div className="flex gap-4 text-[12px] text-smoke">
              <span className="inline-flex items-center gap-1.5"><span className="h-2 w-2 rounded-full bg-electric" /> Submissions</span>
              <span className="inline-flex items-center gap-1.5"><span className="h-2 w-2 rounded-full bg-iris" /> Approved</span>
            </div>
          </div>
          <div className="mt-6 h-[180px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={submissionTrend}>
                <defs>
                  <linearGradient id="ga" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#0098f2" stopOpacity={0.25} /><stop offset="100%" stopColor="#0098f2" stopOpacity={0} /></linearGradient>
                  <linearGradient id="gb" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#6c56fc" stopOpacity={0.2} /><stop offset="100%" stopColor="#6c56fc" stopOpacity={0} /></linearGradient>
                </defs>
                <CartesianGrid stroke="#f0f2f5" vertical={false} />
                <XAxis dataKey="d" tick={{ fill: "#8d8d8d", fontSize: 11 }} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={{ borderRadius: 12, border: "1px solid #ececf0", fontSize: 12 }} />
                <Area type="monotone" dataKey="submissions" stroke="#0098f2" strokeWidth={2} fill="url(#ga)" />
                <Area type="monotone" dataKey="approved" stroke="#6c56fc" strokeWidth={2} fill="url(#gb)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between mb-3">
            <Eyebrow>Recent referrals</Eyebrow>
            <CircleAlert className="h-4 w-4 text-coral" />
          </div>
          <ul className="space-y-2.5">
            {cases.filter((c) => c.status === "Referred" || c.riskScore > 65).slice(0, 4).map((c) => (
              <li key={c.id} className="rounded-xl border border-mist/60 px-3 py-2.5">
                <div className="flex items-center justify-between">
                  <Link to="/case/$id" params={{ id: c.id }} className="text-[13px] font-medium text-electric hover:underline">{c.ref}</Link>
                  <RiskDot score={c.riskScore} />
                </div>
                <div className="mt-0.5 text-[12.5px] text-ink truncate">{c.insured}</div>
              </li>
            ))}
          </ul>
        </Card>
      </div>



      <div className="grid grid-cols-3 gap-4">
        <Card className="col-span-2 overflow-hidden">
          <div className="flex items-center justify-between px-6 py-5">
            <div>
              <Eyebrow>Recent submissions</Eyebrow>
              <h2 className="mt-1 text-[18px] font-semibold text-ink">Latest across all underwriters</h2>
            </div>
            <Link to="/queue" className="text-[13px] font-medium text-electric hover:underline">View all →</Link>
          </div>
          <div className="border-t border-mist/60">
            <table className="w-full text-[13px]">
              <thead>
                <tr className="border-b border-mist/60 bg-snow/50 text-left text-[11px] uppercase tracking-wider text-fog">
                  <th className="px-6 py-2.5 font-medium">Reference</th>
                  <th className="py-2.5 font-medium">Insured</th>
                  <th className="py-2.5 font-medium">Sum insured</th>
                  <th className="py-2.5 font-medium">Risk</th>
                  <th className="py-2.5 pr-6 font-medium">Status</th>
                </tr>
              </thead>
              <tbody>
                {cases.slice(0, 6).map((c) => (
                  <tr key={c.id} className="border-b border-mist/40 last:border-0 transition-colors hover:bg-snow/60">
                    <td className="px-6 py-3"><Link to="/case/$id" params={{ id: c.id }} className="font-medium text-electric hover:underline">{c.ref}</Link></td>
                    <td className="py-3 text-ink">{c.insured}</td>
                    <td className="py-3 tabular-nums text-ink">{formatUSD(c.sumInsured)}</td>
                    <td className="py-3"><RiskDot score={c.riskScore} /></td>
                    <td className="py-3 pr-6"><StatusChip status={c.status} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <Eyebrow>Activity feed</Eyebrow>
              <h2 className="mt-1 text-[18px] font-semibold text-ink">Recent activity</h2>
            </div>
            <Clock className="h-4 w-4 text-fog" />
          </div>
          <ol className="mt-5 space-y-4">
            {activity.map((a, i) => (
              <li key={i} className="relative pl-6">
                <span className="absolute left-0 top-1.5 grid h-4 w-4 place-items-center rounded-full border border-mist bg-white">
                  <span className="h-1.5 w-1.5 rounded-full bg-electric" />
                </span>
                {i < activity.length - 1 && <span className="absolute left-[7px] top-6 h-full w-px bg-mist/70" />}
                <div className="text-[11px] uppercase tracking-wider text-fog">{a.t}</div>
                <div className="mt-0.5 text-[13px] leading-snug text-ink">{a.text}</div>
              </li>
            ))}
          </ol>
        </Card>
      </div>
    </div>
  );
}
