import { useEffect } from "react";

/**
 * Client-only effect that loads gsap + ScrollTrigger and runs the callback.
 * Returns a cleanup that kills triggers created within.
 */
export function useGsap(
  callback: (ctx: {
    gsap: typeof import("gsap").gsap;
    ScrollTrigger: typeof import("gsap/ScrollTrigger").ScrollTrigger;
  }) => void | (() => void),
  deps: ReadonlyArray<unknown> = [],
) {
  useEffect(() => {
    if (typeof window === "undefined") return;
    let cleanup: void | (() => void);
    let mounted = true;

    (async () => {
      const { gsap } = await import("gsap");
      const { ScrollTrigger } = await import("gsap/ScrollTrigger");
      gsap.registerPlugin(ScrollTrigger);
      if (!mounted) return;
      cleanup = callback({ gsap, ScrollTrigger });
      ScrollTrigger.refresh();
    })();

    return () => {
      mounted = false;
      if (typeof cleanup === "function") cleanup();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);
}
