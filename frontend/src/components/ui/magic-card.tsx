import React, { useCallback, useEffect, useRef } from 'react';
import { clsx } from 'clsx';

interface MagicCardProps extends React.HTMLAttributes<HTMLDivElement> {
  gradientSize?: number;
  gradientColor?: string;
  gradientOpacity?: number;
}

export const MagicCard: React.FC<MagicCardProps> = ({
  children,
  className,
  gradientSize = 250,
  gradientColor = 'rgba(139, 92, 246, 0.18)',
  gradientOpacity = 0.8,
  ...props
}) => {
  const cardRef = useRef<HTMLDivElement>(null);

  const handleMouseMove = useCallback(
    (e: MouseEvent) => {
      if (!cardRef.current) return;
      const { left, top } = cardRef.current.getBoundingClientRect();
      const x = e.clientX - left;
      const y = e.clientY - top;
      cardRef.current.style.setProperty('--mouse-x', `${x}px`);
      cardRef.current.style.setProperty('--mouse-y', `${y}px`);
    },
    []
  );

  useEffect(() => {
    const card = cardRef.current;
    if (card) {
      card.addEventListener('mousemove', handleMouseMove);
      return () => card.removeEventListener('mousemove', handleMouseMove);
    }
  }, [handleMouseMove]);

  return (
    <div
      ref={cardRef}
      className={clsx(
        'relative overflow-hidden rounded-2xl border border-white/[0.08] bg-[#111122] transition-colors',
        className
      )}
      style={
        {
          '--gradient-size': `${gradientSize}px`,
          '--gradient-color': gradientColor,
          '--gradient-opacity': gradientOpacity,
        } as React.CSSProperties
      }
      {...props}
    >
      <div
        className="pointer-events-none absolute -inset-px opacity-0 transition-opacity duration-300 group-hover:opacity-100"
        style={{
          background: `radial-gradient(var(--gradient-size) circle at var(--mouse-x, 0) var(--mouse-y, 0), var(--gradient-color), transparent 80%)`,
        }}
      />
      {children}
    </div>
  );
};
