import { jsx, jsxs, Fragment } from "react/jsx-runtime";
import { useState, useRef, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { toast } from "sonner";
function buildWavePath(fillY, t, speed, amp, freq, phase, width, height) {
  const segments = 24;
  const segW = width / segments;
  let d = `M -10,${height + 10} L -10,${fillY}`;
  for (let i = 0; i <= segments; i++) {
    const x = i * segW;
    const y = fillY + Math.sin(i * freq + phase + t * speed) * amp + Math.sin(i * freq * 1.7 + phase * 1.3 + t * speed * 0.7) * (amp * 0.4);
    if (i === 0) {
      d += ` L ${x},${y}`;
    } else {
      const px = (i - 1) * segW;
      const py = fillY + Math.sin((i - 1) * freq + phase + t * speed) * amp + Math.sin((i - 1) * freq * 1.7 + phase * 1.3 + t * speed * 0.7) * (amp * 0.4);
      d += ` C ${px + segW * 0.4},${py} ${x - segW * 0.4},${y} ${x},${y}`;
    }
  }
  d += ` L ${width + 10},${height + 10} Z`;
  return d;
}
function easeInOutQuart(t) {
  return t < 0.5 ? 8 * t * t * t * t : 1 - Math.pow(-2 * t + 2, 4) / 2;
}
const W = 1200;
const H = 400;
function Loader() {
  const [progress, setProgress] = useState(0);
  const [wave1d, setWave1d] = useState("");
  const [wave2d, setWave2d] = useState("");
  const [done, setDone] = useState(false);
  const tRef = useRef(0);
  const startRef = useRef(null);
  const rafRef = useRef(null);
  const duration = 4800;
  useEffect(() => {
    function loop(ts) {
      if (startRef.current === null) startRef.current = ts;
      const elapsed = Math.max(0, ts - startRef.current);
      const raw = Math.min(elapsed / duration, 1);
      const eased = easeInOutQuart(raw);
      setProgress(eased);
      tRef.current += 0.01;
      const t = tRef.current;
      const fillY = H - eased * H;
      const amp = 16 + (1 - eased) * 8;
      setWave1d(buildWavePath(fillY, t, 1, amp, 0.9, 0, W, H));
      setWave2d(buildWavePath(fillY + 5, t, 0.7, amp * 0.8, 1.1, 2.1, W, H));
      if (raw < 1) {
        rafRef.current = requestAnimationFrame(loop);
      } else {
        setTimeout(() => setDone(true), 600);
      }
    }
    rafRef.current = requestAnimationFrame(loop);
    return () => {
      if (rafRef.current !== null) cancelAnimationFrame(rafRef.current);
    };
  }, []);
  const pct = Math.round(progress * 100);
  return /* @__PURE__ */ jsx(AnimatePresence, { children: !done && /* @__PURE__ */ jsxs(
    motion.div,
    {
      className: "fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-background",
      initial: { y: 0 },
      exit: {
        y: "-100%",
        transition: { duration: 0.9, ease: [0.76, 0, 0.24, 1] }
      },
      children: [
        /* @__PURE__ */ jsx("div", { className: "relative flex items-center justify-center w-full", children: /* @__PURE__ */ jsxs(
          "svg",
          {
            width: "100%",
            height: H,
            viewBox: `0 0 ${W} ${H}`,
            "aria-hidden": "true",
            className: "overflow-visible",
            children: [
              /* @__PURE__ */ jsx("defs", { children: /* @__PURE__ */ jsx("clipPath", { id: "loader-text-clip", children: /* @__PURE__ */ jsx(
                "text",
                {
                  x: "50%",
                  y: "50%",
                  dominantBaseline: "middle",
                  textAnchor: "middle",
                  className: "font-display font-bold text-[clamp(3.5rem,14vw,12rem)] tracking-tight",
                  children: "ECLIPSE"
                }
              ) }) }),
              /* @__PURE__ */ jsx(
                "text",
                {
                  x: "50%",
                  y: "50%",
                  dominantBaseline: "middle",
                  textAnchor: "middle",
                  fill: "none",
                  stroke: "currentColor",
                  strokeWidth: "1",
                  className: "font-display font-bold text-[clamp(3.5rem,14vw,12rem)] tracking-tight text-foreground/10",
                  children: "ECLIPSE"
                }
              ),
              /* @__PURE__ */ jsxs("g", { clipPath: "url(#loader-text-clip)", children: [
                /* @__PURE__ */ jsx("path", { d: wave2d, className: "fill-foreground/40" }),
                /* @__PURE__ */ jsx("path", { d: wave1d, className: "fill-foreground" })
              ] })
            ]
          }
        ) }),
        /* @__PURE__ */ jsxs("div", { className: "absolute bottom-10 left-10 flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground", children: [
          /* @__PURE__ */ jsx("span", { children: "loading" }),
          /* @__PURE__ */ jsxs("span", { className: "w-[4ch] tabular-nums text-foreground", children: [
            pct.toString().padStart(3, "0"),
            "%"
          ] })
        ] }),
        /* @__PURE__ */ jsx("div", { className: "absolute bottom-0 left-0 h-[1.5px] bg-foreground transition-[width] duration-75", style: { width: `${pct}%` } })
      ]
    }
  ) });
}
function CustomCursor() {
  const dotRef = useRef(null);
  const ringRef = useRef(null);
  useEffect(() => {
    if (typeof window === "undefined") return;
    if (!window.matchMedia("(hover: hover) and (pointer: fine)").matches) return;
    let cancelled = false;
    let cleanup;
    (async () => {
      const { gsap } = await import("gsap");
      if (cancelled) return;
      const dot = dotRef.current;
      const ring = ringRef.current;
      const xTo = gsap.quickTo(ring, "x", { duration: 0.5, ease: "power3" });
      const yTo = gsap.quickTo(ring, "y", { duration: 0.5, ease: "power3" });
      const dx = gsap.quickTo(dot, "x", { duration: 0.05 });
      const dy = gsap.quickTo(dot, "y", { duration: 0.05 });
      const move = (e) => {
        xTo(e.clientX);
        yTo(e.clientY);
        dx(e.clientX);
        dy(e.clientY);
      };
      const over = (e) => {
        const t = e.target;
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
  return /* @__PURE__ */ jsxs(Fragment, { children: [
    /* @__PURE__ */ jsx("div", { ref: ringRef, className: "custom-cursor-ring", "aria-hidden": true }),
    /* @__PURE__ */ jsx("div", { ref: dotRef, className: "custom-cursor-dot", "aria-hidden": true })
  ] });
}
function SmoothScroll() {
  return null;
}
const SECTIONS = [
  { id: "hero", label: "Intro" },
  { id: "gallery", label: "Work" },
  { id: "about", label: "About" },
  { id: "experience", label: "Experience" },
  { id: "leadership", label: "Leadership" }
];
function DotNav() {
  const [active, setActive] = useState("hero");
  useEffect(() => {
    if (typeof window === "undefined") return;
    const obs = new IntersectionObserver(
      (entries) => {
        const visible = entries.filter((e) => e.isIntersecting).sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (visible) setActive(visible.target.id);
      },
      { threshold: [0.3, 0.6] }
    );
    SECTIONS.forEach((s) => {
      const el = document.getElementById(s.id);
      if (el) obs.observe(el);
    });
    return () => obs.disconnect();
  }, []);
  return /* @__PURE__ */ jsx(
    "nav",
    {
      "aria-label": "Section navigation",
      className: "fixed right-6 top-1/2 z-50 hidden -translate-y-1/2 flex-col gap-4 md:flex",
      children: SECTIONS.map((s) => /* @__PURE__ */ jsxs(
        "a",
        {
          href: `#${s.id}`,
          "data-cursor": "hover",
          className: "group relative flex items-center justify-end",
          "aria-label": s.label,
          children: [
            /* @__PURE__ */ jsx("span", { className: "pointer-events-none absolute right-6 whitespace-nowrap font-mono text-[10px] uppercase tracking-[0.25em] text-foreground opacity-0 transition-opacity group-hover:opacity-100", children: s.label }),
            /* @__PURE__ */ jsx(
              "span",
              {
                className: `block h-2 w-2 rounded-full border border-foreground transition-all ${active === s.id ? "w-6 bg-foreground" : "bg-transparent"}`
              }
            )
          ]
        },
        s.id
      ))
    }
  );
}
function useGsap(callback, deps = []) {
  useEffect(() => {
    if (typeof window === "undefined") return;
    let cleanup;
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
  }, deps);
}
function Hero() {
  const root = useRef(null);
  useGsap(({ gsap, ScrollTrigger }) => {
    const el = root.current;
    if (!el) return;
    const ctx = gsap.context(() => {
      gsap.to(".hero-name", {
        scale: 1.08,
        opacity: 0,
        y: -40,
        scrollTrigger: { trigger: el, start: "top top", end: "bottom top", scrub: 1 }
      });
      gsap.to(".hero-sketch-t", {
        y: -120,
        opacity: 0,
        scrollTrigger: { trigger: el, start: "top top", end: "bottom top", scrub: 1 }
      });
      gsap.from(".hero-name span", {
        y: 80,
        opacity: 0,
        stagger: 0.06,
        duration: 1.1,
        ease: "power3.out",
        delay: 0.2
      });
      gsap.from(".hero-tag", { opacity: 0, y: 20, duration: 0.8, delay: 1.2 });
    }, el);
    return () => {
      ctx.revert();
      ScrollTrigger.getAll().forEach((t) => t.vars.trigger === el && t.kill());
    };
  }, []);
  const name = "ECLIPSE";
  return /* @__PURE__ */ jsxs(
    "section",
    {
      id: "hero",
      ref: root,
      "aria-label": "Introduction",
      className: "paper-grain relative flex min-h-screen items-center justify-center overflow-hidden px-6",
      style: { perspective: "1200px" },
      children: [
        /* @__PURE__ */ jsx("svg", { className: "hero-sketch-t float-fast absolute right-[18%] bottom-[22%] h-16 w-24 text-pencil opacity-60", viewBox: "0 0 96 64", fill: "none", stroke: "currentColor", strokeWidth: "1.5", children: /* @__PURE__ */ jsx("path", { d: "M24 16 8 32l16 16M72 16l16 16-16 16M40 50l16-36" }) }),
        /* @__PURE__ */ jsxs("div", { className: "relative flex flex-col items-center text-center", children: [
          /* @__PURE__ */ jsx("span", { className: "hero-tag mb-6 font-mono text-xs uppercase tracking-[0.4em] text-muted-foreground", children: "Portfolio" }),
          /* @__PURE__ */ jsx("h1", { className: "hero-name font-display text-[clamp(3.5rem,14vw,12rem)] font-bold leading-none tracking-tight text-foreground", children: name.split("").map((c, i) => /* @__PURE__ */ jsx("span", { className: "inline-block", children: c }, i)) }),
          /* @__PURE__ */ jsxs("p", { className: "hero-tag mt-8 font-mono text-sm text-muted-foreground md:text-base", children: [
            "<",
            " ML & systems developer ",
            "/>"
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "hero-tag mt-16 flex flex-col items-center gap-2 text-muted-foreground", children: [
            /* @__PURE__ */ jsx("span", { className: "font-mono text-[10px] uppercase tracking-[0.3em]", children: "scroll to explore" }),
            /* @__PURE__ */ jsx("span", { className: "block h-10 w-px bg-foreground/40 animate-pulse" })
          ] })
        ] })
      ]
    }
  );
}
const PROJECTS = [
  {
    name: "Programming Language",
    blurb: "Engineered a C++20 source-to-assembly compiler with a custom x86_64 code generator. Maps syntax trees directly to Linux syscalls, managing the entire lifecycle from parsing to native machine code.",
    tags: ["C++20", "x86_64", "Assembly", "Linux"],
    role: "Systems Engineer"
  },
  {
    name: "Roblox Tower Defense Game",
    blurb: "Architected a server-authoritative Tower Defense engine in Luau. Engineered a highly concurrent combat system, a secure probabilistic Gacha engine, and scalable data persistence for complex player states.",
    tags: ["Luau", "Roblox", "Networking", "Data"],
    role: "Lead Gameplay Engineer"
  },
  {
    name: "Game Macros",
    blurb: "Automated gameplay loops using Python and AutoHotkey. Features include custom configurations, precise input delays, and Discord webhook integrations.",
    tags: ["Python", "AutoHotkey", "Automation"],
    role: "Developer"
  },
  {
    name: "Ray Tracing Engine",
    blurb: "Real-time CPU path tracer with multithreaded optimization. Implements a custom PBR material system with dielectric refractions, multi-bounce global illumination, and a live ImGui editor.",
    tags: ["C++", "ImGui", "Vulkan", "Math"],
    role: "Graphics Programmer"
  },
  {
    name: "C++ IDE & Editor",
    blurb: "A fast, cross-functional text editor built with C++, ImGui, and OpenGL3. Features a tabbed interface, built-in file hierarchy explorer, and a live command-line terminal using the Win32 API.",
    tags: ["C++", "ImGui", "OpenGL3", "Win32 API"],
    role: "Software Engineer"
  },
  {
    name: "EduSeva",
    blurb: "A multi-modal RAG platform that synthesizes technical documents into AI podcasts, hierarchical mindmaps, and flashcards with <100ms retrieval. Built with a low-latency multi-speaker TTS pipeline and an adaptive assessment engine with resilient LLM orchestration.",
    tags: ["Python", "RAG", "LLM", "TTS"],
    role: "AI Engineer"
  },
  {
    name: "Khet Seva",
    blurb: "ML smart-farming platform — 95% soil health, 90% crop recs, 98% disease detection. LightGBM + EfficientNet, FastAPI + Supabase backend.",
    tags: ["FastAPI", "LightGBM", "EfficientNet", "React"],
    role: "ML & Full-Stack"
  },
  {
    name: "FPS Multiplayer",
    blurb: "Multiplayer FPS in Unreal + C++ with optimized networking for up to 100 concurrent players. Steam matchmaking and anti-cheat integration.",
    tags: ["Unreal", "C++", "Steam"],
    role: "Game Developer"
  },
  {
    name: "Discord Bot",
    blurb: "A comprehensive automation engine featuring real-time moderation, multi-source media playback (Spotify/YouTube), and programmable slash commands. Integrates persistent event logging, server analytics, and asynchronous task scheduling for robust community management.",
    tags: ["Python", "Discord.py", "Async", "Webhooks"],
    role: "Bot Developer"
  },
  {
    name: "SOP Bot And Customer Market Analysis",
    blurb: "Low-latency chatbot over policy handbooks plus automated Qlik dashboards via Python and SingleStore. 12-criteria, 7-segment customer categorization algorithm.",
    tags: ["Python", "SingleStore", "Qlik"],
    role: "SDE Intern"
  },
  {
    name: "Kiwi Watch",
    blurb: "Responsive product site for a voice-assistant smartwatch focused on health monitoring and caregiver integration.",
    tags: ["React", "Web", "QA"],
    role: "Developer"
  }
];
function Gallery() {
  const root = useRef(null);
  const track = useRef(null);
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
          invalidateOnRefresh: true
        }
      });
    }, sec);
    return () => ctx.revert();
  }, []);
  return /* @__PURE__ */ jsxs(
    "section",
    {
      id: "gallery",
      ref: root,
      "aria-label": "Selected work",
      className: "paper-grain relative h-screen overflow-hidden",
      children: [
        /* @__PURE__ */ jsx("div", { className: "absolute left-0 right-0 top-[18%] h-px bg-foreground/30" }),
        /* @__PURE__ */ jsxs("header", { className: "relative z-10 flex items-baseline justify-between px-8 pt-10 md:px-16", children: [
          /* @__PURE__ */ jsx("h2", { className: "font-display text-3xl text-foreground md:text-5xl", children: "Selected Work" }),
          /* @__PURE__ */ jsxs("span", { className: "font-mono text-[10px] uppercase tracking-[0.3em] text-muted-foreground", children: [
            "0",
            PROJECTS.length,
            " Projects"
          ] })
        ] }),
        /* @__PURE__ */ jsx("div", { ref: track, className: "relative z-10 mt-16 flex h-[60vh] items-center gap-8 pl-8 pr-[20vw] md:gap-16 md:pl-16", children: PROJECTS.map((p, i) => /* @__PURE__ */ jsxs(
          "article",
          {
            "data-cursor": "hover",
            className: "relative flex h-full w-[80vw] max-w-[420px] shrink-0 flex-col justify-between bg-background p-7 sketch-border",
            children: [
              /* @__PURE__ */ jsxs("div", { className: "absolute -top-12 left-1/2 -translate-x-1/2", children: [
                /* @__PURE__ */ jsx("div", { className: "mx-auto h-12 w-px bg-foreground/40" }),
                /* @__PURE__ */ jsx("div", { className: "mx-auto -mt-1 h-3 w-3 rounded-full bg-foreground" })
              ] }),
              /* @__PURE__ */ jsxs("div", { children: [
                /* @__PURE__ */ jsxs("span", { className: "font-mono text-[10px] uppercase tracking-[0.3em] text-muted-foreground", children: [
                  "0",
                  i + 1,
                  " · ",
                  p.role
                ] }),
                /* @__PURE__ */ jsx("h3", { className: "mt-3 font-display text-3xl leading-tight text-foreground", children: p.name }),
                /* @__PURE__ */ jsx("p", { className: "mt-4 text-sm leading-relaxed text-muted-foreground", children: p.blurb })
              ] }),
              /* @__PURE__ */ jsx("div", { className: "mt-6 flex flex-wrap gap-2", children: p.tags.map((t) => /* @__PURE__ */ jsx(
                "span",
                {
                  className: "rounded-full border border-pencil px-3 py-1 font-mono text-[10px] uppercase tracking-wider text-foreground",
                  children: t
                },
                t
              )) })
            ]
          },
          p.name
        )) })
      ]
    }
  );
}
const SKILL_GROUPS = [
  {
    title: "Languages",
    items: ["C++", "C", "Python", "Java", "JavaScript", "Objective-C", "HTML5", "CSS3"]
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
      "Machine Learning"
    ]
  },
  {
    title: "Game & Graphics",
    items: ["Unreal Engine", "Unity", "Godot", "OpenGL", "Arduino"]
  },
  {
    title: "Backend & Data",
    items: ["FastAPI", "Flask", "MySQL", "MongoDB", "Supabase"]
  },
  {
    title: "Tooling & Deploy",
    items: ["Git", "CMake", "Tampermonkey", "Vercel", "Render", "Netlify", "Qlik"]
  }
];
function About() {
  const root = useRef(null);
  useGsap(({ gsap }) => {
    const el = root.current;
    if (!el) return;
    const ctx = gsap.context(() => {
      gsap.from(".about-line", {
        opacity: 0,
        y: 30,
        stagger: 0.1,
        scrollTrigger: { trigger: el, start: "top 70%" }
      });
      gsap.from(".skill-chip", {
        opacity: 0,
        y: 16,
        stagger: { each: 0.02, from: "start" },
        duration: 0.5,
        ease: "power2.out",
        scrollTrigger: { trigger: el, start: "top 60%" }
      });
    }, el);
    return () => ctx.revert();
  }, []);
  return /* @__PURE__ */ jsxs(
    "section",
    {
      id: "about",
      ref: root,
      "aria-label": "About",
      className: "paper-grain relative overflow-hidden px-6 py-32",
      children: [
        /* @__PURE__ */ jsxs("div", { className: "relative z-10 mx-auto max-w-3xl text-center", children: [
          /* @__PURE__ */ jsx("span", { className: "about-line font-mono text-[10px] uppercase tracking-[0.4em] text-muted-foreground", children: "About" }),
          /* @__PURE__ */ jsx("h2", { className: "about-line mt-6 font-display text-4xl leading-tight text-foreground md:text-6xl", children: "“Low-level systems, high-level intelligence — built end to end.”" }),
          /* @__PURE__ */ jsxs("p", { className: "about-line mt-8 text-base leading-relaxed text-muted-foreground md:text-lg", children: [
            "Hi I'm Eclipse and I'm a ML and C++ developer working across",
            " ",
            /* @__PURE__ */ jsx("span", { className: "text-foreground", children: "fullstack ML platforms" }),
            ",",
            " ",
            /* @__PURE__ */ jsx("span", { className: "text-foreground", children: "scalable game engines" }),
            ", and",
            " ",
            /* @__PURE__ */ jsx("span", { className: "text-foreground", children: "AI-driven platforms" }),
            ". Comfortable jumping from bare-metal C++ code and real-time path tracers to complex Machine Learning Algorithms, with a soft spot for shipping software that feels fast and snappy."
          ] })
        ] }),
        /* @__PURE__ */ jsx("div", { className: "mx-auto mt-32 grid max-w-7xl gap-10 px-4 md:grid-cols-2 lg:grid-cols-3", children: SKILL_GROUPS.map((group, i) => /* @__PURE__ */ jsxs(
          motion.div,
          {
            whileHover: { y: -5 },
            className: "about-line group relative flex flex-col overflow-hidden bg-background p-8 sketch-border md:p-10",
            children: [
              /* @__PURE__ */ jsx(
                "div",
                {
                  className: "absolute inset-0 pointer-events-none opacity-[0.03]",
                  style: { backgroundImage: "radial-gradient(circle, currentColor 1px, transparent 1px)", backgroundSize: "24px 24px" }
                }
              ),
              /* @__PURE__ */ jsxs("div", { className: "absolute right-6 top-6 font-mono text-[8px] tracking-widest text-muted-foreground opacity-40", children: [
                "STACK_0",
                i + 1,
                " // ",
                group.title.toUpperCase()
              ] }),
              /* @__PURE__ */ jsx("div", { className: "absolute left-0 top-0 h-4 w-4 border-l border-t border-pencil opacity-20" }),
              /* @__PURE__ */ jsx("div", { className: "absolute right-0 top-0 h-4 w-4 border-r border-t border-pencil opacity-20" }),
              /* @__PURE__ */ jsx("div", { className: "absolute bottom-0 left-0 h-4 w-4 border-b border-l border-pencil opacity-20" }),
              /* @__PURE__ */ jsx("div", { className: "absolute bottom-0 right-0 h-4 w-4 border-b border-r border-pencil opacity-20" }),
              /* @__PURE__ */ jsxs("div", { className: "relative z-10 flex flex-1 flex-col", children: [
                /* @__PURE__ */ jsxs("div", { className: "flex-1", children: [
                  /* @__PURE__ */ jsx("h3", { className: "font-display text-4xl text-foreground transition-colors group-hover:text-foreground/80", children: group.title }),
                  /* @__PURE__ */ jsx("div", { className: "mt-8 grid grid-cols-1 gap-y-3 sm:grid-cols-2 sm:gap-x-4", children: group.items.map((item) => /* @__PURE__ */ jsxs(
                    "div",
                    {
                      className: "skill-chip group/item relative flex items-center pl-4 transition-colors",
                      children: [
                        /* @__PURE__ */ jsx("span", { className: "absolute left-0 h-px w-2 bg-pencil group-hover/item:w-3 group-hover/item:bg-foreground transition-all" }),
                        /* @__PURE__ */ jsx("span", { className: "font-mono text-[13px] text-muted-foreground group-hover/item:text-foreground", children: item })
                      ]
                    },
                    item
                  )) })
                ] }),
                /* @__PURE__ */ jsxs("div", { className: "mt-12 flex items-center gap-3 border-t border-pencil pt-6 opacity-30", children: [
                  /* @__PURE__ */ jsx("div", { className: "h-1 w-1 rounded-full bg-foreground" }),
                  /* @__PURE__ */ jsxs("span", { className: "font-mono text-[8px] uppercase tracking-widest", children: [
                    "System Profile // Integrated_",
                    group.title.split(" ")[0]
                  ] })
                ] })
              ] })
            ]
          },
          group.title
        )) })
      ]
    }
  );
}
const TIMELINE = [
  {
    when: "May – Jul 2025",
    org: "Indian Oil Corporation",
    role: "SDE Intern · Mumbai, India",
    points: [
      "Shipped a low-latency chatbot over company SOPs, documents and policy handbooks.",
      "Automated Qlik dashboards via Python + SingleStore for real-time reporting.",
      "Designed a 12-criteria, 7-segment customer categorization algorithm."
    ]
  },
  {
    when: "Apr 2025",
    org: "Kiwi Voice Assistant, Inc",
    role: "Developer · Lexington, MA",
    points: [
      "Designed & built a responsive product site for Kiwi Watch.",
      "Led testing, bug fixes and deployment, meeting accessibility standards."
    ]
  }
];
function Experience() {
  const root = useRef(null);
  useGsap(({ gsap }) => {
    const el = root.current;
    if (!el) return;
    const ctx = gsap.context(() => {
      gsap.utils.toArray(".tl-card").forEach((card) => {
        gsap.from(card, {
          opacity: 0,
          rotateY: -60,
          y: 60,
          duration: 0.9,
          ease: "power3.out",
          scrollTrigger: { trigger: card, start: "top 85%" }
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
          scrub: 1
        }
      });
    }, el);
    return () => ctx.revert();
  }, []);
  return /* @__PURE__ */ jsxs(
    "section",
    {
      id: "experience",
      ref: root,
      "aria-label": "Experience timeline",
      className: "paper-grain relative px-6 py-32",
      style: { perspective: "1200px" },
      children: [
        /* @__PURE__ */ jsxs("header", { className: "mx-auto mb-20 max-w-3xl text-center", children: [
          /* @__PURE__ */ jsx("span", { className: "font-mono text-[10px] uppercase tracking-[0.4em] text-muted-foreground", children: "The Path" }),
          /* @__PURE__ */ jsx("h2", { className: "mt-4 font-display text-4xl text-foreground md:text-6xl", children: "Experience" })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "relative mx-auto max-w-5xl", children: [
          /* @__PURE__ */ jsx("span", { className: "tl-stem absolute left-4 top-0 bottom-0 w-px bg-foreground md:left-1/2" }),
          /* @__PURE__ */ jsx("ul", { className: "space-y-16", children: TIMELINE.map((t, i) => {
            const right = i % 2 === 1;
            return /* @__PURE__ */ jsxs("li", { className: "relative md:grid md:grid-cols-2 md:gap-16", children: [
              /* @__PURE__ */ jsx("span", { className: "absolute left-4 top-3 h-3 w-3 -translate-x-1/2 rounded-full border-2 border-foreground bg-background md:left-1/2" }),
              right && /* @__PURE__ */ jsx("div", { className: "hidden md:block" }),
              /* @__PURE__ */ jsxs(
                "article",
                {
                  className: `tl-card ml-12 bg-background p-6 sketch-border md:ml-0 ${right ? "md:ml-8" : "md:mr-8 md:text-right"}`,
                  children: [
                    /* @__PURE__ */ jsx("span", { className: "font-mono text-[10px] uppercase tracking-[0.3em] text-muted-foreground", children: t.when }),
                    /* @__PURE__ */ jsx("h3", { className: "mt-2 font-display text-2xl text-foreground", children: t.org }),
                    /* @__PURE__ */ jsx("p", { className: "mt-1 text-sm text-muted-foreground", children: t.role }),
                    /* @__PURE__ */ jsx("ul", { className: `mt-4 space-y-2 text-sm text-foreground/80 ${right ? "" : "md:[&>li]:flex-row-reverse"}`, children: t.points.map((p) => /* @__PURE__ */ jsxs("li", { className: "flex gap-2", children: [
                      /* @__PURE__ */ jsx("span", { className: "mt-1.5 h-1 w-1 shrink-0 rounded-full bg-primary" }),
                      /* @__PURE__ */ jsx("span", { children: p })
                    ] }, p)) })
                  ]
                }
              )
            ] }, t.org + t.when);
          }) })
        ] })
      ]
    }
  );
}
const ROLES = [
  {
    when: "Jul 2024 – Jun 2025",
    org: "GeeksForGeeks",
    role: "Game Dev Team Lead",
    points: [
      "Introduced the Game Development domain; deployed 2 projects.",
      "Hosted an escape-room event with 150+ participants.",
      "Led an FPS project, a detective story game and Raylib experiments."
    ]
  },
  {
    when: "Mar 2024 – Jun 2025",
    org: "Google Developer Group",
    role: "Systems Developer",
    points: ["Part of the systems team. Contributed to compiler tooling, Building Text Editors."]
  },
  {
    when: "Jun 2022 – Apr 2024",
    org: "GeeksForGeeks",
    role: "Core Developer",
    points: [
      "Java, C++, C, Python.",
      "Built a scraping tool for hackathons and upcoming internships."
    ]
  }
];
function Leadership() {
  const root = useRef(null);
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
        scrollTrigger: { trigger: el, start: "top 75%" }
      });
    }, el);
    return () => ctx.revert();
  }, []);
  return /* @__PURE__ */ jsxs(
    "section",
    {
      id: "leadership",
      ref: root,
      "aria-label": "Activities and leadership",
      className: "paper-grain relative px-6 py-32",
      children: [
        /* @__PURE__ */ jsxs("header", { className: "mx-auto mb-16 max-w-3xl text-center", children: [
          /* @__PURE__ */ jsx("span", { className: "font-mono text-[10px] uppercase tracking-[0.4em] text-muted-foreground", children: "Off-Hours" }),
          /* @__PURE__ */ jsx("h2", { className: "mt-4 font-display text-4xl text-foreground md:text-6xl", children: "Activities & Leadership" })
        ] }),
        /* @__PURE__ */ jsx("ul", { className: "mx-auto grid max-w-6xl gap-6 md:grid-cols-3", children: ROLES.map((r) => /* @__PURE__ */ jsxs("li", { className: "lead-card bg-background p-6 sketch-border", children: [
          /* @__PURE__ */ jsx("span", { className: "font-mono text-[10px] uppercase tracking-[0.3em] text-muted-foreground", children: r.when }),
          /* @__PURE__ */ jsx("h3", { className: "mt-2 font-display text-2xl text-foreground", children: r.org }),
          /* @__PURE__ */ jsx("p", { className: "mt-1 text-sm text-muted-foreground", children: r.role }),
          /* @__PURE__ */ jsx("ul", { className: "mt-4 space-y-2 text-sm text-foreground/80", children: r.points.map((p) => /* @__PURE__ */ jsxs("li", { className: "flex gap-2", children: [
            /* @__PURE__ */ jsx("span", { className: "mt-1.5 h-1 w-1 shrink-0 rounded-full bg-primary" }),
            /* @__PURE__ */ jsx("span", { children: p })
          ] }, p)) })
        ] }, r.org + r.when)) })
      ]
    }
  );
}
const LINKS = [
  { label: "GitHub", href: "https://github.com/EclipseWasTaken?" },
  { label: "Discord", href: "#", alias: "eclipse0106" }
];
function Contact() {
  const root = useRef(null);
  useGsap(({ gsap }) => {
    const el = root.current;
    if (!el) return;
    const ctx = gsap.context(() => {
      gsap.from(".contact-heading", {
        opacity: 0,
        y: 40,
        duration: 1,
        ease: "power3.out",
        scrollTrigger: { trigger: el, start: "top 80%" }
      });
      gsap.from(".contact-link", {
        opacity: 0,
        y: 20,
        stagger: 0.08,
        duration: 0.6,
        ease: "power3.out",
        scrollTrigger: { trigger: el, start: "top 70%" }
      });
      gsap.from(".contact-alias", {
        opacity: 0,
        scale: 0.95,
        duration: 0.8,
        ease: "power3.out",
        scrollTrigger: { trigger: el, start: "top 75%" }
      });
    }, el);
    return () => ctx.revert();
  }, []);
  const copyDiscord = () => {
    navigator.clipboard.writeText("eclipse0106");
    toast.success("Discord username copied to clipboard!");
  };
  return /* @__PURE__ */ jsxs(
    "section",
    {
      id: "contact",
      ref: root,
      "aria-label": "Contact",
      className: "paper-grain relative overflow-hidden px-6 pb-20 pt-32",
      children: [
        /* @__PURE__ */ jsx(
          "div",
          {
            className: "absolute inset-0 pointer-events-none opacity-[0.03]",
            style: { backgroundImage: "radial-gradient(circle, currentColor 1px, transparent 1px)", backgroundSize: "24px 24px" }
          }
        ),
        /* @__PURE__ */ jsxs("div", { className: "mx-auto max-w-3xl text-center", children: [
          /* @__PURE__ */ jsx("span", { className: "contact-heading font-mono text-sm uppercase tracking-[0.4em] text-muted-foreground", children: "Connect" }),
          /* @__PURE__ */ jsx("h2", { className: "contact-heading mt-4 font-display text-5xl leading-tight text-foreground md:text-7xl", children: "Let's build something." }),
          /* @__PURE__ */ jsx("p", { className: "contact-heading mt-6 text-base text-muted-foreground md:text-lg", children: "Open to opportunities — reach out and let's talk." }),
          /* @__PURE__ */ jsxs("div", { className: "contact-alias mt-16 flex flex-col items-center gap-2", children: [
            /* @__PURE__ */ jsx("span", { className: "font-mono text-[10px] uppercase tracking-[0.4em] text-muted-foreground", children: "find me as" }),
            /* @__PURE__ */ jsx("span", { className: "font-display text-3xl tracking-wide text-foreground md:text-5xl", children: "eclipse" }),
            /* @__PURE__ */ jsx("span", { className: "mt-2 font-mono text-lg text-muted-foreground", children: "eclipse0106" })
          ] }),
          /* @__PURE__ */ jsx("nav", { className: "mt-12 flex items-center justify-center gap-8", children: LINKS.map((l) => /* @__PURE__ */ jsxs(
            "button",
            {
              onClick: l.label === "Discord" ? copyDiscord : void 0,
              className: "contact-link group font-mono text-xs uppercase tracking-[0.2em] text-muted-foreground transition-colors hover:text-foreground",
              children: [
                l.label === "GitHub" ? /* @__PURE__ */ jsx(
                  "a",
                  {
                    href: l.href,
                    "data-cursor": "hover",
                    target: "_blank",
                    rel: "noreferrer noopener",
                    children: l.label
                  }
                ) : /* @__PURE__ */ jsx("span", { "data-cursor": "hover", children: l.label }),
                /* @__PURE__ */ jsx("span", { className: "block h-px w-0 bg-foreground transition-all duration-300 group-hover:w-full" })
              ]
            },
            l.label
          )) })
        ] })
      ]
    }
  );
}
function Index() {
  return /* @__PURE__ */ jsxs("main", { className: "relative min-h-screen text-foreground", children: [
    /* @__PURE__ */ jsx(SmoothScroll, {}),
    /* @__PURE__ */ jsx(Loader, {}),
    /* @__PURE__ */ jsx(CustomCursor, {}),
    /* @__PURE__ */ jsx(DotNav, {}),
    /* @__PURE__ */ jsx(Hero, {}),
    /* @__PURE__ */ jsx(Gallery, {}),
    /* @__PURE__ */ jsx(About, {}),
    /* @__PURE__ */ jsx(Experience, {}),
    /* @__PURE__ */ jsx(Leadership, {}),
    /* @__PURE__ */ jsx(Contact, {})
  ] });
}
export {
  Index as component
};
