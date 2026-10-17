import React, { useEffect } from 'react';
import { ArrowLeft, ShieldCheck, Lock, EyeOff, Database } from 'lucide-react';
import { Link } from 'react-router-dom';

export const PrivacyPage: React.FC = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen bg-[#0b0b15] text-white flex flex-col font-sans">
      {/* Header */}
      <header className="border-b border-white/[0.08] bg-[#0d0d1a] px-6 py-4 sticky top-0 z-30 backdrop-blur-md bg-[#0d0d1a]/90">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <Link
            to="/"
            className="flex items-center gap-2 text-sm text-[#a0a0b8] hover:text-white transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Studio</span>
          </Link>

          <div className="flex items-center gap-2">
            <span className="font-bold text-base text-white tracking-tight">AutoCaption</span>
            <span className="text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
              Privacy Policy
            </span>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-4xl mx-auto px-6 py-12">
        <div className="space-y-8 text-[#b8b8cc] leading-relaxed">
          <div>
            <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center mb-4">
              <ShieldCheck className="w-6 h-6 text-emerald-400" />
            </div>
            <h1 className="text-3xl font-extrabold text-white tracking-tight mb-2">
              Privacy Policy
            </h1>
            <p className="text-xs text-[#808098]">
              Effective Date: October 17, 2026 · Last Updated: October 2026
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-sm text-emerald-200">
            At AutoCaption, your privacy is our top priority. We believe video creators should never have to sacrifice their privacy or confidentiality to get clean, viral captions.
          </div>

          {/* Section 1 */}
          <section className="space-y-3">
            <h2 className="text-lg font-bold text-white tracking-tight flex items-center gap-2">
              <Lock className="w-4 h-4 text-emerald-400" />
              1. 100% Private Local Browser Video Processing
            </h2>
            <p className="text-sm">
              Unlike traditional cloud editors that upload your entire multi-gigabyte video files to third-party cloud servers, <strong className="text-white">AutoCaption renders and exports your captioned videos directly inside your browser</strong>.
            </p>
            <p className="text-sm">
              Your raw video footage and exported MP4 files never touch our servers or cloud storage. They stay strictly on your local device.
            </p>
          </section>

          {/* Section 2 */}
          <section className="space-y-3">
            <h2 className="text-lg font-bold text-white tracking-tight">
              2. Audio Processing for Captions
            </h2>
            <p className="text-sm">
              To generate synchronized word-level captions, your browser extracts an audio track from your video and sends it securely to our automated transcription engine over encrypted SSL connections.
            </p>
            <ul className="list-disc pl-5 space-y-1.5 text-sm">
              <li>The audio is used solely to generate the textual transcript and millisecond timestamps.</li>
              <li>Audio data is processed ephemerally and is not retained or used to train public models.</li>
              <li>No video pixels or visual frames are ever sent to the transcription service.</li>
            </ul>
          </section>

          {/* Section 3 */}
          <section className="space-y-3">
            <h2 className="text-lg font-bold text-white tracking-tight flex items-center gap-2">
              <Database className="w-4 h-4 text-purple-400" />
              3. Local Storage & Draft Persistence
            </h2>
            <p className="text-sm">
              To ensure you never lose your subtitles or editing progress if you refresh your browser or navigate away, AutoCaption saves your active project state (subtitles, chosen styles, and video reference) directly in your browser's private local storage (IndexedDB and localStorage).
            </p>
            <p className="text-sm">
              This data remains on your computer. You can clear this saved project data at any time by clicking "New Project" in the studio or clearing your browser cache.
            </p>
          </section>

          {/* Section 4 */}
          <section className="space-y-3">
            <h2 className="text-lg font-bold text-white tracking-tight">
              4. Payment & Support Contributions (Dodo Payments)
            </h2>
            <p className="text-sm">
              When you voluntarily choose to support AutoCaption through our "Support Me" feature, your transaction is processed by our payment partner, <strong className="text-white">Dodo Payments</strong>.
            </p>
            <ul className="list-disc pl-5 space-y-1.5 text-sm">
              <li>AutoCaption does not collect, receive, or store your credit card numbers, CVVs, or financial credentials.</li>
              <li>Dodo Payments handles all payment details in accordance with PCI-DSS compliance standards.</li>
              <li>We may receive basic non-sensitive confirmation details (such as the tip amount, timestamp, and transaction ID) to confirm receipt of the contribution.</li>
            </ul>
          </section>

          {/* Section 5 */}
          <section className="space-y-3">
            <h2 className="text-lg font-bold text-white tracking-tight">
              5. Cookies & Analytics
            </h2>
            <p className="text-sm">
              AutoCaption does not use invasive advertising trackers, third-party data brokers, or cross-site tracking cookies. We only use functional session storage strictly necessary to operate the application and provide a smooth user experience.
            </p>
          </section>

          {/* Section 6 */}
          <section className="space-y-3">
            <h2 className="text-lg font-bold text-white tracking-tight">
              6. Your Rights & Data Protection (GDPR / CCPA)
            </h2>
            <p className="text-sm">
              Depending on your location, you may have rights under privacy laws such as the General Data Protection Regulation (GDPR) or California Consumer Privacy Act (CCPA), including the right to request access, correction, or deletion of personal data.
            </p>
            <p className="text-sm">
              Because AutoCaption does not require user accounts, user profiles, or cloud database storage for video content, virtually all your creative data is already stored exclusively on your own machine.
            </p>
          </section>

          {/* Section 7 */}
          <section className="space-y-3 border-t border-white/[0.08] pt-6">
            <h2 className="text-lg font-bold text-white tracking-tight">
              7. Contact Privacy Team
            </h2>
            <p className="text-sm">
              If you have any questions, concerns, or requests regarding this Privacy Policy, please reach out to us:
            </p>
            <div className="p-4 rounded-xl bg-[#141426] border border-white/[0.06] text-sm">
              <p className="text-white font-medium">AutoCaption Privacy Team</p>
              <p className="text-emerald-400 text-xs mt-1">Email: privacy@autocaption.io</p>
              <p className="text-[#707088] text-xs mt-0.5">Website: https://autocaptions-free.netlify.app</p>
            </div>
          </section>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-white/[0.08] bg-[#070710] py-8 text-xs text-[#707088]">
        <div className="max-w-5xl mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p>© {new Date().getFullYear()} AutoCaption. All rights reserved.</p>
          <div className="flex gap-4">
            <Link to="/privacy" className="hover:text-white transition-colors">Privacy Policy</Link>
            <Link to="/terms" className="hover:text-white transition-colors">Terms of Service</Link>
          </div>
        </div>
      </footer>
    </div>
  );
};
