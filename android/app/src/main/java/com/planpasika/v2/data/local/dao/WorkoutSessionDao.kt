package com.planpasika.v2.data.local.dao

import androidx.room.*
import com.planpasika.v2.data.local.entities.WorkoutSessionEntity
import com.planpasika.v2.data.local.entities.WorkoutSetEntity
import com.planpasika.v2.domain.model.ExerciseCategory
import kotlinx.coroutines.flow.Flow

@Dao
interface WorkoutSessionDao {

    @Query("SELECT * FROM workout_sessions WHERE isCompleted = 0 ORDER BY startTime DESC LIMIT 1")
    fun getActiveSession(): Flow<WorkoutSessionEntity?>

    @Query("SELECT * FROM workout_sessions WHERE isCompleted = 1 ORDER BY startTime DESC")
    fun getCompletedSessions(): Flow<List<WorkoutSessionEntity>>

    @Insert(onConflict = OnConflictStrategy.REPLACE)
    suspend fun insertSession(session: WorkoutSessionEntity)

    @Update
    suspend fun updateSession(session: WorkoutSessionEntity)

    @Delete
    suspend fun deleteSession(session: WorkoutSessionEntity)

    // Sets
    @Query("SELECT * FROM workout_sets WHERE sessionId = :sessionId ORDER BY setNumber ASC")
    fun getSetsForSession(sessionId: String): Flow<List<WorkoutSetEntity>>

    @Insert(onConflict = OnConflictStrategy.REPLACE)
    suspend fun insertSet(workoutSet: WorkoutSetEntity)

    @Insert(onConflict = OnConflictStrategy.REPLACE)
    suspend fun insertSets(sets: List<WorkoutSetEntity>)

    @Update
    suspend fun updateSet(workoutSet: WorkoutSetEntity)

    @Delete
    suspend fun deleteSet(workoutSet: WorkoutSetEntity)

    @Query("DELETE FROM workout_sets WHERE id = :setId")
    suspend fun deleteSetById(setId: String)

    // Analytics queries
    @Query("SELECT COUNT(*) FROM workout_sessions WHERE isCompleted = 1")
    fun getTotalCompletedWorkoutsCount(): Flow<Int>

    @Query("SELECT COUNT(*) FROM workout_sets WHERE status = 'COMPLETED'")
    fun getTotalCompletedSetsCount(): Flow<Int>

    @Query("SELECT SUM(weightKg * reps) FROM workout_sets WHERE status = 'COMPLETED'")
    fun getTotalTonnage(): Flow<Float?>

    @Query("SELECT category, COUNT(*) as count FROM workout_sets WHERE status = 'COMPLETED' GROUP BY category")
    fun getSetDistributionByCategory(): Flow<List<CategoryCount>>
}

data class CategoryCount(
    val category: ExerciseCategory,
    val count: Int
)
