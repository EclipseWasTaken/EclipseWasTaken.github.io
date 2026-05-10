import { useRef } from "react";
import { useGsap } from "@/lib/use-gsap";

export function Hero() {
  const root = useRef<HTMLElement>(null);

  useGsap(({ gsap, ScrollTrigger }) => {
    const el = root.current;
    if (!el) return;
    const ctx = gsap.context(() => {
      gsap.to(".hero-name", {
        scale: 1.08,
        opacity: 0,
        y: -40,
        scrollTrigger: { trigger: el, start: "top top", end: "bottom top", scrub: 1 },
      });
      gsap.to(".hero-sketch-t", {
        y: -120, opacity: 0,
        scrollTrigger: { trigger: el, start: "top top", end: "bottom top", scrub: 1 },
      });
      gsap.from(".hero-name span", {
        y: 80, opacity: 0, stagger: 0.06, duration: 1.1, ease: "power3.out", delay: 0.2,
      });
      gsap.from(".hero-tag", { opacity: 0, y: 20, duration: 0.8, delay: 1.2 });
    }, el);
    return () => {
      ctx.revert();
      ScrollTrigger.getAll().forEach((t) => t.vars.trigger === el && t.kill());
    };
  }, []);

  const name = "ECLIPSE";

  return (
    <section
      id="hero"
      ref={root}
      aria-label="Introduction"
      className="paper-grain relative flex min-h-screen items-center justify-center overflow-hidden px-6"
      style={{ perspective: "1200px" }}
    >
      {/* Floating sketches */}
      <svg className="hero-sketch-t float-fast absolute right-[18%] bottom-[22%] h-16 w-24 text-pencil opacity-60" viewBox="0 0 96 64" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path d="M24 16 8 32l16 16M72 16l16 16-16 16M40 50l16-36" />
      </svg>

      <div className="relative flex flex-col items-center text-center">
        <span className="hero-tag mb-6 font-mono text-xs uppercase tracking-[0.4em] text-muted-foreground">
          Portfolio
        </span>
        <h1 className="hero-name font-display text-[clamp(3.5rem,14vw,12rem)] font-bold leading-none tracking-tight text-foreground">
          {name.split("").map((c, i) => (
            <span key={i} className="inline-block">{c}</span>
          ))}
        </h1>
        <p className="hero-tag mt-8 font-mono text-sm text-muted-foreground md:text-base">
          {"<"} ML &amp; systems developer {"/>"}
        </p>
        <div className="hero-tag mt-16 flex flex-col items-center gap-2 text-muted-foreground">
          <span className="font-mono text-[10px] uppercase tracking-[0.3em]">scroll to explore</span>
          <span className="block h-10 w-px bg-foreground/40 animate-pulse" />
        </div>
      </div>
    </section>
  );
}
