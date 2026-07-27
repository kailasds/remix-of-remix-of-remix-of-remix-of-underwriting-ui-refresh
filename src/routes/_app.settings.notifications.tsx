import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Card } from "../components/app/primitives";

export const Route = createFileRoute("/_app/settings/notifications")({
  component: Notifications,
});

const rows = [
  { t: "New submission assigned", d: "When a submission is assigned to you", e: true, i: true },
  { t: "Submission status change", d: "When a submission status is updated", e: true, i: true },
  { t: "Document uploaded", d: "When a new document is attached", e: false, i: true },
  { t: "Overdue submission", d: "When a due date is missed", e: true, i: true },
  { t: "Team mentions", d: "When someone mentions you in a comment", e: false, i: true },
  { t: "Weekly digest", d: "Summary of your activity each Monday", e: true, i: false },
];

function Toggle({ on, onChange }: { on: boolean; onChange: (b: boolean) => void }) {
  return (
    <button onClick={() => onChange(!on)} className={`relative h-5 w-9 rounded-full transition-colors ${on ? "bg-electric" : "bg-mist"}`}>
      <span className={`absolute top-0.5 h-4 w-4 rounded-full bg-white shadow-sm transition-all ${on ? "left-[18px]" : "left-0.5"}`} />
    </button>
  );
}

function Notifications() {
  const [state, setState] = useState(rows);
  return (
    <Card className="overflow-hidden animate-fade-up">
      <div className="grid grid-cols-[1fr_100px_100px] gap-4 border-b border-mist/60 bg-snow/60 px-6 py-3 text-[10.5px] uppercase tracking-wider text-fog">
        <div>Notification</div><div className="text-center">Email</div><div className="text-center">In-app</div>
      </div>
      {state.map((r, i) => (
        <div key={r.t} className="grid grid-cols-[1fr_100px_100px] items-center gap-4 border-b border-mist/40 px-6 py-4 last:border-0">
          <div>
            <div className="text-[13.5px] font-medium text-ink">{r.t}</div>
            <div className="text-[12px] text-smoke">{r.d}</div>
          </div>
          <div className="flex justify-center"><Toggle on={r.e} onChange={(b) => setState((s) => s.map((x, k) => k === i ? { ...x, e: b } : x))} /></div>
          <div className="flex justify-center"><Toggle on={r.i} onChange={(b) => setState((s) => s.map((x, k) => k === i ? { ...x, i: b } : x))} /></div>
        </div>
      ))}
    </Card>
  );
}
