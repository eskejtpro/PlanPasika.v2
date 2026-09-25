import React, { useState } from 'react';
import {
  Play,
  Pause,
  CheckCircle2,
  Plus,
  MoreVertical,
  RotateCcw,
  Check,
  Clock,
  Sparkles,
  AlertCircle,
  EyeOff,
  RefreshCw,
  Dumbbell,
  ArrowRight,
  ChevronRight,
  Flame,
  Zap,
  FileText,
  Edit3,
  Save,
} from 'lucide-react';
import { useWorkoutViewModel } from '../../viewmodel/useWorkoutViewModel';
import { ExerciseLibraryModal } from './ExerciseLibraryModal';
import { ExerciseDefinition } from '../../domain/types';

interface WorkoutScreenProps {
  onWorkoutFinished?: () => void;
}

export const WorkoutScreen: React.FC<WorkoutScreenProps> = ({ onWorkoutFinished }) => {
  const {
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
  } = useWorkoutViewModel();

  const [activeMenuExerciseId, setActiveMenuExerciseId] = useState<string | null>(null);

  // Notes state
  const [isEditingNotes, setIsEditingNotes] = useState<boolean>(false);
  const [sessionNotesInput, setSessionNotesInput] = useState<string>('');
  const [editingExNoteId, setEditingExNoteId] = useState<string | null>(null);
  const [exNoteInput, setExNoteInput] = useState<string>('');

  if (!activeSession) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center p-6 text-center select-none">
        <div className="w-20 h-20 rounded-3xl bg-gradient-to-br from-[#142334] to-[#0D1522] border border-[#00F59B]/40 flex items-center justify-center text-[#00F59B] mb-5 shadow-[0_0_25px_rgba(0,245,155,0.2)]">
          <Dumbbell className="w-10 h-10" />
        </div>
        <span className="text-[11px] font-extrabold uppercase tracking-wider text-[#00F59B] mb-1">
          PlanPasika.v2 Live
        </span>
        <h2 className="text-2xl font-extrabold text-white mb-2 tracking-tight">
          Brak aktywnego treningu
        </h2>
        <p className="text-xs text-slate-400 max-w-xs mb-6 leading-relaxed">
          Wszystkie serie, obciążenia i czasy przerw zapisują się na bieżąco w trybie offline na Twoim Xiaomi 14T.
        </p>
        <button
          type="button"
          onClick={() => startNewWorkout('Barki + Ramiona (Hipertrofia)')}
          className="flex items-center gap-2.5 bg-gradient-to-r from-[#00F59B] to-[#06D6A0] text-[#06090E] font-extrabold py-4 px-7 rounded-2xl shadow-xl neon-glow-btn transition-all active:scale-95"
        >
          <Play className="w-5 h-5 fill-current" />
          <span className="text-sm">Rozpocznij nowy trening</span>
        </button>
      </div>
    );
  }

  // Calculate total completed sets in this session
  const totalCompletedSets = activeSession.exercises.reduce(
    (acc, ex) => acc + (ex.skipped ? 0 : ex.sets.filter((s) => s.completed).length),
    0
  );
  const totalSetsCount = activeSession.exercises.reduce(
    (acc, ex) => acc + (ex.skipped ? 0 : ex.sets.length),
    0
  );

  return (
    <div className="flex-1 overflow-y-auto px-4 py-3.5 space-y-4 pb-24 select-none">
      {/* 1. STICKY TOP BAR: Nazwa sesji, Sportowy Timer & Przyciski sterowania */}
      <div className="sticky top-0 z-30 glass-card p-3.5 rounded-3xl border border-white/10 shadow-2xl flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#00F59B] animate-pulse" />
            <span className="text-[10px] font-extrabold uppercase tracking-wider text-[#00F59B]">
              SESJA NA ŻYWO
            </span>
          </div>
          <h1 className="text-sm font-extrabold text-white truncate max-w-[170px]">
            {activeSession.name}
          </h1>
        </div>

        <div className="flex items-center gap-2">
          {/* Big Sporty Timer */}
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#070A0F] border border-[#00F59B]/30 text-[#00F59B] font-mono text-xs font-bold shadow-[0_0_10px_rgba(0,245,155,0.15)]">
            <Clock className="w-3.5 h-3.5 text-slate-400" />
            <span>{formatTimer(activeSession.elapsedSeconds)}</span>
          </div>

          {/* Pause / Resume */}
          <button
            type="button"
            onClick={togglePause}
            className="p-2 rounded-xl bg-slate-800/90 text-slate-200 hover:text-white transition-colors"
            title={activeSession.isPaused ? 'Wznów' : 'Pauza'}
          >
            {activeSession.isPaused ? <Play className="w-4 h-4 text-[#00F59B]" /> : <Pause className="w-4 h-4" />}
          </button>

          {/* Finish Button */}
          <button
            type="button"
            onClick={finishWorkout}
            className="px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-[#00F59B] to-[#06D6A0] text-[#06090E] font-extrabold text-xs shadow-md neon-glow-btn transition-all active:scale-95"
          >
            Zakończ
          </button>
        </div>
      </div>

      {/* 2. PROGRESS BANNER: Wykonane serie */}
      <div className="glass-card-subtle px-4 py-2.5 rounded-2xl flex items-center justify-between border border-white/5">
        <div className="flex items-center gap-2">
          <Zap className="w-4 h-4 text-[#00F59B]" />
          <span className="text-xs font-bold text-white">Postęp sesji</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs font-mono font-bold text-[#00F59B]">
            {totalCompletedSets} / {totalSetsCount} serii
          </span>
          <div className="w-16 h-1.5 bg-[#070A0F] rounded-full overflow-hidden">
            <div
              className="h-full bg-[#00F59B] rounded-full transition-all duration-300"
              style={{
                width: `${totalSetsCount > 0 ? (totalCompletedSets / totalSetsCount) * 100 : 0}%`,
              }}
            />
          </div>
        </div>
      </div>

      {/* 3. LISTA ĆWICZEŃ W SESJI */}
      <div className="space-y-4">
        {activeSession.exercises.map((exercise, exIndex) => {
          const isSkipped = exercise.skipped;
          const nextExercise = activeSession.exercises[exIndex + 1];

          return (
            <div
              key={exercise.id}
              className={`rounded-3xl border transition-all ${
                isSkipped
                  ? 'bg-[#0A0E14]/60 border-slate-800/60 opacity-60'
                  : 'glass-card border-[#1E2E42] shadow-xl'
              }`}
            >
              {/* Exercise Card Header */}
              <div className="p-4 border-b border-slate-800/80 flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono font-bold text-[#00F59B] bg-emerald-950/80 px-2 py-0.5 rounded-md border border-[#00F59B]/30">
                      #{exIndex + 1}
                    </span>
                    <h3
                      className={`text-sm font-extrabold ${
                        isSkipped ? 'line-through text-slate-400' : 'text-white'
                      }`}
                    >
                      {exercise.name}
                    </h3>
                  </div>
                  <div className="flex items-center gap-2 mt-1 text-[11px] text-slate-400">
                    <span className="text-[#00F59B] font-semibold">{exercise.category}</span>
                    {exercise.replacedFromExerciseId && <span>· zastąpione</span>}
                    {isSkipped && <span className="text-amber-400">· pominięte</span>}
                  </div>
                </div>

                {/* Exercise Options Menu */}
                <div className="relative">
                  <button
                    type="button"
                    onClick={() =>
                      setActiveMenuExerciseId(
                        activeMenuExerciseId === exercise.id ? null : exercise.id
                      )
                    }
                    className="p-1.5 text-slate-400 hover:text-white rounded-xl hover:bg-slate-800 transition-colors"
                  >
                    <MoreVertical className="w-4 h-4" />
                  </button>

                  {/* Dropdown Menu */}
                  {activeMenuExerciseId === exercise.id && (
                    <div className="absolute right-0 top-8 z-40 w-44 glass-card border border-slate-700 rounded-2xl shadow-2xl py-1 text-xs select-none">
                      <button
                        type="button"
                        onClick={() => {
                          toggleSkipExercise(exercise.id);
                          setActiveMenuExerciseId(null);
                        }}
                        className="w-full text-left px-3 py-2 text-slate-200 hover:bg-slate-700/60 flex items-center gap-2 font-medium"
                      >
                        <EyeOff className="w-3.5 h-3.5 text-amber-400" />
                        <span>{isSkipped ? 'Przywróć ćwiczenie' : 'Pomiń ćwiczenie'}</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setReplacingExerciseId(exercise.id);
                          setIsExerciseLibraryOpen(true);
                          setActiveMenuExerciseId(null);
                        }}
                        className="w-full text-left px-3 py-2 text-slate-200 hover:bg-slate-700/60 flex items-center gap-2 border-t border-slate-700/50 font-medium"
                      >
                        <RefreshCw className="w-3.5 h-3.5 text-cyan-400" />
                        <span>Zastąp ćwiczenie</span>
                      </button>
                    </div>
                  )}
                </div>
              </div>

              {/* Sets Table */}
              {!isSkipped && (
                <div className="p-4 space-y-2.5">
                  {/* Table Column Labels */}
                  <div className="grid grid-cols-12 gap-1 text-[10px] font-extrabold text-slate-400 uppercase tracking-wider text-center">
                    <span className="col-span-2">Seria</span>
                    <span className="col-span-3">Poprzednio</span>
                    <span className="col-span-3">Ciężar (kg)</span>
                    <span className="col-span-2">Powt.</span>
                    <span className="col-span-2">Status</span>
                  </div>

                  {/* Sets Rows */}
                  {exercise.sets.map((set) => {
                    const isDone = set.completed;

                    return (
                      <div
                        key={set.id}
                        className={`grid grid-cols-12 gap-1 items-center py-2 px-1.5 rounded-2xl transition-all ${
                          isDone
                            ? 'bg-emerald-950/30 border border-[#00F59B]/30'
                            : 'bg-[#090D14] border border-slate-800/80'
                        }`}
                      >
                        {/* Set Number */}
                        <span className="col-span-2 text-xs font-mono font-bold text-center text-slate-300">
                          {set.setNumber}
                        </span>

                        {/* Previous info */}
                        <span className="col-span-3 text-[11px] font-mono text-center text-slate-400 truncate">
                          {set.previousWeightKg !== undefined
                            ? `${set.previousWeightKg}kg × ${set.previousReps}`
                            : '—'}
                        </span>

                        {/* Weight Input */}
                        <div className="col-span-3 flex justify-center">
                          <input
                            type="number"
                            step="0.5"
                            value={set.weightKg}
                            onChange={(e) =>
                              updateSetValues(
                                exercise.id,
                                set.id,
                                parseFloat(e.target.value) || 0,
                                set.reps
                              )
                            }
                            className="w-16 bg-[#0E1520] border border-slate-700 focus:border-[#00F59B] rounded-xl py-1 px-1 text-center text-xs font-mono font-bold text-white focus:outline-none"
                          />
                        </div>

                        {/* Reps Input */}
                        <div className="col-span-2 flex justify-center">
                          <input
                            type="number"
                            value={set.reps}
                            onChange={(e) =>
                              updateSetValues(
                                exercise.id,
                                set.id,
                                set.weightKg,
                                parseInt(e.target.value, 10) || 0
                              )
                            }
                            className="w-12 bg-[#0E1520] border border-slate-700 focus:border-[#00F59B] rounded-xl py-1 px-1 text-center text-xs font-mono font-bold text-white focus:outline-none"
                          />
                        </div>

                        {/* Big Tactile Set Completion Button */}
                        <div className="col-span-2 flex justify-center">
                          <button
                            type="button"
                            onClick={() => toggleSetCompleted(exercise.id, set.id)}
                            className={`w-8 h-8 rounded-xl flex items-center justify-center transition-all active:scale-90 ${
                              isDone
                                ? 'bg-gradient-to-r from-[#00F59B] to-[#06D6A0] text-[#06090E] shadow-[0_0_12px_rgba(0,245,155,0.4)]'
                                : 'bg-slate-800 text-slate-400 hover:text-white hover:bg-slate-700'
                            }`}
                            title={isDone ? 'Oznacz jako niezrobione' : 'Zatwierdź serię'}
                          >
                            <Check className="w-4 h-4 stroke-[3]" />
                          </button>
                        </div>
                      </div>
                    );
                  })}

                  {/* Add Set Button */}
                  <button
                    type="button"
                    onClick={() => addSetToExercise(exercise.id)}
                    className="w-full mt-2 py-2 flex items-center justify-center gap-1.5 text-xs font-bold text-slate-300 hover:text-white bg-slate-800/40 hover:bg-slate-800 rounded-xl transition-colors border border-slate-700/40"
                  >
                    <Plus className="w-3.5 h-3.5 text-[#00F59B]" />
                    <span>Dodaj serię</span>
                  </button>

                  {/* Karta następnego ćwiczenia */}
                  {nextExercise && (
                    <div className="mt-2 p-2.5 rounded-2xl bg-[#090D14] border border-slate-800 flex items-center justify-between text-xs">
                      <div className="flex items-center gap-2 overflow-hidden">
                        <span className="text-[10px] uppercase font-bold text-slate-500">
                          Następne:
                        </span>
                        <span className="font-bold text-slate-300 truncate">
                          {nextExercise.name}
                        </span>
                      </div>
                      <span className="text-[10px] font-semibold text-[#00F59B] shrink-0">
                        {nextExercise.category}
                      </span>
                    </div>
                  )}

                  {/* Uwagi do ćwiczenia w sesji */}
                  <div className="mt-2 pt-2 border-t border-slate-800/60 text-[11px]">
                    {editingExNoteId === exercise.id ? (
                      <div className="flex items-center gap-2">
                        <input
                          type="text"
                          value={exNoteInput}
                          onChange={(e) => setExNoteInput(e.target.value)}
                          placeholder="Notatka do ćwiczenia (np. lewy bark spięty, zapas 2 RIR)..."
                          className="flex-1 bg-[#070A0F] border border-slate-700 rounded-xl px-2.5 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-[#00F59B]"
                        />
                        <button
                          type="button"
                          onClick={() => {
                            updateExerciseNotes(exercise.id, exNoteInput);
                            setEditingExNoteId(null);
                          }}
                          className="px-2.5 py-1.5 rounded-lg bg-[#00F59B] text-[#06090E] font-extrabold text-xs"
                        >
                          Zapisz
                        </button>
                        <button
                          type="button"
                          onClick={() => setEditingExNoteId(null)}
                          className="text-slate-400 hover:text-white px-1 text-xs"
                        >
                          ✕
                        </button>
                      </div>
                    ) : (
                      <div className="flex items-center justify-between">
                        <span className="text-slate-400 italic">
                          {exercise.notes ? `Uwaga: ${exercise.notes}` : 'Brak uwag do tego ćwiczenia'}
                        </span>
                        <button
                          type="button"
                          onClick={() => {
                            setEditingExNoteId(exercise.id);
                            setExNoteInput(exercise.notes || '');
                          }}
                          className="text-[#00F59B] hover:underline flex items-center gap-1 font-bold text-[10px]"
                        >
                          <Edit3 className="w-3 h-3" />
                          <span>{exercise.notes ? 'Edytuj uwagę' : '+ Dodaj uwagę'}</span>
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          );
        })}

        {/* SEKCJA: UWAGI DO TRENINGU */}
        <div className="glass-card p-3.5 rounded-3xl border border-white/5 space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <FileText className="w-4 h-4 text-[#00F59B]" />
              <span className="text-[11px] font-extrabold uppercase tracking-wider text-slate-300">
                Uwagi do sesji treningowej
              </span>
            </div>
            {!isEditingNotes ? (
              <button
                type="button"
                onClick={() => {
                  setSessionNotesInput(activeSession.notes || '');
                  setIsEditingNotes(true);
                }}
                className="text-[11px] font-bold text-[#00F59B] hover:underline flex items-center gap-1"
              >
                <Edit3 className="w-3 h-3" />
                <span>{activeSession.notes ? 'Edytuj uwagi' : '+ Dodaj uwagi'}</span>
              </button>
            ) : (
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setIsEditingNotes(false)}
                  className="text-[11px] text-slate-400 hover:text-white"
                >
                  Anuluj
                </button>
                <button
                  type="button"
                  onClick={() => {
                    updateSessionNotes(sessionNotesInput);
                    setIsEditingNotes(false);
                  }}
                  className="flex items-center gap-1 text-[11px] font-extrabold text-[#06090E] bg-[#00F59B] px-2.5 py-1 rounded-lg"
                >
                  <Save className="w-3 h-3" />
                  <span>Zapisz</span>
                </button>
              </div>
            )}
          </div>

          {isEditingNotes ? (
            <textarea
              value={sessionNotesInput}
              onChange={(e) => setSessionNotesInput(e.target.value)}
              placeholder="Wpisz uwagi do tego treningu (samopoczucie, poziom energii, pompa, ból, uwagi do sprzętu, RIR)..."
              className="w-full bg-[#070B12] border border-slate-700 rounded-2xl p-3 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-[#00F59B] min-h-[75px]"
            />
          ) : activeSession.notes ? (
            <p className="text-xs text-slate-300 bg-[#070B12] border border-slate-800/80 rounded-2xl p-3 whitespace-pre-wrap leading-relaxed">
              {activeSession.notes}
            </p>
          ) : (
            <p className="text-xs text-slate-500 italic bg-[#070B12]/50 border border-dashed border-slate-800 rounded-2xl p-2.5 text-center">
              Brak uwag do tego treningu. Kliknij „+ Dodaj uwagi”, aby zapisać wrażenia z sesji.
            </p>
          )}
        </div>

        {/* Add Exercise to Session Button */}
        <button
          type="button"
          onClick={() => {
            setReplacingExerciseId(null);
            setIsExerciseLibraryOpen(true);
          }}
          className="w-full py-4 flex items-center justify-center gap-2 border-2 border-dashed border-[#1E2E42] hover:border-[#00F59B]/60 rounded-3xl text-slate-300 hover:text-[#00F59B] transition-all font-bold text-xs uppercase tracking-wider bg-[#0C121B]/40 active:scale-[0.99]"
        >
          <Plus className="w-4 h-4 text-[#00F59B] stroke-[3]" />
          <span>Dodaj kolejne ćwiczenie do sesji</span>
        </button>
      </div>

      {/* Exercise Library Modal */}
      <ExerciseLibraryModal
        isOpen={isExerciseLibraryOpen}
        onClose={() => {
          setIsExerciseLibraryOpen(false);
          setReplacingExerciseId(null);
        }}
        onSelectExercise={(selectedEx: ExerciseDefinition) => {
          if (replacingExerciseId) {
            replaceExerciseInSession(selectedEx);
          } else {
            addExerciseToSession(selectedEx);
          }
        }}
        title={replacingExerciseId ? 'Wybierz ćwiczenie zamienne' : 'Dodaj ćwiczenie do sesji'}
      />

      {/* Finish Workout Success Modal */}
      {finishSuccessModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md select-none">
          <div className="w-full max-w-sm glass-card border border-[#00F59B]/60 rounded-3xl p-6 shadow-2xl text-center space-y-4 animate-in fade-in zoom-in-95 duration-150">
            <div className="w-16 h-16 bg-[#00F59B]/20 text-[#00F59B] rounded-full flex items-center justify-center mx-auto shadow-[0_0_25px_rgba(0,245,155,0.4)]">
              <CheckCircle2 className="w-9 h-9 stroke-[2.5]" />
            </div>
            <div>
              <span className="text-[10px] font-extrabold uppercase tracking-wider text-[#00F59B]">
                Sesja zakończona
              </span>
              <h3 className="text-xl font-extrabold text-white mt-1">Dobra robota!</h3>
              <p className="text-xs text-slate-300 mt-1 leading-relaxed">
                Sesja treningowa została pomyślnie zarejestrowana offline. Status dnia kontrolujesz ręcznie w module Plany.
              </p>
            </div>
            <button
              type="button"
              onClick={() => {
                setFinishSuccessModal(false);
                if (onWorkoutFinished) onWorkoutFinished();
              }}
              className="w-full py-3 rounded-2xl bg-gradient-to-r from-[#00F59B] to-[#06D6A0] text-[#06090E] font-extrabold text-sm neon-glow-btn transition-colors"
            >
              Świetnie, przejdź dalej
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
