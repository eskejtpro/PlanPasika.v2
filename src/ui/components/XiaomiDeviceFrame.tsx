import React, { useState, useEffect } from 'react';
import {
  Wifi,
  BatteryCharging,
  Smartphone,
  Maximize2,
  Code2,
} from 'lucide-react';
import { NavTabId, NavTabs } from '../../navigation/NavTabs';
import { SettingsRepo } from '../../data/settingsRepo';
import { THEME_PRESETS, AppThemeId } from '../../domain/settingsTypes';

interface XiaomiDeviceFrameProps {
  currentTab: NavTabId;
  onSelectTab: (tab: NavTabId) => void;
  activeWorkoutRunning: boolean;
  onOpenCodeViewer: () => void;
  children: React.ReactNode;
}

export const XiaomiDeviceFrame: React.FC<XiaomiDeviceFrameProps> = ({
  currentTab,
  onSelectTab,
  activeWorkoutRunning,
  onOpenCodeViewer,
  children,
}) => {
  const [isFrameMode, setIsFrameMode] = useState<boolean>(true);
  const [currentTimeStr, setCurrentTimeStr] = useState<string>('15:23');
  const [themeId, setThemeId] = useState<AppThemeId>(() => SettingsRepo.getSettings().themeId);

  useEffect(() => {
    const unsub = SettingsRepo.subscribe(() => {
      setThemeId(SettingsRepo.getSettings().themeId);
    });
    return () => unsub();
  }, []);

  const currentTheme = THEME_PRESETS[themeId] || THEME_PRESETS.amoled;

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setCurrentTimeStr(
        now.toLocaleTimeString('pl-PL', { hour: '2-digit', minute: '2-digit' })
      );
    };
    updateTime();
    const interval = setInterval(updateTime, 30000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-[#06080C] flex flex-col items-center justify-start p-0 sm:p-4 md:p-6 text-slate-100 antialiased font-sans">
      {/* Outer Studio Toolbar */}
      <header className="w-full max-w-5xl flex items-center justify-between px-4 py-2.5 mb-2 bg-[#0C111A]/90 border border-[#1A2536] rounded-2xl shadow-md text-xs select-none">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <span
              className="w-2.5 h-2.5 rounded-full animate-pulse"
              style={{
                backgroundColor: currentTheme.colors.primary,
                boxShadow: `0 0 10px ${currentTheme.colors.primary}`,
              }}
            />
            <span className="font-extrabold text-white tracking-tight text-sm">
              PlanPasika<span style={{ color: currentTheme.colors.primary }}>.v2</span>
            </span>
          </div>
          <span className="hidden sm:inline-block text-slate-600">|</span>
          <span className="hidden sm:inline-flex items-center gap-1.5 text-slate-400 font-mono text-[11px] bg-slate-900/80 px-2 py-0.5 rounded-md border border-slate-800">
            <Smartphone className="w-3.5 h-3.5 text-[#00F59B]" />
            Xiaomi 14T · HyperOS · {currentTheme.name}
          </span>
        </div>

        <div className="flex items-center gap-2">
          {/* Kotlin Code Viewer Button */}
          <button
            type="button"
            onClick={onOpenCodeViewer}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-500/15 hover:bg-emerald-500/25 text-emerald-300 font-semibold border border-emerald-500/30 transition-all text-xs"
          >
            <Code2 className="w-3.5 h-3.5" />
            <span>Kod Kotlin / Compose</span>
          </button>

          {/* Toggle Device Frame vs Fullscreen */}
          <button
            type="button"
            onClick={() => setIsFrameMode(!isFrameMode)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-medium transition-all text-xs"
            title={isFrameMode ? 'Przełącz na pełny ekran' : 'Włącz ramkę telefonu Xiaomi 14T'}
          >
            {isFrameMode ? (
              <>
                <Maximize2 className="w-3.5 h-3.5 text-slate-400" />
                <span className="hidden md:inline">Pełny widok</span>
              </>
            ) : (
              <>
                <Smartphone className="w-3.5 h-3.5 text-emerald-400" />
                <span className="hidden md:inline">Ramka Xiaomi 14T</span>
              </>
            )}
          </button>
        </div>
      </header>

      {/* Main Container - either Xiaomi 14T Frame or Full width */}
      <div
        className={`w-full transition-all duration-300 flex justify-center ${
          isFrameMode ? 'max-w-[420px]' : 'max-w-2xl'
        }`}
      >
        <div
          style={{
            backgroundColor: currentTheme.colors.bg,
            color: currentTheme.colors.textPrimary,
          }}
          className={`w-full flex flex-col overflow-hidden transition-all ${
            isFrameMode
              ? 'rounded-[46px] border-[10px] border-[#181F2C] shadow-[0_25px_60px_-15px_rgba(0,0,0,0.9),0_0_0_2px_rgba(255,255,255,0.06)] h-[860px]'
              : 'rounded-2xl border border-slate-800 shadow-xl min-h-[820px]'
          }`}
        >
          {/* Xiaomi 14T HyperOS Status Bar */}
          <div
            style={{ backgroundColor: currentTheme.colors.surface }}
            className="shrink-0 h-10 px-5 flex items-center justify-between text-slate-300 select-none text-xs font-semibold relative z-30 border-b border-white/5"
          >
            {/* Clock */}
            <span className="font-mono text-[12px] text-white font-bold tracking-tight">
              {currentTimeStr}
            </span>

            {/* Xiaomi Punch-Hole Selfie Camera */}
            {isFrameMode && (
              <div className="absolute left-1/2 -translate-x-1/2 top-2.5 w-3.5 h-3.5 bg-black rounded-full border border-slate-800 shadow-inner flex items-center justify-center">
                <span className="w-1 h-1 bg-[#0d1620] rounded-full" />
              </div>
            )}

            {/* Right Status Icons: 5G, Wi-Fi, Battery */}
            <div className="flex items-center gap-1.5 text-slate-300 text-[11px]">
              <span className="font-mono font-bold text-[10px] text-slate-400">5G</span>
              <Wifi className="w-3.5 h-3.5 text-slate-300" />
              <div className="flex items-center gap-1 font-mono text-[11px] text-emerald-400 font-bold">
                <span>98%</span>
                <BatteryCharging className="w-4 h-4 text-emerald-400 fill-emerald-400/20" />
              </div>
            </div>
          </div>

          {/* Screen Content Container (Inside phone display) */}
          <main
            style={{ backgroundColor: currentTheme.colors.bg }}
            className="flex-1 flex flex-col overflow-hidden relative"
          >
            {children}
          </main>

          {/* Bottom Navigation Bar */}
          <NavTabs
            currentTab={currentTab}
            onSelectTab={onSelectTab}
            activeWorkoutRunning={activeWorkoutRunning}
          />

          {/* Xiaomi Android Gesture Bar Indicator */}
          {isFrameMode && (
            <div
              style={{ backgroundColor: currentTheme.colors.surface }}
              className="shrink-0 h-4 flex items-center justify-center pb-1"
            >
              <div className="w-32 h-1 bg-slate-600 rounded-full" />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
