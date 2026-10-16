import React, { useRef, useEffect, useState, useCallback } from 'react';
import { Play, Pause, RotateCcw, Volume2, VolumeX, ShieldAlert, AlignLeft, AlignCenter, AlignRight } from 'lucide-react';
import { AspectRatio, TemplateConfig, Word } from '../../types';
import { renderSubtitlesOnCanvas } from '../../engine/subtitleCanvasRenderer';

interface VideoCanvasPlayerProps {
  videoUrl: string;
  words: Word[];
  config: TemplateConfig;
  aspectRatio: AspectRatio;
  currentTime: number;
  duration: number;
  isPlaying: boolean;
  onTimeUpdate: (time: number) => void;
  onTogglePlay: () => void;
  onDurationChange: (dur: number) => void;
  onUpdateConfig: (updated: Partial<TemplateConfig>) => void;
  videoRef: React.RefObject<HTMLVideoElement>;
}

export const VideoCanvasPlayer: React.FC<VideoCanvasPlayerProps> = ({
  videoUrl,
  words,
  config,
  aspectRatio,
  currentTime,
  duration,
  isPlaying,
  onTimeUpdate,
  onTogglePlay,
  onDurationChange,
  onUpdateConfig,
  videoRef
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isMuted, setIsMuted] = useState(false);
  const [isDraggingPos, setIsDraggingPos] = useState(false);
  const [showSafeZone, setShowSafeZone] = useState(false);
  const [playbackRate, setPlaybackRate] = useState(1);

  // Setup aspect ratio classes
  const aspectClass = {
    '9:16': 'aspect-[9/16] max-h-[66vh]',
    '1:1': 'aspect-square max-h-[66vh]',
    '16:9': 'aspect-[16/9] max-w-full',
    '4:5': 'aspect-[4/5] max-h-[66vh]',
  }[aspectRatio] || 'aspect-[9/16]';

  // Video timeupdate handler
  const handleVideoTimeUpdate = () => {
    if (videoRef.current) {
      onTimeUpdate(videoRef.current.currentTime);
    }
  };

  // Video loadedmetadata handler
  const handleLoadedMetadata = () => {
    if (videoRef.current) {
      onDurationChange(videoRef.current.duration);
    }
  };

  // Render loop syncing Canvas with Video and Subtitles
  const drawFrame = useCallback(() => {
    const canvas = canvasRef.current;
    const video = videoRef.current;
    if (!canvas || !video) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Use video native or canvas dimensions
    const width = canvas.width;
    const height = canvas.height;

    // Clear and draw black backdrop
    ctx.fillStyle = '#000000';
    ctx.fillRect(0, 0, width, height);

    // Draw video frame (letterboxed)
    if (video.readyState >= 2) {
      const vAspect = video.videoWidth / video.videoHeight;
      const cAspect = width / height;

      let drawW = width;
      let drawH = height;
      let drawX = 0;
      let drawY = 0;

      if (vAspect > cAspect) {
        drawH = width / vAspect;
        drawY = (height - drawH) / 2;
      } else {
        drawW = height * vAspect;
        drawX = (width - drawW) / 2;
      }

      ctx.drawImage(video, drawX, drawY, drawW, drawH);
    }

    // Render animated subtitles
    renderSubtitlesOnCanvas({
      ctx,
      canvasWidth: width,
      canvasHeight: height,
      currentTime: video.currentTime,
      words,
      config
    });
  }, [words, config]);

  // RequestAnimationFrame animation loop when playing
  useEffect(() => {
    let animId: number;
    const loop = () => {
      drawFrame();
      animId = requestAnimationFrame(loop);
    };
    loop();
    return () => cancelAnimationFrame(animId);
  }, [drawFrame]);

  // Handle dragging vertical caption position on canvas
  const handleCanvasMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    setIsDraggingPos(true);
    updatePosYFromEvent(e.clientY);
  };

  const handleCanvasMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (isDraggingPos) {
      updatePosYFromEvent(e.clientY);
    }
  };

  const updatePosYFromEvent = (clientY: number) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const y = clientY - rect.top;
    const percent = Math.max(10, Math.min(90, Math.round((y / rect.height) * 100)));
    onUpdateConfig({
      sizes: {
        ...config.sizes,
        posY: percent
      }
    });
  };

  const handleAdjustFontSize = (delta: number) => {
    const newSize = Math.max(20, Math.min(96, config.sizes.fontSize + delta));
    onUpdateConfig({ sizes: { ...config.sizes, fontSize: newSize } });
  };

  const handleSetFontSize = (size: number) => {
    onUpdateConfig({ sizes: { ...config.sizes, fontSize: size } });
  };

  const handleSetPosition = (posY: number) => {
    onUpdateConfig({ sizes: { ...config.sizes, posY } });
  };

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = Math.floor(secs % 60);
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  return (
    <div className="flex flex-col items-center justify-center p-3 h-full relative select-none">
      {/* Hidden Native Video element providing frames and audio */}
      <video
        ref={videoRef}
        src={videoUrl}
        crossOrigin="anonymous"
        playsInline
        onTimeUpdate={handleVideoTimeUpdate}
        onLoadedMetadata={handleLoadedMetadata}
        onEnded={() => {
          if (videoRef.current) {
            videoRef.current.currentTime = 0;
            onTimeUpdate(0);
          }
        }}
        className="hidden"
      />

      {/* Creator Quick Toolbar Above Player */}
      <div className="mb-2 flex flex-wrap items-center justify-center gap-2 z-20 max-w-full px-2">
        {/* Font Size Stepper & Quick S/M/L/XL Pills */}
        <div className="flex items-center bg-[#141426] border border-white/[0.08] rounded-xl p-1 gap-1 shadow-lg">
          <span className="text-[10px] text-[#808098] font-bold px-1.5 hidden sm:inline">Text Size</span>
          <button
            onClick={() => handleAdjustFontSize(-4)}
            className="w-6 h-6 rounded-lg bg-white/[0.05] hover:bg-white/10 text-white font-bold flex items-center justify-center text-xs transition-colors"
            title="Decrease text size"
          >
            -
          </button>
          <span className="text-xs font-mono font-bold text-purple-300 px-1 min-w-[34px] text-center">
            {config.sizes.fontSize}px
          </span>
          <button
            onClick={() => handleAdjustFontSize(4)}
            className="w-6 h-6 rounded-lg bg-white/[0.05] hover:bg-white/10 text-white font-bold flex items-center justify-center text-xs transition-colors"
            title="Increase text size"
          >
            +
          </button>

          <div className="w-px h-4 bg-white/10 mx-0.5" />

          {/* Quick Size Pills */}
          {[
            { label: 'S', size: 36 },
            { label: 'M', size: 48 },
            { label: 'L', size: 60 },
            { label: 'XL', size: 76 }
          ].map((sz) => (
            <button
              key={sz.label}
              onClick={() => handleSetFontSize(sz.size)}
              className={`px-2 py-0.5 rounded-md text-[10px] font-bold transition-colors ${
                config.sizes.fontSize === sz.size
                  ? 'bg-purple-600 text-white'
                  : 'text-[#808098] hover:text-white'
              }`}
            >
              {sz.label}
            </button>
          ))}
        </div>

        {/* Quick Position Snap Pills */}
        <div className="hidden sm:flex items-center bg-[#141426] border border-white/[0.08] rounded-xl p-1 gap-1 shadow-lg">
          <span className="text-[10px] text-[#808098] font-bold px-1.5">Position</span>
          {[
            { label: 'Top', pos: 22 },
            { label: 'Center', pos: 50 },
            { label: 'Bottom', pos: 76 }
          ].map((p) => (
            <button
              key={p.label}
              onClick={() => handleSetPosition(p.pos)}
              className={`px-2 py-0.5 rounded-md text-[10px] font-bold transition-colors ${
                Math.abs(config.sizes.posY - p.pos) < 5
                  ? 'bg-purple-600 text-white'
                  : 'text-[#808098] hover:text-white'
              }`}
            >
              {p.label}
            </button>
          ))}
        </div>

        {/* Safe Zone Overlay Toggle */}
        <button
          onClick={() => setShowSafeZone(!showSafeZone)}
          className={`flex items-center gap-1.5 px-2.5 py-1 rounded-xl border text-xs font-semibold shadow-lg transition-colors ${
            showSafeZone
              ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
              : 'bg-[#141426] text-[#8888a0] hover:text-white border-white/[0.08]'
          }`}
          title="Toggle TikTok & Instagram safe margins guide"
        >
          <ShieldAlert className="w-3.5 h-3.5" />
          <span className="text-[10px] font-bold">Safe Zone</span>
        </button>
      </div>

      {/* Main Canvas Viewport Container */}
      <div className={`relative ${aspectClass} rounded-2xl overflow-hidden border border-white/10 shadow-2xl bg-black flex items-center justify-center group`}>
        <canvas
          ref={canvasRef}
          width={1080}
          height={aspectRatio === '1:1' ? 1080 : aspectRatio === '16:9' ? 608 : 1920}
          onMouseDown={handleCanvasMouseDown}
          onMouseMove={handleCanvasMouseMove}
          onMouseUp={() => setIsDraggingPos(false)}
          onMouseLeave={() => setIsDraggingPos(false)}
          className="w-full h-full object-contain cursor-ns-resize"
          title="Drag up or down to reposition captions"
        />

        {/* Position Guide Line when dragging */}
        {isDraggingPos && (
          <div
            className="absolute left-0 right-0 h-0.5 bg-purple-500 shadow-[0_0_8px_rgba(168,85,247,0.8)] pointer-events-none z-30"
            style={{ top: `${config.sizes.posY}%` }}
          >
            <span className="absolute right-3 -top-5 text-[10px] font-mono bg-purple-600 px-2 py-0.5 rounded text-white font-bold">
              Y: {config.sizes.posY}%
            </span>
          </div>
        )}

        {/* Safe Zone Visual Overlay (TikTok & Reels UI Guide) */}
        {showSafeZone && (
          <div className="absolute inset-0 pointer-events-none z-20">
            {/* Top header zone */}
            <div className="absolute top-0 left-0 right-0 h-[14%] bg-red-500/10 border-b border-red-500/20 flex items-center justify-center">
              <span className="text-[9px] text-red-300/80 font-bold tracking-wider uppercase">Header Zone</span>
            </div>
            {/* Bottom description & audio zone */}
            <div className="absolute bottom-0 left-0 right-0 h-[22%] bg-red-500/10 border-t border-red-500/20 flex items-center justify-center">
              <span className="text-[9px] text-red-300/80 font-bold tracking-wider uppercase">Caption & Audio Zone</span>
            </div>
            {/* Right side interaction buttons */}
            <div className="absolute top-[14%] bottom-[22%] right-0 w-[18%] bg-red-500/10 border-l border-red-500/20 flex items-center justify-center">
              <span className="text-[8px] text-red-300/80 font-bold -rotate-90 whitespace-nowrap uppercase">Buttons</span>
            </div>

            {/* Safe Area Box */}
            <div className="absolute top-[14%] bottom-[22%] left-[6%] right-[18%] border-2 border-dashed border-emerald-400/60 rounded-xl flex items-start justify-start p-1.5">
              <span className="text-[9px] font-bold text-emerald-300 bg-emerald-950/80 px-1.5 py-0.5 rounded border border-emerald-500/30">
                Safe Area
              </span>
            </div>
          </div>
        )}

        {/* Floating Quick Play Overlay */}
        <button
          onClick={onTogglePlay}
          className="absolute inset-0 flex items-center justify-center bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-10"
        >
          <div className="w-16 h-16 rounded-full bg-purple-600/90 hover:bg-purple-600 text-white flex items-center justify-center shadow-xl backdrop-blur-md transition-transform hover:scale-110">
            {isPlaying ? (
              <Pause className="w-7 h-7 fill-white" />
            ) : (
              <Play className="w-7 h-7 fill-white ml-1" />
            )}
          </div>
        </button>
      </div>

      {/* Floating Bottom Media Bar */}
      <div className="mt-3 flex items-center gap-3 bg-[#141426] border border-white/[0.08] px-4 py-2 rounded-2xl shadow-xl z-20">
        <button
          onClick={() => {
            if (videoRef.current) {
              videoRef.current.currentTime = 0;
              onTimeUpdate(0);
            }
          }}
          className="text-[#8888a0] hover:text-white transition-colors"
          title="Restart video"
        >
          <RotateCcw className="w-4 h-4" />
        </button>

        <button
          onClick={onTogglePlay}
          className="w-7 h-7 rounded-full bg-purple-600 text-white flex items-center justify-center shadow-md hover:bg-purple-500 transition-colors"
        >
          {isPlaying ? <Pause className="w-3.5 h-3.5 fill-white" /> : <Play className="w-3.5 h-3.5 fill-white ml-0.5" />}
        </button>

        {/* Time counter */}
        <span className="text-xs font-mono font-medium text-[#a0a0b8]">
          {formatTime(currentTime)} / {formatTime(duration)}
        </span>

        <div className="w-px h-4 bg-white/10" />

        {/* Playback speed toggle */}
        <div className="flex items-center gap-1 bg-white/[0.04] p-0.5 rounded-lg border border-white/[0.06]">
          {[0.75, 1, 1.25, 1.5].map((spd) => (
            <button
              key={spd}
              onClick={() => {
                setPlaybackRate(spd);
                if (videoRef.current) videoRef.current.playbackRate = spd;
              }}
              className={`px-1.5 py-0.5 rounded text-[10px] font-mono font-bold transition-colors ${
                playbackRate === spd
                  ? 'bg-purple-600 text-white shadow-sm'
                  : 'text-[#707088] hover:text-white'
              }`}
            >
              {spd}x
            </button>
          ))}
        </div>

        <div className="w-px h-4 bg-white/10" />

        {/* Volume toggle */}
        <button
          onClick={() => {
            if (videoRef.current) {
              videoRef.current.muted = !isMuted;
              setIsMuted(!isMuted);
            }
          }}
          className="text-[#8888a0] hover:text-white transition-colors"
        >
          {isMuted ? <VolumeX className="w-4 h-4 text-red-400" /> : <Volume2 className="w-4 h-4" />}
        </button>
      </div>
    </div>
  );
};
