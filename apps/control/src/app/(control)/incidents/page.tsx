import { IncidentList } from "@/features/incidents/incident-list";
import { getIncidentList } from "@/lib/data";

export default function GlobalIncidentsPage() {
  const response = getIncidentList();
  return (
    <div>
      <h1 style={{ fontSize: "var(--ado-text-page-title-size)", lineHeight: "var(--ado-text-page-title-line)", fontWeight: "var(--ado-text-page-title-weight)", marginBottom: "var(--ado-space-4)" }}>
        Incidents
      </h1>
      <IncidentList response={response} />
    </div>
  );
}
