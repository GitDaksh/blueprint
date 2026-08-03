import { AppearanceSettings } from "@/features/settings/components/appearance-settings";
import { DataSettings } from "@/features/settings/components/data-settings";

export default function SettingsPage() {
  return (
    <div className="mx-auto flex w-full max-w-2xl flex-1 flex-col gap-6 p-6">
      <h1 className="font-heading text-lg font-semibold">Settings</h1>
      <AppearanceSettings />
      <DataSettings />
    </div>
  );
}