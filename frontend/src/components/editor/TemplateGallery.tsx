import React, { useState } from 'react';
import { Sparkles, Check } from 'lucide-react';
import { VIRAL_PRESETS } from '../../engine/presets';
import { TemplateConfig } from '../../types';
import { rgbToString } from '../../engine/subtitleCanvasRenderer';

interface TemplateGalleryProps {
  currentConfig: TemplateConfig;
  onSelectTemplate: (template: TemplateConfig) => void;
}

export const TemplateGallery: React.FC<TemplateGalleryProps> = ({
  currentConfig,
  onSelectTemplate
}) => {
  const [activeTab, setActiveTab] = useState<'all' | 'viral' | 'creator' | 'bold' | 'minimal'>('all');

  const filtered = activeTab === 'all'
    ? VIRAL_PRESETS
    : VIRAL_PRESETS.filter((p) => p.category === activeTab);

  return (
    <div className="flex flex-col h-full bg-[#101020] border-l border-white/[0.08] select-none">
      {/* Header */}
      <div className="p-4 border-b border-white/[0.08] shrink-0">
        <h2 className="font-bold text-sm text-white flex items-center justify-between mb-3">
          <span className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-purple-400" />
            <span>16 Viral Presets</span>
          </span>
          <span className="text-[10px] text-[#808098] font-mono">1-Click Apply</span>
        </h2>

        {/* Filter Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
          {(['all', 'viral', 'creator', 'bold', 'minimal'] as const).map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveTab(cat)}
              className={`text-[11px] font-semibold px-2.5 py-1 rounded-lg capitalize shrink-0 transition-colors ${
                activeTab === cat
                  ? 'bg-purple-600 text-white shadow-sm'
                  : 'bg-[#18182c] text-[#808098] hover:text-white'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Grid of Presets */}
      <div className="flex-1 overflow-y-auto p-3 grid grid-cols-1 sm:grid-cols-2 gap-2.5">
        {filtered.map((preset) => {
          const isSelected = currentConfig.id === preset.id;
          const spokenColor = rgbToString(preset.colors.spokenColor[0]);
          const defaultColor = rgbToString(preset.colors.defaultColor[0]);
          const strokeColor = rgbToString(preset.colors.strokeColor[0]);

          return (
            <div
              key={preset.id}
              onClick={() => onSelectTemplate(preset)}
              className={`p-3 rounded-xl border cursor-pointer transition-all flex flex-col justify-between ${
                isSelected
                  ? 'bg-purple-950/40 border-purple-500 shadow-lg shadow-purple-900/30 ring-1 ring-purple-500'
                  : 'bg-[#141426] border-white/[0.06] hover:border-white/20 hover:bg-[#181830]'
              }`}
            >
              {/* Visual Preview Box */}
              <div className="w-full h-16 rounded-lg bg-[#090914] border border-white/[0.04] flex items-center justify-center p-2 mb-2 relative overflow-hidden">
                <span
                  style={{
                    fontFamily: preset.font.name,
                    fontWeight: preset.font.weight,
                    color: spokenColor,
                    WebkitTextStroke: preset.sizes.strokeSize > 0 ? `1px ${strokeColor}` : 'none',
                    textShadow: preset.wordHasShadow ? `0 2px 6px ${spokenColor}` : 'none',
                  }}
                  className="text-sm font-black tracking-tight"
                >
                  {preset.name.split(' ')[0]} 🚀
                </span>

                {isSelected && (
                  <div className="absolute top-1.5 right-1.5 w-4 h-4 rounded-full bg-purple-600 flex items-center justify-center text-white">
                    <Check className="w-2.5 h-2.5" />
                  </div>
                )}
              </div>

              {/* Title & Tag */}
              <div className="flex items-center justify-between">
                <span className="font-bold text-xs text-white truncate">
                  {preset.name}
                </span>
                <span className="text-[9px] uppercase font-semibold text-[#808098]">
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
            </div>
          );
        })}
      </div>
    </div>
  );
};
