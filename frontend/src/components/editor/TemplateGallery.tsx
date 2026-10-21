import React, { useState, useMemo, useRef, useEffect } from 'react';
import { Sparkles, Check, Search, X, Loader2 } from 'lucide-react';
import { VIRAL_PRESETS } from '../../engine/presets';
import { TemplateConfig } from '../../types';
import { AnimatedTemplatePreview } from '../common/AnimatedTemplatePreview';

interface TemplateGalleryProps {
  currentConfig: TemplateConfig;
  onSelectTemplate: (template: TemplateConfig) => void;
}

type FilterTag = 'all' | 'trending' | 'lyrics' | 'glow' | 'bold' | 'minimal' | 'retro' | 'classic' | 'word';

const FILTER_TAGS: { id: FilterTag; label: string }[] = [
  { id: 'all', label: 'All' },
  { id: 'trending', label: 'Trending 🔥' },
  { id: 'lyrics', label: 'Lyrics 🎵' },
  { id: 'word', label: 'One-Word ⚡' },
  { id: 'glow', label: 'Glow ✨' },
  { id: 'bold', label: 'Bold 💥' },
  { id: 'minimal', label: 'Minimal 🧼' },
  { id: 'retro', label: 'Retro 📼' },
  { id: 'classic', label: 'Classic 📺' },
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

const GalleryCard: React.FC<{
  preset: TemplateConfig;
  isSelected: boolean;
  onSelectTemplate: (t: TemplateConfig) => void;
}> = ({ preset, isSelected, onSelectTemplate }) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div
      onClick={() => onSelectTemplate(preset)}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={`p-2.5 rounded-xl border cursor-pointer transition-all flex flex-col justify-between group ${
        isSelected
          ? 'bg-purple-950/40 border-purple-500 shadow-lg shadow-purple-900/30 ring-1 ring-purple-500'
          : 'bg-[#141426] border-white/[0.06] hover:border-white/20 hover:bg-[#181830]'
      }`}
    >
      {/* Live Animated Canvas Preview on Hover or Selected */}
      <div className="w-full h-20 rounded-lg bg-[#090914] border border-white/[0.04] flex items-center justify-center mb-2 relative overflow-hidden group-hover:border-purple-500/30 transition-colors">
        <AnimatedTemplatePreview
          preset={preset}
          isHovered={isHovered || isSelected}
          className="h-full"
        />

        {isSelected && (
          <div className="absolute top-1.5 right-1.5 w-4 h-4 rounded-full bg-purple-600 flex items-center justify-center text-white shadow-sm z-10">
            <Check className="w-2.5 h-2.5" />
          </div>
        )}
      </div>

      {/* Title & Effect Label */}
      <div className="flex items-center justify-between gap-1">
        <span className="font-bold text-xs text-white truncate">
          {preset.name}
        </span>
        <span className="text-[9px] uppercase font-bold text-[#8888a0] shrink-0">
          {formatEffectLabel(preset.modes.effectType)}
        </span>
      </div>

      {/* Tags row */}
      {preset.tags && preset.tags.length > 0 && (
        <div className="flex items-center gap-1 mt-1.5 overflow-hidden">
          {preset.tags.slice(0, 2).map((t) => (
            <span
              key={t}
              className="text-[9px] capitalize text-[#707088] bg-white/[0.03] px-1.5 py-0.5 rounded border border-white/[0.04]"
            >
              {t}
            </span>
          ))}
        </div>
      )}
    </div>
  );
};

export const TemplateGallery: React.FC<TemplateGalleryProps> = ({
  currentConfig,
  onSelectTemplate
}) => {
  const [activeTag, setActiveTag] = useState<FilterTag>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [visibleCount, setVisibleCount] = useState<number>(24);
  const sentinelRef = useRef<HTMLDivElement>(null);

  const filtered = useMemo(() => {
    return VIRAL_PRESETS.filter((preset) => {
      const matchesTag =
        activeTag === 'all' ||
        preset.category === activeTag ||
        (preset.tags && preset.tags.includes(activeTag));

      const q = searchQuery.trim().toLowerCase();
      const matchesSearch =
        !q ||
        preset.name.toLowerCase().includes(q) ||
        preset.description.toLowerCase().includes(q) ||
        (preset.tags && preset.tags.some((t) => t.toLowerCase().includes(q))) ||
        preset.font.name.toLowerCase().includes(q);

      return matchesTag && matchesSearch;
    });
  }, [activeTag, searchQuery]);

  // Reset visibleCount whenever category or search query changes
  useEffect(() => {
    setVisibleCount(24);
  }, [activeTag, searchQuery]);

  // Progressive batch loading: load more cards as user reaches bottom of gallery
  useEffect(() => {
    const sentinel = sentinelRef.current;
    if (!sentinel) return;

    if (!('IntersectionObserver' in window)) {
      setVisibleCount(filtered.length);
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setVisibleCount((prev) => Math.min(prev + 24, filtered.length));
        }
      },
      { rootMargin: '300px' }
    );

    observer.observe(sentinel);
    return () => observer.disconnect();
  }, [filtered.length]);

  const displayedPresets = useMemo(() => {
    return filtered.slice(0, visibleCount);
  }, [filtered, visibleCount]);

  return (
    <div className="flex flex-col h-full bg-[#101020] border-l border-white/[0.08] select-none">
      {/* Header */}
      <div className="p-4 border-b border-white/[0.08] shrink-0 space-y-3">
        <div className="flex items-center justify-between">
          <span className="flex items-center gap-2 font-bold text-sm text-white">
            <Sparkles className="w-4 h-4 text-purple-400" />
            <span>Caption Templates</span>
          </span>
          <span className="text-[11px] font-semibold text-purple-400 bg-purple-500/10 px-2 py-0.5 rounded-full border border-purple-500/20">
            {filtered.length} Styles
          </span>
        </div>

        {/* Search Input */}
        <div className="relative">
          <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-[#808098]" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by style, tag, or font..."
            className="w-full bg-[#16162a] border border-white/[0.08] rounded-xl pl-9 pr-8 py-1.5 text-xs text-white placeholder-[#808098] focus:outline-none focus:border-purple-500 transition-colors"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[#808098] hover:text-white"
            >
              <X className="w-3 h-3" />
            </button>
          )}
        </div>

        {/* Filter Tag Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
          {FILTER_TAGS.map((tag) => (
            <button
              key={tag.id}
              onClick={() => setActiveTag(tag.id)}
              className={`text-[11px] font-semibold px-2.5 py-1 rounded-lg shrink-0 transition-all ${
                activeTag === tag.id
                  ? 'bg-purple-600 text-white shadow-md shadow-purple-600/30'
                  : 'bg-[#18182c] text-[#9090a8] hover:text-white hover:bg-[#202038]'
              }`}
            >
              {tag.label}
            </button>
          ))}
        </div>
      </div>

      {/* Grid of Presets with Live Hover Previews */}
      <div className="flex-1 overflow-y-auto p-3 grid grid-cols-1 sm:grid-cols-2 gap-2.5">
        {filtered.length === 0 ? (
          <div className="col-span-full py-12 text-center text-[#808098] space-y-2">
            <p className="text-sm font-semibold text-white/80">No templates found</p>
            <p className="text-xs">Try searching for a different keyword or category</p>
            <button
              onClick={() => {
                setActiveTag('all');
                setSearchQuery('');
              }}
              className="text-xs text-purple-400 hover:underline pt-2 inline-block font-semibold"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <>
            {displayedPresets.map((preset) => (
              <GalleryCard
                key={preset.id}
                preset={preset}
                isSelected={currentConfig.id === preset.id}
                onSelectTemplate={onSelectTemplate}
              />
            ))}

            {/* Bottom Progressive Loading Sentinel & Indicator */}
            {visibleCount < filtered.length && (
              <div
                ref={sentinelRef}
                className="col-span-full py-3 flex items-center justify-center"
              >
                <div className="flex items-center gap-2 bg-[#151528] px-3.5 py-1.5 rounded-full border border-white/[0.06] text-xs text-[#8888a0]">
                  <Loader2 className="w-3.5 h-3.5 text-purple-400 animate-spin" />
                  <span className="font-medium">Loading more styles...</span>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};
