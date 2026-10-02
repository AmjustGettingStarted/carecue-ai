"use client";

import React, { createContext, useContext, useEffect, useState, useCallback } from "react";
import { MedicineSchedule, IntakeLog, ExtractedSchedule } from "@/types/medicine";
import { audioManager } from "@/lib/audio";

interface MedicineContextType {
  schedules: MedicineSchedule[];
  logs: IntakeLog[];
  isLoaded: boolean;
  addSchedules: (items: ExtractedSchedule[]) => void;
  updateSchedule: (id: string, updated: Partial<MedicineSchedule>) => void;
  deleteSchedule: (id: string) => void;
  toggleActive: (id: string) => void;
  markAsTaken: (id: string) => void;
  markAsSkipped: (id: string) => void;
  snoozeSchedule: (id: string, minutes?: number) => void;
  clearAll: () => void;
  resetToSample: () => void;
  activeAlarmMed: MedicineSchedule | null;
  dismissAlarm: () => void;
  testAlarmSound: () => void;
}

const STORAGE_KEY_SCHEDULES = "carecue_schedules_v1";
const STORAGE_KEY_LOGS = "carecue_logs_v1";
const STORAGE_KEY_DATE = "carecue_last_active_date_v1";

const DEFAULT_SAMPLE_SCHEDULES: MedicineSchedule[] = [
  {
    id: "sample-1",
    medicineName: "Metformin",
    dosage: "500mg",
    time: "08:00",
    instructions: "Take after breakfast with plenty of water",
    friendlyCue: "Good morning! Let's take your Metformin right after breakfast to keep your blood sugar steady today.",
    active: true,
    takenToday: false,
    lastTakenTimestamp: null,
  },
  {
    id: "sample-2",
    medicineName: "Amlodipine",
    dosage: "5mg",
    time: "08:00",
    instructions: "Take with water at 8:00 AM",
    friendlyCue: "Time for your morning Amlodipine to keep your heart and blood pressure peaceful and happy.",
    active: true,
    takenToday: false,
    lastTakenTimestamp: null,
  },
  {
    id: "sample-3",
    medicineName: "Calcium + Vit D",
    dosage: "1 tablet",
    time: "19:00",
    instructions: "Take with dinner",
    friendlyCue: "Dinner time! Here is your Calcium tablet to keep your bones strong and resilient.",
    active: true,
    takenToday: false,
    lastTakenTimestamp: null,
  },
];

// Helper functions outside component to avoid compiler purity checks
function getInitialSchedules(): MedicineSchedule[] {
  if (typeof window === "undefined") return DEFAULT_SAMPLE_SCHEDULES;
  try {
    const todayDateStr = new Date().toISOString().split("T")[0];
    const savedDate = localStorage.getItem(STORAGE_KEY_DATE);
    const isNewDay = Boolean(savedDate && savedDate !== todayDateStr);

    const storedSchedules = localStorage.getItem(STORAGE_KEY_SCHEDULES);
    let parsed: MedicineSchedule[] = storedSchedules ? JSON.parse(storedSchedules) : DEFAULT_SAMPLE_SCHEDULES;

    if (isNewDay) {
      parsed = parsed.map((s) => ({ ...s, takenToday: false }));
      localStorage.setItem(STORAGE_KEY_SCHEDULES, JSON.stringify(parsed));
    }

    localStorage.setItem(STORAGE_KEY_DATE, todayDateStr);
    return parsed;
  } catch {
    return DEFAULT_SAMPLE_SCHEDULES;
  }
}

function getInitialLogs(): IntakeLog[] {
  if (typeof window === "undefined") return [];
  try {
    const storedLogs = localStorage.getItem(STORAGE_KEY_LOGS);
    return storedLogs ? JSON.parse(storedLogs) : [];
  } catch {
    return [];
  }
}

function createId(prefix: string): string {
  return `${prefix}-${Math.random().toString(36).substring(2, 9)}`;
}

const MedicineContext = createContext<MedicineContextType | undefined>(undefined);

export function MedicineProvider({ children }: { children: React.ReactNode }) {
  const [schedules, setSchedules] = useState<MedicineSchedule[]>(getInitialSchedules);
  const [logs, setLogs] = useState<IntakeLog[]>(getInitialLogs);
  const [isLoaded, setIsLoaded] = useState(false);
  const [activeAlarmMed, setActiveAlarmMed] = useState<MedicineSchedule | null>(null);

  useEffect(() => {
    // Flag client hydration complete
    const timeout = setTimeout(() => {
      setIsLoaded(true);
    }, 0);
    return () => clearTimeout(timeout);
  }, []);

  const saveSchedules = useCallback((updated: MedicineSchedule[]) => {
    setSchedules(updated);
    try {
      localStorage.setItem(STORAGE_KEY_SCHEDULES, JSON.stringify(updated));
    } catch (e) {
      console.error("Error writing schedules to localStorage:", e);
    }
  }, []);

  const saveLogs = useCallback((updatedLogs: IntakeLog[]) => {
    setLogs(updatedLogs);
    try {
      localStorage.setItem(STORAGE_KEY_LOGS, JSON.stringify(updatedLogs));
    } catch (e) {
      console.error("Error writing logs to localStorage:", e);
    }
  }, []);

  const dismissAlarm = useCallback(() => {
    audioManager.stopAlarmLoop();
    setActiveAlarmMed(null);
  }, []);

  const addSchedules = useCallback((newItems: ExtractedSchedule[]) => {
    const formatted: MedicineSchedule[] = newItems.map((item) => ({
      ...item,
      id: createId("med"),
      active: true,
      takenToday: false,
      lastTakenTimestamp: null,
    }));

    setSchedules((prev) => {
      const combined = [...prev, ...formatted];
      try {
        localStorage.setItem(STORAGE_KEY_SCHEDULES, JSON.stringify(combined));
      } catch (e) {
        console.error(e);
      }
      return combined;
    });
    audioManager.playChime("success");
  }, []);

  const updateSchedule = useCallback((id: string, updated: Partial<MedicineSchedule>) => {
    setSchedules((prev) => {
      const next = prev.map((s) => (s.id === id ? { ...s, ...updated } : s));
      try {
        localStorage.setItem(STORAGE_KEY_SCHEDULES, JSON.stringify(next));
      } catch (e) {
        console.error(e);
      }
      return next;
    });
  }, []);

  const deleteSchedule = useCallback((id: string) => {
    setSchedules((prev) => {
      const next = prev.filter((s) => s.id !== id);
      try {
        localStorage.setItem(STORAGE_KEY_SCHEDULES, JSON.stringify(next));
      } catch (e) {
        console.error(e);
      }
      return next;
    });
    dismissAlarm();
  }, [dismissAlarm]);

  const toggleActive = useCallback((id: string) => {
    setSchedules((prev) => {
      const next = prev.map((s) => (s.id === id ? { ...s, active: !s.active } : s));
      try {
        localStorage.setItem(STORAGE_KEY_SCHEDULES, JSON.stringify(next));
      } catch (e) {
        console.error(e);
      }
      return next;
    });
    dismissAlarm();
  }, [dismissAlarm]);

  const markAsTaken = useCallback((id: string) => {
    const target = schedules.find((s) => s.id === id);
    if (!target) return;

    const now = new Date();
    const timeStr = now.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
    const dateStr = now.toLocaleDateString([], { month: "short", day: "numeric" });

    const newLog: IntakeLog = {
      id: createId("log"),
      scheduleId: target.id,
      medicineName: target.medicineName,
      dosage: target.dosage,
      action: "taken",
      timestamp: `${dateStr} at ${timeStr}`,
    };

    saveLogs([newLog, ...logs]);

    const next = schedules.map((s) =>
      s.id === id ? { ...s, takenToday: true, lastTakenTimestamp: now.toISOString() } : s
    );
    saveSchedules(next);

    dismissAlarm();
    audioManager.playChime("success");
  }, [schedules, logs, saveLogs, saveSchedules, dismissAlarm]);

  const markAsSkipped = useCallback((id: string) => {
    const target = schedules.find((s) => s.id === id);
    if (!target) return;

    const now = new Date();
    const timeStr = now.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
    const dateStr = now.toLocaleDateString([], { month: "short", day: "numeric" });

    const newLog: IntakeLog = {
      id: createId("log"),
      scheduleId: target.id,
      medicineName: target.medicineName,
      dosage: target.dosage,
      action: "skipped",
      timestamp: `${dateStr} at ${timeStr}`,
    };

    saveLogs([newLog, ...logs]);

    const next = schedules.map((s) =>
      s.id === id ? { ...s, takenToday: true } : s
    );
    saveSchedules(next);

    dismissAlarm();
  }, [schedules, logs, saveLogs, saveSchedules, dismissAlarm]);

  const snoozeSchedule = useCallback((id: string, minutes: number = 10) => {
    dismissAlarm();

    setTimeout(() => {
      setSchedules((current) => {
        const currentMed = current.find((s) => s.id === id);
        if (currentMed && currentMed.active && !currentMed.takenToday) {
          setActiveAlarmMed(currentMed);
          audioManager.startAlarmLoop();
        }
        return current;
      });
    }, minutes * 60 * 1000);
  }, [dismissAlarm]);

  const testAlarmSound = useCallback(() => {
    audioManager.playChime("alarm");
  }, []);

  const clearAll = useCallback(() => {
    saveSchedules([]);
    saveLogs([]);
    dismissAlarm();
  }, [saveSchedules, saveLogs, dismissAlarm]);

  const resetToSample = useCallback(() => {
    saveSchedules(DEFAULT_SAMPLE_SCHEDULES);
    saveLogs([]);
    dismissAlarm();
    audioManager.playChime("gentle");
  }, [saveSchedules, saveLogs, dismissAlarm]);

  return (
    <MedicineContext.Provider
      value={{
        schedules,
        logs,
        isLoaded,
        addSchedules,
        updateSchedule,
        deleteSchedule,
        toggleActive,
        markAsTaken,
        markAsSkipped,
        snoozeSchedule,
        clearAll,
        resetToSample,
        activeAlarmMed,
        dismissAlarm,
        testAlarmSound,
      }}
    >
      {children}
    </MedicineContext.Provider>
  );
}

export function useMedicineSchedule() {
  const context = useContext(MedicineContext);
  if (!context) {
    throw new Error("useMedicineSchedule must be used within a MedicineProvider");
  }
  return context;
}
