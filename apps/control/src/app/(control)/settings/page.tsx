import { SettingsInspection } from "@/features/settings/settings-inspection";
import { getSettings } from "@/lib/data";

export default function SettingsPage() {
  const settings = getSettings();
  return (
    <div>
      <h1 style={{ fontSize: "var(--ado-text-page-title-size)", lineHeight: "var(--ado-text-page-title-line)", fontWeight: "var(--ado-text-page-title-weight)", marginBottom: "var(--ado-space-4)" }}>
        Settings
      </h1>
      <SettingsInspection settings={settings} />
    </div>
  );
}
