import type { ExtractedSchedule } from "@/types/medicine";

/**
 * Strips leading/trailing verbs, articles, conjunctions, and conversational filler from drug names.
 * Formats the result as clean Title Case (e.g., "and one multivitamin" -> "Multivitamin").
 */
export function cleanMedicineName(rawName: string): string {
  if (!rawName) return "Medication";

  let name = rawName.trim();

  // Strip leading prefixes like "take", "and one", "and", "one", "a", "an", "the", "have", "please", etc.
  const prefixRegex = /^(?:please\s+|take\s+|having\s+|have\s+|consume\s+|administer\s+|and\s+one\s+|and\s+|one\s+|a\s+|an\s+|the\s+|also\s+|then\s+)+/i;
  while (prefixRegex.test(name)) {
    name = name.replace(prefixRegex, "").trim();
  }

  // Strip trailing forms if attached to name (e.g. "Metformin tablet" -> "Metformin")
  name = name.replace(/\s+(?:tablet|tablets|capsule|capsules|pill|pills|syrup|drops?|injection)$/i, "");
  name = name.replace(/\s+\d+\s*(?:mg|mcg|g|ml|iu)$/i, "");

  // Strip non-alphanumeric noise at edges
  name = name.replace(/^[^a-zA-Z0-9]+|[^a-zA-Z0-9)]+$/g, "").trim();

  // Title-case capitalization for clean display
  name = name
    .toLowerCase()
    .split(/[\s-]+/)
    .filter(Boolean)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");

  return name || "Medication";
}

/**
 * Standardize time string into strict "HH:MM" (24-hour).
 */
export function normalizeTime(rawTime?: string, defaultHour: string = "08:30"): string {
  if (!rawTime) return defaultHour;

  const trimmed = rawTime.trim();

  // Check if already valid HH:MM
  if (/^([01]\d|2[0-3]):([0-5]\d)$/.test(trimmed)) {
    return trimmed;
  }

  // Handle 12-hour AM/PM formats e.g. "8 AM", "8:30pm"
  const ampmMatch = trimmed.match(/^(\d{1,2})(?::(\d{2}))?\s*(am|pm)$/i);
  if (ampmMatch) {
    let hour = parseInt(ampmMatch[1], 10);
    const minute = ampmMatch[2] ? ampmMatch[2].padStart(2, "0") : "00";
    const meridiem = ampmMatch[3].toLowerCase();

    if (meridiem === "pm" && hour < 12) hour += 12;
    if (meridiem === "am" && hour === 12) hour = 0;
    return `${hour.toString().padStart(2, "0")}:${minute}`;
  }

  // Contextual text fallback
  const lower = trimmed.toLowerCase();
  if (lower.includes("bed") || lower.includes("night") || lower.includes("sleep")) return "22:00";
  if (lower.includes("dinner") || lower.includes("evening")) return "20:00";
  if (lower.includes("lunch") || lower.includes("afternoon")) return "13:00";
  if (lower.includes("breakfast") || lower.includes("morning")) return "08:30";

  return defaultHour;
}

/**
 * Generates an empathetic, natural one-sentence friendlyCue.
 */
export function generateFriendlyCue(
  cleanName: string,
  dosage: string,
  time: string,
  instructions?: string
): string {
  const [hourStr] = time.split(":");
  const hour = parseInt(hourStr, 10) || 8;
  const note = instructions ? ` (${instructions})` : "";

  if (hour >= 5 && hour < 12) {
    return `Good morning! Time for your ${cleanName} (${dosage})${note} to start your day strong.`;
  }
  if (hour >= 12 && hour < 17) {
    return `Afternoon check-in! Please take your ${cleanName} (${dosage})${note}. Keep up the great routine!`;
  }
  if (hour >= 17 && hour < 21) {
    return `Good evening! Time for your ${cleanName} (${dosage})${note}. Relax and enjoy the evening.`;
  }
  return `Winding down for bed! Time for your ${cleanName} (${dosage})${note}. Sleep peacefully tonight.`;
}

/**
 * Splits a single multi-dose schedule entry into multiple distinct entries if required.
 * Handles patterns like "twice daily", "breakfast and dinner", "morning and night", "every 8 hours".
 */
export function splitMultiDoseSchedule(item: ExtractedSchedule): ExtractedSchedule[] {
  const cleanName = cleanMedicineName(item.medicineName);
  const dosage = item.dosage || "1 dose";
  const instructions = item.instructions || "";
  const combinedContext = `${item.instructions} ${item.friendlyCue} ${item.time}`.toLowerCase();

  // Case 1: Breakfast and Dinner or Twice daily with breakfast and dinner
  if (
    (combinedContext.includes("breakfast") && combinedContext.includes("dinner")) ||
    (combinedContext.includes("morning") && combinedContext.includes("dinner"))
  ) {
    return [
      {
        medicineName: cleanName,
        dosage,
        time: "08:30",
        instructions: "Take with breakfast",
        friendlyCue: generateFriendlyCue(cleanName, dosage, "08:30", "with breakfast"),
      },
      {
        medicineName: cleanName,
        dosage,
        time: "20:00",
        instructions: "Take with dinner",
        friendlyCue: generateFriendlyCue(cleanName, dosage, "20:00", "with dinner"),
      },
    ];
  }

  // Case 2: Morning and Night / Bedtime
  if (
    (combinedContext.includes("morning") && (combinedContext.includes("night") || combinedContext.includes("bed"))) ||
    combinedContext.includes("morning and evening")
  ) {
    return [
      {
        medicineName: cleanName,
        dosage,
        time: "08:30",
        instructions: "Take in the morning",
        friendlyCue: generateFriendlyCue(cleanName, dosage, "08:30", "morning dose"),
      },
      {
        medicineName: cleanName,
        dosage,
        time: "20:00",
        instructions: "Take in the evening",
        friendlyCue: generateFriendlyCue(cleanName, dosage, "20:00", "evening dose"),
      },
    ];
  }

  // Case 3: Generic "twice daily" or "twice a day" or "BID" without specified meals
  if (
    /\b(twice\s+(?:daily|a\s+day)|bid|2\s+times\s+(?:a\s+day|daily))\b/i.test(combinedContext) &&
    !item.time.includes(",")
  ) {
    return [
      {
        medicineName: cleanName,
        dosage,
        time: "08:30",
        instructions: instructions ? `${instructions} (Morning)` : "Take in morning",
        friendlyCue: generateFriendlyCue(cleanName, dosage, "08:30"),
      },
      {
        medicineName: cleanName,
        dosage,
        time: "20:00",
        instructions: instructions ? `${instructions} (Evening)` : "Take in evening",
        friendlyCue: generateFriendlyCue(cleanName, dosage, "20:00"),
      },
    ];
  }

  // Case 4: Every 8 hours or TID / three times a day
  if (
    combinedContext.includes("every 8 hours") ||
    /\b(three\s+times|3\s+times|tid)\b/i.test(combinedContext)
  ) {
    return [
      {
        medicineName: cleanName,
        dosage,
        time: "08:00",
        instructions: instructions ? `${instructions} (Morning)` : "Take morning dose",
        friendlyCue: generateFriendlyCue(cleanName, dosage, "08:00"),
      },
      {
        medicineName: cleanName,
        dosage,
        time: "16:00",
        instructions: instructions ? `${instructions} (Afternoon)` : "Take afternoon dose",
        friendlyCue: generateFriendlyCue(cleanName, dosage, "16:00"),
      },
      {
        medicineName: cleanName,
        dosage,
        time: "23:00",
        instructions: instructions ? `${instructions} (Night)` : "Take night dose",
        friendlyCue: generateFriendlyCue(cleanName, dosage, "23:00"),
      },
    ];
  }

  // Single dose with normalized time
  const normalizedTime = normalizeTime(item.time);
  const cleanCue =
    item.friendlyCue && !item.friendlyCue.toLowerCase().includes("and one") && !item.friendlyCue.toLowerCase().includes("take paracetamol")
      ? item.friendlyCue
      : generateFriendlyCue(cleanName, dosage, normalizedTime, instructions);

  return [
    {
      medicineName: cleanName,
      dosage,
      time: normalizedTime,
      instructions: instructions || "Take with water",
      friendlyCue: cleanCue,
    },
  ];
}

/**
 * Full sanitization pipeline applied to all extracted schedules (both AI and heuristic).
 */
export function sanitizeAndSplitSchedules(rawSchedules: ExtractedSchedule[]): ExtractedSchedule[] {
  const sanitizedList: ExtractedSchedule[] = [];

  for (const item of rawSchedules) {
    const cleanName = cleanMedicineName(item.medicineName);
    const itemWithCleanName = { ...item, medicineName: cleanName };
    const splitItems = splitMultiDoseSchedule(itemWithCleanName);
    sanitizedList.push(...splitItems);
  }

  return sanitizedList;
}
