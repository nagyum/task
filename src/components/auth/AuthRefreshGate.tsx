"use client";

import { useEffect } from "react";
import { refreshAuthTokens } from "@/src/api/client";

const REFRESH_INTERVAL_MS = 3 * 60 * 1000;

export default function AuthRefreshGate() {
  useEffect(() => {
    let active = true;

    refreshAuthTokens().catch(() => {
      // ignore
    });

    const id = window.setInterval(() => {
      if (!active) return;
      refreshAuthTokens().catch(() => {
        // ignore
      });
    }, REFRESH_INTERVAL_MS);

    return () => {
      active = false;
      window.clearInterval(id);
    };
  }, []);

  return null;
}
