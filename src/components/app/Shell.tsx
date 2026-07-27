import { Link, useRouterState } from "@tanstack/react-router";
import { LayoutGrid, ListChecks, BookOpen, Settings, Bell, ChevronDown, ChevronsLeft, ChevronsRight, Search, Sparkles, Shield } from "lucide-react";
import { type ReactNode, useState } from "react";

const nav = [
  { to: "/", label: "Dashboard", icon: LayoutGrid, exact: true },
  { to: "/queue", label: "My Queue", icon: ListChecks },
  { to: "/knowledge", label: "Knowledge Hub", icon: BookOpen },
  { to: "/settings/profile", label: "Settings", icon: Settings, match: "/settings" },
];

export function Shell({ children }: { children: ReactNode }) {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const [settingsOpen, setSettingsOpen] = useState(pathname.startsWith("/settings"));
  const [collapsed, setCollapsed] = useState(true);

  const sidebarW = collapsed ? 72 : 240;

  return (
    <div className="min-h-screen bg-[#fafbfc] text-ink">
      <aside
        style={{ width: sidebarW }}
        className="fixed inset-y-0 left-0 z-40 flex flex-col bg-[#0d111b] text-white/90 transition-[width] duration-200"
      >
        <div className={`flex items-center gap-2 pb-4 pt-6 ${collapsed ? "px-4 justify-center" : "px-6"}`}>
          <div className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-electric/15 text-electric">
            <Shield className="h-5 w-5" strokeWidth={2.2} />
          </div>
          {!collapsed && (
            <div className="leading-tight">
              <div className="text-[15px] font-semibold tracking-tight">Aegis</div>
              <div className="text-[10px] uppercase tracking-[0.18em] text-white/50">Underwriting</div>
            </div>
          )}
        </div>

        <nav className={`mt-4 flex-1 ${collapsed ? "px-2" : "px-3"}`}>
          {nav.map((item) => {
            const active = item.match ? pathname.startsWith(item.match) : item.exact ? pathname === item.to : pathname.startsWith(item.to);
            const Icon = item.icon;
            const isSettings = item.label === "Settings";
            return (
              <div key={item.to}>
                <Link
                  to={item.to}
                  onClick={() => isSettings && !collapsed && setSettingsOpen((v) => !v)}
                  title={collapsed ? item.label : undefined}
                  className={`group relative mb-1 flex items-center gap-3 rounded-xl ${collapsed ? "justify-center px-2" : "px-3"} py-2.5 text-[13.5px] transition-colors ${
                    active ? "bg-white/10 text-white" : "text-white/70 hover:bg-white/5 hover:text-white"
                  }`}
                >
                  {active && <span className="absolute inset-y-1.5 left-0 w-[3px] rounded-full bg-electric" />}
                  <Icon className="h-[17px] w-[17px] shrink-0" strokeWidth={1.9} />
                  {!collapsed && <span className="font-medium tracking-tight">{item.label}</span>}
                  {!collapsed && isSettings && (
                    <ChevronDown className={`ml-auto h-4 w-4 opacity-60 transition-transform ${settingsOpen ? "rotate-180" : ""}`} />
                  )}
                </Link>
                {!collapsed && isSettings && settingsOpen && (
                  <div className="mb-2 ml-8 space-y-0.5 border-l border-white/10 pl-3">
                    {[
                      { to: "/settings/profile", label: "Profile" },
                      { to: "/settings/team", label: "Team" },
                      { to: "/settings/notifications", label: "Notifications" },
                      { to: "/settings/integrations", label: "Integrations" },
                      { to: "/settings/api-keys", label: "API Keys" },
                    ].map((s) => (
                      <Link
                        key={s.to}
                        to={s.to}
                        className={`block rounded-lg px-2 py-1.5 text-[12.5px] transition-colors ${
                          pathname === s.to ? "text-white" : "text-white/55 hover:text-white"
                        }`}
                      >
                        {s.label}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </nav>

        {!collapsed && (
          <div className="mx-3 mb-3 rounded-2xl border border-white/10 bg-white/[0.03] p-3">
            <div className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.14em] text-electric">
              <Sparkles className="h-3.5 w-3.5" /> Agent status
            </div>
            <div className="mt-1 text-[12px] text-white/70">3 agents online · 12 tasks in queue</div>
            <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-white/10">
              <div className="h-full w-2/3 rounded-full bg-electric" />
            </div>
          </div>
        )}

        <button
          onClick={() => setCollapsed((v) => !v)}
          title={collapsed ? "Expand sidebar" : "Collapse sidebar"}
          className={`mx-3 mb-4 flex items-center gap-2 rounded-xl border border-white/10 bg-white/[0.03] py-2 text-[12px] text-white/70 hover:bg-white/[0.08] hover:text-white ${collapsed ? "justify-center px-0" : "px-3"}`}
        >
          {collapsed ? <ChevronsRight className="h-4 w-4" /> : <><ChevronsLeft className="h-4 w-4" /> Collapse</>}
        </button>
      </aside>

      <div style={{ paddingLeft: sidebarW }} className="transition-[padding] duration-200">
        <header className="sticky top-0 z-30 flex h-[60px] items-center gap-4 border-b border-mist/60 bg-white/90 px-8 backdrop-blur">
          <div className="relative flex-1 max-w-[520px]">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-fog" />
            <input
              placeholder="Search submissions, brokers, insureds…"
              className="h-9 w-full rounded-full border border-mist bg-snow pl-9 pr-4 text-[13px] text-ink placeholder:text-fog focus:border-electric focus:bg-white focus:outline-none"
            />
          </div>
          <div className="ml-auto flex items-center gap-3">
            <span className="hidden items-center gap-1.5 rounded-full border border-mist bg-white px-3 py-1 text-[11px] font-semibold uppercase tracking-widest text-smoke md:inline-flex">
              <span className="h-1.5 w-1.5 rounded-full bg-leaf" /> Live sync
            </span>
            <button className="relative grid h-9 w-9 place-items-center rounded-full border border-mist bg-white text-ink hover:bg-snow">
              <Bell className="h-4 w-4" />
              <span className="absolute right-1.5 top-1.5 h-1.5 w-1.5 rounded-full bg-coral" />
            </button>
            <button className="flex items-center gap-2.5 rounded-full border border-mist bg-white py-1 pl-1 pr-3 hover:bg-snow">
              <span className="grid h-7 w-7 place-items-center rounded-full bg-[#0d111b] text-[11px] font-semibold text-white">SC</span>
              <span className="text-[13px] font-medium text-ink">Sarah Chen</span>
              <ChevronDown className="h-3.5 w-3.5 text-fog" />
            </button>
          </div>
        </header>

        <main>{children}</main>
      </div>
    </div>
  );
}
