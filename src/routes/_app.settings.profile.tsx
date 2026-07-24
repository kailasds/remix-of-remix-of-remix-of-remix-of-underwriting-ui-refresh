import { createFileRoute } from "@tanstack/react-router";
import { Card, Eyebrow, PillButton } from "../components/app/primitives";

export const Route = createFileRoute("/_app/settings/profile")({
  component: Profile,
});

function Profile() {
  return (
    <Card className="p-6 animate-fade-up">
      <div className="flex items-center gap-5 border-b border-mist/60 pb-6">
        <span className="grid h-16 w-16 place-items-center rounded-2xl bg-[#0d111b] text-[20px] font-semibold text-white">AP</span>
        <div>
          <div className="text-[18px] font-semibold text-ink">Akhil Philip</div>
          <div className="text-[13px] text-smoke">Senior Underwriter · Commercial Property</div>
        </div>
        <PillButton variant="secondary" className="ml-auto">Change photo</PillButton>
      </div>
      <div className="mt-6 grid grid-cols-2 gap-6">
        {[
          ["Full name", "Akhil Philip"],
          ["Email", "akhil.philip@aegis-uw.com"],
          ["Department", "Commercial Property"],
          ["Role", "Senior Underwriter"],
          ["Timezone", "GMT+0 (London)"],
          ["Locale", "English (US)"],
        ].map(([l, v]) => (
          <label key={l} className="block">
            <Eyebrow>{l}</Eyebrow>
            <input defaultValue={v as string} className="mt-1.5 h-10 w-full rounded-xl border border-mist bg-white px-3 text-[13px] focus:border-electric focus:outline-none" />
          </label>
        ))}
      </div>
      <div className="mt-6 flex justify-end gap-2">
        <PillButton variant="secondary">Cancel</PillButton>
        <PillButton>Save changes</PillButton>
      </div>
    </Card>
  );
}
