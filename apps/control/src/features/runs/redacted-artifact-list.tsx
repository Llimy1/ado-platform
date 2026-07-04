import Link from "next/link";
import styles from "./job-attempt-detail-route.module.css";
import { Panel } from "@/components/Panel";
import { EmptyState } from "@/components/StateViews";
import { StatusBadge } from "@/components/StatusBadge";
import type { JobAttemptDetailResponse } from "@/lib/contracts/job-attempt";

const REDACTION_LABEL: Record<string, string> = {
  not_required: "원본",
  redacted: "일부 편집됨",
  fully_redacted: "전체 편집됨",
};

function formatBytes(byteSize: number): string {
  if (byteSize < 1024) return `${byteSize} B`;
  return `${(byteSize / 1024).toFixed(1)} KB`;
}

/** P-06.3: artifact links describe type and redaction status; no raw payload rendering. */
export function RedactedArtifactList({ artifacts }: { artifacts: JobAttemptDetailResponse["artifacts"] }) {
  return (
    <Panel title="Artifact" headingId="redacted-artifact-list-heading">
      {artifacts.length === 0 ? (
        <EmptyState title="등록된 Artifact가 없습니다." />
      ) : (
        <ul style={{ listStyle: "none", margin: 0, padding: 0, display: "flex", flexDirection: "column", gap: "var(--ado-space-2)" }}>
          {artifacts.map((a) => (
            <li key={a.artifactKey} className={styles.metaRow} style={{ borderBottom: "1px solid var(--ado-color-border)", paddingBottom: "var(--ado-space-2)" }}>
              <span>{a.type}</span>
              <StatusBadge tone={a.redactionStatus === "not_required" ? "success" : "warning"} label={REDACTION_LABEL[a.redactionStatus] ?? a.redactionStatus} />
              <span>{formatBytes(a.byteSize)}</span>
              {a.href ? <Link href={a.href}>보기</Link> : <span>다운로드 불가</span>}
            </li>
          ))}
        </ul>
      )}
    </Panel>
  );
}
