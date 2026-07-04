import type { SVGProps } from "react";

type IconProps = SVGProps<SVGSVGElement>;

function base(children: React.ReactNode, props: IconProps) {
  return (
    <svg
      viewBox="0 0 20 20"
      width="16"
      height="16"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
      {...props}
    >
      {children}
    </svg>
  );
}

export function IconCheckCircle(props: IconProps) {
  return base(
    <>
      <circle cx="10" cy="10" r="7.5" />
      <path d="M6.8 10.2l2 2 4.4-4.6" />
    </>,
    props,
  );
}

export function IconAlertTriangle(props: IconProps) {
  return base(
    <>
      <path d="M10 3.2l7.5 13.1H2.5L10 3.2z" />
      <path d="M10 8.2v3.2" />
      <circle cx="10" cy="14" r="0.6" fill="currentColor" stroke="none" />
    </>,
    props,
  );
}

export function IconBan(props: IconProps) {
  return base(
    <>
      <circle cx="10" cy="10" r="7.5" />
      <path d="M5 5l10 10" />
    </>,
    props,
  );
}

export function IconSiren(props: IconProps) {
  return base(
    <>
      <path d="M4 12a6 6 0 0 1 12 0v3H4v-3z" />
      <path d="M10 2v2" />
      <path d="M3 15h14" />
    </>,
    props,
  );
}

export function IconArchive(props: IconProps) {
  return base(
    <>
      <rect x="2.5" y="4" width="15" height="3.2" rx="0.6" />
      <path d="M3.5 7.2v8.3a1 1 0 0 0 1 1h11a1 1 0 0 0 1-1V7.2" />
      <path d="M8 10.5h4" />
    </>,
    props,
  );
}

export function IconChevronRight(props: IconProps) {
  return base(<path d="M7.5 4.5l6 5.5-6 5.5" />, props);
}

export function IconCopy(props: IconProps) {
  return base(
    <>
      <rect x="7" y="7" width="9.5" height="9.5" rx="1.2" />
      <path d="M13.5 7V4.7a1 1 0 0 0-1-1H4.2a1 1 0 0 0-1 1v8.3a1 1 0 0 0 1 1H7" />
    </>,
    props,
  );
}

export function IconMenu(props: IconProps) {
  return base(
    <>
      <path d="M3 6h14" />
      <path d="M3 10h14" />
      <path d="M3 14h14" />
    </>,
    props,
  );
}

export function IconClose(props: IconProps) {
  return base(
    <>
      <path d="M5 5l10 10" />
      <path d="M15 5L5 15" />
    </>,
    props,
  );
}

export function IconRefresh(props: IconProps) {
  return base(
    <>
      <path d="M16 10a6 6 0 1 1-2-4.5" />
      <path d="M16 3.5V7h-3.5" />
    </>,
    props,
  );
}

export function IconClock(props: IconProps) {
  return base(
    <>
      <circle cx="10" cy="10" r="7.5" />
      <path d="M10 5.8V10l3 1.8" />
    </>,
    props,
  );
}

export function IconWifiOff(props: IconProps) {
  return base(
    <>
      <path d="M3 3l14 14" />
      <path d="M6.2 9.2a8 8 0 0 1 3.3-1.9" />
      <path d="M12.2 8a8 8 0 0 1 1.6 1.2" />
      <path d="M8.6 12.6a3.6 3.6 0 0 1 2.8 0" />
      <circle cx="10" cy="16" r="0.7" fill="currentColor" stroke="none" />
    </>,
    props,
  );
}

export function IconLink(props: IconProps) {
  return base(
    <>
      <path d="M8.5 11.5l3-3" />
      <path d="M7 13l-1.6 1.6a2.6 2.6 0 0 1-3.7-3.7L3.3 9.3" />
      <path d="M13 7l1.6-1.6a2.6 2.6 0 0 1 3.7 3.7L16.7 10.7" />
    </>,
    props,
  );
}

export function IconOpen(props: IconProps) {
  return base(
    <>
      <path d="M8.3 4.5H4.6a1 1 0 0 0-1 1v10a1 1 0 0 0 1 1h10a1 1 0 0 0 1-1v-3.7" />
      <path d="M11.5 3.5H16v4.5" />
      <path d="M16 3.5l-7 7" />
    </>,
    props,
  );
}

export function IconChevronUp(props: IconProps) {
  return base(<path d="M4.5 12.5l5.5-6 5.5 6" />, props);
}

export function IconChevronDown(props: IconProps) {
  return base(<path d="M4.5 7.5l5.5 6 5.5-6" />, props);
}

/** Neutral affordance shown on a sortable-but-inactive column header. */
export function IconChevronsUpDown(props: IconProps) {
  return base(
    <>
      <path d="M5.5 8.3L10 4l4.5 4.3" />
      <path d="M5.5 11.7L10 16l4.5-4.3" />
    </>,
    props,
  );
}

export function IconFolder(props: IconProps) {
  return base(
    <path d="M3 6.2a1 1 0 0 1 1-1h3.6l1.4 1.6H16a1 1 0 0 1 1 1v7a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V6.2z" />,
    props,
  );
}

export function IconInbox(props: IconProps) {
  return base(
    <>
      <path d="M3 11.5l2.2-6.3a1 1 0 0 1 .94-.7h7.72a1 1 0 0 1 .94.7l2.2 6.3" />
      <path d="M3 11.5v3.3a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1v-3.3h-4.2l-1 1.8h-3.6l-1-1.8H3z" />
    </>,
    props,
  );
}
