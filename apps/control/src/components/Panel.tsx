import type { ReactNode } from "react";
import styles from "./Panel.module.css";

interface PanelProps {
  title?: string;
  headingId?: string;
  action?: ReactNode;
  large?: boolean;
  className?: string;
  children: ReactNode;
  ["aria-label"]?: string;
}

/** Panel per ADO/CONTROL_ROOM_COMPONENT_SPECS.md §6: one operational topic per panel. */
export function Panel({
  title,
  headingId,
  action,
  large,
  className,
  children,
  ...rest
}: PanelProps) {
  return (
    <section
      className={[styles.panel, large ? styles.large : "", className].filter(Boolean).join(" ")}
      aria-labelledby={title ? headingId : undefined}
      {...rest}
    >
      {title ? (
        <div className={styles.header}>
          <h2 id={headingId} className={styles.title}>
            {title}
          </h2>
          {action}
        </div>
      ) : null}
      {children}
    </section>
  );
}
