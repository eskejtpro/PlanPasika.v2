/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { NavTabId } from './navigation/NavTabs';
import { XiaomiDeviceFrame } from './ui/components/XiaomiDeviceFrame';
import { CodeViewerModal } from './ui/components/CodeViewerModal';
import { TodayScreen } from './ui/screens/TodayScreen';
import { PlansScreen } from './ui/screens/PlansScreen';
import { WorkoutScreen } from './ui/screens/WorkoutScreen';
import { CatalogScreen } from './ui/screens/CatalogScreen';
import { CalendarScreen } from './ui/screens/CalendarScreen';
import { AnalyticsScreen } from './ui/screens/AnalyticsScreen';
import { MeasurementsScreen } from './ui/screens/MeasurementsScreen';
import { SettingsScreen } from './ui/screens/SettingsScreen';
import { FloatingWorkoutTimer } from './ui/components/FloatingWorkoutTimer';
import { LocalStorageRepo } from './data/localStorageRepo';

export default function App() {
  const [currentTab, setCurrentTab] = useState<NavTabId>('today');
  const [isSettingsOpen, setIsSettingsOpen] = useState<boolean>(false);
  const [isCodeViewerOpen, setIsCodeViewerOpen] = useState<boolean>(false);
  const [activeWorkoutRunning, setActiveWorkoutRunning] = useState<boolean>(false);

  // Check active workout session
  const checkActiveWorkout = () => {
    const session = LocalStorageRepo.getActiveWorkout();
    setActiveWorkoutRunning(!!session);
  };

  useEffect(() => {
    checkActiveWorkout();
    const interval = setInterval(checkActiveWorkout, 2000);
    return () => clearInterval(interval);
  }, []);

  const handleStartWorkout = () => {
    setIsSettingsOpen(false);
    setCurrentTab('workout');
  };

  return (
    <XiaomiDeviceFrame
      currentTab={currentTab}
      onSelectTab={(tab) => {
        setIsSettingsOpen(false);
        setCurrentTab(tab);
        checkActiveWorkout();
      }}
      activeWorkoutRunning={activeWorkoutRunning}
      onOpenCodeViewer={() => setIsCodeViewerOpen(true)}
    >
      {/* Settings Screen when activated */}
      {isSettingsOpen ? (
        <SettingsScreen onNavigateBack={() => setIsSettingsOpen(false)} />
      ) : (
        <>
          {/* Main Module Screens */}
          {currentTab === 'today' && (
            <TodayScreen
              onStartWorkout={handleStartWorkout}
              onNavigateToCalendar={() => setCurrentTab('calendar')}
              onNavigateToPlans={() => setCurrentTab('plans')}
              onOpenSettings={() => setIsSettingsOpen(true)}
            />
          )}

          {currentTab === 'plans' && (
            <PlansScreen onOpenSettings={() => setIsSettingsOpen(true)} />
          )}

          {currentTab === 'workout' && (
            <WorkoutScreen
              onWorkoutFinished={() => {
                checkActiveWorkout();
                setCurrentTab('today');
              }}
            />
          )}

          {currentTab === 'catalog' && <CatalogScreen />}

          {currentTab === 'calendar' && (
            <CalendarScreen onOpenSettings={() => setIsSettingsOpen(true)} />
          )}

          {currentTab === 'analytics' && <AnalyticsScreen />}

          {currentTab === 'measurements' && <MeasurementsScreen />}

          {/* Floating dynamic stopwatch & rest timer */}
          <FloatingWorkoutTimer onNavigateToWorkout={() => setCurrentTab('workout')} />
        </>
      )}

      {/* Kotlin / Jetpack Compose Source Code Inspector Modal */}
      <CodeViewerModal
        isOpen={isCodeViewerOpen}
        onClose={() => setIsCodeViewerOpen(false)}
      />
    </XiaomiDeviceFrame>
  );
}
