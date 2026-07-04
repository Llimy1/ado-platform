import { DecisionInbox } from "@/features/decisions/decision-inbox";
import { getDecisionList } from "@/lib/data";

export default function GlobalDecisionsPage() {
  const response = getDecisionList(null);
  return (
    <div>
      <h1 style={{ fontSize: "var(--ado-text-page-title-size)", lineHeight: "var(--ado-text-page-title-line)", fontWeight: "var(--ado-text-page-title-weight)", marginBottom: "var(--ado-space-4)" }}>
        Human Decision Inbox
      </h1>
      <DecisionInbox response={response} showProjectColumn />
    </div>
  );
}
