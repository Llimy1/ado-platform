"use client";

import { useEffect } from "react";

let lockCount = 0;
let previousOverflow = "";

/**
 * Locks background page scroll while a modal (Dialog, MobileDrawer) is
 * open. Native <dialog> with showModal() does not reliably block scroll on
 * the underlying document across engines/input methods (verified: the page
 * behind the drawer visibly scrolled while it was open), so this uses the
 * standard body-overflow-hidden technique instead. Reference-counted so two
 * modals opening in immediate succession don't unlock each other early.
 */
export function useBodyScrollLock(active: boolean) {
  useEffect(() => {
    if (!active) return;

    if (lockCount === 0) {
      previousOverflow = document.body.style.overflow;
      document.body.style.overflow = "hidden";
    }
    lockCount += 1;

    return () => {
      lockCount -= 1;
      if (lockCount === 0) {
        document.body.style.overflow = previousOverflow;
      }
    };
  }, [active]);
}
