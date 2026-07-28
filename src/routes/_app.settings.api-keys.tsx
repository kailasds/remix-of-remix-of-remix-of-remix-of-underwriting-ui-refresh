import { createFileRoute } from "@tanstack/react-router";
import { Card, PillButton } from "../components/app/primitives";
import { Copy, Key, Plus } from "lucide-react";

export const Route = createFileRoute("/_app/settings/api-keys")({
  component: ApiKeys,
});

const keys = [
  { name: "Production", value: "aegis_live_••••••••••••G3fA", created: "Jan 12, 2026", used: "2 min ago", requests: "142,890" },
  { name: "Sandbox", value: "aegis_test_••••••••••••Xk91", created: "Feb 3, 2026", used: "Yesterday", requests: "8,441" },
  { name: "Rating Engine", value: "aegis_live_••••••••••••7pQm", created: "Apr 18, 2026", used: "12 min ago", requests: "52,110" },
];

function ApiKeys() {
  return (
    <Card className="overflow-hidden animate-fade-up">
      <div className="flex items-center justify-between px-6 py-4">
        <div>
          <div className="text-[15px] font-semibold text-ink">API keys</div>
          <div className="text-[12.5px] text-smoke">Programmatic access for your integrations and services.</div>
        </div>
        <PillButton><Plus className="h-3.5 w-3.5" /> Generate key</PillButton>
      </div>
      <table className="w-full text-[13px]">
        <thead>
          <tr className="border-y border-mist/60 bg-snow/60 text-left text-[10.5px] text-fog">
            <th className="px-6 py-3 font-medium">Name</th>
            <th className="py-3 font-medium">Key</th>
            <th className="py-3 font-medium">Created</th>
            <th className="py-3 font-medium">Last used</th>
            <th className="py-3 font-medium">Requests</th>
            <th className="py-3 pr-6"></th>
          </tr>
        </thead>
        <tbody>
          {keys.map((k) => (
            <tr key={k.name} className="border-b border-mist/40 last:border-0 hover:bg-snow/60">
              <td className="px-6 py-3.5">
                <div className="flex items-center gap-2">
                  <span className="grid h-8 w-8 place-items-center rounded-lg bg-ice text-electric"><Key className="h-3.5 w-3.5" /></span>
                  <span className="font-medium text-ink">{k.name}</span>
                </div>
              </td>
              <td className="py-3.5"><code className="rounded-md bg-snow px-2 py-1 font-mono text-[12px] text-ink">{k.value}</code></td>
              <td className="py-3.5 text-smoke">{k.created}</td>
              <td className="py-3.5 text-smoke">{k.used}</td>
              <td className="py-3.5 tabular-nums text-ink">{k.requests}</td>
              <td className="py-3.5 pr-6">
                <div className="flex gap-1 text-smoke">
                  <button className="grid h-7 w-7 place-items-center rounded-full hover:bg-snow"><Copy className="h-3.5 w-3.5" /></button>
                  <button className="text-[12px] text-coral hover:underline">Revoke</button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </Card>
  );
}
