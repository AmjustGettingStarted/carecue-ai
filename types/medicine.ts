export interface MedicineSchedule {
  id: string;
  medicineName: string;
  dosage: string;
  time: string; // 24-hour "HH:MM"
  instructions: string;
  friendlyCue: string;
  active: boolean;
  takenToday?: boolean;
  lastTakenTimestamp?: string | null;
}

export interface IntakeLog {
  id: string;
  scheduleId: string;
  medicineName: string;
  dosage: string;
  action: "taken" | "skipped";
  timestamp: string;
}

export type ExtractedSchedule = Omit<MedicineSchedule, "id" | "active" | "takenToday" | "lastTakenTimestamp">;

export interface ParsePrescriptionResponse {
  schedules: ExtractedSchedule[];
  rawAnalysis?: string;
  source?: "ai" | "fallback";
  error?: string;
}
