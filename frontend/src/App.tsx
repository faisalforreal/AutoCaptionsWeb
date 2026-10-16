import React, { useState, useRef, useEffect } from 'react';
import { UploadCloud, Sparkles, Film, ArrowRight, Loader2, Play } from 'lucide-react';
import { Navbar } from './components/landing/Navbar';
import { HeroSection } from './components/landing/HeroSection';
import { SocialProofMarquee } from './components/landing/SocialProofMarquee';
import { FeaturesGrid } from './components/landing/FeaturesGrid';
import { TemplateShowcase } from './components/landing/TemplateShowcase';
import { HowItWorks } from './components/landing/HowItWorks';
import { FaqSection } from './components/landing/FaqSection';
import { Footer } from './components/landing/Footer';

import { EditorHeader } from './components/editor/EditorHeader';
import { VideoCanvasPlayer } from './components/editor/VideoCanvasPlayer';
import { SubtitleTimeline } from './components/editor/SubtitleTimeline';
import { TranscriptList } from './components/editor/TranscriptList';
import { TemplateGallery } from './components/editor/TemplateGallery';
import { StyleControls } from './components/editor/StyleControls';
import { ExportModal } from './components/editor/ExportModal';

import { AspectRatio, TemplateConfig, Word } from './types';
import { VIRAL_PRESETS } from './engine/presets';
import { extractAudioFromVideo } from './engine/audioExtractor';
import { ApiService } from './services/api';

// Sample demo words for instant testing
const DEMO_WORDS: Word[] = [
  { start: 0.1, end: 0.45, word: 'This', punctuated_word: 'This' },
  { start: 0.46, end: 0.72, word: 'is', punctuated_word: 'is' },
  { start: 0.73, end: 1.15, word: 'how', punctuated_word: 'how' },
  { start: 1.16, end: 1.48, word: 'top', punctuated_word: 'top' },
  { start: 1.49, end: 1.95, word: 'creators', punctuated_word: 'creators', emoji: '👑' },
  { start: 2.05, end: 2.38, word: 'make', punctuated_word: 'make' },
  { start: 2.39, end: 2.75, word: 'viral', punctuated_word: 'viral', highlight: true },
  { start: 2.76, end: 3.25, word: 'videos', punctuated_word: 'videos!', emoji: '🚀' },
  { start: 3.35, end: 3.65, word: 'in', punctuated_word: 'in' },
  { start: 3.66, end: 4.10, word: 'seconds', punctuated_word: 'seconds.', emoji: '⚡' },
  { start: 4.25, end: 4.65, word: 'Try', punctuated_word: 'Try' },
  { start: 4.66, end: 4.95, word: 'all', punctuated_word: 'all' },
  { start: 4.96, end: 5.45, word: 'sixteen', punctuated_word: 'sixteen' },
  { start: 5.46, end: 6.10, word: 'styles', punctuated_word: 'styles!', emoji: '🔥' }
];

export function App() {
  const [view, setView] = useState<'landing' | 'editor'>('landing');
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [videoUrl, setVideoUrl] = useState<string>('');
  const [projectName, setProjectName] = useState<string>('My Viral Reel');
  const [aspectRatio, setAspectRatio] = useState<AspectRatio>('9:16');

  // Video State
  const [currentTime, setCurrentTime] = useState<number>(0);
  const [duration, setDuration] = useState<number>(6.5);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  // Subtitles & Config
  const [words, setWords] = useState<Word[]>(DEMO_WORDS);
  const [config, setConfig] = useState<TemplateConfig>(VIRAL_PRESETS[0]); // Default Hormozi Bold
  const [selectedWordIndex, setSelectedWordIndex] = useState<number | null>(null);

  // Editor Sub-panels: 'transcript' | 'templates' | 'style'
  const [activeSidebarTab, setActiveSidebarTab] = useState<'transcript' | 'templates' | 'style'>('templates');

  // Processing & Export
  const [isTranscribing, setIsTranscribing] = useState(false);
  const [uploadStatus, setUploadStatus] = useState<string>('');
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);

  // Handle Video File Upload
  const handleFileUpload = async (file: File) => {
    setVideoFile(file);
    setProjectName(file.name.replace(/\.[^/.]+$/, ''));
    const url = URL.createObjectURL(file);
    setVideoUrl(url);
    setShowUploadModal(false);
    setView('editor');

    // Extract audio and transcribe
    setIsTranscribing(true);
    setUploadStatus('Preparing audio...');

    try {
      const { audioBlob, duration: audioDur } = await extractAudioFromVideo(file, (p) => {
        setUploadStatus(`Processing audio: ${p}%`);
      });

      setDuration(audioDur);
      setUploadStatus('Generating captions...');

      const result = await ApiService.transcribeAudio(audioBlob, 'en');

      if (result.words && result.words.length > 0) {
        setWords(result.words);
        setDuration(result.duration || audioDur);
      }
    } catch (err: any) {
      console.warn('Transcription fallback to demo words:', err.message);
      // Keep demo words if Deepgram API key is not yet set in backend/.env
    } finally {
      setIsTranscribing(false);
      setUploadStatus('');
    }
  };

  // Load Demo Project directly
  const handleLoadDemo = () => {
    // Generate a placeholder video blob with Canvas stream if user doesn't have an MP4
    const canvas = document.createElement('canvas');
    canvas.width = 1080;
    canvas.height = 1920;
    const ctx = canvas.getContext('2d');
    if (ctx) {
      // Draw background gradient
      const grad = ctx.createLinearGradient(0, 0, 1080, 1920);
      grad.addColorStop(0, '#1a103c');
      grad.addColorStop(1, '#0b0818');
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, 1080, 1920);
    }

    setVideoUrl(''); // Canvas will render directly in player
    setWords(DEMO_WORDS);
    setDuration(6.5);
    setProjectName('Demo Viral Reel (16 Styles)');
    setView('editor');
  };

  const handleTogglePlay = () => {
    if (videoRef.current) {
      if (videoRef.current.paused) {
        videoRef.current.play();
        setIsPlaying(true);
      } else {
        videoRef.current.pause();
        setIsPlaying(false);
      }
    } else {
      setIsPlaying(!isPlaying);
    }
  };

  const handleSeek = (time: number) => {
    setCurrentTime(time);
    if (videoRef.current) {
      videoRef.current.currentTime = time;
    }
  };

  const handleUpdateWord = (index: number, updated: Partial<Word>) => {
    setWords((prev) => {
      const copy = [...prev];
      copy[index] = { ...copy[index], ...updated };
      return copy;
    });
  };

  const handleDeleteWord = (index: number) => {
    setWords((prev) => prev.filter((_, i) => i !== index));
  };

  const handleBatchUpdateWords = (newWords: Word[]) => {
    setWords(newWords);
  };

  const handleUpdateConfig = (updated: Partial<TemplateConfig>) => {
    setConfig((prev) => ({ ...prev, ...updated }));
  };

  return (
    <div className="min-h-screen bg-[#0b0b15] text-white flex flex-col font-sans">
      {view === 'landing' ? (
        /* Marketing Landing Page View */
        <>
          <Navbar onOpenEditor={() => setShowUploadModal(true)} />
          <main className="flex-1">
            <HeroSection onOpenEditor={() => setShowUploadModal(true)} />
            <SocialProofMarquee />
            <FeaturesGrid />
            <TemplateShowcase onSelectPreset={(id) => {
              const found = VIRAL_PRESETS.find(p => p.id === id);
              if (found) setConfig(found);
              setShowUploadModal(true);
            }} />
            <HowItWorks />
            <FaqSection />
          </main>
          <Footer />

          {/* Upload Modal */}
          {showUploadModal && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
              <div className="relative w-full max-w-lg bg-[#141426] border border-white/10 rounded-3xl p-8 shadow-2xl">
                <button
                  onClick={() => setShowUploadModal(false)}
                  className="absolute top-5 right-5 text-[#8888a0] hover:text-white"
                >
                  ✕
                </button>

                <div className="text-center mb-6">
                  <div className="w-12 h-12 rounded-2xl bg-purple-600/20 border border-purple-500/30 flex items-center justify-center mx-auto mb-3">
                    <UploadCloud className="w-6 h-6 text-purple-400" />
                  </div>
                  <h3 className="text-xl font-bold text-white tracking-tight">
                    Upload your video
                  </h3>
                  <p className="text-xs text-[#808098] mt-1">
                    MP4, MOV, or WebM up to 4K. Ready in seconds.
                  </p>
                </div>

                {/* Dropzone */}
                <label className="border-2 border-dashed border-white/15 hover:border-purple-500/60 rounded-2xl p-8 flex flex-col items-center justify-center cursor-pointer transition-colors bg-[#0f0f1e] group mb-4">
                  <input
                    type="file"
                    accept="video/mp4,video/quicktime,video/webm,video/mkv"
                    onChange={(e) => {
                      if (e.target.files && e.target.files[0]) {
                        handleFileUpload(e.target.files[0]);
                      }
                    }}
                    className="hidden"
                  />
                  <Film className="w-10 h-10 text-[#606080] group-hover:text-purple-400 transition-colors mb-3" />
                  <span className="font-bold text-sm text-white mb-1">
                    Select video file from device
                  </span>
                  <span className="text-xs text-[#707088]">
                    or drag and drop here
                  </span>
                </label>

                {/* Instant Demo Option */}
                <div className="text-center pt-2 border-t border-white/[0.06]">
                  <button
                    onClick={handleLoadDemo}
                    className="text-xs text-purple-400 hover:text-purple-300 font-semibold flex items-center justify-center gap-1.5 mx-auto"
                  >
                    <span>Don't have a video handy? Try the interactive Demo Studio</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          )}
        </>
      ) : (
        /* Full Studio Editor View */
        <div className="h-screen flex flex-col overflow-hidden bg-[#0a0a14]">
          <EditorHeader
            projectName={projectName}
            onBack={() => setView('landing')}
            aspectRatio={aspectRatio}
            onChangeAspectRatio={setAspectRatio}
            onOpenExport={() => setIsExportModalOpen(true)}
            isTranscribing={isTranscribing}
          />

          {/* Main Workspace Split: Sidebar Tabs + Video Player Canvas */}
          <div className="flex-1 flex overflow-hidden">
            {/* Left Tools / Controls Sidebar */}
            <div className="w-full md:w-80 lg:w-96 flex flex-col shrink-0 border-r border-white/[0.08] bg-[#0f0f1e]">
              {/* Sidebar Navigation Tabs */}
              <div className="flex items-center border-b border-white/[0.08] bg-[#121224] p-1 shrink-0">
                <button
                  onClick={() => setActiveSidebarTab('templates')}
                  className={`flex-1 py-2 rounded-lg text-xs font-bold transition-colors ${
                    activeSidebarTab === 'templates'
                      ? 'bg-purple-600 text-white shadow-sm'
                      : 'text-[#8888a0] hover:text-white'
                  }`}
                >
                  16 Presets
                </button>
                <button
                  onClick={() => setActiveSidebarTab('transcript')}
                  className={`flex-1 py-2 rounded-lg text-xs font-bold transition-colors ${
                    activeSidebarTab === 'transcript'
                      ? 'bg-purple-600 text-white shadow-sm'
                      : 'text-[#8888a0] hover:text-white'
                  }`}
                >
                  Transcript
                </button>
                <button
                  onClick={() => setActiveSidebarTab('style')}
                  className={`flex-1 py-2 rounded-lg text-xs font-bold transition-colors ${
                    activeSidebarTab === 'style'
                      ? 'bg-purple-600 text-white shadow-sm'
                      : 'text-[#8888a0] hover:text-white'
                  }`}
                >
                  Style
                </button>
              </div>

              {/* Active Tab Content */}
              <div className="flex-1 overflow-hidden">
                {activeSidebarTab === 'templates' && (
                  <TemplateGallery
                    currentConfig={config}
                    onSelectTemplate={(t) => setConfig(t)}
                  />
                )}
                {activeSidebarTab === 'transcript' && (
                  <TranscriptList
                    words={words}
                    currentTime={currentTime}
                    onUpdateWord={handleUpdateWord}
                    onDeleteWord={handleDeleteWord}
                    onSeek={handleSeek}
                    selectedWordIndex={selectedWordIndex}
                    onSelectWord={setSelectedWordIndex}
                    onBatchUpdateWords={handleBatchUpdateWords}
                  />
                )}
                {activeSidebarTab === 'style' && (
                  <StyleControls
                    config={config}
                    onUpdateConfig={handleUpdateConfig}
                  />
                )}
              </div>
            </div>

            {/* Center Stage: Video Canvas Player */}
            <div className="flex-1 flex flex-col overflow-hidden bg-[#070710] relative">
              <div className="flex-1 flex items-center justify-center overflow-hidden">
                <VideoCanvasPlayer
                  videoUrl={videoUrl}
                  words={words}
                  config={config}
                  aspectRatio={aspectRatio}
                  currentTime={currentTime}
                  duration={duration}
                  isPlaying={isPlaying}
                  onTimeUpdate={setCurrentTime}
                  onTogglePlay={handleTogglePlay}
                  onDurationChange={setDuration}
                  onUpdateConfig={handleUpdateConfig}
                  videoRef={videoRef}
                />
              </div>

              {/* Multi-track Timeline Scrubber at Bottom */}
              <SubtitleTimeline
                words={words}
                currentTime={currentTime}
                duration={duration}
                onSeek={handleSeek}
                onSelectWord={setSelectedWordIndex}
                selectedWordIndex={selectedWordIndex}
              />
            </div>
          </div>

          {/* Export Modal */}
          <ExportModal
            isOpen={isExportModalOpen}
            onClose={() => setIsExportModalOpen(false)}
            videoElement={videoRef.current}
            words={words}
            config={config}
            projectName={projectName}
          />
        </div>
      )}
    </div>
  );
}
