"use client";
import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { playTransitionSound } from "./sounds";

/**
 * Hook for animated page transitions with sound.
 *
 * Usage:
 *   const { navigate, exitClass } = usePageTransition();
 *   <div className={`page-transition ${exitClass}`}>...</div>
 *   <button onClick={() => navigate("/next")}>Go</button>
 */
export function usePageTransition(exitType: "page" | "egg" = "page") {
  const router = useRouter();
  const [exitClass, setExitClass] = useState("");

  const navigate = useCallback(
    (path: string) => {
      playTransitionSound();
      setExitClass(exitType === "egg" ? "egg-exit" : "page-exit");
      const delay = exitType === "egg" ? 500 : 300;
      setTimeout(() => router.push(path), delay);
    },
    [router, exitType]
  );

  return { navigate, exitClass };
}
