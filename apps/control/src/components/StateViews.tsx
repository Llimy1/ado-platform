import type { ReactNode } from "react";
import styles from "./StateViews.module.css";
import { Button } from "./Button";
import { IconRefresh, IconWifiOff } from "./icons";

export function EmptyState({ title, children }: { title: string; children?: ReactNode }) {
  return (
    <div className={styles.wrap}>
      <p className={styles.title}>{title}</p>
      {children}
    </div>
  );
}

export function ErrorState({
  title,
  requestId,
  onRetry,
}: {
  title: string;
  requestId: string;
  onRetry: () => void;
}) {
  return (
    <div className={styles.errorWrap} role="alert">
      <p className={styles.title}>{title}</p>
      <p className={styles.requestId}>요청 ID: {requestId}</p>
      <Button variant="secondary" dense onClick={onRetry}>
        <IconRefresh />
        다시 시도
      </Button>
    </div>
  );
}

export function StaleBanner({
  observedAtLabel,
  onRetry,
  disconnected = false,
}: {
  observedAtLabel: string;
  onRetry: () => void;
  disconnected?: boolean;
}) {
  return (
    <div className={styles.staleBanner}>
      <span>
        <IconWifiOff style={{ marginRight: 6, verticalAlign: "-2px" }} />
        {disconnected ? "실시간 연결이 끊어졌습니다." : "데이터가 최신이 아닐 수 있습니다."} 마지막 확인:{" "}
        {observedAtLabel}
      </span>
      <Button variant="secondary" dense onClick={onRetry}>
        <IconRefresh />
        새로고침
      </Button>
    </div>
  );
}

export function DeniedState({
  title,
  backHref,
  linkLabel = "Projects로 돌아가기",
}: {
  title: string;
  backHref: string;
  linkLabel?: string;
}) {
  return (
    <div className={styles.wrap}>
      <p className={styles.title}>{title}</p>
      <a href={backHref}>{linkLabel}</a>
    </div>
  );
}
