import { createFileRoute, Link, Outlet, useRouterState } from "@tanstack/react-router";
import { User, Users, Bell, Link2, Key } from "lucide-react";
import { Card, Eyebrow } from "../components/app/primitives";

export const Route = createFileRoute("/_app/settings")({
  head: () => ({ meta: [{ title: "Settings · Aegis Underwriting" }] }),
  component: SettingsLayout,
});

const items = [
  { to: "/settings/profile", label: "Profile", icon: User },
  { to: "/settings/team", label: "Team", icon: Users },
  { to: "/settings/notifications", label: "Notifications", icon: Bell },
  { to: "/settings/integrations", label: "Integrations", icon: Link2 },
  { to: "/settings/api-keys", label: "API Keys", icon: Key },
] as const;

function SettingsLayout() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  return (
    <div className="w-full px-8 py-8">
      <div className="mb-6 animate-fade-up">
        <Eyebrow>Preferences</Eyebrow>
        <h1 className="mt-2 text-[30px] font-semibold text-ink">Settings</h1>
        <p className="mt-2 text-[14px] text-smoke">Configure your preferences, notifications, and account details.</p>
      </div>

      <Card className="mb-6 flex flex-wrap gap-1 p-1.5">
        {items.map((it) => {
          const active = pathname === it.to;
          const Icon = it.icon;
          return (
            <Link key={it.to} to={it.to} className={`inline-flex items-center gap-2 rounded-full px-4 py-2 text-[13px] font-medium transition-colors ${active ? "bg-[#0d111b] text-white" : "text-smoke hover:bg-snow hover:text-ink"}`}>
              <Icon className="h-3.5 w-3.5" /> {it.label}
            </Link>
          );
        })}
      </Card>

      <Outlet />
    </div>
  );
}
