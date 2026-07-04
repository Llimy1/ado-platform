import Link from "next/link";
import styles from "./settings-inspection.module.css";
import { Panel } from "@/components/Panel";
import { MachineValue } from "@/components/MachineValue";
import { EmptyState } from "@/components/StateViews";
import { formatAbsoluteTime } from "@/lib/format";
import type { SettingsResponse } from "@/lib/contracts/settings";

/**
 * P-10.3 settings: an inspection and navigation surface only. Every value
 * below is a labelled definition-list entry, never an editable input —
 * there is no secret form, token form, env editor, or branch-protection
 * writer in v1. Configuration mutation is a separately approved future use
 * case with its own Policy/Decision contract.
 */
export function SettingsInspection({ settings }: { settings: SettingsResponse }) {
  const { specRevision, apiVersion, uiVersion, session, repositoryPolicy, branchPolicy, activeConstraintProfiles, approvedConfigurationDecisions } = settings;

  return (
    <div>
      <div className={styles.section}>
        <Panel title="버전 및 세션" headingId="settings-version-heading">
          <dl className={styles.kvGrid}>
            <div>
              <span className={styles.kvLabel}>ADO Spec revision</span>
              {specRevision.revision}
              <span className={styles.kvNote}>
                <MachineValue value={specRevision.contentSha256} label="Spec SHA-256" /> · <Link href={specRevision.manifestHref}>매니페스트</Link>
              </span>
            </div>
            <div>
              <span className={styles.kvLabel}>API / UI 버전</span>
              {apiVersion} / {uiVersion}
            </div>
            <div>
              <span className={styles.kvLabel}>세션 신원</span>
              {session.operatorLabel} ({session.role})
            </div>
          </dl>
        </Panel>
      </div>

      <div className={styles.section}>
        <Panel title="정책" headingId="settings-policy-heading">
          <dl className={styles.kvGrid}>
            <div>
              <span className={styles.kvLabel}>공개 저장소 정책</span>
              {repositoryPolicy.publicRepositoriesAllowed ? "공개 저장소 허용" : "공개 저장소 비허용"}
              <span className={styles.kvNote}>{repositoryPolicy.note}</span>
            </div>
            <div>
              <span className={styles.kvLabel}>브랜치 정책</span>
              통합 브랜치: <span className="ado-mono">{branchPolicy.integrationBranch}</span> · PR base: <span className="ado-mono">{branchPolicy.baseBranchForPr}</span>
              <span className={styles.kvNote}>{branchPolicy.note}</span>
            </div>
          </dl>
        </Panel>
      </div>

      <div className={styles.section}>
        <Panel title="활성 ProjectConstraintProfile" headingId="settings-constraint-profiles-heading">
          {activeConstraintProfiles.length === 0 ? (
            <EmptyState title="활성 제약 프로필이 없습니다." />
          ) : (
            <ul className={styles.profileList}>
              {activeConstraintProfiles.map((p) => (
                <li key={p.projectKey} className={styles.profileRow}>
                  <span>{p.projectName}</span>
                  <span>
                    v{p.version} · {formatAbsoluteTime(p.approvedAt)} · <Link href={p.href}>보기</Link>
                  </span>
                </li>
              ))}
            </ul>
          )}
        </Panel>
      </div>

      <div className={styles.section}>
        <Panel title="승인된 구성 결정" headingId="settings-config-decisions-heading">
          {approvedConfigurationDecisions.length === 0 ? (
            <EmptyState title="승인된 구성 결정이 없습니다." />
          ) : (
            <ul className={styles.profileList}>
              {approvedConfigurationDecisions.map((d) => (
                <li key={d.decisionKey} className={styles.profileRow}>
                  <Link href={d.href}>{d.title}</Link>
                  <span>{formatAbsoluteTime(d.decidedAt)}</span>
                </li>
              ))}
            </ul>
          )}
        </Panel>
      </div>
    </div>
  );
}
