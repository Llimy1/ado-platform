import { EventTimeline } from "@/components/EventTimeline";
import type { RoadmapDetailResponse } from "@/lib/contracts/roadmaps";

/** P-03.6: a ten-item ordered list of immutable planning events, not a general log. */
export function RecentPlanningActivity({
  activity,
}: {
  activity: RoadmapDetailResponse["recentPlanningActivity"];
}) {
  return (
    <EventTimeline
      title="최근 계획 활동"
      headingId="recent-planning-activity-heading"
      emptyTitle="최근 계획 활동 기록이 없습니다."
      omittedCount={activity.omittedCount}
      items={activity.items.map((ev) => ({
        eventKey: ev.eventKey,
        occurredAt: ev.occurredAt,
        metaText: ev.actorLabel,
        summary: ev.summary,
        evidenceHref: ev.evidenceHref,
      }))}
    />
  );
}
