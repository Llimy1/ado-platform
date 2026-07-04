import Link from "next/link";
import { EventTimeline } from "@/components/EventTimeline";
import type { ProjectOverviewResponse } from "@/lib/contracts/project-overview";

const KIND_LABEL: Record<string, string> = {
  state_transition: "상태 전이",
  verification: "검증",
  review: "리뷰",
  decision: "결정",
  incident: "사고",
  pull_request: "Pull Request",
};

/** P-02.5 Recent Activity. */
export function RecentActivityTimeline({
  recentActivity,
}: {
  recentActivity: ProjectOverviewResponse["recentActivity"];
}) {
  return (
    <EventTimeline
      title="최근 활동"
      headingId="recent-activity-heading"
      emptyTitle="최근 활동 기록이 없습니다."
      omittedCount={recentActivity.omittedCount}
      items={recentActivity.items.map((ev) => ({
        eventKey: ev.eventKey,
        occurredAt: ev.occurredAt,
        metaText: `${ev.actorLabel} · ${KIND_LABEL[ev.kind] ?? ev.kind}`,
        summary: <Link href={ev.subject.href}>{ev.summary}</Link>,
        evidenceHref: ev.evidenceHref,
      }))}
    />
  );
}
