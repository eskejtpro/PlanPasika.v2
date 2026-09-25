import React from 'react';
import {
  BarChart3,
  Dumbbell,
  Clock,
  CheckCircle2,
  Layers,
  Filter,
  Flame,
  Info,
  Weight,
  TrendingUp,
  Sparkles,
} from 'lucide-react';
import { useAnalyticsViewModel } from '../../viewmodel/useAnalyticsViewModel';
import { EXERCISE_CATEGORIES, ExerciseCategory } from '../../domain/types';

export const AnalyticsScreen: React.FC = () => {
  const {
    selectedFilter,
    setSelectedFilter,
    selectedCycleId,
    setSelectedCycleId,
    cycles,
    summary,
    CATEGORY_COLORS,
  } = useAnalyticsViewModel();

  const hours = Math.floor(summary.totalDurationMinutes / 60);
  const remainingMins = summary.totalDurationMinutes % 60;

  // Max series in single category for relative bar sizing
  const maxSets = Math.max(...Object.values(summary.categorySets), 1);

  // Vibrant neon color map for PlanPasika.v2
  const NEON_CATEGORY_COLORS: Record<ExerciseCategory, string> = {
    'Klatka piersiowa': '#00F59B', // Neon Green
    'Plecy': '#00E5FF',          // Neon Cyan
    'Barki': '#FACC15',          // Neon Yellow/Amber
    'Nogi': '#F43F5E',           // Neon Coral/Rose
    'Biceps': '#A855F7',         // Neon Purple
    'Triceps': '#06D6A0',        // Neon Teal
    'Pozostałe': '#64748B',      // Slate
  };

  // Estimated tonnage calculation for visual flair (e.g. total sets * ~8 reps * ~45kg)
  const estimatedTonnageKg = summary.totalSets * 8 * 42;

  return (
    <div className="flex-1 overflow-y-auto px-4 py-3.5 space-y-4 pb-8 select-none">
      {/* 1. Top Header */}
      <div className="pt-1">
        <h1 className="text-xl font-extrabold tracking-tight text-white flex items-center gap-2">
          Analizy treningowe
        </h1>
        <p className="text-[11px] font-medium text-slate-400">
          Zrealizowana objętość i metryki · 1 seria = 1 zaliczenie
        </p>
      </div>

      {/* 2. Scope Filter Segmented Switch */}
      <div className="space-y-2">
        <div className="flex bg-[#0A0F16] p-1 rounded-2xl border border-[#182332]">
          <button
            type="button"
            onClick={() => setSelectedFilter('month')}
            className={`flex-1 py-1.5 rounded-xl text-xs font-bold transition-all ${
              selectedFilter === 'month'
                ? 'bg-gradient-to-r from-[#00F59B] to-[#06D6A0] text-[#06090E] shadow-[0_0_12px_rgba(0,245,155,0.3)]'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Miesięczne
          </button>
          <button
            type="button"
            onClick={() => setSelectedFilter('plan')}
            className={`flex-1 py-1.5 rounded-xl text-xs font-bold transition-all ${
              selectedFilter === 'plan'
                ? 'bg-gradient-to-r from-[#00F59B] to-[#06D6A0] text-[#06090E] shadow-[0_0_12px_rgba(0,245,155,0.3)]'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Cały plan
          </button>
          <button
            type="button"
            onClick={() => setSelectedFilter('cycle')}
            className={`flex-1 py-1.5 rounded-xl text-xs font-bold transition-all ${
              selectedFilter === 'cycle'
                ? 'bg-gradient-to-r from-[#00F59B] to-[#06D6A0] text-[#06090E] shadow-[0_0_12px_rgba(0,245,155,0.3)]'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Osobne cykle
          </button>
        </div>

        {/* Cycle selector dropdown if 'cycle' filter is chosen */}
        {selectedFilter === 'cycle' && (
          <div className="glass-card p-3 rounded-2xl border border-white/5 flex items-center justify-between">
            <span className="text-xs text-slate-400 font-medium">Wybierz cykl:</span>
            <select
              value={selectedCycleId}
              onChange={(e) => setSelectedCycleId(e.target.value)}
              className="bg-[#070A0F] text-xs font-bold text-white border border-slate-700 rounded-xl px-3 py-1.5 focus:outline-none focus:border-[#00F59B]"
            >
              {cycles.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name} {c.isActive ? '(Aktualny)' : ''}
                </option>
              ))}
            </select>
          </div>
        )}
      </div>

      {/* 3. Top 4 Metric Cards */}
      <div className="grid grid-cols-2 gap-2.5">
        {/* Total Sets */}
        <div className="glass-card rounded-2xl p-3.5 border border-white/5 flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-400 mb-1">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Liczba serii</span>
            <CheckCircle2 className="w-4 h-4 text-[#00F59B]" />
          </div>
          <div>
            <span className="text-2xl font-extrabold font-mono tracking-tight text-white">
              {summary.totalSets}
            </span>
            <p className="text-[10px] text-slate-400 mt-0.5">ukończonych serii</p>
          </div>
        </div>

        {/* Total Workouts */}
        <div className="glass-card rounded-2xl p-3.5 border border-white/5 flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-400 mb-1">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Sesje</span>
            <Dumbbell className="w-4 h-4 text-cyan-400" />
          </div>
          <div>
            <span className="text-2xl font-extrabold font-mono tracking-tight text-white">
              {summary.totalWorkouts}
            </span>
            <p className="text-[10px] text-slate-400 mt-0.5">treningów</p>
          </div>
        </div>

        {/* Total Duration */}
        <div className="glass-card rounded-2xl p-3.5 border border-white/5 flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-400 mb-1">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Czas pracy</span>
            <Clock className="w-4 h-4 text-purple-400" />
          </div>
          <div>
            <span className="text-xl font-extrabold font-mono tracking-tight text-white">
              {hours}h {remainingMins}m
            </span>
            <p className="text-[10px] text-slate-400 mt-0.5">łączny czas sesji</p>
          </div>
        </div>

        {/* Estimated Tonnage */}
        <div className="glass-card rounded-2xl p-3.5 border border-white/5 flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-400 mb-1">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Tonaż</span>
            <TrendingUp className="w-4 h-4 text-amber-400" />
          </div>
          <div>
            <span className="text-xl font-extrabold font-mono tracking-tight text-white">
              {(estimatedTonnageKg / 1000).toFixed(1)} t
            </span>
            <p className="text-[10px] text-slate-400 mt-0.5">szacowane obciążenie</p>
          </div>
        </div>
      </div>

      {/* 4. Podział wykonanych serii według 7 kategorii ćwiczeń */}
      <div className="glass-card p-4 rounded-3xl border border-white/5 shadow-xl space-y-4">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div>
            <h2 className="text-sm font-extrabold text-white">
              Objętość wg 7 kategorii
            </h2>
            <p className="text-[11px] text-slate-400">
              Dokładnie 1 zliczenie na serię (brak partii pomocniczych)
            </p>
          </div>
        </div>

        {/* Horizontal Stacked Overview Bar with Neon Glow */}
        <div className="h-3.5 w-full bg-[#070A0F] rounded-full overflow-hidden flex border border-slate-800 shadow-inner">
          {EXERCISE_CATEGORIES.map((cat) => {
            const count = summary.categorySets[cat] || 0;
            const percent = summary.totalSets > 0 ? (count / summary.totalSets) * 100 : 0;
            if (percent <= 0) return null;

            return (
              <div
                key={cat}
                style={{
                  width: `${percent}%`,
                  backgroundColor: NEON_CATEGORY_COLORS[cat],
                }}
                title={`${cat}: ${count} serii (${percent.toFixed(1)}%)`}
              />
            );
          })}
        </div>

        {/* Detailed Breakdown for each of the 7 categories */}
        <div className="space-y-3 pt-1">
          {EXERCISE_CATEGORIES.map((cat) => {
            const count = summary.categorySets[cat] || 0;
            const percent = summary.totalSets > 0 ? Math.round((count / summary.totalSets) * 100) : 0;
            const barWidth = Math.round((count / maxSets) * 100);

            return (
              <div key={cat} className="space-y-1.5">
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <span
                      className="w-2.5 h-2.5 rounded-full shadow-[0_0_6px_currentColor]"
                      style={{
                        backgroundColor: NEON_CATEGORY_COLORS[cat],
                        color: NEON_CATEGORY_COLORS[cat],
                      }}
                    />
                    <span className="font-bold text-slate-200">{cat}</span>
                  </div>
                  <div className="flex items-center gap-2 font-mono text-[11px]">
                    <span className="text-white font-extrabold">{count} serii</span>
                    <span className="text-slate-400">({percent}%)</span>
                  </div>
                </div>

                {/* Progress track */}
                <div className="h-2 w-full bg-[#070A0F] rounded-full overflow-hidden border border-slate-800/80">
                  <div
                    className="h-full rounded-full transition-all duration-300"
                    style={{
                      width: `${barWidth}%`,
                      backgroundColor: NEON_CATEGORY_COLORS[cat],
                      boxShadow: `0 0 8px ${NEON_CATEGORY_COLORS[cat]}80`,
                    }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Offline notice */}
      <div className="p-3.5 rounded-2xl bg-[#090D14] border border-slate-800/80 flex items-start gap-2.5 text-xs text-slate-400">
        <Info className="w-4 h-4 text-[#00F59B] shrink-0 mt-0.5" />
        <p className="leading-relaxed">
          Wszystkie analizy obliczane są lokalnie na urządzeniu Xiaomi 14T. Aplikacja działa 100% offline.
        </p>
      </div>
    </div>
  );
};
