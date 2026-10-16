import React from 'react';
import { Video, Heart } from 'lucide-react';

export const Footer: React.FC = () => {
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

        <div className="flex items-center gap-1 text-xs">
          <span>Built with</span>
          <Heart className="w-3.5 h-3.5 text-purple-400 fill-purple-400" />
          <span>for creators and storytellers everywhere</span>
        </div>
      </div>
    </footer>
  );
};
