import { useRef } from "react";
import { useGsap } from "@/lib/use-gsap";

const PROJECTS = [
  {
    name: "Programming Language",
    blurb:
      "Engineered a C++20 source-to-assembly compiler with a custom x86_64 code generator. Maps syntax trees directly to Linux syscalls, managing the entire lifecycle from parsing to native machine code.",
    tags: ["C++20", "x86_64", "Assembly", "Linux"],
    role: "Systems Engineer",
  },
  {
    name: "Roblox Tower Defense Game",
    blurb:
      "Architected a server-authoritative Tower Defense engine in Luau. Engineered a highly concurrent combat system, a secure probabilistic Gacha engine, and scalable data persistence for complex player states.",
    tags: ["Luau", "Roblox", "Networking", "Data"],
    role: "Lead Gameplay Engineer",
  },
  {
    name: "Game Macros",
    blurb:
      "Automated gameplay loops using Python and AutoHotkey. Features include custom configurations, precise input delays, and Discord webhook integrations.",
    tags: ["Python", "AutoHotkey", "Automation"],
    role: "Developer",
  },
  {
    name: "Ray Tracing Engine",
    blurb:
      "Real-time CPU path tracer with multithreaded optimization. Implements a custom PBR material system with dielectric refractions, multi-bounce global illumination, and a live ImGui editor.",
    tags: ["C++", "ImGui", "Vulkan", "Math"],
    role: "Graphics Programmer",
  },
  {
    name: "C++ IDE & Editor",
    blurb:
      "A fast, cross-functional text editor built with C++, ImGui, and OpenGL3. Features a tabbed interface, built-in file hierarchy explorer, and a live command-line terminal using the Win32 API.",
    tags: ["C++", "ImGui", "OpenGL3", "Win32 API"],
    role: "Software Engineer",
  },
  {
    name: "EduSeva",
    blurb:
      "A multi-modal RAG platform that synthesizes technical documents into AI podcasts, hierarchical mindmaps, and flashcards with <100ms retrieval. Built with a low-latency multi-speaker TTS pipeline and an adaptive assessment engine with resilient LLM orchestration.",
    tags: ["Python", "RAG", "LLM", "TTS"],
    role: "AI Engineer",
  },
  {
    name: "Khet Seva",
    blurb:
      "ML smart-farming platform — 95% soil health, 90% crop recs, 98% disease detection. LightGBM + EfficientNet, FastAPI + Supabase backend.",
    tags: ["FastAPI", "LightGBM", "EfficientNet", "React"],
    role: "ML & Full-Stack",
  },
  {
    name: "FPS Multiplayer",
    blurb:
      "Multiplayer FPS in Unreal + C++ with optimized networking for up to 100 concurrent players. Steam matchmaking and anti-cheat integration.",
    tags: ["Unreal", "C++", "Steam"],
    role: "Game Developer",
  },
  {
    name: "Discord Bot",
    blurb:
      "A comprehensive automation engine featuring real-time moderation, multi-source media playback (Spotify/YouTube), and programmable slash commands. Integrates persistent event logging, server analytics, and asynchronous task scheduling for robust community management.",
    tags: ["Python", "Discord.py", "Async", "Webhooks"],
    role: "Bot Developer",
  },
  {
    name: "SOP Bot And Customer Market Analysis",
    blurb:
      "Low-latency chatbot over policy handbooks plus automated Qlik dashboards via Python and SingleStore. 12-criteria, 7-segment customer categorization algorithm.",
    tags: ["Python", "SingleStore", "Qlik"],
    role: "SDE Intern",
  },
  {
    name: "Kiwi Watch",
    blurb:
      "Responsive product site for a voice-assistant smartwatch focused on health monitoring and caregiver integration.",
    tags: ["React", "Web", "QA"],
    role: "Developer",
  },
];

export function Gallery() {
  const root = useRef<HTMLElement>(null);
  const track = useRef<HTMLDivElement>(null);

  useGsap(({ gsap }) => {
    const sec = root.current;
    const tr = track.current;
    if (!sec || !tr) return;
    const ctx = gsap.context(() => {
      const dist = () => tr.scrollWidth - window.innerWidth;
      gsap.to(tr, {
        x: () => -dist(),
        ease: "none",
        scrollTrigger: {
          trigger: sec,
          start: "top top",
          end: () => `+=${dist()}`,
          scrub: 1,
          pin: true,
          anticipatePin: 1,
          invalidateOnRefresh: true,
        },
      });
    }, sec);
    return () => ctx.revert();
  }, []);

  return (
    <section
      id="gallery"
      ref={root}
      aria-label="Selected work"
      className="paper-grain relative h-screen overflow-hidden"
    >
      {/* Wire */}
      <div className="absolute left-0 right-0 top-[18%] h-px bg-foreground/30" />

      <header className="relative z-10 flex items-baseline justify-between px-8 pt-10 md:px-16">
        <h2 className="font-display text-3xl text-foreground md:text-5xl">Selected Work</h2>
        <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-muted-foreground">
          0{PROJECTS.length} Projects
        </span>
      </header>

      <div ref={track} className="relative z-10 mt-16 flex h-[60vh] items-center gap-8 pl-8 pr-[20vw] md:gap-16 md:pl-16">
        {PROJECTS.map((p, i) => (
          <article
            key={p.name}
            data-cursor="hover"
            className="relative flex h-full w-[80vw] max-w-[420px] shrink-0 flex-col justify-between bg-background p-7 sketch-border"
          >
            {/* Pin + string */}
            <div className="absolute -top-12 left-1/2 -translate-x-1/2">
              <div className="mx-auto h-12 w-px bg-foreground/40" />
              <div className="mx-auto -mt-1 h-3 w-3 rounded-full bg-foreground" />
            </div>

            <div>
              <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-muted-foreground">
                0{i + 1} · {p.role}
              </span>
              <h3 className="mt-3 font-display text-3xl leading-tight text-foreground">
                {p.name}
              </h3>
              <p className="mt-4 text-sm leading-relaxed text-muted-foreground">{p.blurb}</p>
            </div>
            <div className="mt-6 flex flex-wrap gap-2">
              {p.tags.map((t) => (
                <span
                  key={t}
                  className="rounded-full border border-pencil px-3 py-1 font-mono text-[10px] uppercase tracking-wider text-foreground"
                >
                  {t}
                </span>
              ))}
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
