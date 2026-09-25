import React, { useState } from 'react';
import {
  Search,
  Plus,
  Dumbbell,
  BookOpen,
  CalendarPlus,
  Edit3,
  Trash2,
  X,
  CheckCircle2,
  Info,
  Flame,
  Check,
  ChevronRight,
  SlidersHorizontal,
  RotateCcw,
  Zap,
  Layers,
  HeartPulse,
  Shield,
  Activity,
  Target,
  Sparkles,
} from 'lucide-react';
import { useCatalogViewModel, CATALOG_CATEGORIES } from '../../viewmodel/useCatalogViewModel';
import { ExerciseCategory, ExerciseDefinition } from '../../domain/types';

export const CatalogScreen: React.FC = () => {
  const {
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
  } = useCatalogViewModel();

  const getCategoryMeta = (cat: string) => {
    switch (cat) {
      case 'Klata':
      case 'Klatka piersiowa':
        return { icon: HeartPulse, color: 'text-emerald-400', bg: 'bg-emerald-950/70 border-emerald-500/40' };
      case 'Plecy':
        return { icon: Layers, color: 'text-sky-400', bg: 'bg-sky-950/70 border-sky-500/40' };
      case 'Barki':
        return { icon: Shield, color: 'text-purple-400', bg: 'bg-purple-950/70 border-purple-500/40' };
      case 'Biceps':
        return { icon: Zap, color: 'text-amber-400', bg: 'bg-amber-950/70 border-amber-500/40' };
      case 'Triceps':
        return { icon: Flame, color: 'text-rose-400', bg: 'bg-rose-950/70 border-rose-500/40' };
      case 'Nogi':
        return { icon: Activity, color: 'text-teal-400', bg: 'bg-teal-950/70 border-teal-500/40' };
      default:
        return { icon: Dumbbell, color: 'text-[#00F59B]', bg: 'bg-emerald-950/70 border-[#00F59B]/40' };
    }
  };

  // Form state for creating / editing any exercise
  const [formName, setFormName] = useState<string>('');
  const [formCategory, setFormCategory] = useState<ExerciseCategory>('Klatka piersiowa');
  const [formEquipment, setFormEquipment] = useState<string>('Sztanga');
  const [formTechnique, setFormTechnique] = useState<string>('');
  const [formSets, setFormSets] = useState<number>(3);
  const [formReps, setFormReps] = useState<string>('8-10');
  const [formRpe, setFormRpe] = useState<string>('8');
  const [formNotes, setFormNotes] = useState<string>('');

  // Confirmation dialog for deletion
  const [deleteCandidate, setDeleteCandidate] = useState<ExerciseDefinition | null>(null);

  const openCreateModal = () => {
    setFormName('');
    setFormCategory('Klatka piersiowa');
    setFormEquipment('Sztanga');
    setFormTechnique('');
    setFormSets(3);
    setFormReps('8-10');
    setFormRpe('8');
    setFormNotes('');
    setIsAddCustomOpen(true);
  };

  const openEditModal = (ex: ExerciseDefinition) => {
    setFormName(ex.name);
    setFormCategory(ex.category);
    setFormEquipment(ex.equipment || 'Sztanga');
    setFormTechnique(ex.technique || '');
    setFormSets(ex.defaultSets || 3);
    setFormReps(ex.defaultReps ? String(ex.defaultReps) : '8-10');
    setFormRpe(ex.defaultRpe ? String(ex.defaultRpe) : '8');
    setFormNotes(ex.notes || '');
    setEditingExercise(ex);
  };

  const selectedTargetWeek = cycleData.weeks.find((w) => w.id === targetWeekId);

  return (
    <div className="flex-1 overflow-y-auto px-4 py-3.5 space-y-4 pb-16 select-none relative">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-14 left-1/2 -translate-x-1/2 z-50 px-4 py-2.5 rounded-2xl bg-emerald-950/95 border border-[#00F59B] text-[#00F59B] text-xs font-bold shadow-[0_0_20px_rgba(0,245,155,0.4)] flex items-center gap-2 animate-in fade-in slide-in-from-top-4 duration-200 max-w-[90%] text-center">
          <CheckCircle2 className="w-4 h-4 shrink-0 stroke-[2.5]" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* 1. TOP HEADER */}
      <section aria-labelledby="catalog-title" className="space-y-2 pt-1">
        <div className="glass-card p-3.5 rounded-3xl border border-white/10 relative overflow-hidden">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-1.5 mb-0.5">
                <span className="w-2 h-2 rounded-full bg-[#00F59B] shadow-[0_0_6px_#00F59B]" />
                <span className="text-[10px] font-extrabold uppercase tracking-wider text-[#00F59B]">
                  BAZA WIEDZY & WZORCE TECHNIKI
                </span>
              </div>
              <h1 id="catalog-title" className="text-xl font-extrabold text-white tracking-tight">
                Katalog ćwiczeń
              </h1>
              <p className="text-[11px] text-slate-400 font-medium">
                Partie: Klata · Biceps · Triceps · Barki · Plecy · Nogi
              </p>
            </div>

            <button
              type="button"
              onClick={openCreateModal}
              className="flex items-center gap-1.5 px-3 py-2 rounded-2xl bg-gradient-to-r from-[#00F59B] to-[#06D6A0] text-[#06090E] font-extrabold text-xs shadow-md neon-glow-btn transition-all active:scale-95 shrink-0"
              title="Dodaj własne ćwiczenie do bazy"
            >
              <Plus className="w-3.5 h-3.5 stroke-[3]" />
              <span>+ Własne ćwiczenie</span>
            </button>
          </div>

          {/* Wyszukiwarka */}
          <div className="relative mt-3">
            <Search className="w-4 h-4 absolute left-3.5 top-3 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Szukaj po nazwie, sprzęcie lub technice..."
              className="w-full bg-[#070A0F] border border-slate-700/80 rounded-2xl pl-10 pr-9 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-[#00F59B] transition-colors"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-2.5 text-slate-400 hover:text-white p-0.5"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      </section>

      {/* 2. POZIOMY WYBÓR PARTII MIĘŚNIOWYCH (Klata, Biceps, Triceps, Barki, Plecy, Nogi) */}
      <section aria-label="Wybór partii mięśniowej" className="space-y-1.5">
        <div className="flex items-center justify-between px-1">
          <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400">
            Partia mięśniowa:
          </span>
          <span className="text-[11px] font-mono font-bold text-[#00F59B]">
            {filteredExercises.length} {filteredExercises.length === 1 ? 'ćwiczenie' : 'ćwiczeń'}
          </span>
        </div>

        <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
          {CATALOG_CATEGORIES.map((cat) => {
            const isSelected = selectedCategory === cat.id;
            const count = categoryCounts[cat.id] || 0;
            const catMeta = getCategoryMeta(cat.domainCategory || cat.id);
            const IconComp = cat.id === 'all' ? Layers : catMeta.icon;

            return (
              <button
                key={cat.id}
                type="button"
                onClick={() => setSelectedCategory(cat.id)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-2xl font-extrabold text-xs transition-all shrink-0 border ${
                  isSelected
                    ? 'bg-[#142334] text-[#00F59B] border-[#00F59B] shadow-[0_0_12px_rgba(0,245,155,0.25)] ring-1 ring-[#00F59B]/50'
                    : 'bg-[#0E1520] hover:bg-[#131D2B] text-slate-300 border-[#1B2738]'
                }`}
              >
                <IconComp className={`w-3.5 h-3.5 ${isSelected ? 'text-[#00F59B]' : catMeta.color}`} />
                <span>{cat.label}</span>
                <span
                  className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono font-bold ${
                    isSelected ? 'bg-[#00F59B] text-[#06090E]' : 'bg-slate-800 text-slate-400'
                  }`}
                >
                  {count}
                </span>
              </button>
            );
          })}
        </div>
      </section>

      {/* 3. LISTA KART ĆWICZEŃ */}
      <section aria-label="Lista ćwiczeń" className="space-y-3">
        {filteredExercises.length === 0 ? (
          <div className="p-8 text-center rounded-3xl bg-[#0E1520] border border-slate-800 space-y-3">
            <Dumbbell className="w-10 h-10 text-slate-600 mx-auto" />
            <h3 className="text-sm font-bold text-white">Nie znaleziono ćwiczeń</h3>
            <p className="text-xs text-slate-400 max-w-xs mx-auto">
              Brak wyników dla wybranej partii lub wyszukiwanego hasła. Możesz dodać własne ćwiczenie.
            </p>
            <button
              type="button"
              onClick={openCreateModal}
              className="px-4 py-2.5 rounded-2xl bg-gradient-to-r from-[#00F59B] to-[#06D6A0] text-[#06090E] font-extrabold text-xs shadow-md neon-glow-btn"
            >
              + Dodaj własne ćwiczenie
            </button>
          </div>
        ) : (
          filteredExercises.map((exercise) => {
            const meta = getCategoryMeta(exercise.category);
            const CatIcon = meta.icon;

            return (
              <div
                key={exercise.id}
                className="glass-card p-4 rounded-3xl border border-white/5 space-y-3 relative hover:border-[#00F59B]/30 transition-all duration-200"
              >
                {/* Top row: Thumbnail Avatar + Name & Badges + Actions */}
                <div className="flex items-start justify-between gap-2.5">
                  <div className="flex items-start gap-3">
                    {/* Miniaturka partii mięśniowej / kategoria */}
                    <div
                      className={`w-10 h-10 rounded-2xl border flex items-center justify-center shrink-0 shadow-md ${meta.bg}`}
                    >
                      <CatIcon className={`w-5 h-5 ${meta.color}`} />
                    </div>

                    <div className="space-y-1">
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <span className={`text-[10px] font-extrabold px-2 py-0.5 rounded-lg border ${meta.bg} ${meta.color}`}>
                          {exercise.category}
                        </span>
                        {exercise.equipment && (
                          <span className="text-[10px] font-bold text-slate-300 bg-slate-800/90 px-2 py-0.5 rounded-lg border border-slate-700">
                            {exercise.equipment}
                          </span>
                        )}
                        {exercise.isCustom && (
                          <span className="text-[10px] font-extrabold text-amber-300 bg-amber-950/60 px-2 py-0.5 rounded-lg border border-amber-500/30">
                            Własne
                          </span>
                        )}
                      </div>

                      <h3 className="text-base font-extrabold text-white tracking-tight leading-snug">
                        {exercise.name}
                      </h3>
                    </div>
                  </div>

                  {/* Edit & Management Actions */}
                  <div className="flex items-center gap-1.5 shrink-0">
                    <button
                      type="button"
                      onClick={() => openEditModal(exercise)}
                      className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-slate-800/90 text-slate-200 hover:text-[#00F59B] hover:bg-[#142334] border border-slate-700/80 hover:border-[#00F59B]/50 transition-all font-bold text-xs active:scale-95 shadow-sm"
                      title="Edytuj parametry tego ćwiczenia (serie, powtórzenia, opis, sprzęt)"
                    >
                      <Edit3 className="w-3.5 h-3.5 text-[#00F59B]" />
                      <span>Edytuj</span>
                    </button>

                    {exercise.isCustom ? (
                      <button
                        type="button"
                        onClick={() => setDeleteCandidate(exercise)}
                        className="p-1.5 rounded-xl bg-rose-950/40 text-rose-400 hover:text-rose-300 border border-rose-500/30 transition-all"
                        title="Usuń to ćwiczenie z bazy"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    ) : (
                      <button
                        type="button"
                        onClick={() => handleResetExerciseToDefault(exercise.id)}
                        className="p-1.5 rounded-xl bg-slate-800/50 text-slate-400 hover:text-white hover:bg-slate-700 border border-slate-700/40 transition-all"
                        title="Przywróć domyślne parametry wzorca"
                      >
                        <RotateCcw className="w-3 h-3" />
                      </button>
                    )}
                  </div>
                </div>

                {/* Technique Description */}
              {exercise.technique ? (
                <div className="bg-[#070A0F] rounded-2xl p-3 border border-slate-800/70 text-xs text-slate-300 leading-relaxed group">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400">
                      Wskazówki techniczne:
                    </span>
                    <button
                      type="button"
                      onClick={() => openEditModal(exercise)}
                      className="text-[10px] text-slate-400 hover:text-[#00F59B] flex items-center gap-1 font-bold"
                    >
                      <Edit3 className="w-2.5 h-2.5" />
                      <span>Zmień opis</span>
                    </button>
                  </div>
                  <p className="whitespace-pre-wrap">{exercise.technique}</p>
                </div>
              ) : (
                <div className="bg-[#070A0F]/50 rounded-2xl p-2.5 border border-dashed border-slate-800 text-[11px] text-slate-500 flex items-center justify-between">
                  <span>Brak opisu techniki</span>
                  <button
                    type="button"
                    onClick={() => openEditModal(exercise)}
                    className="text-[#00F59B] font-bold hover:underline"
                  >
                    + Dodaj opis techniki
                  </button>
                </div>
              )}

              {/* Exercise Notes if present */}
              {exercise.notes && (
                <div className="text-[11px] text-emerald-400 bg-emerald-950/40 border border-emerald-500/30 rounded-xl px-3 py-1.5 flex items-center justify-between">
                  <span>
                    <strong>Uwaga:</strong> {exercise.notes}
                  </span>
                  <button
                    type="button"
                    onClick={() => openEditModal(exercise)}
                    className="text-[#00F59B] hover:underline text-[10px] font-bold ml-2"
                  >
                    Edytuj
                  </button>
                </div>
              )}

              {/* Default Parameters (Sets, Reps, RPE) */}
              <div className="flex items-center justify-between text-xs pt-1 border-t border-slate-800/60">
                <button
                  type="button"
                  onClick={() => openEditModal(exercise)}
                  className="flex items-center gap-2 text-slate-400 hover:text-slate-200 font-mono text-[11px] text-left transition-colors py-1 group"
                  title="Kliknij, aby edytować serie, powtórzenia i RPE"
                >
                  <span>
                    Serie: <strong className="text-white">{exercise.defaultSets || 3}</strong>
                  </span>
                  <span>·</span>
                  <span>
                    Powtórzenia: <strong className="text-white">{exercise.defaultReps || '8-10'}</strong>
                  </span>
                  {exercise.defaultRpe && (
                    <>
                      <span>·</span>
                      <span>
                        RPE: <strong className="text-[#00F59B]">{exercise.defaultRpe}</strong>
                      </span>
                    </>
                  )}
                  <Edit3 className="w-3 h-3 text-slate-500 group-hover:text-[#00F59B] ml-0.5" />
                </button>

                {/* Przycisk: Dodaj do planu */}
                <button
                  type="button"
                  onClick={() => handleOpenAddToPlan(exercise)}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gradient-to-r from-emerald-500/20 to-teal-500/20 hover:from-emerald-500/35 hover:to-teal-500/35 text-[#00F59B] font-extrabold text-xs border border-[#00F59B]/40 transition-all active:scale-95 shadow-sm"
                >
                  <CalendarPlus className="w-3.5 h-3.5 stroke-[2.5]" />
                  <span>Dodaj do planu</span>
                </button>
              </div>
            </div>
            );
          })
        )}
      </section>

      {/* 4. MODAL: DODAJ DO KONKRETNEGO DNIA W PLANIE */}
      {addToPlanExercise && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md select-none">
          <div className="w-full max-w-sm glass-card border border-slate-700/80 rounded-3xl p-5 shadow-2xl space-y-4 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div>
                <span className="text-[10px] font-extrabold uppercase tracking-wider text-[#00F59B]">
                  DODAJ DO PLANU DNIA
                </span>
                <h3 className="text-base font-extrabold text-white leading-tight">
                  {addToPlanExercise.name}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setAddToPlanExercise(null)}
                className="text-slate-400 hover:text-white p-1 rounded-xl"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Wybór Tygodnia */}
            <div>
              <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                Wybierz tydzień cyklu:
              </label>
              <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar">
                {cycleData.weeks.map((week) => (
                  <button
                    key={week.id}
                    type="button"
                    onClick={() => setTargetWeekId(week.id)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold border shrink-0 transition-all ${
                      targetWeekId === week.id
                        ? 'bg-[#142334] text-[#00F59B] border-[#00F59B]'
                        : 'bg-slate-800/60 text-slate-400 border-slate-700'
                    }`}
                  >
                    {week.name}
                  </button>
                ))}
              </div>
            </div>

            {/* Wybór Dnia Treningowego */}
            <div>
              <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                Wybierz dzień treningowy:
              </label>
              {!selectedTargetWeek || selectedTargetWeek.days.length === 0 ? (
                <div className="p-3 bg-amber-950/30 border border-amber-500/30 rounded-2xl text-xs text-amber-300 text-center">
                  Brak dni treningowych w tym tygodniu. Przejdź do modułu Plany, aby dodać dni.
                </div>
              ) : (
                <div className="space-y-1.5 max-h-40 overflow-y-auto pr-1">
                  {selectedTargetWeek.days.map((day) => (
                    <button
                      key={day.id}
                      type="button"
                      onClick={() => setTargetDayId(day.id)}
                      className={`w-full flex items-center justify-between p-2.5 rounded-xl border text-left text-xs font-bold transition-all ${
                        targetDayId === day.id
                          ? 'bg-emerald-500/20 border-[#00F59B] text-[#00F59B]'
                          : 'bg-slate-900/60 border-slate-800 text-slate-300 hover:bg-slate-800'
                      }`}
                    >
                      <span>
                        {day.dayName} — {day.planName}
                      </span>
                      <span className="text-[10px] text-slate-400 font-mono">
                        {day.exercises.length} ćw.
                      </span>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Domyślna liczba serii */}
            <div>
              <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                Początkowa liczba serii:
              </label>
              <div className="flex items-center gap-2">
                {[2, 3, 4, 5].map((count) => (
                  <button
                    key={count}
                    type="button"
                    onClick={() => setTargetSetsCount(count)}
                    className={`flex-1 py-1.5 rounded-xl text-xs font-bold border transition-all ${
                      targetSetsCount === count
                        ? 'bg-[#00F59B] text-[#06090E] border-[#00F59B] font-extrabold'
                        : 'bg-slate-800/60 text-slate-300 border-slate-700'
                    }`}
                  >
                    {count} serie
                  </button>
                ))}
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-2 pt-2 border-t border-slate-800">
              <button
                type="button"
                onClick={() => setAddToPlanExercise(null)}
                className="flex-1 py-2.5 rounded-xl border border-slate-700 text-slate-300 text-xs font-bold hover:bg-slate-800"
              >
                Anuluj
              </button>
              <button
                type="button"
                disabled={!targetDayId}
                onClick={handleConfirmAddToPlan}
                className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-[#00F59B] to-[#06D6A0] text-[#06090E] text-xs font-extrabold neon-glow-btn disabled:opacity-30 disabled:pointer-events-none"
              >
                Dodaj do planu
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 5. MODAL: DODAJ / EDYTUJ WŁASNE ĆWICZENIE */}
      {(isAddCustomOpen || editingExercise) && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md select-none">
          <div className="w-full max-w-sm glass-card border border-slate-700/80 rounded-3xl p-5 shadow-2xl space-y-3.5 animate-in fade-in zoom-in-95 duration-150 max-h-[90vh] flex flex-col">
            <div className="flex items-center justify-between border-b border-slate-800 pb-2.5 shrink-0">
              <div>
                <span className="text-[10px] font-extrabold uppercase tracking-wider text-[#00F59B]">
                  {editingExercise ? 'EDYCJA ĆWICZENIA' : 'NOWE WŁASNE ĆWICZENIE'}
                </span>
                <h3 className="text-base font-extrabold text-white">
                  {editingExercise ? 'Edytuj ćwiczenie' : 'Dodaj do katalogu'}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => {
                  setIsAddCustomOpen(false);
                  setEditingExercise(null);
                }}
                className="text-slate-400 hover:text-white p-1 rounded-xl"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="overflow-y-auto space-y-3 flex-1 pr-1">
              {/* Nazwa ćwiczenia */}
              <div>
                <label className="block text-[11px] font-bold text-slate-300 uppercase tracking-wider mb-1">
                  Nazwa ćwiczenia:
                </label>
                <input
                  type="text"
                  value={formName}
                  onChange={(e) => setFormName(e.target.value)}
                  placeholder="np. Wyciskanie sztangielek na skosie ujemnym"
                  className="w-full bg-[#070A0F] border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-[#00F59B]"
                />
              </div>

              {/* Partia mięśniowa */}
              <div>
                <label className="block text-[11px] font-bold text-slate-300 uppercase tracking-wider mb-1">
                  Partia mięśniowa:
                </label>
                <div className="grid grid-cols-3 gap-1.5">
                  {[
                    { label: 'Klata', cat: 'Klatka piersiowa' as ExerciseCategory },
                    { label: 'Plecy', cat: 'Plecy' as ExerciseCategory },
                    { label: 'Barki', cat: 'Barki' as ExerciseCategory },
                    { label: 'Nogi', cat: 'Nogi' as ExerciseCategory },
                    { label: 'Biceps', cat: 'Biceps' as ExerciseCategory },
                    { label: 'Triceps', cat: 'Triceps' as ExerciseCategory },
                  ].map((p) => (
                    <button
                      key={p.cat}
                      type="button"
                      onClick={() => setFormCategory(p.cat)}
                      className={`py-1.5 px-2 rounded-xl text-xs font-bold border transition-all text-center ${
                        formCategory === p.cat
                          ? 'bg-emerald-500/20 border-[#00F59B] text-[#00F59B]'
                          : 'bg-slate-900 border-slate-800 text-slate-400 hover:bg-slate-800'
                      }`}
                    >
                      {p.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Sprzęt */}
              <div>
                <label className="block text-[11px] font-bold text-slate-300 uppercase tracking-wider mb-1">
                  Sprzęt:
                </label>
                <div className="grid grid-cols-3 gap-1.5">
                  {['Sztanga', 'Hantle', 'Wyciąg', 'Maszyna', 'Masa ciała', 'Inny'].map((eq) => (
                    <button
                      key={eq}
                      type="button"
                      onClick={() => setFormEquipment(eq)}
                      className={`py-1.5 px-2 rounded-xl text-xs font-bold border transition-all text-center ${
                        formEquipment === eq
                          ? 'bg-emerald-500/20 border-[#00F59B] text-[#00F59B]'
                          : 'bg-slate-900 border-slate-800 text-slate-400 hover:bg-slate-800'
                      }`}
                    >
                      {eq}
                    </button>
                  ))}
                </div>
              </div>

              {/* Krótki opis techniki */}
              <div>
                <label className="block text-[11px] font-bold text-slate-300 uppercase tracking-wider mb-1">
                  Krótki opis techniki:
                </label>
                <textarea
                  value={formTechnique}
                  onChange={(e) => setFormTechnique(e.target.value)}
                  placeholder="Pozycja wyjściowa, tor ruchu, ustawienie łopatek, faza ekscentryczna, oddychanie..."
                  className="w-full bg-[#070A0F] border border-slate-700 rounded-xl p-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-[#00F59B] min-h-[65px]"
                />
              </div>

              {/* Parametry domyślne: Serie, Powtórzenia, RPE */}
              <div className="grid grid-cols-3 gap-2">
                <div>
                  <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">
                    Serie
                  </label>
                  <input
                    type="number"
                    value={formSets}
                    onChange={(e) => setFormSets(parseInt(e.target.value, 10) || 3)}
                    className="w-full bg-[#070A0F] border border-slate-700 rounded-xl p-2 text-xs text-white text-center font-bold"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">
                    Powtórzenia
                  </label>
                  <input
                    type="text"
                    value={formReps}
                    onChange={(e) => setFormReps(e.target.value)}
                    placeholder="8-10"
                    className="w-full bg-[#070A0F] border border-slate-700 rounded-xl p-2 text-xs text-white text-center font-bold"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">
                    RPE
                  </label>
                  <input
                    type="text"
                    value={formRpe}
                    onChange={(e) => setFormRpe(e.target.value)}
                    placeholder="8"
                    className="w-full bg-[#070A0F] border border-slate-700 rounded-xl p-2 text-xs text-white text-center font-bold"
                  />
                </div>
              </div>

              {/* Dodatkowe uwagi / notatki */}
              <div>
                <label className="block text-[11px] font-bold text-slate-300 uppercase tracking-wider mb-1">
                  Dodatkowe uwagi / notatka:
                </label>
                <input
                  type="text"
                  value={formNotes}
                  onChange={(e) => setFormNotes(e.target.value)}
                  placeholder="np. Pauza 1s na dole, tempo 3-0-1, chwyt na szerokość barków..."
                  className="w-full bg-[#070A0F] border border-slate-700 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-[#00F59B]"
                />
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-2 pt-2 border-t border-slate-800 shrink-0">
              <button
                type="button"
                onClick={() => {
                  setIsAddCustomOpen(false);
                  setEditingExercise(null);
                }}
                className="flex-1 py-2.5 rounded-xl border border-slate-700 text-slate-300 text-xs font-bold hover:bg-slate-800"
              >
                Anuluj
              </button>

              {editingExercise && !editingExercise.isCustom && (
                <button
                  type="button"
                  onClick={() => {
                    handleResetExerciseToDefault(editingExercise.id);
                    setEditingExercise(null);
                  }}
                  className="px-3 py-2.5 rounded-xl border border-slate-700/80 text-slate-400 hover:text-white text-xs font-bold hover:bg-slate-800 flex items-center justify-center gap-1"
                  title="Przywróć oryginalne parametry tego ćwiczenia"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Wzorzec</span>
                </button>
              )}

              <button
                type="button"
                disabled={!formName.trim()}
                onClick={() =>
                  handleSaveCustomExercise({
                    name: formName,
                    category: formCategory,
                    equipment: formEquipment,
                    technique: formTechnique,
                    defaultSets: formSets,
                    defaultReps: formReps,
                    defaultRpe: formRpe,
                    notes: formNotes,
                  })
                }
                className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-[#00F59B] to-[#06D6A0] text-[#06090E] text-xs font-extrabold neon-glow-btn disabled:opacity-30 disabled:pointer-events-none"
              >
                {editingExercise ? 'Zapisz zmiany' : 'Zapisz w katalogu'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 6. MODAL: POTWIERDZENIE USUNIĘCIA WŁASNEGO ĆWICZENIA */}
      {deleteCandidate && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md select-none">
          <div className="w-full max-w-xs glass-card border border-rose-500/50 rounded-3xl p-5 shadow-2xl space-y-3 animate-in fade-in zoom-in-95 duration-150 text-center">
            <Trash2 className="w-9 h-9 text-rose-400 mx-auto" />
            <h4 className="text-sm font-extrabold text-white">Usunąć to ćwiczenie?</h4>
            <p className="text-xs text-slate-300">
              Czy na pewno chcesz usunąć ćwiczenie <strong className="text-white">„{deleteCandidate.name}”</strong> z katalogu?
            </p>
            <div className="flex gap-2 pt-2">
              <button
                type="button"
                onClick={() => setDeleteCandidate(null)}
                className="flex-1 py-2 rounded-xl border border-slate-700 text-slate-300 text-xs font-bold hover:bg-slate-800"
              >
                Anuluj
              </button>
              <button
                type="button"
                onClick={() => {
                  handleDeleteExercise(deleteCandidate.id, deleteCandidate.name);
                  setDeleteCandidate(null);
                }}
                className="flex-1 py-2 rounded-xl bg-rose-600 text-white text-xs font-bold hover:bg-rose-500"
              >
                Usuń
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
