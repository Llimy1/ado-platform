"use client";

import { useId, useRef, useState } from "react";
import styles from "./log-pre.module.css";
import { Button } from "@/components/Button";

interface LogPreProps {
  lines: Array<{ sequence: number; level: "info" | "warn" | "error"; text: string }>;
  label: string;
}

/**
 * P-06.3: labelled <pre> inside a bounded scroll container. Wraps only when
 * the owner explicitly enables 줄 바꿈, and offers copy-visible-text only —
 * both are local UI state, not data fetching, so this is the only client
 * component in the log reader.
 */
export function LogPre({ lines, label }: LogPreProps) {
  const [wrap, setWrap] = useState(false);
  const [copied, setCopied] = useState(false);
  const wrapId = useId();
  const preRef = useRef<HTMLPreElement>(null);

  async function handleCopy() {
    const text = lines.map((l) => l.text).join("\n");
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      // Clipboard API unavailable; nothing destructive to fall back to.
    }
  }

  return (
    <div>
      <div className={styles.toolbar}>
        <label className={styles.wrapToggle} htmlFor={wrapId}>
          <input id={wrapId} type="checkbox" checked={wrap} onChange={(e) => setWrap(e.target.checked)} />
          줄 바꿈
        </label>
        <Button variant="ghost" dense onClick={handleCopy}>
          {copied ? "복사됨" : "표시된 로그 복사"}
        </Button>
      </div>
      <pre ref={preRef} className={[styles.pre, wrap ? styles.preWrap : ""].join(" ")} aria-label={label} tabIndex={0}>
        {lines.map((l) => (
          <div key={l.sequence} className={l.level === "error" ? styles.lineError : l.level === "warn" ? styles.lineWarn : undefined}>
            {l.text}
          </div>
        ))}
      </pre>
    </div>
  );
}
