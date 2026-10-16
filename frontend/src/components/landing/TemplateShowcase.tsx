import React, { useState } from 'react';
import { VIRAL_PRESETS } from '../../engine/presets';
import { rgbToString } from '../../engine/subtitleCanvasRenderer';
import { Sparkles, Check } from 'lucide-react';

interface TemplateShowcaseProps {
  onSelectPreset?: (id: string) => void;
}

export const TemplateShowcase: React.FC<TemplateShowcaseProps> = ({ onSelectPreset }) => {
  const [selectedCategory, setSelectedCategory] = useState<'all' | 'viral' | 'creator' | 'minimal' | 'bold'>('all');

  const filtered = selectedCategory === 'all'
    ? VIRAL_PRESETS
    : VIRAL_PRESETS.filter((p) => p.category === selectedCategory);

  return (
    <section id="templates" className="py-20 bg-[#070710] border-t border-white/[0.07]">
      <div className="max-w-7xl mx-auto px-5 lg:px-10">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <p className="text-purple-400 text-xs font-bold uppercase tracking-widest mb-3">
            Template Gallery
          </p>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight leading-tight mb-4">
            16 Pre-Built Viral Styles
          </h2>
          <p className="text-[#9090a8] text-base leading-relaxed">
            Choose from trending creator presets used by million-view TikTokers and YouTubers, or customize every font, stroke, and shadow.
          </p>

          {/* Category Filter Pills */}
          <div className="flex flex-wrap items-center justify-center gap-2 mt-8">
            {(['all', 'viral', 'creator', 'bold', 'minimal'] as const).map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`text-xs font-semibold px-4 py-2 rounded-full capitalize transition-all duration-200 border ${
                  selectedCategory === cat
                    ? 'bg-purple-600 text-white border-purple-500 shadow-lg shadow-purple-600/30'
                    : 'bg-[#121222] text-[#808098] hover:text-white border-white/[0.08]'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* 16 Templates Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {filtered.map((preset) => {
            const fontName = preset.font.name;
            const spokenColor = rgbToString(preset.colors.spokenColor[0]);
            const defaultColor = rgbToString(preset.colors.defaultColor[0]);
            const strokeColor = rgbToString(preset.colors.strokeColor[0]);
            const hasBg = preset.wordHasBackground && preset.colors.backgroundColor.length > 0;
            const bgColor = hasBg ? rgbToString(preset.colors.backgroundColor[0]) : 'transparent';

            return (
              <div
                key={preset.id}
                className="group relative rounded-2xl bg-[#121224] border border-white/[0.08] hover:border-purple-500/50 p-5 flex flex-col justify-between transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl hover:shadow-purple-900/20"
              >
                {/* Visual Subtitle Preview Box */}
                <div className="w-full aspect-[16/10] rounded-xl bg-[#090914] border border-white/[0.06] flex flex-col items-center justify-center p-4 mb-4 relative overflow-hidden">
                  <div
                    className="text-center px-3 py-1.5 rounded-lg transition-transform duration-200 group-hover:scale-105"
                    style={{ backgroundColor: bgColor }}
                  >
                    <span
                      style={{
                        fontFamily: fontName,
                        fontWeight: preset.font.weight,
                        color: defaultColor,
                        WebkitTextStroke: preset.sizes.strokeSize > 0 ? `1.5px ${strokeColor}` : 'none',
                        textShadow: preset.wordHasShadow ? '0 2px 8px rgba(0,0,0,0.8)' : 'none',
                      }}
                      className="text-lg tracking-tight inline-block mr-1"
                    >
                      {preset.capitalizationType === 'UPPERCASE' ? 'THIS IS ' : 'This is '}
                    </span>
                    <span
                      style={{
                        fontFamily: fontName,
                        fontWeight: preset.font.weight,
                        color: spokenColor,
                        WebkitTextStroke: preset.sizes.strokeSize > 0 ? `1.5px ${strokeColor}` : 'none',
                        textShadow: preset.wordHasShadow ? `0 2px 10px ${spokenColor}` : 'none',
                      }}
                      className="text-lg font-black tracking-tight inline-block"
                    >
                      {preset.capitalizationType === 'UPPERCASE' ? 'VIRAL' : 'Viral'} 🚀
                    </span>
                  </div>

                  <span className="absolute bottom-2 right-2 text-[10px] text-white/40 uppercase font-semibold">
                    {preset.modes.effectType === 'POP'
                      ? 'Bouncy'
                      : preset.modes.effectType === 'SMOOTH_POP'
                      ? 'Smooth'
                      : preset.modes.effectType === 'WAVE_SCALE'
                      ? 'Wave'
                      : preset.modes.effectType === 'GLITCH'
                      ? 'Glitch'
                      : preset.modes.effectType === 'SHAKE'
                      ? 'Shake'
                      : 'Clean'}
                  </span>
                </div>

                {/* Info & Metadata */}
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <h3 className="font-bold text-white text-base tracking-tight">
                      {preset.name}
                    </h3>
                    <span className="text-[10px] font-semibold uppercase px-2 py-0.5 rounded-md bg-white/[0.05] text-[#9090a8] border border-white/[0.06]">
                      {preset.font.name}
                    </span>
                  </div>
                  <p className="text-[#787890] text-xs leading-relaxed line-clamp-2">
                    {preset.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
