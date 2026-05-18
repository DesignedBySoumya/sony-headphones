"use client";

import React, { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface GlassFeatureCardProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  subtitle: string;
  description: string;
  stats?: { label: string; value: string }[];
  accentColor?: string;
  icon?: React.ReactNode;
}

export function GlassFeatureCard({
  isOpen,
  onClose,
  title,
  subtitle,
  description,
  stats,
  accentColor = "#00C8FF",
  icon,
}: GlassFeatureCardProps) {
  // Close on Escape
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [onClose]);

  // Prevent body scroll when open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => { document.body.style.overflow = ""; };
  }, [isOpen]);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            key="backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="fixed inset-0 z-[150] bg-black/60"
            style={{ backdropFilter: "blur(4px)" }}
            onClick={onClose}
          />

          {/* Card */}
          <motion.div
            key="card"
            initial={{ opacity: 0, scale: 0.92, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 10 }}
            transition={{ duration: 0.35, ease: [0.175, 0.885, 0.32, 1.275] }}
            className="fixed z-[160] inset-0 flex items-center justify-center p-4 md:p-8 pointer-events-none"
          >
            <div
              className="glass-card pointer-events-auto w-full max-w-md relative overflow-hidden"
              style={{ padding: "clamp(1.5rem, 4vw, 2.5rem)" }}
            >
              {/* Accent glow */}
              <div
                className="absolute -top-16 -left-16 w-48 h-48 rounded-full opacity-20 pointer-events-none"
                style={{
                  background: `radial-gradient(circle, ${accentColor} 0%, transparent 70%)`,
                  filter: "blur(20px)",
                }}
              />

              {/* Header */}
              <div className="flex items-start justify-between mb-6 relative z-10">
                <div className="flex items-center gap-3">
                  {icon && (
                    <div
                      className="w-11 h-11 rounded-2xl flex items-center justify-center flex-shrink-0"
                      style={{
                        background: `linear-gradient(135deg, ${accentColor}22, ${accentColor}11)`,
                        border: `1px solid ${accentColor}33`,
                      }}
                    >
                      <span style={{ color: accentColor }}>{icon}</span>
                    </div>
                  )}
                  <div>
                    <p className="label mb-0.5">{subtitle}</p>
                    <h3
                      className="text-xl font-bold tracking-tight text-white"
                    >
                      {title}
                    </h3>
                  </div>
                </div>

                <button
                  onClick={onClose}
                  className="btn-icon flex-shrink-0 ml-4"
                  aria-label="Close"
                >
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                    <path d="M12 4L4 12M4 4l8 8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                  </svg>
                </button>
              </div>

              {/* Divider */}
              <div className="line-horizontal mb-5 relative z-10" />

              {/* Description */}
              <p className="text-body-large mb-6 relative z-10 leading-relaxed">
                {description}
              </p>

              {/* Stats grid */}
              {stats && stats.length > 0 && (
                <div
                  className="grid gap-3 relative z-10"
                  style={{ gridTemplateColumns: `repeat(${Math.min(stats.length, 3)}, 1fr)` }}
                >
                  {stats.map((stat, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, y: 12 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.1 + i * 0.06 }}
                      className="glass-sm p-3 flex flex-col gap-1"
                    >
                      <span
                        className="text-xl font-bold tracking-tight"
                        style={{ color: accentColor }}
                      >
                        {stat.value}
                      </span>
                      <span className="label">{stat.label}</span>
                    </motion.div>
                  ))}
                </div>
              )}

              {/* Bottom accent line */}
              <div
                className="absolute bottom-0 left-0 right-0 h-[1.5px] opacity-60"
                style={{
                  background: `linear-gradient(90deg, transparent, ${accentColor}, transparent)`,
                }}
              />
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

/* ------------------------------------------------------------------ */
/*  Feature Hotspot Marker                                             */
/* ------------------------------------------------------------------ */

interface FeatureHotspotProps {
  x: string; // CSS left value e.g. "42%"
  y: string; // CSS top value e.g. "38%"
  label: string;
  onClick: () => void;
  visible?: boolean;
  index?: number;
}

export function FeatureHotspot({
  x,
  y,
  label,
  onClick,
  visible = true,
  index = 0,
}: FeatureHotspotProps) {
  const [hovered, setHovered] = useState(false);

  return (
    <AnimatePresence>
      {visible && (
        <motion.button
          key="hotspot"
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0 }}
          transition={{ delay: index * 0.1, duration: 0.4, ease: [0.175, 0.885, 0.32, 1.275] }}
          className="hotspot"
          style={{ left: x, top: y, transform: "translate(-50%, -50%)" }}
          aria-label={`Explore: ${label}`}
          onClick={onClick}
          onMouseEnter={() => setHovered(true)}
          onMouseLeave={() => setHovered(false)}
        >
          {/* Outer pulse ring */}
          <div className="hotspot-ring" />
          {/* Center dot */}
          <div className="hotspot-dot" />

          {/* Label tooltip */}
          <AnimatePresence>
            {hovered && (
              <motion.div
                initial={{ opacity: 0, x: -4, scale: 0.95 }}
                animate={{ opacity: 1, x: 0, scale: 1 }}
                exit={{ opacity: 0, x: -4, scale: 0.95 }}
                transition={{ duration: 0.15 }}
                className="absolute left-8 top-1/2 -translate-y-1/2 glass-sm px-3 py-1.5 whitespace-nowrap pointer-events-none"
              >
                <span className="text-xs font-semibold text-white/90 tracking-tight">
                  {label}
                </span>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.button>
      )}
    </AnimatePresence>
  );
}
