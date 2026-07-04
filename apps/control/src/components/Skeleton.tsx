import styles from "./Skeleton.module.css";

interface SkeletonProps {
  width?: string;
  height?: string;
  className?: string;
}

/** Static skeleton fill; never announced as live content. */
export function Skeleton({ width = "100%", height = "16px", className }: SkeletonProps) {
  return (
    <span
      className={[styles.skeleton, className].filter(Boolean).join(" ")}
      style={{ display: "block", width, height }}
      aria-hidden="true"
    />
  );
}
