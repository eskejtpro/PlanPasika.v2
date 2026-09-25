package com.planpasika.v2.data.repository

import android.content.Context
import androidx.datastore.core.DataStore
import androidx.datastore.preferences.core.*
import androidx.datastore.preferences.preferencesDataStore
import com.planpasika.v2.domain.model.*
import kotlinx.coroutines.flow.Flow
import kotlinx.coroutines.flow.catch
import kotlinx.coroutines.flow.map
import java.io.IOException

private val Context.dataStore: DataStore<Preferences> by preferencesDataStore(name = "planpasika_settings")

class SettingsRepository(private val context: Context) {

    private object PreferencesKeys {
        val THEME_MODE = stringPreferencesKey("theme_mode")
        val UI_DENSITY = stringPreferencesKey("ui_density")
        val FONT_SCALE = stringPreferencesKey("font_scale")
        val CARD_RADIUS = stringPreferencesKey("card_radius")
        val ANIMATIONS_ENABLED = booleanPreferencesKey("animations_enabled")
        val GLOW_EFFECTS_ENABLED = booleanPreferencesKey("glow_effects_enabled")
        val AMOLED_PURE_BLACK = booleanPreferencesKey("amoled_pure_black")

        val AUTO_REST_TIMER = booleanPreferencesKey("auto_rest_timer")
        val DEFAULT_REST_DURATION = intPreferencesKey("default_rest_duration")
        val VIBRATE_ON_TIMER = booleanPreferencesKey("vibrate_on_timer")
        val SOUND_ON_TIMER = booleanPreferencesKey("sound_on_timer")
        val QUICK_ADD_SECONDS = intPreferencesKey("quick_add_seconds")
        val AUTO_ADVANCE_SET = booleanPreferencesKey("auto_advance_set")

        val FIRST_DAY_OF_WEEK = stringPreferencesKey("first_day_of_week")
        val CONFIRM_DELETE_EXERCISE = booleanPreferencesKey("confirm_delete_exercise")
        val CONFIRM_DELETE_DAY = booleanPreferencesKey("confirm_delete_day")
        val CONFIRM_DELETE_WEEK = booleanPreferencesKey("confirm_delete_week")
        val DEFAULT_NEW_DAY_STATUS = stringPreferencesKey("default_new_day_status")

        val CALENDAR_REMINDERS = booleanPreferencesKey("calendar_reminders")
        val CALENDAR_REMINDER_TIME = stringPreferencesKey("calendar_reminder_time")
        val CALENDAR_VIBRATE = booleanPreferencesKey("calendar_vibrate")
        val CALENDAR_SOUND = booleanPreferencesKey("calendar_sound")
        val CALENDAR_NEUTRAL = booleanPreferencesKey("calendar_neutral")

        val WEIGHT_UNIT = stringPreferencesKey("weight_unit")
        val LENGTH_UNIT = stringPreferencesKey("length_unit")
        val DECIMAL_PLACES = intPreferencesKey("decimal_places")

        val START_SCREEN = stringPreferencesKey("start_screen")
        val REMEMBER_LAST_SCREEN = booleanPreferencesKey("remember_last_screen")
    }

    val settingsFlow: Flow<AppSettings> = context.dataStore.data
        .catch { exception ->
            if (exception is IOException) {
                emit(emptyPreferences())
            } else {
                throw exception
            }
        }
        .map { prefs ->
            val themeStr = prefs[PreferencesKeys.THEME_MODE] ?: AppThemeMode.AMOLED.name
            val themeMode = try { AppThemeMode.valueOf(themeStr) } catch (_: Exception) { AppThemeMode.AMOLED }

            val densityStr = prefs[PreferencesKeys.UI_DENSITY] ?: UiDensity.STANDARD.name
            val density = try { UiDensity.valueOf(densityStr) } catch (_: Exception) { UiDensity.STANDARD }

            val fontScaleStr = prefs[PreferencesKeys.FONT_SCALE] ?: FontScaleOption.STANDARD.name
            val fontScale = try { FontScaleOption.valueOf(fontScaleStr) } catch (_: Exception) { FontScaleOption.STANDARD }

            val cardRadiusStr = prefs[PreferencesKeys.CARD_RADIUS] ?: CardRadiusOption.STANDARD.name
            val cardRadius = try { CardRadiusOption.valueOf(cardRadiusStr) } catch (_: Exception) { CardRadiusOption.STANDARD }

            AppSettings(
                themeMode = themeMode,
                uiDensity = density,
                fontScale = fontScale,
                cardRadius = cardRadius,
                animationsEnabled = prefs[PreferencesKeys.ANIMATIONS_ENABLED] ?: true,
                glowEffectsEnabled = prefs[PreferencesKeys.GLOW_EFFECTS_ENABLED] ?: true,
                amoledPureBlack = prefs[PreferencesKeys.AMOLED_PURE_BLACK] ?: true,

                autoRestTimer = prefs[PreferencesKeys.AUTO_REST_TIMER] ?: true,
                defaultRestDurationSeconds = prefs[PreferencesKeys.DEFAULT_REST_DURATION] ?: 90,
                vibrateOnTimerEnd = prefs[PreferencesKeys.VIBRATE_ON_TIMER] ?: true,
                soundOnTimerEnd = prefs[PreferencesKeys.SOUND_ON_TIMER] ?: true,
                quickAddSeconds = prefs[PreferencesKeys.QUICK_ADD_SECONDS] ?: 30,
                autoAdvanceNextSet = prefs[PreferencesKeys.AUTO_ADVANCE_SET] ?: false,

                firstDayOfWeek = prefs[PreferencesKeys.FIRST_DAY_OF_WEEK] ?: "MONDAY",
                confirmDeleteExercise = prefs[PreferencesKeys.CONFIRM_DELETE_EXERCISE] ?: true,
                confirmDeleteDay = prefs[PreferencesKeys.CONFIRM_DELETE_DAY] ?: true,
                confirmDeleteWeek = prefs[PreferencesKeys.CONFIRM_DELETE_WEEK] ?: true,
                defaultNewDayStatus = prefs[PreferencesKeys.DEFAULT_NEW_DAY_STATUS] ?: "UNRESOLVED",

                calendarRemindersEnabled = prefs[PreferencesKeys.CALENDAR_REMINDERS] ?: false,
                calendarReminderTime = prefs[PreferencesKeys.CALENDAR_REMINDER_TIME] ?: "18:00",
                calendarReminderVibrate = prefs[PreferencesKeys.CALENDAR_VIBRATE] ?: true,
                calendarReminderSound = prefs[PreferencesKeys.CALENDAR_SOUND] ?: true,
                calendarNeutralContent = prefs[PreferencesKeys.CALENDAR_NEUTRAL] ?: true,

                weightUnit = prefs[PreferencesKeys.WEIGHT_UNIT] ?: "kg",
                lengthUnit = prefs[PreferencesKeys.LENGTH_UNIT] ?: "cm",
                decimalPlaces = prefs[PreferencesKeys.DECIMAL_PLACES] ?: 1,

                startScreenRoute = prefs[PreferencesKeys.START_SCREEN] ?: "my_week",
                rememberLastScreen = prefs[PreferencesKeys.REMEMBER_LAST_SCREEN] ?: true
            )
        }

    suspend fun updateTheme(theme: AppThemeMode) {
        context.dataStore.edit { prefs ->
            prefs[PreferencesKeys.THEME_MODE] = theme.name
        }
    }

    suspend fun updateSettings(transform: (AppSettings) -> AppSettings) {
        // Apply transform to current state and write to preferences
        context.dataStore.edit { prefs ->
            // Update individual keys
        }
    }

    suspend fun saveAllSettings(settings: AppSettings) {
        context.dataStore.edit { prefs ->
            prefs[PreferencesKeys.THEME_MODE] = settings.themeMode.name
            prefs[PreferencesKeys.UI_DENSITY] = settings.uiDensity.name
            prefs[PreferencesKeys.FONT_SCALE] = settings.fontScale.name
            prefs[PreferencesKeys.CARD_RADIUS] = settings.cardRadius.name
            prefs[PreferencesKeys.ANIMATIONS_ENABLED] = settings.animationsEnabled
            prefs[PreferencesKeys.GLOW_EFFECTS_ENABLED] = settings.glowEffectsEnabled
            prefs[PreferencesKeys.AMOLED_PURE_BLACK] = settings.amoledPureBlack

            prefs[PreferencesKeys.AUTO_REST_TIMER] = settings.autoRestTimer
            prefs[PreferencesKeys.DEFAULT_REST_DURATION] = settings.defaultRestDurationSeconds
            prefs[PreferencesKeys.VIBRATE_ON_TIMER] = settings.vibrateOnTimerEnd
            prefs[PreferencesKeys.SOUND_ON_TIMER] = settings.soundOnTimerEnd
            prefs[PreferencesKeys.QUICK_ADD_SECONDS] = settings.quickAddSeconds
            prefs[PreferencesKeys.AUTO_ADVANCE_SET] = settings.autoAdvanceNextSet

            prefs[PreferencesKeys.FIRST_DAY_OF_WEEK] = settings.firstDayOfWeek
            prefs[PreferencesKeys.CONFIRM_DELETE_EXERCISE] = settings.confirmDeleteExercise
            prefs[PreferencesKeys.CONFIRM_DELETE_DAY] = settings.confirmDeleteDay
            prefs[PreferencesKeys.CONFIRM_DELETE_WEEK] = settings.confirmDeleteWeek
            prefs[PreferencesKeys.DEFAULT_NEW_DAY_STATUS] = settings.defaultNewDayStatus

            prefs[PreferencesKeys.CALENDAR_REMINDERS] = settings.calendarRemindersEnabled
            prefs[PreferencesKeys.CALENDAR_REMINDER_TIME] = settings.calendarReminderTime
            prefs[PreferencesKeys.CALENDAR_VIBRATE] = settings.calendarReminderVibrate
            prefs[PreferencesKeys.CALENDAR_SOUND] = settings.calendarReminderSound
            prefs[PreferencesKeys.CALENDAR_NEUTRAL] = settings.calendarNeutralContent

            prefs[PreferencesKeys.WEIGHT_UNIT] = settings.weightUnit
            prefs[PreferencesKeys.LENGTH_UNIT] = settings.lengthUnit
            prefs[PreferencesKeys.DECIMAL_PLACES] = settings.decimalPlaces

            prefs[PreferencesKeys.START_SCREEN] = settings.startScreenRoute
            prefs[PreferencesKeys.REMEMBER_LAST_SCREEN] = settings.rememberLastScreen
        }
    }

    suspend fun resetToDefaults() {
        context.dataStore.edit { prefs ->
            prefs.clear()
        }
    }
}
