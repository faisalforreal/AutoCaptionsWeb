import React from 'react';
import { Video, Heart } from 'lucide-react';
import { Link } from 'react-router-dom';

interface FooterProps {
  onOpenSupport?: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onOpenSupport }) => {
  return (
    <footer className="border-t border-white/[0.08] bg-[#070710] py-12 text-sm text-[#707088]">
      <div className="max-w-7xl mx-auto px-5 lg:px-10 flex flex-col sm:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-3">
          <div className="h-8 w-8 rounded-lg bg-purple-600 flex items-center justify-center">
            <Video className="w-4 h-4 text-white" />
          </div>
          <span className="font-bold text-white tracking-tight">AutoCaption</span>
          <span className="text-xs text-[#55556a]">· Free Online Caption Studio</span>
        </div>

        <div className="flex flex-wrap items-center gap-5 text-xs">
          <Link to="/privacy" className="hover:text-white transition-colors">
            Privacy Policy
          </Link>
          <Link to="/terms" className="hover:text-white transition-colors">
            Terms of Service
          </Link>

          {onOpenSupport && (
            <button
              onClick={onOpenSupport}
              className="text-pink-400 hover:text-pink-300 font-medium transition-colors flex items-center gap-1.5"
            >
              <Heart className="w-3.5 h-3.5 fill-pink-400" />
              <span>Support the Project</span>
            </button>
          )}

          <div className="flex items-center gap-1 text-[#606078]">
            <span>Built with</span>
            <Heart className="w-3.5 h-3.5 text-purple-400 fill-purple-400" />
            <span>for creators and storytellers</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
