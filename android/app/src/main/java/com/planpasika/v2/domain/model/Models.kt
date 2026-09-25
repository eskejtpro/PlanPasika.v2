package com.planpasika.v2.domain.model

enum class DayType {
    WORKOUT,
    REST,
    EMPTY
}

enum class DayStatus {
    UNRESOLVED,
    COMPLETED,
    NOT_COMPLETED
}

data class ExerciseDefinition(
    val id: String,
    val name: String,
    val category: ExerciseCategory,
    val defaultSets: Int = 3,
    val notes: String? = null
)

data class WorkoutSet(
    val id: String,
    val setNumber: Int,
    val weightKg: Float,
    val reps: Int,
    val completed: Boolean = false,
    val previousWeightKg: Float? = null,
    val previousReps: Int? = null
)

data class PlanSet(
    val id: String,
    val setNumber: Int,
    var weightKg: Float,
    var reps: Int,
    var completed: Boolean = false
)

data class PlanExerciseItem(
    val id: String,
    val exerciseId: String,
    val name: String,
    val category: ExerciseCategory,
    val sets: MutableList<PlanSet> = mutableListOf(),
    var notes: String? = null
)

data class PlanTrainingDay(
    val id: String,
    val dayOfWeek: Int, // 1 (Mon) .. 7 (Sun)
    val dayName: String, // "Poniedziałek", "Wtorek"...
    var planName: String, // "Push", "Pull", "Legs"...
    val exercises: MutableList<PlanExerciseItem> = mutableListOf(),
    var manualStatus: DayStatus = DayStatus.UNRESOLVED,
    var notes: String? = null
)

data class TrainingWeek(
    val id: String,
    val weekNumber: Int, // 1, 2, 3...
    val name: String, // "Tydzień 1", "Tydzień 2"...
    val days: MutableList<PlanTrainingDay> = mutableListOf()
)

data class TrainingCycleData(
    val id: String,
    val name: String, // "Cykl 2: Hipertrofia & Objętość"
    val startDate: String, // "14.09.2026"
    val weeks: MutableList<TrainingWeek> = mutableListOf(),
    val isActive: Boolean = true
)

data class ActiveWorkoutExercise(
    val id: String,
    val exerciseId: String,
    val name: String,
    val category: ExerciseCategory,
    val skipped: Boolean = false,
    val replacedFromExerciseId: String? = null,
    val sets: List<WorkoutSet> = emptyList(),
    var notes: String? = null
)

data class ActiveWorkoutSession(
    val id: String,
    val name: String,
    val startTime: Long,
    val elapsedSeconds: Long = 0L,
    val isPaused: Boolean = false,
    val planDayId: String? = null,
    val exercises: List<ActiveWorkoutExercise> = emptyList(),
    var notes: String? = null
)

data class PlanDay(
    val date: String, // YYYY-MM-DD
    val dayOfWeek: Int, // 1 (Mon) .. 7 (Sun)
    val dayType: DayType = DayType.EMPTY,
    val workoutName: String? = null,
    val exercises: List<ExerciseDefinition> = emptyList(),
    val manualStatus: DayStatus = DayStatus.UNRESOLVED,
    val hasRecordedSession: Boolean = false
)

data class SubstanceEntry(
    val id: String,
    val date: String,
    val time: String,
    val name: String,
    val details: String
)

data class CalendarNote(
    val id: String,
    val date: String,
    val content: String,
    val createdAt: String
)

data class UpcomingEvent(
    val id: String,
    val dateLabel: String,
    val title: String,
    val type: String, // "workout", "substance", "note", "rest"
    val subtitle: String? = null
)
