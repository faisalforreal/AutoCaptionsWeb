import React, { useState } from 'react';
import { ChevronDown } from 'lucide-react';

export const FaqSection: React.FC = () => {
  const [openIdx, setOpenIdx] = useState<number | null>(0);

  const faqs = [
    {
      q: 'What is AutoCaption?',
      a: 'AutoCaption is a caption studio that automatically creates animated, stylish captions for your videos. Upload your video, pick from 45+ creator styles (including sliding lyrics stanzas and high-retention one-word pops), fine-tune the timing, and download a ready-to-post video for TikTok, Reels, or Shorts.'
    },
    {
      q: 'Is AutoCaption really 100% free with no watermark?',
      a: 'Yes! You can create, edit, and export unlimited high-definition videos with zero watermarks and no hidden fees. No credit card or account sign-up is required.'
    },
    {
      q: 'What video formats and resolutions are supported?',
      a: 'We support all standard video formats including MP4, MOV, WebM, and MKV up to 4K resolution at 60fps.'
    },
    {
      q: 'How many languages does AutoCaption support?',
      a: 'AutoCaption supports over 30+ languages, including English, Spanish, French, German, Italian, Portuguese, Arabic, Hindi, Japanese, and more, complete with Right-to-Left (RTL) text support for languages like Arabic and Hebrew.'
    },
    {
      q: 'Can I customize the fonts, colors, and animations?',
      a: 'Yes! You have full control over fonts, colors, outlines, drop shadows, background highlights, word bounce animations, and automated emojis.'
    },
    {
      q: 'How fast is the caption generator?',
      a: 'Your captions are ready in just a few seconds. Videos load immediately and subtitles are timed word-by-word with high precision.'
    }
  ];

  return (
    <section id="faq" className="py-20 max-w-4xl mx-auto px-5 lg:px-10">
      <div className="text-center mb-16">
        <p className="text-purple-400 text-xs font-bold uppercase tracking-widest mb-3">
          FAQ
        </p>
        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight leading-tight mb-4">
          Frequently asked questions
        </h2>
        <p className="text-[#9090a8] text-base">
          Everything you need to know about AutoCaption and creating viral captioned videos.
        </p>
      </div>

      <div className="space-y-4">
        {faqs.map((faq, i) => {
          const isOpen = openIdx === i;
          return (
            <div
              key={i}
              className="rounded-2xl border border-white/[0.08] bg-[#121224] overflow-hidden transition-colors"
            >
              <button
                onClick={() => setOpenIdx(isOpen ? null : i)}
                className="w-full px-6 py-5 flex items-center justify-between text-left font-bold text-white text-base hover:text-purple-300 transition-colors"
              >
                <span>{faq.q}</span>
                <ChevronDown
                  className={`w-5 h-5 text-[#8888a0] transition-transform duration-200 shrink-0 ml-4 ${
                    isOpen ? 'rotate-180 text-purple-400' : ''
                  }`}
                />
              </button>

              {isOpen && (
                <div className="px-6 pb-6 text-sm text-[#9090a8] leading-relaxed border-t border-white/[0.04] pt-4">
                  {faq.a}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
};
