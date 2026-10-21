import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { EditorHeader } from '../components/editor/EditorHeader';
import { VideoCanvasPlayer } from '../components/editor/VideoCanvasPlayer';
import { SubtitleTimeline } from '../components/editor/SubtitleTimeline';
import { TranscriptList } from '../components/editor/TranscriptList';
import { TemplateGallery } from '../components/editor/TemplateGallery';
import { StyleControls } from '../components/editor/StyleControls';
import { ExportModal } from '../components/editor/ExportModal';
import { SupportModal } from '../components/support/SupportModal';
import { PaySupportModal } from '../components/support/PaySupportModal';

import { useEditorStore } from '../store/useEditorStore';
import { extractAudioFromVideo } from '../engine/audioExtractor';
import { ApiService } from '../services/api';

export const EditorPage: React.FC = () => {
  const navigate = useNavigate();
  const videoRef = useRef<HTMLVideoElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [isExportModalOpen, setIsExportModalOpen] = useState(false);
  const [showSupportModal, setShowSupportModal] = useState(false);
  const [showPaySupportModal, setShowPaySupportModal] = useState(false);

  const {
    projectName,
    aspectRatio,
    config,
    words,
    duration,
    currentTime,
    isPlaying,
    selectedWordIndex,
    activeSidebarTab,
    videoUrl,
    isTranscribing,
    isInitialized,

    setAspectRatio,
    updateConfig,
    setConfig,
    updateWord,
    deleteWord,
    batchUpdateWords,
    setCurrentTime,
    setDuration,
    setIsPlaying,
    setSelectedWordIndex,
    setActiveSidebarTab,
    setVideoData,
    resetProject,
    initFromStorage,
    setIsTranscribing,
    setUploadStatus,
    setWords
  } = useEditorStore();

  // Initialize and restore state from browser storage on mount / page reload
  useEffect(() => {
    initFromStorage();
  }, [initFromStorage]);

  const handleTogglePlay = () => {
    if (videoRef.current) {
      if (videoRef.current.paused || videoRef.current.ended) {
        if (videoRef.current.ended || videoRef.current.currentTime >= videoRef.current.duration) {
          videoRef.current.currentTime = 0;
          setCurrentTime(0);
        }
        videoRef.current.play().catch(console.error);
        setIsPlaying(true);
      } else {
        videoRef.current.pause();
        setIsPlaying(false);
      }
    } else {
      setIsPlaying(!isPlaying);
    }
  };

  // Keyboard shortcut: Spacebar to toggle Play/Pause smoothly
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const active = document.activeElement;
      const isInput =
        active &&
        (active.tagName === 'INPUT' ||
          active.tagName === 'TEXTAREA' ||
          (active as HTMLElement).isContentEditable);
      if (e.code === 'Space' && !isInput) {
        e.preventDefault();
        handleTogglePlay();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isPlaying]);

  const handleSeek = (time: number) => {
    setCurrentTime(time);
    if (videoRef.current) {
      videoRef.current.currentTime = time;
    }
  };

  const handleNewVideoSelected = async (file: File) => {
    try {
      const cleanName = file.name.replace(/\.[^/.]+$/, '');
      await setVideoData(file, cleanName);

      setIsTranscribing(true);
      setUploadStatus('Extracting audio...');

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
      console.warn('Transcription failed for new video:', err.message);
    } finally {
      setIsTranscribing(false);
      setUploadStatus('');
    }
  };

  const handleTriggerNewProject = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  return (
    <div className="h-screen flex flex-col overflow-hidden bg-[#0a0a14] font-sans text-white select-none">
      {/* Hidden file input for uploading a new video directly inside editor */}
      <input
        ref={fileInputRef}
        type="file"
        accept="video/mp4,video/quicktime,video/webm,video/mkv"
        onChange={(e) => {
          if (e.target.files && e.target.files[0]) {
            handleNewVideoSelected(e.target.files[0]);
          }
        }}
        className="hidden"
      />

      {/* Editor Header Navigation */}
      <EditorHeader
        projectName={projectName}
        onBack={() => navigate('/')}
        aspectRatio={aspectRatio}
        onChangeAspectRatio={setAspectRatio}
        onOpenExport={() => setShowPaySupportModal(true)}
        onOpenSupport={() => setShowSupportModal(true)}
        onNewProject={handleTriggerNewProject}
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
              Templates
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

          {/* Active Tab Content - Kept mounted in background for instant 0ms tab switching */}
          <div className="flex-1 overflow-hidden relative">
            <div className={`h-full flex flex-col ${activeSidebarTab === 'templates' ? '' : 'hidden'}`}>
              <TemplateGallery
                currentConfig={config}
                onSelectTemplate={(t) => setConfig(t)}
              />
            </div>
            <div className={`h-full flex flex-col ${activeSidebarTab === 'transcript' ? '' : 'hidden'}`}>
              <TranscriptList
                words={words}
                currentTime={currentTime}
                onUpdateWord={updateWord}
                onDeleteWord={deleteWord}
                onSeek={handleSeek}
                selectedWordIndex={selectedWordIndex}
                onSelectWord={setSelectedWordIndex}
                onBatchUpdateWords={batchUpdateWords}
              />
            </div>
            <div className={`h-full flex flex-col ${activeSidebarTab === 'style' ? '' : 'hidden'}`}>
              <StyleControls
                config={config}
                onUpdateConfig={updateConfig}
              />
            </div>
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
              onPlayStateChange={setIsPlaying}
              onDurationChange={setDuration}
              onUpdateConfig={updateConfig}
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

      {/* Pay Support Modal displayed on Export with Skip option */}
      <PaySupportModal
        isOpen={showPaySupportModal}
        onClose={() => setShowPaySupportModal(false)}
        onSkip={() => {
          setShowPaySupportModal(false);
          setIsExportModalOpen(true);
        }}
        onSupportSuccess={() => {
          setShowPaySupportModal(false);
          setIsExportModalOpen(true);
        }}
      />

      {/* Export Modal */}
      <ExportModal
        isOpen={isExportModalOpen}
        onClose={() => setIsExportModalOpen(false)}
        videoElement={videoRef.current}
        words={words}
        config={config}
        projectName={projectName}
        onOpenSupport={() => setShowSupportModal(true)}
      />

      {/* Creator Support Modal */}
      <SupportModal
        isOpen={showSupportModal}
        onClose={() => setShowSupportModal(false)}
      />
    </div>
  );
};
