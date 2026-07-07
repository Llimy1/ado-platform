import { JobAttemptDetailRoute } from "@/features/runs/job-attempt-detail-route";
import { DeniedState } from "@/components/StateViews";
import { jobAttemptClient } from "@/lib/data";
import { mapJobAttemptDetail, mapAttemptLogPage } from "@/lib/contracts/ado-job";
import { AdoApiError } from "@/lib/api/errors";
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

  let detail;
  try {
    detail = mapJobAttemptDetail(jobAttemptId, await jobAttemptClient.getJobAttempt(jobAttemptId));
  } catch (error) {
    if (error instanceof AdoApiError && error.code === "JOB_ATTEMPT_NOT_FOUND") {
      return <DeniedState title="이 Run을 볼 수 있는 권한이 없거나 존재하지 않습니다." backHref="/projects" linkLabel="Projects로 돌아가기" />;
    }
    throw error;
  }

  const streamRaw = typeof resolvedSearch.stream === "string" ? resolvedSearch.stream : undefined;
  const activeStream: LogStream = streamRaw && VALID_STREAMS.includes(streamRaw as LogStream) ? (streamRaw as LogStream) : "stdout";
  const cursorRaw = typeof resolvedSearch.cursor === "string" ? resolvedSearch.cursor : undefined;

  const logPage = mapAttemptLogPage(
    jobAttemptId,
    activeStream,
    await jobAttemptClient.getJobAttemptLogs(jobAttemptId, { stream: activeStream, cursor: cursorRaw }),
  );

  return <JobAttemptDetailRoute detail={detail} activeStream={activeStream} logPage={logPage} />;
}
