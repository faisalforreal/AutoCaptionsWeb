import React from 'react';
import { clsx } from 'clsx';

interface AnimatedGradientTextProps {
  className?: string;
  children: React.ReactNode;
}

export const AnimatedGradientText: React.FC<AnimatedGradientTextProps> = ({
  className,
  children,
}) => {
  return (
    <div
      className={clsx(
        'group relative mx-auto flex max-w-fit flex-row items-center justify-center rounded-full px-4 py-1.5 text-sm font-medium shadow-[inset_0_-8px_10px_#8fdfff1f] backdrop-blur-sm transition-shadow duration-500 ease-out [--bg-size:300%]',
        'border border-white/10 bg-white/[0.04]',
        className
      )}
    >
      <div
        className={clsx(
          'absolute inset-0 block h-full w-full animate-gradient rounded-[inherit] bg-gradient-to-r from-[#ffaa40]/50 via-[#9c40ff]/50 to-[#ffaa40]/50 bg-[length:var(--bg-size)_100%] p-[1px] ![mask-composite:subtract] [mask:linear-gradient(#fff_0_0)_content-box,linear-gradient(#fff_0_0)]'
        )}
      />
      {children}
    </div>
  );
};
