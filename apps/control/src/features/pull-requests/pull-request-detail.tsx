import Link from "next/link";
import styles from "./pull-request-detail.module.css";
import { EventTimeline } from "@/components/EventTimeline";
import { Panel } from "@/components/Panel";
import { MachineValue } from "@/components/MachineValue";
import { StatusBadge } from "@/components/StatusBadge";
import { EmptyState } from "@/components/StateViews";
import { IconLink } from "@/components/icons";
import { LIFECYCLE_STATE_LABEL, LIFECYCLE_STATE_TONE, formatAbsoluteTime } from "@/lib/format";
import type { PullRequestDetailResponse } from "@/lib/contracts/pull-request";

const CHANGE_TYPE_LABEL: Record<string, string> = { added: "추가됨", modified: "수정됨", deleted: "삭제됨" };

/**
 * P-08.2 PR detail route: identity/external link, immutable branch/snapshot
 * binding, readiness evidence, changed-path summary, linked verification/
 * review, sync timeline. Never renders a merge command or GitHub review
 * approval as an ADO action.
 */
export function PullRequestDetail({ detail }: { detail: PullRequestDetailResponse }) {
  const { pullRequest, specRevision, gitSnapshot, verificationSummary, reviewSummary, changedPaths, syncTimeline } = detail;

  return (
    <div>
      <p className={styles.breadcrumb}>
        <Link href={pullRequest.componentWorkHref}>Component Work로 돌아가기</Link>
      </p>

      <div className={styles.header}>
        <div className={styles.titleRow}>
          <h1 className={styles.title}>PR #{pullRequest.externalNumber}</h1>
          <StatusBadge tone="info" label={pullRequest.status} />
        </div>
        <a href={pullRequest.externalUrl} target="_blank" rel="noreferrer noopener" className={styles.externalLink}>
          <IconLink />
          GitHub에서 열기
        </a>
        <div className={styles.metaRow}>
          <span>
            <span className={styles.metaLabel}>pullRequestId</span>
            <MachineValue value={pullRequest.pullRequestId} label="pullRequestId" />
          </span>
          <span>
            <span className={styles.metaLabel}>base ← head</span>
            <span className="ado-mono">
              {pullRequest.baseBranch} ← {pullRequest.headBranch}
            </span>
          </span>
          <span>
            <span className={styles.metaLabel}>Component Work</span>
            <Link href={pullRequest.componentWorkHref}>{pullRequest.componentWorkTitle}</Link>
          </span>
          <span>마지막 확인: {formatAbsoluteTime(detail.snapshot.observedAt)}</span>
        </div>
      </div>

      <div className={styles.section}>
        <Panel title="스냅샷 바인딩" headingId="pr-snapshot-heading">
          <dl className={styles.kvGrid}>
            <div>
              <span className={styles.kvLabel}>commit</span>
              <span className="ado-mono">{gitSnapshot.commitId}</span>
            </div>
            <div>
              <span className={styles.kvLabel}>tree</span>
              <span className="ado-mono">{gitSnapshot.treeId}</span>
            </div>
            <div>
              <span className={styles.kvLabel}>Spec revision</span>
              {specRevision.revision}
            </div>
            <div>
              <span className={styles.kvLabel}>생성 시각</span>
              {formatAbsoluteTime(pullRequest.createdAt)}
            </div>
            <div>
              <span className={styles.kvLabel}>마지막 동기화</span>
              {formatAbsoluteTime(pullRequest.lastSyncedAt)}
            </div>
          </dl>
        </Panel>
      </div>

      <div className={styles.section}>
        <Panel title="준비 근거" headingId="pr-readiness-heading">
          <div className={styles.metaRow}>
            <span>
              <span className={styles.metaLabel}>검증</span>
              <StatusBadge tone={LIFECYCLE_STATE_TONE[verificationSummary.state] ?? "queued"} label={LIFECYCLE_STATE_LABEL[verificationSummary.state] ?? verificationSummary.state} />
              {verificationSummary.href ? <Link href={verificationSummary.href}> 상세 보기</Link> : null}
            </span>
            <span>
              <span className={styles.metaLabel}>리뷰</span>
              <StatusBadge tone={LIFECYCLE_STATE_TONE[reviewSummary.state] ?? "queued"} label={LIFECYCLE_STATE_LABEL[reviewSummary.state] ?? reviewSummary.state} />
              {reviewSummary.href ? <Link href={reviewSummary.href}> 상세 보기</Link> : null}
            </span>
          </div>
        </Panel>
      </div>

      <div className={styles.section}>
        <Panel title="변경된 경로" headingId="pr-changed-paths-heading">
          {changedPaths.items.length === 0 ? (
            <EmptyState title="변경된 경로 정보가 없습니다." />
          ) : (
            <ul className={styles.pathList}>
              {changedPaths.items.map((p) => (
                <li key={p.path} className={styles.pathRow}>
                  <StatusBadge
                    tone={p.changeType === "deleted" ? "failure" : p.changeType === "added" ? "success" : "info"}
                    label={CHANGE_TYPE_LABEL[p.changeType] ?? p.changeType}
                  />
                  {p.href ? <Link href={p.href}>{p.path}</Link> : <span>{p.path}</span>}
                </li>
              ))}
            </ul>
          )}
          {changedPaths.omittedCount > 0 ? (
            <p style={{ marginTop: "var(--ado-space-3)", fontSize: "var(--ado-text-dense-size)", color: "var(--ado-color-text-tertiary)" }}>
              그 외 {changedPaths.omittedCount}건 더 있음
            </p>
          ) : null}
        </Panel>
      </div>

      <div className={styles.section}>
        <EventTimeline
          title="동기화 이력"
          headingId="pr-sync-timeline-heading"
          emptyTitle="동기화 이력이 없습니다."
          omittedCount={syncTimeline.omittedCount}
          items={syncTimeline.items.map((ev) => ({
            eventKey: ev.eventKey,
            occurredAt: ev.occurredAt,
            metaText: "system",
            summary: ev.summary,
            evidenceHref: ev.evidenceHref,
          }))}
        />
      </div>
    </div>
  );
}
