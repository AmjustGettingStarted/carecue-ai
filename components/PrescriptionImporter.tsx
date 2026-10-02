"use client";

import React, { useState } from "react";
import { useMedicineSchedule } from "@/context/MedicineContext";
import { ExtractedSchedule, ParsePrescriptionResponse } from "@/types/medicine";
import { ConfirmationModal } from "./ConfirmationModal";
import { Sparkles, Loader2, ArrowRight, Wand2, CheckCircle2, AlertCircle } from "lucide-react";

interface SamplePreset {
  label: string;
  category: string;
  text: string;
}

const SAMPLE_PRESETS: SamplePreset[] = [
  {
    label: "Dad's Blood Pressure & Sugar",
    category: "Chronic Care",
    text: "Metformin 500mg morning and night after food, Amlodipine 5mg at 8 AM",
  },
  {
    label: "Post-Surgery Recovery",
    category: "Antibiotics",
    text: "Amoxicillin 500mg every 8 hours at 08:00, 16:00, and 23:00 with food",
  },
  {
    label: "Grandma's Evening Routine",
    category: "Vitamins & Sleep",
    text: "Calcium tablet at 19:00 with dinner, Melatonin 3mg at 22:00 before sleep",
  },
];

export function PrescriptionImporter() {
  const { addSchedules } = useMedicineSchedule();
  const [prescriptionText, setPrescriptionText] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [extractedItems, setExtractedItems] = useState<ExtractedSchedule[]>([]);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);

  const handleApplyPreset = (text: string) => {
    setPrescriptionText(text);
    setErrorMsg(null);
  };

  const handleExtract = async () => {
    if (!prescriptionText.trim()) {
      setErrorMsg("Please enter or paste a prescription or doctor's note first.");
      return;
    }

    setIsLoading(true);
    setErrorMsg(null);

    try {
      const res = await fetch("/api/parse-prescription", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prescriptionText: prescriptionText.trim() }),
      });

      const data: ParsePrescriptionResponse = await res.json();

      if (!res.ok || data.error) {
        throw new Error(data.error || "Failed to parse prescription.");
      }

      if (!data.schedules || data.schedules.length === 0) {
        throw new Error("No medications could be extracted from this text. Please check the wording.");
      }

      setExtractedItems(data.schedules);
      setIsConfirmOpen(true);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Error connecting to AI service.";
      setErrorMsg(msg);
    } finally {
      setIsLoading(false);
    }
  };

  const handleConfirmCommit = (finalSchedules: ExtractedSchedule[]) => {
    addSchedules(finalSchedules);
    setPrescriptionText("");
    setExtractedItems([]);
  };

  return (
    <section className="relative overflow-hidden rounded-3xl bg-gradient-to-b from-emerald-50/50 via-white to-stone-50/40 dark:from-emerald-950/20 dark:via-stone-900/60 dark:to-stone-950 border border-emerald-100 dark:border-stone-800 shadow-sm p-6 sm:p-8">
      {/* Decorative gradient blur */}
      <div className="absolute -top-16 -right-16 w-56 h-56 rounded-full bg-emerald-400/10 blur-3xl pointer-events-none" />

      <div className="max-w-3xl">
        <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-emerald-700 dark:text-emerald-400 mb-2">
          <Wand2 className="w-4 h-4" />
          Intelligent Ingestion
        </div>

        <h2 className="text-xl sm:text-2xl font-bold text-stone-900 dark:text-white tracking-tight">
          Paste Raw Prescription or Doctor&apos;s Instructions
        </h2>
        <p className="mt-1 text-sm text-stone-600 dark:text-stone-400">
          CareCue&apos;s open-source clinical AI automatically parses dosages, 24-hour schedules, and writes gentle reminders for your loved ones.
        </p>

        {/* Quick Sample Presets */}
        <div className="mt-4 flex flex-col sm:flex-row sm:items-center gap-2">
          <span className="text-xs font-semibold text-stone-500 dark:text-stone-400 shrink-0">
            Quick Samples:
          </span>
          <div className="flex flex-wrap gap-2">
            {SAMPLE_PRESETS.map((preset, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => handleApplyPreset(preset.text)}
                className="px-3 py-1.5 rounded-full text-xs font-medium bg-white dark:bg-stone-800 hover:bg-emerald-50 dark:hover:bg-emerald-950/40 text-stone-700 dark:text-stone-300 hover:text-emerald-700 dark:hover:text-emerald-300 border border-stone-200 dark:border-stone-700 transition-all hover:scale-[1.02] cursor-pointer shadow-2xs"
              >
                {preset.label}
              </button>
            ))}
          </div>
        </div>

        {/* Prescription Textarea */}
        <div className="mt-4 relative">
          <textarea
            rows={4}
            value={prescriptionText}
            onChange={(e) => {
              setPrescriptionText(e.target.value);
              if (errorMsg) setErrorMsg(null);
            }}
            placeholder="e.g., Metformin 500mg morning and night after food, Amlodipine 5mg at 8 AM, or paste a doctor's discharge summary..."
            className="w-full p-4 rounded-2xl border border-stone-300 dark:border-stone-700 bg-white/90 dark:bg-stone-900/90 text-stone-900 dark:text-white placeholder:text-stone-400 text-sm sm:text-base focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 shadow-inner transition-all resize-y"
          />

          {errorMsg && (
            <div className="mt-2 flex items-center gap-2 text-xs font-medium text-rose-600 dark:text-rose-400">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}
        </div>

        {/* Submit Action */}
        <div className="mt-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="text-xs text-stone-500 dark:text-stone-400 flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-500" />
            <span>Zero-cloud client persistence &bull; Privacy strictly safeguarded</span>
          </div>

          <button
            type="button"
            onClick={handleExtract}
            disabled={isLoading || !prescriptionText.trim()}
            className="w-full sm:w-auto px-6 py-3 rounded-2xl bg-emerald-600 hover:bg-emerald-500 active:scale-95 disabled:opacity-50 text-white font-bold text-sm shadow-md shadow-emerald-600/25 transition-all flex items-center justify-center gap-2.5 cursor-pointer"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Extracting with AI...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4" />
                <span>Extract Schedule with AI</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </div>
      </div>

      {/* Confirmation & Review Modal */}
      <ConfirmationModal
        isOpen={isConfirmOpen}
        onClose={() => setIsConfirmOpen(false)}
        onConfirm={handleConfirmCommit}
        extractedSchedules={extractedItems}
      />
    </section>
  );
}
