import Link from "next/link";
import panelStyles from "./overview-panels.module.css";
import { Panel } from "@/components/Panel";
import { EmptyState } from "@/components/StateViews";
import type { ProjectOverviewResponse } from "@/lib/contracts/project-overview";

const REASON_LABEL: Record<string, string> = {
  requires_human_action: "사람의 승인 대기",
  blocked: "차단된 작업",
  active: "현재 실행 중",
  next_approved: "다음 승인 단위",
};

const EMPTY_REASON_LABEL: Record<string, string> = {
  no_approved_roadmap: "승인된 로드맵이 없습니다.",
  no_feature_units: "등록된 Feature Unit이 없습니다.",
  all_required_feature_units_closed: "필수 Feature Unit이 모두 종료되었습니다.",
  project_archived: "Project가 보관되어 있습니다.",
};

/** P-02.5 Focus Feature Unit: no percent-complete bar, API-provided empty reasons only. */
export function FocusFeatureUnitCard({
  focusFeatureUnit,
  emptyReason,
  roadmapHref,
}: {
  focusFeatureUnit: ProjectOverviewResponse["focusFeatureUnit"];
  emptyReason: ProjectOverviewResponse["focusFeatureUnitEmptyReason"];
  roadmapHref?: string;
}) {
  return (
    <Panel title="집중 Feature Unit" headingId="focus-fu-heading">
      {focusFeatureUnit ? (
        <div>
          <Link href={focusFeatureUnit.href} className={panelStyles.itemTitle} style={{ fontSize: "var(--ado-text-body-size)" }}>
            {focusFeatureUnit.title}
          </Link>
          <p className={panelStyles.itemMeta}>
            상태: {focusFeatureUnit.state} · 선정 사유: {REASON_LABEL[focusFeatureUnit.reason] ?? focusFeatureUnit.reason}
          </p>
          <dl className={panelStyles.kvGrid} style={{ marginTop: "var(--ado-space-3)" }}>
            <div>
              <span className={panelStyles.kvLabel}>Component Work</span>
              총 {focusFeatureUnit.componentWork.total}건
            </div>
            <div>
              <span className={panelStyles.kvLabel}>실행 중</span>
              {focusFeatureUnit.componentWork.running}건
            </div>
            <div>
              <span className={panelStyles.kvLabel}>차단됨</span>
              {focusFeatureUnit.componentWork.blocked}건
            </div>
            <div>
              <span className={panelStyles.kvLabel}>PR 생성됨</span>
              {focusFeatureUnit.componentWork.prCreated}건
            </div>
          </dl>
        </div>
      ) : (
        <EmptyState title={emptyReason ? EMPTY_REASON_LABEL[emptyReason] ?? emptyReason : "선택된 Feature Unit이 없습니다."}>
          {roadmapHref ? <Link href={roadmapHref}>로드맵 보기</Link> : null}
        </EmptyState>
      )}
    </Panel>
  );
}
