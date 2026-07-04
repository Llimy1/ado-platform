import Link from "next/link";
import styles from "./verification-run-detail.module.css";
import { VerificationCommandResults } from "./verification-command-results";
import { Panel } from "@/components/Panel";
import { MachineValue } from "@/components/MachineValue";
import { EmptyState } from "@/components/StateViews";
import { formatAbsoluteTime } from "@/lib/format";
import type { VerificationRunDetailResponse } from "@/lib/contracts/verification-run";

/**
 * P-07.4 Verification Run route: identity/evidence binding, required-result
 * banner, command results, artifacts. Read-only — this route cannot mark a
 * test passed or silence a finding.
 */
export function VerificationRunDetail({ detail }: { detail: VerificationRunDetailResponse }) {
  const { verificationRun, commands, artifacts } = detail;
  const rejected = !verificationRun.requiredPassed;

  return (
    <div>
      <p className={styles.breadcrumb}>
        <Link href={verificationRun.componentWorkHref}>Component Work로 돌아가기</Link>
      </p>

      <div className={styles.header}>
        <div className={styles.titleRow}>
          <h1 className={styles.title}>검증 실행: {verificationRun.componentWorkTitle}</h1>
        </div>
        <div className={styles.metaRow}>
          <span>
            <span className={styles.metaLabel}>verificationRunId</span>
            <MachineValue value={verificationRun.verificationRunId} label="verificationRunId" />
          </span>
          <span>
            <span className={styles.metaLabel}>프로필</span>
            {verificationRun.verificationProfile.key} {verificationRun.verificationProfile.version}
          </span>
          <span>
            <span className={styles.metaLabel}>Spec Library</span>
            {verificationRun.specLibrary.revision}
          </span>
          <span>마지막 확인: {formatAbsoluteTime(detail.snapshot.observedAt)}</span>
        </div>
      </div>

      <div className={[styles.resultBanner, rejected ? "rejected" : ""].join(" ")}>
        <p className={styles.resultTitle}>{verificationRun.requiredPassed ? "필수 검증 통과" : "필수 검증 미통과"}</p>
        <p className={styles.resultBody}>
          EvidenceGate: {verificationRun.evidenceGate.result} · {verificationRun.evidenceGate.reasonCode}
          {verificationRun.evidenceGate.href ? (
            <>
              {" "}
              · <Link href={verificationRun.evidenceGate.href}>근거 보기</Link>
            </>
          ) : null}
        </p>
      </div>

      <div className={styles.section}>
        <Panel title="Git 스냅샷 및 근거 바인딩" headingId="verification-binding-heading">
          <dl className={styles.kvGrid}>
            <div>
              <span className={styles.kvLabel}>commit</span>
              <span className="ado-mono">{verificationRun.gitSnapshot.commitId}</span>
            </div>
            <div>
              <span className={styles.kvLabel}>tree</span>
              <span className="ado-mono">{verificationRun.gitSnapshot.treeId}</span>
            </div>
            <div>
              <span className={styles.kvLabel}>base commit</span>
              <span className="ado-mono">{verificationRun.gitSnapshot.baseCommitId}</span>
            </div>
            <div>
              <span className={styles.kvLabel}>시작</span>
              {formatAbsoluteTime(verificationRun.startedAt)}
            </div>
            <div>
              <span className={styles.kvLabel}>종료</span>
              {verificationRun.finishedAt ? formatAbsoluteTime(verificationRun.finishedAt) : "-"}
            </div>
          </dl>
        </Panel>
      </div>

      <div className={styles.section}>
        <VerificationCommandResults commands={commands} />
      </div>

      <div className={styles.section}>
        <Panel title="Artifact" headingId="verification-artifacts-heading">
          {artifacts.length === 0 ? (
            <EmptyState title="등록된 Artifact가 없습니다." />
          ) : (
            <ul style={{ listStyle: "none", margin: 0, padding: 0, display: "flex", flexDirection: "column", gap: "var(--ado-space-2)" }}>
              {artifacts.map((a) => (
                <li key={a.artifactKey}>
                  {a.type} — {a.href ? <Link href={a.href}>보기</Link> : "없음"}
                </li>
              ))}
            </ul>
          )}
        </Panel>
      </div>
    </div>
  );
}
