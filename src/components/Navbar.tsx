"use client";

import React, { useState } from "react";
import { motion, useScroll, useMotionValueEvent } from "framer-motion";
import { Headphones, Search, Menu } from "lucide-react";

export default function Navbar() {
  const { scrollY } = useScroll();
  const [hidden, setHidden] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useMotionValueEvent(scrollY, "change", (latest) => {
    const previous = scrollY.getPrevious() ?? 0;
    if (latest > previous && latest > 150) {
      setHidden(true);
    } else {
      setHidden(false);
    }
    
    if (latest > 50) {
      setIsScrolled(true);
    } else {
      setIsScrolled(false);
    }
  });

  return (
    <motion.nav
      variants={{
        visible: { y: 0 },
        hidden: { y: "-100%" },
      }}
      animate={hidden ? "hidden" : "visible"}
      transition={{ duration: 0.35, ease: "easeInOut" }}
      className={`fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 py-4 md:px-12 md:py-6 transition-all duration-300 ${
        isScrolled
          ? "bg-[#050505]/70 backdrop-blur-md border-b border-white/5"
          : "bg-transparent"
      }`}
    >
      <div className="flex items-center gap-2">
        <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center">
          <Headphones className="w-5 h-5 text-black" />
        </div>
        <span className="font-semibold tracking-tight text-lg text-white">
          SONY
        </span>
      </div>

      <div className="hidden md:flex items-center gap-8 text-sm font-medium text-white/70">
        <a href="#" className="hover:text-white transition-colors">Overview</a>
        <a href="#" className="hover:text-white transition-colors">Tech Specs</a>
        <a href="#" className="hover:text-white transition-colors">Compare</a>
        <a href="#" className="hover:text-white transition-colors">Gallery</a>
      </div>

      <div className="flex items-center gap-4">
        <button className="text-white/70 hover:text-white transition-colors">
          <Search className="w-5 h-5" />
        </button>
        <button className="hidden md:block bg-white text-black px-4 py-2 rounded-full text-sm font-semibold hover:bg-white/90 transition-colors">
          Buy Now
        </button>
        <button className="md:hidden text-white/70 hover:text-white transition-colors">
          <Menu className="w-6 h-6" />
        </button>
      </div>
    </motion.nav>
  );
}
