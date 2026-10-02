"use client";

import React, { useState } from "react";
import { useMedicineSchedule } from "@/context/MedicineContext";
import { MedicineCard } from "./MedicineCard";
import { ConfirmationModal } from "./ConfirmationModal";
import { ExtractedSchedule } from "@/types/medicine";
import {
  Clock,
  Plus,
  RotateCcw,
} from "lucide-react";

export function TimelineView() {
  const { schedules, addSchedules, resetToSample } = useMedicineSchedule();
  const [filter, setFilter] = useState<"all" | "pending" | "taken">("all");
  const [isManualModalOpen, setIsManualModalOpen] = useState(false);

  // Sort chronologically by 24h time "HH:MM"
  const sortedSchedules = [...schedules].sort((a, b) => a.time.localeCompare(b.time));

  const totalDoses = schedules.length;
  const takenDoses = schedules.filter((s) => s.takenToday).length;
  const pendingDoses = totalDoses - takenDoses;
  const adherencePercent = totalDoses > 0 ? Math.round((takenDoses / totalDoses) * 100) : 0;

  const filtered = sortedSchedules.filter((item) => {
    if (filter === "pending") return !item.takenToday;
    if (filter === "taken") return item.takenToday;
    return true;
  });

  const handleCreateManual = (items: ExtractedSchedule[]) => {
    addSchedules(items);
  };

  return (
    <section className="space-y-6">
      {/* Overview Stats Bar */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
        <div className="p-4 rounded-2xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 shadow-xs">
          <span className="text-xs font-semibold text-stone-500 block">Total Doses</span>
          <span className="text-2xl sm:text-3xl font-black text-stone-900 dark:text-white">
            {totalDoses}
          </span>
        </div>

        <div className="p-4 rounded-2xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 shadow-xs">
          <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 block">
            Taken Today
          </span>
          <span className="text-2xl sm:text-3xl font-black text-emerald-600 dark:text-emerald-400">
            {takenDoses}
          </span>
        </div>

        <div className="p-4 rounded-2xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 shadow-xs">
          <span className="text-xs font-semibold text-amber-600 dark:text-amber-400 block">
            Remaining
          </span>
          <span className="text-2xl sm:text-3xl font-black text-amber-600 dark:text-amber-400">
            {pendingDoses}
          </span>
        </div>

        <div className="p-4 rounded-2xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 shadow-xs">
          <span className="text-xs font-semibold text-stone-500 block">Today&apos;s Adherence</span>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-black text-stone-900 dark:text-white">
              {adherencePercent}%
            </span>
          </div>
        </div>
      </div>

      {/* Header and Controls */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl sm:text-2xl font-black text-stone-900 dark:text-white tracking-tight">
              Today&apos;s Schedule
            </h2>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-300">
              {filtered.length} {filtered.length === 1 ? "dose" : "doses"}
            </span>
          </div>
          <p className="text-xs sm:text-sm text-stone-500 dark:text-stone-400">
            Chronological medication timeline with active audio-visual alerts
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
          {/* Filter Pills */}
          <div className="flex items-center bg-stone-100 dark:bg-stone-800/80 p-1 rounded-2xl border border-stone-200 dark:border-stone-700 text-xs">
            <button
              onClick={() => setFilter("all")}
              className={`px-3 py-1.5 rounded-xl font-semibold transition-all cursor-pointer ${
                filter === "all"
                  ? "bg-white dark:bg-stone-900 text-stone-900 dark:text-white shadow-xs"
                  : "text-stone-600 dark:text-stone-400 hover:text-stone-900"
              }`}
            >
              All ({totalDoses})
            </button>
            <button
              onClick={() => setFilter("pending")}
              className={`px-3 py-1.5 rounded-xl font-semibold transition-all cursor-pointer ${
                filter === "pending"
                  ? "bg-white dark:bg-stone-900 text-stone-900 dark:text-white shadow-xs"
                  : "text-stone-600 dark:text-stone-400 hover:text-stone-900"
              }`}
            >
              Remaining ({pendingDoses})
            </button>
            <button
              onClick={() => setFilter("taken")}
              className={`px-3 py-1.5 rounded-xl font-semibold transition-all cursor-pointer ${
                filter === "taken"
                  ? "bg-white dark:bg-stone-900 text-stone-900 dark:text-white shadow-xs"
                  : "text-stone-600 dark:text-stone-400 hover:text-stone-900"
              }`}
            >
              Taken ({takenDoses})
            </button>
          </div>

          {/* Quick Manual Add Button */}
          <button
            onClick={() => setIsManualModalOpen(true)}
            className="px-3.5 py-2 rounded-2xl bg-stone-900 hover:bg-stone-800 dark:bg-white dark:hover:bg-stone-100 text-white dark:text-stone-900 text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer shadow-xs"
          >
            <Plus className="w-4 h-4" />
            Add Dose
          </button>
        </div>
      </div>

      {/* Medicine Cards List */}
      {filtered.length === 0 ? (
        <div className="rounded-3xl border-2 border-dashed border-stone-200 dark:border-stone-800 p-8 sm:p-12 text-center bg-stone-50/50 dark:bg-stone-900/30">
          <div className="w-12 h-12 rounded-2xl bg-stone-100 dark:bg-stone-800 text-stone-400 flex items-center justify-center mx-auto mb-3">
            <Clock className="w-6 h-6" />
          </div>
          <h3 className="text-base font-bold text-stone-800 dark:text-stone-200">
            No medication doses found
          </h3>
          <p className="mt-1 text-xs text-stone-500 max-w-sm mx-auto">
            {filter !== "all"
              ? `There are no ${filter} doses right now.`
              : "Paste a prescription above or use one of the quick samples to populate your schedule."}
          </p>

          <div className="mt-4 flex items-center justify-center gap-3">
            <button
              onClick={resetToSample}
              className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold flex items-center gap-1.5 cursor-pointer shadow-xs"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              Load Sample Schedule
            </button>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
          {filtered.map((item) => (
            <MedicineCard key={item.id} schedule={item} />
          ))}
        </div>
      )}

      {/* Manual Creation Modal */}
      <ConfirmationModal
        isOpen={isManualModalOpen}
        onClose={() => setIsManualModalOpen(false)}
        onConfirm={handleCreateManual}
        extractedSchedules={[
          {
            medicineName: "Multivitamin",
            dosage: "1 tablet",
            time: "12:00",
            instructions: "Take with lunch",
            friendlyCue: "Midday vitality boost! Time for your vitamin with lunch.",
          },
        ]}
      />
    </section>
  );
}
