"use client";

import React from "react";
import { motion, MotionValue, useTransform } from "framer-motion";

/* ------------------------------------------------------------------ */
/*  Chapter config                                                     */
/* ------------------------------------------------------------------ */

export interface Chapter {
  id: string;
  label: string;
  title: string;
  subtitle?: string;
  body?: string;
  tag?: string;
  accentColor?: string;
  /** 0–1 progress range to show this chapter copy */
  progressRange: [number, number];
  /** Layout: left | right | center | bottom */
  layout?: "left" | "right" | "center" | "bottom";
}

export const CHAPTERS: Chapter[] = [
  {
    id: "intro",
    label: "Chapter 01",
    title: "The Sound\nof Silence.",
    body: "Scroll to explore the engineering behind the ultimate listening experience.",
    progressRange: [0, 0.08],
    layout: "center",
    accentColor: "#ffffff",
  },
  {
    id: "reveal",
    label: "Chapter 02",
    tag: "Engineered for Silence",
    title: "Born to\nBlock the World.",
    body: "Industry-leading noise cancellation powered by dual Integrated Processor V2.",
    progressRange: [0.1, 0.24],
    layout: "left",
    accentColor: "#00C8FF",
  },
  {
    id: "anc",
    label: "Chapter 03",
    tag: "AI Noise Cancellation",
    title: "Next-Gen\nProcessing.",
    body: "Four microphones and dual processors analyze environmental noise millions of times per second.",
    progressRange: [0.29, 0.44],
    layout: "right",
    accentColor: "#7B61FF",
  },
  {
    id: "acoustic",
    label: "Chapter 04",
    tag: "Acoustic Architecture",
    title: "Sound,\nRefined.",
    body: "Custom 40mm carbon-fiber drivers deliver pristine audio clarity across all frequencies.",
    progressRange: [0.48, 0.62],
    layout: "left",
    accentColor: "#00C8FF",
  },
  {
    id: "battery",
    label: "Chapter 05",
    tag: "40H Battery",
    title: "Go Further,\nFeel Less.",
    body: "Up to 40 hours of playtime. Ergonomic design crafted for all-day listening comfort.",
    progressRange: [0.65, 0.78],
    layout: "right",
    accentColor: "#ffffff",
  },
  {
    id: "cta",
    label: "Chapter 06",
    tag: "WH-1000XM6",
    title: "Experience\nthe Extraordinary.",
    body: "The most complete noise-cancelling headphones we've ever made.",
    progressRange: [0.85, 1.0],
    layout: "center",
    accentColor: "#00C8FF",
  },
];

/* ------------------------------------------------------------------ */
/*  FloatingCopy - chapter text overlay                                */
/* ------------------------------------------------------------------ */

interface FloatingCopyProps {
  chapter: Chapter;
  scrollYProgress: MotionValue<number>;
}

export function FloatingCopy({ chapter, scrollYProgress }: FloatingCopyProps) {
  const rangeStart = chapter.progressRange[0];
  const rangeEnd   = chapter.progressRange[1];
  const span       = rangeEnd - rangeStart;

  // Fade-in and fade-out durations as a fraction of the chapter span.
  // Cap at 35% of span so they never overlap each other.
  const fadeIn  = Math.min(0.04, span * 0.25);
  const fadeOut = Math.min(0.04, span * 0.25);

  // Guaranteed monotonically increasing keyframes
  const p0 = rangeStart;
  const p1 = rangeStart + fadeIn;
  const p2 = Math.max(p1 + 0.001, rangeEnd - fadeOut);  // hold start
  const p3 = Math.max(p2 + 0.001, rangeEnd);             // hold end / fade-out end

  const opacity = useTransform(
    scrollYProgress,
    [p0, p1, p2, p3],
    [0,  1,  1,  0],
    { clamp: true }
  );
  const y = useTransform(
    scrollYProgress,
    [p0, p1, p2, p3],
    [24, 0,  0, -16],
    { clamp: true }
  );

  const isLeft = chapter.layout === "left";
  const isRight = chapter.layout === "right";
  const isCenter = chapter.layout === "center";
  const isBottom = chapter.layout === "bottom";

  const positionClass =
    isLeft
      ? "left-5 md:left-10 xl:left-16 top-1/2 -translate-y-1/2 max-w-[280px] sm:max-w-xs xl:max-w-md items-start text-left"
      : isRight
      ? "right-5 md:right-10 xl:right-16 top-1/2 -translate-y-1/2 max-w-[280px] sm:max-w-xs xl:max-w-md items-end text-right"
      : isBottom
      ? "bottom-24 md:bottom-28 left-1/2 -translate-x-1/2 max-w-sm md:max-w-lg items-center text-center w-[90vw]"
      : "left-1/2 -translate-x-1/2 top-1/2 -translate-y-1/2 max-w-lg md:max-w-2xl items-center text-center w-[90vw]";

  return (
    <motion.div
      className={`absolute flex flex-col gap-3 pointer-events-none z-30 ${positionClass}`}
      style={{ opacity, y }}
    >
      {chapter.tag && (
        <span className="chapter-label">{chapter.tag}</span>
      )}

      <h2
        className="text-gradient-white font-bold tracking-tight leading-[1.0]"
        style={{
          whiteSpace: "pre-line",
          fontSize: isCenter
            ? "clamp(2rem, 6vw, 5rem)"
            : "clamp(1.6rem, 3.5vw, 3.2rem)",
        }}
      >
        {chapter.title}
      </h2>

      {chapter.body && (
        <p
          className="text-sm md:text-base leading-relaxed"
          style={{ color: "rgba(255,255,255,0.55)" }}
        >
          {chapter.body}
        </p>
      )}

      {/* Accent underline */}
      <div
        className="w-7 h-[1.5px] rounded-full mt-0.5"
        style={{
          background: chapter.accentColor ?? "var(--sony-cyan)",
          boxShadow: `0 0 8px ${chapter.accentColor ?? "var(--sony-cyan)"}`,
          alignSelf: isRight ? "flex-end" : isCenter ? "center" : "flex-start",
        }}
      />
    </motion.div>
  );
}

/* ------------------------------------------------------------------ */
/*  ChapterController - renders all chapters                           */
/* ------------------------------------------------------------------ */

interface ChapterControllerProps {
  scrollYProgress: MotionValue<number>;
  currentProgress: number;
  isMobile: boolean;
}

export function ChapterController({
  scrollYProgress,
  currentProgress,
  isMobile,
}: ChapterControllerProps) {
  // On mobile, collapse left/right to bottom
  const adaptedChapters = CHAPTERS.map((ch) =>
    isMobile && (ch.layout === "left" || ch.layout === "right")
      ? { ...ch, layout: "bottom" as const }
      : ch
  );

  return (
    <>
      {adaptedChapters.map((chapter) => {
        const [start, end] = chapter.progressRange;
        const isVisible =
          currentProgress >= start - 0.06 && currentProgress <= end + 0.06;
        return isVisible ? (
          <FloatingCopy
            key={chapter.id}
            chapter={chapter}
            scrollYProgress={scrollYProgress}
          />
        ) : null;
      })}
    </>
  );
}
