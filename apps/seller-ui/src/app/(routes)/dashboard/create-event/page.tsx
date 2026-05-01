"use client";
import React, { useState, useEffect } from 'react';
import { Timer, ShoppingBag, ArrowRight } from 'lucide-react';

const EventHero = () => {
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });

  // Target Date: Replace with your Prisma event.endTime
  const targetDate = new Date("2026-04-10T00:00:00").getTime();

  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date().getTime();
      const distance = targetDate - now;

      setTimeLeft({
        days: Math.floor(distance / (1000 * 60 * 60 * 24)),
        hours: Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
        minutes: Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)),
        seconds: Math.floor((distance % (1000 * 60)) / 1000),
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  return (
    <div className="relative overflow-hidden bg-slate-950 rounded-3xl my-8 mx-4">
      {/* Background Decorative Elements */}
      <div className="absolute top-0 right-0 -translate-y-12 translate-x-12 w-64 h-64 bg-indigo-600/20 blur-[100px] rounded-full" />
      <div className="absolute bottom-0 left-0 translate-y-12 -translate-x-12 w-64 h-64 bg-rose-600/20 blur-[100px] rounded-full" />

      <div className="relative z-10 px-8 py-12 md:px-16 md:py-20 flex flex-col md:flex-row items-center justify-between gap-12">

        {/* Left Side: Text Content */}
        <div className="max-w-xl space-y-6 text-center md:text-left">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-500/10 border border-rose-500/20 text-rose-500 text-sm font-semibold uppercase tracking-wider">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-rose-500"></span>
            </span>
            Limited Time Event
          </div>

          <h1 className="text-4xl md:text-6xl font-bold text-white tracking-tight leading-tight">
            Summer Solstice <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-rose-400">
              Mega Flash Sale
            </span>
          </h1>

          <p className="text-slate-400 text-lg">
            Up to 60% off on all premium tech accessories. Don't miss out on our biggest drop of the season.
          </p>

          <div className="flex flex-wrap gap-4 justify-center md:justify-start pt-4">
            <button className="flex items-center gap-2 bg-white text-slate-950 px-8 py-4 rounded-xl font-bold hover:bg-indigo-50 transition-colors">
              <ShoppingBag size={20} />
              Shop the Drop
            </button>
            <button className="flex items-center gap-2 text-white border border-slate-700 px-8 py-4 rounded-xl font-bold hover:bg-white/5 transition-colors">
              View Catalog
              <ArrowRight size={20} />
            </button>
          </div>
        </div>

        {/* Right Side: Countdown Timer */}
        <div className="flex flex-col items-center gap-6 p-8 rounded-3xl bg-white/5 border border-white/10 backdrop-blur-sm">
          <div className="flex items-center gap-2 text-indigo-400 font-medium mb-2">
            <Timer size={18} />
            Ending In:
          </div>

          <div className="flex gap-4 md:gap-6 text-center">
            {[
              { label: 'Days', value: timeLeft.days },
              { label: 'Hrs', value: timeLeft.hours },
              { label: 'Min', value: timeLeft.minutes },
              { label: 'Sec', value: timeLeft.seconds }
            ].map((unit, i) => (
              <div key={i} className="flex flex-col items-center">
                <div className="text-3xl md:text-5xl font-mono font-bold text-white bg-slate-900 w-16 md:w-24 py-4 rounded-2xl border border-white/5 shadow-2xl">
                  {String(unit.value).padStart(2, '0')}
                </div>
                <span className="text-xs uppercase tracking-widest text-slate-500 mt-2 font-semibold">
                  {unit.label}
                </span>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
};

export default EventHero;