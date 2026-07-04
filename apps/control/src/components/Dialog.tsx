"use client";

import { useEffect, useRef, type ReactNode } from "react";
import styles from "./Dialog.module.css";
import { Button } from "./Button";
import { IconClose } from "./icons";
import { useBodyScrollLock } from "@/lib/use-body-scroll-lock";

interface DialogProps {
  open: boolean;
  onClose: () => void;
  title: string;
  role?: "dialog" | "alertdialog";
  children: ReactNode;
  actions?: ReactNode;
}

/**
 * Dialog per ADO/CONTROL_ROOM_COMPONENT_SPECS.md §7. Uses the native
 * <dialog> element so focus containment, Escape-to-close, and backdrop are
 * provided by the platform; focus returns to the invoking control on close
 * per the WAI-ARIA modal dialog pattern.
 */
export function Dialog({ open, onClose, title, role = "dialog", children, actions }: DialogProps) {
  const ref = useRef<HTMLDialogElement>(null);
  const openerRef = useRef<Element | null>(null);

  useBodyScrollLock(open);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (open && !el.open) {
      openerRef.current = document.activeElement;
      el.showModal();
    } else if (!open && el.open) {
      el.close();
    }
  }, [open]);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const handleClose = () => {
      onClose();
      if (openerRef.current instanceof HTMLElement) {
        openerRef.current.focus();
      }
    };
    el.addEventListener("close", handleClose);
    return () => el.removeEventListener("close", handleClose);
  }, [onClose]);

  return (
    <dialog ref={ref} className={styles.dialog} aria-labelledby="ado-dialog-title" role={role}>
      <div className={styles.inner}>
        <div className={styles.header}>
          <h2 id="ado-dialog-title" className={styles.title}>
            {title}
          </h2>
          <Button variant="icon" aria-label="닫기" dense onClick={() => ref.current?.close()}>
            <IconClose />
          </Button>
        </div>
        <div className={styles.body}>{children}</div>
        {actions ? <div className={styles.actions}>{actions}</div> : null}
      </div>
    </dialog>
  );
}
