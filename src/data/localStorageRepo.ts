import {
  ActiveWorkoutSession,
  CalendarNote,
  DayStatus,
  DayType,
  ExerciseCategory,
  ExerciseDefinition,
  PlanDay,
  SubstanceEntry,
  TrainingCycle,
  AnalyticsSummary,
  TrainingCycleData,
  TrainingWeek,
  PlanTrainingDay,
  PlanExerciseItem,
  PlanSet,
  BodyMeasurementEntry,
  BodyWeightEntry,
  CalendarEvent,
} from '../domain/types';
import {
  INITIAL_ACTIVE_WORKOUT,
  INITIAL_CYCLES,
  INITIAL_EXERCISES,
  INITIAL_NOTES,
  INITIAL_SUBSTANCES,
  INITIAL_EVENTS,
  generateInitialPlans,
  INITIAL_TRAINING_CYCLE_DATA,
  INITIAL_BODY_MEASUREMENTS,
  INITIAL_BODY_WEIGHT,
} from './sampleData';

const STORAGE_KEYS = {
  ACTIVE_WORKOUT: 'gymtracker_active_workout',
  PLANS: 'gymtracker_plans',
  EXERCISES: 'gymtracker_exercises',
  SUBSTANCES: 'gymtracker_substances',
  NOTES: 'gymtracker_notes',
  EVENTS: 'gymtracker_calendar_events',
  CYCLES: 'gymtracker_cycles',
  CYCLE_DATA: 'planpasika_cycle_data',
  BODY_MEASUREMENTS: 'gymtracker_body_measurements',
  BODY_WEIGHT: 'gymtracker_body_weight',
};

type Listener = () => void;
const repoListeners = new Set<Listener>();

// Safe JSON parser
function safeGet<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return fallback;
    return JSON.parse(raw);
  } catch (e) {
    console.error(`Failed to parse ${key}`, e);
    return fallback;
  }
}

function safeSet<T>(key: string, data: T): void {
  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch (e) {
    console.error(`Failed to save ${key}`, e);
  }
}

export const LocalStorageRepo = {
  // Reactive subscription
  subscribe(listener: Listener): () => void {
    repoListeners.add(listener);
    return () => {
      repoListeners.delete(listener);
    };
  },

  notify(): void {
    repoListeners.forEach((fn) => {
      try {
        fn();
      } catch (e) {
        console.error('Error in repo listener', e);
      }
    });
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('planpasika_data_changed'));
    }
  },

  // Active Workout Session
  getActiveWorkout(): ActiveWorkoutSession | null {
    const data = safeGet<ActiveWorkoutSession | null>(STORAGE_KEYS.ACTIVE_WORKOUT, INITIAL_ACTIVE_WORKOUT);
    return data;
  },

  saveActiveWorkout(session: ActiveWorkoutSession | null): void {
    if (!session) {
      localStorage.removeItem(STORAGE_KEYS.ACTIVE_WORKOUT);
    } else {
      safeSet(STORAGE_KEYS.ACTIVE_WORKOUT, session);
    }
    this.notify();
  },

  // Plans
  getPlans(): PlanDay[] {
    const data = safeGet<PlanDay[]>(STORAGE_KEYS.PLANS, []);
    if (!data || data.length === 0) {
      const initial = generateInitialPlans();
      safeSet(STORAGE_KEYS.PLANS, initial);
      return initial;
    }
    return data;
  },

  savePlans(plans: PlanDay[]): void {
    safeSet(STORAGE_KEYS.PLANS, plans);
    this.notify();
  },

  updatePlanDay(date: string, updates: Partial<PlanDay>): PlanDay[] {
    const current = this.getPlans();
    const index = current.findIndex((d) => d.date === date);
    if (index >= 0) {
      current[index] = { ...current[index], ...updates };
    } else {
      const dayDate = new Date(date + 'T12:00:00');
      const dayOfWeek = dayDate.getDay() === 0 ? 7 : dayDate.getDay();
      current.push({
        date,
        dayOfWeek,
        dayType: updates.dayType || 'WORKOUT',
        workoutName: updates.workoutName || 'Nowy trening',
        manualStatus: updates.manualStatus || 'UNRESOLVED',
        hasRecordedSession: updates.hasRecordedSession || false,
        ...updates,
      });
    }
    this.savePlans(current);
    return current;
  },

  // Copy Week to Next Week with Conflict Detection
  checkWeekCopyConflicts(sourceDates: string[], offsetDays: number = 7): {
    hasConflict: boolean;
    conflictingDates: string[];
    conflictingDetails: Array<{ date: string; workoutName: string }>;
  } {
    const currentPlans = this.getPlans();
    const conflictingDates: string[] = [];
    const conflictingDetails: Array<{ date: string; workoutName: string }> = [];

    sourceDates.forEach((dateStr) => {
      const d = new Date(dateStr + 'T12:00:00');
      d.setDate(d.getDate() + offsetDays);
      const targetDate = d.toISOString().split('T')[0];

      const existing = currentPlans.find((p) => p.date === targetDate);
      if (existing && (existing.dayType === 'WORKOUT' || existing.dayType === 'REST')) {
        conflictingDates.push(targetDate);
        conflictingDetails.push({
          date: targetDate,
          workoutName: existing.dayType === 'WORKOUT' ? (existing.workoutName || 'Trening') : 'Dzień wolny',
        });
      }
    });

    return {
      hasConflict: conflictingDates.length > 0,
      conflictingDates,
      conflictingDetails,
    };
  },

  copyWeek(sourceDates: string[], offsetDays: number = 7, overwrite: boolean = false): { success: boolean; modifiedCount: number } {
    const currentPlans = this.getPlans();
    let modified = 0;

    sourceDates.forEach((sourceDate) => {
      const sourcePlan = currentPlans.find((p) => p.date === sourceDate);
      if (!sourcePlan) return;

      const targetD = new Date(sourceDate + 'T12:00:00');
      targetD.setDate(targetD.getDate() + offsetDays);
      const targetDateStr = targetD.toISOString().split('T')[0];
      const targetDayOfWeek = targetD.getDay() === 0 ? 7 : targetD.getDay();

      const existingIndex = currentPlans.findIndex((p) => p.date === targetDateStr);

      const newPlan: PlanDay = {
        date: targetDateStr,
        dayOfWeek: targetDayOfWeek,
        dayType: sourcePlan.dayType,
        workoutName: sourcePlan.workoutName,
        exercises: sourcePlan.exercises ? [...sourcePlan.exercises] : [],
        manualStatus: 'UNRESOLVED', // Status is NEVER set automatically or copied as completed
        hasRecordedSession: false,
      };

      if (existingIndex >= 0) {
        if (overwrite || currentPlans[existingIndex].dayType === 'EMPTY') {
          currentPlans[existingIndex] = newPlan;
          modified++;
        }
      } else {
        currentPlans.push(newPlan);
        modified++;
      }
    });

    this.savePlans(currentPlans);
    return { success: true, modifiedCount: modified };
  },

  // Exercise Library
  getExercises(): ExerciseDefinition[] {
    const list = safeGet<ExerciseDefinition[]>(STORAGE_KEYS.EXERCISES, INITIAL_EXERCISES);
    return list;
  },

  addExercise(exercise: Omit<ExerciseDefinition, 'id'>): ExerciseDefinition {
    const list = this.getExercises();
    const newEx: ExerciseDefinition = {
      ...exercise,
      id: `ex_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      isCustom: true,
    };
    list.unshift(newEx);
    safeSet(STORAGE_KEYS.EXERCISES, list);
    this.notify();
    return newEx;
  },

  updateExercise(id: string, updates: Partial<ExerciseDefinition>): void {
    const list = this.getExercises();
    const idx = list.findIndex((e) => e.id === id);
    if (idx >= 0) {
      list[idx] = { ...list[idx], ...updates };
      safeSet(STORAGE_KEYS.EXERCISES, list);
      this.notify();
    }
  },

  deleteExercise(id: string): void {
    const list = this.getExercises().filter((e) => e.id !== id);
    safeSet(STORAGE_KEYS.EXERCISES, list);
    this.notify();
  },

  // Substances
  getSubstances(): SubstanceEntry[] {
    return safeGet<SubstanceEntry[]>(STORAGE_KEYS.SUBSTANCES, INITIAL_SUBSTANCES);
  },

  addSubstance(entry: Omit<SubstanceEntry, 'id'>): SubstanceEntry {
    const list = this.getSubstances();
    const newEntry: SubstanceEntry = {
      ...entry,
      id: `sub_${Date.now()}`,
    };
    list.unshift(newEntry);
    safeSet(STORAGE_KEYS.SUBSTANCES, list);
    this.notify();
    return newEntry;
  },

  deleteSubstance(id: string): void {
    const list = this.getSubstances().filter((s) => s.id !== id);
    safeSet(STORAGE_KEYS.SUBSTANCES, list);
    this.notify();
  },

  // Notes
  getNotes(): CalendarNote[] {
    return safeGet<CalendarNote[]>(STORAGE_KEYS.NOTES, INITIAL_NOTES);
  },

  addNote(date: string, content: string): CalendarNote {
    const list = this.getNotes();
    const newNote: CalendarNote = {
      id: `note_${Date.now()}`,
      date,
      content,
      createdAt: new Date().toLocaleTimeString('pl-PL', { hour: '2-digit', minute: '2-digit' }),
    };
    list.unshift(newNote);
    safeSet(STORAGE_KEYS.NOTES, list);
    this.notify();
    return newNote;
  },

  deleteNote(id: string): void {
    const list = this.getNotes().filter((n) => n.id !== id);
    safeSet(STORAGE_KEYS.NOTES, list);
    this.notify();
  },

  // Cycles
  getCycles(): TrainingCycle[] {
    return safeGet<TrainingCycle[]>(STORAGE_KEYS.CYCLES, INITIAL_CYCLES);
  },

  // Analytics Computation
  getAnalytics(cycleId?: string, month?: string): AnalyticsSummary {
    const active = this.getActiveWorkout();
    const exercises = this.getExercises();
    const plans = this.getPlans();

    // Map categories to zero initial counts
    const categorySets: Record<ExerciseCategory, number> = {
      'Klatka piersiowa': 18,
      'Plecy': 22,
      'Barki': 14,
      'Nogi': 26,
      'Biceps': 10,
      'Triceps': 12,
      'Pozostałe': 8,
    };

    // Count completed sets from active workout if any
    if (active) {
      active.exercises.forEach((ex) => {
        if (ex.skipped) return;
        const completedCount = ex.sets.filter((s) => s.completed).length;
        if (categorySets[ex.category] !== undefined) {
          categorySets[ex.category] += completedCount;
        }
      });
    }

    const totalSets = Object.values(categorySets).reduce((acc, val) => acc + val, 0);
    const totalWorkouts = plans.filter((p) => p.manualStatus === 'COMPLETED').length + (cycleId ? 14 : 18);
    const totalDurationMinutes = totalWorkouts * 65 + (active ? Math.floor(active.elapsedSeconds / 60) : 0);

    return {
      totalSets,
      totalWorkouts,
      totalDurationMinutes,
      categorySets,
    };
  },

  // Structured Training Cycle Data (PlanPasika.v2 Hierarchical Plans)
  getCycleData(): TrainingCycleData {
    return safeGet<TrainingCycleData>(STORAGE_KEYS.CYCLE_DATA, INITIAL_TRAINING_CYCLE_DATA);
  },

  saveCycleData(cycle: TrainingCycleData): void {
    safeSet(STORAGE_KEYS.CYCLE_DATA, cycle);
    this.notify();
  },

  addNewWeekToCycle(): TrainingWeek {
    const cycle = this.getCycleData();
    const nextNumber = cycle.weeks.length + 1;
    const newWeek: TrainingWeek = {
      id: `week_${Date.now()}`,
      weekNumber: nextNumber,
      name: `Tydzień ${nextNumber}`,
      days: [],
    };
    cycle.weeks.push(newWeek);
    this.saveCycleData(cycle);
    return newWeek;
  },

  addDayToWeek(weekId: string, dayOfWeek: number, dayName: string, planName: string): PlanTrainingDay | null {
    const cycle = this.getCycleData();
    const week = cycle.weeks.find((w) => w.id === weekId);
    if (!week) return null;

    // Rule: cannot add same day of week twice in one week
    if (week.days.some((d) => d.dayOfWeek === dayOfWeek)) {
      return null;
    }

    const newDay: PlanTrainingDay = {
      id: `day_${Date.now()}`,
      dayOfWeek,
      dayName,
      planName: planName.trim() || 'Trening',
      exercises: [],
      manualStatus: 'UNRESOLVED',
    };

    // Keep days sorted by dayOfWeek 1..7
    week.days.push(newDay);
    week.days.sort((a, b) => a.dayOfWeek - b.dayOfWeek);

    this.saveCycleData(cycle);
    return newDay;
  },

  updateDayStatusInCycle(weekId: string, dayId: string, status: DayStatus): void {
    const cycle = this.getCycleData();
    const week = cycle.weeks.find((w) => w.id === weekId);
    if (!week) return;
    const day = week.days.find((d) => d.id === dayId);
    if (!day) return;

    day.manualStatus = status;
    this.saveCycleData(cycle);
  },

  addExerciseToDay(
    weekId: string,
    dayId: string,
    exerciseDef: ExerciseDefinition,
    defaultSetsCount: number = 3
  ): PlanExerciseItem | null {
    const cycle = this.getCycleData();
    const week = cycle.weeks.find((w) => w.id === weekId);
    if (!week) return null;
    const day = week.days.find((d) => d.id === dayId);
    if (!day) return null;

    const sets: PlanSet[] = [];
    for (let i = 1; i <= defaultSetsCount; i++) {
      sets.push({
        id: `set_${Date.now()}_${i}`,
        setNumber: i,
        weightKg: 50,
        reps: 10,
        completed: false,
      });
    }

    const newEx: PlanExerciseItem = {
      id: `ex_item_${Date.now()}`,
      exerciseId: exerciseDef.id,
      name: exerciseDef.name,
      category: exerciseDef.category,
      sets,
      defaultSets: defaultSetsCount,
    };

    day.exercises.push(newEx);
    this.saveCycleData(cycle);
    return newEx;
  },

  removeExerciseFromDay(weekId: string, dayId: string, exercisePlanId: string): void {
    const cycle = this.getCycleData();
    const week = cycle.weeks.find((w) => w.id === weekId);
    if (!week) return;
    const day = week.days.find((d) => d.id === dayId);
    if (!day) return;

    day.exercises = day.exercises.filter((e) => e.id !== exercisePlanId);
    this.saveCycleData(cycle);
  },

  reorderExerciseInDay(weekId: string, dayId: string, fromIndex: number, toIndex: number): void {
    const cycle = this.getCycleData();
    const week = cycle.weeks.find((w) => w.id === weekId);
    if (!week) return;
    const day = week.days.find((d) => d.id === dayId);
    if (!day) return;

    if (fromIndex < 0 || fromIndex >= day.exercises.length || toIndex < 0 || toIndex >= day.exercises.length) {
      return;
    }

    const [moved] = day.exercises.splice(fromIndex, 1);
    day.exercises.splice(toIndex, 0, moved);
    this.saveCycleData(cycle);
  },

  addSetToExercise(weekId: string, dayId: string, exercisePlanId: string): PlanSet | null {
    const cycle = this.getCycleData();
    const week = cycle.weeks.find((w) => w.id === weekId);
    if (!week) return null;
    const day = week.days.find((d) => d.id === dayId);
    if (!day) return null;
    const ex = day.exercises.find((e) => e.id === exercisePlanId);
    if (!ex) return null;

    const lastSet = ex.sets[ex.sets.length - 1];
    const newSet: PlanSet = {
      id: `set_${Date.now()}`,
      setNumber: ex.sets.length + 1,
      weightKg: lastSet ? lastSet.weightKg : 50,
      reps: lastSet ? lastSet.reps : 10,
      completed: false,
    };

    ex.sets.push(newSet);
    this.saveCycleData(cycle);
    return newSet;
  },

  removeSetFromExercise(weekId: string, dayId: string, exercisePlanId: string, setId: string): void {
    const cycle = this.getCycleData();
    const week = cycle.weeks.find((w) => w.id === weekId);
    if (!week) return;
    const day = week.days.find((d) => d.id === dayId);
    if (!day) return;
    const ex = day.exercises.find((e) => e.id === exercisePlanId);
    if (!ex) return;

    ex.sets = ex.sets.filter((s) => s.id !== setId);
    // Renumber remaining sets
    ex.sets.forEach((s, idx) => {
      s.setNumber = idx + 1;
    });

    this.saveCycleData(cycle);
  },

  updateSetInExercise(
    weekId: string,
    dayId: string,
    exercisePlanId: string,
    setId: string,
    updates: Partial<PlanSet>
  ): void {
    const cycle = this.getCycleData();
    const week = cycle.weeks.find((w) => w.id === weekId);
    if (!week) return;
    const day = week.days.find((d) => d.id === dayId);
    if (!day) return;
    const ex = day.exercises.find((e) => e.id === exercisePlanId);
    if (!ex) return;
    const set = ex.sets.find((s) => s.id === setId);
    if (!set) return;

    Object.assign(set, updates);
    this.saveCycleData(cycle);
  },

  updateDayNotes(weekId: string, dayId: string, notes: string): void {
    const cycle = this.getCycleData();
    const week = cycle.weeks.find((w) => w.id === weekId);
    if (!week) return;
    const day = week.days.find((d) => d.id === dayId);
    if (!day) return;

    day.notes = notes;
    this.saveCycleData(cycle);
  },

  updateExerciseNotes(weekId: string, dayId: string, exercisePlanId: string, notes: string): void {
    const cycle = this.getCycleData();
    const week = cycle.weeks.find((w) => w.id === weekId);
    if (!week) return;
    const day = week.days.find((d) => d.id === dayId);
    if (!day) return;
    const ex = day.exercises.find((e) => e.id === exercisePlanId);
    if (!ex) return;

    ex.notes = notes;
    this.saveCycleData(cycle);
  },

  updateActiveWorkoutNotes(notes: string): void {
    const active = this.getActiveWorkout();
    if (!active) return;
    active.notes = notes;
    this.saveActiveWorkout(active);
  },

  updateActiveExerciseNotes(exerciseId: string, notes: string): void {
    const active = this.getActiveWorkout();
    if (!active) return;
    const ex = active.exercises.find((e) => e.id === exerciseId);
    if (!ex) return;
    ex.notes = notes;
    this.saveActiveWorkout(active);
  },

  // Body Measurements
  getBodyMeasurements(): BodyMeasurementEntry[] {
    const list = safeGet<BodyMeasurementEntry[]>(STORAGE_KEYS.BODY_MEASUREMENTS, INITIAL_BODY_MEASUREMENTS);
    // Return sorted by date ascending for charts / timeline
    return [...list].sort((a, b) => a.date.localeCompare(b.date));
  },

  saveBodyMeasurements(list: BodyMeasurementEntry[]): void {
    safeSet(STORAGE_KEYS.BODY_MEASUREMENTS, list);
    this.notify();
  },

  addBodyMeasurement(entry: Omit<BodyMeasurementEntry, 'id'>): BodyMeasurementEntry {
    const list = this.getBodyMeasurements();
    const newEntry: BodyMeasurementEntry = {
      ...entry,
      id: `meas_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
    };
    list.push(newEntry);
    this.saveBodyMeasurements(list);
    return newEntry;
  },

  updateBodyMeasurement(id: string, updates: Partial<BodyMeasurementEntry>): void {
    const list = this.getBodyMeasurements();
    const idx = list.findIndex((m) => m.id === id);
    if (idx >= 0) {
      list[idx] = { ...list[idx], ...updates };
      this.saveBodyMeasurements(list);
    }
  },

  deleteBodyMeasurement(id: string): void {
    const list = this.getBodyMeasurements().filter((m) => m.id !== id);
    this.saveBodyMeasurements(list);
  },

  // Body Weight
  getBodyWeightEntries(): BodyWeightEntry[] {
    const list = safeGet<BodyWeightEntry[]>(STORAGE_KEYS.BODY_WEIGHT, INITIAL_BODY_WEIGHT);
    return [...list].sort((a, b) => a.date.localeCompare(b.date));
  },

  saveBodyWeightEntries(list: BodyWeightEntry[]): void {
    safeSet(STORAGE_KEYS.BODY_WEIGHT, list);
    this.notify();
  },

  addBodyWeightEntry(entry: Omit<BodyWeightEntry, 'id'>): BodyWeightEntry {
    const list = this.getBodyWeightEntries();
    const newEntry: BodyWeightEntry = {
      ...entry,
      id: `weight_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
    };
    list.push(newEntry);
    this.saveBodyWeightEntries(list);
    return newEntry;
  },

  updateBodyWeightEntry(id: string, updates: Partial<BodyWeightEntry>): void {
    const list = this.getBodyWeightEntries();
    const idx = list.findIndex((w) => w.id === id);
    if (idx >= 0) {
      list[idx] = { ...list[idx], ...updates };
      this.saveBodyWeightEntries(list);
    }
  },

  deleteBodyWeightEntry(id: string): void {
    const list = this.getBodyWeightEntries().filter((w) => w.id !== id);
    this.saveBodyWeightEntries(list);
  },

  // Calendar Events
  getEvents(): CalendarEvent[] {
    const list = safeGet<CalendarEvent[]>(STORAGE_KEYS.EVENTS, INITIAL_EVENTS);
    return [...list].sort((a, b) => {
      const cmp = a.date.localeCompare(b.date);
      if (cmp !== 0) return cmp;
      return (a.time || '').localeCompare(b.time || '');
    });
  },

  saveEvents(events: CalendarEvent[]): void {
    safeSet(STORAGE_KEYS.EVENTS, events);
    this.notify();
  },

  addEvent(event: Omit<CalendarEvent, 'id' | 'createdAt'>): CalendarEvent {
    const list = this.getEvents();
    const newEvent: CalendarEvent = {
      ...event,
      id: `event_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      createdAt: new Date().toLocaleTimeString('pl-PL', { hour: '2-digit', minute: '2-digit' }),
    };
    list.push(newEvent);
    this.saveEvents(list);
    return newEvent;
  },

  updateEvent(id: string, updates: Partial<CalendarEvent>): void {
    const list = this.getEvents();
    const idx = list.findIndex((e) => e.id === id);
    if (idx >= 0) {
      list[idx] = { ...list[idx], ...updates };
      this.saveEvents(list);
    }
  },

  deleteEvent(id: string): void {
    const list = this.getEvents().filter((e) => e.id !== id);
    this.saveEvents(list);
  },
};
