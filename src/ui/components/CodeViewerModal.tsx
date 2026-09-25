import React, { useState } from 'react';
import { X, Code2, Copy, Check, FileCode, Folder } from 'lucide-react';

interface CodeViewerModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const KOTLIN_CODE_FILES: Record<string, { path: string; category: string; content: string }> = {
  'MainActivity.kt': {
    path: 'android/app/src/main/java/com/planpasika/v2/MainActivity.kt',
    category: 'Core',
    content: `package com.planpasika.v2

import android.os.Bundle
import androidx.activity.ComponentActivity
import androidx.activity.compose.setContent
import androidx.compose.foundation.layout.*
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Modifier
import com.planpasika.v2.ui.theme.PlanPasikaTheme

/**
 * PlanPasika.v2 - Single Activity Entry Point
 * Designed for Xiaomi 14T (AMOLED, 144Hz, Portrait, Material 3 Dark)
 */
class MainActivity : ComponentActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContent {
            PlanPasikaTheme {
                MainAppScaffold()
            }
        }
    }
}`,
  },
  'ExerciseCategory.kt': {
    path: 'android/app/src/main/java/com/gymtracker/next/domain/model/ExerciseCategory.kt',
    category: 'domain',
    content: `package com.gymtracker.next.domain.model

/**
 * STRICT RULE: Każde ćwiczenie musi mieć dokładnie jedną kategorię.
 * Brak partii pomocniczych. Jedna seria = jedno zaliczenie.
 */
enum class ExerciseCategory(val displayName: String) {
    CHEST("Klatka piersiowa"),
    BACK("Plecy"),
    SHOULDERS("Barki"),
    LEGS("Nogi"),
    BICEPS("Biceps"),
    TRICEPS("Triceps"),
    OTHER("Pozostałe");

    companion object {
        fun fromDisplayName(name: String): ExerciseCategory {
            return values().firstOrNull { it.displayName == name } ?: OTHER
        }
    }
}`,
  },
  'Models.kt': {
    path: 'android/app/src/main/java/com/planpasika/v2/domain/model/Models.kt',
    category: 'Domain',
    content: `package com.planpasika.v2.domain.model

enum class DayType { WORKOUT, REST, EMPTY }
enum class DayStatus { UNRESOLVED, COMPLETED, NOT_COMPLETED }

data class PlanTrainingDay(
    val id: String,
    val dayOfWeek: Int, // 1 (Mon) .. 7 (Sun)
    val dayName: String, // "Poniedziałek", "Wtorek"...
    var planName: String, // "Push", "Pull", "Legs"...
    val exercises: MutableList<PlanExerciseItem> = mutableListOf(),
    var manualStatus: DayStatus = DayStatus.UNRESOLVED
)

data class TrainingWeek(
    val id: String,
    val weekNumber: Int,
    val name: String,
    val days: MutableList<PlanTrainingDay> = mutableListOf()
)

data class TrainingCycleData(
    val id: String,
    val name: String,
    val startDate: String,
    val weeks: MutableList<TrainingWeek> = mutableListOf()
)`,
  },
  'GymTrackerRepository.kt': {
    path: 'android/app/src/main/java/com/gymtracker/next/data/repository/GymTrackerRepository.kt',
    category: 'data',
    content: `package com.gymtracker.next.data.repository

import com.gymtracker.next.domain.model.*
import kotlinx.coroutines.flow.Flow
import kotlinx.coroutines.flow.StateFlow
import java.time.LocalDate

/**
 * Interfejs repozytorium przygotowany pod Room / SQLite DAO
 * Całkowicie offline-first, bez synchronizacji chmurowej
 */
interface GymTrackerRepository {
    // Aktywna sesja
    fun getActiveWorkout(): StateFlow<ActiveWorkoutSession?>
    suspend fun saveActiveWorkout(session: ActiveWorkoutSession?)
    suspend fun clearActiveWorkout()

    // Plany
    fun getPlans(): Flow<List<PlanDay>>
    suspend fun updatePlanDay(planDay: PlanDay)
    suspend fun copyWeek(sourceDates: List<LocalDate>, offsetDays: Long, overwriteConflicts: Boolean)

    // Biblioteka ćwiczeń
    fun getExercises(): Flow<List<ExerciseDefinition>>
    suspend fun addExercise(exercise: ExerciseDefinition)

    // Kalendarz (Substancje i Notatki)
    fun getSubstances(date: LocalDate): Flow<List<SubstanceEntry>>
    suspend fun addSubstance(substance: SubstanceEntry)
    suspend fun deleteSubstance(id: String)

    fun getNotes(date: LocalDate): Flow<List<CalendarNote>>
    suspend fun addNote(note: CalendarNote)
    suspend fun deleteNote(id: String)

    // Analizy
    suspend fun getAnalyticsSummary(filter: String): AnalyticsSummary
}`,
  },
  'WorkoutViewModel.kt': {
    path: 'android/app/src/main/java/com/gymtracker/next/viewmodel/WorkoutViewModel.kt',
    category: 'viewmodel',
    content: `package com.gymtracker.next.viewmodel

import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import com.gymtracker.next.domain.model.*
import kotlinx.coroutines.flow.*
import kotlinx.coroutines.launch

class WorkoutViewModel(
    // Wstrzykiwane docelowo przez Hilt / Koin z Room Database
) : ViewModel() {

    private val _activeSession = MutableStateFlow<ActiveWorkoutSession?>(null)
    val activeSession: StateFlow<ActiveWorkoutSession?> = _activeSession.asStateFlow()

    fun toggleSetCompleted(exerciseId: String, setId: String) {
        val current = _activeSession.value ?: return
        val updatedExercises = current.exercises.map { ex ->
            if (ex.id != exerciseId) ex
            else ex.copy(sets = ex.sets.map { s ->
                if (s.id == setId) s.copy(completed = !s.completed) else s
            })
        }
        _activeSession.value = current.copy(exercises = updatedExercises)
    }

    fun addSet(exerciseId: String) {
        val current = _activeSession.value ?: return
        val updatedExercises = current.exercises.map { ex ->
            if (ex.id != exerciseId) ex
            else {
                val lastSet = ex.sets.lastOrNull()
                val newSet = WorkoutSet(
                    id = java.util.UUID.randomUUID().toString(),
                    setNumber = ex.sets.size + 1,
                    weightKg = lastSet?.weightKg ?: 50f,
                    reps = lastSet?.reps ?: 10,
                    completed = false,
                    previousWeightKg = lastSet?.weightKg,
                    previousReps = lastSet?.reps
                )
                ex.copy(sets = ex.sets + newSet)
            }
        }
        _activeSession.value = current.copy(exercises = updatedExercises)
    }

    fun toggleSkipExercise(exerciseId: String) {
        val current = _activeSession.value ?: return
        _activeSession.value = current.copy(
            exercises = current.exercises.map { ex ->
                if (ex.id == exerciseId) ex.copy(skipped = !ex.skipped) else ex
            }
        )
    }

    fun replaceExercise(exerciseId: String, newDef: ExerciseDefinition) {
        val current = _activeSession.value ?: return
        _activeSession.value = current.copy(
            exercises = current.exercises.map { ex ->
                if (ex.id == exerciseId) {
                    ex.copy(
                        exerciseId = newDef.id,
                        name = newDef.name,
                        category = newDef.category,
                        replacedFromExerciseId = ex.exerciseId
                    )
                } else ex
            }
        )
    }

    fun finishWorkout() {
        // Zapisuje sesję do lokalnej bazy Room, oznacza hasRecordedSession = true
        _activeSession.value = null
    }
}`,
  },
  'Theme.kt': {
    path: 'android/app/src/main/java/com/gymtracker/next/ui/theme/Theme.kt',
    category: 'ui',
    content: `package com.gymtracker.next.ui.theme

import androidx.compose.foundation.isSystemInDarkTheme
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.darkColorScheme
import androidx.compose.runtime.Composable
import androidx.compose.ui.graphics.Color

// Nowoczesny ciemny design fitness dopasowany do Xiaomi 14T AMOLED
private val GymTrackerDarkColors = darkColorScheme(
    primary = Color(0xFF22C55E), // Zielony fitness akcent
    onPrimary = Color(0xFF06090E),
    primaryContainer = Color(0xFF14532D),
    onPrimaryContainer = Color(0xFF86EFAC),
    secondary = Color(0xFF38BDF8),
    background = Color(0xFF0A0E14), // Głębokie tło AMOLED
    surface = Color(0xFF131B26),    // Lekko jaśniejsze karty
    onSurface = Color(0xFFF1F5F9),
    surfaceVariant = Color(0xFF1E293B),
    outline = Color(0xFF334155)
)

@Composable
fun GymTrackerTheme(
    darkTheme: Boolean = true,
    content: @Composable () -> Unit
) {
    MaterialTheme(
        colorScheme = GymTrackerDarkColors,
        typography = GymTrackerTypography,
        content = content
    )
}`,
  },
  'MyWeekScreen.kt': {
    path: 'android/app/src/main/java/com/gymtracker/next/ui/screens/today/MyWeekScreen.kt',
    category: 'ui',
    content: `package com.gymtracker.next.ui.screens.today

import androidx.compose.foundation.background
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.*
import androidx.compose.material3.*
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp

/**
 * Ekran „Mój tydzień” - prezentuje 7 dni aktualnego planu w kompaktowych wierszach
 */
@Composable
fun TodayScreen(
    onStartWorkout: () -> Unit,
    onNavigateToCalendar: () -> Unit
) {
    LazyColumn(
        modifier = Modifier
            .fillMaxSize()
            .background(Color(0xFF0A0E14))
            .padding(14.dp),
        verticalArrangement = Arrangement.spacedBy(10.dp)
    ) {
        item {
            // Nagłówek: Zakres dat i przycisk kalendarza
        }
        // 7 dni: Pn - Nd
        item {
            // Duży przycisk rozpoczęcia dzisiejszego treningu
        }
        // Najbliższe wydarzenia
    }
}`,
  },
  'MeasurementsScreen.kt': {
    path: 'android/app/src/main/java/com/planpasika/v2/ui/screens/measurements/MeasurementsScreen.kt',
    category: 'ui',
    content: `package com.planpasika.v2.ui.screens.measurements

import androidx.compose.foundation.background
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.unit.dp

/**
 * Moduł Pomiary ciała, waga i analiza matematyczna progresu dla Xiaomi 14T
 */
@Composable
fun MeasurementsScreen(
    viewModel: MeasurementsViewModel = androidx.lifecycle.viewmodel.compose.viewModel()
) {
    val uiState by viewModel.uiState.collectAsState()
    
    Column(
        modifier = Modifier
            .fillMaxSize()
            .background(Color(0xFF06090E))
            .padding(16.dp)
    ) {
        // Karty podsumowania: Waga, Biceps, Talia
        // Zakładki: Pomiary ciała | Waga | Analiza progresu
        // Wykres liniowy (data vs cm / kg)
        // Historia i formularz wprowadzania
    }
}`,
  },
  'AppSettings.kt': {
    path: 'android/app/src/main/java/com/planpasika/v2/domain/model/AppSettings.kt',
    category: 'Domain',
    content: `package com.planpasika.v2.domain.model

enum class AppThemeMode(val title: String, val description: String) {
    AMOLED("PlanPasika AMOLED", "Głęboka czerń, neonowa zieleń i turkus"),
    DARK_BLUE("Dark Blue", "Ciemny granat z błękitnymi akcentami"),
    GRAPHITE("Graphite", "Grafitowe tło ze szmaragdowym akcentem"),
    PURPLE_DARK("Purple Dark", "Głęboki fiolet i neonowy purpurowy blask"),
    RED_PERFORMANCE("Red Performance", "Agresywna czerwień i głęboki karmazyn"),
    LIGHT("Light Clean", "Jasne tło z ciemnym tekstem i zielenią"),
    SYSTEM("Systemowy", "Automatyczne dopasowanie do motywu Androida")
}

data class AppSettings(
    val themeMode: AppThemeMode = AppThemeMode.AMOLED,
    val autoRestTimer: Boolean = true,
    val defaultRestDurationSeconds: Int = 90,
    val vibrateOnTimerEnd: Boolean = true,
    val soundOnTimerEnd: Boolean = true,
    val quickAddSeconds: Int = 30,
    val amoledPureBlack: Boolean = true,
    val glowEffectsEnabled: Boolean = true
)`,
  },
  'SettingsRepository.kt': {
    path: 'android/app/src/main/java/com/planpasika/v2/data/repository/SettingsRepository.kt',
    category: 'data',
    content: `package com.planpasika.v2.data.repository

import android.content.Context
import androidx.datastore.preferences.core.*
import androidx.datastore.preferences.preferencesDataStore
import com.planpasika.v2.domain.model.*
import kotlinx.coroutines.flow.Flow
import kotlinx.coroutines.flow.map

class SettingsRepository(private val context: Context) {
    // DataStore Preferences implementation
    val settingsFlow: Flow<AppSettings> = context.dataStore.data.map { ... }
    suspend fun saveAllSettings(settings: AppSettings) { ... }
    suspend fun resetToDefaults() { ... }
}`,
  },
  'SettingsScreen.kt': {
    path: 'android/app/src/main/java/com/planpasika/v2/ui/screens/settings/SettingsScreen.kt',
    category: 'ui',
    content: `package com.planpasika.v2.ui.screens.settings

import androidx.compose.material3.*
import androidx.compose.runtime.*
import com.planpasika.v2.domain.model.*

/**
 * Moduł Ustawienia + Motywy (Jetpack Compose Material 3)
 */
@Composable
fun SettingsScreen(
    viewModel: SettingsViewModel,
    onNavigateBack: () -> Unit
) {
    // Sekcja 1: Wygląd (7 motywów: AMOLED, Dark Blue, Graphite, Purple, Red, Light, System)
    // Sekcja 2: Trening & Timery (Auto rest timer, wibracja, dźwięk)
    // Sekcja 3: Plan & Pomiary
    // Sekcja 4: Kopia zapasowa i reset ustawień
}`,
  },
};

export const CodeViewerModal: React.FC<CodeViewerModalProps> = ({ isOpen, onClose }) => {
  const [selectedFileName, setSelectedFileName] = useState<string>('MainActivity.kt');
  const [copied, setCopied] = useState<boolean>(false);

  if (!isOpen) return null;

  const currentFile = KOTLIN_CODE_FILES[selectedFileName];

  const handleCopy = () => {
    navigator.clipboard.writeText(currentFile.content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 bg-black/80 backdrop-blur-md select-none">
      <div className="w-full max-w-4xl bg-[#0C1017] border border-[#223147] rounded-2xl shadow-2xl flex flex-col h-[85vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-3.5 border-b border-slate-800 bg-[#101620]">
          <div className="flex items-center gap-2.5">
            <Code2 className="w-5 h-5 text-[#00F59B]" />
            <div>
              <h2 className="text-sm font-extrabold text-white flex items-center gap-2">
                PlanPasika.v2 · Architektura Kotlin / Android
              </h2>
              <p className="text-[11px] text-slate-400 font-mono">
                {currentFile.path}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleCopy}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gradient-to-r from-[#00F59B] to-[#06D6A0] text-[#06090E] text-xs font-extrabold shadow-sm neon-glow-btn transition-colors"
            >
              {copied ? <Check className="w-4 h-4 stroke-[3]" /> : <Copy className="w-4 h-4" />}
              <span>{copied ? 'Skopiowano!' : 'Kopiuj kod'}</span>
            </button>
            <button
              type="button"
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-white rounded-xl hover:bg-slate-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Body: Left File Tree + Right Code View */}
        <div className="flex-1 flex overflow-hidden">
          {/* File selector sidebar */}
          <div className="w-60 border-r border-slate-800/80 bg-[#090D14] p-3 space-y-1 overflow-y-auto">
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider px-2">
              Moduły Android
            </span>

            {Object.keys(KOTLIN_CODE_FILES).map((fileName) => {
              const file = KOTLIN_CODE_FILES[fileName];
              const isSelected = selectedFileName === fileName;

              return (
                <button
                  key={fileName}
                  type="button"
                  onClick={() => setSelectedFileName(fileName)}
                  className={`w-full flex items-center gap-2 px-2.5 py-2 rounded-xl text-xs text-left transition-all ${
                    isSelected
                      ? 'bg-emerald-500/20 text-emerald-300 font-semibold border border-emerald-500/40'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
                  }`}
                >
                  <FileCode className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                  <div className="truncate">
                    <p className="truncate">{fileName}</p>
                    <span className="text-[9px] text-slate-500 font-mono">
                      {file.category}
                    </span>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Code Viewer Panel */}
          <div className="flex-1 bg-[#070A0F] p-4 overflow-y-auto font-mono text-xs text-slate-300 leading-relaxed">
            <pre className="whitespace-pre-wrap">{currentFile.content}</pre>
          </div>
        </div>
      </div>
    </div>
  );
};
