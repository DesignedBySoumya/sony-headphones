"use client";

import React, { useState } from "react";
import { motion, useScroll, useMotionValueEvent, AnimatePresence } from "framer-motion";
import { Headphones, ShoppingCart, Menu, X, Search } from "lucide-react";

const NAV_LINKS = [
  { label: "Overview", href: "#overview" },
  { label: "Tech Specs", href: "#specs-section" },
  { label: "Features", href: "#features" },
  { label: "Compare", href: "#compare" },
];

export default function Navbar() {
  const { scrollY } = useScroll();
  const [hidden, setHidden] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useMotionValueEvent(scrollY, "change", (latest) => {
    const previous = scrollY.getPrevious() ?? 0;
    if (latest > previous && latest > 200) {
      setHidden(true);
      setMobileOpen(false);
    } else {
      setHidden(false);
    }
    setIsScrolled(latest > 60);
  });

  return (
    <>
      <motion.header
        variants={{ visible: { y: 0 }, hidden: { y: "-100%" } }}
        animate={hidden ? "hidden" : "visible"}
        transition={{ duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] }}
        className="fixed top-0 left-0 right-0 z-[90] flex flex-col"
      >
        <nav
          className={`flex items-center justify-between transition-all duration-500 ${
            isScrolled
              ? "px-5 md:px-10 xl:px-16 py-3 md:py-4 bg-[rgba(5,5,5,0.75)] backdrop-blur-2xl border-b border-white/[0.06]"
              : "px-5 md:px-10 xl:px-16 py-5 md:py-6 bg-transparent"
          }`}
        >
          {/* Logo */}
          <motion.a
            href="/"
            className="flex items-center gap-2.5 z-10"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center shadow-lg">
              <Headphones className="w-4 h-4 text-black" strokeWidth={2.5} />
            </div>
            <span className="font-bold tracking-tight text-base md:text-lg text-white">
              SONY
              <span className="font-light text-white/50 ml-1 text-sm hidden sm:inline">
                WH-1000XM6
              </span>
            </span>
          </motion.a>

          {/* Desktop nav links */}
          <ul className="hidden lg:flex items-center gap-1">
            {NAV_LINKS.map((link) => (
              <li key={link.label}>
                <a
                  href={link.href}
                  className="px-4 py-2 text-sm font-medium text-white/55 hover:text-white transition-colors duration-200 rounded-full hover:bg-white/5"
                >
                  {link.label}
                </a>
              </li>
            ))}
          </ul>

          {/* Right actions */}
          <div className="flex items-center gap-2 md:gap-3">
            <button className="btn-icon hidden md:flex" aria-label="Search">
              <Search className="w-4 h-4" />
            </button>

            {/* Desktop Buy */}
            <motion.a
              href="https://www.sony.com"
              target="_blank"
              rel="noopener noreferrer"
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              className="btn-primary hidden md:inline-flex py-2.5 px-5 text-sm"
            >
              <ShoppingCart className="w-3.5 h-3.5" />
              Buy Now
            </motion.a>

            {/* Mobile menu toggle */}
            <button
              className="btn-icon lg:hidden"
              onClick={() => setMobileOpen((p) => !p)}
              aria-label={mobileOpen ? "Close menu" : "Open menu"}
            >
              <AnimatePresence mode="wait" initial={false}>
                {mobileOpen ? (
                  <motion.span
                    key="x"
                    initial={{ rotate: -90, opacity: 0 }}
                    animate={{ rotate: 0, opacity: 1 }}
                    exit={{ rotate: 90, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <X className="w-4 h-4" />
                  </motion.span>
                ) : (
                  <motion.span
                    key="menu"
                    initial={{ rotate: 90, opacity: 0 }}
                    animate={{ rotate: 0, opacity: 1 }}
                    exit={{ rotate: -90, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <Menu className="w-4 h-4" />
                  </motion.span>
                )}
              </AnimatePresence>
            </button>
          </div>
        </nav>

        {/* Mobile drawer */}
        <AnimatePresence>
          {mobileOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3, ease: [0.25, 0.46, 0.45, 0.94] }}
              className="overflow-hidden lg:hidden bg-[rgba(5,5,5,0.92)] backdrop-blur-2xl border-b border-white/[0.06]"
            >
              <div className="flex flex-col px-5 pb-6 pt-2 gap-1">
                {NAV_LINKS.map((link, i) => (
                  <motion.a
                    key={link.label}
                    href={link.href}
                    initial={{ opacity: 0, x: -12 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.05, duration: 0.3 }}
                    className="px-4 py-3.5 text-base font-medium text-white/70 hover:text-white border-b border-white/[0.05] last:border-0 transition-colors"
                    onClick={() => setMobileOpen(false)}
                  >
                    {link.label}
                  </motion.a>
                ))}
                <motion.a
                  href="https://www.sony.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className="btn-primary mt-3 justify-center text-sm"
                  onClick={() => setMobileOpen(false)}
                >
                  <ShoppingCart className="w-4 h-4" />
                  Buy Now
                </motion.a>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.header>
    </>
  );
}
