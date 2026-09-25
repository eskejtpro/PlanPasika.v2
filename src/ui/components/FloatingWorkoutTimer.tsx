import React, { useState, useEffect, useRef } from 'react';
import {
  Timer,
  Play,
  Pause,
  RotateCcw,
  Plus,
  Minus,
  X,
  Dumbbell,
  Clock,
  ChevronUp,
  ChevronDown,
  Volume2,
  VolumeX,
  FastForward,
} from 'lucide-react';
import { LocalStorageRepo } from '../../data/localStorageRepo';
import { ActiveWorkoutSession } from '../../domain/types';

interface FloatingWorkoutTimerProps {
  onNavigateToWorkout?: () => void;
}

export const FloatingWorkoutTimer: React.FC<FloatingWorkoutTimerProps> = ({
  onNavigateToWorkout,
}) => {
  const [activeSession, setActiveSession] = useState<ActiveWorkoutSession | null>(null);
  const [isExpanded, setIsExpanded] = useState<boolean>(false);
  const [soundEnabled, setSoundEnabled] = useState<boolean>(true);

  // Rest Timer states
  const [restSecondsLeft, setRestSecondsLeft] = useState<number>(0);
  const [initialRestDuration, setInitialRestDuration] = useState<number>(60);
  const [isRestTimerRunning, setIsRestTimerRunning] = useState<boolean>(false);

  // Stopwatch (Manual quick timer) state
  const [lapSeconds, setLapSeconds] = useState<number>(0);
  const [isLapTimerRunning, setIsLapTimerRunning] = useState<boolean>(false);

  const restIntervalRef = useRef<number | null>(null);
  const lapIntervalRef = useRef<number | null>(null);

  // Load and subscribe to active workout
  const loadActiveWorkout = () => {
    const session = LocalStorageRepo.getActiveWorkout();
    setActiveSession(session);
  };

  useEffect(() => {
    loadActiveWorkout();
    const unsub = LocalStorageRepo.subscribe(() => {
      loadActiveWorkout();
    });
    return () => unsub();
  }, []);

  // Web Audio API beep for timer end
  const playTimerEndSound = () => {
    if (!soundEnabled) return;
    try {
      const AudioCtx =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      const ctx = new AudioCtx();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(880, ctx.currentTime); // A5
      osc.frequency.setValueAtTime(1320, ctx.currentTime + 0.15); // E6

      gain.gain.setValueAtTime(0.2, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.5);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start();
      osc.stop(ctx.currentTime + 0.5);
    } catch {
      // AudioContext might be blocked until user interaction
    }
  };

  // Rest timer ticker
  useEffect(() => {
    if (isRestTimerRunning && restSecondsLeft > 0) {
      restIntervalRef.current = window.setInterval(() => {
        setRestSecondsLeft((prev) => {
          if (prev <= 1) {
            setIsRestTimerRunning(false);
            playTimerEndSound();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      if (restIntervalRef.current) clearInterval(restIntervalRef.current);
    }

    return () => {
      if (restIntervalRef.current) clearInterval(restIntervalRef.current);
    };
  }, [isRestTimerRunning, restSecondsLeft, soundEnabled]);

  // Lap timer ticker
  useEffect(() => {
    if (isLapTimerRunning) {
      lapIntervalRef.current = window.setInterval(() => {
        setLapSeconds((prev) => prev + 1);
      }, 1000);
    } else {
      if (lapIntervalRef.current) clearInterval(lapIntervalRef.current);
    }

    return () => {
      if (lapIntervalRef.current) clearInterval(lapIntervalRef.current);
    };
  }, [isLapTimerRunning]);

  // Format MM:SS or HH:MM:SS
  const formatTime = (totalSeconds: number): string => {
    const mins = Math.floor(totalSeconds / 60);
    const secs = totalSeconds % 60;
    if (mins >= 60) {
      const hrs = Math.floor(mins / 60);
      const remMins = mins % 60;
      return `${hrs.toString().padStart(2, '0')}:${remMins.toString().padStart(2, '0')}:${secs
        .toString()
        .padStart(2, '0')}`;
    }
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const startRestTimer = (seconds: number) => {
    setInitialRestDuration(seconds);
    setRestSecondsLeft(seconds);
    setIsRestTimerRunning(true);
  };

  const adjustRestTime = (delta: number) => {
    setRestSecondsLeft((prev) => Math.max(0, prev + delta));
  };

  const skipOrResetRestTimer = () => {
    setIsRestTimerRunning(false);
    setRestSecondsLeft(0);
  };

  const toggleWorkoutPause = () => {
    if (!activeSession) return;
    const updated = { ...activeSession, isPaused: !activeSession.isPaused };
    LocalStorageRepo.saveActiveWorkout(updated);
    setActiveSession(updated);
  };

  const isWorkoutActive = !!activeSession;
  const isAnyTimerRunning = isWorkoutActive || isRestTimerRunning || isLapTimerRunning;

  // Calculate circular progress for rest timer
  const restProgressPercent =
    initialRestDuration > 0 && restSecondsLeft > 0
      ? (restSecondsLeft / initialRestDuration) * 100
      : 0;

  return (
    <>
      {/* 1. FLOATING DYNAMIC BUBBLE / PANEL (16dp from bottom navigation, 16dp from right) */}
      {!isExpanded && (
        <div
          id="floating-workout-timer"
          className="absolute bottom-4 right-4 z-30 select-none animate-in fade-in slide-in-from-bottom-2 duration-200 pointer-events-auto"
        >
          <button
            type="button"
            onClick={() => setIsExpanded(true)}
            className={`flex items-center gap-2.5 px-3 py-2 rounded-2xl backdrop-blur-xl border shadow-[0_8px_25px_rgba(0,0,0,0.7)] transition-all active:scale-95 group ${
              isRestTimerRunning
                ? 'bg-[#181205]/95 border-amber-500/70 text-amber-300 shadow-[0_0_20px_rgba(245,158,11,0.3)] animate-pulse'
                : activeSession?.isPaused
                ? 'bg-[#150F18]/95 border-purple-500/60 text-purple-300'
                : isWorkoutActive
                ? 'bg-[#06120E]/95 border-[#00F59B]/70 text-[#00F59B] shadow-[0_0_20px_rgba(0,245,155,0.3)]'
                : 'bg-[#090D15]/95 border-slate-700 text-slate-200 hover:border-[#00F59B]/50'
            }`}
          >
            {/* Dynamic Icon indicator */}
            <div className="relative flex items-center justify-center">
              {isRestTimerRunning ? (
                <>
                  <Clock
                    className="w-4 h-4 text-amber-400 animate-spin"
                    style={{ animationDuration: '4s' }}
                  />
                  <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-amber-400" />
                </>
              ) : (
                <>
                  <Timer
                    className={`w-4 h-4 transition-transform group-hover:scale-110 ${
                      activeSession?.isPaused ? 'text-purple-400' : 'text-[#00F59B]'
                    }`}
                  />
                  {isWorkoutActive && !activeSession?.isPaused && (
                    <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-[#00F59B] animate-ping" />
                  )}
                </>
              )}
            </div>

            {/* Time readout */}
            <div className="flex flex-col items-start leading-none text-left">
              <span className="text-[9px] font-black uppercase tracking-wider text-slate-400">
                {isRestTimerRunning ? 'PRZERWA' : isWorkoutActive ? 'TRENING' : 'STOPER'}
              </span>
              <span className="text-xs font-black font-mono tracking-tight mt-0.5">
                {isRestTimerRunning
                  ? `${restSecondsLeft}s`
                  : isWorkoutActive
                  ? formatTime(activeSession.elapsedSeconds)
                  : formatTime(lapSeconds)}
              </span>
            </div>

            <ChevronUp className="w-3.5 h-3.5 text-slate-400 group-hover:text-white transition-colors" />
          </button>
        </div>
      )}

      {/* 2. EXPANDED BOTTOM SHEET / DIALOG (Inside app container, never escaping Xiaomi 14T screen) */}
      {isExpanded && (
        <div className="absolute inset-0 z-50 flex items-end justify-center p-3 bg-black/80 backdrop-blur-sm select-none animate-in fade-in duration-150">
          <div className="w-full max-w-sm glass-card border border-slate-700/80 rounded-3xl p-4 shadow-2xl space-y-3.5 animate-in slide-in-from-bottom-6 duration-200 bg-[#080C14]/98 max-h-[92%] overflow-y-auto">
            {/* Header */}
            <div className="flex items-center justify-between border-b border-slate-800 pb-2.5">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-xl bg-emerald-500/15 text-[#00F59B] border border-emerald-500/30 flex items-center justify-center">
                  <Timer className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-xs font-black text-white">Czasomierz treningu</h3>
                  <p className="text-[9.5px] text-slate-400 font-medium">
                    Kontrola tempa sesji i przerw
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-1">
                <button
                  type="button"
                  onClick={() => setSoundEnabled(!soundEnabled)}
                  className={`p-1.5 rounded-xl border transition-colors ${
                    soundEnabled
                      ? 'bg-emerald-950/60 border-emerald-500/40 text-[#00F59B]'
                      : 'bg-slate-800 border-slate-700 text-slate-400'
                  }`}
                  title={soundEnabled ? 'Dźwięk włączony' : 'Dźwięk wyciszony'}
                >
                  {soundEnabled ? (
                    <Volume2 className="w-3.5 h-3.5" />
                  ) : (
                    <VolumeX className="w-3.5 h-3.5" />
                  )}
                </button>
                <button
                  type="button"
                  onClick={() => setIsExpanded(false)}
                  className="p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800"
                  title="Zwiń do pływającej ikonki"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* SEKCJA 1: CZASOMIERZ PRZERWY (REST TIMER) */}
            <div className="p-3 rounded-2xl bg-[#05080E] border border-amber-500/30 space-y-2.5 relative overflow-hidden">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-extrabold uppercase tracking-wider text-amber-400 flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-amber-400" />
                  <span>TIMER PRZERWY</span>
                </span>
                {isRestTimerRunning && (
                  <span className="text-[9px] font-mono font-bold text-amber-300 bg-amber-950/80 px-2 py-0.5 rounded-md border border-amber-500/30 animate-pulse">
                    ODLICZANIE
                  </span>
                )}
              </div>

              {/* Big Readout & Controls */}
              <div className="flex items-center justify-between px-1">
                <div>
                  <div className="text-2xl font-black font-mono text-white tracking-tight">
                    {restSecondsLeft > 0 ? `${restSecondsLeft}s` : '0s'}
                  </div>
                  <span className="text-[9.5px] text-slate-400">
                    {isRestTimerRunning
                      ? `Pozostało z ${initialRestDuration}s`
                      : 'Wybierz czas przerwy'}
                  </span>
                </div>

                <div className="flex items-center gap-1">
                  <button
                    type="button"
                    onClick={() => adjustRestTime(-15)}
                    disabled={restSecondsLeft <= 0}
                    className="px-2 py-1 rounded-lg bg-slate-800 text-slate-300 hover:text-white border border-slate-700 disabled:opacity-30 text-[10px] font-bold"
                  >
                    -15s
                  </button>
                  <button
                    type="button"
                    onClick={() => adjustRestTime(30)}
                    className="px-2.5 py-1 rounded-lg bg-amber-500/20 text-amber-300 hover:bg-amber-500/30 border border-amber-500/40 text-[10px] font-black"
                  >
                    +30s
                  </button>
                  {restSecondsLeft > 0 && (
                    <button
                      type="button"
                      onClick={skipOrResetRestTimer}
                      className="px-2 py-1 rounded-lg bg-rose-950/50 text-rose-300 border border-rose-500/30 text-[10px] font-bold flex items-center gap-1"
                      title="Pomiń przerwę"
                    >
                      <FastForward className="w-3 h-3" />
                      <span>Pomiń</span>
                    </button>
                  )}
                </div>
              </div>

              {/* Progress bar */}
              {isRestTimerRunning && (
                <div className="w-full bg-slate-900 h-1.5 rounded-full overflow-hidden">
                  <div
                    className="bg-gradient-to-r from-amber-500 to-amber-300 h-full rounded-full transition-all duration-300 shadow-[0_0_10px_#F59E0B]"
                    style={{ width: `${restProgressPercent}%` }}
                  />
                </div>
              )}

              {/* Preset buttons */}
              <div className="grid grid-cols-5 gap-1 pt-0.5">
                {[30, 60, 90, 120, 180].map((sec) => (
                  <button
                    key={sec}
                    type="button"
                    onClick={() => startRestTimer(sec)}
                    className={`py-1 rounded-xl text-[11px] font-mono font-black transition-all border ${
                      restSecondsLeft === sec && isRestTimerRunning
                        ? 'bg-amber-500 text-slate-950 border-amber-400 shadow-md scale-105'
                        : 'bg-slate-900/90 border-slate-800 text-slate-300 hover:border-amber-500/50 hover:text-amber-300'
                    }`}
                  >
                    {sec < 60 ? `${sec}s` : `${sec / 60}m`}
                  </button>
                ))}
              </div>
            </div>

            {/* SEKCJA 2: CZAS TRENINGU (JEŚLI JEST AKTYWNA SESJA) */}
            {isWorkoutActive && (
              <div className="p-3 rounded-2xl bg-[#06100C] border border-[#00F59B]/30 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-extrabold uppercase tracking-wider text-[#00F59B] flex items-center gap-1.5">
                    <Dumbbell className="w-3.5 h-3.5 text-[#00F59B]" />
                    <span className="truncate max-w-[160px]">{activeSession.name}</span>
                  </span>
                  <span
                    className={`text-[9px] font-extrabold px-1.5 py-0.2 rounded-md ${
                      activeSession.isPaused
                        ? 'bg-purple-950 text-purple-300 border border-purple-500/40'
                        : 'bg-emerald-950 text-[#00F59B] border border-[#00F59B]/40 animate-pulse'
                    }`}
                  >
                    {activeSession.isPaused ? 'WSTRZYMANA' : 'AKTYWNY'}
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <div className="text-xl font-black font-mono text-white">
                    {formatTime(activeSession.elapsedSeconds)}
                  </div>

                  <div className="flex items-center gap-1.5">
                    <button
                      type="button"
                      onClick={toggleWorkoutPause}
                      className={`px-2.5 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1 transition-all ${
                        activeSession.isPaused
                          ? 'bg-[#00F59B] text-[#06090E] font-black shadow-md'
                          : 'bg-slate-800 text-slate-200 hover:text-white border border-slate-700'
                      }`}
                    >
                      {activeSession.isPaused ? (
                        <>
                          <Play className="w-3.5 h-3.5 fill-current" />
                          <span>Wznów</span>
                        </>
                      ) : (
                        <>
                          <Pause className="w-3.5 h-3.5" />
                          <span>Pauza</span>
                        </>
                      )}
                    </button>

                    {onNavigateToWorkout && (
                      <button
                        type="button"
                        onClick={() => {
                          setIsExpanded(false);
                          onNavigateToWorkout();
                        }}
                        className="px-2.5 py-1.5 rounded-xl bg-slate-800/90 text-[#00F59B] border border-[#00F59B]/40 hover:bg-[#00F59B]/10 text-xs font-bold"
                      >
                        Trening →
                      </button>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* SEKCJA 3: PODRĘCZNY STOPER POJEDYNCZEJ SERII */}
            <div className="p-2.5 rounded-2xl bg-[#070A10] border border-slate-800 space-y-1.5">
              <div className="flex items-center justify-between text-[9.5px] text-slate-400 font-bold uppercase">
                <span>Stoper serii / plank / izometria:</span>
                <span className="font-mono text-white text-xs font-bold">
                  {formatTime(lapSeconds)}
                </span>
              </div>
              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  onClick={() => setIsLapTimerRunning(!isLapTimerRunning)}
                  className={`flex-1 py-1 rounded-xl text-xs font-extrabold flex items-center justify-center gap-1 border ${
                    isLapTimerRunning
                      ? 'bg-purple-950/60 border-purple-500/50 text-purple-300'
                      : 'bg-slate-800 border-slate-700 text-slate-200'
                  }`}
                >
                  {isLapTimerRunning ? (
                    <Pause className="w-3 h-3" />
                  ) : (
                    <Play className="w-3 h-3 fill-current" />
                  )}
                  <span>{isLapTimerRunning ? 'Zatrzymaj' : 'Start serii'}</span>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setIsLapTimerRunning(false);
                    setLapSeconds(0);
                  }}
                  className="px-2.5 py-1 rounded-xl bg-slate-900 border border-slate-800 text-slate-400 hover:text-white text-xs font-bold"
                >
                  Zeruj
                </button>
              </div>
            </div>

            {/* Footer action to collapse */}
            <button
              type="button"
              onClick={() => setIsExpanded(false)}
              className="w-full py-2 rounded-2xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 hover:text-white text-xs font-bold transition-all text-center flex items-center justify-center gap-1"
            >
              <ChevronDown className="w-3.5 h-3.5" />
              <span>Zwiń do pływającej ikonki</span>
            </button>
          </div>
        </div>
      )}
    </>
  );
};
