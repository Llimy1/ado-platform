import Link from "next/link";
import styles from "./attempt-log-reader.module.css";
import { Panel } from "@/components/Panel";
import { EmptyState } from "@/components/StateViews";
import { LogPre } from "./log-pre";
import type { AttemptLogPageResponse, LogStream } from "@/lib/contracts/job-attempt";

const STREAM_LABEL: Record<LogStream, string> = { stdout: "stdout", stderr: "stderr", system: "system" };
const STREAMS: LogStream[] = ["stdout", "stderr", "system"];

interface AttemptLogReaderProps {
  jobAttemptId: string;
  activeStream: LogStream;
  page: AttemptLogPageResponse | null;
}

/**
 * P-06.3: manual stream links (not a preloaded tab widget — see spec's
 * "otherwise use ordinary links to preserve predictable latency"), one
 * stream at a time, opaque forward cursor. No live SSE / auto-tail in this
 * prototype.
 */
export function AttemptLogReader({ jobAttemptId, activeStream, page }: AttemptLogReaderProps) {
  return (
    <Panel title="로그" headingId="attempt-log-reader-heading">
      <nav className={styles.streamLinks} aria-label="로그 스트림 선택">
        {STREAMS.map((s) => (
          <Link
            key={s}
            href={`/runs/${jobAttemptId}?stream=${s}`}
            className={[styles.streamLink, s === activeStream ? styles.streamLinkActive : ""].join(" ")}
            aria-current={s === activeStream ? "page" : undefined}
          >
            {STREAM_LABEL[s]}
          </Link>
        ))}
      </nav>

      {!page || page.entries.length === 0 ? (
        <EmptyState title={`${STREAM_LABEL[activeStream]} 스트림에 출력이 없습니다.`} />
      ) : (
        <>
          {page.redaction?.applied ? (
            <p className={styles.redactionNote}>
              일부 항목이 편집되었습니다 ({page.redaction.omittedEntryCount}건 생략
              {page.redaction.reasonCode ? ` · ${page.redaction.reasonCode}` : ""})
            </p>
          ) : null}
          <LogPre lines={page.entries} label={`${STREAM_LABEL[activeStream]} 로그 출력`} />
          {page.nextCursor ? (
            <div className={styles.footer}>
              <Link href={`/runs/${jobAttemptId}?stream=${activeStream}&cursor=${page.nextCursor}`}>다음 페이지</Link>
            </div>
          ) : null}
        </>
      )}
    </Panel>
  );
}
