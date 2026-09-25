package com.planpasika.v2.ui.screens.settings

import android.app.Application
import androidx.lifecycle.AndroidViewModel
import androidx.lifecycle.viewModelScope
import com.planpasika.v2.data.repository.SettingsRepository
import com.planpasika.v2.domain.model.*
import kotlinx.coroutines.flow.*
import kotlinx.coroutines.launch

class SettingsViewModel(application: Application) : AndroidViewModel(application) {

    private val repository = SettingsRepository(application.applicationContext)

    val settingsState: StateFlow<AppSettings> = repository.settingsFlow
        .stateIn(
            scope = viewModelScope,
            started = SharingStarted.WhileSubscribed(5000),
            initialValue = AppSettings()
        )

    fun updateTheme(themeMode: AppThemeMode) {
        viewModelScope.launch {
            repository.saveAllSettings(settingsState.value.copy(themeMode = themeMode))
        }
    }

    fun updateUiDensity(density: UiDensity) {
        viewModelScope.launch {
            repository.saveAllSettings(settingsState.value.copy(uiDensity = density))
        }
    }

    fun updateFontScale(fontScale: FontScaleOption) {
        viewModelScope.launch {
            repository.saveAllSettings(settingsState.value.copy(fontScale = fontScale))
        }
    }

    fun updateCardRadius(cardRadius: CardRadiusOption) {
        viewModelScope.launch {
            repository.saveAllSettings(settingsState.value.copy(cardRadius = cardRadius))
        }
    }

    fun toggleAnimations(enabled: Boolean) {
        viewModelScope.launch {
            repository.saveAllSettings(settingsState.value.copy(animationsEnabled = enabled))
        }
    }

    fun toggleGlowEffects(enabled: Boolean) {
        viewModelScope.launch {
            repository.saveAllSettings(settingsState.value.copy(glowEffectsEnabled = enabled))
        }
    }

    fun toggleAmoledPureBlack(enabled: Boolean) {
        viewModelScope.launch {
            repository.saveAllSettings(settingsState.value.copy(amoledPureBlack = enabled))
        }
    }

    fun updateRestTimerDuration(seconds: Int) {
        viewModelScope.launch {
            repository.saveAllSettings(settingsState.value.copy(defaultRestDurationSeconds = seconds))
        }
    }

    fun toggleAutoRestTimer(enabled: Boolean) {
        viewModelScope.launch {
            repository.saveAllSettings(settingsState.value.copy(autoRestTimer = enabled))
        }
    }

    fun toggleVibrateOnTimer(enabled: Boolean) {
        viewModelScope.launch {
            repository.saveAllSettings(settingsState.value.copy(vibrateOnTimerEnd = enabled))
        }
    }

    fun toggleSoundOnTimer(enabled: Boolean) {
        viewModelScope.launch {
            repository.saveAllSettings(settingsState.value.copy(soundOnTimerEnd = enabled))
        }
    }

    fun updateFirstDayOfWeek(firstDay: String) {
        viewModelScope.launch {
            repository.saveAllSettings(settingsState.value.copy(firstDayOfWeek = firstDay))
        }
    }

    fun updateDecimalPlaces(places: Int) {
        viewModelScope.launch {
            repository.saveAllSettings(settingsState.value.copy(decimalPlaces = places))
        }
    }

    fun updateStartScreen(route: String) {
        viewModelScope.launch {
            repository.saveAllSettings(settingsState.value.copy(startScreenRoute = route))
        }
    }

    fun resetSettingsOnly() {
        viewModelScope.launch {
            repository.resetToDefaults()
        }
    }
}
