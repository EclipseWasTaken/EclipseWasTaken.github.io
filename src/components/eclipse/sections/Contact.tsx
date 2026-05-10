import { useRef } from "react";
import { useGsap } from "@/lib/use-gsap";
import { toast } from "sonner";

const LINKS = [
  { label: "GitHub", href: "https://github.com/EclipseWasTaken?" },
  { label: "Discord", href: "#", alias: "eclipse0106" },
];

export function Contact() {
  const root = useRef<HTMLElement>(null);

  useGsap(({ gsap }) => {
    const el = root.current;
    if (!el) return;
    const ctx = gsap.context(() => {
      gsap.from(".contact-heading", {
        opacity: 0,
        y: 40,
        duration: 1,
        ease: "power3.out",
        scrollTrigger: { trigger: el, start: "top 80%" },
      });
      gsap.from(".contact-link", {
        opacity: 0,
        y: 20,
        stagger: 0.08,
        duration: 0.6,
        ease: "power3.out",
        scrollTrigger: { trigger: el, start: "top 70%" },
      });
      gsap.from(".contact-alias", {
        opacity: 0,
        scale: 0.95,
        duration: 0.8,
        ease: "power3.out",
        scrollTrigger: { trigger: el, start: "top 75%" },
      });
    }, el);
    return () => ctx.revert();
  }, []);

  const copyDiscord = () => {
    navigator.clipboard.writeText("eclipse0106");
    toast.success("Discord username copied to clipboard!");
  };


  return (
    <section
      id="contact"
      ref={root}
      aria-label="Contact"
      className="paper-grain relative overflow-hidden px-6 pb-20 pt-32"
    >
      {/* Dot grid pattern */}
      <div className="absolute inset-0 pointer-events-none opacity-[0.03]" 
           style={{ backgroundImage: 'radial-gradient(circle, currentColor 1px, transparent 1px)', backgroundSize: '24px 24px' }} />


      <div className="mx-auto max-w-3xl text-center">
        <span className="contact-heading font-mono text-sm uppercase tracking-[0.4em] text-muted-foreground">
          Connect
        </span>


        <h2 className="contact-heading mt-4 font-display text-5xl leading-tight text-foreground md:text-7xl">
          Let's build something.
        </h2>
        <p className="contact-heading mt-6 text-base text-muted-foreground md:text-lg">
          Open to opportunities — reach out and let's talk.
        </p>


        {/* eclipse alias — prominent center piece */}
        <div className="contact-alias mt-16 flex flex-col items-center gap-2">
          <span className="font-mono text-[10px] uppercase tracking-[0.4em] text-muted-foreground">
            find me as
          </span>
          <span className="font-display text-3xl tracking-wide text-foreground md:text-5xl">
            eclipse
          </span>
          <span className="mt-2 font-mono text-lg text-muted-foreground">
            eclipse0106
          </span>

        </div>

        {/* Minimal inline links */}
        <nav className="mt-12 flex items-center justify-center gap-8">
          {LINKS.map((l) => (
            <button
              key={l.label}
              onClick={l.label === "Discord" ? copyDiscord : undefined}
              className="contact-link group font-mono text-xs uppercase tracking-[0.2em] text-muted-foreground transition-colors hover:text-foreground"
            >
              {l.label === "GitHub" ? (
                <a
                  href={l.href}
                  data-cursor="hover"
                  target="_blank"
                  rel="noreferrer noopener"
                >
                  {l.label}
                </a>
              ) : (
                <span data-cursor="hover">{l.label}</span>
              )}
              <span className="block h-px w-0 bg-foreground transition-all duration-300 group-hover:w-full" />
            </button>
          ))}
        </nav>
      </div>
    </section>
  );
}

