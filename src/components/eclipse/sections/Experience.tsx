import { useRef } from "react";
import { useGsap } from "@/lib/use-gsap";

const TIMELINE = [
  {
    when: "May – Jul 2025",
    org: "Indian Oil Corporation",
    role: "SDE Intern · Mumbai, India",
    points: [
      "Shipped a low-latency chatbot over company SOPs, documents and policy handbooks.",
      "Automated Qlik dashboards via Python + SingleStore for real-time reporting.",
      "Designed a 12-criteria, 7-segment customer categorization algorithm.",
    ],
  },
  {
    when: "Apr 2025",
    org: "Kiwi Voice Assistant, Inc",
    role: "Developer · Lexington, MA",
    points: [
      "Designed & built a responsive product site for Kiwi Watch.",
      "Led testing, bug fixes and deployment, meeting accessibility standards.",
    ],
  },
];

export function Experience() {
  const root = useRef<HTMLElement>(null);

  useGsap(({ gsap }) => {
    const el = root.current;
    if (!el) return;
    const ctx = gsap.context(() => {
      gsap.utils.toArray<HTMLElement>(".tl-card").forEach((card) => {
        gsap.from(card, {
          opacity: 0,
          rotateY: -60,
          y: 60,
          duration: 0.9,
          ease: "power3.out",
          scrollTrigger: { trigger: card, start: "top 85%" },
        });
      });
      gsap.from(".tl-stem", {
        scaleY: 0,
        transformOrigin: "top",
        ease: "none",
        scrollTrigger: {
          trigger: el,
          start: "top 60%",
          end: "bottom 80%",
          scrub: 1,
        },
      });
    }, el);
    return () => ctx.revert();
  }, []);

  return (
    <section
      id="experience"
      ref={root}
      aria-label="Experience timeline"
      className="paper-grain relative px-6 py-32"
      style={{ perspective: "1200px" }}
    >
      <header className="mx-auto mb-20 max-w-3xl text-center">
        <span className="font-mono text-[10px] uppercase tracking-[0.4em] text-muted-foreground">
          The Path
        </span>
        <h2 className="mt-4 font-display text-4xl text-foreground md:text-6xl">Experience</h2>
      </header>

      <div className="relative mx-auto max-w-5xl">
        <span className="tl-stem absolute left-4 top-0 bottom-0 w-px bg-foreground md:left-1/2" />

        <ul className="space-y-16">
          {TIMELINE.map((t, i) => {
            const right = i % 2 === 1;
            return (
              <li key={t.org + t.when} className="relative md:grid md:grid-cols-2 md:gap-16">
                <span className="absolute left-4 top-3 h-3 w-3 -translate-x-1/2 rounded-full border-2 border-foreground bg-background md:left-1/2" />
                {right && <div className="hidden md:block" />}
                <article
                  className={`tl-card ml-12 bg-background p-6 sketch-border md:ml-0 ${
                    right ? "md:ml-8" : "md:mr-8 md:text-right"
                  }`}
                >
                  <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-muted-foreground">
                    {t.when}
                  </span>
                  <h3 className="mt-2 font-display text-2xl text-foreground">{t.org}</h3>
                  <p className="mt-1 text-sm text-muted-foreground">{t.role}</p>
                  <ul className={`mt-4 space-y-2 text-sm text-foreground/80 ${right ? "" : "md:[&>li]:flex-row-reverse"}`}>
                    {t.points.map((p) => (
                      <li key={p} className="flex gap-2">
                        <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-primary" />
                        <span>{p}</span>
                      </li>
                    ))}
                  </ul>
                </article>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
