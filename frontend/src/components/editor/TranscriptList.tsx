import React, { useState } from 'react';
import { Search, Sparkles, Smile, Trash2, Highlighter, Play, Replace, Combine, Split } from 'lucide-react';
import { Word } from '../../types';

interface TranscriptListProps {
  words: Word[];
  currentTime: number;
  onUpdateWord: (index: number, updated: Partial<Word>) => void;
  onDeleteWord: (index: number) => void;
  onSeek: (time: number) => void;
  selectedWordIndex: number | null;
  onSelectWord: (index: number) => void;
  onBatchUpdateWords?: (newWords: Word[]) => void;
}

export const TranscriptList: React.FC<TranscriptListProps> = ({
  words,
  currentTime,
  onUpdateWord,
  onDeleteWord,
  onSeek,
  selectedWordIndex,
  onSelectWord,
  onBatchUpdateWords
}) => {
  const [search, setSearch] = useState('');
  const [showReplace, setShowReplace] = useState(false);
  const [replaceText, setReplaceText] = useState('');
  const [activeEmojiPickerIdx, setActiveEmojiPickerIdx] = useState<number | null>(null);

  const filteredWords = words.map((w, originalIdx) => ({ ...w, originalIdx })).filter((w) =>
    (w.word || '').toLowerCase().includes(search.toLowerCase()) ||
    (w.punctuated_word || '').toLowerCase().includes(search.toLowerCase())
  );

  const commonEmojis = ['🔥', '💸', '🚀', '⚡', '🏆', '💡', '🧠', '❤️', '👀', '🚨', '✨', '👑', '💯', '🎯', '📈', '👇'];

  // Magic 1-click highlight for numbers & high-retention viral power words
  const handleAutoHighlight = () => {
    const POWER_WORDS = new Set([
      'viral', 'secret', 'money', 'free', 'best', 'huge', 'insane', 'never', 'always',
      'stop', 'watch', 'fast', 'easy', 'hack', 'truth', 'million', 'billion', 'rich',
      'win', 'lose', 'crazy', 'epic', 'danger', 'shocking', 'boost', 'growth', 'scale',
      'top', 'key', 'rule', 'rules', 'power', 'pro', 'level', 'now', 'today', 'how'
    ]);

    const updated = words.map((w) => {
      const clean = (w.word || '').toLowerCase().replace(/[^a-z0-9]/g, '');
      const hasNumber = /\d/.test(w.word || '');
      const hasCurrency = /[\$€£¥]/.test(w.punctuated_word || w.word || '');
      const isPower = POWER_WORDS.has(clean) || hasNumber || hasCurrency;
      return isPower ? { ...w, highlight: true } : w;
    });

    if (onBatchUpdateWords) {
      onBatchUpdateWords(updated);
    } else {
      updated.forEach((w, i) => {
        if (w.highlight !== words[i].highlight) {
          onUpdateWord(i, { highlight: w.highlight });
        }
      });
    }
  };

  // Find & Replace All occurrences
  const handleReplaceAll = () => {
    if (!search.trim()) return;

    const regex = new RegExp(search.trim(), 'gi');
    const updated = words.map((w) => {
      const match = regex.test(w.word || '') || regex.test(w.punctuated_word || '');
      if (match) {
        const newWord = (w.word || '').replace(regex, replaceText);
        const newPunc = (w.punctuated_word || '').replace(regex, replaceText);
        return { ...w, word: newWord, punctuated_word: newPunc };
      }
      return w;
    });

    if (onBatchUpdateWords) {
      onBatchUpdateWords(updated);
    }
    setSearch('');
    setReplaceText('');
    setShowReplace(false);
  };

  // Merge word with adjacent next word
  const handleMergeNext = (idx: number) => {
    if (idx >= words.length - 1) return;
    const current = words[idx];
    const next = words[idx + 1];

    const merged: Word = {
      start: current.start,
      end: next.end,
      word: `${current.word} ${next.word}`,
      punctuated_word: `${current.punctuated_word || current.word} ${next.punctuated_word || next.word}`,
      emoji: current.emoji || next.emoji,
      highlight: current.highlight || next.highlight
    };

    const newWords = [...words.slice(0, idx), merged, ...words.slice(idx + 2)];
    if (onBatchUpdateWords) {
      onBatchUpdateWords(newWords);
    }
  };

  // Split word into two halves
  const handleSplitWord = (idx: number) => {
    const w = words[idx];
    const parts = (w.punctuated_word || w.word).trim().split(/\s+/);
    if (parts.length < 2) return;

    const midTime = w.start + (w.end - w.start) / 2;
    const w1: Word = {
      start: w.start,
      end: midTime,
      word: parts[0],
      punctuated_word: parts[0],
      highlight: w.highlight
    };
    const w2: Word = {
      start: midTime,
      end: w.end,
      word: parts.slice(1).join(' '),
      punctuated_word: parts.slice(1).join(' '),
      emoji: w.emoji,
      highlight: w.highlight
    };

    const newWords = [...words.slice(0, idx), w1, w2, ...words.slice(idx + 1)];
    if (onBatchUpdateWords) {
      onBatchUpdateWords(newWords);
    }
  };

  return (
    <div className="flex flex-col h-full bg-[#101020] border-r border-white/[0.08] select-none">
      {/* Header with Word Count & Magic Highlighter */}
      <div className="p-4 border-b border-white/[0.08] shrink-0 space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <h2 className="font-bold text-sm text-white">Transcript</h2>
            <span className="text-[10px] font-mono bg-purple-500/20 text-purple-300 px-2 py-0.5 rounded-full border border-purple-500/30">
              {words.length} Words
            </span>
          </div>

          {/* Magic 1-Click Highlight Button */}
          <button
            onClick={handleAutoHighlight}
            className="text-[11px] font-bold px-2.5 py-1 rounded-lg bg-gradient-to-r from-amber-500/20 to-purple-500/20 hover:from-amber-500/30 hover:to-purple-500/30 text-amber-300 border border-amber-500/30 flex items-center gap-1.5 shadow-sm hover:scale-[1.02] transition-all"
            title="Auto-detect and highlight high-retention numbers and viral words"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>Magic Highlight</span>
          </button>
        </div>

        {/* Search & Find/Replace Bar */}
        <div className="space-y-2">
          <div className="flex items-center gap-1.5">
            <div className="relative flex-1">
              <Search className="w-3.5 h-3.5 text-[#707088] absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search words..."
                className="w-full bg-[#18182c] border border-white/[0.08] rounded-xl pl-8 pr-3 py-1.5 text-xs text-white placeholder-[#707088] focus:outline-none focus:border-purple-500 transition-colors"
              />
            </div>

            <button
              onClick={() => setShowReplace(!showReplace)}
              className={`p-2 rounded-xl border text-xs transition-colors ${
                showReplace
                  ? 'bg-purple-600 text-white border-purple-500'
                  : 'bg-[#18182c] text-[#8888a0] hover:text-white border-white/[0.08]'
              }`}
              title="Find and replace text"
            >
              <Replace className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Replace Drawer */}
          {showReplace && (
            <div className="p-2.5 bg-[#16162a] rounded-xl border border-white/[0.08] flex items-center gap-2">
              <input
                type="text"
                value={replaceText}
                onChange={(e) => setReplaceText(e.target.value)}
                placeholder="Replace with..."
                className="flex-1 bg-[#101020] border border-white/[0.08] rounded-lg px-2.5 py-1 text-xs text-white placeholder-[#606078] focus:outline-none focus:border-purple-500"
              />
              <button
                onClick={handleReplaceAll}
                disabled={!search.trim()}
                className="px-3 py-1 rounded-lg bg-purple-600 hover:bg-purple-500 disabled:opacity-40 text-white font-bold text-xs shrink-0 shadow-md transition-all"
              >
                Replace All
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Words List Scrollable Area */}
      <div className="flex-1 overflow-y-auto p-3 space-y-1.5">
        {filteredWords.length === 0 ? (
          <div className="text-center py-12 text-xs text-[#707088]">
            {search ? 'No words matching search query' : 'No words transcribed yet.'}
          </div>
        ) : (
          filteredWords.map((item) => {
            const idx = item.originalIdx;
            const isSpoken = currentTime >= item.start && currentTime <= item.end;
            const isSelected = selectedWordIndex === idx;
            const hasMultipleWords = (item.punctuated_word || item.word || '').trim().includes(' ');

            return (
              <div
                key={idx}
                onClick={() => onSelectWord(idx)}
                className={`p-2.5 rounded-xl border transition-all text-xs flex items-center justify-between gap-3 ${
                  isSelected
                    ? 'bg-purple-950/40 border-purple-500/60 shadow-md'
                    : isSpoken
                    ? 'bg-amber-500/10 border-amber-500/30'
                    : 'bg-[#141426] border-white/[0.04] hover:border-white/10'
                }`}
              >
                {/* Left: Play button & Timestamps */}
                <div className="flex items-center gap-2 shrink-0">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onSeek(item.start);
                    }}
                    className="w-6 h-6 rounded-lg bg-white/[0.05] hover:bg-purple-600 hover:text-white text-[#9090a8] flex items-center justify-center transition-colors"
                    title="Jump to word"
                  >
                    <Play className="w-3 h-3 fill-current ml-0.5" />
                  </button>
                  <span className="font-mono text-[10px] text-[#707088]">
                    {item.start.toFixed(2)}s
                  </span>
                </div>

                {/* Center: Editable Word Text */}
                <input
                  type="text"
                  value={item.punctuated_word || item.word}
                  onChange={(e) => {
                    onUpdateWord(idx, {
                      word: e.target.value,
                      punctuated_word: e.target.value
                    });
                  }}
                  className={`flex-1 bg-transparent border-b border-transparent focus:border-purple-400 focus:outline-none font-bold text-sm tracking-tight px-1 py-0.5 transition-colors ${
                    item.highlight ? 'text-amber-400' : 'text-white'
                  }`}
                />

                {/* Right: Actions (Merge, Split, Emoji, Highlight, Delete) */}
                <div className="flex items-center gap-1 shrink-0 relative">
                  {/* Merge with next word */}
                  {idx < words.length - 1 && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleMergeNext(idx);
                      }}
                      className="w-6 h-6 rounded-md bg-white/[0.04] hover:bg-white/10 text-[#8888a0] hover:text-white flex items-center justify-center transition-colors"
                      title="Merge with next word"
                    >
                      <Combine className="w-3 h-3" />
                    </button>
                  )}

                  {/* Split word if compound */}
                  {hasMultipleWords && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleSplitWord(idx);
                      }}
                      className="w-6 h-6 rounded-md bg-white/[0.04] hover:bg-white/10 text-[#8888a0] hover:text-white flex items-center justify-center transition-colors"
                      title="Split into separate words"
                    >
                      <Split className="w-3 h-3" />
                    </button>
                  )}

                  {/* Emoji Button */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setActiveEmojiPickerIdx(activeEmojiPickerIdx === idx ? null : idx);
                    }}
                    className={`w-7 h-7 rounded-lg flex items-center justify-center transition-colors ${
                      item.emoji
                        ? 'bg-purple-600/30 text-white border border-purple-500/40'
                        : 'bg-white/[0.04] hover:bg-white/10 text-[#8888a0]'
                    }`}
                    title="Assign Emoji"
                  >
                    {item.emoji ? <span className="text-sm">{item.emoji}</span> : <Smile className="w-3.5 h-3.5" />}
                  </button>

                  {/* Highlight Color Toggle */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onUpdateWord(idx, { highlight: !item.highlight });
                    }}
                    className={`w-7 h-7 rounded-lg flex items-center justify-center transition-colors ${
                      item.highlight
                        ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                        : 'bg-white/[0.04] hover:bg-white/10 text-[#8888a0]'
                    }`}
                    title="Highlight Word Color"
                  >
                    <Highlighter className="w-3.5 h-3.5" />
                  </button>

                  {/* Delete Word */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onDeleteWord(idx);
                    }}
                    className="w-7 h-7 rounded-lg bg-white/[0.04] hover:bg-red-500/20 hover:text-red-400 text-[#8888a0] flex items-center justify-center transition-colors"
                    title="Delete Word"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>

                  {/* Floating Quick Emoji Picker Popover */}
                  {activeEmojiPickerIdx === idx && (
                    <div
                      onClick={(e) => e.stopPropagation()}
                      className="absolute right-0 top-9 z-50 p-2.5 bg-[#1b1b32] border border-white/15 rounded-2xl shadow-2xl flex flex-wrap gap-1.5 w-44"
                    >
                      {commonEmojis.map((em) => (
                        <button
                          key={em}
                          onClick={() => {
                            onUpdateWord(idx, { emoji: em });
                            setActiveEmojiPickerIdx(null);
                          }}
                          className="w-7 h-7 text-sm rounded-lg hover:bg-white/15 flex items-center justify-center transition-transform hover:scale-125"
                        >
                          {em}
                        </button>
                      ))}
                      {item.emoji && (
                        <button
                          onClick={() => {
                            onUpdateWord(idx, { emoji: undefined });
                            setActiveEmojiPickerIdx(null);
                          }}
                          className="w-full text-[10px] text-red-400 py-1 hover:bg-white/5 rounded-lg mt-1 font-semibold transition-colors"
                        >
                          Clear Emoji
                        </button>
                      )}
                    </div>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
