'use client';

import Link from 'next/link';
import { useEffect, useRef } from 'react';

export function ParallaxHero() {
  const bgRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      if (!bgRef.current) return;
      const scrollY = window.scrollY;
      // Move background at 40% of scroll speed for parallax depth
      bgRef.current.style.transform = `translateY(${scrollY * 0.4}px)`;
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <section className="relative w-full min-h-[600px] sm:min-h-[680px] lg:min-h-[760px] flex items-center justify-center overflow-hidden">
      {/* Parallax background */}
      <div
        ref={bgRef}
        className="absolute inset-0 will-change-transform"
        style={{
          backgroundImage: 'url(/images/temple-hero-1.jpg)',
          backgroundSize: 'cover',
          backgroundPosition: 'center top',
          top: '-15%',
          bottom: '-15%',
        }}
      />
      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-900/75 via-slate-900/55 to-slate-800/40" />

      {/* Centered content */}
      <div className="relative z-10 w-full max-w-7xl mx-auto px-4 py-28 sm:px-6 sm:py-36 lg:px-8 lg:py-44">
        <div className="max-w-3xl mx-auto text-center">
          <p className="text-sm font-semibold uppercase tracking-widest text-amber-300 mb-4">
            Soto Mission of Hawaii
          </p>
          <h1 className="text-4xl font-bold tracking-tight text-white sm:text-5xl lg:text-6xl">
            Shoboji Social Hall
          </h1>
          <p className="mt-6 text-lg leading-relaxed text-stone-200 sm:text-xl max-w-2xl mx-auto">
            A gracious gathering place in the heart of Honolulu, where tradition meets celebration.
            Host your wedding, reception, memorial, or community event in our spacious, fully-equipped hall.
          </p>
          <div className="mt-10 flex flex-col gap-4 sm:flex-row sm:justify-center">
            <Link
              href="/availability"
              className="rounded-lg border-2 border-white/40 px-8 py-3.5 text-center font-semibold text-white transition-all hover:border-white hover:bg-white/10 backdrop-blur-sm"
            >
              Check Availability
            </Link>
            <Link
              href="#packages"
              className="rounded-lg bg-white px-8 py-3.5 text-center font-semibold text-slate-900 transition-all hover:bg-stone-100 shadow-lg"
            >
              Find My Package
            </Link>
          </div>
          {/* Trust indicators */}
          <div className="mt-12 flex flex-wrap justify-center gap-6 text-sm text-stone-300">
            <span className="flex items-center gap-1.5">
              <span className="text-amber-400">✦</span> Up to 450+ guests
            </span>
            <span className="flex items-center gap-1.5">
              <span className="text-amber-400">✦</span> Mon–Sat, 8AM–10PM
            </span>
            <span className="flex items-center gap-1.5">
              <span className="text-amber-400">✦</span> Full AV equipment on-site
            </span>
            <span className="flex items-center gap-1.5">
              <span className="text-amber-400">✦</span> In-house catering available
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
