"use client";

import React, { useState } from "react";
import { MedicineSchedule } from "@/types/medicine";
import { useMedicineSchedule } from "@/context/MedicineContext";
import { Trash2, X, Check } from "lucide-react";

interface EditMedicineModalProps {
  schedule: MedicineSchedule | null;
  isOpen: boolean;
  onClose: () => void;
}

export function EditMedicineModal(props: EditMedicineModalProps) {
  if (!props.isOpen || !props.schedule) return null;
  return <EditMedicineModalInner {...props} schedule={props.schedule} />;
}

function EditMedicineModalInner({
  schedule,
  onClose,
}: {
  schedule: MedicineSchedule;
  isOpen: boolean;
  onClose: () => void;
}) {
  const { updateSchedule, deleteSchedule } = useMedicineSchedule();

  const [form, setForm] = useState({
    medicineName: schedule.medicineName,
    dosage: schedule.dosage,
    time: schedule.time,
    instructions: schedule.instructions,
    friendlyCue: schedule.friendlyCue,
    active: schedule.active,
  });

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    updateSchedule(schedule.id, form);
    onClose();
  };

  const handleDelete = () => {
    if (window.confirm(`Are you sure you want to delete ${schedule.medicineName}?`)) {
      deleteSchedule(schedule.id);
      onClose();
    }
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in"
    >
      <div className="relative w-full max-w-lg bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-3xl shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="p-6 border-b border-stone-200 dark:border-stone-800 bg-stone-50/50 dark:bg-stone-900/50 flex items-center justify-between">
          <div>
            <h3 className="text-xl font-bold text-stone-900 dark:text-white">
              Edit Medication Schedule
            </h3>
            <p className="text-xs text-stone-500">Update timing, instructions, or friendly cue</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-stone-400 hover:text-stone-600 dark:hover:text-stone-200 hover:bg-stone-100 dark:hover:bg-stone-800 cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSave} className="p-6 space-y-4">
          <div className="grid grid-cols-3 gap-3">
            <div className="col-span-2">
              <label className="text-xs font-semibold text-stone-700 dark:text-stone-300 block mb-1">
                Medicine Name
              </label>
              <input
                type="text"
                required
                value={form.medicineName}
                onChange={(e) => setForm({ ...form, medicineName: e.target.value })}
                className="w-full px-3 py-2 text-sm rounded-xl border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-800 text-stone-900 dark:text-white focus:outline-emerald-500"
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-stone-700 dark:text-stone-300 block mb-1">
                Dosage
              </label>
              <input
                type="text"
                required
                value={form.dosage}
                onChange={(e) => setForm({ ...form, dosage: e.target.value })}
                className="w-full px-3 py-2 text-sm rounded-xl border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-800 text-stone-900 dark:text-white focus:outline-emerald-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="text-xs font-semibold text-stone-700 dark:text-stone-300 block mb-1">
                Scheduled Time
              </label>
              <input
                type="time"
                required
                value={form.time}
                onChange={(e) => setForm({ ...form, time: e.target.value })}
                className="w-full px-3 py-2 text-sm rounded-xl border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-800 text-stone-900 dark:text-white focus:outline-emerald-500"
              />
            </div>
            <div className="col-span-2">
              <label className="text-xs font-semibold text-stone-700 dark:text-stone-300 block mb-1">
                Instructions (badge)
              </label>
              <input
                type="text"
                value={form.instructions}
                onChange={(e) => setForm({ ...form, instructions: e.target.value })}
                placeholder="e.g. After meal with water"
                className="w-full px-3 py-2 text-sm rounded-xl border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-800 text-stone-900 dark:text-white focus:outline-emerald-500"
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-semibold text-stone-700 dark:text-stone-300 block mb-1">
              Empathetic Friendly Cue
            </label>
            <textarea
              rows={2}
              value={form.friendlyCue}
              onChange={(e) => setForm({ ...form, friendlyCue: e.target.value })}
              className="w-full px-3 py-2 text-sm rounded-xl border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-800 text-stone-900 dark:text-white focus:outline-emerald-500"
            />
          </div>

          <div className="flex items-center gap-2 pt-2">
            <input
              type="checkbox"
              id="activeSchedule"
              checked={form.active}
              onChange={(e) => setForm({ ...form, active: e.target.checked })}
              className="w-4 h-4 rounded text-emerald-600 focus:ring-emerald-500 border-stone-300"
            />
            <label htmlFor="activeSchedule" className="text-xs font-medium text-stone-700 dark:text-stone-300 cursor-pointer">
              Schedule active (triggers alarms)
            </label>
          </div>

          {/* Action Buttons */}
          <div className="pt-4 border-t border-stone-200 dark:border-stone-800 flex items-center justify-between">
            <button
              type="button"
              onClick={handleDelete}
              className="px-3 py-2 rounded-xl text-xs font-semibold text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <Trash2 className="w-4 h-4" />
              Delete Dose
            </button>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-stone-600 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold shadow-sm shadow-emerald-600/30 flex items-center gap-1.5 cursor-pointer"
              >
                <Check className="w-4 h-4" />
                Save Changes
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
