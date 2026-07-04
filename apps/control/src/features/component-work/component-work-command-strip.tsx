import styles from "./component-work-detail-route.module.css";
import { Button } from "@/components/Button";
import type { ComponentWorkCommand, ComponentWorkDetailResponse } from "@/lib/contracts/component-work";

const COMMAND_LABEL: Record<ComponentWorkCommand, string> = {
  pause: "일시정지",
  resume: "재개",
  retry: "재시도",
  cancel: "취소",
  request_pr: "PR 요청",
};

const COMMAND_VARIANT: Record<ComponentWorkCommand, "primary" | "secondary" | "danger"> = {
  pause: "secondary",
  resume: "primary",
  retry: "primary",
  cancel: "danger",
  request_pr: "primary",
};

const DISABLED_REASON = "프로토타입 - 백엔드 명령이 연동되어 있지 않아 실행되지 않습니다.";

/**
 * P-05.3/P-05.5: only server-authorized controls appear (allowedActions),
 * and only as ordinary buttons when there are fewer than two — this
 * prototype never has more than a couple, so no toolbar role is applied.
 * Every command is disabled: no backend exists to accept pause/resume/
 * retry/cancel/request_pr, so a clickable-looking no-op would misrepresent
 * a real state-changing action.
 */
export function ComponentWorkCommandStrip({ commandGate }: { commandGate: ComponentWorkDetailResponse["commandGate"] }) {
  if (commandGate.allowedActions.length === 0 && !commandGate.paused) return null;

  return (
    <div className={styles.commandStrip}>
      {commandGate.paused ? (
        <span className={styles.pausedNotice}>일시정지됨{commandGate.pauseReason ? `: ${commandGate.pauseReason}` : ""}</span>
      ) : null}
      {commandGate.allowedActions.map((action) => (
        <Button key={action} variant={COMMAND_VARIANT[action]} disabled title={DISABLED_REASON}>
          {COMMAND_LABEL[action]}
        </Button>
      ))}
      <span className={styles.disabledReason}>{DISABLED_REASON}</span>
    </div>
  );
}
