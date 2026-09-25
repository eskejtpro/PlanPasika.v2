import { useState, useEffect, useCallback } from 'react';
import { PlanDay, CalendarNote, SubstanceEntry } from '../domain/types';
import { LocalStorageRepo } from '../data/localStorageRepo';

export interface WeekDayItem {
  date: string; // YYYY-MM-DD
  dayOfWeek: number; // 1 (Mon) - 7 (Sun)
  dayShort: string; // Pn, Wt, Śr...
  dayFull: string; // Poniedziałek, Wtorek...
  dayNumber: number; // 21, 22, 23...
  isToday: boolean;
  plan: PlanDay;
}

export interface UpcomingEventItem {
  id: string;
  dateLabel: string;
  title: string;
  type: 'workout' | 'substance' | 'note' | 'rest';
  subtitle?: string;
}

export interface QuickStats {
  completedSets: number;
  completedWorkouts: number;
  totalTimeMinutes: number;
}

export function useTodayViewModel() {
  const [weekRangeFormatted, setWeekRangeFormatted] = useState<string>('');
  const [weekDays, setWeekDays] = useState<WeekDayItem[]>([]);
  const [todayPlan, setTodayPlan] = useState<PlanDay | null>(null);
  const [upcomingEvents, setUpcomingEvents] = useState<UpcomingEventItem[]>([]);
  const [activeSessionRunning, setActiveSessionRunning] = useState<boolean>(false);
  const [selectedDayPreview, setSelectedDayPreview] = useState<WeekDayItem | null>(null);
  const [quickStats, setQuickStats] = useState<QuickStats>({
    completedSets: 36,
    completedWorkouts: 3,
    totalTimeMinutes: 195,
  });

  const refreshData = useCallback(() => {
    const now = new Date();
    const todayStr = now.toISOString().split('T')[0];

    // Compute Monday of current week
    const currentDay = now.getDay();
    const diffToMonday = now.getDate() - currentDay + (currentDay === 0 ? -6 : 1);
    const monday = new Date(now);
    monday.setDate(diffToMonday);

    const sunday = new Date(monday);
    sunday.setDate(monday.getDate() + 6);

    // Format week range e.g. "21–27 września 2026"
    const startDay = monday.getDate();
    const endDay = sunday.getDate();
    const monthName = sunday.toLocaleDateString('pl-PL', { month: 'long' });
    const year = sunday.getFullYear();
    setWeekRangeFormatted(`${startDay}–${endDay} ${monthName} ${year}`);

    // Load plans from local storage
    const allPlans = LocalStorageRepo.getPlans();
    const dayNamesShort = ['Pn', 'Wt', 'Śr', 'Cz', 'Pt', 'So', 'Nd'];
    const dayNamesFull = [
      'Poniedziałek',
      'Wtorek',
      'Środa',
      'Czwartek',
      'Piątek',
      'Sobota',
      'Niedziela',
    ];

    const computedWeekDays: WeekDayItem[] = [];

    for (let i = 0; i < 7; i++) {
      const d = new Date(monday);
      d.setDate(monday.getDate() + i);
      const dateStr = d.toISOString().split('T')[0];
      const isToday = dateStr === todayStr;

      let plan = allPlans.find((p) => p.date === dateStr);
      if (!plan) {
        // default day
        plan = {
          date: dateStr,
          dayOfWeek: i + 1,
          dayType: 'EMPTY',
          manualStatus: 'UNRESOLVED',
          hasRecordedSession: false,
        };
      }

      const item: WeekDayItem = {
        date: dateStr,
        dayOfWeek: i + 1,
        dayShort: dayNamesShort[i],
        dayFull: dayNamesFull[i],
        dayNumber: d.getDate(),
        isToday,
        plan,
      };

      computedWeekDays.push(item);

      if (isToday) {
        setTodayPlan(plan);
      }
    }

    setWeekDays(computedWeekDays);

    // Compute dynamic stats for current week
    const completedWorkoutsThisWeek = computedWeekDays.filter(
      (w) => w.plan.dayType === 'WORKOUT' && w.plan.manualStatus === 'COMPLETED'
    ).length;

    let completedSetsCount = 0;
    computedWeekDays.forEach((w) => {
      if (w.plan.dayType === 'WORKOUT' && w.plan.manualStatus === 'COMPLETED') {
        const count = w.plan.exercises?.reduce((sum, e) => sum + (e.defaultSets || 3), 0) || 12;
        completedSetsCount += count;
      }
    });

    setQuickStats({
      completedSets: completedSetsCount,
      completedWorkouts: completedWorkoutsThisWeek,
      totalTimeMinutes: completedWorkoutsThisWeek * 60,
    });

    // Active session status
    const active = LocalStorageRepo.getActiveWorkout();
    setActiveSessionRunning(!!active);

    // Upcoming events: max 2-3 items from calendar (next days' workouts, substances, notes)
    const upcomingList: UpcomingEventItem[] = [];
    const substances = LocalStorageRepo.getSubstances();
    const notes = LocalStorageRepo.getNotes();

    // Check next 3 days starting from tomorrow
    for (let offset = 1; offset <= 3; offset++) {
      const futureD = new Date(now);
      futureD.setDate(now.getDate() + offset);
      const futureDateStr = futureD.toISOString().split('T')[0];
      const label = futureD.toLocaleDateString('pl-PL', { weekday: 'short', day: 'numeric', month: 'short' });

      // Check workout
      const p = allPlans.find((item) => item.date === futureDateStr);
      if (p && p.dayType === 'WORKOUT') {
        upcomingList.push({
          id: `evt_w_${futureDateStr}`,
          dateLabel: label,
          title: p.workoutName || 'Trening zaplanowany',
          type: 'workout',
          subtitle: p.manualStatus === 'COMPLETED' ? 'Wykonany' : 'Zaplanowany',
        });
      } else if (p && p.dayType === 'REST') {
        upcomingList.push({
          id: `evt_r_${futureDateStr}`,
          dateLabel: label,
          title: 'Dzień wolny (Regeneracja)',
          type: 'rest',
        });
      }

      // Check substances
      const daySubs = substances.filter((s) => s.date === futureDateStr);
      daySubs.forEach((sub) => {
        upcomingList.push({
          id: `evt_s_${sub.id}`,
          dateLabel: `${label}, ${sub.time}`,
          title: sub.name,
          type: 'substance',
          subtitle: sub.details || 'Substancja',
        });
      });

      // Check notes
      const dayNotes = notes.filter((n) => n.date === futureDateStr);
      dayNotes.forEach((note) => {
        upcomingList.push({
          id: `evt_n_${note.id}`,
          dateLabel: label,
          title: 'Notatka',
          type: 'note',
          subtitle: note.content.slice(0, 35) + (note.content.length > 35 ? '...' : ''),
        });
      });

      if (upcomingList.length >= 3) break;
    }

    // If still empty or < 2, add latest note or today's substances
    if (upcomingList.length < 2 && notes.length > 0) {
      const n = notes[0];
      upcomingList.push({
        id: `evt_latest_note_${n.id}`,
        dateLabel: n.date,
        title: 'Ostatnia notatka',
        type: 'note',
        subtitle: n.content.slice(0, 45) + (n.content.length > 45 ? '...' : ''),
      });
    }

    setUpcomingEvents(upcomingList.slice(0, 3));
  }, []);

  const updateDayPlan = useCallback((date: string, updates: Partial<PlanDay>) => {
    LocalStorageRepo.updatePlanDay(date, updates);
  }, []);

  useEffect(() => {
    refreshData();
    const unsubscribe = LocalStorageRepo.subscribe(() => {
      refreshData();
    });
    return () => unsubscribe();
  }, [refreshData]);

  return {
    weekRangeFormatted,
    weekDays,
    todayPlan,
    upcomingEvents,
    activeSessionRunning,
    selectedDayPreview,
    setSelectedDayPreview,
    quickStats,
    refreshData,
    updateDayPlan,
  };
}
