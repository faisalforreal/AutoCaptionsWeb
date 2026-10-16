import React, { useState } from 'react';
import { X, Download, FileText, CheckCircle2, Film, Sparkles, Loader2, Heart } from 'lucide-react';
import confetti from 'canvas-confetti';
import { TemplateConfig, Word } from '../../types';
import {
  exportCaptionedVideoClientSide,
  generateSRT,
  generateVTT,
  downloadBlob,
  ExportProgress
} from '../../engine/clientVideoExporter';

interface ExportModalProps {
  isOpen: boolean;
  onClose: () => void;
  videoElement: HTMLVideoElement | null;
  words: Word[];
  config: TemplateConfig;
  projectName: string;
  onOpenSupport?: () => void;
}

export const ExportModal: React.FC<ExportModalProps> = ({
  isOpen,
  onClose,
  videoElement,
  words,
  config,
  projectName,
  onOpenSupport
}) => {
  const [resolution, setResolution] = useState<'1080p' | '720p'>('1080p');
  const [isExporting, setIsExporting] = useState(false);
  const [progress, setProgress] = useState<ExportProgress | null>(null);
  const [exportedBlob, setExportedBlob] = useState<Blob | null>(null);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleStartExport = async () => {
    if (!videoElement) {
      setError('Video is not loaded properly');
      return;
    }

    setIsExporting(true);
    setError(null);
    setProgress({ percent: 0, currentFrame: 0, totalFrames: 0, fps: 0, elapsedSec: 0 });

    try {
      const blob = await exportCaptionedVideoClientSide({
        videoElement,
        words,
        config,
        resolution,
        onProgress: (p) => setProgress(p)
      });

      setExportedBlob(blob);
      setIsExporting(false);

      // Trigger celebratory confetti
      confetti({
        particleCount: 80,
        spread: 60,
        origin: { y: 0.6 }
      });
    } catch (err: any) {
      console.error('Export error:', err);
      setError(err.message || 'Failed to render video in browser');
      setIsExporting(false);
    }
  };

  const handleDownloadVideo = () => {
    if (exportedBlob) {
      downloadBlob(exportedBlob, `${projectName || 'captioned_video'}_${resolution}.mp4`);
    }
  };

  const handleDownloadSRT = () => {
    const srtContent = generateSRT(words, config.wordsPerLineCount);
    const blob = new Blob([srtContent], { type: 'text/plain;charset=utf-8' });
    downloadBlob(blob, `${projectName || 'subtitles'}.srt`);
  };

  const handleDownloadVTT = () => {
    const vttContent = generateVTT(words, config.wordsPerLineCount);
    const blob = new Blob([vttContent], { type: 'text/vtt;charset=utf-8' });
    downloadBlob(blob, `${projectName || 'subtitles'}.vtt`);
  };

  const handleDownloadScript = () => {
    const textContent = words.map(w => w.punctuated_word || w.word).join(' ');
    const blob = new Blob([textContent], { type: 'text/plain;charset=utf-8' });
    downloadBlob(blob, `${projectName || 'transcript'}_script.txt`);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md select-none">
      <div className="relative w-full max-w-md bg-[#131326] border border-white/10 rounded-2xl shadow-2xl p-6 overflow-hidden">
        {/* Close Button */}
        <button
          onClick={onClose}
          disabled={isExporting}
          className="absolute top-4 right-4 p-1.5 rounded-lg bg-white/[0.05] hover:bg-white/10 text-[#8888a0] hover:text-white transition-colors"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Modal Header */}
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-xl bg-purple-600/20 border border-purple-500/30 flex items-center justify-center">
            <Film className="w-5 h-5 text-purple-400" />
          </div>
          <div>
            <h3 className="font-bold text-base text-white tracking-tight">
              Export Captioned Video
            </h3>
            <p className="text-xs text-[#808098]">
              High Definition · 100% Free · No Watermark
            </p>
          </div>
        </div>

        {error && (
          <div className="mb-4 p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-xs text-red-300">
            {error}
          </div>
        )}

        {/* Exporting State */}
        {isExporting ? (
          <div className="py-8 flex flex-col items-center justify-center text-center space-y-4">
            {/* Circular / Bar Progress */}
            <div className="w-full bg-[#1c1c36] h-3 rounded-full overflow-hidden border border-white/[0.06]">
              <div
                className="h-full bg-gradient-to-r from-purple-500 to-pink-500 transition-all duration-200"
                style={{ width: `${progress?.percent || 0}%` }}
              />
            </div>

            <div className="flex items-center justify-between w-full text-xs text-[#a0a0b8] font-mono">
              <span className="flex items-center gap-1.5">
                <Loader2 className="w-3.5 h-3.5 animate-spin text-purple-400" />
                Rendering frames...
              </span>
              <span className="font-bold text-white">{progress?.percent || 0}%</span>
            </div>

            <div className="grid grid-cols-2 gap-2 w-full pt-2 text-[11px] text-[#707088] font-mono">
              <div className="p-2 bg-[#18182e] rounded-lg">
                FPS: <span className="text-white font-bold">{progress?.fps || 0}</span>
              </div>
              <div className="p-2 bg-[#18182e] rounded-lg">
                Elapsed: <span className="text-white font-bold">{progress?.elapsedSec || 0}s</span>
              </div>
            </div>

            <p className="text-[11px] text-[#808098] italic pt-2">
              Rendering your high-definition video...
            </p>
          </div>
        ) : exportedBlob ? (
          /* Finished State */
          <div className="py-6 flex flex-col items-center text-center space-y-4">
            <div className="w-12 h-12 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center">
              <CheckCircle2 className="w-7 h-7" />
            </div>

            <div>
              <h4 className="font-bold text-base text-white">Video Render Complete!</h4>
              <p className="text-xs text-[#808098] mt-1">
                Your video has been rendered in crisp {resolution} with animated subtitles and audio.
              </p>
            </div>

            <button
              onClick={handleDownloadVideo}
              className="w-full py-3 px-5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-sm flex items-center justify-center gap-2 shadow-lg shadow-purple-600/30 transition-all hover:scale-[1.01]"
            >
              <Download className="w-4 h-4" />
              <span>Download MP4 Video</span>
            </button>

            {/* Subtitle & script file exports */}
            <div className="grid grid-cols-3 gap-2 w-full pt-2">
              <button
                onClick={handleDownloadSRT}
                className="py-2 px-2 rounded-lg bg-white/[0.05] hover:bg-white/10 text-[11px] font-semibold text-white flex items-center justify-center gap-1 transition-colors"
                title="Download .SRT Subtitles"
              >
                <FileText className="w-3 h-3 text-purple-400" />
                <span>.SRT</span>
              </button>

              <button
                onClick={handleDownloadVTT}
                className="py-2 px-2 rounded-lg bg-white/[0.05] hover:bg-white/10 text-[11px] font-semibold text-white flex items-center justify-center gap-1 transition-colors"
                title="Download .VTT Subtitles"
              >
                <FileText className="w-3 h-3 text-purple-400" />
                <span>.VTT</span>
              </button>

              <button
                onClick={handleDownloadScript}
                className="py-2 px-2 rounded-lg bg-white/[0.05] hover:bg-white/10 text-[11px] font-semibold text-white flex items-center justify-center gap-1 transition-colors"
                title="Download plain text script"
              >
                <FileText className="w-3 h-3 text-amber-400" />
                <span>Script .TXT</span>
              </button>
            </div>

            {/* Support the Creator prompt */}
            {onOpenSupport && (
              <div className="w-full pt-4 mt-1 border-t border-white/[0.06] text-center">
                <p className="text-xs text-[#808098] mb-2.5">
                  Love your captioned video? Help keep AutoCaption free!
                </p>
                <button
                  onClick={onOpenSupport}
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-pink-500/15 hover:bg-pink-500/25 border border-pink-500/30 text-pink-300 text-xs font-bold transition-all hover:scale-[1.02] shadow-sm shadow-pink-500/10"
                >
                  <Heart className="w-3.5 h-3.5 fill-pink-400" />
                  <span>Support the Creator</span>
                </button>
              </div>
            )}
          </div>
        ) : (
          /* Pre-Export Options State */
          <div className="space-y-6">
            {/* Resolution Selector */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-[#a0a0b8] block">
                Export Resolution
              </label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setResolution('1080p')}
                  className={`p-3 rounded-xl border text-left transition-all ${
                    resolution === '1080p'
                      ? 'bg-purple-600/20 border-purple-500 text-white shadow-md'
                      : 'bg-[#18182c] border-white/[0.06] text-[#808098] hover:text-white'
                  }`}
                >
                  <div className="font-bold text-sm">1080p Full HD</div>
                  <div className="text-[10px] text-[#707088] mt-0.5">Recommended for TikTok & Reels</div>
                </button>

                <button
                  type="button"
                  onClick={() => setResolution('720p')}
                  className={`p-3 rounded-xl border text-left transition-all ${
                    resolution === '720p'
                      ? 'bg-purple-600/20 border-purple-500 text-white shadow-md'
                      : 'bg-[#18182c] border-white/[0.06] text-[#808098] hover:text-white'
                  }`}
                >
                  <div className="font-bold text-sm">720p HD</div>
                  <div className="text-[10px] text-[#707088] mt-0.5">Faster export for quick drafts</div>
                </button>
              </div>
            </div>

            {/* Subtitle files direct download option */}
            <div className="pt-2 border-t border-white/[0.06]">
              <span className="text-[11px] text-[#808098] block mb-2">
                Need only the subtitle files?
              </span>
              <div className="flex gap-2">
                <button
                  onClick={handleDownloadSRT}
                  className="flex-1 py-2 px-2 rounded-lg bg-white/[0.04] hover:bg-white/10 text-xs text-[#a0a0b8] hover:text-white flex items-center justify-center gap-1.5 transition-colors"
                >
                  <FileText className="w-3.5 h-3.5" />
                  <span>.SRT</span>
                </button>
                <button
                  onClick={handleDownloadVTT}
                  className="flex-1 py-2 px-2 rounded-lg bg-white/[0.04] hover:bg-white/10 text-xs text-[#a0a0b8] hover:text-white flex items-center justify-center gap-1.5 transition-colors"
                >
                  <FileText className="w-3.5 h-3.5" />
                  <span>.VTT</span>
                </button>
                <button
                  onClick={handleDownloadScript}
                  className="flex-1 py-2 px-2 rounded-lg bg-white/[0.04] hover:bg-white/10 text-xs text-[#a0a0b8] hover:text-white flex items-center justify-center gap-1.5 transition-colors"
                >
                  <FileText className="w-3.5 h-3.5 text-amber-400" />
                  <span>Script .TXT</span>
                </button>
              </div>
            </div>

            {/* Start Export Button */}
            <button
              onClick={handleStartExport}
              className="w-full py-3.5 px-6 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-bold text-sm flex items-center justify-center gap-2 shadow-lg shadow-purple-600/30 transition-all hover:scale-[1.01]"
            >
              <Sparkles className="w-4 h-4 text-purple-200" />
              <span>Export Video Now</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
