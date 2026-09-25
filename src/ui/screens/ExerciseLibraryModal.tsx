import React, { useState } from 'react';
import { X, Search, Plus, Check, Filter, Sparkles, AlertCircle } from 'lucide-react';
import { ExerciseCategory, ExerciseDefinition, EXERCISE_CATEGORIES } from '../../domain/types';
import { LocalStorageRepo } from '../../data/localStorageRepo';

interface ExerciseLibraryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectExercise: (exercise: ExerciseDefinition) => void;
  title?: string;
}

export const ExerciseLibraryModal: React.FC<ExerciseLibraryModalProps> = ({
  isOpen,
  onClose,
  onSelectExercise,
  title = 'Biblioteka ćwiczeń',
}) => {
  const [exercises, setExercises] = useState<ExerciseDefinition[]>(() => LocalStorageRepo.getExercises());
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState<ExerciseCategory | 'Wszystkie'>('Wszystkie');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Mode: List vs Create new exercise
  const [isCreatingNew, setIsCreatingNew] = useState<boolean>(false);
  const [newExerciseName, setNewExerciseName] = useState<string>('');
  const [newExerciseCategory, setNewExerciseCategory] = useState<ExerciseCategory | null>(null);
  const [createError, setCreateError] = useState<string | null>(null);

  if (!isOpen) return null;

  const filteredExercises = exercises.filter((ex) => {
    const matchesCat = selectedCategoryFilter === 'Wszystkie' || ex.category === selectedCategoryFilter;
    const matchesSearch = ex.name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCat && matchesSearch;
  });

  const handleCreateExercise = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newExerciseName.trim()) {
      setCreateError('Wprowadź nazwę ćwiczenia.');
      return;
    }
    // STRICT: User MUST choose exactly one category!
    if (!newExerciseCategory) {
      setCreateError('Wybór kategorii jest obowiązkowy! Każde ćwiczenie musi mieć dokładnie jedną kategorię.');
      return;
    }

    const created = LocalStorageRepo.addExercise({
      name: newExerciseName.trim(),
      category: newExerciseCategory,
      defaultSets: 3,
    });

    setExercises(LocalStorageRepo.getExercises());
    setNewExerciseName('');
    setNewExerciseCategory(null);
    setCreateError(null);
    setIsCreatingNew(false);

    // Automatically select the newly created exercise
    onSelectExercise(created);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 bg-black/85 backdrop-blur-md select-none">
      <div className="w-full max-w-lg glass-card border border-slate-700/80 rounded-3xl shadow-2xl flex flex-col max-h-[85vh] overflow-hidden relative">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-800">
          <div>
            <h2 className="text-base font-extrabold text-white flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#00F59B]" />
              {title}
            </h2>
            <p className="text-[11px] text-slate-400">
              Dokładnie 1 kategoria · Brak partii pomocniczych
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white rounded-xl hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* View Switcher: List vs Add */}
        {!isCreatingNew ? (
          <>
            {/* Search Bar & Add Button */}
            <div className="p-4 space-y-3 border-b border-slate-800/80 bg-[#080C14]">
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <Search className="absolute left-3.5 top-2.5 w-4 h-4 text-slate-400" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Szukaj ćwiczenia w bazie..."
                    className="w-full bg-[#0E1520] border border-slate-700 focus:border-[#00F59B] rounded-2xl pl-10 pr-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none transition-all"
                  />
                </div>
                <button
                  type="button"
                  onClick={() => setIsCreatingNew(true)}
                  className="flex items-center gap-1.5 px-3.5 py-2 bg-gradient-to-r from-[#00F59B] to-[#06D6A0] text-[#06090E] text-xs font-extrabold rounded-2xl transition-all shadow-md neon-glow-btn shrink-0"
                >
                  <Plus className="w-4 h-4 stroke-[3]" />
                  <span>Nowe</span>
                </button>
              </div>

              {/* Category Filter Chips */}
              <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar text-xs">
                <button
                  type="button"
                  onClick={() => setSelectedCategoryFilter('Wszystkie')}
                  className={`px-3 py-1.5 rounded-xl font-bold whitespace-nowrap transition-all ${
                    selectedCategoryFilter === 'Wszystkie'
                      ? 'bg-slate-200 text-slate-950 shadow-sm'
                      : 'bg-slate-800/80 text-slate-400 hover:text-white'
                  }`}
                >
                  Wszystkie
                </button>
                {EXERCISE_CATEGORIES.map((cat) => (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => setSelectedCategoryFilter(cat)}
                    className={`px-3 py-1.5 rounded-xl font-bold whitespace-nowrap transition-all ${
                      selectedCategoryFilter === cat
                        ? 'bg-gradient-to-r from-[#00F59B] to-[#06D6A0] text-[#06090E] shadow-[0_0_10px_rgba(0,245,155,0.3)]'
                        : 'bg-slate-800/80 text-slate-400 hover:text-white'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            {/* Exercise List */}
            <div className="flex-1 overflow-y-auto p-4 space-y-2 divide-y divide-slate-800/40">
              {filteredExercises.length > 0 ? (
                filteredExercises.map((ex) => (
                  <div
                    key={ex.id}
                    onClick={() => onSelectExercise(ex)}
                    className="pt-2.5 first:pt-0 flex items-center justify-between p-2.5 rounded-2xl hover:bg-[#15202E] cursor-pointer transition-all group"
                  >
                    <div>
                      <h4 className="text-xs font-extrabold text-white group-hover:text-[#00F59B] transition-colors">
                        {ex.name}
                      </h4>
                      <p className="text-[11px] text-slate-400 mt-0.5">
                        Kategoria: <span className="text-[#00F59B] font-semibold">{ex.category}</span>
                      </p>
                    </div>

                    <button
                      type="button"
                      className="px-3.5 py-1.5 bg-[#141E2B] group-hover:bg-[#00F59B] group-hover:text-[#06090E] text-slate-200 text-xs font-bold rounded-xl transition-all border border-slate-700/60"
                    >
                      Wybierz
                    </button>
                  </div>
                ))
              ) : (
                <div className="text-center py-10 text-slate-400">
                  <p className="text-xs font-medium">Nie znaleziono ćwiczeń dla tego zapytania.</p>
                  <button
                    type="button"
                    onClick={() => setIsCreatingNew(true)}
                    className="mt-3 text-xs text-[#00F59B] hover:underline font-bold"
                  >
                    + Utwórz nowe ćwiczenie teraz
                  </button>
                </div>
              )}
            </div>

            {/* Floating Action Button for Adding New Exercise */}
            <div className="p-3 border-t border-slate-800 bg-[#080C14] flex justify-end">
              <button
                type="button"
                onClick={() => setIsCreatingNew(true)}
                className="w-full flex items-center justify-center gap-2 py-2.5 rounded-2xl bg-[#14202E] hover:bg-[#1A283A] text-[#00F59B] text-xs font-bold border border-[#00F59B]/40 transition-colors"
              >
                <Plus className="w-4 h-4 stroke-[3]" />
                <span>Dodaj nowe ćwiczenie do biblioteki</span>
              </button>
            </div>
          </>
        ) : (
          /* Create New Exercise Form (User MUST select strictly 1 category) */
          <form onSubmit={handleCreateExercise} className="p-5 space-y-4 overflow-y-auto">
            <div>
              <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                Nazwa ćwiczenia *
              </label>
              <input
                type="text"
                value={newExerciseName}
                onChange={(e) => setNewExerciseName(e.target.value)}
                placeholder="np. Wyciskanie hantli na skosie dodatnim"
                className="w-full bg-[#070A0F] border border-slate-700 focus:border-[#00F59B] rounded-2xl px-4 py-2.5 text-sm text-white focus:outline-none transition-colors"
                autoFocus
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1">
                Kategoria główna (wybierz dokładnie jedną) *
              </label>
              <p className="text-[11px] text-slate-400 mb-3">
                W PlanPasika.v2 nie ma partii pomocniczych. Wybierz główną partię docelową:
              </p>

              {/* The 7 mandatory categories */}
              <div className="grid grid-cols-2 gap-2">
                {EXERCISE_CATEGORIES.map((cat) => {
                  const isSelected = newExerciseCategory === cat;
                  return (
                    <button
                      key={cat}
                      type="button"
                      onClick={() => setNewExerciseCategory(cat)}
                      className={`flex items-center justify-between p-3 rounded-2xl border text-left text-xs font-bold transition-all ${
                        isSelected
                          ? 'bg-emerald-500/20 border-[#00F59B] text-[#00F59B] shadow-[0_0_12px_rgba(0,245,155,0.25)] ring-1 ring-[#00F59B]'
                          : 'bg-[#090D14] border-slate-800 text-slate-300 hover:border-slate-700'
                      }`}
                    >
                      <span>{cat}</span>
                      {isSelected && <Check className="w-4 h-4 text-[#00F59B] stroke-[3]" />}
                    </button>
                  );
                })}
              </div>
            </div>

            {createError && (
              <div className="p-3 rounded-2xl bg-rose-950/60 border border-rose-500/40 text-rose-300 text-xs font-medium flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{createError}</span>
              </div>
            )}

            <div className="flex gap-2 pt-2">
              <button
                type="button"
                onClick={() => {
                  setIsCreatingNew(false);
                  setCreateError(null);
                }}
                className="flex-1 py-3 rounded-2xl border border-slate-700 text-slate-300 text-xs font-bold hover:bg-slate-800 transition-colors"
              >
                Wróć do listy
              </button>
              <button
                type="submit"
                className="flex-1 py-3 rounded-2xl bg-gradient-to-r from-[#00F59B] to-[#06D6A0] text-[#06090E] text-xs font-extrabold shadow-md neon-glow-btn transition-colors"
              >
                Zapisz ćwiczenie
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
