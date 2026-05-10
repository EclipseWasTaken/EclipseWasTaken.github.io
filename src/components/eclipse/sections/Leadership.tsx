import { useRef } from "react";
import { useGsap } from "@/lib/use-gsap";

const ROLES = [
  {
    when: "Jul 2024 – Jun 2025",
    org: "GeeksForGeeks",
    role: "Game Dev Team Lead",
    points: [
      "Introduced the Game Development domain; deployed 2 projects.",
      "Hosted an escape-room event with 150+ participants.",
      "Led an FPS project, a detective story game and Raylib experiments.",
    ],
  },
  {
    when: "Mar 2024 – Jun 2025",
    org: "Google Developer Group",
    role: "Systems Developer",
    points: ["Part of the systems team. Contributed to compiler tooling, Building Text Editors."],
  },
  {
    when: "Jun 2022 – Apr 2024",
    org: "GeeksForGeeks",
    role: "Core Developer",
    points: [
      "Java, C++, C, Python.",
      "Built a scraping tool for hackathons and upcoming internships.",
    ],
  },
];

export function Leadership() {
  const root = useRef<HTMLElement>(null);

  useGsap(({ gsap }) => {
    const el = root.current;
    if (!el) return;
    const ctx = gsap.context(() => {
      gsap.from(".lead-card", {
        opacity: 0,
        y: 40,
        duration: 0.8,
        ease: "power3.out",
        stagger: 0.12,
        scrollTrigger: { trigger: el, start: "top 75%" },
      });
    }, el);
    return () => ctx.revert();
  }, []);

  return (
    <section
      id="leadership"
      ref={root}
      aria-label="Activities and leadership"
      className="paper-grain relative px-6 py-32"
    >
      <header className="mx-auto mb-16 max-w-3xl text-center">
        <span className="font-mono text-[10px] uppercase tracking-[0.4em] text-muted-foreground">
          Off-Hours
        </span>
        <h2 className="mt-4 font-display text-4xl text-foreground md:text-6xl">
          Activities &amp; Leadership
        </h2>
      </header>

      <ul className="mx-auto grid max-w-6xl gap-6 md:grid-cols-3">
        {ROLES.map((r) => (
          <li key={r.org + r.when} className="lead-card bg-background p-6 sketch-border">
            <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-muted-foreground">
              {r.when}
            </span>
            <h3 className="mt-2 font-display text-2xl text-foreground">{r.org}</h3>
            <p className="mt-1 text-sm text-muted-foreground">{r.role}</p>
            <ul className="mt-4 space-y-2 text-sm text-foreground/80">
              {r.points.map((p) => (
                <li key={p} className="flex gap-2">
                  <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-primary" />
                  <span>{p}</span>
                </li>
              ))}
            </ul>
          </li>
        ))}
      </ul>
    </section>
  );
}
