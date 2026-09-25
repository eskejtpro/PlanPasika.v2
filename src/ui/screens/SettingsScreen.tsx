import React, { useState, useRef } from 'react';
import {
  Palette,
  Timer,
  Dumbbell,
  Calendar,
  Ruler,
  Database,
  Smartphone,
  RotateCcw,
  Check,
  CheckCircle2,
  ArrowLeft,
  Volume2,
  VolumeX,
  Vibrate,
  Download,
  Upload,
  Sparkles,
  ShieldAlert,
  Sliders,
  Moon,
  Zap,
  Activity,
  Award,
  Layers,
  CheckCircle,
} from 'lucide-react';
import { useSettingsViewModel } from '../../viewmodel/useSettingsViewModel';
import { AppThemeId, THEME_PRESETS } from '../../domain/settingsTypes';

interface SettingsScreenProps {
  onNavigateBack: () => void;
}

export const SettingsScreen: React.FC<SettingsScreenProps> = ({ onNavigateBack }) => {
  const {
    settings,
    currentTheme,
    toastMessage,
    updateTheme,
    updateSetting,
    resetSettings,
    exportBackup,
    importBackup,
  } = useSettingsViewModel();

  const [showResetConfirm, setShowResetConfirm] = useState<boolean>(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const themeList: AppThemeId[] = [
    'amoled',
    'dark_blue',
    'graphite',
    'purple',
    'red',
    'light',
    'system',
  ];

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      importBackup(file);
    }
  };

  return (
    <div className="flex-1 overflow-y-auto px-4 py-3.5 space-y-4 pb-24 select-none relative">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-14 left-1/2 -translate-x-1/2 z-50 px-4 py-2 rounded-2xl bg-emerald-950/95 border border-[#00F59B] text-[#00F59B] text-xs font-bold shadow-[0_0_20px_rgba(0,245,155,0.4)] flex items-center gap-2 animate-in fade-in duration-150">
          <CheckCircle2 className="w-4 h-4 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Top Header */}
      <div className="flex items-center justify-between pt-1 border-b border-white/10 pb-3">
        <div className="flex items-center gap-2.5">
          <button
            type="button"
            onClick={onNavigateBack}
            className="p-2 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-200 hover:text-white border border-slate-700 transition-all active:scale-95"
            title="Powrót"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <div>
            <span className="text-[10px] font-black uppercase tracking-wider text-[#00F59B] flex items-center gap-1">
              <Sliders className="w-3 h-3" />
              KONFIGURACJA
            </span>
            <h1 className="text-xl font-extrabold text-white tracking-tight">Ustawienia</h1>
          </div>
        </div>

        <button
          type="button"
          onClick={() => setShowResetConfirm(true)}
          className="px-2.5 py-1.5 rounded-xl bg-rose-950/40 text-rose-300 border border-rose-500/30 hover:bg-rose-900/50 text-[11px] font-bold flex items-center gap-1.5 transition-all active:scale-95"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Reset</span>
        </button>
      </div>

      {/* 1. SEKCJA: WYGLĄD / MOTYWY Z MINIATURKAMI UI */}
      <section aria-labelledby="heading-appearance" className="space-y-3">
        <div className="flex items-center justify-between px-1">
          <div className="flex items-center gap-2 text-xs font-black uppercase tracking-wider text-slate-300">
            <Palette className="w-4 h-4 text-[#00F59B]" />
            <h2 id="heading-appearance">1. Wybór motywu aplikacji</h2>
          </div>
          <span className="text-[10px] font-mono text-slate-400">7 stylów</span>
        </div>

        {/* Theme Cards Grid with Rich Miniature Preview */}
        <div className="space-y-2.5">
          {themeList.map((id) => {
            const theme = THEME_PRESETS[id];
            const isSelected = settings.themeId === id;

            return (
              <div
                key={id}
                onClick={() => updateTheme(id)}
                className={`p-3 rounded-2xl border transition-all cursor-pointer relative overflow-hidden ${
                  isSelected
                    ? 'border-[#00F59B] shadow-[0_0_20px_rgba(0,245,155,0.25)] ring-1 ring-[#00F59B]/50'
                    : 'bg-[#090D14] border-slate-800/80 hover:border-slate-700'
                }`}
                style={{
                  backgroundColor: isSelected ? 'rgba(12, 22, 18, 0.85)' : undefined,
                }}
              >
                <div className="flex items-center gap-3.5">
                  {/* MINIATURKA UI (Micro App Screen Mockup) */}
                  <div
                    className="w-20 h-16 rounded-xl border border-white/10 p-1.5 flex flex-col justify-between shrink-0 shadow-inner relative overflow-hidden select-none"
                    style={{ backgroundColor: theme.colors.bg }}
                  >
                    {/* Mini Status & Header */}
                    <div className="flex items-center justify-between">
                      <div
                        className="w-2 h-2 rounded-full"
                        style={{ backgroundColor: theme.colors.primary }}
                      />
                      <div
                        className="h-1.5 w-6 rounded-full opacity-60"
                        style={{ backgroundColor: theme.colors.textSecondary }}
                      />
                    </div>

                    {/* Mini Workout Item Card */}
                    <div
                      className="p-1 rounded-md border flex items-center justify-between"
                      style={{
                        backgroundColor: theme.colors.surface,
                        borderColor: theme.colors.outline,
                      }}
                    >
                      <div className="space-y-0.5">
                        <div
                          className="h-1.5 w-7 rounded-sm font-bold"
                          style={{ backgroundColor: theme.colors.primary }}
                        />
                        <div
                          className="h-1 w-4 rounded-sm opacity-50"
                          style={{ backgroundColor: theme.colors.textSecondary }}
                        />
                      </div>
                      <div
                        className="w-1.5 h-1.5 rounded-full"
                        style={{ backgroundColor: theme.colors.secondary }}
                      />
                    </div>

                    {/* Mini Bottom Nav */}
                    <div
                      className="h-2 rounded-sm flex items-center justify-around px-0.5"
                      style={{ backgroundColor: theme.colors.navBg }}
                    >
                      <span
                        className="w-1.5 h-1 rounded-sm"
                        style={{ backgroundColor: theme.colors.primary }}
                      />
                      <span
                        className="w-1.5 h-1 rounded-sm opacity-40"
                        style={{ backgroundColor: theme.colors.textSecondary }}
                      />
                      <span
                        className="w-1.5 h-1 rounded-sm opacity-40"
                        style={{ backgroundColor: theme.colors.textSecondary }}
                      />
                    </div>
                  </div>

                  {/* Theme info & colors */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <h3 className="text-xs font-black text-white truncate">{theme.name}</h3>
                      {isSelected && (
                        <span className="px-1.5 py-0.2 rounded-md bg-[#00F59B]/20 text-[#00F59B] border border-[#00F59B]/40 text-[9px] font-black uppercase tracking-wider flex items-center gap-0.5">
                          <Check className="w-2.5 h-2.5 stroke-[3]" />
                          Aktywny
                        </span>
                      )}
                    </div>
                    <p className="text-[10px] text-slate-400 mt-0.5 leading-snug truncate">
                      {theme.description}
                    </p>

                    {/* Color Swatches */}
                    <div className="flex items-center gap-1.5 mt-1.5">
                      <span
                        className="w-3 h-3 rounded-full border border-black/40 shadow-sm"
                        style={{ backgroundColor: theme.colors.bg }}
                        title="Tło"
                      />
                      <span
                        className="w-3 h-3 rounded-full border border-black/40 shadow-sm"
                        style={{ backgroundColor: theme.colors.surface }}
                        title="Karty"
                      />
                      <span
                        className="w-3 h-3 rounded-full border border-black/40 shadow-sm"
                        style={{ backgroundColor: theme.colors.primary }}
                        title="Główny akcent"
                      />
                      <span
                        className="w-3 h-3 rounded-full border border-black/40 shadow-sm"
                        style={{ backgroundColor: theme.colors.secondary }}
                        title="Dodatkowy akcent"
                      />
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Dodatkowe opcje wyglądu */}
        <div className="glass-card p-3.5 rounded-3xl border border-white/5 space-y-3">
          <div className="flex items-center gap-2 text-xs font-black uppercase tracking-wider text-slate-300 pb-1 border-b border-white/5">
            <Sparkles className="w-3.5 h-3.5 text-[#00F59B]" />
            <span>Zaawansowany wygląd i efekty</span>
          </div>

          <div className="flex items-center justify-between text-xs">
            <div className="flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-xl bg-slate-900 border border-slate-700 flex items-center justify-center text-slate-300">
                <Moon className="w-4 h-4 text-emerald-400" />
              </div>
              <div>
                <span className="font-bold text-white block">AMOLED Pure Black</span>
                <span className="text-[10px] text-slate-400">Prawdziwa czerń #000000 dla ekranów OLED</span>
              </div>
            </div>
            <input
              type="checkbox"
              checked={settings.amoledPureBlack}
              onChange={(e) => updateSetting('amoledPureBlack', e.target.checked)}
              className="w-4 h-4 accent-[#00F59B] cursor-pointer"
            />
          </div>

          <div className="flex items-center justify-between text-xs">
            <div className="flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-xl bg-slate-900 border border-slate-700 flex items-center justify-center text-slate-300">
                <Zap className="w-4 h-4 text-amber-400" />
              </div>
              <div>
                <span className="font-bold text-white block">Efekty Glow / Neon</span>
                <span className="text-[10px] text-slate-400">Świetliste obramowania i akcenty</span>
              </div>
            </div>
            <input
              type="checkbox"
              checked={settings.glowEffectsEnabled}
              onChange={(e) => updateSetting('glowEffectsEnabled', e.target.checked)}
              className="w-4 h-4 accent-[#00F59B] cursor-pointer"
            />
          </div>

          <div className="flex items-center justify-between text-xs">
            <div className="flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-xl bg-slate-900 border border-slate-700 flex items-center justify-center text-slate-300">
                <Activity className="w-4 h-4 text-sky-400" />
              </div>
              <div>
                <span className="font-bold text-white block">Animacje interfejsu</span>
                <span className="text-[10px] text-slate-400">Płynne przejścia i wejścia kart</span>
              </div>
            </div>
            <input
              type="checkbox"
              checked={settings.animationsEnabled}
              onChange={(e) => updateSetting('animationsEnabled', e.target.checked)}
              className="w-4 h-4 accent-[#00F59B] cursor-pointer"
            />
          </div>

          <div className="pt-2 border-t border-slate-800/80 space-y-1.5">
            <span className="text-[10px] font-bold text-slate-400 uppercase flex items-center gap-1.5">
              <Layers className="w-3.5 h-3.5 text-slate-400" />
              Zaokrąglenie kart:
            </span>
            <div className="grid grid-cols-3 gap-1.5">
              {(['small', 'standard', 'large'] as const).map((r) => (
                <button
                  key={r}
                  type="button"
                  onClick={() => updateSetting('cardRadius', r)}
                  className={`py-1.5 rounded-xl text-xs font-bold border transition-all ${
                    settings.cardRadius === r
                      ? 'bg-[#00F59B]/20 border-[#00F59B] text-[#00F59B]'
                      : 'bg-slate-900 border-slate-800 text-slate-400'
                  }`}
                >
                  {r === 'small' ? 'Małe (8px)' : r === 'standard' ? 'Standard (16px)' : 'Duże (24px)'}
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* 2. SEKCJA: TRENING & TIMERY */}
      <section aria-labelledby="heading-workout" className="space-y-3">
        <div className="flex items-center gap-2 text-xs font-black uppercase tracking-wider text-slate-300 px-1">
          <Timer className="w-4 h-4 text-amber-400" />
          <h2 id="heading-workout">2. Trening i timery przerw</h2>
        </div>

        <div className="glass-card p-3.5 rounded-3xl border border-white/5 space-y-3">
          <div className="flex items-center justify-between text-xs">
            <div>
              <span className="font-bold text-white block">Automatyczny timer przerwy</span>
              <span className="text-[10px] text-slate-400">Uruchom odliczanie natychmiast po serii</span>
            </div>
            <input
              type="checkbox"
              checked={settings.autoRestTimer}
              onChange={(e) => updateSetting('autoRestTimer', e.target.checked)}
              className="w-4 h-4 accent-amber-400 cursor-pointer"
            />
          </div>

          <div className="space-y-1.5 pt-1">
            <div className="flex items-center justify-between text-xs">
              <span className="font-bold text-slate-300">Domyślny czas przerwy:</span>
              <span className="font-mono font-bold text-amber-400">{settings.defaultRestDuration}s</span>
            </div>
            <div className="grid grid-cols-4 gap-1.5">
              {[60, 90, 120, 180].map((sec) => (
                <button
                  key={sec}
                  type="button"
                  onClick={() => updateSetting('defaultRestDuration', sec)}
                  className={`py-1.5 rounded-xl text-xs font-mono font-bold border transition-all ${
                    settings.defaultRestDuration === sec
                      ? 'bg-amber-500/25 border-amber-400 text-amber-300 font-black shadow-sm'
                      : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white'
                  }`}
                >
                  {sec}s
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2 pt-1">
            <div
              onClick={() => updateSetting('soundOnTimerEnd', !settings.soundOnTimerEnd)}
              className={`p-2.5 rounded-2xl border flex items-center gap-2 cursor-pointer transition-all ${
                settings.soundOnTimerEnd
                  ? 'bg-emerald-950/40 border-emerald-500/40 text-emerald-300'
                  : 'bg-slate-900 border-slate-800 text-slate-500'
              }`}
            >
              {settings.soundOnTimerEnd ? <Volume2 className="w-4 h-4 text-[#00F59B]" /> : <VolumeX className="w-4 h-4" />}
              <span className="text-xs font-bold">Dźwięk audio</span>
            </div>

            <div
              onClick={() => updateSetting('vibrationOnTimerEnd', !settings.vibrationOnTimerEnd)}
              className={`p-2.5 rounded-2xl border flex items-center gap-2 cursor-pointer transition-all ${
                settings.vibrationOnTimerEnd
                  ? 'bg-amber-950/40 border-amber-500/40 text-amber-300'
                  : 'bg-slate-900 border-slate-800 text-slate-500'
              }`}
            >
              <Vibrate className="w-4 h-4 text-amber-400" />
              <span className="text-xs font-bold">Wibracja</span>
            </div>
          </div>
        </div>
      </section>

      {/* 3. SEKCJA: PLAN & KALENDARZ & POMIARY */}
      <section aria-labelledby="heading-plan" className="space-y-3">
        <div className="flex items-center gap-2 text-xs font-black uppercase tracking-wider text-slate-300 px-1">
          <Dumbbell className="w-4 h-4 text-sky-400" />
          <h2 id="heading-plan">3. Plan, kalendarz i pomiary</h2>
        </div>

        <div className="glass-card p-3.5 rounded-3xl border border-white/5 space-y-3">
          <div className="flex items-center justify-between text-xs">
            <div>
              <span className="font-bold text-white block">Pierwszy dzień tygodnia</span>
              <span className="text-[10px] text-slate-400">Układ siatki kalendarza i planu</span>
            </div>
            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={() => updateSetting('firstDayOfWeek', 'monday')}
                className={`px-2.5 py-1 rounded-xl text-xs font-bold border transition-all ${
                  settings.firstDayOfWeek === 'monday'
                    ? 'bg-[#00F59B]/20 border-[#00F59B] text-[#00F59B]'
                    : 'bg-slate-900 border-slate-800 text-slate-400'
                }`}
              >
                Poniedziałek
              </button>
              <button
                type="button"
                onClick={() => updateSetting('firstDayOfWeek', 'sunday')}
                className={`px-2.5 py-1 rounded-xl text-xs font-bold border transition-all ${
                  settings.firstDayOfWeek === 'sunday'
                    ? 'bg-[#00F59B]/20 border-[#00F59B] text-[#00F59B]'
                    : 'bg-slate-900 border-slate-800 text-slate-400'
                }`}
              >
                Niedziela
              </button>
            </div>
          </div>

          <div className="flex items-center justify-between text-xs pt-1">
            <div>
              <span className="font-bold text-white block">Miejsca po przecinku w pomiarach</span>
              <span className="text-[10px] text-slate-400">Zaokrąglanie wagi (kg) i obwodów (cm)</span>
            </div>
            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={() => updateSetting('decimalPlaces', 1)}
                className={`px-3 py-1 rounded-xl text-xs font-mono font-bold border transition-all ${
                  settings.decimalPlaces === 1
                    ? 'bg-[#00F59B]/20 border-[#00F59B] text-[#00F59B]'
                    : 'bg-slate-900 border-slate-800 text-slate-400'
                }`}
              >
                0.0
              </button>
              <button
                type="button"
                onClick={() => updateSetting('decimalPlaces', 2)}
                className={`px-3 py-1 rounded-xl text-xs font-mono font-bold border transition-all ${
                  settings.decimalPlaces === 2
                    ? 'bg-[#00F59B]/20 border-[#00F59B] text-[#00F59B]'
                    : 'bg-slate-900 border-slate-800 text-slate-400'
                }`}
              >
                0.00
              </button>
            </div>
          </div>

          <div className="flex items-center justify-between text-xs pt-1">
            <div>
              <span className="font-bold text-white block">Potwierdzaj usuwanie ćwiczeń / dni</span>
              <span className="text-[10px] text-slate-400">Zabezpieczenie przed przypadkowym skasowaniem</span>
            </div>
            <input
              type="checkbox"
              checked={settings.confirmDeleteExercise}
              onChange={(e) => updateSetting('confirmDeleteExercise', e.target.checked)}
              className="w-4 h-4 accent-[#00F59B] cursor-pointer"
            />
          </div>
        </div>
      </section>

      {/* 4. SEKCJA: DANE & KOPIA ZAPASOWA */}
      <section aria-labelledby="heading-data" className="space-y-3">
        <div className="flex items-center gap-2 text-xs font-black uppercase tracking-wider text-slate-300 px-1">
          <Database className="w-4 h-4 text-purple-400" />
          <h2 id="heading-data">4. Zarządzanie danymi (Lokalna baza)</h2>
        </div>

        <div className="glass-card p-3.5 rounded-3xl border border-white/5 space-y-3">
          <p className="text-[11px] text-slate-400 leading-relaxed">
            Wszystkie dane treningowe, pomiary, historia i plany są przechowywane w 100% lokalnie na Twoim urządzeniu.
          </p>

          <div className="grid grid-cols-2 gap-2 pt-1">
            <button
              type="button"
              onClick={exportBackup}
              className="p-2.5 rounded-2xl bg-purple-950/40 text-purple-300 hover:bg-purple-900/60 border border-purple-500/30 text-xs font-bold flex items-center justify-center gap-1.5 transition-all active:scale-95 shadow-sm"
            >
              <Download className="w-4 h-4" />
              <span>Eksportuj kopię</span>
            </button>

            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="p-2.5 rounded-2xl bg-cyan-950/40 text-cyan-300 hover:bg-cyan-900/60 border border-cyan-500/30 text-xs font-bold flex items-center justify-center gap-1.5 transition-all active:scale-95 shadow-sm"
            >
              <Upload className="w-4 h-4" />
              <span>Importuj plik</span>
            </button>
            <input
              ref={fileInputRef}
              type="file"
              accept=".json"
              onChange={handleFileChange}
              className="hidden"
            />
          </div>
        </div>
      </section>

      {/* 5. SEKCJA: APLIKACJA & INFORMACJE */}
      <section aria-labelledby="heading-app" className="space-y-3">
        <div className="flex items-center gap-2 text-xs font-black uppercase tracking-wider text-slate-300 px-1">
          <Smartphone className="w-4 h-4 text-emerald-400" />
          <h2 id="heading-app">5. Informacje o aplikacji</h2>
        </div>

        <div className="glass-card p-3.5 rounded-3xl border border-white/5 space-y-2.5">
          <div className="flex items-center justify-between text-xs">
            <span className="text-slate-400">Nazwa:</span>
            <span className="font-bold text-white">PlanPasika.v2</span>
          </div>
          <div className="flex items-center justify-between text-xs">
            <span className="text-slate-400">Wersja:</span>
            <span className="font-mono font-bold text-[#00F59B]">2.0.0 (HyperOS Edition)</span>
          </div>
          <div className="flex items-center justify-between text-xs">
            <span className="text-slate-400">Urządzenie docelowe:</span>
            <span className="text-slate-200">Xiaomi 14T · 144Hz AMOLED</span>
          </div>

          <div className="pt-2 border-t border-slate-800">
            <button
              type="button"
              onClick={() => setShowResetConfirm(true)}
              className="w-full py-2.5 rounded-2xl bg-rose-950/40 hover:bg-rose-900/60 text-rose-300 border border-rose-500/30 text-xs font-bold transition-all flex items-center justify-center gap-1.5 active:scale-95"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Przywróć domyślne ustawienia</span>
            </button>
            <span className="text-[10px] text-slate-500 text-center block mt-1">
              Resetuje wyłącznie preferencje i motyw (nie usuwa treningów ani pomiarów).
            </span>
          </div>
        </div>
      </section>

      {/* Reset Confirmation Dialog */}
      {showResetConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md select-none">
          <div className="w-full max-w-sm glass-card border border-rose-500/50 rounded-3xl p-5 shadow-2xl space-y-4 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center gap-2.5 text-rose-400">
              <ShieldAlert className="w-5 h-5" />
              <h3 className="text-base font-extrabold text-white">Zresetować ustawienia?</h3>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              Przywróci to domyślny motyw <strong>PlanPasika AMOLED</strong> oraz domyślne parametry timerów. Twoje plany, ćwiczenia, historia treningowa i pomiary pozostaną w 100% nienaruszone.
            </p>
            <div className="flex gap-2 pt-1">
              <button
                type="button"
                onClick={() => setShowResetConfirm(false)}
                className="flex-1 py-2.5 rounded-xl border border-slate-700 text-slate-300 text-xs font-bold hover:bg-slate-800"
              >
                Anuluj
              </button>
              <button
                type="button"
                onClick={() => {
                  resetSettings();
                  setShowResetConfirm(false);
                }}
                className="flex-1 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-black shadow-md"
              >
                Resetuj
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
