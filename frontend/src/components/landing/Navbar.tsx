import React from 'react';
import { Sparkles, Video, ArrowRight, Heart } from 'lucide-react';

interface NavbarProps {
  onOpenEditor: () => void;
  onOpenSupport?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onOpenEditor, onOpenSupport }) => {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 border-b border-white/[0.07] bg-[#0b0b15]/90 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-5 lg:px-10 h-[68px] flex items-center justify-between">
        {/* Brand Logo */}
        <div className="flex items-center gap-3 cursor-pointer" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
          <div className="h-9 w-9 rounded-xl bg-gradient-to-tr from-purple-600 to-violet-400 flex items-center justify-center shadow-lg shadow-purple-600/30">
            <Video className="w-5 h-5 text-white" />
          </div>
          <span className="text-lg font-bold tracking-tight text-white flex items-center gap-1.5">
            AutoCaption
            <span className="text-[10px] font-semibold uppercase tracking-wider px-1.5 py-0.5 rounded-full bg-purple-500/20 text-purple-400 border border-purple-500/30">
              Free Studio
            </span>
          </span>
        </div>

        {/* Navigation Links */}
        <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-[#a0a0b8]">
          <a href="#features" className="hover:text-white transition-colors">Features</a>
          <a href="#templates" className="hover:text-white transition-colors">16 Presets</a>
          <a href="#how-it-works" className="hover:text-white transition-colors">How It Works</a>
          <a href="#faq" className="hover:text-white transition-colors">FAQ</a>
        </nav>

        {/* Action CTAs */}
        <div className="flex items-center gap-2.5">
          {onOpenSupport && (
            <button
              onClick={onOpenSupport}
              className="hidden sm:flex items-center gap-1.5 px-3.5 py-2 rounded-full border border-pink-500/30 bg-pink-500/10 hover:bg-pink-500/20 text-pink-300 text-xs font-semibold transition-all hover:scale-[1.02] active:scale-[0.98]"
            >
              <Heart className="w-3.5 h-3.5 text-pink-400 fill-pink-400" />
              <span>Support</span>
            </button>
          )}

          <button
            onClick={onOpenEditor}
            className="bg-purple-600 hover:bg-purple-500 text-white text-sm font-semibold px-5 py-2.5 rounded-full transition-all duration-200 flex items-center gap-2 shadow-lg shadow-purple-600/30 hover:scale-[1.02] active:scale-[0.98]"
          >
            <Sparkles className="w-4 h-4 text-purple-200" />
            <span>Launch Studio</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </header>
  );
};
