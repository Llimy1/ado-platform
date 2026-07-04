import type { ReactNode } from "react";
import styles from "./StatusBadge.module.css";
import {
  IconAlertTriangle,
  IconBan,
  IconCheckCircle,
  IconClock,
  IconSiren,
} from "./icons";

export type StatusTone = "success" | "warning" | "failure" | "running" | "queued" | "info";

const TONE_ICON: Record<StatusTone, (props: { className?: string }) => ReactNode> = {
  success: (p) => <IconCheckCircle {...p} />,
  warning: (p) => <IconAlertTriangle {...p} />,
  failure: (p) => <IconBan {...p} />,
  running: (p) => <IconClock {...p} />,
  queued: (p) => <IconClock {...p} />,
  info: (p) => <IconSiren {...p} />,
};

interface StatusBadgeProps {
  tone: StatusTone;
  label: string;
  reason?: string;
}

/**
 * Status Badge per ADO/CONTROL_ROOM_COMPONENT_SPECS.md §3. Never a button;
 * always icon + Korean label, never color alone.
 */
export function StatusBadge({ tone, label, reason }: StatusBadgeProps) {
  const Icon = TONE_ICON[tone];
  return (
    <span className={[styles.badge, styles[tone]].join(" ")}>
      {Icon({})}
      <span>{label}</span>
      {reason ? <span className="ado-visually-hidden">, {reason}</span> : null}
    </span>
  );
}
