import { JobAttemptDetailRoute } from "@/features/runs/job-attempt-detail-route";
import { DeniedState } from "@/components/StateViews";
import { getJobAttemptDetail, getAttemptLogPage } from "@/lib/data";
import type { LogStream } from "@/lib/contracts/job-attempt";

const VALID_STREAMS: LogStream[] = ["stdout", "stderr", "system"];

export default async function JobAttemptDetailPage({
  params,
  searchParams,
}: {
  params: Promise<{ jobAttemptId: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const { jobAttemptId } = await params;
  const resolvedSearch = await searchParams;

  const detail = getJobAttemptDetail(jobAttemptId);
  if (!detail) {
    return <DeniedState title="이 Run을 볼 수 있는 권한이 없거나 존재하지 않습니다." backHref="/projects" linkLabel="Projects로 돌아가기" />;
  }

  const streamRaw = typeof resolvedSearch.stream === "string" ? resolvedSearch.stream : undefined;
  const activeStream: LogStream = streamRaw && VALID_STREAMS.includes(streamRaw as LogStream) ? (streamRaw as LogStream) : "stdout";
  const cursorRaw = typeof resolvedSearch.cursor === "string" ? resolvedSearch.cursor : null;

  const logPage = getAttemptLogPage(jobAttemptId, activeStream, cursorRaw);

  return <JobAttemptDetailRoute detail={detail} activeStream={activeStream} logPage={logPage} />;
}
