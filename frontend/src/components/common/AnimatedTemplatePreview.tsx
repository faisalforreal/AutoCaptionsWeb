import React, { useRef, useEffect, useState } from 'react';
import { Loader2 } from 'lucide-react';
import { TemplateConfig, Word } from '../../types';
import { renderSubtitlesOnCanvas } from '../../engine/subtitleCanvasRenderer';

interface AnimatedTemplatePreviewProps {
  preset: TemplateConfig;
  isHovered: boolean;
  className?: string;
}

const SAMPLE_WORDS: Word[] = [
  { start: 0.05, end: 0.50, word: 'THIS', punctuated_word: 'THIS' },
  { start: 0.55, end: 1.05, word: 'GOES', punctuated_word: 'GOES' },
  { start: 1.10, end: 1.75, word: 'VIRAL', punctuated_word: 'VIRAL', highlight: true, emoji: '🔥' },
];

export const AnimatedTemplatePreview: React.FC<AnimatedTemplatePreviewProps> = ({
  preset,
  isHovered,
  className = ''
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animRef = useRef<number | null>(null);
  const [isInView, setIsInView] = useState(false);
  const [isRendered, setIsRendered] = useState(false);

  // Lazy loading observer: only render the preview canvas when visible or near viewport
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    if (!('IntersectionObserver' in window)) {
      setIsInView(true);
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;
        if (entry.isIntersecting) {
          setIsInView(true);
          observer.disconnect();
        }
      },
      { rootMargin: '250px' }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  // Force render if hovered immediately
  useEffect(() => {
    if (isHovered && !isInView) {
      setIsInView(true);
    }
  }, [isHovered, isInView]);

  useEffect(() => {
    if (!isInView) return;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Use high DPI 2x backing store for crisp canvas rendering
    const width = 400;
    const height = 240;
    canvas.width = width;
    canvas.height = height;

    const renderFrame = (currentTime: number) => {
      ctx.clearRect(0, 0, width, height);

      // Studio dark background gradient
      const bgGrad = ctx.createLinearGradient(0, 0, 0, height);
      bgGrad.addColorStop(0, '#101022');
      bgGrad.addColorStop(1, '#090914');
      ctx.fillStyle = bgGrad;
      ctx.fillRect(0, 0, width, height);

      // Subtle ambient circle glow behind text
      ctx.save();
      const circleGrad = ctx.createRadialGradient(width / 2, height / 2, 0, width / 2, height / 2, width * 0.45);
      circleGrad.addColorStop(0, 'rgba(124, 58, 237, 0.12)');
      circleGrad.addColorStop(1, 'rgba(0, 0, 0, 0)');
      ctx.fillStyle = circleGrad;
      ctx.fillRect(0, 0, width, height);
      ctx.restore();

      renderSubtitlesOnCanvas({
        ctx,
        canvasWidth: width,
        canvasHeight: height,
        currentTime,
        words: SAMPLE_WORDS,
        config: {
          ...preset,
          sizes: {
            ...preset.sizes,
            fontSize: preset.modes.displayMode === 'WORD' ? 48 : 38,
            posY: 50 // perfectly centered in the preview card
          }
        }
      });
    };

    if (!isHovered) {
      // Idle state: show active highlight word at t = 1.35s
      const rafId = requestAnimationFrame(() => {
        renderFrame(1.35);
        setIsRendered(true);
      });

      // If custom web fonts finish loading, redraw smoothly
      if (typeof document !== 'undefined' && document.fonts) {
        document.fonts.ready.then(() => {
          renderFrame(1.35);
        }).catch(() => {});
      }

      return () => cancelAnimationFrame(rafId);
    }

    // Active hover state: run 60fps loop over 2.2s cycle
    setIsRendered(true);
    let startTime: number | null = null;
    const loopDuration = 2200;

    const loop = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const elapsed = (timestamp - startTime) % loopDuration;
      // Map 0 -> 2200ms to 0 -> 1.85s time in subtitles
      const currentTime = (elapsed / loopDuration) * 1.85;

      renderFrame(currentTime);
      animRef.current = requestAnimationFrame(loop);
    };

    animRef.current = requestAnimationFrame(loop);

    return () => {
      if (animRef.current) {
        cancelAnimationFrame(animRef.current);
      }
    };
  }, [isInView, isHovered, preset]);

  return (
    <div
      ref={containerRef}
      className={`relative w-full h-full flex items-center justify-center overflow-hidden bg-[#090914] ${className}`}
    >
      {/* Loading Skeleton & Spinner when not yet drawn */}
      {!isRendered && (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-[#0d0d1e] z-10 transition-opacity duration-300">
          <Loader2 className="w-4 h-4 text-purple-400 animate-spin" />
          <span className="text-[9px] text-[#707088] mt-1 font-medium tracking-wide">
            Loading...
          </span>
        </div>
      )}

      {/* High-Resolution Preview Canvas */}
      <canvas
        ref={canvasRef}
        className={`w-full h-full object-contain pointer-events-none transition-opacity duration-300 ${
          isRendered ? 'opacity-100' : 'opacity-0'
        }`}
      />
    </div>
  );
};
