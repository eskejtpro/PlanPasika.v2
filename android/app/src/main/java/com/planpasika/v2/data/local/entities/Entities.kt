package com.planpasika.v2.data.local.entities

import androidx.room.*
import com.planpasika.v2.domain.model.DayStatus
import com.planpasika.v2.domain.model.ExerciseCategory

@Entity(tableName = "training_cycles")
data class TrainingCycleEntity(
    @PrimaryKey val id: String,
    val name: String,
    val startDate: String,
    val isActive: Boolean = true
)

@Entity(
    tableName = "training_weeks",
    foreignKeys = [
        ForeignKey(
            entity = TrainingCycleEntity::class,
            parentColumns = ["id"],
            childColumns = ["cycleId"],
            onDelete = ForeignKey.CASCADE
        )
    ],
    indices = [Index("cycleId")]
)
data class TrainingWeekEntity(
    @PrimaryKey val id: String,
    val cycleId: String,
    val weekNumber: Int,
    val name: String
)

@Entity(
    tableName = "plan_training_days",
    foreignKeys = [
        ForeignKey(
            entity = TrainingWeekEntity::class,
            parentColumns = ["id"],
            childColumns = ["weekId"],
            onDelete = ForeignKey.CASCADE
        )
    ],
    indices = [Index("weekId")]
)
data class PlanTrainingDayEntity(
    @PrimaryKey val id: String,
    val weekId: String,
    val dayOfWeek: Int, // 1 (Mon) .. 7 (Sun)
    val dayName: String,
    val planName: String,
    val manualStatus: DayStatus = DayStatus.UNRESOLVED,
    val notes: String? = null
)

@Entity(
    tableName = "plan_exercises",
    foreignKeys = [
        ForeignKey(
            entity = PlanTrainingDayEntity::class,
            parentColumns = ["id"],
            childColumns = ["dayId"],
            onDelete = ForeignKey.CASCADE
        )
    ],
    indices = [Index("dayId")]
)
data class PlanExerciseEntity(
    @PrimaryKey val id: String,
    val dayId: String,
    val exerciseId: String,
    val name: String,
    val category: ExerciseCategory,
    val setsCount: Int = 3,
    val targetReps: String = "8-10",
    val targetWeightKg: Float = 0f,
    val targetRpe: String = "8",
    val sortOrder: Int = 0,
    val notes: String? = null
)

@Entity(tableName = "exercise_definitions")
data class ExerciseDefinitionEntity(
    @PrimaryKey val id: String,
    val name: String,
    val category: ExerciseCategory,
    val equipment: String = "Sztanga",
    val technique: String? = null,
    val defaultSets: Int = 3,
    val defaultReps: String = "8-10",
    val defaultRpe: String = "8",
    val isCustom: Boolean = false,
    val notes: String? = null
)

@Entity(tableName = "workout_sessions")
data class WorkoutSessionEntity(
    @PrimaryKey val id: String,
    val name: String,
    val date: String, // YYYY-MM-DD
    val startTime: Long,
    val endTime: Long? = null,
    val elapsedSeconds: Long = 0L,
    val planDayId: String? = null,
    val isCompleted: Boolean = false,
    val totalVolumeKg: Float = 0f,
    val totalSetsCount: Int = 0,
    val notes: String? = null
)

@Entity(
    tableName = "workout_sets",
    foreignKeys = [
        ForeignKey(
            entity = WorkoutSessionEntity::class,
            parentColumns = ["id"],
            childColumns = ["sessionId"],
            onDelete = ForeignKey.CASCADE
        )
    ],
    indices = [Index("sessionId")]
)
data class WorkoutSetEntity(
    @PrimaryKey val id: String,
    val sessionId: String,
    val exerciseId: String,
    val exerciseName: String,
    val category: ExerciseCategory,
    val setNumber: Int,
    val weightKg: Float,
    val reps: Int,
    val rpe: Float? = null,
    val status: String = "COMPLETED", // "NOT_STARTED", "DRAFT", "COMPLETED"
    val completedAt: Long = System.currentTimeMillis()
)

@Entity(tableName = "body_measurements")
data class BodyMeasurementEntity(
    @PrimaryKey val id: String,
    val date: String, // YYYY-MM-DD
    val weightKg: Float? = null,
    val chestCm: Float? = null,
    val bicepsCm: Float? = null,
    val tricepsCm: Float? = null,
    val shouldersCm: Float? = null,
    val waistCm: Float? = null,
    val hipsCm: Float? = null,
    val thighCm: Float? = null,
    val calfCm: Float? = null,
    val notes: String? = null,
    val timestamp: Long = System.currentTimeMillis()
)

@Entity(tableName = "calendar_events")
data class CalendarEventEntity(
    @PrimaryKey val id: String,
    val title: String,
    val date: String, // YYYY-MM-DD
    val time: String? = null, // HH:MM
    val category: String = "TRENING", // TRENING, ZDROWIE, ZAWODY, INNE
    val description: String? = null,
    val timestamp: Long = System.currentTimeMillis()
)

@Entity(tableName = "substance_logs")
data class SubstanceLogEntity(
    @PrimaryKey val id: String,
    val name: String,
    val dose: String,
    val unit: String = "mg",
    val date: String, // YYYY-MM-DD
    val time: String? = null,
    val details: String? = null,
    val timestamp: Long = System.currentTimeMillis()
)

@Entity(tableName = "workout_notes")
data class WorkoutNoteEntity(
    @PrimaryKey val id: String,
    val date: String, // YYYY-MM-DD
    val title: String,
    val content: String,
    val category: String = "OGÓLNE",
    val timestamp: Long = System.currentTimeMillis()
)
