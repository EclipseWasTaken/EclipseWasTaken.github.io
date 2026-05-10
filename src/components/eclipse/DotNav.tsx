import { useEffect, useState } from "react";

const SECTIONS = [
  { id: "hero", label: "Intro" },
  { id: "gallery", label: "Work" },
  { id: "about", label: "About" },
  { id: "experience", label: "Experience" },
  { id: "leadership", label: "Leadership" },
];

export function DotNav() {
  const [active, setActive] = useState("hero");

  useEffect(() => {
    if (typeof window === "undefined") return;
    const obs = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (visible) setActive(visible.target.id);
      },
      { threshold: [0.3, 0.6] },
    );
    SECTIONS.forEach((s) => {
      const el = document.getElementById(s.id);
      if (el) obs.observe(el);
    });
    return () => obs.disconnect();
  }, []);

  return (
    <nav
      aria-label="Section navigation"
      className="fixed right-6 top-1/2 z-50 hidden -translate-y-1/2 flex-col gap-4 md:flex"
    >
      {SECTIONS.map((s) => (
        <a
          key={s.id}
          href={`#${s.id}`}
          data-cursor="hover"
          className="group relative flex items-center justify-end"
          aria-label={s.label}
        >
          <span className="pointer-events-none absolute right-6 whitespace-nowrap font-mono text-[10px] uppercase tracking-[0.25em] text-foreground opacity-0 transition-opacity group-hover:opacity-100">
            {s.label}
          </span>
          <span
            className={`block h-2 w-2 rounded-full border border-foreground transition-all ${
              active === s.id ? "w-6 bg-foreground" : "bg-transparent"
            }`}
          />
        </a>
      ))}
    </nav>
  );
}
