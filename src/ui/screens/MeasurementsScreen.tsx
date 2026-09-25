import React, { useState } from 'react';
import {
  Ruler,
  Scale,
  TrendingUp,
  TrendingDown,
  Minus,
  Plus,
  Calendar,
  Edit3,
  Trash2,
  X,
  CheckCircle2,
  Activity,
  ArrowUpRight,
  ArrowDownRight,
  Sparkles,
  Info,
} from 'lucide-react';
import {
  useMeasurementsViewModel,
  MeasurementTabSection,
} from '../../viewmodel/useMeasurementsViewModel';
import {
  BodyMeasurementEntry,
  BodyWeightEntry,
  BodyPartKey,
  BODY_PARTS_CONFIG,
} from '../../domain/types';

export const MeasurementsScreen: React.FC = () => {
  const {
    activeSection,
    setActiveSection,
    measurements,
    weights,
    selectedMetric,
    setSelectedMetric,
    bodyPartStats,
    weightStats,
    activeMetricStat,
    chartData,
    toastMessage,
    isAddMeasurementOpen,
    setIsAddMeasurementOpen,
    editingMeasurement,
    setEditingMeasurement,
    isAddWeightOpen,
    setIsAddWeightOpen,
    editingWeight,
    setEditingWeight,
    handleSaveMeasurement,
    handleDeleteMeasurement,
    handleSaveWeight,
    handleDeleteWeight,
  } = useMeasurementsViewModel();

  // Form states for Body Measurement
  const todayStr = new Date().toISOString().split('T')[0];
  const [measDate, setMeasDate] = useState<string>(todayStr);
  const [measBiceps, setMeasBiceps] = useState<string>('');
  const [measTriceps, setMeasTriceps] = useState<string>('');
  const [measChest, setMeasChest] = useState<string>('');
  const [measShoulders, setMeasShoulders] = useState<string>('');
  const [measWaist, setMeasWaist] = useState<string>('');
  const [measHips, setMeasHips] = useState<string>('');
  const [measThigh, setMeasThigh] = useState<string>('');
  const [measCalf, setMeasCalf] = useState<string>('');
  const [measNotes, setMeasNotes] = useState<string>('');

  // Form states for Body Weight
  const [weightDate, setWeightDate] = useState<string>(todayStr);
  const [weightValue, setWeightValue] = useState<string>('');
  const [weightNotes, setWeightNotes] = useState<string>('');

  // Delete candidate states
  const [deleteMeasCandidate, setDeleteMeasCandidate] = useState<BodyMeasurementEntry | null>(null);
  const [deleteWeightCandidate, setDeleteWeightCandidate] = useState<BodyWeightEntry | null>(null);

  // Open add measurement
  const openAddMeasurementModal = () => {
    setMeasDate(todayStr);
    setMeasBiceps('');
    setMeasTriceps('');
    setMeasChest('');
    setMeasShoulders('');
    setMeasWaist('');
    setMeasHips('');
    setMeasThigh('');
    setMeasCalf('');
    setMeasNotes('');
    setIsAddMeasurementOpen(true);
  };

  // Open edit measurement
  const openEditMeasurementModal = (m: BodyMeasurementEntry) => {
    setMeasDate(m.date);
    setMeasBiceps(m.biceps !== undefined ? String(m.biceps) : '');
    setMeasTriceps(m.triceps !== undefined ? String(m.triceps) : '');
    setMeasChest(m.chest !== undefined ? String(m.chest) : '');
    setMeasShoulders(m.shoulders !== undefined ? String(m.shoulders) : '');
    setMeasWaist(m.waist !== undefined ? String(m.waist) : '');
    setMeasHips(m.hips !== undefined ? String(m.hips) : '');
    setMeasThigh(m.thigh !== undefined ? String(m.thigh) : '');
    setMeasCalf(m.calf !== undefined ? String(m.calf) : '');
    setMeasNotes(m.notes || '');
    setEditingMeasurement(m);
  };

  const parseNumberInput = (val: string): number | undefined => {
    if (!val || val.trim() === '') return undefined;
    const normalized = val.replace(',', '.').trim();
    const num = parseFloat(normalized);
    return isNaN(num) ? undefined : num;
  };

  const submitMeasurementForm = () => {
    handleSaveMeasurement({
      id: editingMeasurement?.id,
      date: measDate,
      biceps: parseNumberInput(measBiceps),
      triceps: parseNumberInput(measTriceps),
      chest: parseNumberInput(measChest),
      shoulders: parseNumberInput(measShoulders),
      waist: parseNumberInput(measWaist),
      hips: parseNumberInput(measHips),
      thigh: parseNumberInput(measThigh),
      calf: parseNumberInput(measCalf),
      notes: measNotes.trim() || undefined,
    });
  };

  // Open add weight
  const openAddWeightModal = () => {
    setWeightDate(todayStr);
    setWeightValue('');
    setWeightNotes('');
    setIsAddWeightOpen(true);
  };

  // Open edit weight
  const openEditWeightModal = (w: BodyWeightEntry) => {
    setWeightDate(w.date);
    setWeightValue(String(w.weight));
    setWeightNotes(w.notes || '');
    setEditingWeight(w);
  };

  const submitWeightForm = () => {
    const parsed = parseNumberInput(weightValue);
    if (parsed === undefined || parsed <= 0) return;
    handleSaveWeight({
      id: editingWeight?.id,
      date: weightDate,
      weight: parsed,
      notes: weightNotes.trim() || undefined,
    });
  };

  // SVG Line Chart Renderer
  const renderSvgChart = () => {
    if (chartData.length === 0) {
      return (
        <div className="p-8 text-center bg-[#090D14] rounded-2xl border border-slate-800 text-slate-400 text-xs">
          Brak danych do wygenerowania wykresu dla wybranego parametru. Dodaj wpis z pomiarem.
        </div>
      );
    }

    if (chartData.length === 1) {
      return (
        <div className="p-6 text-center bg-[#090D14] rounded-2xl border border-slate-800 space-y-2">
          <div className="text-2xl font-black text-[#00F59B]">
            {chartData[0].value} {chartData[0].unit}
          </div>
          <p className="text-xs text-slate-400">
            Zapisano 1 pomiar z dnia {chartData[0].date}. Dodaj kolejny pomiar, aby zobaczyć linię trendu i wykres.
          </p>
        </div>
      );
    }

    const values = chartData.map((d) => d.value);
    const minVal = Math.min(...values);
    const maxVal = Math.max(...values);
    const range = maxVal - minVal || 1;
    const paddingVal = range * 0.15;
    const effectiveMin = Math.max(0, minVal - paddingVal);
    const effectiveMax = maxVal + paddingVal;
    const effectiveRange = effectiveMax - effectiveMin || 1;

    const width = 340;
    const height = 150;
    const padX = 25;
    const padY = 20;

    const points = chartData.map((d, index) => {
      const x = padX + (index / (chartData.length - 1)) * (width - padX * 2);
      const y = height - padY - ((d.value - effectiveMin) / effectiveRange) * (height - padY * 2);
      return { x, y, ...d };
    });

    const pathData = points.reduce((acc, p, i) => `${acc} ${i === 0 ? 'M' : 'L'} ${p.x},${p.y}`, '');
    const areaData = `${pathData} L ${points[points.length - 1].x},${height - padY} L ${points[0].x},${height - padY} Z`;

    return (
      <div className="w-full bg-[#090D14] rounded-2xl p-3 border border-slate-800/80 space-y-2">
        <div className="flex items-center justify-between text-[11px] px-1 text-slate-400">
          <span className="font-bold text-white flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-[#00F59B] inline-block" />
            Wykres: {selectedMetric === 'weight' ? 'Waga ciała' : BODY_PARTS_CONFIG.find((p) => p.key === selectedMetric)?.label} ({chartData[0]?.unit})
          </span>
          <span className="font-mono text-[10px]">
            Min: <strong className="text-slate-300">{minVal}</strong> · Max: <strong className="text-white">{maxVal}</strong>
          </span>
        </div>

        <div className="overflow-x-auto">
          <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-36 select-none">
            <defs>
              <linearGradient id="chartGlowGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#00F59B" stopOpacity="0.35" />
                <stop offset="100%" stopColor="#00F59B" stopOpacity="0.0" />
              </linearGradient>
            </defs>

            {/* Horizontal Grid lines */}
            <line x1={padX} y1={padY} x2={width - padX} y2={padY} stroke="#1E293B" strokeDasharray="3 3" />
            <line x1={padX} y1={height / 2} x2={width - padX} y2={height / 2} stroke="#1E293B" strokeDasharray="3 3" />
            <line x1={padX} y1={height - padY} x2={width - padX} y2={height - padY} stroke="#334155" strokeWidth="1" />

            {/* Filled area */}
            <path d={areaData} fill="url(#chartGlowGrad)" />

            {/* Smooth line */}
            <path d={pathData} fill="none" stroke="#00F59B" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />

            {/* Data point dots & values */}
            {points.map((p, idx) => (
              <g key={idx}>
                <circle cx={p.x} cy={p.y} r="4.5" fill="#06090E" stroke="#00F59B" strokeWidth="2" />
                <text
                  x={p.x}
                  y={p.y - 8}
                  fill="#FFFFFF"
                  fontSize="9"
                  fontWeight="bold"
                  textAnchor="middle"
                  fontFamily="monospace"
                >
                  {p.value}
                </text>
                <text
                  x={p.x}
                  y={height - 5}
                  fill="#94A3B8"
                  fontSize="8"
                  textAnchor="middle"
                  fontFamily="monospace"
                >
                  {p.date.slice(5)}
                </text>
              </g>
            ))}
          </svg>
        </div>
      </div>
    );
  };

  return (
    <div className="flex-1 overflow-y-auto px-4 py-3.5 space-y-4 pb-20 select-none relative">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-14 left-1/2 -translate-x-1/2 z-50 px-4 py-2.5 rounded-2xl bg-emerald-950/95 border border-[#00F59B] text-[#00F59B] text-xs font-bold shadow-[0_0_20px_rgba(0,245,155,0.4)] flex items-center gap-2 animate-in fade-in slide-in-from-top-4 duration-200 max-w-[90%] text-center">
          <CheckCircle2 className="w-4 h-4 shrink-0 stroke-[2.5]" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* 1. TOP HEADER & SUMMARY CARD */}
      <section aria-labelledby="measurements-header" className="space-y-3 pt-1">
        <div className="glass-card p-3.5 rounded-3xl border border-white/10 relative overflow-hidden">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-1.5 mb-0.5">
                <span className="w-2 h-2 rounded-full bg-[#00F59B] shadow-[0_0_6px_#00F59B]" />
                <span className="text-[10px] font-extrabold uppercase tracking-wider text-[#00F59B]">
                  POMIARY CIAŁA & PROGRES
                </span>
              </div>
              <h1 id="measurements-header" className="text-xl font-extrabold text-white tracking-tight">
                Pomiary i sylwetka
              </h1>
              <p className="text-[11px] text-slate-400 font-medium">
                Śledzenie obwodów mięśni, wagi i realnego tempa zmian
              </p>
            </div>

            <div className="flex items-center gap-1.5">
              <button
                type="button"
                onClick={openAddWeightModal}
                className="px-2.5 py-1.5 rounded-xl bg-slate-800 text-slate-200 hover:text-[#00F59B] border border-slate-700 text-xs font-bold flex items-center gap-1 active:scale-95"
                title="Dodaj wagę"
              >
                <Scale className="w-3.5 h-3.5 text-[#00F59B]" />
                <span>+ Waga</span>
              </button>
              <button
                type="button"
                onClick={openAddMeasurementModal}
                className="px-2.5 py-1.5 rounded-xl bg-gradient-to-r from-[#00F59B] to-[#06D6A0] text-[#06090E] font-black text-xs shadow-md neon-glow-btn flex items-center gap-1 active:scale-95"
                title="Dodaj obwody"
              >
                <Plus className="w-3.5 h-3.5 stroke-[3]" />
                <span>+ Obwody</span>
              </button>
            </div>
          </div>
        </div>

        {/* TOP QUICK STAT CARDS (Responsive 2 columns) */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
          {/* Card: Waga */}
          <div
            onClick={() => {
              setActiveSection('weight');
              setSelectedMetric('weight');
            }}
            className="glass-card p-3 rounded-2xl border border-white/5 cursor-pointer hover:border-[#00F59B]/40 transition-all space-y-1"
          >
            <div className="flex items-center justify-between text-slate-400 text-[10px] font-bold uppercase tracking-wider">
              <span>Waga ciała</span>
              <Scale className="w-3.5 h-3.5 text-[#00F59B]" />
            </div>
            <div className="text-base font-black text-white">
              {weightStats ? `${weightStats.current} kg` : 'Brak danych'}
            </div>
            <div className="flex items-center gap-1 text-[10px] font-mono font-bold">
              {weightStats ? (
                <>
                  <span className={weightStats.changeTotal >= 0 ? 'text-[#00F59B]' : 'text-amber-400'}>
                    {weightStats.changeTotal >= 0 ? `+${weightStats.changeTotal}` : weightStats.changeTotal} kg
                  </span>
                  <span className="text-slate-500">od startu</span>
                </>
              ) : (
                <span className="text-slate-500">Dodaj pomiar</span>
              )}
            </div>
          </div>

          {/* Card: Biceps */}
          <div
            onClick={() => {
              setActiveSection('measurements');
              setSelectedMetric('biceps');
            }}
            className="glass-card p-3 rounded-2xl border border-white/5 cursor-pointer hover:border-[#00F59B]/40 transition-all space-y-1"
          >
            <div className="flex items-center justify-between text-slate-400 text-[10px] font-bold uppercase tracking-wider">
              <span>Biceps</span>
              <Ruler className="w-3.5 h-3.5 text-teal-400" />
            </div>
            <div className="text-base font-black text-white">
              {bodyPartStats.biceps ? `${bodyPartStats.biceps.current} cm` : 'Brak'}
            </div>
            <div className="flex items-center gap-1 text-[10px] font-mono font-bold">
              {bodyPartStats.biceps ? (
                <>
                  <span className={bodyPartStats.biceps.changeTotal >= 0 ? 'text-[#00F59B]' : 'text-amber-400'}>
                    {bodyPartStats.biceps.changeTotal >= 0 ? `+${bodyPartStats.biceps.changeTotal}` : bodyPartStats.biceps.changeTotal} cm
                  </span>
                  <span className="text-slate-500">({bodyPartStats.biceps.percentChange >= 0 ? `+${bodyPartStats.biceps.percentChange}` : bodyPartStats.biceps.percentChange}%)</span>
                </>
              ) : (
                <span className="text-slate-500">Dodaj obwód</span>
              )}
            </div>
          </div>

          {/* Card: Klatka lub Talia */}
          <div
            onClick={() => {
              setActiveSection('measurements');
              setSelectedMetric('waist');
            }}
            className="glass-card p-3 rounded-2xl border border-white/5 cursor-pointer hover:border-[#00F59B]/40 transition-all space-y-1 col-span-2 sm:col-span-1"
          >
            <div className="flex items-center justify-between text-slate-400 text-[10px] font-bold uppercase tracking-wider">
              <span>Talia (Pas)</span>
              <Activity className="w-3.5 h-3.5 text-emerald-400" />
            </div>
            <div className="text-base font-black text-white">
              {bodyPartStats.waist ? `${bodyPartStats.waist.current} cm` : 'Brak'}
            </div>
            <div className="flex items-center gap-1 text-[10px] font-mono font-bold">
              {bodyPartStats.waist ? (
                <>
                  <span className={bodyPartStats.waist.changeTotal <= 0 ? 'text-[#00F59B]' : 'text-amber-400'}>
                    {bodyPartStats.waist.changeTotal >= 0 ? `+${bodyPartStats.waist.changeTotal}` : bodyPartStats.waist.changeTotal} cm
                  </span>
                  <span className="text-slate-500">od startu</span>
                </>
              ) : (
                <span className="text-slate-500">Dodaj obwód</span>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* 2. THREE MAIN SECTION TABS */}
      <nav aria-label="Sekcje pomiarów" className="flex items-center gap-1 p-1 bg-[#0A0F18] border border-slate-800 rounded-2xl">
        <button
          type="button"
          onClick={() => setActiveSection('measurements')}
          className={`flex-1 py-2 rounded-xl text-xs font-extrabold transition-all flex items-center justify-center gap-1.5 ${
            activeSection === 'measurements'
              ? 'bg-gradient-to-r from-emerald-500/20 to-teal-500/20 text-[#00F59B] border border-[#00F59B]/40 shadow-sm'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <Ruler className="w-3.5 h-3.5" />
          <span>Pomiary ciała</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveSection('weight')}
          className={`flex-1 py-2 rounded-xl text-xs font-extrabold transition-all flex items-center justify-center gap-1.5 ${
            activeSection === 'weight'
              ? 'bg-gradient-to-r from-emerald-500/20 to-teal-500/20 text-[#00F59B] border border-[#00F59B]/40 shadow-sm'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <Scale className="w-3.5 h-3.5" />
          <span>Waga ciała</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveSection('analysis')}
          className={`flex-1 py-2 rounded-xl text-xs font-extrabold transition-all flex items-center justify-center gap-1.5 ${
            activeSection === 'analysis'
              ? 'bg-gradient-to-r from-emerald-500/20 to-teal-500/20 text-[#00F59B] border border-[#00F59B]/40 shadow-sm'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <TrendingUp className="w-3.5 h-3.5" />
          <span>Analiza</span>
        </button>
      </nav>

      {/* 3. METRIC SELECTOR FOR CHART (Horizontal Scrollable Chips) */}
      <section aria-label="Wybór analizowanego parametru" className="space-y-1.5">
        <div className="flex items-center justify-between text-[11px] font-bold text-slate-400 px-1">
          <span>Wybierz parametr do analizy i wykresu:</span>
        </div>
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
          <button
            type="button"
            onClick={() => setSelectedMetric('weight')}
            className={`px-3 py-1.5 rounded-xl text-xs font-extrabold whitespace-nowrap transition-all border ${
              selectedMetric === 'weight'
                ? 'bg-emerald-500/25 border-[#00F59B] text-[#00F59B] shadow-sm'
                : 'bg-slate-900 border-slate-800 text-slate-400 hover:bg-slate-800'
            }`}
          >
            ⚖️ Waga
          </button>
          {BODY_PARTS_CONFIG.map((p) => (
            <button
              key={p.key}
              type="button"
              onClick={() => setSelectedMetric(p.key)}
              className={`px-3 py-1.5 rounded-xl text-xs font-extrabold whitespace-nowrap transition-all border ${
                selectedMetric === p.key
                  ? 'bg-emerald-500/25 border-[#00F59B] text-[#00F59B] shadow-sm'
                  : 'bg-slate-900 border-slate-800 text-slate-400 hover:bg-slate-800'
              }`}
            >
              {p.label}
            </button>
          ))}
        </div>
      </section>

      {/* 4. DYNAMIC LINE CHART */}
      <section aria-label="Wykres progresu">{renderSvgChart()}</section>

      {/* 5. TAB CONTENT: BODY MEASUREMENTS */}
      {activeSection === 'measurements' && (
        <div className="space-y-4">
          {/* Summary table of all body parts */}
          <div className="glass-card p-4 rounded-3xl border border-white/5 space-y-3">
            <div className="flex items-center justify-between border-b border-slate-800 pb-2">
              <h2 className="text-xs font-extrabold uppercase tracking-wider text-white flex items-center gap-1.5">
                <Ruler className="w-4 h-4 text-[#00F59B]" />
                <span>Stan obwodów ciała</span>
              </h2>
              <span className="text-[10px] text-slate-400 font-mono">Wszystkie w cm</span>
            </div>

            <div className="grid grid-cols-2 gap-2">
              {BODY_PARTS_CONFIG.map((part) => {
                const stat = bodyPartStats[part.key];
                return (
                  <div
                    key={part.key}
                    onClick={() => setSelectedMetric(part.key)}
                    className={`p-2.5 rounded-2xl border transition-all cursor-pointer ${
                      selectedMetric === part.key
                        ? 'bg-emerald-950/40 border-[#00F59B]/50'
                        : 'bg-[#090D14] border-slate-800/80 hover:border-slate-700'
                    }`}
                  >
                    <div className="text-[11px] font-bold text-slate-400 flex items-center justify-between">
                      <span>{part.label}</span>
                      {stat && (
                        <span className="text-[9px] text-slate-500 font-mono">
                          {stat.count} pom.
                        </span>
                      )}
                    </div>
                    {stat ? (
                      <div className="mt-1 flex items-baseline justify-between">
                        <span className="text-sm font-black text-white font-mono">
                          {stat.current} cm
                        </span>
                        <span
                          className={`text-[10px] font-mono font-extrabold ${
                            stat.changeTotal > 0
                              ? 'text-[#00F59B]'
                              : stat.changeTotal < 0
                              ? 'text-amber-400'
                              : 'text-slate-400'
                          }`}
                        >
                          {stat.changeTotal > 0 ? `+${stat.changeTotal}` : stat.changeTotal} cm
                        </span>
                      </div>
                    ) : (
                      <div className="text-[11px] text-slate-500 mt-1">Brak pomiaru</div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* History of Measurements */}
          <div className="space-y-2">
            <div className="flex items-center justify-between px-1">
              <h2 className="text-xs font-extrabold uppercase tracking-wider text-slate-300">
                Historia pomiarów ciała ({measurements.length})
              </h2>
              <button
                type="button"
                onClick={openAddMeasurementModal}
                className="text-xs font-extrabold text-[#00F59B] hover:underline"
              >
                + Dodaj nowy
              </button>
            </div>

            {measurements.length === 0 ? (
              <div className="p-6 text-center bg-[#090D14] rounded-2xl border border-slate-800 text-slate-400 text-xs">
                Brak zapisanych pomiarów ciała. Kliknij „+ Obwody” powyżej.
              </div>
            ) : (
              <div className="space-y-2">
                {[...measurements].reverse().map((m) => (
                  <div
                    key={m.id}
                    className="glass-card p-3.5 rounded-2xl border border-white/5 space-y-2 hover:border-[#00F59B]/30 transition-all"
                  >
                    <div className="flex items-center justify-between border-b border-slate-800/80 pb-2">
                      <div className="flex items-center gap-2">
                        <Calendar className="w-3.5 h-3.5 text-[#00F59B]" />
                        <span className="text-xs font-extrabold text-white font-mono">{m.date}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <button
                          type="button"
                          onClick={() => openEditMeasurementModal(m)}
                          className="p-1 rounded-lg bg-slate-800/80 text-slate-300 hover:text-[#00F59B] border border-slate-700/60"
                          title="Edytuj pomiar"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => setDeleteMeasCandidate(m)}
                          className="p-1 rounded-lg bg-rose-950/40 text-rose-400 hover:text-rose-300 border border-rose-500/30"
                          title="Usuń wpis"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>

                    {/* Recorded circumferences badges */}
                    <div className="grid grid-cols-4 gap-1.5 text-center">
                      {BODY_PARTS_CONFIG.map((part) => {
                        const val = m[part.key];
                        if (val === undefined || val === null) return null;
                        return (
                          <div key={part.key} className="bg-[#06090E] p-1.5 rounded-xl border border-slate-800/60">
                            <span className="text-[9px] text-slate-400 block truncate">{part.label}</span>
                            <span className="text-xs font-bold text-white font-mono">{val}</span>
                          </div>
                        );
                      })}
                    </div>

                    {m.notes && (
                      <div className="text-[11px] text-slate-400 bg-slate-900/50 rounded-xl px-2.5 py-1 border border-slate-800 italic">
                        {m.notes}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* 6. TAB CONTENT: BODY WEIGHT */}
      {activeSection === 'weight' && (
        <div className="space-y-4">
          {/* Weight overview card */}
          {weightStats && (
            <div className="glass-card p-4 rounded-3xl border border-white/5 space-y-3">
              <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                <div>
                  <span className="text-[10px] font-extrabold uppercase text-[#00F59B]">MASA CIAŁA</span>
                  <div className="text-2xl font-black text-white">{weightStats.current} kg</div>
                </div>
                <div className="text-right">
                  <span className="text-[10px] text-slate-400 font-bold block">ZMIEŃ OD STARTU</span>
                  <span
                    className={`text-sm font-black font-mono ${
                      weightStats.changeTotal >= 0 ? 'text-[#00F59B]' : 'text-amber-400'
                    }`}
                  >
                    {weightStats.changeTotal >= 0 ? `+${weightStats.changeTotal}` : weightStats.changeTotal} kg
                    <span className="text-xs text-slate-400 ml-1">
                      ({weightStats.percentChange >= 0 ? `+${weightStats.percentChange}` : weightStats.percentChange}%)
                    </span>
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-2 text-center text-xs">
                <div className="bg-[#090D14] p-2 rounded-2xl border border-slate-800">
                  <span className="text-[9px] text-slate-400 uppercase font-bold block">Start</span>
                  <span className="font-bold text-white font-mono">{weightStats.start} kg</span>
                </div>
                <div className="bg-[#090D14] p-2 rounded-2xl border border-slate-800">
                  <span className="text-[9px] text-slate-400 uppercase font-bold block">Najniższa</span>
                  <span className="font-bold text-emerald-400 font-mono">{weightStats.min} kg</span>
                </div>
                <div className="bg-[#090D14] p-2 rounded-2xl border border-slate-800">
                  <span className="text-[9px] text-slate-400 uppercase font-bold block">Najwyższa</span>
                  <span className="font-bold text-amber-300 font-mono">{weightStats.max} kg</span>
                </div>
              </div>
            </div>
          )}

          {/* Weight entries history */}
          <div className="space-y-2">
            <div className="flex items-center justify-between px-1">
              <h2 className="text-xs font-extrabold uppercase tracking-wider text-slate-300">
                Historia ważenia ({weights.length})
              </h2>
              <button
                type="button"
                onClick={openAddWeightModal}
                className="text-xs font-extrabold text-[#00F59B] hover:underline"
              >
                + Zapisz wagę
              </button>
            </div>

            {weights.length === 0 ? (
              <div className="p-6 text-center bg-[#090D14] rounded-2xl border border-slate-800 text-slate-400 text-xs">
                Brak zapisanych wpisów wagi. Kliknij „+ Waga” powyżej.
              </div>
            ) : (
              <div className="space-y-1.5">
                {[...weights].reverse().map((w, idx, arr) => {
                  const prevEntry = arr[idx + 1];
                  const diffPrev = prevEntry ? Number((w.weight - prevEntry.weight).toFixed(2)) : null;

                  return (
                    <div
                      key={w.id}
                      className="glass-card p-3 rounded-2xl border border-white/5 flex items-center justify-between hover:border-[#00F59B]/30 transition-all"
                    >
                      <div className="space-y-0.5">
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-extrabold text-white font-mono">{w.date}</span>
                          {diffPrev !== null && (
                            <span
                              className={`text-[10px] font-mono font-bold px-1.5 py-0.2 rounded-md ${
                                diffPrev > 0
                                  ? 'bg-emerald-950/60 text-[#00F59B] border border-emerald-500/30'
                                  : diffPrev < 0
                                  ? 'bg-amber-950/60 text-amber-300 border border-amber-500/30'
                                  : 'bg-slate-800 text-slate-400'
                              }`}
                            >
                              {diffPrev > 0 ? `+${diffPrev}` : diffPrev} kg
                            </span>
                          )}
                        </div>
                        {w.notes && <p className="text-[10px] text-slate-400 italic">{w.notes}</p>}
                      </div>

                      <div className="flex items-center gap-3">
                        <span className="text-base font-black text-white font-mono">{w.weight} kg</span>
                        <div className="flex items-center gap-1">
                          <button
                            type="button"
                            onClick={() => openEditWeightModal(w)}
                            className="p-1 rounded-lg bg-slate-800 text-slate-300 hover:text-[#00F59B]"
                            title="Edytuj wagę"
                          >
                            <Edit3 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            type="button"
                            onClick={() => setDeleteWeightCandidate(w)}
                            className="p-1 rounded-lg bg-rose-950/40 text-rose-400 hover:text-rose-300"
                            title="Usuń wpis"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      )}

      {/* 7. TAB CONTENT: DETAILED PROGRESS ANALYSIS */}
      {activeSection === 'analysis' && (
        <div className="space-y-4">
          <div className="glass-card p-4 rounded-3xl border border-white/5 space-y-3">
            <div className="flex items-center justify-between border-b border-slate-800 pb-2">
              <div>
                <span className="text-[10px] font-extrabold uppercase text-[#00F59B]">ANALIZA MATEMATYCZNA</span>
                <h2 className="text-sm font-extrabold text-white">
                  Szczegóły: {activeMetricStat?.label || 'Wybrany parametr'}
                </h2>
              </div>
              <span className="text-xs font-extrabold text-[#00F59B] bg-emerald-950/80 px-2.5 py-1 rounded-xl border border-[#00F59B]/30">
                {activeMetricStat?.unit}
              </span>
            </div>

            {activeMetricStat ? (
              <div className="space-y-3">
                {/* 4 Key Math Metrics */}
                <div className="grid grid-cols-2 gap-2">
                  <div className="bg-[#070A0F] p-3 rounded-2xl border border-slate-800 space-y-1">
                    <span className="text-[10px] font-bold text-slate-400 uppercase">Aktualny wynik</span>
                    <div className="text-lg font-black text-white font-mono">
                      {activeMetricStat.current} {activeMetricStat.unit}
                    </div>
                    <span className="text-[10px] text-slate-500">Start: {activeMetricStat.start} {activeMetricStat.unit}</span>
                  </div>

                  <div className="bg-[#070A0F] p-3 rounded-2xl border border-slate-800 space-y-1">
                    <span className="text-[10px] font-bold text-slate-400 uppercase">Zmiana od początku</span>
                    <div
                      className={`text-lg font-black font-mono ${
                        activeMetricStat.changeTotal >= 0 ? 'text-[#00F59B]' : 'text-amber-400'
                      }`}
                    >
                      {activeMetricStat.changeTotal >= 0 ? `+${activeMetricStat.changeTotal}` : activeMetricStat.changeTotal} {activeMetricStat.unit}
                    </div>
                    <span className="text-[10px] text-slate-500 font-mono">
                      Procentowo: {activeMetricStat.percentChange >= 0 ? `+${activeMetricStat.percentChange}` : activeMetricStat.percentChange}%
                    </span>
                  </div>

                  <div className="bg-[#070A0F] p-3 rounded-2xl border border-slate-800 space-y-1">
                    <span className="text-[10px] font-bold text-slate-400 uppercase">Tempo miesięczne</span>
                    <div className="text-base font-black text-[#00F59B] font-mono">
                      {activeMetricStat.monthlyRateString}
                    </div>
                    <span className="text-[10px] text-slate-500">
                      Tygodniowo: {activeMetricStat.weeklyChange >= 0 ? `+${activeMetricStat.weeklyChange}` : activeMetricStat.weeklyChange} {activeMetricStat.unit}
                    </span>
                  </div>

                  <div className="bg-[#070A0F] p-3 rounded-2xl border border-slate-800 space-y-1">
                    <span className="text-[10px] font-bold text-slate-400 uppercase">Trend progresu</span>
                    <div className="flex items-center gap-1.5 text-base font-extrabold text-white">
                      {activeMetricStat.trend === 'rośnie' && (
                        <>
                          <TrendingUp className="w-4 h-4 text-[#00F59B]" />
                          <span className="text-[#00F59B]">Rośnie</span>
                        </>
                      )}
                      {activeMetricStat.trend === 'spada' && (
                        <>
                          <TrendingDown className="w-4 h-4 text-amber-400" />
                          <span className="text-amber-400">Spada</span>
                        </>
                      )}
                      {activeMetricStat.trend === 'stabilnie' && (
                        <>
                          <Minus className="w-4 h-4 text-slate-300" />
                          <span className="text-slate-300">Stabilnie</span>
                        </>
                      )}
                    </div>
                    <span className="text-[10px] text-slate-500 font-mono">
                      Liczba pomiarów: {activeMetricStat.count}
                    </span>
                  </div>
                </div>
              </div>
            ) : (
              <div className="p-6 text-center text-slate-400 text-xs">
                Brak wystarczającej liczby pomiarów do obliczenia statystyk dla tego parametru.
              </div>
            )}
          </div>

          {/* Quick list of all parts progress rates */}
          <div className="glass-card p-4 rounded-3xl border border-white/5 space-y-2.5">
            <h3 className="text-xs font-extrabold uppercase tracking-wider text-slate-300">
              Przegląd tempa zmian wszystkich partii
            </h3>
            <div className="space-y-1.5">
              {BODY_PARTS_CONFIG.map((part) => {
                const stat = bodyPartStats[part.key];
                if (!stat) return null;
                return (
                  <div
                    key={part.key}
                    onClick={() => setSelectedMetric(part.key)}
                    className="p-2 rounded-xl bg-[#090D14] border border-slate-800 flex items-center justify-between text-xs cursor-pointer hover:border-[#00F59B]/40"
                  >
                    <span className="font-bold text-white">{part.label}</span>
                    <div className="flex items-center gap-3 font-mono">
                      <span className="text-slate-300">{stat.current} cm</span>
                      <span className={stat.changeTotal >= 0 ? 'text-[#00F59B]' : 'text-amber-400'}>
                        {stat.changeTotal >= 0 ? `+${stat.changeTotal}` : stat.changeTotal} cm
                      </span>
                      <span className="text-[10px] text-slate-400">{stat.monthlyRateString}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* 8. MODAL: ADD / EDIT BODY MEASUREMENT */}
      {(isAddMeasurementOpen || editingMeasurement) && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md select-none">
          <div className="w-full max-w-sm glass-card border border-slate-700/80 rounded-3xl p-5 shadow-2xl space-y-3.5 animate-in fade-in zoom-in-95 duration-150 max-h-[90vh] flex flex-col">
            <div className="flex items-center justify-between border-b border-slate-800 pb-2.5 shrink-0">
              <div>
                <span className="text-[10px] font-extrabold uppercase tracking-wider text-[#00F59B]">
                  {editingMeasurement ? 'EDYCJA POMIARU' : 'NOWY POMIAR CIAŁA'}
                </span>
                <h3 className="text-base font-extrabold text-white">
                  {editingMeasurement ? 'Edytuj obwody' : 'Wpisz obwody (cm)'}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => {
                  setIsAddMeasurementOpen(false);
                  setEditingMeasurement(null);
                }}
                className="text-slate-400 hover:text-white p-1 rounded-xl"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="overflow-y-auto space-y-3 flex-1 pr-1">
              {/* Date */}
              <div>
                <label className="block text-[11px] font-bold text-slate-300 uppercase tracking-wider mb-1">
                  Data pomiaru:
                </label>
                <input
                  type="date"
                  value={measDate}
                  onChange={(e) => setMeasDate(e.target.value)}
                  className="w-full bg-[#070A0F] border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-[#00F59B]"
                />
              </div>

              {/* 8 Body parts inputs */}
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-[10px] font-bold text-slate-400 uppercase mb-0.5">Biceps [cm]</label>
                  <input
                    type="text"
                    value={measBiceps}
                    onChange={(e) => setMeasBiceps(e.target.value)}
                    placeholder="np. 38.5"
                    className="w-full bg-[#070A0F] border border-slate-700 rounded-xl p-2 text-xs text-white font-bold"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-slate-400 uppercase mb-0.5">Triceps [cm]</label>
                  <input
                    type="text"
                    value={measTriceps}
                    onChange={(e) => setMeasTriceps(e.target.value)}
                    placeholder="np. 31.5"
                    className="w-full bg-[#070A0F] border border-slate-700 rounded-xl p-2 text-xs text-white font-bold"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-slate-400 uppercase mb-0.5">Klatka piersiowa [cm]</label>
                  <input
                    type="text"
                    value={measChest}
                    onChange={(e) => setMeasChest(e.target.value)}
                    placeholder="np. 106.0"
                    className="w-full bg-[#070A0F] border border-slate-700 rounded-xl p-2 text-xs text-white font-bold"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-slate-400 uppercase mb-0.5">Barki [cm]</label>
                  <input
                    type="text"
                    value={measShoulders}
                    onChange={(e) => setMeasShoulders(e.target.value)}
                    placeholder="np. 123.0"
                    className="w-full bg-[#070A0F] border border-slate-700 rounded-xl p-2 text-xs text-white font-bold"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-slate-400 uppercase mb-0.5">Talia (Pas) [cm]</label>
                  <input
                    type="text"
                    value={measWaist}
                    onChange={(e) => setMeasWaist(e.target.value)}
                    placeholder="np. 83.5"
                    className="w-full bg-[#070A0F] border border-slate-700 rounded-xl p-2 text-xs text-white font-bold"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-slate-400 uppercase mb-0.5">Biodra [cm]</label>
                  <input
                    type="text"
                    value={measHips}
                    onChange={(e) => setMeasHips(e.target.value)}
                    placeholder="np. 97.5"
                    className="w-full bg-[#070A0F] border border-slate-700 rounded-xl p-2 text-xs text-white font-bold"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-slate-400 uppercase mb-0.5">Udo [cm]</label>
                  <input
                    type="text"
                    value={measThigh}
                    onChange={(e) => setMeasThigh(e.target.value)}
                    placeholder="np. 60.5"
                    className="w-full bg-[#070A0F] border border-slate-700 rounded-xl p-2 text-xs text-white font-bold"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-slate-400 uppercase mb-0.5">Łydka [cm]</label>
                  <input
                    type="text"
                    value={measCalf}
                    onChange={(e) => setMeasCalf(e.target.value)}
                    placeholder="np. 38.5"
                    className="w-full bg-[#070A0F] border border-slate-700 rounded-xl p-2 text-xs text-white font-bold"
                  />
                </div>
              </div>

              {/* Notes */}
              <div>
                <label className="block text-[11px] font-bold text-slate-300 uppercase tracking-wider mb-1">
                  Notatka / Uwagi:
                </label>
                <input
                  type="text"
                  value={measNotes}
                  onChange={(e) => setMeasNotes(e.target.value)}
                  placeholder="np. Rano na czczo, pompa po treningu..."
                  className="w-full bg-[#070A0F] border border-slate-700 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-[#00F59B]"
                />
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-2 pt-2 border-t border-slate-800 shrink-0">
              <button
                type="button"
                onClick={() => {
                  setIsAddMeasurementOpen(false);
                  setEditingMeasurement(null);
                }}
                className="flex-1 py-2.5 rounded-xl border border-slate-700 text-slate-300 text-xs font-bold hover:bg-slate-800"
              >
                Anuluj
              </button>
              <button
                type="button"
                onClick={submitMeasurementForm}
                className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-[#00F59B] to-[#06D6A0] text-[#06090E] text-xs font-extrabold neon-glow-btn"
              >
                {editingMeasurement ? 'Zapisz zmiany' : 'Zapisz pomiar'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 9. MODAL: ADD / EDIT BODY WEIGHT */}
      {(isAddWeightOpen || editingWeight) && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md select-none">
          <div className="w-full max-w-sm glass-card border border-slate-700/80 rounded-3xl p-5 shadow-2xl space-y-4 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between border-b border-slate-800 pb-2.5">
              <div>
                <span className="text-[10px] font-extrabold uppercase tracking-wider text-[#00F59B]">
                  {editingWeight ? 'EDYCJA WAGI' : 'NOWY POMIAR WAGI'}
                </span>
                <h3 className="text-base font-extrabold text-white">
                  {editingWeight ? 'Edytuj masę ciała' : 'Zapisz wagę ciała'}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => {
                  setIsAddWeightOpen(false);
                  setEditingWeight(null);
                }}
                className="text-slate-400 hover:text-white p-1 rounded-xl"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3">
              <div>
                <label className="block text-[11px] font-bold text-slate-300 uppercase tracking-wider mb-1">
                  Data:
                </label>
                <input
                  type="date"
                  value={weightDate}
                  onChange={(e) => setWeightDate(e.target.value)}
                  className="w-full bg-[#070A0F] border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-[#00F59B]"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-300 uppercase tracking-wider mb-1">
                  Masa ciała [kg]:
                </label>
                <input
                  type="text"
                  value={weightValue}
                  onChange={(e) => setWeightValue(e.target.value)}
                  placeholder="np. 78.4"
                  className="w-full bg-[#070A0F] border border-slate-700 rounded-xl px-3 py-2 text-sm text-white font-black text-center focus:outline-none focus:border-[#00F59B]"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-300 uppercase tracking-wider mb-1">
                  Uwagi:
                </label>
                <input
                  type="text"
                  value={weightNotes}
                  onChange={(e) => setWeightNotes(e.target.value)}
                  placeholder="np. Rano na czczo po toalecie..."
                  className="w-full bg-[#070A0F] border border-slate-700 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-[#00F59B]"
                />
              </div>
            </div>

            <div className="flex gap-2 pt-2 border-t border-slate-800">
              <button
                type="button"
                onClick={() => {
                  setIsAddWeightOpen(false);
                  setEditingWeight(null);
                }}
                className="flex-1 py-2.5 rounded-xl border border-slate-700 text-slate-300 text-xs font-bold hover:bg-slate-800"
              >
                Anuluj
              </button>
              <button
                type="button"
                disabled={!weightValue.trim()}
                onClick={submitWeightForm}
                className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-[#00F59B] to-[#06D6A0] text-[#06090E] text-xs font-extrabold neon-glow-btn disabled:opacity-30 disabled:pointer-events-none"
              >
                {editingWeight ? 'Zapisz zmiany' : 'Zapisz wagę'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 10. DELETE CONFIRMATION MODALS */}
      {deleteMeasCandidate && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md select-none">
          <div className="w-full max-w-xs glass-card border border-rose-500/50 rounded-3xl p-5 shadow-2xl space-y-3 animate-in fade-in zoom-in-95 duration-150 text-center">
            <Trash2 className="w-9 h-9 text-rose-400 mx-auto" />
            <h4 className="text-sm font-extrabold text-white">Usunąć pomiar?</h4>
            <p className="text-xs text-slate-300">
              Czy na pewno chcesz usunąć pomiar obwodów z dnia <strong className="text-white">{deleteMeasCandidate.date}</strong>?
            </p>
            <div className="flex gap-2 pt-2">
              <button
                type="button"
                onClick={() => setDeleteMeasCandidate(null)}
                className="flex-1 py-2 rounded-xl border border-slate-700 text-slate-300 text-xs font-bold hover:bg-slate-800"
              >
                Anuluj
              </button>
              <button
                type="button"
                onClick={() => {
                  handleDeleteMeasurement(deleteMeasCandidate.id, deleteMeasCandidate.date);
                  setDeleteMeasCandidate(null);
                }}
                className="flex-1 py-2 rounded-xl bg-rose-600 text-white text-xs font-bold hover:bg-rose-500"
              >
                Usuń
              </button>
            </div>
          </div>
        </div>
      )}

      {deleteWeightCandidate && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md select-none">
          <div className="w-full max-w-xs glass-card border border-rose-500/50 rounded-3xl p-5 shadow-2xl space-y-3 animate-in fade-in zoom-in-95 duration-150 text-center">
            <Trash2 className="w-9 h-9 text-rose-400 mx-auto" />
            <h4 className="text-sm font-extrabold text-white">Usunąć wpis wagi?</h4>
            <p className="text-xs text-slate-300">
              Czy na pewno chcesz usunąć wpis wagi <strong className="text-white">{deleteWeightCandidate.weight} kg</strong> z dnia <strong className="text-white">{deleteWeightCandidate.date}</strong>?
            </p>
            <div className="flex gap-2 pt-2">
              <button
                type="button"
                onClick={() => setDeleteWeightCandidate(null)}
                className="flex-1 py-2 rounded-xl border border-slate-700 text-slate-300 text-xs font-bold hover:bg-slate-800"
              >
                Anuluj
              </button>
              <button
                type="button"
                onClick={() => {
                  handleDeleteWeight(deleteWeightCandidate.id, deleteWeightCandidate.date);
                  setDeleteWeightCandidate(null);
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
