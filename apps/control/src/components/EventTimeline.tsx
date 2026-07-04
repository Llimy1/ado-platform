import type { ReactNode } from "react";
import Link from "next/link";
import styles from "./EventTimeline.module.css";
import { Panel } from "@/components/Panel";
import { EmptyState } from "@/components/StateViews";
import { formatAbsoluteTime, formatRelativeTime } from "@/lib/format";

export interface EventTimelineItem {
  eventKey: string;
  occurredAt: string;
  /** Pre-composed by the caller, e.g. "actor · 리뷰" or "closed → active". */
  metaText: string;
  /** Plain text or a Link — callers differ on whether the summary itself navigates. */
  summary: ReactNode;
  evidenceHref?: string | null;
}

interface EventTimelineProps {
  title: string;
  headingId: string;
  items: EventTimelineItem[];
  omittedCount?: number;
  emptyTitle: string;
}

/**
 * Shared append-only timeline: a static <ol>, not a live feed. Used by P-02
 * Recent Activity, P-03 Recent Planning Activity, P-04/P-05 timelines — all
 * of which render the same time/actor/summary/evidence shape.
 */
export function EventTimeline({ title, headingId, items, omittedCount = 0, emptyTitle }: EventTimelineProps) {
  return (
    <Panel title={title} headingId={headingId}>
      {items.length === 0 ? (
        <EmptyState title={emptyTitle} />
      ) : (
        <ol className={styles.timeline}>
          {items.map((ev) => (
            <li key={ev.eventKey} className={styles.timelineItem}>
              <span className={styles.timelineMeta}>
                <time dateTime={ev.occurredAt} title={formatAbsoluteTime(ev.occurredAt)}>
                  {formatRelativeTime(ev.occurredAt)}
                </time>{" "}
                · {ev.metaText}
              </span>
              <span>{ev.summary}</span>
              {ev.evidenceHref ? (
                <Link href={ev.evidenceHref}>근거 보기</Link>
              ) : (
                <span className={styles.muted}>근거 없음</span>
              )}
            </li>
          ))}
        </ol>
      )}
      {omittedCount > 0 ? <p className={styles.footerLink}>{omittedCount}건 더 있음</p> : null}
    </Panel>
  );
}
