import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { UploadCloud, Film, ArrowRight, Loader2 } from 'lucide-react';
import { Navbar } from '../components/landing/Navbar';
import { HeroSection } from '../components/landing/HeroSection';
import { SocialProofMarquee } from '../components/landing/SocialProofMarquee';
import { FeaturesGrid } from '../components/landing/FeaturesGrid';
import { TemplateShowcase } from '../components/landing/TemplateShowcase';
import { HowItWorks } from '../components/landing/HowItWorks';
import { FaqSection } from '../components/landing/FaqSection';
import { Footer } from '../components/landing/Footer';
import { SupportModal } from '../components/support/SupportModal';

import { useEditorStore } from '../store/useEditorStore';
import { VIRAL_PRESETS } from '../engine/presets';
import { extractAudioFromVideo } from '../engine/audioExtractor';
import { ApiService } from '../services/api';

export const LandingPage: React.FC = () => {
  const navigate = useNavigate();
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [showSupportModal, setShowSupportModal] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [statusMessage, setStatusMessage] = useState('');

  const {
    setConfig,
    setWords,
    setDuration,
    setVideoData,
    loadDemoProject,
    setIsTranscribing,
    setUploadStatus
  } = useEditorStore();

  const handleFileUpload = async (file: File) => {
    setIsProcessing(true);
    setStatusMessage('Preparing video and audio...');

    try {
      const cleanProjectName = file.name.replace(/\.[^/.]+$/, '');
      await setVideoData(file, cleanProjectName);

      // Extract audio
      const { audioBlob, duration: audioDur } = await extractAudioFromVideo(file, (p) => {
        setStatusMessage(`Extracting audio: ${p}%`);
      });

      setDuration(audioDur);
      setStatusMessage('Generating captions...');

      setIsTranscribing(true);
      setUploadStatus('Generating captions...');

      // Close modal and navigate immediately to editor
      setShowUploadModal(false);
      navigate('/editor');

      // Async transcribe
      try {
        const result = await ApiService.transcribeAudio(audioBlob, 'en');
        if (result.words && result.words.length > 0) {
          setWords(result.words);
          setDuration(result.duration || audioDur);
        }
      } catch (err: any) {
        console.warn('Transcription error, continuing with fallback:', err.message);
      } finally {
        setIsTranscribing(false);
        setUploadStatus('');
      }
    } catch (err: any) {
      console.error('File upload error:', err);
      setStatusMessage('Failed to read video. Please try another file.');
      setIsProcessing(false);
    }
  };

  const handleLoadDemo = () => {
    loadDemoProject();
    setShowUploadModal(false);
    navigate('/editor');
  };

  return (
    <div className="min-h-screen bg-[#0b0b15] text-white flex flex-col font-sans">
      <Navbar
        onOpenEditor={() => setShowUploadModal(true)}
        onOpenSupport={() => setShowSupportModal(true)}
      />

      <main className="flex-1">
        <HeroSection onOpenEditor={() => setShowUploadModal(true)} />
        <SocialProofMarquee />
        <FeaturesGrid />
        <TemplateShowcase
          onSelectPreset={(id) => {
            const found = VIRAL_PRESETS.find((p) => p.id === id);
            if (found) setConfig(found);
            setShowUploadModal(true);
          }}
        />
        <HowItWorks />
        <FaqSection />
      </main>

      <Footer onOpenSupport={() => setShowSupportModal(true)} />

      {/* Upload Modal */}
      {showUploadModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div className="relative w-full max-w-lg bg-[#141426] border border-white/10 rounded-3xl p-8 shadow-2xl">
            <button
              onClick={() => {
                if (!isProcessing) setShowUploadModal(false);
              }}
              disabled={isProcessing}
              className="absolute top-5 right-5 text-[#8888a0] hover:text-white transition-colors"
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
            {isProcessing ? (
              <div className="border border-white/10 rounded-2xl p-10 flex flex-col items-center justify-center bg-[#0f0f1e] text-center space-y-3">
                <Loader2 className="w-8 h-8 animate-spin text-purple-400" />
                <span className="text-sm font-bold text-white">{statusMessage}</span>
                <span className="text-xs text-[#707088]">
                  Loading your video into the studio...
                </span>
              </div>
            ) : (
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
            )}

            {/* Instant Demo Option */}
            {!isProcessing && (
              <div className="text-center pt-2 border-t border-white/[0.06]">
                <button
                  onClick={handleLoadDemo}
                  className="text-xs text-purple-400 hover:text-purple-300 font-semibold flex items-center justify-center gap-1.5 mx-auto transition-colors"
                >
                  <span>Don't have a video handy? Try the interactive Demo Studio</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Creator Support Modal */}
      <SupportModal
        isOpen={showSupportModal}
        onClose={() => setShowSupportModal(false)}
      />
    </div>
  );
};
