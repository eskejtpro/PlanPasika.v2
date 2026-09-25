package com.planpasika.v2.data.local.dao

import androidx.room.*
import com.planpasika.v2.data.local.entities.BodyMeasurementEntity
import kotlinx.coroutines.flow.Flow

@Dao
interface BodyMeasurementDao {

    @Query("SELECT * FROM body_measurements ORDER BY date DESC, timestamp DESC")
    fun getAllMeasurements(): Flow<List<BodyMeasurementEntity>>

    @Query("SELECT * FROM body_measurements ORDER BY date ASC, timestamp ASC")
    fun getAllMeasurementsAscending(): Flow<List<BodyMeasurementEntity>>

    @Query("SELECT * FROM body_measurements WHERE weightKg IS NOT NULL ORDER BY date ASC")
    fun getWeightHistory(): Flow<List<BodyMeasurementEntity>>

    @Query("SELECT * FROM body_measurements WHERE id = :id LIMIT 1")
    suspend fun getMeasurementById(id: String): BodyMeasurementEntity?

    @Insert(onConflict = OnConflictStrategy.REPLACE)
    suspend fun insertMeasurement(measurement: BodyMeasurementEntity)

    @Update
    suspend fun updateMeasurement(measurement: BodyMeasurementEntity)

    @Delete
    suspend fun deleteMeasurement(measurement: BodyMeasurementEntity)

    @Query("SELECT MIN(weightKg) FROM body_measurements WHERE weightKg IS NOT NULL")
    fun getMinWeight(): Flow<Float?>

    @Query("SELECT MAX(weightKg) FROM body_measurements WHERE weightKg IS NOT NULL")
    fun getMaxWeight(): Flow<Float?>
}
