import React, { useRef } from 'react';
import { ZoomIn, ZoomOut, Scissors, Split } from 'lucide-react';
import { Word } from '../../types';

interface SubtitleTimelineProps {
  words: Word[];
  currentTime: number;
  duration: number;
  onSeek: (time: number) => void;
  onSelectWord: (index: number) => void;
  selectedWordIndex: number | null;
}

export const SubtitleTimeline: React.FC<SubtitleTimelineProps> = ({
  words,
  currentTime,
  duration,
  onSeek,
  onSelectWord,
  selectedWordIndex
}) => {
  const timelineRef = useRef<HTMLDivElement>(null);

  const handleTimelineClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!timelineRef.current || duration <= 0) return;
    const rect = timelineRef.current.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const percent = Math.max(0, Math.min(1, clickX / rect.width));
    onSeek(percent * duration);
  };

  const playheadPercent = duration > 0 ? (currentTime / duration) * 100 : 0;

  return (
    <div className="h-36 border-t border-white/[0.08] bg-[#0c0c18] px-6 py-3 flex flex-col justify-between shrink-0 select-none">
      {/* Timeline Controls Header */}
      <div className="flex items-center justify-between text-xs text-[#8888a0] mb-2">
        <div className="flex items-center gap-3">
          <span className="font-semibold text-white">Timeline Editor</span>
          <span className="text-[10px] bg-white/[0.05] px-2 py-0.5 rounded border border-white/[0.06]">
            {words.length} words detected
          </span>
        </div>

        <div className="flex items-center gap-2">
          <span className="font-mono text-purple-300 font-bold">
            {currentTime.toFixed(2)}s
          </span>
        </div>
      </div>

      {/* Main Interactive Scrubber Track */}
      <div
        ref={timelineRef}
        onClick={handleTimelineClick}
        className="relative h-20 bg-[#141426] rounded-xl border border-white/[0.06] overflow-hidden cursor-pointer"
      >
        {/* Simulated Audio Waveform Bar Background */}
        <div className="absolute inset-0 flex items-center justify-between px-2 opacity-20 pointer-events-none">
          {[...Array(60)].map((_, i) => {
            const h = 20 + Math.sin(i * 0.4) * 15 + (i % 3) * 10;
            return (
              <div
                key={i}
                className="w-1 bg-purple-400 rounded-full"
                style={{ height: `${h}%` }}
              />
            );
          })}
        </div>

        {/* Word Blocks Aligned Horizontally */}
        <div className="absolute inset-x-0 top-3 bottom-3 flex items-center pointer-events-none">
          {words.map((w, idx) => {
            if (duration <= 0) return null;
            const leftPercent = (w.start / duration) * 100;
            const widthPercent = Math.max(1.2, ((w.end - w.start) / duration) * 100);
            const isCurrent = currentTime >= w.start && currentTime <= w.end;
            const isSelected = selectedWordIndex === idx;

            return (
              <div
                key={idx}
                onClick={(e) => {
                  e.stopPropagation();
                  onSeek(w.start);
                  onSelectWord(idx);
                }}
                className={`absolute top-0 bottom-0 rounded-md flex items-center justify-center px-1.5 text-[11px] font-bold truncate transition-colors pointer-events-auto border ${
                  isSelected
                    ? 'bg-purple-600 text-white border-purple-300 shadow-md z-20'
                    : isCurrent
                    ? 'bg-amber-400 text-black border-amber-300 z-10'
                    : 'bg-white/[0.06] text-[#b0b0c8] hover:bg-white/15 border-white/[0.05]'
                }`}
                style={{
                  left: `${leftPercent}%`,
                  width: `${widthPercent}%`,
                }}
                title={`${w.word} (${w.start}s - ${w.end}s)`}
              >
                {w.emoji ? `${w.emoji} ${w.word}` : w.word}
              </div>
            );
          })}
        </div>

        {/* Red / Violet Playhead Line */}
        <div
          className="absolute top-0 bottom-0 w-0.5 bg-gradient-to-b from-purple-400 to-pink-500 shadow-[0_0_8px_rgba(236,72,153,1)] pointer-events-none z-30"
          style={{ left: `${playheadPercent}%` }}
        >
          <div className="absolute -top-1 -left-1.5 w-3.5 h-3.5 rounded-full bg-pink-500 shadow-md" />
        </div>
      </div>
    </div>
  );
};
