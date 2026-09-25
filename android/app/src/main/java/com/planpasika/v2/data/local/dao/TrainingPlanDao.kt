package com.planpasika.v2.data.local.dao

import androidx.room.*
import com.planpasika.v2.data.local.entities.*
import com.planpasika.v2.domain.model.DayStatus
import kotlinx.coroutines.flow.Flow

@Dao
interface TrainingPlanDao {

    // Cycles
    @Query("SELECT * FROM training_cycles WHERE isActive = 1 LIMIT 1")
    fun getActiveCycle(): Flow<TrainingCycleEntity?>

    @Query("SELECT * FROM training_cycles")
    fun getAllCycles(): Flow<List<TrainingCycleEntity>>

    @Insert(onConflict = OnConflictStrategy.REPLACE)
    suspend fun insertCycle(cycle: TrainingCycleEntity)

    // Weeks
    @Query("SELECT * FROM training_weeks WHERE cycleId = :cycleId ORDER BY weekNumber ASC")
    fun getWeeksForCycle(cycleId: String): Flow<List<TrainingWeekEntity>>

    @Insert(onConflict = OnConflictStrategy.REPLACE)
    suspend fun insertWeek(week: TrainingWeekEntity)

    @Delete
    suspend fun deleteWeek(week: TrainingWeekEntity)

    // Days
    @Query("SELECT * FROM plan_training_days WHERE weekId = :weekId ORDER BY dayOfWeek ASC")
    fun getDaysForWeek(weekId: String): Flow<List<PlanTrainingDayEntity>>

    @Query("SELECT * FROM plan_training_days WHERE id = :dayId LIMIT 1")
    suspend fun getDayById(dayId: String): PlanTrainingDayEntity?

    @Insert(onConflict = OnConflictStrategy.REPLACE)
    suspend fun insertDay(day: PlanTrainingDayEntity)

    @Query("UPDATE plan_training_days SET manualStatus = :status WHERE id = :dayId")
    suspend fun updateDayStatus(dayId: String, status: DayStatus)

    @Delete
    suspend fun deleteDay(day: PlanTrainingDayEntity)

    // Exercises in Day
    @Query("SELECT * FROM plan_exercises WHERE dayId = :dayId ORDER BY sortOrder ASC")
    fun getExercisesForDay(dayId: String): Flow<List<PlanExerciseEntity>>

    @Insert(onConflict = OnConflictStrategy.REPLACE)
    suspend fun insertPlanExercise(exercise: PlanExerciseEntity)

    @Insert(onConflict = OnConflictStrategy.REPLACE)
    suspend fun insertPlanExercises(exercises: List<PlanExerciseEntity>)

    @Update
    suspend fun updatePlanExercise(exercise: PlanExerciseEntity)

    @Delete
    suspend fun deletePlanExercise(exercise: PlanExerciseEntity)

    @Query("DELETE FROM plan_exercises WHERE dayId = :dayId")
    suspend fun clearExercisesForDay(dayId: String)
}
