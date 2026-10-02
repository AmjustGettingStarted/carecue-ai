"use client";

import React, { useState } from "react";
import { ExtractedSchedule } from "@/types/medicine";
import { Check, Edit2, Plus, Sparkles, Trash2, X } from "lucide-react";

interface ConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (schedules: ExtractedSchedule[]) => void;
  extractedSchedules: ExtractedSchedule[];
}

export function ConfirmationModal(props: ConfirmationModalProps) {
  if (!props.isOpen) return null;
  return <ConfirmationModalInner {...props} />;
}

function ConfirmationModalInner({
  onClose,
  onConfirm,
  extractedSchedules,
}: ConfirmationModalProps) {
  const [items, setItems] = useState<ExtractedSchedule[]>(extractedSchedules);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);

  const handleUpdateItem = (index: number, field: keyof ExtractedSchedule, value: string) => {
    setItems((prev) =>
      prev.map((item, i) => (i === index ? { ...item, [field]: value } : item))
    );
  };

  const handleRemoveItem = (index: number) => {
    setItems((prev) => prev.filter((_, i) => i !== index));
  };

  const handleAddItem = () => {
    const newItem: ExtractedSchedule = {
      medicineName: "New Medication",
      dosage: "1 tablet",
      time: "09:00",
      instructions: "Take with water",
      friendlyCue: "Time for your morning dose! You are doing great.",
    };
    setItems((prev) => [...prev, newItem]);
    setEditingIndex(items.length);
  };

  const handleConfirm = () => {
    onConfirm(items);
    onClose();
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in"
    >
      <div className="relative w-full max-w-2xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Modal Header */}
        <div className="p-6 border-b border-stone-200 dark:border-stone-800 bg-stone-50/50 dark:bg-stone-900/50 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-emerald-100 text-emerald-700 dark:bg-emerald-950/80 dark:text-emerald-400">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-stone-900 dark:text-white">
                Review Extracted Schedules
              </h2>
              <p className="text-xs text-stone-500 dark:text-stone-400">
                AI extracted {items.length} schedule {items.length === 1 ? "entry" : "entries"}. Verify or edit before saving.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-stone-400 hover:text-stone-600 dark:hover:text-stone-200 hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body / Items List */}
        <div className="p-6 overflow-y-auto space-y-4 flex-1">
          {items.length === 0 ? (
            <div className="text-center py-12 text-stone-500">
              No schedules to review. Click &ldquo;Add Entry&rdquo; below to create one.
            </div>
          ) : (
            items.map((item, idx) => {
              const isEditing = editingIndex === idx;

              return (
                <div
                  key={idx}
                  className="p-4 rounded-2xl border border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-800/60 shadow-xs transition-all hover:border-emerald-300 dark:hover:border-emerald-700"
                >
                  {isEditing ? (
                    <div className="space-y-3">
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                        <div className="sm:col-span-2">
                          <label className="text-[11px] font-semibold uppercase text-stone-500 mb-1 block">
                            Medicine Name
                          </label>
                          <input
                            type="text"
                            value={item.medicineName}
                            onChange={(e) => handleUpdateItem(idx, "medicineName", e.target.value)}
                            className="w-full px-3 py-2 text-sm rounded-xl border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-900 text-stone-900 dark:text-white focus:outline-emerald-500"
                          />
                        </div>
                        <div>
                          <label className="text-[11px] font-semibold uppercase text-stone-500 mb-1 block">
                            Dosage
                          </label>
                          <input
                            type="text"
                            value={item.dosage}
                            onChange={(e) => handleUpdateItem(idx, "dosage", e.target.value)}
                            className="w-full px-3 py-2 text-sm rounded-xl border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-900 text-stone-900 dark:text-white focus:outline-emerald-500"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                        <div>
                          <label className="text-[11px] font-semibold uppercase text-stone-500 mb-1 block">
                            Time (24h HH:MM)
                          </label>
                          <input
                            type="time"
                            value={item.time}
                            onChange={(e) => handleUpdateItem(idx, "time", e.target.value)}
                            className="w-full px-3 py-2 text-sm rounded-xl border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-900 text-stone-900 dark:text-white focus:outline-emerald-500"
                          />
                        </div>
                        <div className="sm:col-span-2">
                          <label className="text-[11px] font-semibold uppercase text-stone-500 mb-1 block">
                            Instructions
                          </label>
                          <input
                            type="text"
                            value={item.instructions}
                            onChange={(e) => handleUpdateItem(idx, "instructions", e.target.value)}
                            className="w-full px-3 py-2 text-sm rounded-xl border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-900 text-stone-900 dark:text-white focus:outline-emerald-500"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="text-[11px] font-semibold uppercase text-stone-500 mb-1 block">
                          Empathetic Reminder Cue
                        </label>
                        <textarea
                          rows={2}
                          value={item.friendlyCue}
                          onChange={(e) => handleUpdateItem(idx, "friendlyCue", e.target.value)}
                          className="w-full px-3 py-2 text-sm rounded-xl border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-900 text-stone-900 dark:text-white focus:outline-emerald-500"
                        />
                      </div>

                      <div className="flex justify-end pt-1">
                        <button
                          type="button"
                          onClick={() => setEditingIndex(null)}
                          className="px-3 py-1.5 rounded-lg bg-emerald-600 text-white text-xs font-semibold cursor-pointer"
                        >
                          Done Editing
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div>
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex items-center gap-2.5">
                          <span className="px-2.5 py-1 rounded-lg bg-emerald-100 dark:bg-emerald-950/70 text-emerald-800 dark:text-emerald-300 font-mono font-bold text-sm">
                            {item.time}
                          </span>
                          <div>
                            <h3 className="text-base font-bold text-stone-900 dark:text-white">
                              {item.medicineName}{" "}
                              <span className="text-sm font-normal text-stone-500">({item.dosage})</span>
                            </h3>
                            <p className="text-xs text-stone-500 dark:text-stone-400">
                              {item.instructions}
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center gap-1">
                          <button
                            onClick={() => setEditingIndex(idx)}
                            className="p-1.5 rounded-lg text-stone-400 hover:text-stone-600 dark:hover:text-stone-200 hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors cursor-pointer"
                            title="Edit entry"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleRemoveItem(idx)}
                            className="p-1.5 rounded-lg text-stone-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/40 transition-colors cursor-pointer"
                            title="Remove entry"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>

                      {item.friendlyCue && (
                        <div className="mt-2.5 pt-2 border-t border-stone-100 dark:border-stone-800 text-xs italic text-stone-600 dark:text-stone-300">
                          &ldquo;{item.friendlyCue}&rdquo;
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })
          )}

          <button
            type="button"
            onClick={handleAddItem}
            className="w-full py-2.5 border-2 border-dashed border-stone-300 dark:border-stone-700 hover:border-emerald-500 rounded-2xl text-xs font-semibold text-stone-600 dark:text-stone-300 flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            Add Another Medicine Manually
          </button>
        </div>

        {/* Modal Footer */}
        <div className="p-4 sm:p-6 border-t border-stone-200 dark:border-stone-800 bg-stone-50/50 dark:bg-stone-900/50 flex items-center justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2.5 rounded-xl border border-stone-300 dark:border-stone-700 text-stone-700 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-800 font-medium text-sm transition-colors cursor-pointer"
          >
            Cancel
          </button>
          <button
            type="button"
            disabled={items.length === 0}
            onClick={handleConfirm}
            className="px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white font-bold text-sm shadow-md shadow-emerald-600/20 transition-all flex items-center gap-2 cursor-pointer"
          >
            <Check className="w-4 h-4" />
            Save to Active Schedule ({items.length})
          </button>
        </div>
      </div>
    </div>
  );
}
