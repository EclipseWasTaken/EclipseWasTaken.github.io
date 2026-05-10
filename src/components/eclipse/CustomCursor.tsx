import { useEffect, useRef } from "react";

export function CustomCursor() {
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (!window.matchMedia("(hover: hover) and (pointer: fine)").matches) return;

    let cancelled = false;
    let cleanup: (() => void) | undefined;

    (async () => {
      const { gsap } = await import("gsap");
      if (cancelled) return;
      const dot = dotRef.current!;
      const ring = ringRef.current!;
      const xTo = gsap.quickTo(ring, "x", { duration: 0.5, ease: "power3" });
      const yTo = gsap.quickTo(ring, "y", { duration: 0.5, ease: "power3" });
      const dx = gsap.quickTo(dot, "x", { duration: 0.05 });
      const dy = gsap.quickTo(dot, "y", { duration: 0.05 });

      const move = (e: MouseEvent) => {
        xTo(e.clientX);
        yTo(e.clientY);
        dx(e.clientX);
        dy(e.clientY);
      };
      const over = (e: MouseEvent) => {
        const t = e.target as HTMLElement;
        if (t.closest('a, button, [data-cursor="hover"]')) {
          ring.classList.add("is-hover");
        } else {
          ring.classList.remove("is-hover");
        }
      };
      window.addEventListener("mousemove", move);
      window.addEventListener("mouseover", over);
      cleanup = () => {
        window.removeEventListener("mousemove", move);
        window.removeEventListener("mouseover", over);
      };
    })();

    return () => {
      cancelled = true;
      cleanup?.();
    };
  }, []);

  return (
    <>
      <div ref={ringRef} className="custom-cursor-ring" aria-hidden />
      <div ref={dotRef} className="custom-cursor-dot" aria-hidden />
    </>
  );
}
