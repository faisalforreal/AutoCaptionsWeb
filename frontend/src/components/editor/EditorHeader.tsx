import { ArrowLeft, Download, Video, Sparkles, Smartphone, Monitor, Square, SmartphoneCharging, Heart, PlusCircle, Check } from 'lucide-react';
import { AspectRatio } from '../../types';

interface EditorHeaderProps {
  projectName: string;
  onBack: () => void;
  aspectRatio: AspectRatio;
  onChangeAspectRatio: (ratio: AspectRatio) => void;
  onOpenExport: () => void;
  onOpenSupport?: () => void;
  onNewProject?: () => void;
  isTranscribing: boolean;
}

export const EditorHeader: React.FC<EditorHeaderProps> = ({
  projectName,
  onBack,
  aspectRatio,
  onChangeAspectRatio,
  onOpenExport,
  onOpenSupport,
  onNewProject,
  isTranscribing
}) => {
  const ratios: { label: string; value: AspectRatio; icon: any }[] = [
    { label: '9:16 Reels/TikTok', value: '9:16', icon: Smartphone },
    { label: '1:1 Square', value: '1:1', icon: Square },
    { label: '16:9 YouTube', value: '16:9', icon: Monitor },
    { label: '4:5 Feed', value: '4:5', icon: SmartphoneCharging },
  ];

  return (
    <header className="h-16 border-b border-white/[0.08] bg-[#0d0d1a] px-4 md:px-6 flex items-center justify-between z-40 shrink-0">
      {/* Back button & Title */}
      <div className="flex items-center gap-4">
        <button
          onClick={onBack}
          className="p-2 rounded-xl bg-white/[0.05] hover:bg-white/10 text-white transition-colors"
          title="Back to home"
        >
          <ArrowLeft className="w-4 h-4" />
        </button>

        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-purple-600 flex items-center justify-center">
            <Video className="w-4 h-4 text-white" />
          </div>
          <span className="font-bold text-sm text-white max-w-[160px] sm:max-w-xs truncate">
            {projectName || 'Untitled Video'}
          </span>
          {isTranscribing ? (
            <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30 flex items-center gap-1 animate-pulse">
              <Sparkles className="w-3 h-3" /> Generating captions...
            </span>
          ) : (
            <span className="hidden lg:flex text-[10px] text-[#707088] items-center gap-1">
              <Check className="w-3 h-3 text-emerald-400" /> Saved
            </span>
          )}
        </div>
      </div>

      {/* Aspect Ratio Switcher */}
      <div className="hidden md:flex items-center bg-[#141428] rounded-xl p-1 border border-white/[0.06]">
        {ratios.map((r) => {
          const Icon = r.icon;
          const isActive = aspectRatio === r.value;
          return (
            <button
              key={r.value}
              onClick={() => onChangeAspectRatio(r.value)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                isActive
                  ? 'bg-purple-600 text-white shadow-md'
                  : 'text-[#8888a0] hover:text-white'
              }`}
              title={r.label}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{r.value}</span>
            </button>
          );
        })}
      </div>

      {/* Action CTA Buttons */}
      <div className="flex items-center gap-2.5">
        {onNewProject && (
          <button
            onClick={onNewProject}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl border border-white/[0.08] bg-white/[0.04] hover:bg-white/10 text-[#a0a0b8] hover:text-white text-xs font-semibold transition-all"
            title="Start fresh with a new video"
          >
            <PlusCircle className="w-3.5 h-3.5 text-purple-400" />
            <span className="hidden sm:inline">New Video</span>
          </button>
        )}

        {onOpenSupport && (
          <button
            onClick={onOpenSupport}
            className="hidden sm:flex items-center gap-1.5 px-3 py-2 rounded-full border border-pink-500/30 bg-pink-500/10 hover:bg-pink-500/20 text-pink-300 text-xs font-semibold transition-all hover:scale-[1.02] active:scale-[0.98]"
            title="Support the Creator"
          >
            <Heart className="w-3.5 h-3.5 text-pink-400 fill-pink-400" />
            <span>Support</span>
          </button>
        )}

        <button
          onClick={onOpenExport}
          className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-bold text-xs sm:text-sm px-4 sm:px-5 py-2.5 rounded-full flex items-center gap-2 shadow-lg shadow-purple-600/30 hover:scale-[1.02] active:scale-[0.98] transition-all"
        >
          <Download className="w-4 h-4" />
          <span>Export 1080p MP4</span>
        </button>
      </div>
    </header>
  );
};
