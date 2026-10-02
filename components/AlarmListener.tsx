"use client";

import React, { useEffect, useRef, useState } from "react";
import { useMedicineSchedule } from "@/context/MedicineContext";
import { MedicineSchedule } from "@/types/medicine";
import { audioManager } from "@/lib/audio";
import { BellRing, Check, Clock, Volume2, X } from "lucide-react";

export function AlarmListener() {
  const { schedules, markAsTaken, snoozeSchedule, markAsSkipped } = useMedicineSchedule();
  const [triggeredMed, setTriggeredMed] = useState<MedicineSchedule | null>(null);
  const lastFiredMinuteRef = useRef<Record<string, string>>({});

  useEffect(() => {
    const checkSchedule = () => {
      const now = new Date();
      const currentHH = String(now.getHours()).padStart(2, "0");
      const currentMM = String(now.getMinutes()).padStart(2, "0");
      const currentTimeStr = `${currentHH}:${currentMM}`;
      const todayDateStr = now.toISOString().split("T")[0];
      const fireKey = `${todayDateStr}_${currentTimeStr}`;

      // Search for active dose matching current time and not taken
      for (const med of schedules) {
        if (med.active && !med.takenToday && med.time === currentTimeStr) {
          const alreadyFired = lastFiredMinuteRef.current[med.id] === fireKey;

          if (!alreadyFired && !triggeredMed) {
            lastFiredMinuteRef.current[med.id] = fireKey;
            setTriggeredMed(med);
            audioManager.startAlarmLoop();
            break;
          }
        }
      }
    };

    // Initial check
    checkSchedule();

    // Check every 10 seconds per requirements
    const timer = setInterval(checkSchedule, 10000);
    return () => clearInterval(timer);
  }, [schedules, triggeredMed]);

  const handleTake = () => {
    if (!triggeredMed) return;
    audioManager.stopAlarmLoop();
    markAsTaken(triggeredMed.id);
    setTriggeredMed(null);
  };

  const handleSnooze = () => {
    if (!triggeredMed) return;
    audioManager.stopAlarmLoop();
    snoozeSchedule(triggeredMed.id, 10);
    setTriggeredMed(null);
  };

  const handleSkip = () => {
    if (!triggeredMed) return;
    audioManager.stopAlarmLoop();
    markAsSkipped(triggeredMed.id);
    setTriggeredMed(null);
  };

  if (!triggeredMed) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="alarm-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200"
    >
      <div className="relative w-full max-w-lg bg-white dark:bg-stone-900 border-2 border-emerald-500 rounded-3xl shadow-2xl p-6 sm:p-8 text-center flex flex-col items-center">
        {/* Pulsing Alarm Icon Indicator */}
        <div className="relative flex items-center justify-center w-24 h-24 mb-4 rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400">
          <span className="absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-40 animate-ping" />
          <BellRing className="w-12 h-12 relative z-10 animate-bounce" />
        </div>

        {/* Audio Indicator */}
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-300 text-xs font-semibold mb-3">
          <Volume2 className="w-3.5 h-3.5 animate-pulse" />
          CareCue Chime Ringing
        </div>

        {/* Title */}
        <h2
          id="alarm-title"
          className="text-2xl sm:text-3xl font-extrabold text-stone-900 dark:text-white mb-1 tracking-tight"
        >
          Time to take your medication
        </h2>

        {/* Medicine Name and Dosage */}
        <div className="my-3 px-5 py-3 rounded-2xl bg-stone-100 dark:bg-stone-800/80 w-full border border-stone-200 dark:border-stone-700">
          <span className="block text-2xl sm:text-3xl font-black text-emerald-600 dark:text-emerald-400">
            {triggeredMed.medicineName}
          </span>
          <span className="inline-block mt-1 text-base font-semibold text-stone-700 dark:text-stone-300">
            Dosage: {triggeredMed.dosage}
          </span>
          {triggeredMed.instructions && (
            <p className="mt-1 text-xs text-stone-500 dark:text-stone-400 font-medium">
              Note: {triggeredMed.instructions}
            </p>
          )}
        </div>

        {/* Empathetic Friendly Cue */}
        <blockquote className="my-4 px-4 py-3 bg-amber-50 dark:bg-amber-950/30 border-l-4 border-amber-500 rounded-r-xl text-stone-800 dark:text-amber-200 text-base sm:text-lg italic font-medium leading-relaxed w-full text-left">
          &ldquo;{triggeredMed.friendlyCue}&rdquo;
        </blockquote>

        {/* Time Stamp */}
        <div className="flex items-center gap-1.5 text-xs text-stone-500 dark:text-stone-400 mb-6">
          <Clock className="w-4 h-4 text-emerald-500" />
          Scheduled for {triggeredMed.time} (Current Alarm)
        </div>

        {/* Action Buttons */}
        <div className="w-full flex flex-col gap-3">
          {/* Large Green Primary Action */}
          <button
            onClick={handleTake}
            className="w-full py-4 px-6 rounded-2xl bg-emerald-600 hover:bg-emerald-500 active:scale-[0.99] text-white font-bold text-lg sm:text-xl shadow-lg shadow-emerald-600/30 transition-all flex items-center justify-center gap-3 cursor-pointer"
          >
            <Check className="w-6 h-6 stroke-[3]" />
            Mark as Taken
          </button>

          {/* Secondary Actions */}
          <div className="grid grid-cols-2 gap-3 w-full">
            <button
              onClick={handleSnooze}
              className="py-3 px-4 rounded-xl bg-stone-200 hover:bg-stone-300 dark:bg-stone-800 dark:hover:bg-stone-700 text-stone-800 dark:text-stone-200 font-semibold text-sm transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <Clock className="w-4 h-4" />
              Snooze (10 mins)
            </button>
            <button
              onClick={handleSkip}
              className="py-3 px-4 rounded-xl border border-stone-300 dark:border-stone-700 hover:bg-stone-100 dark:hover:bg-stone-800 text-stone-600 dark:text-stone-400 font-medium text-sm transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <X className="w-4 h-4" />
              Skip this dose
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
