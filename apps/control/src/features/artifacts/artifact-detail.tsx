import Link from "next/link";
import styles from "./artifact-detail.module.css";
import { Panel } from "@/components/Panel";
import { StatusBadge } from "@/components/StatusBadge";
import { MachineValue } from "@/components/MachineValue";
import { Button } from "@/components/Button";
import { EmptyState } from "@/components/StateViews";
import { formatAbsoluteTime } from "@/lib/format";
import type { ArtifactDetailResponse, ArtifactStatus, ArtifactType } from "@/lib/contracts/artifact";

const TYPE_LABEL: Record<ArtifactType, string> = {
  spec_document: "Spec 문서",
  constraint_profile: "제약 프로필",
  review_packet: "리뷰 패킷",
  verification_summary: "검증 요약",
  diff: "Diff",
  human_verification_evidence: "인간 검증 근거",
  pull_request_packet: "PR 패킷",
  incident_summary: "사고 요약",
  allowed_paths: "허용 경로 규칙",
};

const STATUS_LABEL: Record<ArtifactStatus, string> = {
  available: "사용 가능",
  quarantined: "격리됨",
  expired: "만료됨",
  deleted: "삭제됨",
  redaction_failed: "마스킹 실패",
};

const STATUS_TONE: Record<ArtifactStatus, "success" | "failure" | "warning" | "queued"> = {
  available: "success",
  quarantined: "failure",
  expired: "queued",
  deleted: "queued",
  redaction_failed: "failure",
};

const DOWNLOAD_DISABLED_REASON = "프로토타입 - 실제 파일 서빙 백엔드가 연동되어 있지 않아 원문을 열거나 내려받을 수 없습니다.";

function formatBytes(size: number): string {
  if (size < 1024) return `${size} B`;
  if (size < 1024 * 1024) return `${(size / 1024).toFixed(1)} KB`;
  return `${(size / 1024 / 1024).toFixed(1)} MB`;
}

/**
 * P-10.1 artifact detail: the browser never guesses renderability — it
 * renders only the server-authorized `render.kind`. Quarantined, expired,
 * deleted, failed-redaction, and restricted artifacts always fall through
 * to the metadata-only unavailable state, never a stale cached preview.
 */
export function ArtifactDetail({ detail, backHref }: { detail: ArtifactDetailResponse; backHref: string }) {
  const { artifact, render, provenance, downloadHref } = detail;

  return (
    <div>
      <p className={styles.breadcrumb}>
        <Link href={backHref}>돌아가기</Link>
      </p>

      <div className={styles.header}>
        <div className={styles.titleRow}>
          <h1 className={styles.title}>{artifact.artifactKey}</h1>
          <StatusBadge tone={STATUS_TONE[artifact.status]} label={STATUS_LABEL[artifact.status]} />
        </div>
        <div className={styles.metaRow}>
          <span>
            <span className={styles.metaLabel}>유형</span>
            {TYPE_LABEL[artifact.type]}
          </span>
          <span>
            <span className={styles.metaLabel}>분류</span>
            {artifact.classification === "restricted" ? "제한됨" : "내부"}
          </span>
          <span>
            <span className={styles.metaLabel}>생성 시각</span>
            {formatAbsoluteTime(artifact.createdAt)}
          </span>
        </div>
      </div>

      <div className={styles.section}>
        <Panel title="메타데이터" headingId="artifact-metadata-heading">
          <dl className={styles.kvGrid}>
            <div>
              <span className={styles.kvLabel}>SHA-256</span>
              <MachineValue value={artifact.contentSha256} label="SHA-256" />
            </div>
            <div>
              <span className={styles.kvLabel}>MIME / 크기</span>
              {artifact.mimeType} · {formatBytes(artifact.byteSize)}
            </div>
            <div>
              <span className={styles.kvLabel}>소스 버전</span>
              <MachineValue value={artifact.sourceVersion} label="소스 버전" />
            </div>
            <div>
              <span className={styles.kvLabel}>컨텍스트 해시</span>
              <MachineValue value={artifact.contextHash} label="컨텍스트 해시" />
            </div>
            {artifact.specRevision !== null ? (
              <div>
                <span className={styles.kvLabel}>Spec revision</span>
                {artifact.specRevision}
                {artifact.manifestHref ? (
                  <>
                    {" · "}
                    <Link href={artifact.manifestHref}>매니페스트</Link>
                  </>
                ) : null}
              </div>
            ) : null}
            <div>
              <span className={styles.kvLabel}>보존 정책</span>
              {artifact.retentionPolicy}
            </div>
          </dl>
        </Panel>
      </div>

      <div className={styles.section}>
        <Panel
          title="내용"
          headingId="artifact-content-heading"
          action={
            downloadHref ? (
              <Button variant="secondary" dense disabled title={DOWNLOAD_DISABLED_REASON}>
                다운로드
              </Button>
            ) : undefined
          }
        >
          {render.kind === "unavailable" ? (
            <div className={styles.unavailableBox}>{render.unavailableReason ?? "이 근거는 미리보기할 수 없습니다."}</div>
          ) : (
            <div style={{ display: "flex", alignItems: "center", gap: "var(--ado-space-3)", flexWrap: "wrap" }}>
              <p style={{ fontSize: "var(--ado-text-dense-size)", color: "var(--ado-color-text-secondary)", margin: 0 }}>
                {render.kind === "sanitized_text" ? "마스킹된 텍스트 렌더링" : render.kind === "document" ? "제어된 문서 렌더링" : "이미지 미리보기"}
              </p>
              {render.contentHref ? (
                <Button variant="secondary" dense disabled title={DOWNLOAD_DISABLED_REASON}>
                  새 탭에서 보기
                </Button>
              ) : null}
            </div>
          )}
        </Panel>
      </div>

      <div className={styles.section}>
        <Panel title="출처" headingId="artifact-provenance-heading">
          {provenance.length === 0 ? (
            <EmptyState title="기록된 출처 관계가 없습니다." />
          ) : (
            <ul className={styles.provenanceList}>
              {provenance.map((p) => (
                <li key={p.edgeKey} className={styles.provenanceRow}>
                  <span style={{ color: "var(--ado-color-text-tertiary)" }}>{p.relation}</span>
                  <Link href={p.subject.href}>{p.subject.title}</Link>
                </li>
              ))}
            </ul>
          )}
        </Panel>
      </div>
    </div>
  );
}
