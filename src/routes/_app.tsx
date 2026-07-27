import { createFileRoute, Outlet } from "@tanstack/react-router";
import { Shell } from "../components/app/Shell";

export const Route = createFileRoute("/_app")({
  component: () => (
    <Shell>
      <Outlet />
    </Shell>
  ),
});
