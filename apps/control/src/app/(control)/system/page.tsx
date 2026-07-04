import { SystemHealth } from "@/features/system/system-health";
import { getSystemHealth } from "@/lib/data";

export default function SystemHealthPage() {
  const health = getSystemHealth();
  return (
    <div>
      <h1 style={{ fontSize: "var(--ado-text-page-title-size)", lineHeight: "var(--ado-text-page-title-line)", fontWeight: "var(--ado-text-page-title-weight)", marginBottom: "var(--ado-space-4)" }}>
        System Health
      </h1>
      <SystemHealth health={health} />
    </div>
  );
}
