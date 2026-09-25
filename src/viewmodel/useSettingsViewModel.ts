import { useState, useEffect } from 'react';
import { AppSettingsData, AppThemeId, THEME_PRESETS } from '../domain/settingsTypes';
import { SettingsRepo } from '../data/settingsRepo';

export function useSettingsViewModel() {
  const [settings, setSettings] = useState<AppSettingsData>(() => SettingsRepo.getSettings());
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  useEffect(() => {
    const unsub = SettingsRepo.subscribe(() => {
      setSettings(SettingsRepo.getSettings());
    });
    return () => unsub();
  }, []);

  const updateTheme = (themeId: AppThemeId) => {
    SettingsRepo.updateSetting('themeId', themeId);
    showToast(`Aktywowano motyw: ${THEME_PRESETS[themeId].name}`);
  };

  const updateSetting = <K extends keyof AppSettingsData>(key: K, value: AppSettingsData[K]) => {
    SettingsRepo.updateSetting(key, value);
  };

  const resetSettings = () => {
    SettingsRepo.resetSettingsOnly();
    showToast('Przywrócono domyślne ustawienia aplikacji');
  };

  const exportBackup = () => {
    const jsonStr = SettingsRepo.exportFullDatabase();
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `planpasika_backup_${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
    showToast('Pobrano kopię zapasową danych (JSON)');
  };

  const importBackup = (file: File, onSuccess?: () => void, onError?: (err: string) => void) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const content = e.target?.result as string;
      const ok = SettingsRepo.importDatabase(content);
      if (ok) {
        showToast('Kopia zapasowa została pomyślnie zaimportowana');
        if (onSuccess) onSuccess();
      } else {
        if (onError) onError('Nie udało się zaimportować pliku JSON.');
      }
    };
    reader.readAsText(file);
  };

  return {
    settings,
    currentTheme: THEME_PRESETS[settings.themeId] || THEME_PRESETS.amoled,
    toastMessage,
    updateTheme,
    updateSetting,
    resetSettings,
    exportBackup,
    importBackup,
  };
}
