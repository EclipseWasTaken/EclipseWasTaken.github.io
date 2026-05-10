import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

/** Two-layer cubic-bezier wave path for an ocean-like swell */
function buildWavePath(
  fillY: number,
  t: number,
  speed: number,
  amp: number,
  freq: number,
  phase: number,
  width: number,
  height: number
): string {
  const segments = 24;
  const segW = width / segments;
  let d = `M -10,${height + 10} L -10,${fillY}`;

  for (let i = 0; i <= segments; i++) {
    const x = i * segW;
    const y =
      fillY +
      Math.sin(i * freq + phase + t * speed) * amp +
      Math.sin(i * freq * 1.7 + phase * 1.3 + t * speed * 0.7) * (amp * 0.4);

    if (i === 0) {
      d += ` L ${x},${y}`;
    } else {
      const px = (i - 1) * segW;
      const py =
        fillY +
        Math.sin((i - 1) * freq + phase + t * speed) * amp +
        Math.sin((i - 1) * freq * 1.7 + phase * 1.3 + t * speed * 0.7) * (amp * 0.4);
      d += ` C ${px + segW * 0.4},${py} ${x - segW * 0.4},${y} ${x},${y}`;
    }
  }

  d += ` L ${width + 10},${height + 10} Z`;
  return d;
}

function easeInOutQuart(t: number) {
  return t < 0.5 ? 8 * t * t * t * t : 1 - Math.pow(-2 * t + 2, 4) / 2;
}

const W = 1200;
const H = 400;

export function Loader() {
  const [progress, setProgress] = useState(0);
  const [wave1d, setWave1d] = useState("");
  const [wave2d, setWave2d] = useState("");
  const [done, setDone] = useState(false);

  const tRef = useRef(0);
  const startRef = useRef<number | null>(null);
  const rafRef = useRef<number | null>(null);

  const duration = 4800;

  useEffect(() => {
    function loop(ts: number) {
      if (startRef.current === null) startRef.current = ts;

      const elapsed = Math.max(0, ts - startRef.current);
      const raw = Math.min(elapsed / duration, 1);
      const eased = easeInOutQuart(raw);

      setProgress(eased);

      tRef.current += 0.01;
      const t = tRef.current;

      const fillY = H - eased * H;
      const amp = 16 + (1 - eased) * 8;

      setWave1d(buildWavePath(fillY, t, 1.0, amp, 0.9, 0, W, H));
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

  return (
    <AnimatePresence>
      {!done && (
        <motion.div
          className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-background"
          initial={{ y: 0 }}


          exit={{
            y: "-100%",
            transition: { duration: 0.9, ease: [0.76, 0, 0.24, 1] }
          }}
        >
          {/* Water-fill text */}
          <div className="relative flex items-center justify-center w-full">
            <svg
              width="100%"
              height={H}
              viewBox={`0 0 ${W} ${H}`}
              aria-hidden="true"
              className="overflow-visible"
            >
              <defs>
                <clipPath id="loader-text-clip">
                  <text
                    x="50%"
                    y="50%"
                    dominantBaseline="middle"
                    textAnchor="middle"
                    className="font-display font-bold text-[clamp(3.5rem,14vw,12rem)] tracking-tight"
                  >
                    ECLIPSE
                  </text>
                </clipPath>
              </defs>

              {/* Ghost outline */}
              <text
                x="50%"
                y="50%"
                dominantBaseline="middle"
                textAnchor="middle"
                fill="none"
                stroke="currentColor"
                strokeWidth="1"
                className="font-display font-bold text-[clamp(3.5rem,14vw,12rem)] tracking-tight text-foreground/10"
              >
                ECLIPSE
              </text>

              {/* Liquid layers, clipped to text */}
              <g clipPath="url(#loader-text-clip)">
                {/* back wave */}
                <path d={wave2d} className="fill-foreground/40" />
                {/* front wave */}
                <path d={wave1d} className="fill-foreground" />
              </g>
            </svg>
          </div>

          {/* Bottom-left counter */}
          <div className="absolute bottom-10 left-10 flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
            <span>loading</span>
            <span className="w-[4ch] tabular-nums text-foreground">
              {pct.toString().padStart(3, "0")}%
            </span>
          </div>

          {/* Hairline progress bar */}
          <div className="absolute bottom-0 left-0 h-[1.5px] bg-foreground transition-[width] duration-75" style={{ width: `${pct}%` }} />
        </motion.div>
      )}
    </AnimatePresence>
  );
}
