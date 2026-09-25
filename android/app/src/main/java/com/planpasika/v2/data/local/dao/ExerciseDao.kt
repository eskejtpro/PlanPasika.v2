package com.planpasika.v2.data.local.dao

import androidx.room.*
import com.planpasika.v2.data.local.entities.ExerciseDefinitionEntity
import com.planpasika.v2.domain.model.ExerciseCategory
import kotlinx.coroutines.flow.Flow

@Dao
interface ExerciseDao {

    @Query("SELECT * FROM exercise_definitions ORDER BY name ASC")
    fun getAllExercises(): Flow<List<ExerciseDefinitionEntity>>

    @Query("SELECT * FROM exercise_definitions WHERE category = :category ORDER BY name ASC")
    fun getExercisesByCategory(category: ExerciseCategory): Flow<List<ExerciseDefinitionEntity>>

    @Query("SELECT * FROM exercise_definitions WHERE name LIKE '%' || :query || '%' OR technique LIKE '%' || :query || '%' ORDER BY name ASC")
    fun searchExercises(query: String): Flow<List<ExerciseDefinitionEntity>>

    @Query("SELECT * FROM exercise_definitions WHERE id = :id LIMIT 1")
    suspend fun getExerciseById(id: String): ExerciseDefinitionEntity?

    @Insert(onConflict = OnConflictStrategy.REPLACE)
    suspend fun insertExercise(exercise: ExerciseDefinitionEntity)

    @Insert(onConflict = OnConflictStrategy.REPLACE)
    suspend fun insertExercises(exercises: List<ExerciseDefinitionEntity>)

    @Update
    suspend fun updateExercise(exercise: ExerciseDefinitionEntity)

    @Delete
    suspend fun deleteExercise(exercise: ExerciseDefinitionEntity)

    @Query("SELECT COUNT(*) FROM exercise_definitions")
    suspend fun getCount(): Int
}
