"use client";

import React, { useEffect, useRef } from "react";
import { motion, useScroll, useSpring } from "framer-motion";

export default function ProgressIndicator() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 180,
    damping: 28,
    restDelta: 0.001,
  });

  // Chapter dots
  const chapters = [0, 0.16, 0.33, 0.5, 0.66, 0.82, 1];
  const labels = ["Intro", "Reveal", "ANC", "Acoustic", "Battery", "Rebuild", "CTA"];

  const [activeChapter, setActiveChapter] = React.useState(0);
  const [scrollPct, setScrollPct] = React.useState(0);

  useEffect(() => {
    return scrollYProgress.on("change", (v) => {
      setScrollPct(v);
      let idx = 0;
      for (let i = 0; i < chapters.length; i++) {
        if (v >= chapters[i] - 0.04) idx = i;
      }
      setActiveChapter(idx);
    });
  }, [scrollYProgress]);

  return (
    <>
      {/* Top progress bar */}
      <div className="progress-bar" aria-hidden="true">
        <motion.div className="progress-fill" style={{ scaleX }} />
      </div>

      {/* Side chapter dots — hidden on mobile */}
      <nav
        aria-label="Page chapters"
        className="fixed right-5 top-1/2 -translate-y-1/2 z-50 hidden lg:flex flex-col items-center gap-3"
      >
        {chapters.map((_, i) => (
          <button
            key={i}
            title={labels[i]}
            aria-label={`Go to chapter: ${labels[i]}`}
            onClick={() => {
              const target = chapters[i] * (document.documentElement.scrollHeight - window.innerHeight);
              window.scrollTo({ top: target, behavior: "smooth" });
            }}
            className="group relative flex items-center justify-end gap-2 cursor-pointer"
          >
            {/* Label tooltip */}
            <span className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 text-[10px] font-medium tracking-widest uppercase text-white/40 whitespace-nowrap">
              {labels[i]}
            </span>
            {/* Dot */}
            <div
              className="transition-all duration-300"
              style={{
                width: activeChapter === i ? "20px" : "6px",
                height: "6px",
                borderRadius: "9999px",
                background:
                  activeChapter === i
                    ? "linear-gradient(90deg, #0050FF, #00C8FF)"
                    : activeChapter > i
                    ? "rgba(255,255,255,0.3)"
                    : "rgba(255,255,255,0.12)",
                boxShadow:
                  activeChapter === i
                    ? "0 0 10px rgba(0,200,255,0.6)"
                    : "none",
              }}
            />
          </button>
        ))}
      </nav>

      {/* Bottom progress % — mobile only */}
      <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-50 lg:hidden">
        <div className="glass-sm px-3 py-1.5 flex items-center gap-2">
          <div className="w-16 h-0.5 bg-white/10 rounded-full overflow-hidden">
            <div
              className="h-full rounded-full transition-all duration-100"
              style={{
                width: `${scrollPct * 100}%`,
                background: "linear-gradient(90deg, #0050FF, #00C8FF)",
              }}
            />
          </div>
          <span className="label" style={{ color: "var(--sony-cyan)" }}>
            {Math.round(scrollPct * 100)}%
          </span>
        </div>
      </div>
    </>
  );
}
