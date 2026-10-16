import React from 'react';
import { UploadCloud, Sliders, Film } from 'lucide-react';

export const HowItWorks: React.FC = () => {
  const steps = [
    {
      num: '01',
      icon: UploadCloud,
      title: 'Upload your video',
      desc: 'Drag and drop any MP4, MOV, or WebM video. It loads instantly so you can start creating immediately.'
    },
    {
      num: '02',
      icon: Sliders,
      title: 'Customize your captions',
      desc: 'Choose from 16 creator-tested styles (Hormozi, MrBeast, Cyberpunk, and more). Customize colors, fonts, highlight animations, and emojis.'
    },
    {
      num: '03',
      icon: Film,
      title: 'Export & publish',
      desc: 'Download your high-definition 1080p video with subtitles burned in, or export clean .SRT subtitle files ready to post.'
    }
  ];

  return (
    <section id="how-it-works" className="py-20 max-w-7xl mx-auto px-5 lg:px-10">
      <div className="text-center max-w-2xl mx-auto mb-16">
        <p className="text-purple-400 text-xs font-bold uppercase tracking-widest mb-3">
          Workflow
        </p>
        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight leading-tight mb-4">
          Create captioned videos in 3 simple steps
        </h2>
        <p className="text-[#9090a8] text-base leading-relaxed">
          From raw video to viral published short in minutes — no video editing experience required.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
        {steps.map((s, idx) => {
          const Icon = s.icon;
          return (
            <div
              key={idx}
              className="relative p-8 rounded-2xl bg-[#111122] border border-white/[0.08] flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-6">
                  <span className="text-4xl font-black text-purple-500/30 font-mono">
                    {s.num}
                  </span>
                  <div className="w-12 h-12 rounded-xl bg-purple-600/10 border border-purple-500/20 flex items-center justify-center">
                    <Icon className="w-6 h-6 text-purple-400" />
                  </div>
                </div>

                <h3 className="text-xl font-bold text-white mb-3 tracking-tight">
                  {s.title}
                </h3>
                <p className="text-[#8888a0] text-sm leading-relaxed">
                  {s.desc}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};
