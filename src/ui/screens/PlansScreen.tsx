import React, { useState } from 'react';
import {
  CalendarDays,
  Plus,
  ChevronLeft,
  ChevronRight,
  Dumbbell,
  CheckCircle2,
  XCircle,
  HelpCircle,
  Trash2,
  ArrowUp,
  ArrowDown,
  X,
  Search,
  Sparkles,
  Check,
  Flame,
  Layers,
  FileText,
  Edit3,
  Save,
  Settings as SettingsIcon,
} from 'lucide-react';
import { usePlansViewModel } from '../../viewmodel/usePlansViewModel';
import { DayStatus, EXERCISE_CATEGORIES, ExerciseDefinition } from '../../domain/types';

interface PlansScreenProps {
  onOpenSettings?: () => void;
}

export const PlansScreen: React.FC<PlansScreenProps> = ({ onOpenSettings }) => {
  const {
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
  } = usePlansViewModel();

  // Notes state
  const [isEditingDayNotes, setIsEditingDayNotes] = useState<boolean>(false);
  const [dayNotesText, setDayNotesText] = useState<string>('');
  const [editingExerciseNotesId, setEditingExerciseNotesId] = useState<string | null>(null);
  const [exerciseNotesText, setExerciseNotesText] = useState<string>('');

  // Helper for rendering status badge
  const renderStatusBadge = (status: DayStatus) => {
    switch (status) {
      case 'COMPLETED':
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-bold text-[#00F59B] bg-emerald-950/70 px-2.5 py-1 rounded-xl border border-[#00F59B]/40 shadow-[0_0_10px_rgba(0,245,155,0.2)]">
            <CheckCircle2 className="w-3.5 h-3.5 stroke-[2.5]" />
            <span>Zaliczony</span>
          </span>
        );
      case 'NOT_COMPLETED':
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-bold text-rose-400 bg-rose-950/70 px-2.5 py-1 rounded-xl border border-rose-500/40">
            <XCircle className="w-3.5 h-3.5 stroke-[2.5]" />
            <span>Niezaliczony</span>
          </span>
        );
      case 'UNRESOLVED':
      default:
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-medium text-amber-300 bg-amber-950/50 px-2.5 py-1 rounded-xl border border-amber-500/30">
            <HelpCircle className="w-3.5 h-3.5 text-amber-400" />
            <span>Nierozstrzygnięty</span>
          </span>
        );
    }
  };

  return (
    <div className="flex-1 overflow-y-auto px-4 py-3.5 space-y-4 pb-12 select-none">
      {/* 0. Top Header with Title and Settings Gear Icon */}
      <div className="flex items-center justify-between pt-1">
        <div>
          <h1 className="text-xl font-extrabold tracking-tight text-white flex items-center gap-2">
            Plany Treningowe
          </h1>
          <p className="text-[11px] font-medium text-slate-400">
            Zarządzanie cyklem i mikrocyklami
          </p>
        </div>

        {onOpenSettings && (
          <button
            type="button"
            onClick={onOpenSettings}
            className="p-1.5 rounded-xl bg-[#111824] hover:bg-[#182335] border border-[#223147] text-slate-300 hover:text-[#00F59B] transition-all text-xs font-semibold shadow-sm active:scale-95"
            title="Otwórz Ustawienia (⚙)"
          >
            <SettingsIcon className="w-4 h-4 text-[#00F59B]" />
          </button>
        )}
      </div>

      {/* 1. SEKCJA: CYKL TRENINGOWY */}
      <section aria-labelledby="cycle-heading" className="space-y-2.5">
        <div className="glass-card p-3.5 rounded-3xl border border-white/10 relative overflow-hidden">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-1.5 mb-0.5">
                <span className="w-2 h-2 rounded-full bg-[#00F59B] shadow-[0_0_6px_#00F59B]" />
                <span className="text-[10px] font-extrabold uppercase tracking-wider text-[#00F59B]">
                  CYKL TRENINGOWY
                </span>
              </div>
              <h1 id="cycle-heading" className="text-base font-extrabold text-white tracking-tight">
                {cycleData.name}
              </h1>
              <p className="text-[11px] text-slate-400 font-medium">
                Cykl rozpoczęty: <span className="text-slate-200 font-bold">{cycleData.startDate}</span>
              </p>
            </div>

            <button
              type="button"
              onClick={handleAddNewWeek}
              className="flex items-center gap-1.5 px-3 py-2 rounded-2xl bg-gradient-to-r from-[#00F59B] to-[#06D6A0] text-[#06090E] font-extrabold text-xs shadow-md neon-glow-btn transition-all active:scale-95 shrink-0"
              title="Dodaj nowy tydzień do cyklu"
            >
              <Plus className="w-3.5 h-3.5 stroke-[3]" />
              <span>Nowy tydzień</span>
            </button>
          </div>

          {/* Lista tygodni: [Tydzień 1] [Tydzień 2] [Tydzień 3]... */}
          <div className="mt-3 pt-3 border-t border-slate-800/80">
            <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-2">
              Wybierz tydzień cyklu:
            </p>
            <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
              {cycleData.weeks.map((week) => {
                const isSelected = week.id === selectedWeekId;
                const completedCount = week.days.filter((d) => d.manualStatus === 'COMPLETED').length;
                const totalDays = week.days.length;

                return (
                  <button
                    key={week.id}
                    type="button"
                    onClick={() => handleSelectWeek(week.id)}
                    className={`flex items-center gap-2 px-3.5 py-2 rounded-2xl font-extrabold text-xs transition-all shrink-0 border ${
                      isSelected
                        ? 'bg-[#142334] text-[#00F59B] border-[#00F59B] shadow-[0_0_12px_rgba(0,245,155,0.25)] ring-1 ring-[#00F59B]/50'
                        : 'bg-[#0E1520] hover:bg-[#131D2B] text-slate-300 border-[#1B2738]'
                    }`}
                  >
                    <span>{week.name}</span>
                    {totalDays > 0 && completedCount === totalDays ? (
                      <span className="text-[#00F59B] text-xs">✓</span>
                    ) : totalDays > 0 ? (
                      <span className="text-[10px] text-slate-400 font-mono">
                        {completedCount}/{totalDays}
                      </span>
                    ) : null}
                  </button>
                );
              })}

              <button
                type="button"
                onClick={handleAddNewWeek}
                className="flex items-center gap-1 px-3 py-2 rounded-2xl border border-dashed border-slate-700 hover:border-[#00F59B] text-slate-400 hover:text-[#00F59B] text-xs font-bold shrink-0 transition-colors"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Dodaj tydzień</span>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* 2. JEŚLI WYBRANO DZIEŃ: PEŁNY WIDOK PLANU TRENINGOWEGO DNIA */}
      {selectedDay && selectedWeek ? (
        <section aria-labelledby="day-plan-heading" className="space-y-4 animate-in fade-in duration-200">
          {/* Przycisk powrotu do tygodnia */}
          <button
            type="button"
            onClick={handleBackToWeek}
            className="flex items-center gap-1.5 text-xs font-bold text-slate-300 hover:text-[#00F59B] transition-colors"
          >
            <ChevronLeft className="w-4 h-4 text-[#00F59B]" />
            <span>Wróć do {selectedWeek.name}</span>
          </button>

          {/* Nagłówek dnia */}
          <div className="glass-card p-4 rounded-3xl border border-white/10 space-y-2">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-[10px] font-extrabold uppercase tracking-wider text-[#00F59B]">
                  {selectedWeek.name.toUpperCase()}
                </span>
                <h2 id="day-plan-heading" className="text-xl font-extrabold text-white tracking-tight">
                  {selectedDay.dayName} — {selectedDay.planName}
                </h2>
                <p className="text-xs text-slate-400 font-medium">
                  {selectedDay.exercises.length}{' '}
                  {selectedDay.exercises.length === 1
                    ? 'ćwiczenie'
                    : selectedDay.exercises.length < 5
                    ? 'ćwiczenia'
                    : 'ćwiczeń'}{' '}
                  w planie
                </p>
              </div>

              {renderStatusBadge(selectedDay.manualStatus)}
            </div>

            {/* Ręczne sterowanie statusem dnia */}
            <div className="pt-2 border-t border-slate-800">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1.5">
                Ręczny status dnia:
              </span>
              <div className="grid grid-cols-3 gap-2">
                <button
                  type="button"
                  onClick={() => handleSetDayStatus('COMPLETED')}
                  className={`py-2 px-2 rounded-xl text-xs font-extrabold border transition-all ${
                    selectedDay.manualStatus === 'COMPLETED'
                      ? 'bg-gradient-to-r from-[#00F59B] to-[#06D6A0] text-[#06090E] border-[#00F59B] shadow-[0_0_12px_rgba(0,245,155,0.3)]'
                      : 'bg-[#0E1520] hover:bg-slate-800 border-slate-700/60 text-slate-300'
                  }`}
                >
                  ZALICZ DZIEŃ
                </button>
                <button
                  type="button"
                  onClick={() => handleSetDayStatus('NOT_COMPLETED')}
                  className={`py-2 px-2 rounded-xl text-xs font-extrabold border transition-all ${
                    selectedDay.manualStatus === 'NOT_COMPLETED'
                      ? 'bg-rose-500 text-white border-rose-500 shadow-[0_0_12px_rgba(244,63,94,0.3)]'
                      : 'bg-[#0E1520] hover:bg-slate-800 border-slate-700/60 text-slate-300'
                  }`}
                >
                  NIEZALICZONY
                </button>
                <button
                  type="button"
                  onClick={() => handleSetDayStatus('UNRESOLVED')}
                  className={`py-2 px-2 rounded-xl text-xs font-bold border transition-all ${
                    selectedDay.manualStatus === 'UNRESOLVED'
                      ? 'bg-amber-500/20 text-amber-300 border-amber-500 shadow-[0_0_10px_rgba(245,158,11,0.2)]'
                      : 'bg-[#0E1520] hover:bg-slate-800 border-slate-700/60 text-slate-400'
                  }`}
                >
                  RESET
                </button>
              </div>
              <p className="text-[10px] text-slate-500 mt-1.5 text-center">
                Status ustawiasz wyłącznie ręcznie. Nic nie jest zaliczane automatycznie.
              </p>
            </div>
          </div>

          {/* SEKCJA: UWAGI DO PLANU TEGO DNIA */}
          <div className="glass-card p-3.5 rounded-3xl border border-white/5 space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <FileText className="w-4 h-4 text-[#00F59B]" />
                <span className="text-[11px] font-extrabold uppercase tracking-wider text-slate-300">
                  Uwagi do planu dnia
                </span>
              </div>
              {!isEditingDayNotes ? (
                <button
                  type="button"
                  onClick={() => {
                    setDayNotesText(selectedDay.notes || '');
                    setIsEditingDayNotes(true);
                  }}
                  className="flex items-center gap-1 text-[11px] font-bold text-[#00F59B] hover:underline"
                >
                  <Edit3 className="w-3 h-3" />
                  <span>{selectedDay.notes ? 'Edytuj uwagi' : '+ Dodaj uwagi'}</span>
                </button>
              ) : (
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setIsEditingDayNotes(false)}
                    className="text-[11px] text-slate-400 hover:text-white"
                  >
                    Anuluj
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      handleUpdateDayNotes(dayNotesText);
                      setIsEditingDayNotes(false);
                    }}
                    className="flex items-center gap-1 text-[11px] font-extrabold text-[#06090E] bg-[#00F59B] px-2.5 py-1 rounded-lg"
                  >
                    <Save className="w-3 h-3" />
                    <span>Zapisz</span>
                  </button>
                </div>
              )}
            </div>

            {isEditingDayNotes ? (
              <textarea
                value={dayNotesText}
                onChange={(e) => setDayNotesText(e.target.value)}
                placeholder="Wpisz uwagi do tego planu dnia (np. pauza 1s na dole, tempo 3-0-1, nie schodzić poniżej 8 powtórzeń, czas przerw 2 min)..."
                className="w-full bg-[#070B12] border border-slate-700 rounded-2xl p-3 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-[#00F59B] min-h-[80px]"
              />
            ) : selectedDay.notes ? (
              <p className="text-xs text-slate-300 bg-[#070B12] border border-slate-800/80 rounded-2xl p-3 whitespace-pre-wrap leading-relaxed">
                {selectedDay.notes}
              </p>
            ) : (
              <p className="text-xs text-slate-500 italic bg-[#070B12]/50 border border-dashed border-slate-800 rounded-2xl p-2.5 text-center">
                Brak uwag do tego planu dnia. Kliknij „+ Dodaj uwagi”, aby zapisać wskazówki.
              </p>
            )}
          </div>

          {/* 3. LISTA ĆWICZEŃ W PLANIE DNIA */}
          <div className="space-y-3">
            <div className="flex items-center justify-between px-1">
              <h3 className="text-xs font-extrabold uppercase tracking-wider text-slate-300">
                Ćwiczenia ({selectedDay.exercises.length})
              </h3>
              <button
                type="button"
                onClick={() => setIsAddExerciseModalOpen(true)}
                className="text-xs font-bold text-[#00F59B] hover:underline flex items-center gap-1"
              >
                <Plus className="w-3.5 h-3.5 stroke-[3]" />
                <span>Dodaj ćwiczenie</span>
              </button>
            </div>

            {selectedDay.exercises.length === 0 ? (
              <div className="p-8 text-center rounded-3xl bg-[#0E1520] border border-slate-800 space-y-3">
                <Dumbbell className="w-10 h-10 text-slate-600 mx-auto" />
                <p className="text-sm font-bold text-white">Brak ćwiczeń w planie</p>
                <p className="text-xs text-slate-400 max-w-xs mx-auto">
                  Dodaj ćwiczenia z biblioteki i skonfiguruj serie oraz obciążenia dla tego dnia.
                </p>
                <button
                  type="button"
                  onClick={() => setIsAddExerciseModalOpen(true)}
                  className="px-4 py-2.5 rounded-2xl bg-gradient-to-r from-[#00F59B] to-[#06D6A0] text-[#06090E] font-extrabold text-xs shadow-md neon-glow-btn"
                >
                  + Dodaj pierwsze ćwiczenie
                </button>
              </div>
            ) : (
              selectedDay.exercises.map((exercise, exIndex) => (
                <div
                  key={exercise.id}
                  className="glass-card p-3.5 rounded-3xl border border-white/5 space-y-3 relative"
                >
                  {/* Nagłówek ćwiczenia */}
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-start gap-2.5">
                      <span className="w-6 h-6 rounded-lg bg-emerald-950/80 border border-[#00F59B]/40 text-[#00F59B] font-mono text-xs font-extrabold flex items-center justify-center shrink-0 mt-0.5">
                        {exIndex + 1}
                      </span>
                      <div>
                        <h4 className="text-sm font-extrabold text-white leading-snug">
                          {exercise.name}
                        </h4>
                        <div className="flex items-center gap-2 mt-0.5">
                          <span className="text-[10px] font-bold text-[#00F59B] bg-[#0A1F17] px-2 py-0.5 rounded-md border border-[#00F59B]/20">
                            {exercise.category}
                          </span>
                          {exercise.notes && (
                            <span className="text-[11px] text-slate-400 italic">
                              {exercise.notes}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Akcje ćwiczenia: Reorder & Delete */}
                    <div className="flex items-center gap-1 shrink-0">
                      <button
                        type="button"
                        onClick={() => handleMoveExercise(exIndex, exIndex - 1)}
                        disabled={exIndex === 0}
                        className="p-1 rounded-lg text-slate-400 hover:text-white disabled:opacity-20 hover:bg-slate-800"
                        title="Przesuń w górę"
                      >
                        <ArrowUp className="w-3.5 h-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleMoveExercise(exIndex, exIndex + 1)}
                        disabled={exIndex === selectedDay.exercises.length - 1}
                        className="p-1 rounded-lg text-slate-400 hover:text-white disabled:opacity-20 hover:bg-slate-800"
                        title="Przesuń w dół"
                      >
                        <ArrowDown className="w-3.5 h-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleRemoveExercise(exercise.id)}
                        className="p-1 rounded-lg text-rose-400 hover:text-rose-300 hover:bg-rose-950/40 ml-1"
                        title="Usuń ćwiczenie z planu"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  {/* Tabela serii */}
                  <div className="bg-[#070B12] rounded-2xl border border-slate-800/80 p-2.5 space-y-1.5">
                    <div className="grid grid-cols-12 gap-1 text-[10px] font-extrabold uppercase text-slate-500 px-1 pb-1 border-b border-slate-800/60">
                      <span className="col-span-2">Seria</span>
                      <span className="col-span-4 text-center">Ciężar (kg)</span>
                      <span className="col-span-4 text-center">Powtórzenia</span>
                      <span className="col-span-2 text-right">Usuń</span>
                    </div>

                    {exercise.sets.map((set) => (
                      <div
                        key={set.id}
                        className="grid grid-cols-12 gap-1 items-center px-1 py-1 rounded-xl bg-slate-900/40 hover:bg-slate-900/80 transition-colors"
                      >
                        <span className="col-span-2 font-mono text-xs font-bold text-slate-300">
                          S{set.setNumber}
                        </span>

                        {/* Ciężar */}
                        <div className="col-span-4 flex items-center justify-center">
                          <input
                            type="number"
                            step="0.5"
                            value={set.weightKg}
                            onChange={(e) =>
                              handleUpdateSet(exercise.id, set.id, {
                                weightKg: parseFloat(e.target.value) || 0,
                              })
                            }
                            className="w-16 bg-[#0E1520] border border-slate-700 rounded-lg text-center text-xs font-extrabold text-white py-1 focus:outline-none focus:border-[#00F59B]"
                          />
                        </div>

                        {/* Powtórzenia */}
                        <div className="col-span-4 flex items-center justify-center">
                          <input
                            type="number"
                            value={set.reps}
                            onChange={(e) =>
                              handleUpdateSet(exercise.id, set.id, {
                                reps: parseInt(e.target.value, 10) || 0,
                              })
                            }
                            className="w-14 bg-[#0E1520] border border-slate-700 rounded-lg text-center text-xs font-extrabold text-white py-1 focus:outline-none focus:border-[#00F59B]"
                          />
                        </div>

                        {/* Usuń serię */}
                        <div className="col-span-2 flex justify-end">
                          <button
                            type="button"
                            onClick={() => handleRemoveSet(exercise.id, set.id)}
                            disabled={exercise.sets.length <= 1}
                            className="p-1 text-slate-500 hover:text-rose-400 disabled:opacity-20"
                            title="Usuń tę serię"
                          >
                            <X className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    ))}

                    {/* Przycisk: + Dodaj serię */}
                    <button
                      type="button"
                      onClick={() => handleAddSet(exercise.id)}
                      className="w-full mt-1 py-1.5 flex items-center justify-center gap-1.5 rounded-xl border border-dashed border-slate-700/80 hover:border-[#00F59B]/60 text-slate-400 hover:text-[#00F59B] text-[11px] font-bold transition-colors"
                    >
                      <Plus className="w-3 h-3 stroke-[2.5]" />
                      <span>Dodaj serię</span>
                    </button>
                  </div>

                  {/* Uwagi do ćwiczenia */}
                  <div className="pt-2 border-t border-slate-800/60 text-[11px]">
                    {editingExerciseNotesId === exercise.id ? (
                      <div className="flex items-center gap-2">
                        <input
                          type="text"
                          value={exerciseNotesText}
                          onChange={(e) => setExerciseNotesText(e.target.value)}
                          placeholder="Wpisz uwagę do ćwiczenia (np. pauza 1s na klatce, chwyt wąski)..."
                          className="flex-1 bg-[#070A0F] border border-slate-700 rounded-xl px-2.5 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-[#00F59B]"
                        />
                        <button
                          type="button"
                          onClick={() => {
                            handleUpdateExerciseNotes(exercise.id, exerciseNotesText);
                            setEditingExerciseNotesId(null);
                          }}
                          className="px-2.5 py-1.5 rounded-lg bg-[#00F59B] text-[#06090E] font-extrabold text-xs"
                        >
                          Zapisz
                        </button>
                        <button
                          type="button"
                          onClick={() => setEditingExerciseNotesId(null)}
                          className="text-slate-400 hover:text-white text-xs px-1"
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
                            setEditingExerciseNotesId(exercise.id);
                            setExerciseNotesText(exercise.notes || '');
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
              ))
            )}

            {/* Przycisk na dole listy: + Dodaj ćwiczenie */}
            <button
              type="button"
              onClick={() => setIsAddExerciseModalOpen(true)}
              className="w-full py-3.5 flex items-center justify-center gap-2 border-2 border-dashed border-[#1E2E42] hover:border-[#00F59B]/60 rounded-3xl text-slate-300 hover:text-[#00F59B] transition-all font-bold text-xs uppercase tracking-wider bg-[#0C121B]/40 active:scale-[0.99]"
            >
              <Plus className="w-4 h-4 text-[#00F59B] stroke-[3]" />
              <span>Dodaj ćwiczenie z biblioteki</span>
            </button>
          </div>
        </section>
      ) : (
        /* 3. WIDOK WYBRANEGO TYGODNIA: LISTA DNI TRENINGOWYCH */
        <section aria-labelledby="week-view-heading" className="space-y-3">
          <div className="flex items-center justify-between px-1">
            <div>
              <h2 id="week-view-heading" className="text-sm font-extrabold text-white tracking-tight uppercase">
                {selectedWeek?.name || 'Tydzień'}
              </h2>
              <p className="text-[11px] text-slate-400 font-medium">
                DNI TRENINGOWE W TYM TYGODNIU
              </p>
            </div>

            {availableDaysOfWeek.length > 0 && (
              <button
                type="button"
                onClick={handleOpenAddDayModal}
                className="flex items-center gap-1 text-xs font-bold text-[#00F59B] bg-emerald-950/70 hover:bg-emerald-900/80 px-3 py-1.5 rounded-xl border border-[#00F59B]/40 shadow-sm transition-all active:scale-95"
              >
                <Plus className="w-3.5 h-3.5 stroke-[3]" />
                <span>Dodaj dzień</span>
              </button>
            )}
          </div>

          {/* Lista dni dodanych do wybranego tygodnia */}
          <div className="space-y-2">
            {!selectedWeek || selectedWeek.days.length === 0 ? (
              <div className="p-8 text-center rounded-3xl bg-[#0E1520] border border-slate-800 space-y-3">
                <CalendarDays className="w-10 h-10 text-slate-600 mx-auto" />
                <h3 className="text-sm font-bold text-white">Brak dni w tym tygodniu</h3>
                <p className="text-xs text-slate-400 max-w-xs mx-auto">
                  Dodaj dni treningowe (np. Poniedziałek - Push, Wtorek - Pull) do tego tygodnia.
                </p>
                <button
                  type="button"
                  onClick={handleOpenAddDayModal}
                  className="px-4 py-2.5 rounded-2xl bg-gradient-to-r from-[#00F59B] to-[#06D6A0] text-[#06090E] font-extrabold text-xs shadow-md neon-glow-btn"
                >
                  + Dodaj pierwszy dzień treningowy
                </button>
              </div>
            ) : (
              selectedWeek.days.map((day) => (
                <div
                  key={day.id}
                  onClick={() => handleSelectDay(day.id)}
                  className="group flex items-center justify-between p-3.5 rounded-2xl bg-[#0E1520] hover:bg-[#131E2C] border border-[#182332] hover:border-[#00F59B]/40 cursor-pointer transition-all duration-200 active:scale-[0.99]"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-emerald-950/60 border border-[#00F59B]/30 text-[#00F59B] flex items-center justify-center shrink-0">
                      <Dumbbell className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-extrabold text-white group-hover:text-[#00F59B] transition-colors">
                          {day.dayName}
                        </span>
                        <span className="text-xs text-slate-400 font-bold">
                          — {day.planName}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-400 mt-0.5">
                        {day.exercises.length}{' '}
                        {day.exercises.length === 1
                          ? 'ćwiczenie'
                          : day.exercises.length < 5
                          ? 'ćwiczenia'
                          : 'ćwiczeń'}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    {renderStatusBadge(day.manualStatus)}
                    <ChevronRight className="w-4 h-4 text-slate-500 group-hover:text-[#00F59B] transition-transform group-hover:translate-x-0.5" />
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Przycisk: + Dodaj dzień treningowy */}
          {selectedWeek && selectedWeek.days.length > 0 && availableDaysOfWeek.length > 0 && (
            <button
              type="button"
              onClick={handleOpenAddDayModal}
              className="w-full py-3.5 flex items-center justify-center gap-2 border-2 border-dashed border-[#1E2E42] hover:border-[#00F59B]/60 rounded-3xl text-slate-300 hover:text-[#00F59B] transition-all font-bold text-xs uppercase tracking-wider bg-[#0C121B]/40 active:scale-[0.99]"
            >
              <Plus className="w-4 h-4 text-[#00F59B] stroke-[3]" />
              <span>Dodaj dzień treningowy</span>
            </button>
          )}
        </section>
      )}

      {/* 4. MODAL: DODAWANIE DNIA TRENINGOWEGO DO TYGODNIA */}
      {isAddDayModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md select-none">
          <div className="w-full max-w-sm glass-card border border-slate-700/80 rounded-3xl p-5 shadow-2xl space-y-4 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div>
                <span className="text-[10px] font-extrabold uppercase tracking-wider text-[#00F59B]">
                  {selectedWeek?.name || 'Tydzień'}
                </span>
                <h3 className="text-base font-extrabold text-white">
                  Dodaj dzień treningowy
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setIsAddDayModalOpen(false)}
                className="text-slate-400 hover:text-white p-1 rounded-xl"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Wybór dnia tygodnia (tylko jeszcze niedodane do tego tygodnia) */}
            <div>
              <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
                Dzień tygodnia:
              </label>
              <div className="grid grid-cols-2 gap-2">
                {availableDaysOfWeek.map((day) => (
                  <button
                    key={day.dow}
                    type="button"
                    onClick={() => {
                      setNewDayOfWeek(day.dow);
                      setNewDayPlanName(day.defaultName);
                    }}
                    className={`py-2 px-3 rounded-xl text-xs font-bold border text-left transition-all ${
                      newDayOfWeek === day.dow
                        ? 'bg-emerald-500/20 border-[#00F59B] text-[#00F59B] shadow-[0_0_10px_rgba(0,245,155,0.2)]'
                        : 'bg-slate-800/40 border-slate-700/60 text-slate-300 hover:bg-slate-800'
                    }`}
                  >
                    {day.name}
                  </button>
                ))}
              </div>
              <p className="text-[10px] text-slate-500 mt-1.5">
                Nie można dodać tego samego dnia dwa razy w jednym tygodniu.
              </p>
            </div>

            {/* Nazwa planu (np. Push, Pull, Legs) */}
            <div>
              <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                Nazwa planu dla tego dnia:
              </label>
              <input
                type="text"
                value={newDayPlanName}
                onChange={(e) => setNewDayPlanName(e.target.value)}
                placeholder="np. Push, Pull, Legs, FBW..."
                className="w-full bg-[#070A0F] border border-slate-700 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-[#00F59B]"
              />

              {/* Szybkie podpowiedzi nazw */}
              <div className="flex flex-wrap gap-1.5 mt-2">
                {['Push', 'Pull', 'Legs', 'Góra A', 'Dół A', 'FBW', 'Klatka + Tric'].map((name) => (
                  <button
                    key={name}
                    type="button"
                    onClick={() => setNewDayPlanName(name)}
                    className="text-[10px] font-bold text-slate-300 bg-slate-800/80 px-2 py-0.5 rounded-md hover:border-[#00F59B] border border-transparent"
                  >
                    {name}
                  </button>
                ))}
              </div>
            </div>

            {/* Przyciski modalu */}
            <div className="flex gap-2 pt-2 border-t border-slate-800">
              <button
                type="button"
                onClick={() => setIsAddDayModalOpen(false)}
                className="flex-1 py-2.5 rounded-xl border border-slate-700 text-slate-300 text-xs font-bold hover:bg-slate-800"
              >
                Anuluj
              </button>
              <button
                type="button"
                onClick={handleConfirmAddDay}
                className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-[#00F59B] to-[#06D6A0] text-[#06090E] text-xs font-extrabold neon-glow-btn"
              >
                Dodaj dzień
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 5. MODAL: BIBLIOTEKA ĆWICZEŃ (DODAWANIE ĆWICZENIA DO PLANU DNIA) */}
      {isAddExerciseModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md select-none">
          <div className="w-full max-w-md glass-card border border-slate-700/80 rounded-3xl p-5 shadow-2xl space-y-3.5 animate-in fade-in zoom-in-95 duration-150 max-h-[85vh] flex flex-col">
            <div className="flex items-center justify-between border-b border-slate-800 pb-2.5">
              <div>
                <span className="text-[10px] font-extrabold uppercase tracking-wider text-[#00F59B]">
                  Biblioteka ćwiczeń
                </span>
                <h3 className="text-base font-extrabold text-white">
                  Wybierz ćwiczenie do planu
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setIsAddExerciseModalOpen(false)}
                className="text-slate-400 hover:text-white p-1 rounded-xl"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Search Input */}
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
              <input
                type="text"
                value={exerciseSearch}
                onChange={(e) => setExerciseSearch(e.target.value)}
                placeholder="Szukaj ćwiczenia..."
                className="w-full bg-[#070A0F] border border-slate-700 rounded-xl pl-9 pr-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-[#00F59B]"
              />
            </div>

            {/* 7 Kategorii Chips */}
            <div className="flex gap-1.5 overflow-x-auto pb-1 no-scrollbar shrink-0">
              <button
                type="button"
                onClick={() => setExerciseCategoryFilter('all')}
                className={`text-[10px] font-bold px-2.5 py-1 rounded-lg border whitespace-nowrap transition-colors ${
                  exerciseCategoryFilter === 'all'
                    ? 'bg-[#00F59B] text-[#06090E] border-[#00F59B]'
                    : 'bg-slate-800/80 text-slate-300 border-slate-700'
                }`}
              >
                Wszystkie
              </button>
              {EXERCISE_CATEGORIES.map((cat) => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setExerciseCategoryFilter(cat)}
                  className={`text-[10px] font-bold px-2.5 py-1 rounded-lg border whitespace-nowrap transition-colors ${
                    exerciseCategoryFilter === cat
                      ? 'bg-[#00F59B] text-[#06090E] border-[#00F59B]'
                      : 'bg-slate-800/80 text-slate-300 border-slate-700'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            {/* Exercise List */}
            <div className="overflow-y-auto space-y-1.5 flex-1 pr-1">
              {filteredLibraryExercises.map((ex) => (
                <div
                  key={ex.id}
                  onClick={() => handleAddExerciseToCurrentDay(ex)}
                  className="flex items-center justify-between p-2.5 rounded-xl bg-slate-900/60 hover:bg-[#142334] border border-slate-800 hover:border-[#00F59B]/50 cursor-pointer transition-all"
                >
                  <div>
                    <h5 className="text-xs font-bold text-white">{ex.name}</h5>
                    <span className="text-[10px] text-[#00F59B]">{ex.category}</span>
                  </div>
                  <Plus className="w-4 h-4 text-slate-400 group-hover:text-[#00F59B]" />
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
