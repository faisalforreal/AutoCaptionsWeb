import React, { useEffect } from 'react';
import { ArrowLeft, ShieldCheck, Heart, Sparkles, FileText } from 'lucide-react';
import { Link } from 'react-router-dom';

export const TermsPage: React.FC = () => {
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
            <span className="text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full bg-purple-500/20 text-purple-400 border border-purple-500/30">
              Terms of Service
            </span>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-4xl mx-auto px-6 py-12">
        <div className="space-y-8 text-[#b8b8cc] leading-relaxed">
          <div>
            <div className="w-12 h-12 rounded-2xl bg-purple-600/20 border border-purple-500/30 flex items-center justify-center mb-4">
              <FileText className="w-6 h-6 text-purple-400" />
            </div>
            <h1 className="text-3xl font-extrabold text-white tracking-tight mb-2">
              Terms of Service
            </h1>
            <p className="text-xs text-[#808098]">
              Effective Date: October 17, 2026 · Last Updated: October 2026
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-purple-500/10 border border-purple-500/20 text-sm text-purple-200">
            Welcome to AutoCaption. By accessing or using our website and services, you agree to be bound by these Terms of Service. If you do not agree with any part of these terms, please do not use the service.
          </div>

          {/* Section 1 */}
          <section className="space-y-3">
            <h2 className="text-lg font-bold text-white tracking-tight">
              1. Overview & Service Description
            </h2>
            <p className="text-sm">
              AutoCaption is an online creative video subtitle and captioning platform designed to help content creators generate, customize, preview, and export high-definition captioned videos and subtitle files (.SRT, .VTT).
            </p>
            <p className="text-sm">
              AutoCaption is free to use without requiring sign-up or watermarks. We do not claim any ownership rights over your creative assets.
            </p>
          </section>

          {/* Section 2 */}
          <section className="space-y-3">
            <h2 className="text-lg font-bold text-white tracking-tight">
              2. Intellectual Property & Your Content
            </h2>
            <p className="text-sm">
              <strong className="text-white">You own 100% of your content.</strong> Any video files, audio recordings, scripts, transcripts, and final rendered videos exported using AutoCaption belong exclusively to you.
            </p>
            <p className="text-sm">
              AutoCaption does not claim ownership, licensing rights, or commercial royalties over any video or subtitle file you produce. You are free to monetize, distribute, and publish your exported media across YouTube, TikTok, Instagram, LinkedIn, and any other platform.
            </p>
          </section>

          {/* Section 3 */}
          <section className="space-y-3">
            <h2 className="text-lg font-bold text-white tracking-tight">
              3. Creator Support, Tips & Payments
            </h2>
            <p className="text-sm">
              AutoCaption offers an optional "Support the Creator" / pay-what-you-want feature that allows appreciative users to contribute funds toward project maintenance, hosting, and ongoing development.
            </p>
            <ul className="list-disc pl-5 space-y-2 text-sm">
              <li>
                <strong className="text-white">Voluntary Contributions:</strong> All monetary support or tips are entirely voluntary. Contributing funds does not alter the free availability of the core application.
              </li>
              <li>
                <strong className="text-white">Payment Processor:</strong> Payments and tips are securely processed by our authorized payment provider, <span className="text-white font-medium">Dodo Payments</span>. By submitting payment information, you agree to Dodo Payments' checkout policies and terms.
              </li>
              <li>
                <strong className="text-white">Refund Policy:</strong> Because contributions are voluntary donations/tips used immediately to cover software upkeep and server costs, all payments are considered final and non-refundable, except where required by applicable consumer law. If you made an accidental duplicate contribution, please reach out to our support email.
              </li>
            </ul>
          </section>

          {/* Section 4 */}
          <section className="space-y-3">
            <h2 className="text-lg font-bold text-white tracking-tight">
              4. Acceptable Use
            </h2>
            <p className="text-sm">
              You agree to use AutoCaption in compliance with all applicable laws and regulations. You agree not to:
            </p>
            <ul className="list-disc pl-5 space-y-1.5 text-sm">
              <li>Upload or process content that is unlawful, defamatory, abusive, threatening, or sexually explicit.</li>
              <li>Infringe upon the intellectual property, copyright, or privacy rights of any third party.</li>
              <li>Attempt to reverse-engineer, exploit, overload, or launch denial-of-service attacks against our systems or servers.</li>
              <li>Use automated scrapers, bots, or scripts to abuse caption generation endpoints without authorization.</li>
            </ul>
          </section>

          {/* Section 5 */}
          <section className="space-y-3">
            <h2 className="text-lg font-bold text-white tracking-tight">
              5. Disclaimer of Warranties
            </h2>
            <p className="text-sm">
              AutoCaption is provided on an "AS IS" and "AS AVAILABLE" basis without warranties of any kind, whether express or implied. While we strive for high caption accuracy and smooth video export performance across browsers, we do not guarantee that speech recognition will be 100% error-free or that service will be uninterrupted.
            </p>
          </section>

          {/* Section 6 */}
          <section className="space-y-3">
            <h2 className="text-lg font-bold text-white tracking-tight">
              6. Limitation of Liability
            </h2>
            <p className="text-sm">
              To the maximum extent permitted by applicable law, AutoCaption and its creators shall not be liable for any indirect, incidental, special, consequential, or punitive damages resulting from your use of or inability to use the service.
            </p>
          </section>

          {/* Section 7 */}
          <section className="space-y-3">
            <h2 className="text-lg font-bold text-white tracking-tight">
              7. Changes to Terms
            </h2>
            <p className="text-sm">
              We reserve the right to modify or replace these Terms at any time. Changes become effective immediately upon posting to this page. Your continued use of AutoCaption after changes indicates acceptance of the updated terms.
            </p>
          </section>

          {/* Section 8 */}
          <section className="space-y-3 border-t border-white/[0.08] pt-6">
            <h2 className="text-lg font-bold text-white tracking-tight">
              8. Contact Us
            </h2>
            <p className="text-sm">
              If you have any questions about these Terms of Service or need assistance, please contact us at:
            </p>
            <div className="p-4 rounded-xl bg-[#141426] border border-white/[0.06] text-sm">
              <p className="text-white font-medium">AutoCaption Support</p>
              <p className="text-purple-400 text-xs mt-1">Email: contact@autocaption.io</p>
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
