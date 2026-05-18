"use client";

import React, { useRef, useEffect, useState, useCallback } from "react";
import { motion, AnimatePresence, useScroll, useTransform, useMotionValueEvent, MotionValue } from "framer-motion";
import { ChapterController } from "./ChapterController";
import { FeatureHotspot, GlassFeatureCard } from "./FeatureHotspot";

/* ================================================================== */
/*  CONSTANTS                                                           */
/* ================================================================== */

const TOTAL_FRAMES = 240;
const CRITICAL_FRAMES = 28;       // Load immediately
const FRAME_PATH = (i: number) =>
  `/images/ezgif-frame-${String(i).padStart(3, "0")}.jpg`;

/* ================================================================== */
/*  FEATURE DATA                                                        */
/* ================================================================== */

const FEATURES = [
  {
    id: "anc",
    label: "ANC Processor",
    x: "46%",
    y: "40%",
    title: "Integrated Processor V2",
    subtitle: "AI Noise Cancellation",
    description:
      "Dual V2 processors analyze ambient sound 700,000 times per second, adapting in real-time to eliminate noise before it reaches your ears.",
    stats: [
      { label: "Samples/sec", value: "700K" },
      { label: "Microphones", value: "4×" },
      { label: "dB reduction", value: "−35" },
    ],
    accentColor: "#7B61FF",
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <circle cx="12" cy="12" r="3"/>
        <path d="M12 1v4M12 19v4M4.22 4.22l2.83 2.83M16.95 16.95l2.83 2.83M1 12h4M19 12h4M4.22 19.78l2.83-2.83M16.95 7.05l2.83-2.83"/>
      </svg>
    ),
    progressRange: [0.25, 0.55] as [number, number],
  },
  {
    id: "driver",
    label: "40mm Driver",
    x: "52%",
    y: "58%",
    title: "Carbon-Fiber Drivers",
    subtitle: "Acoustic Architecture",
    description:
      "Custom 40mm carbon-fiber composite drivers deliver pristine, Hi-Res audio with exceptional clarity across all frequencies from 4Hz to 40kHz.",
    stats: [
      { label: "Driver size", value: "40mm" },
      { label: "Frequency", value: "4–40K" },
      { label: "Impedance", value: "48Ω" },
    ],
    accentColor: "#00C8FF",
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path d="M9 18V5l12-2v13"/>
        <circle cx="6" cy="18" r="3"/>
        <circle cx="18" cy="16" r="3"/>
      </svg>
    ),
    progressRange: [0.42, 0.68] as [number, number],
  },
  {
    id: "band",
    label: "Adjustable Band",
    x: "50%",
    y: "20%",
    title: "ErgoComfort Design",
    subtitle: "All-Day Comfort",
    description:
      "Redesigned headband with soft-fit leather earpads and precision-weighted balance. 40 hours of listening without discomfort.",
    stats: [
      { label: "Battery", value: "40H" },
      { label: "Charge", value: "3min→60min" },
      { label: "Weight", value: "250g" },
    ],
    accentColor: "#ffffff",
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path d="M3 18v-6a9 9 0 0 1 18 0v6"/>
        <path d="M21 19a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2h3zM3 19a2 2 0 0 0 2 2h1a2 2 0 0 0 2-2v-3a2 2 0 0 0-2-2H3z"/>
      </svg>
    ),
    progressRange: [0.6, 0.82] as [number, number],
  },
];

/* ================================================================== */
/*  FRAME PRELOADER HOOK                                                */
/* ================================================================== */

function useFramePreloader() {
  const imageCache = useRef<HTMLImageElement[]>([]);
  const [criticalLoaded, setCriticalLoaded] = useState(false);
  const [totalLoaded, setTotalLoaded] = useState(0);

  useEffect(() => {
    let criticalCount = 0;
    let totalCount = 0;

    const onCriticalLoad = () => {
      criticalCount++;
      totalCount++;
      setTotalLoaded(totalCount);
      if (criticalCount >= CRITICAL_FRAMES) {
        setCriticalLoaded(true);
        // Lazy load remaining frames
        loadRemaining();
      }
    };

    const onLazyLoad = () => {
      totalCount++;
      setTotalLoaded(totalCount);
    };

    const loadRemaining = () => {
      for (let i = CRITICAL_FRAMES + 1; i <= TOTAL_FRAMES; i++) {
        if (imageCache.current[i - 1]?.complete) continue;
        const img = new Image();
        img.src = FRAME_PATH(i);
        img.onload = onLazyLoad;
        img.onerror = onLazyLoad;
        imageCache.current[i - 1] = img;
      }
    };

    // Load critical frames first
    for (let i = 1; i <= CRITICAL_FRAMES; i++) {
      const img = new Image();
      img.fetchPriority = "high";
      img.src = FRAME_PATH(i);
      img.onload = onCriticalLoad;
      img.onerror = onCriticalLoad;
      imageCache.current[i - 1] = img;
    }
  }, []);

  const getFrame = useCallback((index: number): HTMLImageElement | null => {
    const img = imageCache.current[index - 1];
    return img?.complete ? img : null;
  }, []);

  return { criticalLoaded, totalLoaded, getFrame };
}

/* ================================================================== */
/*  CANVAS RENDERER                                                     */
/* ================================================================== */

interface CanvasRendererProps {
  frameIndex: number;
  getFrame: (index: number) => HTMLImageElement | null;
}

function CanvasRenderer({ frameIndex, getFrame }: CanvasRendererProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rafRef = useRef<number>(0);
  const lastFrameRef = useRef<number>(-1);

  const render = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const targetFrame = Math.max(1, Math.min(TOTAL_FRAMES, frameIndex));

    // Try to find the nearest loaded frame (go backward if needed)
    let img: HTMLImageElement | null = null;
    for (let offset = 0; offset <= 5; offset++) {
      img = getFrame(Math.max(1, targetFrame - offset));
      if (img) break;
    }
    if (!img) return;

    // Skip re-draw if same frame
    if (lastFrameRef.current === targetFrame && img.complete) return;
    lastFrameRef.current = targetFrame;

    const ctx = canvas.getContext("2d", { alpha: false });
    if (!ctx) return;

    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const rect = canvas.getBoundingClientRect();
    const w = rect.width;
    const h = rect.height;

    if (canvas.width !== w * dpr || canvas.height !== h * dpr) {
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      ctx.scale(dpr, dpr);
    }

    // Fill background
    ctx.fillStyle = "#050505";
    ctx.fillRect(0, 0, w, h);

    // Draw image - "contain" (show full headphone, no crop)
    const imgAspect = img.naturalWidth / img.naturalHeight;
    const canvasAspect = w / h;
    let drawW: number, drawH: number, drawX: number, drawY: number;

    if (imgAspect > canvasAspect) {
      drawW = w;
      drawH = w / imgAspect;
      drawX = 0;
      drawY = (h - drawH) / 2;
    } else {
      drawH = h;
      drawW = h * imgAspect;
      drawX = (w - drawW) / 2;
      drawY = 0;
    }

    ctx.drawImage(img, drawX, drawY, drawW, drawH);
  }, [frameIndex, getFrame]);

  useEffect(() => {
    rafRef.current = requestAnimationFrame(render);
    return () => cancelAnimationFrame(rafRef.current);
  }, [render]);

  useEffect(() => {
    const handleResize = () => {
      lastFrameRef.current = -1;
      requestAnimationFrame(render);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [render]);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full"
      aria-label="Sony WH-1000XM6 product animation"
    />
  );
}

/* ================================================================== */
/*  PERFORMANCE FALLBACK                                               */
/* ================================================================== */

function PerformanceFallback() {
  return (
    <div className="absolute inset-0 flex items-center justify-center bg-[#050505]">
      <div className="flex flex-col items-center gap-6">
        {/* Skeleton shape of headphones */}
        <div className="relative w-48 h-36 md:w-64 md:h-48">
          <div className="skeleton-shimmer absolute inset-0 rounded-full opacity-60" style={{
            borderRadius: "50% 50% 40% 40% / 60% 60% 40% 40%",
          }} />
          <div className="skeleton-shimmer absolute bottom-0 left-3 w-8 h-16 rounded-xl" />
          <div className="skeleton-shimmer absolute bottom-0 right-3 w-8 h-16 rounded-xl" />
        </div>
        <div className="flex flex-col items-center gap-3">
          <div className="w-32 h-1.5 bg-white/5 rounded-full overflow-hidden">
            <div className="skeleton-shimmer h-full w-full rounded-full" />
          </div>
          <p className="label" style={{ color: "var(--text-tertiary)" }}>
            Loading experience…
          </p>
        </div>
      </div>
    </div>
  );
}

/* ================================================================== */
/*  REPLAY BUTTON                                                      */
/* ================================================================== */

function ReplayButton({ onReplay }: { onReplay: () => void }) {
  return (
    <motion.button
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ scale: 1.04, y: -2 }}
      whileTap={{ scale: 0.97 }}
      transition={{ duration: 0.3 }}
      onClick={onReplay}
      className="btn-ghost flex items-center gap-2"
      aria-label="Replay animation"
    >
      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/>
        <path d="M3 3v5h5"/>
      </svg>
      <span>Replay</span>
    </motion.button>
  );
}

/* ================================================================== */
/*  FLOATING CTA BUTTONS                                               */
/* ================================================================== */

function FloatingCTA({ visible }: { visible: boolean }) {
  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
          transition={{ duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] }}
          className="absolute bottom-16 md:bottom-20 left-1/2 -translate-x-1/2 flex flex-col sm:flex-row items-center gap-3 z-30 px-4"
        >
          <motion.a
            href="https://www.sony.com/en/headphones"
            target="_blank"
            rel="noopener noreferrer"
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.97 }}
            className="btn-primary"
          >
            Pre-order Now
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M5 12h14M12 5l7 7-7 7"/>
            </svg>
          </motion.a>
          <motion.button
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.97 }}
            className="btn-ghost"
            onClick={() => {
              document.getElementById("specs-section")?.scrollIntoView({ behavior: "smooth" });
            }}
          >
            Explore Specs
          </motion.button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

/* ================================================================== */
/*  SCROLL INDICATOR                                                   */
/* ================================================================== */

function ScrollHint({ visible }: { visible: boolean }) {
  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2 z-30 flex flex-col items-center gap-2 pointer-events-none"
        >
          <p className="label" style={{ color: "rgba(255,255,255,0.3)" }}>
            Scroll to explore
          </p>
          <div className="w-5 h-8 rounded-full border border-white/20 flex items-start justify-center pt-1.5">
            <motion.div
              className="w-1 h-2 bg-white/50 rounded-full"
              animate={{ y: [0, 8, 0], opacity: [0.5, 1, 0.5] }}
              transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
            />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

/* ================================================================== */
/*  GLOW BACKGROUND                                                    */
/* ================================================================== */

function ProductGlow({ scrollYProgress }: { scrollYProgress: MotionValue<number> }) {
  const glowOpacity = useTransform(scrollYProgress, [0, 0.15, 0.85, 1], [0, 1, 1, 0.3]);
  const glowColor = useTransform(
    scrollYProgress,
    [0, 0.3, 0.6, 1],
    ["rgba(0,80,255,0.12)", "rgba(123,97,255,0.15)", "rgba(0,200,255,0.12)", "rgba(0,80,255,0.08)"]
  );

  return (
    <motion.div
      className="absolute inset-0 pointer-events-none z-0"
      style={{ opacity: glowOpacity }}
    >
      <motion.div
        className="absolute inset-0"
        style={{
          background: glowColor,
          filter: "blur(60px)",
        }}
      />
      {/* Thin radial */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 55% 40% at 50% 50%, rgba(0,80,255,0.08) 0%, transparent 70%)",
        }}
      />
    </motion.div>
  );
}

/* ================================================================== */
/*  MAIN COMPONENT                                                     */
/* ================================================================== */

export default function ScrollCanvasSequence() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { criticalLoaded, totalLoaded, getFrame } = useFramePreloader();

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  const frameIndex = useTransform(scrollYProgress, [0, 1], [1, TOTAL_FRAMES]);
  const [currentFrame, setCurrentFrame] = useState(1);
  const [currentProgress, setCurrentProgress] = useState(0);
  const [isMobile, setIsMobile] = useState(false);
  const [activeFeature, setActiveFeature] = useState<string | null>(null);
  const [isNearEnd, setIsNearEnd] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  useMotionValueEvent(frameIndex, "change", (v) => {
    setCurrentFrame(Math.round(v));
  });

  useMotionValueEvent(scrollYProgress, "change", (v) => {
    setCurrentProgress(v);
    setIsNearEnd(v > 0.82);
  });

  const handleReplay = () => {
    window.scrollTo({ top: containerRef.current?.offsetTop ?? 0, behavior: "smooth" });
  };

  const activeFeatureData = FEATURES.find((f) => f.id === activeFeature) ?? null;

  return (
    <>
      <div
        ref={containerRef}
        className="relative w-full"
        style={{ height: "420vh", isolation: "isolate" }}
      >
        {/* ── Sticky viewport ── */}
        <div className="sticky top-0 w-full overflow-hidden" style={{ height: "100dvh" }}>

          {/* Product glow */}
          <ProductGlow scrollYProgress={scrollYProgress} />

          {/* Canvas or fallback */}
          {criticalLoaded ? (
            <CanvasRenderer frameIndex={currentFrame} getFrame={getFrame} />
          ) : (
            <PerformanceFallback />
          )}

          {/* Cinematic gradient overlays */}
          <div className="absolute top-0 left-0 right-0 pointer-events-none z-10" style={{ height: "18%", background: "linear-gradient(to bottom, #050505, transparent)" }} />
          <div className="absolute bottom-0 left-0 right-0 pointer-events-none z-10" style={{ height: "28%", background: "linear-gradient(to top, #050505 30%, transparent)" }} />
          <div className="absolute inset-0 pointer-events-none z-10 hidden xl:block" style={{ background: "linear-gradient(to right, #050505 0%, transparent 16%, transparent 84%, #050505 100%)" }} />

          {/* Chapter copy */}
          <div className="absolute inset-0 pointer-events-none">
            <ChapterController
              scrollYProgress={scrollYProgress}
              currentProgress={currentProgress}
              isMobile={isMobile}
            />
          </div>

          {/* Feature Hotspots */}
          {FEATURES.map((feature, i) => {
            const inRange =
              currentProgress >= feature.progressRange[0] &&
              currentProgress <= feature.progressRange[1];
            return (
              <FeatureHotspot
                key={feature.id}
                x={feature.x}
                y={feature.y}
                label={feature.label}
                visible={inRange && criticalLoaded}
                index={i}
                onClick={() =>
                  setActiveFeature((prev) =>
                    prev === feature.id ? null : feature.id
                  )
                }
              />
            );
          })}

          {/* Loading progress strip (bottom, minimal) */}
          {!criticalLoaded && (
            <div className="absolute bottom-0 left-0 right-0 h-[2px] z-50 bg-white/5">
              <div
                className="h-full transition-all duration-300"
                style={{
                  width: `${(totalLoaded / CRITICAL_FRAMES) * 100}%`,
                  background: "linear-gradient(90deg, #0050FF, #00C8FF)",
                  boxShadow: "0 0 8px rgba(0,200,255,0.6)",
                }}
              />
            </div>
          )}

          {/* Scroll hint */}
          <ScrollHint visible={currentProgress < 0.04 && criticalLoaded} />

          {/* Floating CTA */}
          <FloatingCTA visible={isNearEnd} />

          {/* Replay + total progress (bottom-left, desktop) */}
          <motion.div
            className="absolute bottom-6 left-6 z-30 hidden md:flex items-center gap-3"
            initial={{ opacity: 0 }}
            animate={{ opacity: criticalLoaded ? 1 : 0 }}
            transition={{ delay: 1 }}
          >
            {isNearEnd && <ReplayButton onReplay={handleReplay} />}
          </motion.div>

          {/* Frame counter — dev only, tiny opacity */}
          {process.env.NODE_ENV === "development" && (
            <div className="absolute top-20 left-4 z-50 pointer-events-none" style={{ fontSize: 10, color: "rgba(255,255,255,0.15)", fontVariantNumeric: "tabular-nums", letterSpacing: "0.05em" }}>
              {currentFrame}/{TOTAL_FRAMES}
            </div>
          )}
        </div>
      </div>

      {/* ── Feature card modal ── */}
      {activeFeatureData && (
        <GlassFeatureCard
          isOpen={activeFeature !== null}
          onClose={() => setActiveFeature(null)}
          title={activeFeatureData.title}
          subtitle={activeFeatureData.subtitle}
          description={activeFeatureData.description}
          stats={activeFeatureData.stats}
          accentColor={activeFeatureData.accentColor}
          icon={activeFeatureData.icon}
        />
      )}
    </>
  );
}


