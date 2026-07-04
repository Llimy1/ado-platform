import { PullRequestDetail } from "@/features/pull-requests/pull-request-detail";
import { DeniedState } from "@/components/StateViews";
import { getPullRequestDetail } from "@/lib/data";

export default async function PullRequestPage({
  params,
}: {
  params: Promise<{ pullRequestId: string }>;
}) {
  const { pullRequestId } = await params;
  const detail = getPullRequestDetail(pullRequestId);

  if (!detail) {
    return <DeniedState title="이 Pull Request를 볼 수 있는 권한이 없거나 존재하지 않습니다." backHref="/projects" linkLabel="Projects로 돌아가기" />;
  }

  return <PullRequestDetail detail={detail} />;
}
