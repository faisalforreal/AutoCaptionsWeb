import React from 'react';
import { Type, Sparkles, Smartphone, Download, Globe, Cpu } from 'lucide-react';
import { MagicCard } from '../ui/magic-card';

export const FeaturesGrid: React.FC = () => {
  const features = [
    {
      icon: Type,
      title: '16+ Viral Creator Presets',
      desc: 'Instant styles modeled after Hormozi, MrBeast, Ali Abdaal, Cyberpunk Neon, and Luxury Editorial with customizable fonts and outlines.',
      color: 'text-purple-400'
    },
    {
      icon: Smartphone,
      title: 'One-Click Aspect Ratio Resizing',
      desc: 'Seamlessly switch between 9:16 (TikTok/Reels/Shorts), 1:1 (Instagram Square), 16:9 (YouTube), and 4:5 Portrait without clipping.',
      color: 'text-blue-400'
    },
    {
      icon: Cpu,
      title: 'Instant Speech-to-Text Accuracy',
      desc: 'Accurate captions generated in seconds, with perfect word timing, automatic punctuation, and natural sentence pacing.',
      color: 'text-emerald-400'
    },
    {
      icon: Download,
      title: 'Export in Full HD, Completely Free',
      desc: 'Download crisp 1080p videos with burned-in subtitles in seconds. No waiting in line, no subscriptions, and never any watermarks.',
      color: 'text-amber-400'
    },
    {
      icon: Sparkles,
      title: 'Automatic Viral Emojis',
      desc: 'Automatically detects spoken words and pops in relevant animated emojis right as they are spoken to boost retention.',
      color: 'text-pink-400'
    },
    {
      icon: Globe,
      title: 'Multilingual & RTL Support',
      desc: 'Transcribe and style videos in over 30+ languages, including native Right-to-Left (RTL) alignment for Arabic and Hebrew.',
      color: 'text-cyan-400'
    }
  ];

  return (
    <section id="features" className="py-20 max-w-7xl mx-auto px-5 lg:px-10">
      <div className="text-center max-w-2xl mx-auto mb-16">
        <p className="text-purple-400 text-xs font-bold uppercase tracking-widest mb-3">
          Features
        </p>
        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight leading-tight mb-4">
          Everything you need to create viral captioned videos.
        </h2>
        <p className="text-[#9090a8] text-base leading-relaxed">
          AutoCaption empowers creators to transcribe faster, edit with surgical precision, and export high-retention reels completely free.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {features.map((feat, i) => {
          const Icon = feat.icon;
          return (
            <MagicCard key={i} className="p-8 group">
              <div className="w-12 h-12 rounded-xl bg-white/[0.05] border border-white/10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                <Icon className={`w-6 h-6 ${feat.color}`} />
              </div>
              <h3 className="text-xl font-bold text-white mb-2 tracking-tight">
                {feat.title}
              </h3>
              <p className="text-[#8888a0] text-sm leading-relaxed">
                {feat.desc}
              </p>
            </MagicCard>
          );
        })}
      </div>
    </section>
  );
};
