package com.planpasika.v2.data.local.dao

import androidx.room.*
import com.planpasika.v2.data.local.entities.CalendarEventEntity
import com.planpasika.v2.data.local.entities.SubstanceLogEntity
import com.planpasika.v2.data.local.entities.WorkoutNoteEntity
import kotlinx.coroutines.flow.Flow

@Dao
interface CalendarDao {

    // Events
    @Query("SELECT * FROM calendar_events ORDER BY date ASC, time ASC")
    fun getAllEvents(): Flow<List<CalendarEventEntity>>

    @Query("SELECT * FROM calendar_events WHERE date = :date ORDER BY time ASC")
    fun getEventsForDate(date: String): Flow<List<CalendarEventEntity>>

    @Insert(onConflict = OnConflictStrategy.REPLACE)
    suspend fun insertEvent(event: CalendarEventEntity)

    @Update
    suspend fun updateEvent(event: CalendarEventEntity)

    @Delete
    suspend fun deleteEvent(event: CalendarEventEntity)

    // Substances
    @Query("SELECT * FROM substance_logs ORDER BY date DESC, timestamp DESC")
    fun getAllSubstances(): Flow<List<SubstanceLogEntity>>

    @Query("SELECT * FROM substance_logs WHERE date = :date ORDER BY timestamp ASC")
    fun getSubstancesForDate(date: String): Flow<List<SubstanceLogEntity>>

    @Insert(onConflict = OnConflictStrategy.REPLACE)
    suspend fun insertSubstance(substance: SubstanceLogEntity)

    @Delete
    suspend fun deleteSubstance(substance: SubstanceLogEntity)

    // Notes
    @Query("SELECT * FROM workout_notes ORDER BY date DESC, timestamp DESC")
    fun getAllNotes(): Flow<List<WorkoutNoteEntity>>

    @Query("SELECT * FROM workout_notes WHERE date = :date ORDER BY timestamp ASC")
    fun getNotesForDate(date: String): Flow<List<WorkoutNoteEntity>>

    @Insert(onConflict = OnConflictStrategy.REPLACE)
    suspend fun insertNote(note: WorkoutNoteEntity)

    @Update
    suspend fun updateNote(note: WorkoutNoteEntity)

    @Delete
    suspend fun deleteNote(note: WorkoutNoteEntity)
}
