import React, { useState, useRef, useEffect } from 'react';
import { Play, Heart, MessageCircle, Bookmark, Share2, Music } from 'lucide-react';

export const BeforeAfterSlider: React.FC = () => {
  const [sliderPosition, setSliderPosition] = useState<number>(50);
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [hasUserInteracted, setHasUserInteracted] = useState<boolean>(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const animFrameRef = useRef<number | null>(null);

  // Auto-slide animation on page load (slides left & right once to showcase the effect)
  useEffect(() => {
    let startTime: number | null = null;
    const duration = 2200; // 2.2 seconds

    const animateSlider = (time: number) => {
      if (hasUserInteracted) return;
      if (!startTime) startTime = time;
      const elapsed = time - startTime;
      const progress = Math.min(1, elapsed / duration);

      // Smooth sine wave swing all the way across: 50 -> 0 -> 100 -> 50
      // sin(0) = 0, sin(pi/2) = 1, sin(3pi/2) = -1, sin(2pi) = 0
      const swing = Math.sin(progress * Math.PI * 2) * 50;
      setSliderPosition(Math.max(0, Math.min(100, 50 - swing)));

      if (progress < 1 && !hasUserInteracted) {
        animFrameRef.current = requestAnimationFrame(animateSlider);
      } else {
        setSliderPosition(50);
      }
    };

    // Brief delay before starting so user perceives the website loading
    const timer = setTimeout(() => {
      animFrameRef.current = requestAnimationFrame(animateSlider);
    }, 400);

    return () => {
      clearTimeout(timer);
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    };
  }, [hasUserInteracted]);

  const handleMove = (clientX: number) => {
    setHasUserInteracted(true);
    if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);

    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = clientX - rect.left;
    const percent = Math.max(0, Math.min(100, (x / rect.width) * 100));
    setSliderPosition(percent);
  };

  // Global pointer tracking so moving outside container never loses drag context
  useEffect(() => {
    if (!isDragging) return;

    const onPointerMove = (e: PointerEvent) => {
      handleMove(e.clientX);
    };

    const onPointerUp = () => {
      setIsDragging(false);
    };

    window.addEventListener('pointermove', onPointerMove);
    window.addEventListener('pointerup', onPointerUp);
    window.addEventListener('pointercancel', onPointerUp);

    return () => {
      window.removeEventListener('pointermove', onPointerMove);
      window.removeEventListener('pointerup', onPointerUp);
      window.removeEventListener('pointercancel', onPointerUp);
    };
  }, [isDragging]);

  return (
    <div
      ref={containerRef}
      onPointerDown={(e) => {
        setIsDragging(true);
        handleMove(e.clientX);
        try {
          (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
        } catch {
          // Fallback if pointer capture unsupported
        }
      }}
      className="relative w-full max-w-sm sm:max-w-md mx-auto aspect-[9/16] rounded-2xl overflow-hidden border border-white/10 shadow-2xl select-none cursor-ew-resize bg-[#0d0d1a] touch-none"
    >
      {/* ============================================================== */}
      {/* 1. SHARED BASE VIDEO LAYER (100% Identical on both sides)        */}
      {/* ============================================================== */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#18112c] via-[#0f0b1f] to-[#070510] flex flex-col justify-between p-5 overflow-hidden">
        {/* Subtle background ambient studio light */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-purple-600/20 rounded-full blur-3xl pointer-events-none" />

        {/* Top Video Header */}
        <div className="relative z-10 flex items-center justify-between text-[11px] text-white/50 pt-1">
          <span className="font-semibold tracking-wide">Preview Demo</span>
          <span>0:03 / 0:15</span>
        </div>

        {/* Center Speaker / Video Mockup */}
        <div className="relative z-10 flex flex-col items-center justify-center my-auto">
          {/* Creator Avatar with Studio Mic silhouette */}
          <div className="w-24 h-24 rounded-full bg-gradient-to-tr from-purple-500/20 to-indigo-500/30 border border-white/15 flex items-center justify-center mb-6 shadow-xl relative">
            {/* Pulsing ring */}
            <div className="absolute inset-0 rounded-full border border-purple-500/40 animate-ping opacity-25" />
            <div className="w-16 h-16 rounded-full bg-purple-600/30 flex items-center justify-center">
              <Play className="w-8 h-8 text-white fill-white ml-1" />
            </div>
          </div>

          {/* Audio Waveform Bars (simulating talking creator) */}
          <div className="flex items-center gap-1 opacity-40 mb-12">
            {[18, 32, 48, 26, 56, 38, 20, 44, 28, 52, 34, 18].map((h, i) => (
              <div
                key={i}
                className="w-1 bg-purple-400 rounded-full animate-pulse"
                style={{ height: `${h}px`, animationDelay: `${i * 80}ms` }}
              />
            ))}
          </div>
        </div>

        {/* Right-Side Social Rail (TikTok/Reels UI) */}
        <div className="absolute right-3.5 bottom-20 z-10 flex flex-col items-center gap-4 text-white/70">
          <div className="flex flex-col items-center">
            <div className="w-9 h-9 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center hover:text-white">
              <Heart className="w-4 h-4 fill-white/20 text-white" />
            </div>
            <span className="text-[10px] font-bold mt-1">48.2K</span>
          </div>

          <div className="flex flex-col items-center">
            <div className="w-9 h-9 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center hover:text-white">
              <MessageCircle className="w-4 h-4 text-white" />
            </div>
            <span className="text-[10px] font-bold mt-1">1.2K</span>
          </div>

          <div className="flex flex-col items-center">
            <div className="w-9 h-9 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center hover:text-white">
              <Bookmark className="w-4 h-4 text-white" />
            </div>
            <span className="text-[10px] font-bold mt-1">9.4K</span>
          </div>

          <div className="flex flex-col items-center">
            <div className="w-9 h-9 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center hover:text-white">
              <Share2 className="w-4 h-4 text-white" />
            </div>
            <span className="text-[10px] font-bold mt-1">Share</span>
          </div>
        </div>

        {/* Bottom Video Timeline & Audio Bar */}
        <div className="relative z-10 space-y-2">
          {/* Audio track name */}
          <div className="flex items-center gap-1.5 text-[11px] text-white/70">
            <Music className="w-3 h-3 text-purple-400 animate-spin" style={{ animationDuration: '4s' }} />
            <span className="truncate max-w-[180px]">Original Audio - Viral Creator</span>
          </div>

          {/* Progress scrubber bar */}
          <div className="w-full h-1 bg-white/20 rounded-full overflow-hidden">
            <div className="h-full bg-gradient-to-r from-purple-500 to-pink-500 w-[24%]" />
          </div>
        </div>
      </div>

      {/* ============================================================== */}
      {/* 2. "BEFORE" UI BADGE (Left Side)                               */}
      {/* ============================================================== */}
      <div className="absolute top-4 left-4 z-20 pointer-events-none">
        <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full bg-black/60 text-white/80 border border-white/15 backdrop-blur-md shadow-md">
          Raw Video
        </span>
      </div>

      {/* ============================================================== */}
      {/* 3. "AFTER" OVERLAY (Captions & Badge revealed by slider position) */}
      {/* ============================================================== */}
      <div
        className="absolute inset-0 z-20 pointer-events-none overflow-hidden"
        style={{ clipPath: `inset(0 0 0 ${sliderPosition}%)` }}
      >
        {/* Top-Right "With Captions" Badge */}
        <div className="absolute top-4 right-4">
          <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full bg-purple-600 text-white border border-purple-400/40 shadow-lg shadow-purple-900/40">
            With AutoCaption
          </span>
        </div>

        {/* Hormozi / MrBeast Style Viral Captions */}
        <div className="absolute inset-x-4 top-[56%] -translate-y-1/2 flex flex-col items-center justify-center space-y-2 text-center">
          {/* Line 1 */}
          <div className="inline-block px-3.5 py-1.5 bg-black/75 rounded-xl backdrop-blur-md border border-white/10 shadow-2xl">
            <span className="font-black text-2xl sm:text-3xl tracking-tight text-white uppercase drop-shadow-[0_4px_12px_rgba(0,0,0,0.9)]">
              THIS IS HOW YOU
            </span>
          </div>

          {/* Line 2 with Bouncy Yellow Spoken Word & Emoji */}
          <div className="flex items-center justify-center gap-2">
            <span className="font-black text-3xl sm:text-4xl tracking-tight text-[#FFE600] uppercase drop-shadow-[0_6px_18px_rgba(255,230,0,0.45)] scale-110 inline-block transition-transform duration-300">
              GO VIRAL 🚀
            </span>
          </div>

          {/* Line 3 */}
          <div className="inline-block px-3 py-1 bg-black/65 rounded-lg border border-white/10">
            <span className="font-black text-base sm:text-lg text-white uppercase tracking-wider">
              IN UNDER 10 SECONDS
            </span>
          </div>
        </div>

        {/* Watch Time Retention Badge */}
        <div className="absolute bottom-6 right-6">
          <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 backdrop-blur-sm">
            +340% Watch Time
          </span>
        </div>
      </div>

      {/* ============================================================== */}
      {/* 4. DRAGGABLE SLIDER DIVIDER LINE & HANDLE                      */}
      {/* ============================================================== */}
      <div
        className="absolute top-0 bottom-0 w-0.5 bg-white cursor-ew-resize shadow-[0_0_12px_rgba(255,255,255,0.9)] z-30"
        style={{ left: `${sliderPosition}%` }}
      >
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-white text-black shadow-2xl flex items-center justify-center font-bold text-xs hover:scale-110 transition-transform">
          ⇄
        </div>
      </div>
    </div>
  );
};
