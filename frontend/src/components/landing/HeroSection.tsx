import React from 'react';
import { Sparkles, Play, CheckCircle2, Zap } from 'lucide-react';
import { AnimatedGradientText } from '../ui/animated-gradient-text';
import { ShimmerButton } from '../ui/shimmer-button';
import { BeforeAfterSlider } from './BeforeAfterSlider';

interface HeroSectionProps {
  onOpenEditor: () => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({ onOpenEditor }) => {
  return (
    <section className="relative pt-32 pb-20 md:pt-40 md:pb-28 overflow-hidden">
      {/* Background radial glow */}
      <div
        className="absolute top-0 right-1/4 w-[600px] h-[500px] pointer-events-none opacity-40 blur-3xl -z-10"
        style={{ background: 'radial-gradient(circle, rgba(124,58,237,0.35) 0%, transparent 70%)' }}
      />

      <div className="max-w-7xl mx-auto px-5 lg:px-10 grid lg:grid-cols-12 gap-12 lg:gap-8 items-center">
        {/* Left Column: Copy & Actions */}
        <div className="lg:col-span-7 flex flex-col items-start text-left">
          {/* Badge */}
          <AnimatedGradientText className="mb-6">
            <Sparkles className="w-4 h-4 mr-2 text-purple-400" />
            <span className="text-xs uppercase tracking-wider text-purple-200 font-semibold">
              AI Captions for Viral Creators
            </span>
          </AnimatedGradientText>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-[1.08] text-white mb-6">
            Create viral captions <br />
            for your videos in <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-pink-400 to-amber-300">
              seconds.
            </span>
          </h1>

          <p className="text-base sm:text-lg text-[#9090a8] max-w-xl leading-relaxed mb-8">
            AutoCaption automatically generates viral captions, word animations, and smart emojis for TikTok, Reels, and Shorts. <span className="text-purple-300 font-medium">Export in full HD, completely free, with no watermark</span>.
          </p>

          {/* CTA Row */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 mb-8 w-full sm:w-auto">
            <ShimmerButton onClick={onOpenEditor} className="text-base font-bold py-3.5 px-8">
              <span className="flex items-center gap-2">
                <Zap className="w-4 h-4 fill-amber-300 text-amber-300" />
                <span>Open Studio Free</span>
              </span>
            </ShimmerButton>
          </div>

          {/* Trust badges */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 pt-4 border-t border-white/[0.08] w-full text-xs text-[#a0a0b8]">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>Ready in seconds</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>150+ Creator presets</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>No watermark, 100% free</span>
            </div>
          </div>
        </div>

        {/* Right Column: Before/After Comparison */}
        <div className="lg:col-span-5 flex justify-center">
          <BeforeAfterSlider />
        </div>
      </div>
    </section>
  );
};
