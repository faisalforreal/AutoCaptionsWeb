import React from 'react';
import { Star } from 'lucide-react';
import { Marquee } from '../ui/marquee';

export const SocialProofMarquee: React.FC = () => {
  const brands = [
    'TikTok',
    'Instagram Reels',
    'YouTube Shorts',
    'LinkedIn Video',
    'Shopify',
    'Adobe Premiere',
    'Notion',
    'Figma',
    'Canva',
    'Webflow',
    'Loom',
    'Linear',
    'CapCut'
  ];

  return (
    <section className="py-10 border-y border-white/[0.07] bg-[#0b0b15]/60 overflow-hidden">
      {/* Top Review Counter */}
      <div className="max-w-7xl mx-auto px-5 mb-8 flex flex-wrap items-center justify-center gap-8 text-center">
        <div className="flex items-center gap-2">
          <div className="flex text-amber-400">
            {[...Array(5)].map((_, i) => (
              <Star key={i} className="w-4 h-4 fill-amber-400" />
            ))}
          </div>
          <span className="font-bold text-sm text-white">4.8 / 5</span>
          <span className="text-xs text-[#808098]">· 14,000+ creators</span>
        </div>

        <div className="hidden sm:block w-px h-4 bg-white/10" />

        <div className="text-xs font-semibold text-[#a0a0b8]">
          Trusted by over <span className="text-white font-bold">300,000+</span> video editors worldwide
        </div>
      </div>

      {/* Infinite Scrolling Brand Marquee */}
      <div className="relative max-w-5xl mx-auto overflow-hidden">
        {/* Left/Right blur fade edges */}
        <div className="absolute left-0 top-0 bottom-0 w-20 z-10 pointer-events-none bg-gradient-to-r from-[#0b0b15] to-transparent" />
        <div className="absolute right-0 top-0 bottom-0 w-20 z-10 pointer-events-none bg-gradient-to-l from-[#0b0b15] to-transparent" />

        <Marquee pauseOnHover className="[--duration:28s]">
          {brands.map((brand) => (
            <div
              key={brand}
              className="px-6 py-2 text-base font-bold tracking-tight text-[#656580] hover:text-white transition-colors duration-200 cursor-default select-none"
            >
              {brand}
            </div>
          ))}
        </Marquee>
      </div>
    </section>
  );
};
