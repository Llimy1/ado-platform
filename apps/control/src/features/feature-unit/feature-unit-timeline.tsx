import { EventTimeline } from "@/components/EventTimeline";
import { LIFECYCLE_STATE_LABEL } from "@/lib/format";
import type { FeatureUnitDetailResponse } from "@/lib/contracts/feature-unit";

const KIND_LABEL: Record<string, string> = {
  state_transition: "상태 전이",
  verification: "검증",
  review: "리뷰",
  decision: "결정",
  pull_request: "Pull Request",
  incident: "사고",
};

/** P-04.5: native ordered list of immutable state/evidence events, not an editable workflow diagram. */
export function FeatureUnitTimeline({ timeline }: { timeline: FeatureUnitDetailResponse["timeline"] }) {
  return (
    <EventTimeline
      title="이력"
      headingId="feature-unit-timeline-heading"
      emptyTitle="이력이 없습니다."
      omittedCount={timeline.omittedCount}
      items={timeline.items.map((ev) => ({
        eventKey: ev.eventKey,
        occurredAt: ev.occurredAt,
        metaText: `${ev.actorLabel} · ${KIND_LABEL[ev.kind] ?? ev.kind}`,
        summary:
          ev.fromState && ev.toState
            ? `${LIFECYCLE_STATE_LABEL[ev.fromState] ?? ev.fromState} → ${LIFECYCLE_STATE_LABEL[ev.toState] ?? ev.toState}: ${ev.summary}`
            : ev.summary,
        evidenceHref: ev.evidenceHref,
      }))}
    />
  );
}
