import { createFileRoute } from "@tanstack/react-router";
import { integrations } from "../lib/mock";
import { Card, PillButton } from "../components/app/primitives";

export const Route = createFileRoute("/_app/settings/integrations")({
  component: Integrations,
});

function Integrations() {
  return (
    <div className="grid grid-cols-2 gap-4">
      {integrations.map((it) => (
        <Card key={it.name} className="p-5 animate-fade-up">
          <div className="flex items-start justify-between">
            <div>
              <div className="text-[15px] font-semibold text-ink">{it.name}</div>
              <div className="mt-1 text-[13px] text-smoke">{it.desc}</div>
            </div>
            <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-medium ${it.connected ? "bg-leaf/10 text-leaf" : "bg-snow text-smoke"}`}>
              <span className={`h-1.5 w-1.5 rounded-full ${it.connected ? "bg-leaf" : "bg-fog"}`} />
              {it.connected ? "Connected" : "Disconnected"}
            </span>
          </div>
          {it.last && <div className="mt-3 text-[12px] text-fog">Last synced: {it.last}</div>}
          <div className="mt-4">
            {it.connected ? <PillButton variant="secondary">Disconnect</PillButton> : <PillButton>Connect</PillButton>}
          </div>
        </Card>
      ))}
    </div>
  );
}
