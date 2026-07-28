import { createFileRoute } from "@tanstack/react-router";
import { team } from "../lib/mock";
import { Card, PillButton } from "../components/app/primitives";
import { UserPlus } from "lucide-react";

export const Route = createFileRoute("/_app/settings/team")({
  component: Team,
});

const bg: Record<string, string> = { electric: "#0098f2", leaf: "#5d9c06", iris: "#6c56fc", coral: "#ff6363" };

function Team() {
  return (
    <Card className="overflow-hidden animate-fade-up">
      <div className="flex items-center justify-between px-6 py-4">
        <div className="text-[14px] text-smoke">{team.length} team members</div>
        <PillButton><UserPlus className="h-3.5 w-3.5" /> Invite member</PillButton>
      </div>
      <table className="w-full text-[13px]">
        <thead>
          <tr className="border-y border-mist/60 bg-snow/60 text-left text-[10.5px] text-fog">
            <th className="px-6 py-3 font-medium">Member</th>
            <th className="py-3 font-medium">Role</th>
            <th className="py-3 font-medium">Status</th>
            <th className="py-3 pr-6 font-medium">Last active</th>
          </tr>
        </thead>
        <tbody>
          {team.map((m) => (
            <tr key={m.name} className="border-b border-mist/40 last:border-0 hover:bg-snow/60">
              <td className="px-6 py-3.5">
                <div className="flex items-center gap-3">
                  <span className="grid h-9 w-9 place-items-center rounded-full text-[11px] font-semibold text-white" style={{ background: bg[m.tint] }}>{m.initials}</span>
                  <span className="font-medium text-ink">{m.name}</span>
                </div>
              </td>
              <td className="py-3.5 text-smoke">{m.role}</td>
              <td className="py-3.5">
                <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-medium ${m.status === "Active" ? "bg-leaf/10 text-leaf" : "bg-snow text-smoke"}`}>
                  <span className={`h-1.5 w-1.5 rounded-full ${m.status === "Active" ? "bg-leaf" : "bg-fog"}`} />
                  {m.status}
                </span>
              </td>
              <td className="py-3.5 pr-6 text-smoke">{m.last}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </Card>
  );
}
