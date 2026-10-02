"use client";

import React, { useEffect, useState } from "react";
import { useMedicineSchedule } from "@/context/MedicineContext";
import { Sparkles, Volume2, Clock, HeartPulse } from "lucide-react";

export function Navbar() {
  const { testAlarmSound } = useMedicineSchedule();
  const [currentTime, setCurrentTime] = useState<string>("");
  const [currentDate, setCurrentDate] = useState<string>("");

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setCurrentTime(
        now.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", second: "2-digit", hour12: false })
      );
      setCurrentDate(
        now.toLocaleDateString([], { weekday: "short", month: "short", day: "numeric" })
      );
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <header className="sticky top-0 z-40 w-full border-b border-stone-200/80 dark:border-stone-800 bg-white/85 dark:bg-stone-950/85 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 flex items-center justify-between gap-4">
        {/* Logo and Brand */}
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-400 flex items-center justify-center text-white shadow-md shadow-emerald-500/20">
            <HeartPulse className="w-6 h-6 stroke-[2.2]" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-xl sm:text-2xl tracking-tight text-stone-900 dark:text-white">
                CareCue <span className="text-emerald-600 dark:text-emerald-400">AI</span>
              </span>
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-100 text-emerald-800 dark:bg-emerald-950/70 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800/60">
                <Sparkles className="w-3 h-3 text-emerald-600 dark:text-emerald-400" />
                Powered by Open-Source AI
              </span>
            </div>
            <p className="text-xs text-stone-500 dark:text-stone-400 hidden sm:block">
              Accessible prescription schedule & caregiver dashboard
            </p>
          </div>
        </div>

        {/* Right Action Tools: Clock & Test Alarm */}
        <div className="flex items-center gap-2 sm:gap-4">
          {/* Live Device Clock */}
          <div className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-xl bg-stone-100 dark:bg-stone-900 border border-stone-200 dark:border-stone-800 text-xs">
            <Clock className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
            <div className="flex flex-col text-left">
              <span className="font-mono font-bold text-stone-900 dark:text-white leading-tight">
                {currentTime || "--:--:--"}
              </span>
              <span className="text-[10px] text-stone-500">{currentDate}</span>
            </div>
          </div>

          {/* Test Audio Button */}
          <button
            onClick={testAlarmSound}
            title="Click to preview the Web Audio alarm chime"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-stone-100 hover:bg-stone-200 dark:bg-stone-800 dark:hover:bg-stone-700 text-stone-700 dark:text-stone-200 transition-colors border border-stone-200 dark:border-stone-700 cursor-pointer"
          >
            <Volume2 className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
            <span className="hidden sm:inline">Test Audio Tone</span>
            <span className="sm:hidden">Audio</span>
          </button>
        </div>
      </div>
    </header>
  );
}
