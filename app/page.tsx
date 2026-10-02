"use client";

import React, { useState } from "react";
import { Navbar } from "@/components/Navbar";
import { PrescriptionImporter } from "@/components/PrescriptionImporter";
import { TimelineView } from "@/components/TimelineView";
import { ComplianceHistory } from "@/components/ComplianceHistory";
import { AlarmListener } from "@/components/AlarmListener";
import { useMedicineSchedule } from "@/context/MedicineContext";
import {
  CalendarDays,
  History,
  ShieldCheck,
  Lock,
  Heart,
  RotateCcw,
} from "lucide-react";

export default function Home() {
  const [activeTab, setActiveTab] = useState<"timeline" | "history">("timeline");
  const { isLoaded, resetToSample } = useMedicineSchedule();

  if (!isLoaded) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-stone-50 dark:bg-stone-950">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-4 border-emerald-600 border-t-transparent rounded-full animate-spin" />
          <p className="text-sm font-semibold text-stone-600 dark:text-stone-300">
            Initializing CareCue AI...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-stone-50/60 dark:bg-stone-950 text-stone-900 dark:text-stone-100 font-sans selection:bg-emerald-500 selection:text-white">
      {/* Top Navigation */}
      <Navbar />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Caregiver Prescription Ingestion Section */}
        <PrescriptionImporter />

        {/* Tab Switcher & Secondary Actions */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-stone-200/80 dark:border-stone-800 pb-4">
          <nav className="flex items-center gap-2 p-1.5 rounded-2xl bg-stone-200/70 dark:bg-stone-900 border border-stone-300/50 dark:border-stone-800">
            <button
              onClick={() => setActiveTab("timeline")}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold transition-all cursor-pointer ${
                activeTab === "timeline"
                  ? "bg-white dark:bg-stone-800 text-stone-900 dark:text-white shadow-xs"
                  : "text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-white"
              }`}
            >
              <CalendarDays className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
              Daily Schedule & Alarms
            </button>

            <button
              onClick={() => setActiveTab("history")}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold transition-all cursor-pointer ${
                activeTab === "history"
                  ? "bg-white dark:bg-stone-800 text-stone-900 dark:text-white shadow-xs"
                  : "text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-white"
              }`}
            >
              <History className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
              Compliance History
            </button>
          </nav>

          <div className="flex items-center gap-3">
            <button
              onClick={resetToSample}
              className="text-xs font-semibold text-stone-500 hover:text-emerald-600 dark:text-stone-400 dark:hover:text-emerald-400 flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              Reset Demo Prescriptions
            </button>
          </div>
        </div>

        {/* Tab Views */}
        {activeTab === "timeline" ? <TimelineView /> : <ComplianceHistory />}

        {/* Informational Privacy & Hacktoberfest Footer Banner */}
        <section className="mt-12 p-6 rounded-3xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex items-start gap-3.5">
            <div className="p-3 rounded-2xl bg-emerald-100 dark:bg-emerald-950/70 text-emerald-700 dark:text-emerald-400 shrink-0">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-stone-900 dark:text-white">
                Privacy-First Client Storage & Open-Source AI Core
              </h4>
              <p className="text-xs text-stone-500 dark:text-stone-400 max-w-2xl mt-0.5">
                CareCue AI runs client-side alarms using the browser&apos;s Web Audio API. Prescriptions are parsed with open-weight models (Llama 3.1 / Gemma 2) and stored exclusively in your browser&apos;s local storage.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-300">
              <Lock className="w-3 h-3 text-emerald-600" />
              100% Offline Alarm Support
            </span>
          </div>
        </section>
      </main>

      {/* Global Persistent Audio/Visual Alarm Engine */}
      <AlarmListener />

      {/* Footer */}
      <footer className="mt-auto border-t border-stone-200 dark:border-stone-800 py-6 text-center text-xs text-stone-500">
        <p className="flex items-center justify-center gap-1">
          Built with <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500" /> for caregivers and loved ones &bull; CareCue AI
        </p>
      </footer>
    </div>
  );
}
