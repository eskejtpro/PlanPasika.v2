import React from 'react';
import {
  CalendarDays,
  CalendarRange,
  Dumbbell,
  Home,
  BarChart3,
  BookOpen,
  Ruler,
} from 'lucide-react';

export type NavTabId = 'today' | 'plans' | 'workout' | 'catalog' | 'calendar' | 'analytics' | 'measurements';

interface NavTabsProps {
  currentTab: NavTabId;
  onSelectTab: (tab: NavTabId) => void;
  activeWorkoutRunning?: boolean;
}

export const NavTabs: React.FC<NavTabsProps> = ({
  currentTab,
  onSelectTab,
  activeWorkoutRunning = false,
}) => {
  const tabs: Array<{ id: NavTabId; label: string; icon: React.FC<{ className?: string }> }> = [
    { id: 'today', label: 'Dzisiaj', icon: Home },
    { id: 'plans', label: 'Plany', icon: CalendarRange },
    { id: 'workout', label: 'Trening', icon: Dumbbell },
    { id: 'catalog', label: 'Katalog', icon: BookOpen },
    { id: 'calendar', label: 'Kalendarz', icon: CalendarDays },
    { id: 'analytics', label: 'Analizy', icon: BarChart3 },
    { id: 'measurements', label: 'Pomiary', icon: Ruler },
  ];

  return (
    <nav
      aria-label="Dolna nawigacja aplikacji PlanPasika.v2"
      className="shrink-0 bg-[#070B12]/95 backdrop-blur-xl border-t border-[#16202F] px-1 py-1.5 pb-safe flex items-center justify-around z-40 select-none shadow-[0_-10px_25px_rgba(0,0,0,0.5)] overflow-x-auto scrollbar-none"
    >
      {tabs.map((tab) => {
        const isActive = currentTab === tab.id;
        const IconComponent = tab.icon;
        const isWorkout = tab.id === 'workout';

        return (
          <button
            key={tab.id}
            type="button"
            onClick={() => onSelectTab(tab.id)}
            className="flex-1 flex flex-col items-center justify-center min-h-[50px] min-w-[42px] py-0.5 transition-all group focus:outline-none relative"
          >
            {/* Active Pill with Neon Glow */}
            <div
              className={`relative px-2.5 py-1 rounded-full transition-all duration-200 flex items-center justify-center ${
                isActive
                  ? 'bg-gradient-to-r from-emerald-500/25 to-teal-400/20 text-[#00F59B] shadow-[0_0_15px_rgba(0,245,155,0.25)] border border-emerald-500/40'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40'
              }`}
            >
              <IconComponent
                className={`w-4 h-4 sm:w-5 sm:h-5 transition-transform duration-200 ${
                  isActive ? 'scale-110 stroke-[2.4] drop-shadow-[0_0_6px_rgba(0,245,155,0.6)]' : 'stroke-[1.8]'
                }`}
              />

              {/* Active workout indicator dot */}
              {isWorkout && activeWorkoutRunning && (
                <span className="absolute -top-0.5 -right-0.5 flex h-2.5 w-2.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#00F59B] opacity-80"></span>
                  <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-[#00F59B] shadow-[0_0_8px_#00F59B]"></span>
                </span>
              )}
            </div>

            <span
              className={`text-[9.5px] sm:text-[10px] font-semibold tracking-tight mt-0.5 transition-colors duration-150 ${
                isActive ? 'text-[#00F59B] font-bold' : 'text-slate-400'
              }`}
            >
              {tab.label}
            </span>
          </button>
        );
      })}
    </nav>
  );
};
