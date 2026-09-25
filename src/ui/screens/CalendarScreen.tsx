import React, { useState } from 'react';
import {
  ChevronLeft,
  ChevronRight,
  Plus,
  Dumbbell,
  Pill,
  FileText,
  Trash2,
  AlertCircle,
  X,
  Clock,
  Calendar as CalendarIcon,
  Sparkles,
  CalendarPlus,
  Edit3,
  Tag,
  Trophy,
  HeartPulse,
  Utensils,
  Bookmark,
  Settings as SettingsIcon,
} from 'lucide-react';
import { useCalendarViewModel } from '../../viewmodel/useCalendarViewModel';
import { CalendarEvent, EventCategory } from '../../domain/types';

interface CalendarScreenProps {
  onOpenSettings?: () => void;
}

export const CalendarScreen: React.FC<CalendarScreenProps> = ({ onOpenSettings }) => {
  const {
    selectedDate,
    setSelectedDate,
    currentYear,
    currentMonth,
    prevMonth,
    nextMonth,
    getDaysInMonth,
    dayPlan,
    daySubstances,
    dayNotes,
    dayEvents,
    isAddNoteModalOpen,
    setIsAddNoteModalOpen,
    noteContent,
    setNoteContent,
    handleAddNote,
    handleDeleteNote,
    isAddSubstanceModalOpen,
    setIsAddSubstanceModalOpen,
    substanceName,
    setSubstanceName,
    substanceTime,
    setSubstanceTime,
    substanceDetails,
    setSubstanceDetails,
    handleAddSubstance,
    handleDeleteSubstance,
    // Events
    isAddEventModalOpen,
    setIsAddEventModalOpen,
    editingEvent,
    eventTitle,
    setEventTitle,
    eventTime,
    setEventTime,
    eventCategory,
    setEventCategory,
    eventDescription,
    setEventDescription,
    openAddEventModal,
    openEditEventModal,
    handleSaveEvent,
    handleDeleteEvent,
  } = useCalendarViewModel();

  const monthNames = [
    'Styczeń',
    'Luty',
    'Marzec',
    'Kwiecień',
    'Maj',
    'Czerwiec',
    'Lipiec',
    'Sierpień',
    'Wrzesień',
    'Październik',
    'Listopad',
    'Grudzień',
  ];

  const { startingOffset, days } = getDaysInMonth();

  // Active sub-tab in details: All / Events / Workouts / Substances / Notes
  const [filterType, setFilterType] = useState<'all' | 'events' | 'workout' | 'substances' | 'notes'>('all');

  const getCategoryBadge = (cat: EventCategory) => {
    switch (cat) {
      case 'TRENING':
        return {
          label: 'Trening',
          bg: 'bg-emerald-950/70 border-emerald-500/40 text-[#00F59B]',
          icon: Dumbbell,
        };
      case 'ZDROWIE':
        return {
          label: 'Zdrowie',
          bg: 'bg-sky-950/70 border-sky-500/40 text-sky-400',
          icon: HeartPulse,
        };
      case 'ZAWODY':
        return {
          label: 'Zawody',
          bg: 'bg-amber-950/70 border-amber-500/40 text-amber-400',
          icon: Trophy,
        };
      case 'DIETA':
        return {
          label: 'Dieta',
          bg: 'bg-rose-950/70 border-rose-500/40 text-rose-400',
          icon: Utensils,
        };
      case 'INNE':
      default:
        return {
          label: 'Inne',
          bg: 'bg-purple-950/70 border-purple-500/40 text-purple-400',
          icon: Bookmark,
        };
    }
  };

  return (
    <div className="flex-1 overflow-y-auto px-4 py-3.5 space-y-4 pb-20 select-none">
      {/* 1. Screen Title */}
      <div className="flex items-center justify-between pt-1">
        <div>
          <h1 className="text-xl font-extrabold tracking-tight text-white flex items-center gap-2">
            Kalendarz
          </h1>
          <p className="text-[11px] font-medium text-slate-400">
            Wydarzenia · Treningi · Rejestr · Notatki
          </p>
        </div>

        {/* Quick Add Actions */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-0.5">
          <button
            type="button"
            onClick={openAddEventModal}
            className="flex items-center gap-1 px-2.5 py-1.5 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 rounded-xl text-xs font-black transition-all shadow-md active:scale-95"
            title="Dodaj wydarzenie"
          >
            <CalendarPlus className="w-3.5 h-3.5 stroke-[2.5]" />
            <span>+ Wydarzenie</span>
          </button>
          <button
            type="button"
            onClick={() => setIsAddSubstanceModalOpen(true)}
            className="flex items-center gap-1 px-2 py-1.5 bg-cyan-950/70 hover:bg-cyan-900/80 border border-cyan-500/40 text-cyan-300 rounded-xl text-xs font-bold transition-all shadow-sm active:scale-95"
            title="Dodaj substancję"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Substancja</span>
          </button>
          <button
            type="button"
            onClick={() => setIsAddNoteModalOpen(true)}
            className="flex items-center gap-1 px-2 py-1.5 bg-purple-950/70 hover:bg-purple-900/80 border border-purple-500/40 text-purple-300 rounded-xl text-xs font-bold transition-all shadow-sm active:scale-95"
            title="Dodaj notatkę"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Notatka</span>
          </button>
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
      </div>

      {/* 2. Month Navigator Card */}
      <div className="glass-card p-4 rounded-3xl border border-white/5 space-y-3 shadow-xl">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-extrabold text-white tracking-wide flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#00F59B]" />
            {monthNames[currentMonth]} {currentYear}
          </h2>
          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={prevMonth}
              className="p-1.5 rounded-xl text-slate-300 hover:text-white hover:bg-slate-800 transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={nextMonth}
              className="p-1.5 rounded-xl text-slate-300 hover:text-white hover:bg-slate-800 transition-colors"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Days of week header */}
        <div className="grid grid-cols-7 gap-1 text-center text-[10px] font-extrabold text-slate-400 uppercase py-1">
          <span>Pn</span>
          <span>Wt</span>
          <span>Śr</span>
          <span>Cz</span>
          <span>Pt</span>
          <span>So</span>
          <span>Nd</span>
        </div>

        {/* Calendar Grid */}
        <div className="grid grid-cols-7 gap-1.5">
          {/* Empty offset days */}
          {Array.from({ length: startingOffset }).map((_, i) => (
            <div key={`offset_${i}`} className="h-12 rounded-xl bg-transparent" />
          ))}

          {/* Month Days */}
          {days.map((d) => {
            const isSelected = d.dateStr === selectedDate;
            const isToday = d.dateStr === new Date().toISOString().split('T')[0];

            return (
              <button
                key={d.dateStr}
                type="button"
                onClick={() => setSelectedDate(d.dateStr)}
                className={`h-12 rounded-xl flex flex-col items-center justify-between p-1 border transition-all ${
                  isSelected
                    ? 'bg-gradient-to-b from-[#162738] to-[#101D2B] border-[#00F59B] text-white font-extrabold shadow-[0_0_12px_rgba(0,245,155,0.25)] ring-1 ring-[#00F59B]/50'
                    : isToday
                    ? 'bg-[#121B27] border-slate-700 text-[#00F59B]'
                    : 'bg-[#090D14] border-slate-800/80 text-slate-300 hover:border-slate-700'
                }`}
              >
                <span className="text-[11px] font-mono leading-none mt-0.5">{d.dayNumber}</span>
                {/* Dots indicator for types of items */}
                <div className="flex items-center gap-0.5 mb-0.5 flex-wrap justify-center">
                  {d.hasEvent && (
                    <span
                      className="w-1.5 h-1.5 rounded-full bg-amber-400 shadow-[0_0_5px_#F59E0B]"
                      title="Wydarzenie"
                    />
                  )}
                  {d.hasWorkout && (
                    <span
                      className={`w-1.5 h-1.5 rounded-full ${
                        d.workoutStatus === 'COMPLETED'
                          ? 'bg-[#00F59B] shadow-[0_0_5px_#00F59B]'
                          : 'bg-emerald-400'
                      }`}
                      title="Trening"
                    />
                  )}
                  {d.hasSubstance && (
                    <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 shadow-[0_0_5px_#06B6D4]" title="Substancja" />
                  )}
                  {d.hasNote && (
                    <span className="w-1.5 h-1.5 rounded-full bg-purple-400 shadow-[0_0_5px_#A855F7]" title="Notatka" />
                  )}
                </div>
              </button>
            );
          })}
        </div>

        {/* Legend */}
        <div className="flex items-center justify-around pt-2 border-t border-slate-800/60 text-[10px] text-slate-400">
          <div className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-amber-400" />
            <span>Wydarzenie</span>
          </div>
          <div className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-[#00F59B]" />
            <span>Trening</span>
          </div>
          <div className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-cyan-400" />
            <span>Substancja</span>
          </div>
          <div className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-purple-400" />
            <span>Notatka</span>
          </div>
        </div>
      </div>

      {/* 3. Selected Day Details Section */}
      <div className="glass-card p-4 rounded-3xl border border-white/5 space-y-4 shadow-xl">
        {/* Details Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-3 flex-wrap gap-2">
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-sm font-extrabold text-white">
                Szczegóły: {selectedDate}
              </h2>
              <button
                type="button"
                onClick={openAddEventModal}
                className="px-2 py-0.5 rounded-lg bg-amber-500/20 text-amber-300 border border-amber-500/30 text-[10px] font-bold hover:bg-amber-500/30 flex items-center gap-1"
              >
                <Plus className="w-3 h-3" />
                <span>Wydarzenie</span>
              </button>
            </div>
            <p className="text-[11px] text-slate-400">
              Wpisy zarejestrowane dla wybranego dnia
            </p>
          </div>

          {/* Filter Pills */}
          <div className="flex gap-1 text-[10px] overflow-x-auto">
            {(['all', 'events', 'workout', 'substances', 'notes'] as const).map((mode) => (
              <button
                key={mode}
                type="button"
                onClick={() => setFilterType(mode)}
                className={`px-2 py-1 rounded-lg font-bold transition-all whitespace-nowrap ${
                  filterType === mode
                    ? 'bg-slate-200 text-slate-950 font-extrabold'
                    : 'bg-slate-800/80 text-slate-400 hover:text-white'
                }`}
              >
                {mode === 'all'
                  ? 'Wszystko'
                  : mode === 'events'
                  ? `Wydarzenia (${dayEvents.length})`
                  : mode === 'workout'
                  ? 'Trening'
                  : mode === 'substances'
                  ? `Subst. (${daySubstances.length})`
                  : `Notatki (${dayNotes.length})`}
              </button>
            ))}
          </div>
        </div>

        {/* Entries List */}
        <div className="space-y-2.5">
          {/* 1. Events Entries */}
          {(filterType === 'all' || filterType === 'events') &&
            dayEvents.map((ev) => {
              const badge = getCategoryBadge(ev.category);
              const IconComp = badge.icon;

              return (
                <div
                  key={ev.id}
                  className="p-3.5 rounded-2xl bg-[#090E16] border border-amber-500/40 shadow-[0_0_15px_rgba(245,158,11,0.1)] flex items-start justify-between gap-3 hover:border-amber-400 transition-all"
                >
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-xl bg-amber-500/15 text-amber-400 border border-amber-500/30 flex items-center justify-center shrink-0 mt-0.5">
                      <IconComp className="w-4 h-4" />
                    </div>
                    <div className="space-y-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <h4 className="text-xs font-black text-white">{ev.title}</h4>
                        <span className={`text-[9px] font-bold px-1.5 py-0.2 rounded-md border ${badge.bg}`}>
                          {badge.label}
                        </span>
                        {ev.time && (
                          <span className="text-[10px] font-mono font-bold text-amber-300 bg-amber-950/60 px-1.5 py-0.2 rounded border border-amber-500/20 flex items-center gap-1">
                            <Clock className="w-2.5 h-2.5" />
                            {ev.time}
                          </span>
                        )}
                      </div>
                      {ev.description && (
                        <p className="text-xs text-slate-300 leading-relaxed whitespace-pre-wrap">
                          {ev.description}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-1 shrink-0">
                    <button
                      type="button"
                      onClick={() => openEditEventModal(ev)}
                      className="text-slate-400 hover:text-amber-300 p-1.5 rounded-lg transition-colors bg-slate-800/60"
                      title="Edytuj wydarzenie"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDeleteEvent(ev.id)}
                      className="text-slate-500 hover:text-rose-400 p-1.5 rounded-lg transition-colors bg-rose-950/30"
                      title="Usuń wydarzenie"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              );
            })}

          {/* 2. Workout Entry */}
          {(filterType === 'all' || filterType === 'workout') && dayPlan && dayPlan.dayType === 'WORKOUT' && (
            <div className="p-3.5 rounded-2xl bg-[#090E16] border border-[#00F59B]/40 shadow-[0_0_15px_rgba(0,245,155,0.08)] flex items-start gap-3">
              <div className="w-8 h-8 rounded-xl bg-emerald-500/15 text-[#00F59B] border border-emerald-500/30 flex items-center justify-center shrink-0 mt-0.5">
                <Dumbbell className="w-4 h-4" />
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-extrabold text-white">
                    {dayPlan.workoutName || 'Trening siłowy'}
                  </h4>
                  <span
                    className={`text-[9px] font-extrabold px-2 py-0.5 rounded-full ${
                      dayPlan.manualStatus === 'COMPLETED'
                        ? 'bg-emerald-950 text-[#00F59B] border border-[#00F59B]/40'
                        : 'bg-amber-950 text-amber-400 border border-amber-500/40'
                    }`}
                  >
                    {dayPlan.manualStatus === 'COMPLETED' ? 'WYKONANY ✓' : 'ZAPLANOWANY'}
                  </span>
                </div>
                {dayPlan.exercises && dayPlan.exercises.length > 0 && (
                  <p className="text-[11px] text-slate-400 mt-1">
                    Ćwiczenia: {dayPlan.exercises.map((e) => e.name).join(', ')}
                  </p>
                )}
              </div>
            </div>
          )}

          {/* 3. Substances Entries */}
          {(filterType === 'all' || filterType === 'substances') &&
            daySubstances.map((sub) => (
              <div
                key={sub.id}
                className="p-3.5 rounded-2xl bg-[#090E16] border border-cyan-500/35 flex items-start justify-between gap-3"
              >
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-xl bg-cyan-500/15 text-cyan-400 border border-cyan-500/30 flex items-center justify-center shrink-0 mt-0.5">
                    <Pill className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="text-xs font-bold text-white">{sub.name}</h4>
                      <span className="text-[10px] font-mono font-bold text-cyan-400 bg-cyan-950/60 px-1.5 py-0.2 rounded border border-cyan-500/20">
                        {sub.time}
                      </span>
                    </div>
                    {sub.details && (
                      <p className="text-xs text-slate-300 mt-1 leading-relaxed">{sub.details}</p>
                    )}
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => handleDeleteSubstance(sub.id)}
                  className="text-slate-500 hover:text-rose-400 p-1.5 rounded-lg transition-colors"
                  title="Usuń wpis"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}

          {/* 4. Notes Entries */}
          {(filterType === 'all' || filterType === 'notes') &&
            dayNotes.map((note) => (
              <div
                key={note.id}
                className="p-3.5 rounded-2xl bg-[#090E16] border border-purple-500/35 flex items-start justify-between gap-3"
              >
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-xl bg-purple-500/15 text-purple-400 border border-purple-500/30 flex items-center justify-center shrink-0 mt-0.5">
                    <FileText className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="text-[11px] font-bold text-slate-400">
                        Notatka · {note.createdAt}
                      </h4>
                    </div>
                    <p className="text-xs text-slate-200 mt-1 whitespace-pre-wrap leading-relaxed">
                      {note.content}
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => handleDeleteNote(note.id)}
                  className="text-slate-500 hover:text-rose-400 p-1.5 rounded-lg transition-colors"
                  title="Usuń notatkę"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}

          {/* Empty state if nothing on this day */}
          {dayEvents.length === 0 &&
            (!dayPlan || dayPlan.dayType !== 'WORKOUT') &&
            daySubstances.length === 0 &&
            dayNotes.length === 0 && (
              <div className="p-6 text-center rounded-2xl bg-[#080C14] border border-slate-800/60 text-slate-400">
                <CalendarIcon className="w-6 h-6 mx-auto mb-2 opacity-30 text-[#00F59B]" />
                <p className="text-xs font-medium">Brak zarejestrowanych wydarzeń w tym dniu.</p>
                <p className="text-[11px] text-slate-500 mt-1">
                  Użyj przycisku „+ Wydarzenie” lub dodaj substancję / notatkę.
                </p>
              </div>
            )}
        </div>

        {/* Health / Legal Disclaimer */}
        <div className="p-3 rounded-2xl bg-[#060A10] border border-slate-800/80 flex items-start gap-2 text-[11px] text-slate-400 leading-relaxed">
          <AlertCircle className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
          <span>
            Aplikacja służy wyłącznie do rejestrowania wpisów i organizacji grafiku treningowego.
          </span>
        </div>
      </div>

      {/* Modal: Dodaj / Edytuj Wydarzenie */}
      {isAddEventModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md select-none">
          <div className="w-full max-w-md glass-card border border-amber-500/40 rounded-3xl p-5 shadow-2xl space-y-4 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div>
                <span className="text-[10px] font-extrabold uppercase tracking-wider text-amber-400">
                  {editingEvent ? 'EDYCJA WYDARZENIA' : 'NOWE WYDARZENIE'}
                </span>
                <h3 className="text-base font-extrabold text-white">
                  {editingEvent ? 'Edytuj wpis w kalendarzu' : 'Dodaj wydarzenie do kalendarza'}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setIsAddEventModalOpen(false)}
                className="text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3">
              {/* Tytuł wydarzenia */}
              <div>
                <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                  Nazwa wydarzenia *
                </label>
                <input
                  type="text"
                  value={eventTitle}
                  onChange={(e) => setEventTitle(e.target.value)}
                  placeholder="np. Konsultacja z trenerem, Zawody, Badania krwi..."
                  className="w-full bg-[#070A0F] border border-slate-700/80 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-amber-400"
                  autoFocus
                />
              </div>

              {/* Kategoria wydarzenia */}
              <div>
                <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                  Kategoria
                </label>
                <div className="grid grid-cols-3 gap-1.5">
                  {(
                    [
                      { key: 'TRENING', label: 'Trening' },
                      { key: 'ZDROWIE', label: 'Zdrowie' },
                      { key: 'ZAWODY', label: 'Zawody' },
                      { key: 'DIETA', label: 'Dieta' },
                      { key: 'INNE', label: 'Inne' },
                    ] as const
                  ).map((item) => (
                    <button
                      key={item.key}
                      type="button"
                      onClick={() => setEventCategory(item.key)}
                      className={`py-2 px-2 rounded-xl text-xs font-extrabold transition-all border ${
                        eventCategory === item.key
                          ? 'bg-amber-500/25 border-amber-400 text-amber-300'
                          : 'bg-[#070A0F] border-slate-700 text-slate-400 hover:text-white'
                      }`}
                    >
                      {item.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Godzina */}
              <div>
                <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                  Godzina (opcjonalnie)
                </label>
                <div className="relative">
                  <Clock className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
                  <input
                    type="time"
                    value={eventTime}
                    onChange={(e) => setEventTime(e.target.value)}
                    className="w-full bg-[#070A0F] border border-slate-700/80 rounded-xl pl-9 pr-3 py-2 text-sm text-white focus:outline-none focus:border-amber-400"
                  />
                </div>
              </div>

              {/* Opis / Szczegóły */}
              <div>
                <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                  Szczegóły / Notatki ({selectedDate})
                </label>
                <textarea
                  rows={3}
                  value={eventDescription}
                  onChange={(e) => setEventDescription(e.target.value)}
                  placeholder="np. Miejsce spotkania, przygotowanie, cel sprawdzianu..."
                  className="w-full bg-[#070A0F] border border-slate-700/80 rounded-xl p-3 text-sm text-white focus:outline-none focus:border-amber-400"
                />
              </div>
            </div>

            <div className="flex gap-2 pt-2">
              <button
                type="button"
                onClick={() => setIsAddEventModalOpen(false)}
                className="flex-1 py-2.5 rounded-xl border border-slate-700 text-slate-300 text-xs font-bold hover:bg-slate-800"
              >
                Anuluj
              </button>
              <button
                type="button"
                onClick={handleSaveEvent}
                className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-black text-xs shadow-md transition-all active:scale-95"
              >
                {editingEvent ? 'Zapisz zmiany' : 'Dodaj wydarzenie'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal: Dodaj notatkę */}
      {isAddNoteModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md select-none">
          <div className="w-full max-w-md glass-card border border-purple-500/40 rounded-3xl p-5 shadow-2xl space-y-4 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-base font-extrabold text-white">Dodaj notatkę do dnia</h3>
              <button
                type="button"
                onClick={() => setIsAddNoteModalOpen(false)}
                className="text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                Treść notatki ({selectedDate})
              </label>
              <textarea
                rows={4}
                value={noteContent}
                onChange={(e) => setNoteContent(e.target.value)}
                placeholder="np. Wskazówki techniczne, samopoczucie, regeneracja..."
                className="w-full bg-[#070A0F] border border-slate-700/80 rounded-xl p-3 text-sm text-white focus:outline-none focus:border-purple-500"
                autoFocus
              />
            </div>

            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setIsAddNoteModalOpen(false)}
                className="flex-1 py-2.5 rounded-xl border border-slate-700 text-slate-300 text-xs font-bold hover:bg-slate-800"
              >
                Anuluj
              </button>
              <button
                type="button"
                onClick={handleAddNote}
                className="flex-1 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-extrabold text-xs shadow-md transition-colors"
              >
                Zapisz notatkę
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal: Dodaj substancję */}
      {isAddSubstanceModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md select-none">
          <div className="w-full max-w-md glass-card border border-cyan-500/40 rounded-3xl p-5 shadow-2xl space-y-4 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div>
                <h3 className="text-base font-extrabold text-white">Wpis dotyczący substancji</h3>
                <p className="text-xs text-slate-400">Rejestr osobisty · {selectedDate}</p>
              </div>
              <button
                type="button"
                onClick={() => setIsAddSubstanceModalOpen(false)}
                className="text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Nazwa substancji */}
            <div>
              <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                Nazwa substancji *
              </label>
              <input
                type="text"
                value={substanceName}
                onChange={(e) => setSubstanceName(e.target.value)}
                placeholder="np. Kreatyna monohydrat, Omega-3, Wit. D3..."
                className="w-full bg-[#070A0F] border border-slate-700/80 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-cyan-500"
                autoFocus
              />
            </div>

            {/* Godzina */}
            <div>
              <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                Godzina
              </label>
              <div className="relative">
                <Clock className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
                <input
                  type="time"
                  value={substanceTime}
                  onChange={(e) => setSubstanceTime(e.target.value)}
                  className="w-full bg-[#070A0F] border border-slate-700/80 rounded-xl pl-9 pr-3 py-2 text-sm text-white focus:outline-none focus:border-cyan-500"
                />
              </div>
            </div>

            {/* Ręcznie wprowadzona informacja */}
            <div>
              <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                Ręcznie wprowadzona informacja
              </label>
              <input
                type="text"
                value={substanceDetails}
                onChange={(e) => setSubstanceDetails(e.target.value)}
                placeholder="np. 5g po posiłku, 2 kapsułki..."
                className="w-full bg-[#070A0F] border border-slate-700/80 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-cyan-500"
              />
            </div>

            {/* Mandatory Disclaimer */}
            <div className="p-2.5 rounded-2xl bg-[#060A10] border border-slate-800 text-[11px] text-slate-400 leading-tight">
              ⚠️ Aplikacja służy wyłącznie do rejestrowania wpisów — nie rekomenduje dawek ani schematów stosowania.
            </div>

            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setIsAddSubstanceModalOpen(false)}
                className="flex-1 py-2.5 rounded-xl border border-slate-700 text-slate-300 text-xs font-bold hover:bg-slate-800"
              >
                Anuluj
              </button>
              <button
                type="button"
                onClick={handleAddSubstance}
                className="flex-1 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-[#06090E] font-extrabold text-xs shadow-md transition-colors"
              >
                Zapisz wpis
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
