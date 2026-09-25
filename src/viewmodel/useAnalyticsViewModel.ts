import { useState, useEffect } from 'react';
import { AnalyticsSummary, ExerciseCategory, TrainingCycle } from '../domain/types';
import { LocalStorageRepo } from '../data/localStorageRepo';

export function useAnalyticsViewModel() {
  const [selectedFilter, setSelectedFilter] = useState<'month' | 'plan' | 'cycle'>('month');
  const [selectedCycleId, setSelectedCycleId] = useState<string>('cycle_2');
  const [cycles, setCycles] = useState<TrainingCycle[]>([]);
  const [summary, setSummary] = useState<AnalyticsSummary>({
    totalSets: 110,
    totalWorkouts: 16,
    totalDurationMinutes: 1040,
    categorySets: {
      'Klatka piersiowa': 18,
      'Plecy': 22,
      'Barki': 14,
      'Nogi': 26,
      'Biceps': 10,
      'Triceps': 12,
      'Pozostałe': 8,
    },
  });

  const loadAnalytics = () => {
    const loadedCycles = LocalStorageRepo.getCycles();
    setCycles(loadedCycles);

    const calculated = LocalStorageRepo.getAnalytics(
      selectedFilter === 'cycle' ? selectedCycleId : undefined,
      selectedFilter === 'month' ? '2026-09' : undefined
    );
    setSummary(calculated);
  };

  useEffect(() => {
    loadAnalytics();
  }, [selectedFilter, selectedCycleId]);

  const CATEGORY_COLORS: Record<ExerciseCategory, string> = {
    'Klatka piersiowa': '#22C55E', // Green / Emerald
    'Plecy': '#3B82F6', // Blue
    'Barki': '#EAB308', // Amber
    'Nogi': '#EC4899', // Pink
    'Biceps': '#8B5CF6', // Purple
    'Triceps': '#06B6D4', // Cyan
    'Pozostałe': '#64748B', // Slate
  };

  return {
    selectedFilter,
    setSelectedFilter,
    selectedCycleId,
    setSelectedCycleId,
    cycles,
    summary,
    CATEGORY_COLORS,
    loadAnalytics,
  };
}
