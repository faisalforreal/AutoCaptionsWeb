import React from 'react';
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
    <section className="py-8 border-y border-white/[0.07] bg-[#0b0b15]/60 overflow-hidden">
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
