import type { ButtonHTMLAttributes, ReactNode } from "react";
import styles from "./Button.module.css";

type Variant = "primary" | "secondary" | "danger" | "ghost" | "icon";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  dense?: boolean;
  children: ReactNode;
}

/**
 * Button per ADO/CONTROL_ROOM_COMPONENT_SPECS.md §2. Destructive/reject/
 * cancel/pause/retry actions must pass visible Korean text as children;
 * icon-only usage is reserved for `variant="icon"` utility actions and
 * requires an accessible name via aria-label at the call site.
 */
export function Button({
  variant = "secondary",
  dense = false,
  className,
  children,
  ...rest
}: ButtonProps) {
  const sizeClass = dense ? styles.sizeDense : styles.sizeDefault;
  return (
    <button
      className={[styles.button, styles[variant], sizeClass, className]
        .filter(Boolean)
        .join(" ")}
      {...rest}
    >
      {children}
    </button>
  );
}
