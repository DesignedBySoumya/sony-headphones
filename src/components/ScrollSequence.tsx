"use client";

import React, { useRef, useEffect, useState } from "react";
import { useScroll, useTransform, motion, useMotionValueEvent } from "framer-motion";

const FRAME_COUNT = 240;

const ScrollSequence = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  // Track loaded images for canvas
  const [images, setImages] = useState<HTMLImageElement[]>([]);
  const [loaded, setLoaded] = useState(0);

  // Scroll tracking
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  // Smooth frame index
  const frameIndex = useTransform(scrollYProgress, [0, 1], [1, FRAME_COUNT]);
  const [currentFrame, setCurrentFrame] = useState(1);

  // Preload images
  useEffect(() => {
    const loadedImages: HTMLImageElement[] = [];
    let loadCount = 0;

    for (let i = 1; i <= FRAME_COUNT; i++) {
      const img = new Image();
      // zero pad the index to 3 digits
      const paddedIndex = i.toString().padStart(3, '0');
      img.src = `/images/ezgif-frame-${paddedIndex}.jpg`;
      img.onload = () => {
        loadCount++;
        setLoaded(loadCount);
      };
      loadedImages.push(img);
    }
    setImages(loadedImages);
  }, []);

  // Sync state with motion value
  useMotionValueEvent(frameIndex, "change", (latest) => {
    setCurrentFrame(Math.floor(latest));
  });

  // Render canvas
  useEffect(() => {
    if (!canvasRef.current || images.length < FRAME_COUNT || loaded < FRAME_COUNT * 0.2) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Handle high DPI displays
    const dpr = window.devicePixelRatio || 1;
    const rect = canvas.getBoundingClientRect();
    
    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    
    ctx.scale(dpr, dpr);

    const img = images[currentFrame - 1];
    
    if (img && img.complete) {
      // Clear canvas with deep black
      ctx.fillStyle = "#050505";
      ctx.fillRect(0, 0, rect.width, rect.height);

      // Draw image scaled to cover
      const scale = Math.max(rect.width / img.width, rect.height / img.height);
      const x = (rect.width / 2) - (img.width / 2) * scale;
      const y = (rect.height / 2) - (img.height / 2) * scale;
      
      ctx.drawImage(img, x, y, img.width * scale, img.height * scale);
    }
  }, [currentFrame, images, loaded]);

  // Handle window resize for canvas scaling
  useEffect(() => {
    const handleResize = () => {
      // Force a re-render
      setCurrentFrame(prev => prev);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Text animations based on scroll progress
  const text1Opacity = useTransform(scrollYProgress, [0, 0.05, 0.1], [0, 1, 0]);
  const text2Opacity = useTransform(scrollYProgress, [0.15, 0.25, 0.35], [0, 1, 0]);
  const text3Opacity = useTransform(scrollYProgress, [0.45, 0.55, 0.65], [0, 1, 0]);
  const text4Opacity = useTransform(scrollYProgress, [0.85, 0.9, 1], [0, 1, 1]);

  return (
    <div ref={containerRef} className="relative w-full h-[500vh] bg-[#050505]">
      {/* Sticky Canvas Container */}
      <div className="sticky top-0 w-full h-screen overflow-hidden">
        {/* Loading overlay */}
        {loaded < FRAME_COUNT && (
          <div className="absolute inset-0 z-50 flex items-center justify-center bg-[#050505] text-white">
            <div className="flex flex-col items-center gap-4">
              <div className="text-sm font-medium tracking-widest uppercase text-white/50">
                Loading Assets
              </div>
              <div className="w-48 h-1 bg-white/10 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-white transition-all duration-300"
                  style={{ width: `${(loaded / FRAME_COUNT) * 100}%` }}
                />
              </div>
            </div>
          </div>
        )}

        <canvas
          ref={canvasRef}
          className="absolute inset-0 w-full h-full object-cover"
        />

        {/* Cinematic Overlays */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-transparent to-[#050505] opacity-50 pointer-events-none" />

        {/* Text Segments */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <motion.div 
            style={{ opacity: text1Opacity }}
            className="absolute flex flex-col items-center text-center mt-[30vh]"
          >
            <h2 className="text-4xl md:text-6xl font-bold tracking-tighter text-white mb-4">
              Engineered for Silence.
            </h2>
            <p className="text-lg md:text-xl text-white/70 max-w-lg">
              The new WH-1000XM6 delivers unparalleled noise cancellation.
            </p>
          </motion.div>

          <motion.div 
            style={{ opacity: text2Opacity }}
            className="absolute flex flex-col items-start w-full max-w-6xl px-8 mt-[-10vh]"
          >
            <h2 className="text-3xl md:text-5xl font-bold tracking-tighter text-white mb-2">
              Acoustic Architecture
            </h2>
            <p className="text-lg text-white/70 max-w-md">
              Custom 40mm drivers deliver pristine audio with exceptional clarity across all frequencies.
            </p>
          </motion.div>

          <motion.div 
            style={{ opacity: text3Opacity }}
            className="absolute flex flex-col items-end text-right w-full max-w-6xl px-8 mt-[10vh]"
          >
            <h2 className="text-3xl md:text-5xl font-bold tracking-tighter text-[#00D6FF] mb-2 drop-shadow-[0_0_15px_rgba(0,214,255,0.5)]">
              Next-Gen Processing
            </h2>
            <p className="text-lg text-white/70 max-w-md">
              Dual V1 processors analyze environmental noise millions of times per second.
            </p>
          </motion.div>

          <motion.div 
            style={{ opacity: text4Opacity }}
            className="absolute flex flex-col items-center text-center mt-[35vh]"
          >
            <h2 className="text-5xl md:text-7xl font-bold tracking-tighter text-white mb-6">
              WH-1000XM6
            </h2>
            <button className="bg-white text-black px-8 py-4 rounded-full font-semibold hover:bg-gray-200 transition-colors pointer-events-auto">
              Pre-order Now
            </button>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default ScrollSequence;
