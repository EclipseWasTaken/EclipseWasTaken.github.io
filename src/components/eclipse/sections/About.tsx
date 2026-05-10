import { useRef } from "react";
import { useGsap } from "@/lib/use-gsap";
import { motion } from "framer-motion";

const SKILL_GROUPS: { title: string; items: string[] }[] = [
  {
    title: "Languages",
    items: ["C++", "C", "Python", "Java", "JavaScript", "Objective-C", "HTML5", "CSS3"],
  },
  {
    title: "ML & Data",
    items: [
      "PyTorch",
      "TensorFlow",
      "Keras",
      "Scikit-learn",
      "NumPy",
      "Pandas",
      "Matplotlib",
      "Machine Learning",
    ],
  },
  {
    title: "Game & Graphics",
    items: ["Unreal Engine", "Unity", "Godot", "OpenGL", "Arduino"],
  },
  {
    title: "Backend & Data",
    items: ["FastAPI", "Flask", "MySQL", "MongoDB", "Supabase"],
  },
  {
    title: "Tooling & Deploy",
    items: ["Git", "CMake", "Tampermonkey", "Vercel", "Render", "Netlify", "Qlik"],
  },
];

export function About() {
  const root = useRef<HTMLElement>(null);

  useGsap(({ gsap }) => {
    const el = root.current;
    if (!el) return;
    const ctx = gsap.context(() => {
      gsap.from(".about-line", {
        opacity: 0,
        y: 30,
        stagger: 0.1,
        scrollTrigger: { trigger: el, start: "top 70%" },
      });
      gsap.from(".skill-chip", {
        opacity: 0,
        y: 16,
        stagger: { each: 0.02, from: "start" },
        duration: 0.5,
        ease: "power2.out",
        scrollTrigger: { trigger: el, start: "top 60%" },
      });
    }, el);
    return () => ctx.revert();
  }, []);

  return (
    <section
      id="about"
      ref={root}
      aria-label="About"
      className="paper-grain relative overflow-hidden px-6 py-32"
    >
      <div className="relative z-10 mx-auto max-w-3xl text-center">
        <span className="about-line font-mono text-[10px] uppercase tracking-[0.4em] text-muted-foreground">
          About
        </span>
        <h2 className="about-line mt-6 font-display text-4xl leading-tight text-foreground md:text-6xl">
          “Low-level systems, high-level intelligence — built end to end.”
        </h2>
        <p className="about-line mt-8 text-base leading-relaxed text-muted-foreground md:text-lg">
          Hi I'm Eclipse and I'm a ML and C++ developer working across{" "}
          <span className="text-foreground">fullstack ML platforms</span>,{" "}
          <span className="text-foreground">scalable game engines</span>, and{" "}
          <span className="text-foreground">AI-driven platforms</span>. Comfortable jumping from
          bare-metal C++ code and real-time path tracers to complex Machine Learning Algorithms,
          with a soft spot for shipping software that feels fast and snappy.
        </p>
      </div>

      <div className="mx-auto mt-32 grid max-w-7xl gap-10 px-4 md:grid-cols-2 lg:grid-cols-3">
        {SKILL_GROUPS.map((group, i) => (
          <motion.div
            key={group.title}
            whileHover={{ y: -5 }}
            className="about-line group relative flex flex-col overflow-hidden bg-background p-8 sketch-border md:p-10"
          >
            {/* Technical Background Elements */}
            <div className="absolute inset-0 pointer-events-none opacity-[0.03]" 
                 style={{ backgroundImage: 'radial-gradient(circle, currentColor 1px, transparent 1px)', backgroundSize: '24px 24px' }} />
            <div className="absolute right-6 top-6 font-mono text-[8px] tracking-widest text-muted-foreground opacity-40">
              STACK_0{i + 1} // {group.title.toUpperCase()}
            </div>
            
            {/* Corner Crosshairs */}
            <div className="absolute left-0 top-0 h-4 w-4 border-l border-t border-pencil opacity-20" />
            <div className="absolute right-0 top-0 h-4 w-4 border-r border-t border-pencil opacity-20" />
            <div className="absolute bottom-0 left-0 h-4 w-4 border-b border-l border-pencil opacity-20" />
            <div className="absolute bottom-0 right-0 h-4 w-4 border-b border-r border-pencil opacity-20" />

            <div className="relative z-10 flex flex-1 flex-col">
              {/* Content */}
              <div className="flex-1">
                <h3 className="font-display text-4xl text-foreground transition-colors group-hover:text-foreground/80">
                  {group.title}
                </h3>
                <div className="mt-8 grid grid-cols-1 gap-y-3 sm:grid-cols-2 sm:gap-x-4">
                  {group.items.map((item) => (
                    <div
                      key={item}
                      className="skill-chip group/item relative flex items-center pl-4 transition-colors"
                    >
                      <span className="absolute left-0 h-px w-2 bg-pencil group-hover/item:w-3 group-hover/item:bg-foreground transition-all" />
                      <span className="font-mono text-[13px] text-muted-foreground group-hover/item:text-foreground">
                        {item}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Bottom ID */}
              <div className="mt-12 flex items-center gap-3 border-t border-pencil pt-6 opacity-30">
                <div className="h-1 w-1 rounded-full bg-foreground" />
                <span className="font-mono text-[8px] uppercase tracking-widest">
                  System Profile // Integrated_{group.title.split(" ")[0]}
                </span>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
