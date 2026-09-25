/**
 * Domain Models & Types for GymTracker Next
 * Strict 1-to-1 mapping with Kotlin domain models
 */

// 7 exact categories required - no secondary groups allowed!
export type ExerciseCategory =
  | 'Klatka piersiowa'
  | 'Plecy'
  | 'Barki'
  | 'Nogi'
  | 'Biceps'
  | 'Triceps'
  | 'Pozostałe';

export const EXERCISE_CATEGORIES: ExerciseCategory[] = [
  'Klatka piersiowa',
  'Plecy',
  'Barki',
  'Nogi',
  'Biceps',
  'Triceps',
  'Pozostałe',
];

export type DayType = 'WORKOUT' | 'REST' | 'EMPTY';

export type DayStatus = 'UNRESOLVED' | 'COMPLETED' | 'NOT_COMPLETED';

export interface ExerciseDefinition {
  id: string;
  name: string;
  category: ExerciseCategory; // MUST be strictly one category
  equipment?: string; // e.g. Sztanga, Hantle, Wyciąg, Maszyna, Masa ciała
  technique?: string; // Krótki opis techniki
  defaultSets?: number;
  defaultReps?: string | number; // e.g. "8-10" lub 10
  defaultRpe?: string | number; // e.g. "8" lub "8-9"
  notes?: string;
  isCustom?: boolean; // Czy dodane przez użytkownika
}

export interface WorkoutSet {
  id: string;
  setNumber: number;
  weightKg: number;
  reps: number;
  completed: boolean;
  previousWeightKg?: number;
  previousReps?: number;
}

// Plan set definition in PlanPasika.v2
export interface PlanSet {
  id: string;
  setNumber: number;
  weightKg: number;
  reps: number;
  completed?: boolean;
}

// Exercise inside a training day plan
export interface PlanExerciseItem {
  id: string;
  exerciseId: string;
  name: string;
  category: ExerciseCategory;
  sets: PlanSet[];
  notes?: string;
  defaultSets?: number;
}

// Day plan inside a specific week of a cycle
export interface PlanTrainingDay {
  id: string;
  dayOfWeek: number; // 1 (Mon) .. 7 (Sun)
  dayName: string; // "Poniedziałek", "Wtorek", etc.
  planName: string; // "Push", "Pull", "Legs", etc.
  exercises: PlanExerciseItem[];
  manualStatus: DayStatus; // 'UNRESOLVED' | 'COMPLETED' | 'NOT_COMPLETED'
  notes?: string; // Uwagi do planu treningowego dnia
}

// Week inside a training cycle
export interface TrainingWeek {
  id: string;
  weekNumber: number; // 1, 2, 3...
  name: string; // "Tydzień 1", "Tydzień 2"...
  days: PlanTrainingDay[];
}

// Top level training cycle
export interface TrainingCycleData {
  id: string;
  name: string; // "Cykl 2: Hipertrofia & Objętość"
  startDate: string; // "14.09.2026"
  weeks: TrainingWeek[];
  isActive?: boolean;
}

export interface ActiveWorkoutExercise {
  id: string;
  exerciseId: string;
  name: string;
  category: ExerciseCategory;
  skipped: boolean;
  replacedFromExerciseId?: string;
  sets: WorkoutSet[];
  notes?: string; // Uwagi do ćwiczenia w trakcie sesji treningowej
}

export interface ActiveWorkoutSession {
  id: string;
  name: string;
  startTime: number; // timestamp
  elapsedSeconds: number;
  isPaused: boolean;
  planDayId?: string;
  exercises: ActiveWorkoutExercise[];
  notes?: string; // Uwagi do całego treningu / sesji
}

export interface PlanDay {
  date: string; // YYYY-MM-DD
  dayOfWeek: number; // 1 (Mon) - 7 (Sun)
  dayType: DayType;
  workoutName?: string;
  exercises?: ExerciseDefinition[];
  manualStatus: DayStatus;
  hasRecordedSession?: boolean; // Used to warn if marked COMPLETED without recorded session
}

export interface SubstanceEntry {
  id: string;
  date: string; // YYYY-MM-DD
  time: string; // HH:mm
  name: string;
  details: string; // manual user notes, NO automated dosage advice
}

export interface CalendarNote {
  id: string;
  date: string; // YYYY-MM-DD
  content: string;
  createdAt: string;
}

export type EventCategory = 'TRENING' | 'ZDROWIE' | 'ZAWODY' | 'DIETA' | 'INNE';

export interface CalendarEvent {
  id: string;
  date: string; // YYYY-MM-DD
  time?: string; // HH:mm
  title: string;
  category: EventCategory;
  description?: string;
  createdAt: string;
}

export interface TrainingCycle {
  id: string;
  name: string;
  startDate: string;
  endDate: string;
  isActive: boolean;
}

export interface AnalyticsSummary {
  totalSets: number;
  totalWorkouts: number;
  totalDurationMinutes: number;
  categorySets: Record<ExerciseCategory, number>;
}

// Body Parts for Measurements
export type BodyPartKey =
  | 'biceps'
  | 'triceps'
  | 'chest'
  | 'shoulders'
  | 'waist'
  | 'hips'
  | 'thigh'
  | 'calf';

export const BODY_PARTS_CONFIG: Array<{ key: BodyPartKey; label: string; unit: string }> = [
  { key: 'biceps', label: 'Biceps', unit: 'cm' },
  { key: 'triceps', label: 'Triceps', unit: 'cm' },
  { key: 'chest', label: 'Klatka piersiowa', unit: 'cm' },
  { key: 'shoulders', label: 'Barki', unit: 'cm' },
  { key: 'waist', label: 'Talia', unit: 'cm' },
  { key: 'hips', label: 'Biodra', unit: 'cm' },
  { key: 'thigh', label: 'Udo', unit: 'cm' },
  { key: 'calf', label: 'Łydka', unit: 'cm' },
];

export interface BodyMeasurementEntry {
  id: string;
  date: string; // YYYY-MM-DD
  biceps?: number; // cm
  triceps?: number; // cm
  chest?: number; // cm
  shoulders?: number; // cm
  waist?: number; // cm
  hips?: number; // cm
  thigh?: number; // cm
  calf?: number; // cm
  notes?: string;
}

export interface BodyWeightEntry {
  id: string;
  date: string; // YYYY-MM-DD
  weight: number; // kg
  notes?: string;
}

export interface MetricProgressStat {
  key: string;
  label: string;
  unit: string;
  current: number;
  start: number;
  changeTotal: number;
  changePrevious: number;
  percentChange: number;
  count: number;
  weeklyChange: number;
  monthlyChange: number;
  monthlyRateString: string;
  trend: 'rośnie' | 'spada' | 'stabilnie';
  min?: number;
  max?: number;
}
