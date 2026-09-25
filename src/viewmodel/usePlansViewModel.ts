import { useState, useEffect, useCallback, useMemo } from 'react';
import {
  TrainingCycleData,
  TrainingWeek,
  PlanTrainingDay,
  PlanExerciseItem,
  PlanSet,
  DayStatus,
  ExerciseDefinition,
  EXERCISE_CATEGORIES,
} from '../domain/types';
import { LocalStorageRepo } from '../data/localStorageRepo';

export function usePlansViewModel() {
  const [cycleData, setCycleData] = useState<TrainingCycleData>(() => LocalStorageRepo.getCycleData());
  const [selectedWeekId, setSelectedWeekId] = useState<string>('week_2');
  const [selectedDayId, setSelectedDayId] = useState<string | null>(null);

  // Modal states
  const [isAddDayModalOpen, setIsAddDayModalOpen] = useState<boolean>(false);
  const [isAddExerciseModalOpen, setIsAddExerciseModalOpen] = useState<boolean>(false);
  const [isEditDayModalOpen, setIsEditDayModalOpen] = useState<boolean>(false);

  // Add Day Form
  const [newDayOfWeek, setNewDayOfWeek] = useState<number>(1);
  const [newDayPlanName, setNewDayPlanName] = useState<string>('Push');

  // Exercise Library search & filter
  const [exerciseSearch, setExerciseSearch] = useState<string>('');
  const [exerciseCategoryFilter, setExerciseCategoryFilter] = useState<string>('all');

  const refreshData = useCallback(() => {
    const data = LocalStorageRepo.getCycleData();
    setCycleData({ ...data });

    // Fallback if selected week doesn't exist
    if (!data.weeks.some((w) => w.id === selectedWeekId) && data.weeks.length > 0) {
      setSelectedWeekId(data.weeks[0].id);
    }
  }, [selectedWeekId]);

  useEffect(() => {
    refreshData();
    const unsub = LocalStorageRepo.subscribe(() => {
      refreshData();
    });
    return () => unsub();
  }, [refreshData]);

  // Current selected week
  const selectedWeek = useMemo(() => {
    return cycleData.weeks.find((w) => w.id === selectedWeekId) || cycleData.weeks[0] || null;
  }, [cycleData, selectedWeekId]);

  // Current selected day
  const selectedDay = useMemo(() => {
    if (!selectedWeek || !selectedDayId) return null;
    return selectedWeek.days.find((d) => d.id === selectedDayId) || null;
  }, [selectedWeek, selectedDayId]);

  // Available days of week not yet added to current week
  const availableDaysOfWeek = useMemo(() => {
    if (!selectedWeek) return [];
    const usedDows = new Set(selectedWeek.days.map((d) => d.dayOfWeek));
    const allDays = [
      { dow: 1, name: 'Poniedziałek', defaultName: 'Push' },
      { dow: 2, name: 'Wtorek', defaultName: 'Pull' },
      { dow: 3, name: 'Środa', defaultName: 'Legs' },
      { dow: 4, name: 'Czwartek', defaultName: 'Góra' },
      { dow: 5, name: 'Piątek', defaultName: 'Dół' },
      { dow: 6, name: 'Sobota', defaultName: 'Ramiona' },
      { dow: 7, name: 'Niedziela', defaultName: 'Full Body' },
    ];
    return allDays.filter((d) => !usedDows.has(d.dow));
  }, [selectedWeek]);

  // --- Actions ---

  const handleAddNewWeek = () => {
    const newWeek = LocalStorageRepo.addNewWeekToCycle();
    setSelectedWeekId(newWeek.id);
    setSelectedDayId(null);
  };

  const handleSelectWeek = (weekId: string) => {
    setSelectedWeekId(weekId);
    setSelectedDayId(null);
  };

  const handleSelectDay = (dayId: string) => {
    setSelectedDayId(dayId);
  };

  const handleBackToWeek = () => {
    setSelectedDayId(null);
  };

  const handleOpenAddDayModal = () => {
    if (availableDaysOfWeek.length > 0) {
      setNewDayOfWeek(availableDaysOfWeek[0].dow);
      setNewDayPlanName(availableDaysOfWeek[0].defaultName);
    }
    setIsAddDayModalOpen(true);
  };

  const handleConfirmAddDay = () => {
    if (!selectedWeek) return;
    const dayConfig = [
      { dow: 1, name: 'Poniedziałek' },
      { dow: 2, name: 'Wtorek' },
      { dow: 3, name: 'Środa' },
      { dow: 4, name: 'Czwartek' },
      { dow: 5, name: 'Piątek' },
      { dow: 6, name: 'Sobota' },
      { dow: 7, name: 'Niedziela' },
    ].find((d) => d.dow === newDayOfWeek);

    if (!dayConfig) return;

    const newDay = LocalStorageRepo.addDayToWeek(
      selectedWeek.id,
      newDayOfWeek,
      dayConfig.name,
      newDayPlanName
    );

    setIsAddDayModalOpen(false);
    if (newDay) {
      setSelectedDayId(newDay.id);
    }
  };

  // Day manual status
  const handleSetDayStatus = (status: DayStatus) => {
    if (!selectedWeek || !selectedDay) return;
    LocalStorageRepo.updateDayStatusInCycle(selectedWeek.id, selectedDay.id, status);
  };

  // Exercise management in day
  const handleAddExerciseToCurrentDay = (exerciseDef: ExerciseDefinition) => {
    if (!selectedWeek || !selectedDay) return;
    LocalStorageRepo.addExerciseToDay(selectedWeek.id, selectedDay.id, exerciseDef, exerciseDef.defaultSets || 3);
    setIsAddExerciseModalOpen(false);
  };

  const handleRemoveExercise = (exercisePlanId: string) => {
    if (!selectedWeek || !selectedDay) return;
    LocalStorageRepo.removeExerciseFromDay(selectedWeek.id, selectedDay.id, exercisePlanId);
  };

  const handleMoveExercise = (fromIndex: number, toIndex: number) => {
    if (!selectedWeek || !selectedDay) return;
    LocalStorageRepo.reorderExerciseInDay(selectedWeek.id, selectedDay.id, fromIndex, toIndex);
  };

  // Set management
  const handleAddSet = (exercisePlanId: string) => {
    if (!selectedWeek || !selectedDay) return;
    LocalStorageRepo.addSetToExercise(selectedWeek.id, selectedDay.id, exercisePlanId);
  };

  const handleRemoveSet = (exercisePlanId: string, setId: string) => {
    if (!selectedWeek || !selectedDay) return;
    LocalStorageRepo.removeSetFromExercise(selectedWeek.id, selectedDay.id, exercisePlanId, setId);
  };

  const handleUpdateSet = (
    exercisePlanId: string,
    setId: string,
    updates: Partial<PlanSet>
  ) => {
    if (!selectedWeek || !selectedDay) return;
    LocalStorageRepo.updateSetInExercise(selectedWeek.id, selectedDay.id, exercisePlanId, setId, updates);
  };

  const handleUpdateDayNotes = (notes: string) => {
    if (!selectedWeek || !selectedDay) return;
    LocalStorageRepo.updateDayNotes(selectedWeek.id, selectedDay.id, notes);
  };

  const handleUpdateExerciseNotes = (exercisePlanId: string, notes: string) => {
    if (!selectedWeek || !selectedDay) return;
    LocalStorageRepo.updateExerciseNotes(selectedWeek.id, selectedDay.id, exercisePlanId, notes);
  };

  // Library of all exercises
  const allLibraryExercises = useMemo(() => {
    return LocalStorageRepo.getExercises();
  }, []);

  const filteredLibraryExercises = useMemo(() => {
    return allLibraryExercises.filter((ex) => {
      const matchSearch = ex.name.toLowerCase().includes(exerciseSearch.toLowerCase());
      const matchCat = exerciseCategoryFilter === 'all' || ex.category === exerciseCategoryFilter;
      return matchSearch && matchCat;
    });
  }, [allLibraryExercises, exerciseSearch, exerciseCategoryFilter]);

  return {
    cycleData,
    selectedWeek,
    selectedWeekId,
    selectedDay,
    selectedDayId,
    availableDaysOfWeek,
    isAddDayModalOpen,
    setIsAddDayModalOpen,
    newDayOfWeek,
    setNewDayOfWeek,
    newDayPlanName,
    setNewDayPlanName,
    isAddExerciseModalOpen,
    setIsAddExerciseModalOpen,
    exerciseSearch,
    setExerciseSearch,
    exerciseCategoryFilter,
    setExerciseCategoryFilter,
    filteredLibraryExercises,
    handleAddNewWeek,
    handleSelectWeek,
    handleSelectDay,
    handleBackToWeek,
    handleOpenAddDayModal,
    handleConfirmAddDay,
    handleSetDayStatus,
    handleAddExerciseToCurrentDay,
    handleRemoveExercise,
    handleMoveExercise,
    handleAddSet,
    handleRemoveSet,
    handleUpdateSet,
    handleUpdateDayNotes,
    handleUpdateExerciseNotes,
  };
}
