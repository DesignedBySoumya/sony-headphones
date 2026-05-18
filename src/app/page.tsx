import dynamic from "next/dynamic";
import Navbar from "@/components/Navbar";
import ProgressIndicator from "@/components/ProgressIndicator";

// Dynamically import heavy canvas component (SSR off)
const ScrollCanvasSequence = dynamic(
  () => import("@/components/ScrollCanvasSequence"),
  { ssr: false }
);

/* ── Spec data ─────────────────────────────────────────────────────── */

const SPECS = [
  { category: "Audio", rows: [
    { label: "Driver Unit", value: "40mm, Carbon Fiber Composite" },
    { label: "Frequency Response", value: "4 Hz – 40,000 Hz" },
    { label: "Sensitivity", value: "105 dB/mW" },
    { label: "Impedance", value: "48 Ω (1kHz)" },
  ]},
  { category: "Noise Cancellation", rows: [
    { label: "Processor", value: "Dual Integrated Processor V2" },
    { label: "Microphone Array", value: "4 × Beamforming Mics" },
    { label: "ANC Range", value: "Up to −35 dB" },
    { label: "Speak-to-Chat", value: "Auto-detect conversation" },
  ]},
  { category: "Connectivity", rows: [
    { label: "Bluetooth", value: "5.3 Multipoint (2 devices)" },
    { label: "Codec Support", value: "LDAC · AAC · SBC" },
    { label: "NFC", value: "One-touch pairing" },
    { label: "3.5mm", value: "Analog audio cable" },
  ]},
  { category: "Battery & Build", rows: [
    { label: "Battery Life (ANC on)", value: "40 hours" },
    { label: "Quick Charge", value: "3 min → 60 min playback" },
    { label: "Weight", value: "250 g" },
    { label: "Colours", value: "Midnight Black · Platinum Silver" },
  ]},
];

/* ── Feature highlight cards ───────────────────────────────────────── */

const HIGHLIGHTS = [
  {
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="3"/><path d="M12 1v4M12 19v4M4.22 4.22l2.83 2.83M16.95 16.95l2.83 2.83M1 12h4M19 12h4M4.22 19.78l2.83-2.83M16.95 7.05l2.83-2.83"/>
      </svg>
    ),
    title: "Dual Processor V2",
    body: "Industry-leading noise cancellation that adapts in real time to your environment.",
    stat: "−35dB",
    accentColor: "#7B61FF",
  },
  {
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M9 18V5l12-2v13"/><circle cx="6" cy="18" r="3"/><circle cx="18" cy="16" r="3"/>
      </svg>
    ),
    title: "40mm Carbon Drivers",
    body: "Hi-Res Audio certified with pristine clarity across every frequency.",
    stat: "Hi-Res",
    accentColor: "#00C8FF",
  },
  {
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2"/>
        <line x1="12" y1="12" x2="12" y2="16"/><line x1="10" y1="14" x2="14" y2="14"/>
      </svg>
    ),
    title: "40-Hour Battery",
    body: "Full-day listening with Quick Charge — 3 minutes gives you an hour of play.",
    stat: "40H",
    accentColor: "#ffffff",
  },
  {
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M3 18v-6a9 9 0 0 1 18 0v6"/><path d="M21 19a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2h3zM3 19a2 2 0 0 0 2 2h1a2 2 0 0 0 2-2v-3a2 2 0 0 0-2-2H3z"/>
      </svg>
    ),
    title: "Multipoint Connect",
    body: "Stay connected to two devices simultaneously and switch between them instantly.",
    stat: "2× BT",
    accentColor: "#00C8FF",
  },
];

/* ── Page ──────────────────────────────────────────────────────────── */

export default function Home() {
  return (
    <main className="min-h-screen bg-[#050505] text-white selection:bg-[#0050FF] selection:text-white">
      <Navbar />
      <ProgressIndicator />

      {/* ── SCROLL CANVAS SEQUENCE ───────────────────────────────── */}
      <section id="overview" aria-label="Product cinematic experience">
        <ScrollCanvasSequence />
      </section>

      {/* ── FEATURE HIGHLIGHTS GRID ─────────────────────────────── */}
      <section
        id="features"
        className="relative bg-[#050505] py-24 md:py-32 px-5 md:px-10 xl:px-20 overflow-hidden"
        aria-label="Key features"
      >
        {/* Background glow */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              "radial-gradient(ellipse 70% 50% at 50% 0%, rgba(0,80,255,0.06) 0%, transparent 70%)",
          }}
        />

        <div className="max-w-7xl mx-auto relative z-10">
          {/* Header */}
          <div className="flex flex-col items-center text-center mb-16 md:mb-20">
            <span className="chapter-label mb-4">Why WH-1000XM6</span>
            <h2 className="text-headline text-gradient-white mb-4">
              Every detail, perfected.
            </h2>
            <p className="text-body-large max-w-lg">
              Six generations of relentless refinement — this is the most complete
              listening experience Sony has ever created.
            </p>
          </div>

          {/* Highlight cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 md:gap-5">
            {HIGHLIGHTS.map((h, i) => (
              <div
                key={i}
                className="glass-card p-6 md:p-7 flex flex-col gap-4 group hover:bg-white/[0.06] transition-colors duration-300 relative overflow-hidden"
              >
                {/* Accent glow on hover */}
                <div
                  className="absolute -top-8 -right-8 w-24 h-24 rounded-full opacity-0 group-hover:opacity-30 transition-opacity duration-500 pointer-events-none"
                  style={{
                    background: `radial-gradient(circle, ${h.accentColor}, transparent 70%)`,
                    filter: "blur(10px)",
                  }}
                />

                {/* Icon */}
                <div
                  className="w-11 h-11 rounded-2xl flex items-center justify-center flex-shrink-0"
                  style={{
                    background: `linear-gradient(135deg, ${h.accentColor}18, ${h.accentColor}08)`,
                    border: `1px solid ${h.accentColor}25`,
                    color: h.accentColor,
                  }}
                >
                  {h.icon}
                </div>

                {/* Stat badge */}
                <div className="flex items-center justify-between">
                  <h3 className="text-base md:text-lg font-semibold tracking-tight text-white">
                    {h.title}
                  </h3>
                  <span
                    className="text-sm font-bold ml-2 flex-shrink-0"
                    style={{ color: h.accentColor }}
                  >
                    {h.stat}
                  </span>
                </div>

                <p className="text-body-large text-sm leading-relaxed">{h.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── SPECS SECTION ───────────────────────────────────────── */}
      <section
        id="specs-section"
        className="relative bg-[#050505] py-24 md:py-32 px-5 md:px-10 xl:px-20 border-t border-white/[0.04]"
        aria-label="Technical specifications"
      >
        <div className="max-w-5xl mx-auto">
          {/* Header */}
          <div className="flex flex-col items-center text-center mb-14 md:mb-20">
            <span className="chapter-label mb-4">Tech Specs</span>
            <h2 className="text-headline text-gradient-white">
              Built without compromise.
            </h2>
          </div>

          {/* Spec groups */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
            {SPECS.map((group) => (
              <div key={group.category} className="glass-card p-6 md:p-8">
                <p
                  className="label mb-4 pb-3 border-b"
                  style={{ color: "var(--sony-cyan)", borderColor: "rgba(255,255,255,0.06)" }}
                >
                  {group.category}
                </p>
                <div>
                  {group.rows.map((row, i) => (
                    <div key={i} className="spec-row">
                      <span className="text-sm text-white/45 font-medium">{row.label}</span>
                      <span className="text-sm text-white/85 font-medium text-right ml-4">
                        {row.value}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* Compare CTA */}
          <div className="flex justify-center mt-10 md:mt-14">
            <a
              href="https://www.sony.com/en/headphones"
              target="_blank"
              rel="noopener noreferrer"
              className="btn-ghost"
            >
              View Full Specifications
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M5 12h14M12 5l7 7-7 7"/>
              </svg>
            </a>
          </div>
        </div>
      </section>

      {/* ── FINAL CTA SECTION ────────────────────────────────────── */}
      <section
        className="relative bg-[#050505] py-28 md:py-40 px-5 overflow-hidden border-t border-white/[0.04]"
        aria-label="Call to action"
      >
        {/* Glow */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              "radial-gradient(ellipse 60% 60% at 50% 50%, rgba(0,80,255,0.1) 0%, rgba(123,97,255,0.05) 40%, transparent 70%)",
          }}
        />

        {/* Thin decorative lines */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-px h-16 line-vertical" />

        <div className="max-w-3xl mx-auto flex flex-col items-center text-center relative z-10">
          <span className="chapter-label mb-6">Available Now</span>
          <h2 className="text-display text-gradient-white mb-6">
            WH-1000XM6
          </h2>
          <p className="text-body-large text-lg mb-10 max-w-md">
            The most advanced noise-cancelling headphones ever created.
            Your world, on your terms.
          </p>

          <div className="flex flex-col sm:flex-row items-center gap-4">
            <a
              href="https://www.sony.com"
              target="_blank"
              rel="noopener noreferrer"
              className="btn-primary text-base px-8 py-4"
            >
              Pre-order Now
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M5 12h14M12 5l7 7-7 7"/>
              </svg>
            </a>
            <a
              href="#specs-section"
              className="btn-ghost text-base px-8 py-4"
            >
              View Specs
            </a>
          </div>

          <p className="mt-8 text-xs text-white/20 font-medium tracking-wider">
            STARTING FROM $349 · FREE SHIPPING · 30-DAY RETURNS
          </p>
        </div>

        {/* Bottom line */}
        <div className="absolute bottom-0 left-0 right-0 h-px line-horizontal" />
      </section>

      {/* ── FOOTER ──────────────────────────────────────────────── */}
      <footer className="bg-[#050505] border-t border-white/[0.04] px-5 md:px-10 xl:px-20 py-10">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-full bg-white flex items-center justify-center">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="black" strokeWidth="2.5">
                <path d="M3 18v-6a9 9 0 0 1 18 0v6"/><path d="M21 19a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2h3zM3 19a2 2 0 0 0 2 2h1a2 2 0 0 0 2-2v-3a2 2 0 0 0-2-2H3z"/>
              </svg>
            </div>
            <span className="text-sm font-semibold text-white/60">Sony Electronics</span>
          </div>

          <p className="text-xs text-white/20 text-center">
            © 2025 Sony Group Corporation. All rights reserved.
            <br className="sm:hidden" />
            {" "}Product images and animations are for demonstration purposes only.
          </p>

          <div className="flex items-center gap-5">
            {["Privacy", "Terms", "Accessibility"].map((l) => (
              <a
                key={l}
                href="#"
                className="text-xs text-white/25 hover:text-white/60 transition-colors"
              >
                {l}
              </a>
            ))}
          </div>
        </div>
      </footer>
    </main>
  );
}
