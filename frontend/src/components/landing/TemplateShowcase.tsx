import React, { useState } from 'react';
import { VIRAL_PRESETS } from '../../engine/presets';
import { TemplateConfig } from '../../types';
import { Sparkles, ArrowRight, Play } from 'lucide-react';
import { Link } from 'react-router-dom';
import { AnimatedTemplatePreview } from '../common/AnimatedTemplatePreview';

interface TemplateShowcaseProps {
  onSelectPreset?: (id: string) => void;
}

const CATEGORIES = [
  { id: 'all', label: 'All Styles' },
  { id: 'trending', label: 'Trending 🔥' },
  { id: 'lyrics', label: 'Lyrics 🎵' },
  { id: 'word', label: 'One-Word ⚡' },
  { id: 'glow', label: 'Glow ✨' },
  { id: 'bold', label: 'Bold 💥' },
  { id: 'minimal', label: 'Minimal 🧼' },
  { id: 'retro', label: 'Retro 📼' },
];

function formatEffectLabel(effectType: string): string {
  switch (effectType) {
    case 'SPRING_BOUNCE': return 'Bounce';
    case 'GLOW_PULSE': return 'Glow';
    case 'KARAOKE_WIPE': return 'Karaoke';
    case 'JITTER_SHAKE': return 'Shake';
    case 'STRETCH_SNAP': return 'Stretch';
    case 'GLITCH_RGB': return 'Glitch';
    case 'SWAY_FLOAT': return 'Sway';
    case 'FLIP_3D': return '3D Flip';
    case 'RISE_UP': return 'Rise';
    case 'TYPEWRITER': return 'Typing';
    case 'EXTRUDE_3D': return '3D Block';
    case 'RAINBOW_CYCLE': return 'Rainbow';
    case 'SPARKLE_TWINKLE': return 'Sparkle';
    case 'SMOKE_FADE': return 'Smoke';
    case 'VARIETY_PUNCH': return 'Punch';
    case 'POP': return 'Pop';
    case 'SMOOTH_POP': return 'Smooth';
    case 'FADE': return 'Fade';
    default: return 'Dynamic';
  }
}

const ShowcaseCard: React.FC<{
  preset: TemplateConfig;
  onSelectPreset?: (id: string) => void;
}> = ({ preset, onSelectPreset }) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="group relative rounded-2xl bg-[#121224] border border-white/[0.08] hover:border-purple-500/50 p-4 sm:p-5 flex flex-col justify-between transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl hover:shadow-purple-900/25"
    >
      {/* Live Animated Subtitle Preview on Hover */}
      <div className="w-full aspect-[16/10] rounded-xl bg-[#090914] border border-white/[0.06] flex items-center justify-center mb-4 relative overflow-hidden group-hover:border-purple-500/40 transition-colors">
        <AnimatedTemplatePreview preset={preset} isHovered={isHovered} />

        {/* Hover live animation indicator badge */}
        <div className={`absolute top-2 left-2 flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold backdrop-blur-md transition-opacity duration-200 ${
          isHovered ? 'bg-purple-600/90 text-white shadow-md' : 'bg-black/50 text-white/50 opacity-0 group-hover:opacity-100'
        }`}>
          <Play className="w-2.5 h-2.5 fill-current" />
          <span>Live Effect</span>
        </div>

        {/* Effect Name Pill */}
        <span className="absolute bottom-2 right-2 text-[10px] text-white/80 bg-black/70 px-2 py-0.5 rounded-md backdrop-blur-md border border-white/10 uppercase font-bold tracking-wider">
          {formatEffectLabel(preset.modes.effectType)}
        </span>
      </div>

      {/* Preset Info */}
      <div className="mb-4">
        <div className="flex items-center justify-between mb-1.5">
          <h3 className="font-bold text-white text-base group-hover:text-purple-300 transition-colors truncate">
            {preset.name}
          </h3>
        </div>
        <p className="text-[#808098] text-xs leading-relaxed line-clamp-2">
          {preset.description}
        </p>
      </div>

      {/* Action CTA */}
      {onSelectPreset ? (
        <button
          onClick={() => onSelectPreset(preset.id)}
          className="w-full py-2.5 px-4 rounded-xl bg-purple-600/10 hover:bg-purple-600 text-purple-300 hover:text-white font-semibold text-xs transition-all duration-200 flex items-center justify-center gap-2 border border-purple-500/20 hover:border-transparent"
        >
          <span>Use Template</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      ) : (
        <Link
          to="/editor"
          className="w-full py-2.5 px-4 rounded-xl bg-purple-600/10 hover:bg-purple-600 text-purple-300 hover:text-white font-semibold text-xs transition-all duration-200 flex items-center justify-center gap-2 border border-purple-500/20 hover:border-transparent"
        >
          <span>Use Template</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      )}
    </div>
  );
};

export const TemplateShowcase: React.FC<TemplateShowcaseProps> = ({ onSelectPreset }) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [visibleCount, setVisibleCount] = useState<number>(24);

  const filtered = selectedCategory === 'all'
    ? VIRAL_PRESETS
    : VIRAL_PRESETS.filter((p) => p.category === selectedCategory || (p.tags && p.tags.includes(selectedCategory)));

  return (
    <section id="templates" className="py-20 bg-[#070710] border-t border-white/[0.07]">
      <div className="max-w-7xl mx-auto px-5 lg:px-10">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <p className="text-purple-400 text-xs font-bold uppercase tracking-widest mb-3">
            Template Gallery
          </p>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight leading-tight mb-4">
            150+ Pre-Built Creator Styles
          </h2>
          <p className="text-[#9090a8] text-base leading-relaxed">
            Hover over any template to preview its signature animation live. Choose from trending styles, sliding lyrics, or punchy one-word captions.
          </p>

          {/* Category Filter Pills */}
          <div className="flex flex-wrap items-center justify-center gap-2 mt-8">
            {CATEGORIES.map((cat) => (
              <button
                key={cat.id}
                onClick={() => {
                  setSelectedCategory(cat.id);
                  setVisibleCount(24);
                }}
                className={`text-xs font-semibold px-4 py-2 rounded-full transition-all duration-200 border ${
                  selectedCategory === cat.id
                    ? 'bg-purple-600 text-white border-purple-500 shadow-lg shadow-purple-600/30'
                    : 'bg-[#121222] text-[#808098] hover:text-white border-white/[0.08]'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>

        {/* Templates Grid with Live Hover Animation */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {filtered.slice(0, visibleCount).map((preset) => (
            <ShowcaseCard
              key={preset.id}
              preset={preset}
              onSelectPreset={onSelectPreset}
            />
          ))}
        </div>

        {/* Load More Button */}
        {visibleCount < filtered.length && (
          <div className="text-center mt-10">
            <button
              onClick={() => setVisibleCount((prev) => Math.min(filtered.length, prev + 24))}
              className="px-6 py-2.5 rounded-full bg-[#18182e] hover:bg-[#22223e] border border-white/10 text-white font-semibold text-xs transition-all hover:scale-105"
            >
              Show More Styles ({filtered.length - visibleCount} more available)
            </button>
          </div>
        )}

        {/* Bottom CTA to explore all styles in editor */}
        <div className="text-center mt-14">
          <Link
            to="/editor"
            className="inline-flex items-center gap-2 px-8 py-3.5 rounded-full bg-gradient-to-r from-purple-600 via-indigo-600 to-purple-500 hover:from-purple-500 hover:to-indigo-500 text-white font-bold text-sm shadow-xl shadow-purple-600/30 transition-all hover:scale-105"
          >
            <Sparkles className="w-4 h-4 text-purple-200" />
            <span>Explore All {VIRAL_PRESETS.length} Styles in Free Studio</span>
          </Link>
        </div>
      </div>
    </section>
  );
};
