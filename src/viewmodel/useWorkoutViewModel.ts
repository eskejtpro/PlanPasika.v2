import { useState, useEffect, useRef } from 'react';
import { ActiveWorkoutSession, ActiveWorkoutExercise, WorkoutSet, ExerciseDefinition, ExerciseCategory } from '../domain/types';
import { LocalStorageRepo } from '../data/localStorageRepo';
import { INITIAL_ACTIVE_WORKOUT } from '../data/sampleData';

export function useWorkoutViewModel() {
  const [activeSession, setActiveSession] = useState<ActiveWorkoutSession | null>(null);
  const [isExerciseLibraryOpen, setIsExerciseLibraryOpen] = useState<boolean>(false);
  const [replacingExerciseId, setReplacingExerciseId] = useState<string | null>(null);
  const [finishSuccessModal, setFinishSuccessModal] = useState<boolean>(false);

  // Timer ref
  const timerRef = useRef<number | null>(null);

  // Load session from storage on mount
  useEffect(() => {
    const saved = LocalStorageRepo.getActiveWorkout();
    if (saved) {
      setActiveSession(saved);
    }
  }, []);

  // Save session whenever it changes
  useEffect(() => {
    if (activeSession) {
      LocalStorageRepo.saveActiveWorkout(activeSession);
    }
  }, [activeSession]);

  // Elapsed time ticker
  useEffect(() => {
    if (activeSession && !activeSession.isPaused) {
      timerRef.current = window.setInterval(() => {
        setActiveSession((prev) => {
          if (!prev || prev.isPaused) return prev;
          const next = { ...prev, elapsedSeconds: prev.elapsedSeconds + 1 };
          return next;
        });
      }, 1000);
    }

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [activeSession?.isPaused, !!activeSession]);

  const startNewWorkout = (name: string = 'Trening siłowy') => {
    const newSession: ActiveWorkoutSession = {
      ...INITIAL_ACTIVE_WORKOUT,
      id: `session_${Date.now()}`,
      name,
      startTime: Date.now(),
      elapsedSeconds: 0,
      isPaused: false,
    };
    setActiveSession(newSession);
    LocalStorageRepo.saveActiveWorkout(newSession);
  };

  const togglePause = () => {
    if (!activeSession) return;
    setActiveSession({
      ...activeSession,
      isPaused: !activeSession.isPaused,
    });
  };

  // Toggle set completion
  const toggleSetCompleted = (exerciseId: string, setId: string) => {
    if (!activeSession) return;
    const updatedExercises = activeSession.exercises.map((ex) => {
      if (ex.id !== exerciseId) return ex;
      const updatedSets = ex.sets.map((s) => {
        if (s.id !== setId) return s;
        return { ...s, completed: !s.completed };
      });
      return { ...ex, sets: updatedSets };
    });
    setActiveSession({ ...activeSession, exercises: updatedExercises });
  };

  // Update weight or reps
  const updateSetValues = (exerciseId: string, setId: string, weightKg: number, reps: number) => {
    if (!activeSession) return;
    const updatedExercises = activeSession.exercises.map((ex) => {
      if (ex.id !== exerciseId) return ex;
      const updatedSets = ex.sets.map((s) => {
        if (s.id !== setId) return s;
        return { ...s, weightKg, reps };
      });
      return { ...ex, sets: updatedSets };
    });
    setActiveSession({ ...activeSession, exercises: updatedExercises });
  };

  // Add new set to exercise
  const addSetToExercise = (exerciseId: string) => {
    if (!activeSession) return;
    const updatedExercises = activeSession.exercises.map((ex) => {
      if (ex.id !== exerciseId) return ex;
      const lastSet = ex.sets[ex.sets.length - 1];
      const newSet: WorkoutSet = {
        id: `set_${Date.now()}_${Math.random().toString(36).substring(2, 5)}`,
        setNumber: ex.sets.length + 1,
        weightKg: lastSet ? lastSet.weightKg : 50,
        reps: lastSet ? lastSet.reps : 10,
        completed: false,
        previousWeightKg: lastSet?.weightKg,
        previousReps: lastSet?.reps,
      };
      return { ...ex, sets: [...ex.sets, newSet] };
    });
    setActiveSession({ ...activeSession, exercises: updatedExercises });
  };

  // Skip / Unskip exercise
  const toggleSkipExercise = (exerciseId: string) => {
    if (!activeSession) return;
    const updatedExercises = activeSession.exercises.map((ex) => {
      if (ex.id !== exerciseId) return ex;
      return { ...ex, skipped: !ex.skipped };
    });
    setActiveSession({ ...activeSession, exercises: updatedExercises });
  };

  // Add exercise from library
  const addExerciseToSession = (exerciseDef: ExerciseDefinition) => {
    if (!activeSession) return;
    const newActiveEx: ActiveWorkoutExercise = {
      id: `act_ex_${Date.now()}`,
      exerciseId: exerciseDef.id,
      name: exerciseDef.name,
      category: exerciseDef.category,
      skipped: false,
      sets: [
        { id: `s_${Date.now()}_1`, setNumber: 1, weightKg: 40, reps: 10, completed: false },
        { id: `s_${Date.now()}_2`, setNumber: 2, weightKg: 40, reps: 10, completed: false },
        { id: `s_${Date.now()}_3`, setNumber: 3, weightKg: 40, reps: 10, completed: false },
      ],
    };
    setActiveSession({
      ...activeSession,
      exercises: [...activeSession.exercises, newActiveEx],
    });
    setIsExerciseLibraryOpen(false);
  };

  // Replace exercise
  const replaceExerciseInSession = (replacementDef: ExerciseDefinition) => {
    if (!activeSession || !replacingExerciseId) return;
    const updatedExercises = activeSession.exercises.map((ex) => {
      if (ex.id !== replacingExerciseId) return ex;
      return {
        ...ex,
        exerciseId: replacementDef.id,
        name: replacementDef.name,
        category: replacementDef.category,
        replacedFromExerciseId: ex.exerciseId,
      };
    });
    setActiveSession({ ...activeSession, exercises: updatedExercises });
    setReplacingExerciseId(null);
    setIsExerciseLibraryOpen(false);
  };

  // Finish workout session
  const finishWorkout = () => {
    if (!activeSession) return;
    // Do NOT automatically change manualStatus: status is strictly set manually by user
    const todayStr = new Date().toISOString().split('T')[0];
    LocalStorageRepo.updatePlanDay(todayStr, {
      hasRecordedSession: true,
      workoutName: activeSession.name,
    });
    LocalStorageRepo.saveActiveWorkout(null);
    setActiveSession(null);
    setFinishSuccessModal(true);
  };

  // Format time mm:ss or hh:mm:ss
  const formatTimer = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    const hrs = Math.floor(mins / 60);
    if (hrs > 0) {
      return `${hrs}:${(mins % 60).toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const updateSessionNotes = (notes: string) => {
    if (!activeSession) return;
    const updated = { ...activeSession, notes };
    setActiveSession(updated);
    LocalStorageRepo.saveActiveWorkout(updated);
  };

  const updateExerciseNotes = (exerciseId: string, notes: string) => {
    if (!activeSession) return;
    const updatedExercises = activeSession.exercises.map((ex) => {
      if (ex.id !== exerciseId) return ex;
      return { ...ex, notes };
    });
    const updated = { ...activeSession, exercises: updatedExercises };
    setActiveSession(updated);
    LocalStorageRepo.saveActiveWorkout(updated);
  };

  return {
    activeSession,
    startNewWorkout,
    togglePause,
    toggleSetCompleted,
    updateSetValues,
    addSetToExercise,
    toggleSkipExercise,
    addExerciseToSession,
    replaceExerciseInSession,
    finishWorkout,
    formatTimer,
    isExerciseLibraryOpen,
    setIsExerciseLibraryOpen,
    replacingExerciseId,
    setReplacingExerciseId,
    finishSuccessModal,
    setFinishSuccessModal,
    updateSessionNotes,
    updateExerciseNotes,
  };
}
