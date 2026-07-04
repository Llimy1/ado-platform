import { ReviewGroupDetail } from "@/features/reviews/review-group-detail";
import { DeniedState } from "@/components/StateViews";
import { getReviewGroupDetail } from "@/lib/data";

export default async function ReviewGroupPage({
  params,
}: {
  params: Promise<{ reviewGroupId: string }>;
}) {
  const { reviewGroupId } = await params;
  const detail = getReviewGroupDetail(reviewGroupId);

  if (!detail) {
    return <DeniedState title="이 리뷰를 볼 수 있는 권한이 없거나 존재하지 않습니다." backHref="/projects" linkLabel="Projects로 돌아가기" />;
  }

  return <ReviewGroupDetail detail={detail} />;
}
