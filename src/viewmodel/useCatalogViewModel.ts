import { useState, useEffect, useCallback, useMemo } from 'react';
import { ExerciseDefinition, ExerciseCategory, TrainingCycleData } from '../domain/types';
import { LocalStorageRepo } from '../data/localStorageRepo';
import { INITIAL_EXERCISES } from '../data/sampleData';

export const CATALOG_CATEGORIES = [
  { id: 'all', label: 'Wszystkie' },
  { id: 'Klata', domainCategory: 'Klatka piersiowa' as ExerciseCategory, label: 'Klata' },
  { id: 'Biceps', domainCategory: 'Biceps' as ExerciseCategory, label: 'Biceps' },
  { id: 'Triceps', domainCategory: 'Triceps' as ExerciseCategory, label: 'Triceps' },
  { id: 'Barki', domainCategory: 'Barki' as ExerciseCategory, label: 'Barki' },
  { id: 'Plecy', domainCategory: 'Plecy' as ExerciseCategory, label: 'Plecy' },
  { id: 'Nogi', domainCategory: 'Nogi' as ExerciseCategory, label: 'Nogi' },
];

export function useCatalogViewModel() {
  const [exercises, setExercises] = useState<ExerciseDefinition[]>(() => LocalStorageRepo.getExercises());
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Modals state
  const [isAddCustomOpen, setIsAddCustomOpen] = useState<boolean>(false);
  const [editingExercise, setEditingExercise] = useState<ExerciseDefinition | null>(null);
  const [addToPlanExercise, setAddToPlanExercise] = useState<ExerciseDefinition | null>(null);

  // Add to plan selection state
  const [cycleData, setCycleData] = useState<TrainingCycleData>(() => LocalStorageRepo.getCycleData());
  const [targetWeekId, setTargetWeekId] = useState<string>('');
  const [targetDayId, setTargetDayId] = useState<string>('');
  const [targetSetsCount, setTargetSetsCount] = useState<number>(3);

  // Toast confirmation
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const refreshData = useCallback(() => {
    setExercises([...LocalStorageRepo.getExercises()]);
    const currentCycle = LocalStorageRepo.getCycleData();
    setCycleData({ ...currentCycle });

    // Set default target week and day if not already set
    if (currentCycle.weeks.length > 0) {
      const firstWeek = currentCycle.weeks.find((w) => w.id === 'week_2') || currentCycle.weeks[0];
      setTargetWeekId((prev) => (prev ? prev : firstWeek.id));
      if (firstWeek.days.length > 0) {
        setTargetDayId((prev) => (prev ? prev : firstWeek.days[0].id));
      }
    }
  }, []);

  useEffect(() => {
    refreshData();
    const unsub = LocalStorageRepo.subscribe(() => {
      refreshData();
    });
    return () => unsub();
  }, [refreshData]);

  // Keep targetDayId valid when targetWeekId changes
  useEffect(() => {
    if (!targetWeekId) return;
    const week = cycleData.weeks.find((w) => w.id === targetWeekId);
    if (week && week.days.length > 0) {
      if (!week.days.some((d) => d.id === targetDayId)) {
        setTargetDayId(week.days[0].id);
      }
    } else {
      setTargetDayId('');
    }
  }, [targetWeekId, cycleData.weeks, targetDayId]);

  // Filtered exercises
  const filteredExercises = useMemo(() => {
    return exercises.filter((ex) => {
      // Category filter
      let matchCat = true;
      if (selectedCategory !== 'all') {
        const catConfig = CATALOG_CATEGORIES.find((c) => c.id === selectedCategory);
        if (catConfig && catConfig.domainCategory) {
          matchCat = ex.category === catConfig.domainCategory;
        } else {
          matchCat = ex.category === selectedCategory;
        }
      }

      // Search query
      const matchSearch =
        ex.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (ex.equipment && ex.equipment.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (ex.technique && ex.technique.toLowerCase().includes(searchQuery.toLowerCase()));

      return matchCat && matchSearch;
    });
  }, [exercises, selectedCategory, searchQuery]);

  // Counts per category
  const categoryCounts = useMemo(() => {
    const counts: Record<string, number> = { all: exercises.length };
    CATALOG_CATEGORIES.forEach((cat) => {
      if (cat.id === 'all') return;
      const count = exercises.filter((ex) => ex.category === cat.domainCategory).length;
      counts[cat.id] = count;
    });
    return counts;
  }, [exercises]);

  const showToast = (message: string) => {
    setToastMessage(message);
    setTimeout(() => {
      setToastMessage(null);
    }, 3200);
  };

  // Add or update exercise (supports ANY exercise in catalog)
  const handleSaveCustomExercise = (data: {
    name: string;
    category: ExerciseCategory;
    equipment: string;
    technique: string;
    defaultSets: number;
    defaultReps: string;
    defaultRpe: string;
    notes?: string;
  }) => {
    if (editingExercise) {
      LocalStorageRepo.updateExercise(editingExercise.id, {
        name: data.name.trim(),
        category: data.category,
        equipment: data.equipment.trim(),
        technique: data.technique.trim(),
        defaultSets: data.defaultSets,
        defaultReps: data.defaultReps,
        defaultRpe: data.defaultRpe,
        notes: data.notes?.trim() || undefined,
      });
      setEditingExercise(null);
      showToast(`Zaktualizowano ćwiczenie: ${data.name}`);
    } else {
      const created = LocalStorageRepo.addExercise({
        name: data.name.trim(),
        category: data.category,
        equipment: data.equipment.trim(),
        technique: data.technique.trim(),
        defaultSets: data.defaultSets,
        defaultReps: data.defaultReps,
        defaultRpe: data.defaultRpe,
        notes: data.notes?.trim() || undefined,
        isCustom: true,
      });
      setIsAddCustomOpen(false);
      showToast(`Dodano nowe ćwiczenie: ${created.name}`);
    }
  };

  // Quick inline update for any exercise (e.g. default sets, reps, notes)
  const handleQuickUpdateExercise = (id: string, updates: Partial<ExerciseDefinition>) => {
    LocalStorageRepo.updateExercise(id, updates);
    showToast('Zaktualizowano parametry ćwiczenia');
  };

  // Reset exercise to original default template
  const handleResetExerciseToDefault = (id: string) => {
    const original = INITIAL_EXERCISES.find((e) => e.id === id);
    if (original) {
      LocalStorageRepo.updateExercise(id, {
        name: original.name,
        category: original.category,
        equipment: original.equipment,
        technique: original.technique,
        defaultSets: original.defaultSets,
        defaultReps: original.defaultReps,
        defaultRpe: original.defaultRpe,
        notes: original.notes,
        isCustom: false,
      });
      showToast(`Przywrócono domyślne parametry: ${original.name}`);
    }
  };

  // Delete exercise
  const handleDeleteExercise = (id: string, name: string) => {
    LocalStorageRepo.deleteExercise(id);
    showToast(`Usunięto ćwiczenie: ${name}`);
  };

  // Open "Add to plan" modal
  const handleOpenAddToPlan = (exercise: ExerciseDefinition) => {
    setAddToPlanExercise(exercise);
    setTargetSetsCount(exercise.defaultSets || 3);
  };

  // Confirm "Add to plan"
  const handleConfirmAddToPlan = () => {
    if (!addToPlanExercise || !targetWeekId || !targetDayId) return;

    const targetWeek = cycleData.weeks.find((w) => w.id === targetWeekId);
    const targetDay = targetWeek?.days.find((d) => d.id === targetDayId);

    if (!targetWeek || !targetDay) return;

    LocalStorageRepo.addExerciseToDay(targetWeek.id, targetDay.id, addToPlanExercise, targetSetsCount);

    showToast(`Dodano „${addToPlanExercise.name}” do: ${targetWeek.name} / ${targetDay.dayName} (${targetDay.planName})`);
    setAddToPlanExercise(null);
  };

  return {
    exercises,
    filteredExercises,
    selectedCategory,
    setSelectedCategory,
    categoryCounts,
    searchQuery,
    setSearchQuery,
    isAddCustomOpen,
    setIsAddCustomOpen,
    editingExercise,
    setEditingExercise,
    addToPlanExercise,
    setAddToPlanExercise,
    cycleData,
    targetWeekId,
    setTargetWeekId,
    targetDayId,
    setTargetDayId,
    targetSetsCount,
    setTargetSetsCount,
    toastMessage,
    handleSaveCustomExercise,
    handleQuickUpdateExercise,
    handleResetExerciseToDefault,
    handleDeleteExercise,
    handleOpenAddToPlan,
    handleConfirmAddToPlan,
  };
}
