import React from 'react';
import { Sliders, Type, Palette, Sparkles, Layout, AlignLeft, AlignCenter, AlignRight, Smile, Compass } from 'lucide-react';
import { EffectType, TemplateConfig, CapitalizationType } from '../../types';

interface StyleControlsProps {
  config: TemplateConfig;
  onUpdateConfig: (updated: Partial<TemplateConfig>) => void;
}

export const StyleControls: React.FC<StyleControlsProps> = ({
  config,
  onUpdateConfig
}) => {
  const fontOptions = [
    'The Bold',
    'Montserrat',
    'Roboto',
    'Roboto Condensed',
    'Lemon Milk',
    'Heavitas',
    'Komika Axis',
    'Anton',
    'Instrument Serif',
    'Built Titling',
    'Inter'
  ];

  const animationOptions: { label: string; value: EffectType }[] = [
    { label: 'Bouncy Pop', value: 'POP' },
    { label: 'Smooth Pop', value: 'SMOOTH_POP' },
    { label: 'Shake', value: 'SHAKE' },
    { label: 'Glitch', value: 'GLITCH' },
    { label: 'Wave', value: 'WAVE_SCALE' },
    { label: 'Fade', value: 'FADE' },
    { label: 'None', value: 'DISABLED' },
  ];

  const sizePresets = [
    { label: 'Small', size: 36 },
    { label: 'Medium', size: 48 },
    { label: 'Large', size: 60 },
    { label: 'Huge', size: 76 }
  ];

  const positionPresets = [
    { label: 'Top', pos: 22 },
    { label: 'Center', pos: 50 },
    { label: 'Lower Third', pos: 76 },
    { label: 'Bottom', pos: 85 }
  ];

  // Helper to convert rgb to hex for color input
  const rgbToHex = (r: number, g: number, b: number) => {
    return '#' + [r, g, b].map((x) => x.toString(16).padStart(2, '0')).join('');
  };

  // Helper to convert hex to rgb
  const hexToRgb = (hex: string) => {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result
      ? {
          r: parseInt(result[1], 16),
          g: parseInt(result[2], 16),
          b: parseInt(result[3], 16),
        }
      : { r: 255, g: 255, b: 255 };
  };

  const defaultCol = config.colors.defaultColor[0] || { r: 255, g: 255, b: 255 };
  const spokenCol = config.colors.spokenColor[0] || { r: 255, g: 230, b: 0 };
  const strokeCol = config.colors.strokeColor[0] || { r: 0, g: 0, b: 0 };
  const bgCol = config.colors.backgroundColor[0] || { r: 0, g: 0, b: 0, a: 0.8 };

  const handleAdjustFontSize = (delta: number) => {
    const newSize = Math.max(20, Math.min(96, config.sizes.fontSize + delta));
    onUpdateConfig({ sizes: { ...config.sizes, fontSize: newSize } });
  };

  return (
    <div className="flex flex-col h-full bg-[#101020] border-l border-white/[0.08] p-4 overflow-y-auto space-y-6 text-xs text-white select-none">
      <div className="flex items-center gap-2 pb-2 border-b border-white/[0.08]">
        <Sliders className="w-4 h-4 text-purple-400" />
        <h2 className="font-bold text-sm tracking-tight">Style Your Captions</h2>
      </div>

      {/* Typography & Font */}
      <div className="space-y-3">
        <label className="font-bold text-xs text-[#a0a0b8] flex items-center gap-1.5">
          <Type className="w-3.5 h-3.5" />
          <span>Font & Typography</span>
        </label>

        <select
          value={config.font.name}
          onChange={(e) =>
            onUpdateConfig({
              font: { ...config.font, name: e.target.value }
            })
          }
          className="w-full bg-[#16162a] border border-white/[0.08] rounded-xl px-3 py-2 text-xs font-semibold focus:outline-none focus:border-purple-500"
        >
          {fontOptions.map((f) => (
            <option key={f} value={f}>
              {f}
            </option>
          ))}
        </select>

        {/* Text Size Controls with Steppers & Quick Pills */}
        <div className="bg-[#16162a] p-3 rounded-xl border border-white/[0.06] space-y-2.5">
          <div className="flex items-center justify-between text-[11px] text-[#a0a0b8]">
            <span className="font-semibold">Text Size</span>
            <div className="flex items-center gap-1.5">
              <button
                type="button"
                onClick={() => handleAdjustFontSize(-2)}
                className="w-5 h-5 rounded bg-white/[0.06] hover:bg-white/15 flex items-center justify-center font-bold text-white text-xs"
                title="Decrease size"
              >
                -
              </button>
              <span className="font-mono text-purple-300 font-bold px-1">{config.sizes.fontSize}px</span>
              <button
                type="button"
                onClick={() => handleAdjustFontSize(2)}
                className="w-5 h-5 rounded bg-white/[0.06] hover:bg-white/15 flex items-center justify-center font-bold text-white text-xs"
                title="Increase size"
              >
                +
              </button>
            </div>
          </div>

          <input
            type="range"
            min={20}
            max={96}
            value={config.sizes.fontSize}
            onChange={(e) =>
              onUpdateConfig({
                sizes: { ...config.sizes, fontSize: parseInt(e.target.value, 10) }
              })
            }
            className="w-full accent-purple-500"
          />

          {/* Preset Size Pills */}
          <div className="grid grid-cols-4 gap-1 pt-1">
            {sizePresets.map((sp) => (
              <button
                key={sp.label}
                type="button"
                onClick={() => onUpdateConfig({ sizes: { ...config.sizes, fontSize: sp.size } })}
                className={`py-1 rounded text-[10px] font-bold transition-colors ${
                  config.sizes.fontSize === sp.size
                    ? 'bg-purple-600 text-white'
                    : 'bg-white/[0.04] text-[#808098] hover:text-white'
                }`}
              >
                {sp.label}
              </button>
            ))}
          </div>
        </div>

        {/* Text Alignment */}
        <div>
          <span className="text-[11px] text-[#808098] block mb-1.5 font-semibold">Text Alignment</span>
          <div className="grid grid-cols-3 gap-1 bg-[#16162a] p-1 rounded-xl border border-white/[0.06]">
            {[
              { id: 'left', label: 'Left', icon: AlignLeft },
              { id: 'center', label: 'Center', icon: AlignCenter },
              { id: 'right', label: 'Right', icon: AlignRight }
            ].map((al) => {
              const Icon = al.icon;
              const isActive = (config.textAlign || 'center') === al.id;
              return (
                <button
                  key={al.id}
                  type="button"
                  onClick={() => onUpdateConfig({ textAlign: al.id as any })}
                  className={`py-1.5 rounded-lg text-[10px] font-bold flex items-center justify-center gap-1.5 transition-colors ${
                    isActive ? 'bg-purple-600 text-white shadow-sm' : 'text-[#808098] hover:text-white'
                  }`}
                >
                  <Icon className="w-3 h-3" />
                  <span>{al.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Capitalization Toggle */}
        <div className="grid grid-cols-3 gap-1 bg-[#16162a] p-1 rounded-xl border border-white/[0.06]">
          {(['UPPERCASE', 'DEFAULT', 'LOWERCASE'] as CapitalizationType[]).map((cap) => (
            <button
              key={cap}
              type="button"
              onClick={() => onUpdateConfig({ capitalizationType: cap })}
              className={`py-1 rounded-lg text-[10px] font-bold transition-colors ${
                config.capitalizationType === cap
                  ? 'bg-purple-600 text-white'
                  : 'text-[#808098] hover:text-white'
              }`}
            >
              {cap === 'UPPERCASE' ? 'ALL CAPS' : cap === 'DEFAULT' ? 'Title Case' : 'lowercase'}
            </button>
          ))}
        </div>
      </div>

      {/* Tilt / Rotation Angle */}
      <div className="space-y-2">
        <div className="flex justify-between items-center text-[11px] text-[#a0a0b8]">
          <span className="font-bold flex items-center gap-1.5">
            <Compass className="w-3.5 h-3.5 text-purple-400" />
            <span>Viral Tilt Angle</span>
          </span>
          <div className="flex items-center gap-2">
            <span className="font-mono text-purple-300 font-bold">{config.rotationAngle || 0}°</span>
            {config.rotationAngle !== 0 && (
              <button
                type="button"
                onClick={() => onUpdateConfig({ rotationAngle: 0 })}
                className="text-[9px] text-[#808098] hover:text-white underline"
              >
                Reset
              </button>
            )}
          </div>
        </div>
        <input
          type="range"
          min={-15}
          max={15}
          value={config.rotationAngle || 0}
          onChange={(e) => onUpdateConfig({ rotationAngle: parseInt(e.target.value, 10) })}
          className="w-full accent-purple-500"
        />
      </div>

      {/* Color Customizer */}
      <div className="space-y-3">
        <label className="font-bold text-xs text-[#a0a0b8] flex items-center gap-1.5">
          <Palette className="w-3.5 h-3.5" />
          <span>Color Palette</span>
        </label>

        <div className="grid grid-cols-2 gap-3">
          {/* Default Text Color */}
          <div className="p-2.5 rounded-xl bg-[#16162a] border border-white/[0.06] flex items-center justify-between">
            <span className="text-[11px] text-[#a0a0b8]">Text Color</span>
            <input
              type="color"
              value={rgbToHex(defaultCol.r, defaultCol.g, defaultCol.b)}
              onChange={(e) =>
                onUpdateConfig({
                  colors: {
                    ...config.colors,
                    defaultColor: [hexToRgb(e.target.value)]
                  }
                })
              }
              className="w-6 h-6 rounded cursor-pointer border-0 bg-transparent"
            />
          </div>

          {/* Spoken Word Highlight Color */}
          <div className="p-2.5 rounded-xl bg-[#16162a] border border-white/[0.06] flex items-center justify-between">
            <span className="text-[11px] text-amber-300 font-semibold">Spoken Word</span>
            <input
              type="color"
              value={rgbToHex(spokenCol.r, spokenCol.g, spokenCol.b)}
              onChange={(e) =>
                onUpdateConfig({
                  colors: {
                    ...config.colors,
                    spokenColor: [hexToRgb(e.target.value)]
                  }
                })
              }
              className="w-6 h-6 rounded cursor-pointer border-0 bg-transparent"
            />
          </div>

          {/* Stroke Outline Color */}
          <div className="p-2.5 rounded-xl bg-[#16162a] border border-white/[0.06] flex items-center justify-between">
            <span className="text-[11px] text-[#a0a0b8]">Outline Stroke</span>
            <input
              type="color"
              value={rgbToHex(strokeCol.r, strokeCol.g, strokeCol.b)}
              onChange={(e) =>
                onUpdateConfig({
                  colors: {
                    ...config.colors,
                    strokeColor: [hexToRgb(e.target.value)]
                  }
                })
              }
              className="w-6 h-6 rounded cursor-pointer border-0 bg-transparent"
            />
          </div>

          {/* Background Pill Color */}
          <div className="p-2.5 rounded-xl bg-[#16162a] border border-white/[0.06] flex items-center justify-between">
            <span className="text-[11px] text-[#a0a0b8]">Backdrop Pill</span>
            <input
              type="color"
              value={rgbToHex(bgCol.r, bgCol.g, bgCol.b)}
              onChange={(e) =>
                onUpdateConfig({
                  wordHasBackground: true,
                  colors: {
                    ...config.colors,
                    backgroundColor: [{ ...hexToRgb(e.target.value), a: 0.85 }]
                  }
                })
              }
              className="w-6 h-6 rounded cursor-pointer border-0 bg-transparent"
            />
          </div>
        </div>
      </div>

      {/* Animation Effects */}
      <div className="space-y-3">
        <label className="font-bold text-xs text-[#a0a0b8] flex items-center gap-1.5">
          <Sparkles className="w-3.5 h-3.5 text-purple-400" />
          <span>Active Word Animation</span>
        </label>

        <select
          value={config.modes.effectType}
          onChange={(e) =>
            onUpdateConfig({
              modes: {
                ...config.modes,
                effectType: e.target.value as EffectType
              }
            })
          }
          className="w-full bg-[#16162a] border border-white/[0.08] rounded-xl px-3 py-2 text-xs font-semibold focus:outline-none focus:border-purple-500"
        >
          {animationOptions.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      </div>

      {/* Emoji Controls */}
      <div className="space-y-3 bg-[#16162a] p-3 rounded-xl border border-white/[0.06]">
        <label className="font-bold text-xs text-[#a0a0b8] flex items-center justify-between">
          <span className="flex items-center gap-1.5">
            <Smile className="w-3.5 h-3.5 text-purple-400" />
            <span>Emoji Settings</span>
          </span>
          <span className="text-[10px] text-purple-300 font-mono">{config.sizes.emojiSize}px</span>
        </label>

        {/* Emoji Placement: Beside vs Above */}
        <div className="grid grid-cols-2 gap-1 bg-[#101020] p-1 rounded-lg border border-white/[0.04]">
          <button
            type="button"
            onClick={() => onUpdateConfig({ emojiPosition: 'BESIDE' })}
            className={`py-1 rounded text-[10px] font-bold transition-colors ${
              (config.emojiPosition || 'BESIDE') === 'BESIDE'
                ? 'bg-purple-600 text-white'
                : 'text-[#808098] hover:text-white'
            }`}
          >
            Beside Word
          </button>
          <button
            type="button"
            onClick={() => onUpdateConfig({ emojiPosition: 'ABOVE' })}
            className={`py-1 rounded text-[10px] font-bold transition-colors ${
              config.emojiPosition === 'ABOVE'
                ? 'bg-purple-600 text-white'
                : 'text-[#808098] hover:text-white'
            }`}
          >
            Above Word
          </button>
        </div>

        {/* Emoji Size Slider */}
        <input
          type="range"
          min={24}
          max={84}
          value={config.sizes.emojiSize}
          onChange={(e) =>
            onUpdateConfig({
              sizes: { ...config.sizes, emojiSize: parseInt(e.target.value, 10) }
            })
          }
          className="w-full accent-purple-500"
        />

        {/* Emoji Bounce Animation Toggle */}
        <label className="flex items-center justify-between cursor-pointer pt-1">
          <span className="text-[11px] text-[#808098]">Bouncy Emoji Animation</span>
          <input
            type="checkbox"
            checked={config.emojiAnimated}
            onChange={(e) => onUpdateConfig({ emojiAnimated: e.target.checked })}
            className="w-4 h-4 accent-purple-500 rounded"
          />
        </label>
      </div>

      {/* Position & Layout */}
      <div className="space-y-3">
        <label className="font-bold text-xs text-[#a0a0b8] flex items-center gap-1.5">
          <Layout className="w-3.5 h-3.5" />
          <span>Position & Layout</span>
        </label>

        {/* Vertical Position */}
        <div>
          <div className="flex justify-between text-[11px] text-[#808098] mb-1">
            <span>Vertical Position</span>
            <span className="font-mono">{config.sizes.posY}%</span>
          </div>

          {/* Quick Position Snap Pills */}
          <div className="grid grid-cols-4 gap-1 mb-2">
            {positionPresets.map((pp) => (
              <button
                key={pp.label}
                type="button"
                onClick={() => onUpdateConfig({ sizes: { ...config.sizes, posY: pp.pos } })}
                className={`py-1 rounded text-[10px] font-bold transition-colors ${
                  Math.abs(config.sizes.posY - pp.pos) < 5
                    ? 'bg-purple-600 text-white'
                    : 'bg-[#16162a] text-[#808098] hover:text-white'
                }`}
              >
                {pp.label}
              </button>
            ))}
          </div>

          <input
            type="range"
            min={15}
            max={88}
            value={config.sizes.posY}
            onChange={(e) =>
              onUpdateConfig({
                sizes: { ...config.sizes, posY: parseInt(e.target.value, 10) }
              })
            }
            className="w-full accent-purple-500"
          />
        </div>

        {/* Stroke Size */}
        <div>
          <div className="flex justify-between text-[11px] text-[#808098] mb-1">
            <span>Outline Width</span>
            <span className="font-mono">{config.sizes.strokeSize}px</span>
          </div>
          <input
            type="range"
            min={0}
            max={24}
            value={config.sizes.strokeSize}
            onChange={(e) =>
              onUpdateConfig({
                sizes: { ...config.sizes, strokeSize: parseInt(e.target.value, 10) }
              })
            }
            className="w-full accent-purple-500"
          />
        </div>

        {/* Words per line */}
        <div>
          <div className="flex justify-between text-[11px] text-[#808098] mb-1">
            <span>Words Per Screen</span>
            <span className="font-mono">{config.wordsPerLineCount} words</span>
          </div>
          <input
            type="range"
            min={1}
            max={6}
            value={config.wordsPerLineCount}
            onChange={(e) =>
              onUpdateConfig({
                wordsPerLineCount: parseInt(e.target.value, 10)
              })
            }
            className="w-full accent-purple-500"
          />
        </div>
      </div>
    </div>
  );
};
