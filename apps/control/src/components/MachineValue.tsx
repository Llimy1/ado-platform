"use client";

import { useState } from "react";
import styles from "./MachineValue.module.css";
import { IconCopy } from "./icons";

interface MachineValueProps {
  value: string;
  label: string;
  tooltip?: string;
}

/**
 * Monospace machine-value display with copy action and tooltip, per
 * ADO/CONTROL_ROOM_DESIGN_SYSTEM.md §3. The visible span is CSS-truncated
 * only (text-overflow: ellipsis clips paint, not the DOM text node), so
 * assistive tech already reads the full untruncated value from the element
 * itself. `title` covers the sighted-hover case; no aria-describedby/hidden
 * tooltip node is added here, since duplicating the same string as a
 * description would make screen readers announce every value twice.
 */
export function MachineValue({ value, label, tooltip }: MachineValueProps) {
  const [copied, setCopied] = useState(false);

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      // Clipboard API unavailable; no destructive fallback needed for a
      // read-only machine value.
    }
  }

  return (
    <span className={styles.wrap}>
      <span className={`${styles.value} ado-mono`} title={tooltip ?? value} tabIndex={0}>
        {value}
      </span>
      <button
        type="button"
        className={styles.copyButton}
        onClick={handleCopy}
        aria-label={`${label} 복사`}
      >
        <IconCopy />
      </button>
      {copied ? <span role="status" className="ado-visually-hidden">복사됨</span> : null}
    </span>
  );
}
