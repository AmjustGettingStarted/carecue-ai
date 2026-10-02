"use client";

import React, { useState } from "react";
import { useMedicineSchedule } from "@/context/MedicineContext";
import {
  CheckCircle2,
  XCircle,
  Clock,
  History,
  Check,
  TrendingUp,
} from "lucide-react";

export function ComplianceHistory() {
  const { logs } = useMedicineSchedule();
  const [filterAction, setFilterAction] = useState<"all" | "taken" | "skipped">("all");

  const filteredLogs = logs.filter((log) => {
    if (filterAction === "taken") return log.action === "taken";
    if (filterAction === "skipped") return log.action === "skipped";
    return true;
  });

  const takenCount = logs.filter((l) => l.action === "taken").length;
  const skippedCount = logs.filter((l) => l.action === "skipped").length;
  const totalEvents = logs.length;
  const adherenceRate = totalEvents > 0 ? Math.round((takenCount / totalEvents) * 100) : 100;

  return (
    <section className="space-y-6">
      {/* Overview Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-5 rounded-3xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 shadow-xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-emerald-100 dark:bg-emerald-950/70 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0">
            <CheckCircle2 className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs font-semibold text-stone-500 block">Doses Taken</span>
            <span className="text-2xl font-black text-stone-900 dark:text-white">
              {takenCount}
            </span>
            <span className="text-[11px] text-emerald-600 dark:text-emerald-400 font-medium block">
              Successfully logged
            </span>
          </div>
        </div>

        <div className="p-5 rounded-3xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 shadow-xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-amber-100 dark:bg-amber-950/70 text-amber-600 dark:text-amber-400 flex items-center justify-center shrink-0">
            <XCircle className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs font-semibold text-stone-500 block">Doses Skipped</span>
            <span className="text-2xl font-black text-stone-900 dark:text-white">
              {skippedCount}
            </span>
            <span className="text-[11px] text-amber-600 dark:text-amber-400 font-medium block">
              Reported to caregiver
            </span>
          </div>
        </div>

        <div className="p-5 rounded-3xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 shadow-xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-sky-100 dark:bg-sky-950/70 text-sky-600 dark:text-sky-400 flex items-center justify-center shrink-0">
            <TrendingUp className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs font-semibold text-stone-500 block">Logged Adherence</span>
            <span className="text-2xl font-black text-stone-900 dark:text-white">
              {adherenceRate}%
            </span>
            <span className="text-[11px] text-sky-600 dark:text-sky-400 font-medium block">
              Overall intake rate
            </span>
          </div>
        </div>
      </div>

      {/* Header and Controls */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl sm:text-2xl font-black text-stone-900 dark:text-white tracking-tight">
              Compliance & Intake History
            </h2>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-300">
              {filteredLogs.length} events
            </span>
          </div>
          <p className="text-xs sm:text-sm text-stone-500 dark:text-stone-400">
            Historical log of all medication intake events and alerts
          </p>
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-2">
          <div className="flex items-center bg-stone-100 dark:bg-stone-800/80 p-1 rounded-2xl border border-stone-200 dark:border-stone-700 text-xs">
            <button
              onClick={() => setFilterAction("all")}
              className={`px-3 py-1.5 rounded-xl font-semibold transition-all cursor-pointer ${
                filterAction === "all"
                  ? "bg-white dark:bg-stone-900 text-stone-900 dark:text-white shadow-xs"
                  : "text-stone-600 dark:text-stone-400"
              }`}
            >
              All Events
            </button>
            <button
              onClick={() => setFilterAction("taken")}
              className={`px-3 py-1.5 rounded-xl font-semibold transition-all cursor-pointer ${
                filterAction === "taken"
                  ? "bg-white dark:bg-stone-900 text-stone-900 dark:text-white shadow-xs"
                  : "text-stone-600 dark:text-stone-400"
              }`}
            >
              Taken
            </button>
            <button
              onClick={() => setFilterAction("skipped")}
              className={`px-3 py-1.5 rounded-xl font-semibold transition-all cursor-pointer ${
                filterAction === "skipped"
                  ? "bg-white dark:bg-stone-900 text-stone-900 dark:text-white shadow-xs"
                  : "text-stone-600 dark:text-stone-400"
              }`}
            >
              Skipped
            </button>
          </div>
        </div>
      </div>

      {/* Logs Table / List */}
      {filteredLogs.length === 0 ? (
        <div className="rounded-3xl border-2 border-dashed border-stone-200 dark:border-stone-800 p-8 sm:p-12 text-center bg-stone-50/50 dark:bg-stone-900/30">
          <History className="w-10 h-10 text-stone-300 dark:text-stone-600 mx-auto mb-2" />
          <h3 className="text-base font-bold text-stone-800 dark:text-stone-200">
            No intake logs recorded yet
          </h3>
          <p className="mt-1 text-xs text-stone-500 max-w-sm mx-auto">
            When alarms trigger or when you click &ldquo;Mark as Taken&rdquo; or &ldquo;Skip&rdquo; on any medicine card, intake events are logged here.
          </p>
        </div>
      ) : (
        <div className="rounded-3xl border border-stone-200 dark:border-stone-800 overflow-hidden bg-white dark:bg-stone-900 shadow-xs">
          <div className="divide-y divide-stone-100 dark:divide-stone-800">
            {filteredLogs.map((log) => {
              const isTaken = log.action === "taken";
              return (
                <div
                  key={log.id}
                  className="p-4 sm:p-5 flex items-center justify-between gap-4 hover:bg-stone-50/80 dark:hover:bg-stone-800/40 transition-colors"
                >
                  <div className="flex items-center gap-3 sm:gap-4">
                    <div
                      className={`w-10 h-10 rounded-2xl flex items-center justify-center shrink-0 ${
                        isTaken
                          ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-950/70 dark:text-emerald-400"
                          : "bg-rose-100 text-rose-700 dark:bg-rose-950/70 dark:text-rose-400"
                      }`}
                    >
                      {isTaken ? <Check className="w-5 h-5 stroke-[2.5]" /> : <XCircle className="w-5 h-5" />}
                    </div>

                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-extrabold text-base text-stone-900 dark:text-white">
                          {log.medicineName}
                        </span>
                        <span className="text-xs font-semibold px-2 py-0.5 rounded-md bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-300">
                          {log.dosage}
                        </span>
                      </div>
                      <span className="text-xs text-stone-500 dark:text-stone-400 flex items-center gap-1.5 mt-0.5">
                        <Clock className="w-3.5 h-3.5" />
                        {log.timestamp}
                      </span>
                    </div>
                  </div>

                  <div>
                    <span
                      className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${
                        isTaken
                          ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800/60"
                          : "bg-rose-50 text-rose-700 dark:bg-rose-950/50 dark:text-rose-300 border border-rose-200 dark:border-rose-800/60"
                      }`}
                    >
                      {log.action}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </section>
  );
}
