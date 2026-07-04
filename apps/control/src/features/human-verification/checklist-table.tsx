import Link from "next/link";
import styles from "./checklist-table.module.css";
import { Panel } from "@/components/Panel";
import { StatusBadge } from "@/components/StatusBadge";
import { Button } from "@/components/Button";
import { EmptyState } from "@/components/StateViews";
import { formatAbsoluteTime } from "@/lib/format";
import type { HumanVerificationChecklistItem, HumanVerificationItemResult } from "@/lib/contracts/human-verification";

const RESULT_LABEL: Record<HumanVerificationItemResult, string> = {
  passed: "통과",
  failed: "실패",
  skipped: "건너뜀",
};

const RESULT_TONE: Record<HumanVerificationItemResult, "success" | "failure" | "queued"> = {
  passed: "success",
  failed: "failure",
  skipped: "queued",
};

const DISABLED_REASON = "프로토타입 - 백엔드 명령이 연동되어 있지 않아 실행되지 않습니다.";

/**
 * P-08.3 checklist table: each item's latest result and a record-result
 * command. The command is always rendered disabled — this prototype has
 * no backend to accept a human decision, so a clickable no-op would
 * misrepresent a real state-changing action.
 */
export function ChecklistTable({
  title,
  headingId,
  items,
  emptyTitle,
}: {
  title: string;
  headingId: string;
  items: HumanVerificationChecklistItem[];
  emptyTitle: string;
}) {
  return (
    <Panel title={title} headingId={headingId}>
      {items.length === 0 ? (
        <EmptyState title={emptyTitle} />
      ) : (
        <>
          <div className="ado-show-desktop-table">
            <ChecklistDesktopTable items={items} />
          </div>
          <div className="ado-show-mobile-cards">
            <ChecklistCards items={items} />
          </div>
        </>
      )}
    </Panel>
  );
}

function ChecklistDesktopTable({ items }: { items: HumanVerificationChecklistItem[] }) {
  return (
    <div className={styles.wrapper}>
      <table className={styles.table}>
        <caption className={styles.caption}>체크리스트 항목, {items.length}건 표시 중</caption>
        <thead>
          <tr>
            <th scope="col">항목</th>
            <th scope="col">최근 결과</th>
            <th scope="col">기록자</th>
            <th scope="col">근거</th>
            <th scope="col">명령</th>
          </tr>
        </thead>
        <tbody>
          {items.map((item) => (
            <tr key={item.itemKey}>
              <td>
                {item.title}
                <span className={styles.instructions}>{item.instructions}</span>
              </td>
              <td>
                {item.latestResult ? (
                  <StatusBadge tone={RESULT_TONE[item.latestResult.result]} label={RESULT_LABEL[item.latestResult.result]} />
                ) : (
                  <span className={styles.muted}>기록 없음</span>
                )}
              </td>
              <td>
                {item.latestResult ? (
                  <>
                    {item.latestResult.actorLabel}
                    <span className={styles.instructions}>{formatAbsoluteTime(item.latestResult.recordedAt)}</span>
                  </>
                ) : (
                  <span className={styles.muted}>-</span>
                )}
              </td>
              <td>
                {item.latestResult?.evidenceHref ? (
                  <Link href={item.latestResult.evidenceHref}>보기</Link>
                ) : (
                  <span className={styles.muted}>없음</span>
                )}
              </td>
              <td>
                {item.canRecordResult ? (
                  <Button variant="secondary" dense disabled title={DISABLED_REASON}>
                    결과 기록
                  </Button>
                ) : (
                  <span className={styles.muted}>기록 불가</span>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function ChecklistCards({ items }: { items: HumanVerificationChecklistItem[] }) {
  return (
    <ul className={styles.cardList}>
      {items.map((item) => (
        <li key={item.itemKey} className={styles.card}>
          <div className={styles.cardTop}>
            <span>{item.title}</span>
            {item.latestResult ? (
              <StatusBadge tone={RESULT_TONE[item.latestResult.result]} label={RESULT_LABEL[item.latestResult.result]} />
            ) : (
              <span className={styles.muted}>기록 없음</span>
            )}
          </div>
          <span className={styles.instructions}>{item.instructions}</span>
          {item.latestResult ? (
            <span>
              {item.latestResult.actorLabel} · {formatAbsoluteTime(item.latestResult.recordedAt)}
            </span>
          ) : null}
          {item.latestResult?.evidenceHref ? <Link href={item.latestResult.evidenceHref}>근거 보기</Link> : null}
          {item.canRecordResult ? (
            <Button variant="secondary" dense disabled title={DISABLED_REASON}>
              결과 기록
            </Button>
          ) : (
            <span className={styles.muted}>기록 불가</span>
          )}
        </li>
      ))}
    </ul>
  );
}
