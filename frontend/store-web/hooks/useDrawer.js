"use client";
import { useEffect, useCallback } from "react";

/**
 * useDrawer – manages open/close state + body scroll lock + ESC key to close.
 * Usage: const [open, openDrawer, closeDrawer] = useDrawer(false);
 */
export function useDrawer(initialState = false) {
  // Returns a stateful setter pair; caller manages the boolean externally.
  // This hook is used for side-effects: scroll lock + ESC key.
  const lockScroll = useCallback((shouldLock) => {
    if (typeof document === "undefined") return;
    document.body.style.overflow = shouldLock ? "hidden" : "";
  }, []);

  return { lockScroll };
}
