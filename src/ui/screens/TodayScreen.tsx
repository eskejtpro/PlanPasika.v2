import React, { useState } from 'react';
import {
  CalendarDays,
  Play,
  ChevronRight,
  Dumbbell,
  Coffee,
  MinusCircle,
  CheckCircle2,
  XCircle,
  HelpCircle,
  Clock,
  Pill,
  FileText,
  X,
  ExternalLink,
  Flame,
  Zap,
  Edit3,
  Calendar,
  AlertTriangle,
} from 'lucide-react';
import { useTodayViewModel, WeekDayItem } from '../../viewmodel/useTodayViewModel';
import { DayStatus, DayType, PlanDay } from '../../domain/types';

interface TodayScreenProps {
  onStartWorkout: () => void;
  onNavigateToCalendar: () => void;
  onNavigateToPlans: () => void;
}

export const TodayScreen: React.FC<TodayScreenProps> = ({
  onStartWorkout,
  onNavigateToCalendar,
  onNavigateToPlans,
}) => {
  const {
    weekRangeFormatted,
    weekDays,
    todayPlan,
    upcomingEvents,
    activeSessionRunning,
    selectedDayPreview,
    setSelectedDayPreview,
    updateDayPlan,
  } = useTodayViewModel();

  // State for in-modal editing from Today screen
  const [isEditingInModal, setIsEditingInModal] = useState<boolean>(false);
  const [editDayType, setEditDayType] = useState<DayType>('WORKOUT');
  const [editWorkoutName, setEditWorkoutName] = useState<string>('');
  const [editManualStatus, setEditManualStatus] = useState<DayStatus>('UNRESOLVED');
  const [warningInModal, setWarningInModal] = useState<boolean>(false);

  const startDayEditFromPreview = (day: WeekDayItem) => {
    setEditDayType(day.plan.dayType);
    setEditWorkoutName(day.plan.workoutName || 'Nowy trening');
    setEditManualStatus(day.plan.manualStatus);
    setWarningInModal(day.plan.manualStatus === 'COMPLETED' && !day.plan.hasRecordedSession);
    setIsEditingInModal(true);
  };

  const handleSaveModalEdit = () => {
    if (!selectedDayPreview) return;
    updateDayPlan(selectedDayPreview.date, {
      dayType: editDayType,
      workoutName: editDayType === 'WORKOUT' ? (editWorkoutName.trim() || 'Trening') : undefined,
      manualStatus: editManualStatus,
    });
    setIsEditingInModal(false);
    setSelectedDayPreview(null);
  };

  // Helper for status badge rendering
  const renderStatusBadge = (planType: DayType, status: DayStatus, isToday: boolean) => {
    if (planType === 'REST') {
      return (
        <span className="inline-flex items-center gap-1 text-[10px] font-bold text-cyan-400 bg-cyan-950/40 px-2 py-0.5 rounded-lg border border-cyan-500/25">
          <Coffee className="w-3 h-3 text-cyan-400" />
          <span>Wolne</span>
        </span>
      );
    }

    if (planType === 'EMPTY') {
      return (
        <span className="inline-flex items-center gap-1 text-[10px] font-medium text-slate-500 bg-slate-900/60 px-2 py-0.5 rounded-lg border border-slate-800">
          <span>Brak planu</span>
        </span>
      );
    }

    // When planType === 'WORKOUT'
    switch (status) {
      case 'COMPLETED':
        return (
          <span className="inline-flex items-center gap-1 text-[10px] font-bold text-[#00F59B] bg-emerald-950/60 px-2 py-0.5 rounded-lg border border-[#00F59B]/40 shadow-[0_0_8px_rgba(0,245,155,0.15)]">
            <CheckCircle2 className="w-3 h-3 stroke-[2.5]" />
            <span>Wykonany</span>
          </span>
        );
      case 'NOT_COMPLETED':
        return (
          <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-rose-400 bg-rose-950/50 px-2 py-0.5 rounded-lg border border-rose-500/30">
            <XCircle className="w-3 h-3" />
            <span>Niewykonany</span>
          </span>
        );
      case 'UNRESOLVED':
      default:
        return (
          <span className="inline-flex items-center gap-1 text-[10px] font-medium text-amber-300 bg-amber-950/40 px-2 py-0.5 rounded-lg border border-amber-500/30">
            <HelpCircle className="w-3 h-3 text-amber-400" />
            <span>Zaplanowany</span>
          </span>
        );
    }
  };

  return (
    <div className="flex-1 overflow-y-auto px-4 py-3.5 space-y-3.5 pb-8 select-none">
      {/* 1. TOP HEADER: Plan Treningowy + Zakres dat aktualnego tygodnia + Przycisk przejścia do pełnego kalendarza */}
      <header className="flex items-center justify-between pt-1">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-extrabold tracking-tight text-white flex items-center">
              Plan Treningowy
            </h1>
          </div>
          <p className="text-xs font-semibold text-slate-400 mt-0.5 flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-[#00F59B] shadow-[0_0_6px_#00F59B]" />
            <span className="text-slate-300">{weekRangeFormatted || 'Bieżący tydzień'}</span>
          </p>
        </div>

        {/* Przycisk przejścia do pełnego kalendarza */}
        <button
          type="button"
          onClick={onNavigateToCalendar}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#111824] hover:bg-[#182335] border border-[#223147] text-slate-200 hover:text-white transition-all text-xs font-semibold shadow-sm active:scale-95"
          title="Przejdź do pełnego kalendarza"
        >
          <CalendarDays className="w-3.5 h-3.5 text-[#00F59B]" />
          <span>Kalendarz</span>
        </button>
      </header>

      {/* 2. SEKCJA „MÓJ TYDZIEŃ”: Wszystkie 7 dni (Poniedziałek – Niedziela) */}
      <section aria-labelledby="my-week-heading" className="space-y-1.5">
        <div className="flex items-center justify-between px-1 mb-1">
          <div className="flex items-center gap-2">
            <h2 id="my-week-heading" className="text-xs font-bold uppercase tracking-wider text-slate-300">
              Mój tydzień
            </h2>
            <span className="text-[10px] text-slate-500 font-medium">· Poniedziałek – Niedziela</span>
          </div>
          <button
            type="button"
            onClick={onNavigateToPlans}
            className="text-[11px] text-[#00F59B] hover:underline font-semibold flex items-center gap-0.5"
          >
            Pełny moduł planów
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* 7 dni tygodnia w zwartym, czytelnym formacie dla Xiaomi 14T */}
        <div className="space-y-1.5">
          {weekDays.map((item) => {
            const isToday = item.isToday;
            const pType = item.plan.dayType;
            const isWorkout = pType === 'WORKOUT';
            const isRest = pType === 'REST';

            return (
              <div
                key={item.date}
                onClick={() => {
                  setSelectedDayPreview(item);
                  setIsEditingInModal(false);
                }}
                className={`group relative flex items-center justify-between px-3 py-2.5 rounded-2xl border cursor-pointer transition-all duration-200 active:scale-[0.99] ${
                  isToday
                    ? 'bg-gradient-to-r from-[#142334] to-[#0F1A26] border-[#00F59B]/60 shadow-[0_0_18px_-3px_rgba(0,245,155,0.25)] ring-1 ring-[#00F59B]/40'
                    : 'bg-[#0E1520] hover:bg-[#131C2A] border-[#182332]'
                }`}
              >
                {/* Kolumna 1: Skrót dnia + numer dnia miesiąca + pełna nazwa */}
                <div className="flex items-center gap-2.5 min-w-[95px]">
                  <div
                    className={`w-8 h-8 rounded-xl flex flex-col items-center justify-center shrink-0 font-mono transition-all ${
                      isToday
                        ? 'bg-gradient-to-b from-[#00F59B] to-[#05DF85] text-[#06090E] font-bold shadow-[0_0_10px_rgba(0,245,155,0.4)]'
                        : isWorkout
                        ? 'bg-emerald-950/40 text-emerald-300 border border-emerald-500/25'
                        : isRest
                        ? 'bg-cyan-950/40 text-cyan-300 border border-cyan-500/25'
                        : 'bg-slate-800/50 text-slate-400 border border-slate-700/40'
                    }`}
                  >
                    <span className="text-[9px] uppercase leading-none font-bold">
                      {item.dayShort}
                    </span>
                    <span className="text-xs leading-none font-extrabold mt-0.5">
                      {item.dayNumber}
                    </span>
                  </div>

                  <div className="flex flex-col">
                    <span
                      className={`text-xs font-bold leading-tight ${
                        isToday ? 'text-[#00F59B]' : 'text-slate-200'
                      }`}
                    >
                      {item.dayFull}
                    </span>
                    {isToday && (
                      <span className="text-[9px] font-extrabold uppercase tracking-wider text-[#00F59B] drop-shadow-[0_0_4px_rgba(0,245,155,0.6)]">
                        DZIŚ
                      </span>
                    )}
                  </div>
                </div>

                {/* Kolumna 2: Przypisany trening / Dzień wolny / Brak planu */}
                <div className="flex-1 px-2.5 truncate">
                  {isWorkout ? (
                    <div className="flex items-center gap-1.5 truncate">
                      <Dumbbell className="w-3.5 h-3.5 text-[#00F59B] shrink-0" />
                      <span className="text-xs font-bold text-white truncate">
                        {item.plan.workoutName || 'Trening'}
                      </span>
                    </div>
                  ) : isRest ? (
                    <div className="flex items-center gap-1.5 text-cyan-400">
                      <Coffee className="w-3.5 h-3.5 shrink-0 opacity-80" />
                      <span className="text-xs font-semibold text-slate-300 truncate">
                        Dzień wolny
                      </span>
                    </div>
                  ) : (
                    <div className="flex items-center gap-1.5 text-slate-500">
                      <MinusCircle className="w-3.5 h-3.5 shrink-0 opacity-50" />
                      <span className="text-xs font-normal text-slate-400 truncate">
                        Brak planu
                      </span>
                    </div>
                  )}
                </div>

                {/* Kolumna 3: Status ręczny (Wykonany / Niewykonany / Nierozstrzygnięty / Zaplanowany) */}
                <div className="flex items-center gap-1.5 shrink-0">
                  {renderStatusBadge(pType, item.plan.manualStatus, isToday)}
                  <ChevronRight className="w-3.5 h-3.5 text-slate-500 group-hover:text-slate-300 transition-transform group-hover:translate-x-0.5" />
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* 3. DLA DZISIEJSZEGO DNIA: Duży przycisk pod tygodniem (Rozpocznij trening / Wróć do aktywnego treningu) */}
      <section aria-labelledby="today-action-heading">
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#121B27] via-[#0E1520] to-[#0A0F16] border border-[#223348] p-4 shadow-xl">
          {/* Neon ambient glow */}
          <div className="absolute -top-10 -right-10 w-36 h-36 bg-gradient-to-br from-[#00F59B]/20 to-teal-500/10 rounded-full blur-3xl pointer-events-none" />

          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-[#00F59B] animate-pulse" />
              <span className="text-[11px] font-bold uppercase tracking-wider text-[#00F59B]">
                Dzisiaj
              </span>
            </div>
            {activeSessionRunning ? (
              <span className="inline-flex items-center gap-1.5 text-[10px] font-bold text-[#00F59B] bg-emerald-950/80 px-2.5 py-0.5 rounded-full border border-[#00F59B]/50 shadow-[0_0_10px_rgba(0,245,155,0.2)]">
                <span className="w-1.5 h-1.5 rounded-full bg-[#00F59B] animate-ping" />
                SESJA W TOKU
              </span>
            ) : todayPlan?.manualStatus === 'COMPLETED' ? (
              <span className="text-[10px] font-bold text-[#00F59B] bg-emerald-950/60 px-2.5 py-0.5 rounded-full border border-[#00F59B]/40">
                WYKONANY ✓
              </span>
            ) : (
              <span className="text-[11px] font-medium text-slate-400">
                Zaplanowany
              </span>
            )}
          </div>

          <h3 className="text-base font-extrabold text-white tracking-tight mb-1">
            {todayPlan?.dayType === 'WORKOUT'
              ? todayPlan.workoutName || 'Trening siłowy'
              : todayPlan?.dayType === 'REST'
              ? 'Dzień regeneracji (Odpoczynek)'
              : 'Brak zaplanowanego treningu na dziś'}
          </h3>

          {todayPlan?.dayType === 'WORKOUT' && todayPlan.exercises && todayPlan.exercises.length > 0 ? (
            <p className="text-xs text-slate-400 mb-3 truncate">
              Ćwiczenia: {todayPlan.exercises.map((e) => e.name).join(', ')}
            </p>
          ) : todayPlan?.dayType === 'REST' ? (
            <p className="text-xs text-slate-300 mb-3 leading-relaxed">
              Odpoczynek to czas, w którym mięśnie się odbudowują i rosną.
            </p>
          ) : (
            <p className="text-xs text-slate-400 mb-3">
              Dotknij powyższy dzień lub przejdź do modułu Plany, aby zaplanować sesję.
            </p>
          )}

          {/* Główny przycisk akcji dla dzisiejszego treningu */}
          {todayPlan?.dayType === 'WORKOUT' ? (
            <button
              type="button"
              onClick={onStartWorkout}
              className="w-full flex items-center justify-center gap-2 py-3.5 px-5 rounded-2xl font-extrabold text-sm tracking-wide transition-all shadow-xl active:scale-[0.98] bg-gradient-to-r from-[#00F59B] via-[#05DF85] to-[#00E5FF] text-[#06090E] neon-glow-btn"
            >
              <Play className="w-4 h-4 fill-current stroke-[3]" />
              <span>
                {activeSessionRunning ? 'Wróć do aktywnego treningu' : 'Rozpocznij trening'}
              </span>
            </button>
          ) : (
            <button
              type="button"
              onClick={onNavigateToPlans}
              className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-2xl bg-[#142131] hover:bg-[#1A2C42] border border-[#22364E] text-slate-200 text-xs font-bold transition-all"
            >
              <Edit3 className="w-3.5 h-3.5 text-[#00F59B]" />
              <span>Zarządzaj planem w module Plany</span>
            </button>
          )}
        </div>
      </section>

      {/* 4. POD TYGODNIEM: Mała sekcja „Najbliższe wydarzenia” (maks. 2-3 wpisy z kalendarza) */}
      <section aria-labelledby="upcoming-events-heading" className="space-y-1.5 pt-1">
        <div className="flex items-center justify-between px-1">
          <h2 id="upcoming-events-heading" className="text-xs font-bold uppercase tracking-wider text-slate-300">
            Najbliższe wydarzenia
          </h2>
          <button
            type="button"
            onClick={onNavigateToCalendar}
            className="text-[11px] text-[#00F59B] hover:underline font-semibold flex items-center gap-0.5"
          >
            Kalendarz
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="space-y-1.5">
          {upcomingEvents.length > 0 ? (
            upcomingEvents.map((evt) => (
              <div
                key={evt.id}
                onClick={onNavigateToCalendar}
                className="flex items-center justify-between p-3 rounded-2xl bg-[#0E1520] hover:bg-[#131C2A] border border-[#182332] cursor-pointer transition-colors"
              >
                <div className="flex items-center gap-2.5 overflow-hidden">
                  <div
                    className={`w-7 h-7 rounded-xl flex items-center justify-center shrink-0 ${
                      evt.type === 'workout'
                        ? 'bg-emerald-500/15 text-[#00F59B] border border-emerald-500/30'
                        : evt.type === 'substance'
                        ? 'bg-cyan-500/15 text-cyan-400 border border-cyan-500/30'
                        : evt.type === 'note'
                        ? 'bg-purple-500/15 text-purple-400 border border-purple-500/30'
                        : 'bg-sky-500/15 text-sky-400 border border-sky-500/30'
                    }`}
                  >
                    {evt.type === 'workout' ? (
                      <Dumbbell className="w-3.5 h-3.5" />
                    ) : evt.type === 'substance' ? (
                      <Pill className="w-3.5 h-3.5" />
                    ) : evt.type === 'note' ? (
                      <FileText className="w-3.5 h-3.5" />
                    ) : (
                      <Coffee className="w-3.5 h-3.5" />
                    )}
                  </div>
                  <div className="truncate">
                    <p className="text-xs font-bold text-white truncate">
                      {evt.title}
                    </p>
                    <p className="text-[10px] text-slate-400 truncate">
                      {evt.dateLabel}
                      {evt.subtitle ? ` · ${evt.subtitle}` : ''}
                    </p>
                  </div>
                </div>

                <ChevronRight className="w-3.5 h-3.5 text-slate-600 shrink-0" />
              </div>
            ))
          ) : (
            <div className="p-3 text-center rounded-2xl bg-[#0E1520]/60 border border-slate-800 text-xs text-slate-500">
              Brak dodatkowych wydarzeń w najbliższych dniach.
            </div>
          )}
        </div>
      </section>

      {/* 5. SZYBKI PODGLĄD DNIA & SZYBKA EDYCJA */}
      {selectedDayPreview && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md select-none">
          <div className="w-full max-w-sm glass-card border border-slate-700/70 rounded-3xl p-5 shadow-2xl space-y-4 animate-in fade-in zoom-in-95 duration-150">
            {/* Header modalu */}
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div>
                <span className="text-[10px] font-extrabold uppercase tracking-wider text-[#00F59B]">
                  {isEditingInModal ? 'Szybka edycja dnia' : 'Szczegóły dnia'}
                </span>
                <h3 className="text-base font-extrabold text-white leading-tight">
                  {selectedDayPreview.dayFull}, {selectedDayPreview.dayNumber}
                </h3>
                <p className="text-xs font-mono text-slate-400">
                  {selectedDayPreview.date}
                </p>
              </div>
              <button
                type="button"
                onClick={() => {
                  setSelectedDayPreview(null);
                  setIsEditingInModal(false);
                }}
                className="p-1.5 text-slate-400 hover:text-white rounded-xl hover:bg-slate-800 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {!isEditingInModal ? (
              /* Widok podglądu dnia */
              <>
                <div className="bg-[#070B12] p-3.5 rounded-2xl border border-slate-800/80 space-y-2.5">
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-slate-400 font-medium">Typ dnia:</span>
                    <span className="text-xs font-bold text-white">
                      {selectedDayPreview.plan.dayType === 'WORKOUT'
                        ? 'Trening siłowy'
                        : selectedDayPreview.plan.dayType === 'REST'
                        ? 'Dzień wolny (Regeneracja)'
                        : 'Brak planu'}
                    </span>
                  </div>

                  {selectedDayPreview.plan.dayType === 'WORKOUT' && (
                    <>
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-slate-400 font-medium">Nazwa:</span>
                        <span className="text-xs font-extrabold text-[#00F59B]">
                          {selectedDayPreview.plan.workoutName || 'Trening'}
                        </span>
                      </div>

                      {selectedDayPreview.plan.exercises && selectedDayPreview.plan.exercises.length > 0 && (
                        <div className="pt-2 border-t border-slate-800/80">
                          <span className="text-[11px] font-bold text-slate-400 block mb-1.5">
                            Zaplanowane ćwiczenia ({selectedDayPreview.plan.exercises.length}):
                          </span>
                          <ul className="text-xs text-slate-200 space-y-1">
                            {selectedDayPreview.plan.exercises.map((ex) => (
                              <li key={ex.id} className="flex items-center gap-2">
                                <span className="w-1.5 h-1.5 rounded-full bg-[#00F59B]" />
                                <span className="truncate">{ex.name}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </>
                  )}

                  <div className="flex items-center justify-between pt-2 border-t border-slate-800/80">
                    <span className="text-xs text-slate-400 font-medium">Status ręczny:</span>
                    {renderStatusBadge(
                      selectedDayPreview.plan.dayType,
                      selectedDayPreview.plan.manualStatus,
                      selectedDayPreview.isToday
                    )}
                  </div>
                </div>

                {/* Przyciski akcji */}
                <div className="space-y-2 pt-1">
                  {selectedDayPreview.plan.dayType === 'WORKOUT' && (
                    <button
                      type="button"
                      onClick={() => {
                        setSelectedDayPreview(null);
                        onStartWorkout();
                      }}
                      className="w-full flex items-center justify-center gap-2 py-3 rounded-2xl bg-gradient-to-r from-[#00F59B] to-[#06D6A0] text-[#06090E] font-extrabold text-xs shadow-md neon-glow-btn transition-colors"
                    >
                      <Play className="w-4 h-4 fill-current stroke-[3]" />
                      <span>
                        {selectedDayPreview.isToday
                          ? activeSessionRunning
                            ? 'Wróć do aktywnego treningu'
                            : 'Rozpocznij ten trening'
                          : 'Przejdź do treningu'}
                      </span>
                    </button>
                  )}

                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => startDayEditFromPreview(selectedDayPreview)}
                      className="flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-2xl bg-[#142334] hover:bg-[#1A2E44] text-[#00F59B] font-bold text-xs transition-colors border border-[#00F59B]/30"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                      <span>Szybka edycja</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setSelectedDayPreview(null);
                        onNavigateToPlans();
                      }}
                      className="flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-2xl bg-[#162232] hover:bg-[#1E2D42] text-slate-200 font-bold text-xs transition-colors border border-slate-700/50"
                    >
                      <ExternalLink className="w-3.5 h-3.5 text-slate-400" />
                      <span>Otwórz w Planach</span>
                    </button>
                  </div>
                </div>
              </>
            ) : (
              /* Inline edycja dnia */
              <div className="space-y-3.5">
                <div>
                  <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                    Typ dnia
                  </label>
                  <div className="grid grid-cols-3 gap-1.5">
                    {(
                      [
                        { type: 'WORKOUT', label: 'Trening' },
                        { type: 'REST', label: 'Wolne' },
                        { type: 'EMPTY', label: 'Brak' },
                      ] as const
                    ).map((t) => (
                      <button
                        key={t.type}
                        type="button"
                        onClick={() => setEditDayType(t.type)}
                        className={`py-2 rounded-xl text-xs font-bold border transition-all ${
                          editDayType === t.type
                            ? 'bg-emerald-500/20 border-[#00F59B] text-[#00F59B]'
                            : 'bg-slate-800/40 border-slate-700/60 text-slate-400'
                        }`}
                      >
                        {t.label}
                      </button>
                    ))}
                  </div>
                </div>

                {editDayType === 'WORKOUT' && (
                  <div>
                    <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1">
                      Nazwa treningu
                    </label>
                    <input
                      type="text"
                      value={editWorkoutName}
                      onChange={(e) => setEditWorkoutName(e.target.value)}
                      placeholder="Wpisz nazwę treningu..."
                      className="w-full bg-[#070A0F] border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-[#00F59B]"
                    />
                  </div>
                )}

                <div>
                  <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                    Status ręczny
                  </label>
                  <div className="grid grid-cols-3 gap-1.5">
                    {(
                      [
                        { st: 'UNRESOLVED', label: 'Zaplanowany' },
                        { st: 'COMPLETED', label: 'Wykonany' },
                        { st: 'NOT_COMPLETED', label: 'Niewykonany' },
                      ] as const
                    ).map((item) => (
                      <button
                        key={item.st}
                        type="button"
                        onClick={() => {
                          setEditManualStatus(item.st);
                          setWarningInModal(
                            item.st === 'COMPLETED' && !selectedDayPreview.plan.hasRecordedSession
                          );
                        }}
                        className={`py-2 rounded-xl text-xs font-bold border transition-all ${
                          editManualStatus === item.st
                            ? item.st === 'COMPLETED'
                              ? 'bg-emerald-500/20 border-[#00F59B] text-[#00F59B]'
                              : item.st === 'NOT_COMPLETED'
                              ? 'bg-rose-500/20 border-rose-500 text-rose-300'
                              : 'bg-amber-500/20 border-amber-400 text-amber-300'
                            : 'bg-slate-800/40 border-slate-700/60 text-slate-400'
                        }`}
                      >
                        {item.label}
                      </button>
                    ))}
                  </div>
                </div>

                {warningInModal && (
                  <div className="p-2.5 rounded-xl bg-amber-950/70 border border-amber-500/40 text-[11px] text-amber-200 leading-snug">
                    <span className="font-bold text-amber-300">Ostrzeżenie: </span>
                    Status oznaczony jako wykonany bez powiązanej sesji treningowej.
                  </div>
                )}

                <div className="flex gap-2 pt-2 border-t border-slate-800">
                  <button
                    type="button"
                    onClick={() => setIsEditingInModal(false)}
                    className="flex-1 py-2.5 rounded-xl border border-slate-700 text-slate-300 text-xs font-bold hover:bg-slate-800"
                  >
                    Wróć
                  </button>
                  <button
                    type="button"
                    onClick={handleSaveModalEdit}
                    className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-[#00F59B] to-[#06D6A0] text-[#06090E] text-xs font-extrabold neon-glow-btn"
                  >
                    Zapisz
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
