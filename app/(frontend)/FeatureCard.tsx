
'use client';
import { useEffect, useRef } from 'react';
import { IconType } from 'react-icons';

export default function FeatureCard({ title, description, icon: Icon }: {
  title: string;
  description: string;
  icon: IconType;
}) {
  const cardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const card = cardRef.current;
    if (!card) return;

    const handleMouseMove = (e: MouseEvent) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      card.style.setProperty('--mouse-x', `${x}px`);
      card.style.setProperty('--mouse-y', `${y}px`);
    };

    const mediaQuery = window.matchMedia('(min-width: 768px)');
    if (mediaQuery.matches) {
      card.addEventListener('mousemove', handleMouseMove);
    }

    return () => card.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <div
      ref={cardRef}
      className="group relative rounded-2xl bg-black/40 p-6 md:p-8 transition-all duration-500 hover:scale-[1.02] w-full max-w-sm mx-auto md:max-w-none"
    >
     
      <div className="hidden md:block pointer-events-none absolute inset-0 rounded-2xl opacity-0 transition-opacity duration-500 group-hover:opacity-100">
        <div className="absolute inset-0 rounded-2xl bg-[radial-gradient(circle_at_var(--mouse-x)_var(--mouse-y),rgba(147,51,234,0.3)_0%,transparent_70%)]" />
        <div className="absolute inset-0 rounded-2xl bg-[radial-gradient(circle_at_var(--mouse-x)_var(--mouse-y),rgba(59,130,246,0.3)_0%,transparent_70%)]" />
        <div className="absolute -inset-2 rounded-3xl bg-[radial-gradient(circle_at_var(--mouse-x)_var(--mouse-y),rgba(147,51,234,0.15)_0%,transparent_60%)] blur-xl" />
      </div>

      <div className="relative z-10 text-center md:text-left">
        <div className="mb-4 md:mb-6 transition-transform duration-500 group-hover:scale-110 flex justify-center md:justify-start">
          <Icon 
            size={40} 
            className="md:w-12 md:h-12 text-purple-400 drop-shadow-[0_0_15px_rgba(147,51,234,0.5)] group-hover:text-blue-400 transition-colors duration-500" 
          />
        </div>
        
        <h3 className="mb-3 md:mb-4 text-xl md:text-2xl font-bold text-white group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-purple-500 group-hover:to-blue-500 leading-tight">
          {title}
        </h3>
        
        <p className="text-gray-400 text-sm md:text-base leading-relaxed">
          {description}
        </p>
      </div>

      <div className="absolute inset-0 rounded-2xl border border-white/20 transition-all duration-500 group-hover:border-purple-500/50 md:group-hover:shadow-[0_0_30px_rgba(147,51,234,0.3)]" />
    </div>
  );
}