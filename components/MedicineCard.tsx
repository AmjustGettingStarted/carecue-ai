"use client";

import React, { useState } from "react";
import { MedicineSchedule } from "@/types/medicine";
import { useMedicineSchedule } from "@/context/MedicineContext";
import { EditMedicineModal } from "./EditMedicineModal";
import {
  Check,
  Clock,
  Edit2,
  AlertCircle,
  CheckCircle2,
  XCircle,
  Power,
  RotateCcw,
} from "lucide-react";

interface MedicineCardProps {
  schedule: MedicineSchedule;
}

export function MedicineCard({ schedule }: MedicineCardProps) {
  const { markAsTaken, markAsSkipped, toggleActive, updateSchedule } = useMedicineSchedule();
  const [isEditOpen, setIsEditOpen] = useState(false);

  // Compute status based on current time
  const getStatus = () => {
    if (schedule.takenToday) {
      return {
        label: "Taken",
        variant: "taken",
        bgClass: "bg-emerald-100 text-emerald-800 dark:bg-emerald-950/80 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800",
        icon: CheckCircle2,
      };
    }

    if (!schedule.active) {
      return {
        label: "Paused",
        variant: "paused",
        bgClass: "bg-stone-100 text-stone-600 dark:bg-stone-800 dark:text-stone-400 border-stone-200 dark:border-stone-700",
        icon: Power,
      };
    }

    const now = new Date();
    const [schedH, schedM] = schedule.time.split(":").map(Number);
    const schedDate = new Date();
    schedDate.setHours(schedH, schedM, 0, 0);

    const diffMinutes = Math.floor((now.getTime() - schedDate.getTime()) / (1000 * 60));

    if (diffMinutes >= -10 && diffMinutes <= 15) {
      return {
        label: "Due Now",
        variant: "due",
        bgClass: "bg-amber-100 text-amber-800 dark:bg-amber-950/80 dark:text-amber-300 border-amber-300 dark:border-amber-700 animate-pulse",
        icon: AlertCircle,
      };
    }

    if (diffMinutes > 15) {
      return {
        label: "Missed / Delayed",
        variant: "missed",
        bgClass: "bg-rose-100 text-rose-800 dark:bg-rose-950/80 dark:text-rose-300 border-rose-200 dark:border-rose-800",
        icon: XCircle,
      };
    }

    return {
      label: "Upcoming",
      variant: "upcoming",
      bgClass: "bg-sky-100 text-sky-800 dark:bg-sky-950/80 dark:text-sky-300 border-sky-200 dark:border-sky-800",
      icon: Clock,
    };
  };

  const status = getStatus();
  const StatusIcon = status.icon;

  const handleResetTaken = () => {
    updateSchedule(schedule.id, { takenToday: false, lastTakenTimestamp: null });
  };

  return (
    <>
      <div
        className={`relative overflow-hidden rounded-3xl border transition-all duration-200 bg-white dark:bg-stone-900 p-5 sm:p-6 shadow-sm hover:shadow-md ${
          schedule.takenToday
            ? "border-emerald-200 dark:border-emerald-900/50 opacity-90"
            : status.variant === "due"
            ? "border-amber-400 dark:border-amber-500 ring-2 ring-amber-400/20"
            : "border-stone-200 dark:border-stone-800"
        }`}
      >
        {/* Top Bar: Time, Status Badge & Toggle Actions */}
        <div className="flex items-center justify-between gap-2 mb-3">
          <div className="flex items-center gap-2.5">
            {/* High-Contrast Large Time */}
            <span className="font-mono text-xl sm:text-2xl font-black text-stone-900 dark:text-white tracking-tight">
              {schedule.time}
            </span>

            {/* Status indicator */}
            <span
              className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold border ${status.bgClass}`}
            >
              <StatusIcon className="w-3.5 h-3.5" />
              {status.label}
            </span>
          </div>

          {/* Quick Actions Header */}
          <div className="flex items-center gap-1">
            <button
              onClick={() => toggleActive(schedule.id)}
              title={schedule.active ? "Pause reminders" : "Resume reminders"}
              className={`p-1.5 rounded-xl text-xs transition-colors cursor-pointer ${
                schedule.active
                  ? "text-stone-400 hover:text-stone-600 dark:hover:text-stone-200 hover:bg-stone-100 dark:hover:bg-stone-800"
                  : "text-amber-500 bg-amber-50 dark:bg-amber-950/40"
              }`}
            >
              <Power className="w-4 h-4" />
            </button>
            <button
              onClick={() => setIsEditOpen(true)}
              title="Edit medication"
              className="p-1.5 rounded-xl text-stone-400 hover:text-stone-600 dark:hover:text-stone-200 hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors cursor-pointer"
            >
              <Edit2 className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Medicine Name and Dosage with Large Accessible Font */}
        <div className="my-2">
          <h3 className="text-xl sm:text-2xl font-black text-stone-900 dark:text-white tracking-tight leading-snug">
            {schedule.medicineName}
          </h3>
          <div className="flex flex-wrap items-center gap-2 mt-1.5">
            <span className="inline-block px-2.5 py-0.5 rounded-lg bg-stone-100 dark:bg-stone-800 text-stone-800 dark:text-stone-200 font-bold text-sm">
              {schedule.dosage}
            </span>

            {schedule.instructions && (
              <span className="inline-block px-2.5 py-0.5 rounded-lg bg-emerald-50 dark:bg-emerald-950/50 text-emerald-800 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800/50 text-xs font-semibold">
                {schedule.instructions}
              </span>
            )}
          </div>
        </div>

        {/* Friendly Cue Quote Block */}
        {schedule.friendlyCue && (
          <blockquote className="my-3.5 p-3 rounded-2xl bg-amber-50/70 dark:bg-amber-950/20 border-l-4 border-amber-400 dark:border-amber-600 text-stone-700 dark:text-amber-200 text-xs sm:text-sm italic font-medium leading-relaxed">
            &ldquo;{schedule.friendlyCue}&rdquo;
          </blockquote>
        )}

        {/* Action Buttons */}
        <div className="mt-4 pt-3 border-t border-stone-100 dark:border-stone-800 flex flex-wrap items-center justify-between gap-2">
          {schedule.takenToday ? (
            <div className="flex items-center justify-between w-full">
              <span className="text-xs font-medium text-emerald-700 dark:text-emerald-400 flex items-center gap-1.5">
                <Check className="w-4 h-4 stroke-[3]" />
                Completed today
              </span>
              <button
                type="button"
                onClick={handleResetTaken}
                className="text-xs text-stone-400 hover:text-stone-600 dark:hover:text-stone-200 flex items-center gap-1 cursor-pointer transition-colors"
                title="Mark as not taken yet"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                Reset
              </button>
            </div>
          ) : (
            <div className="flex items-center justify-between w-full gap-2">
              <button
                type="button"
                onClick={() => markAsTaken(schedule.id)}
                className="flex-1 py-2.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 active:scale-[0.98] text-white font-bold text-sm shadow-sm shadow-emerald-600/20 transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <Check className="w-4 h-4 stroke-[3]" />
                Mark as Taken
              </button>

              <button
                type="button"
                onClick={() => markAsSkipped(schedule.id)}
                className="py-2.5 px-3 rounded-xl border border-stone-200 dark:border-stone-700 hover:bg-stone-100 dark:hover:bg-stone-800 text-stone-600 dark:text-stone-400 font-medium text-xs transition-colors cursor-pointer"
                title="Log this dose as skipped"
              >
                Skip
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Edit Modal */}
      <EditMedicineModal
        schedule={schedule}
        isOpen={isEditOpen}
        onClose={() => setIsEditOpen(false)}
      />
    </>
  );
}
