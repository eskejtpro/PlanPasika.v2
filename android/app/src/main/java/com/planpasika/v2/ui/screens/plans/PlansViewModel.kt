package com.planpasika.v2.ui.screens.plans

import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import com.planpasika.v2.domain.model.*
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.asStateFlow
import kotlinx.coroutines.flow.update

data class PlansUiState(
    val cycleName: String = "Cykl 2: Hipertrofia & Objętość",
    val cycleStartDate: String = "14.09.2026",
    val weeks: List<TrainingWeek> = emptyList(),
    val selectedWeekId: String = "week_2",
    val selectedDayId: String? = null
)

class PlansViewModel : ViewModel() {

    private val _uiState = MutableStateFlow(PlansUiState())
    val uiState: StateFlow<PlansUiState> = _uiState.asStateFlow()

    private val cycle = TrainingCycleData(
        id = "cycle_main",
        name = "Cykl 2: Hipertrofia & Objętość",
        startDate = "14.09.2026",
        weeks = mutableListOf(
            TrainingWeek(
                id = "week_1",
                weekNumber = 1,
                name = "Tydzień 1",
                days = mutableListOf(
                    PlanTrainingDay(
                        id = "w1_d1",
                        dayOfWeek = 1,
                        dayName = "Poniedziałek",
                        planName = "Push",
                        manualStatus = DayStatus.COMPLETED
                    ),
                    PlanTrainingDay(
                        id = "w1_d2",
                        dayOfWeek = 2,
                        dayName = "Wtorek",
                        planName = "Pull",
                        manualStatus = DayStatus.COMPLETED
                    )
                )
            ),
            TrainingWeek(
                id = "week_2",
                weekNumber = 2,
                name = "Tydzień 2",
                days = mutableListOf(
                    PlanTrainingDay(
                        id = "w2_d1",
                        dayOfWeek = 1,
                        dayName = "Poniedziałek",
                        planName = "Push",
                        manualStatus = DayStatus.COMPLETED,
                        exercises = mutableListOf(
                            PlanExerciseItem(
                                id = "ex_1",
                                exerciseId = "ex_chest_1",
                                name = "Wyciskanie sztangi",
                                category = ExerciseCategory.CHEST,
                                sets = mutableListOf(
                                    PlanSet("s1", 1, 80f, 8, true),
                                    PlanSet("s2", 2, 80f, 8, true),
                                    PlanSet("s3", 3, 80f, 8, true)
                                )
                            ),
                            PlanExerciseItem(
                                id = "ex_2",
                                exerciseId = "ex_chest_2",
                                name = "Wyciskanie hantli",
                                category = ExerciseCategory.CHEST,
                                sets = mutableListOf(
                                    PlanSet("s4", 1, 30f, 10, true),
                                    PlanSet("s5", 2, 30f, 10, true),
                                    PlanSet("s6", 3, 30f, 10, true)
                                )
                            )
                        )
                    ),
                    PlanTrainingDay(
                        id = "w2_d2",
                        dayOfWeek = 2,
                        dayName = "Wtorek",
                        planName = "Pull",
                        manualStatus = DayStatus.UNRESOLVED
                    ),
                    PlanTrainingDay(
                        id = "w2_d3",
                        dayOfWeek = 3,
                        dayName = "Środa",
                        planName = "Legs",
                        manualStatus = DayStatus.NOT_COMPLETED
                    )
                )
            ),
            TrainingWeek(
                id = "week_3",
                weekNumber = 3,
                name = "Tydzień 3",
                days = mutableListOf()
            )
        )
    )

    init {
        publishState()
    }

    private fun publishState() {
        _uiState.update {
            it.copy(
                cycleName = cycle.name,
                cycleStartDate = cycle.startDate,
                weeks = cycle.weeks.map { w -> w.copy(days = w.days.toMutableList()) }
            )
        }
    }

    fun selectWeek(weekId: String) {
        _uiState.update { it.copy(selectedWeekId = weekId, selectedDayId = null) }
    }

    fun addNewWeek() {
        val nextNum = cycle.weeks.size + 1
        val newWeek = TrainingWeek(
            id = "week_$nextNum",
            weekNumber = nextNum,
            name = "Tydzień $nextNum",
            days = mutableListOf()
        )
        cycle.weeks.add(newWeek)
        publishState()
        selectWeek(newWeek.id)
    }

    fun selectDay(dayId: String) {
        _uiState.update { it.copy(selectedDayId = dayId) }
    }

    fun backToWeek() {
        _uiState.update { it.copy(selectedDayId = null) }
    }

    fun addDayToWeek(weekId: String, dayOfWeek: Int, dayName: String, planName: String) {
        val week = cycle.weeks.find { it.id == weekId } ?: return
        if (week.days.any { it.dayOfWeek == dayOfWeek }) return // No duplicate day in week

        val newDay = PlanTrainingDay(
            id = "day_${System.currentTimeMillis()}",
            dayOfWeek = dayOfWeek,
            dayName = dayName,
            planName = planName.ifBlank { "Trening" },
            exercises = mutableListOf(),
            manualStatus = DayStatus.UNRESOLVED
        )
        week.days.add(newDay)
        week.days.sortBy { it.dayOfWeek }
        publishState()
        selectDay(newDay.id)
    }

    fun setDayStatus(weekId: String, dayId: String, status: DayStatus) {
        val week = cycle.weeks.find { it.id == weekId } ?: return
        val day = week.days.find { it.id == dayId } ?: return
        day.manualStatus = status
        publishState()
    }

    fun addSetToExercise(weekId: String, dayId: String, exerciseId: String) {
        val week = cycle.weeks.find { it.id == weekId } ?: return
        val day = week.days.find { it.id == dayId } ?: return
        val ex = day.exercises.find { it.id == exerciseId } ?: return

        val lastSet = ex.sets.lastOrNull()
        val newSet = PlanSet(
            id = "set_${System.currentTimeMillis()}",
            setNumber = ex.sets.size + 1,
            weightKg = lastSet?.weightKg ?: 50f,
            reps = lastSet?.reps ?: 10,
            completed = false
        )
        ex.sets.add(newSet)
        publishState()
    }

    fun removeSetFromExercise(weekId: String, dayId: String, exerciseId: String, setId: String) {
        val week = cycle.weeks.find { it.id == weekId } ?: return
        val day = week.days.find { it.id == dayId } ?: return
        val ex = day.exercises.find { it.id == exerciseId } ?: return

        ex.sets.removeAll { it.id == setId }
        ex.sets.forEachIndexed { index, s ->
            // Reindex
        }
        publishState()
    }

    fun updateDayNotes(weekId: String, dayId: String, notes: String) {
        val week = cycle.weeks.find { it.id == weekId } ?: return
        val day = week.days.find { it.id == dayId } ?: return
        day.notes = notes
        publishState()
    }

    fun updateExerciseNotes(weekId: String, dayId: String, exerciseId: String, notes: String) {
        val week = cycle.weeks.find { it.id == weekId } ?: return
        val day = week.days.find { it.id == dayId } ?: return
        val ex = day.exercises.find { it.id == exerciseId } ?: return
        ex.notes = notes
        publishState()
    }
}
