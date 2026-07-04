import { VerificationRunDetail } from "@/features/verification/verification-run-detail";
import { DeniedState } from "@/components/StateViews";
import { getVerificationRunDetail } from "@/lib/data";

export default async function VerificationRunPage({
  params,
}: {
  params: Promise<{ verificationRunId: string }>;
}) {
  const { verificationRunId } = await params;
  const detail = getVerificationRunDetail(verificationRunId);

  if (!detail) {
    return <DeniedState title="이 검증 실행을 볼 수 있는 권한이 없거나 존재하지 않습니다." backHref="/projects" linkLabel="Projects로 돌아가기" />;
  }

  return <VerificationRunDetail detail={detail} />;
}
