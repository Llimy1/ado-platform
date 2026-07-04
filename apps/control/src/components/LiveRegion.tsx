"use client";

/**
 * One visually hidden role="status" node per page for noncritical update
 * announcements, per P-01.4 / P-02.6.
 */
export function LiveRegion({ message }: { message: string }) {
  return (
    <div role="status" aria-live="polite" aria-atomic="true" className="ado-visually-hidden">
      {message}
    </div>
  );
}
