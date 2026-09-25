package com.planpasika.v2.data.repository

import android.content.Context
import com.planpasika.v2.data.local.PlanPasikaDatabase
import com.planpasika.v2.data.local.entities.*
import com.planpasika.v2.domain.model.*
import kotlinx.coroutines.CoroutineScope
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.flow.*

class PlanPasikaRepository(context: Context, scope: CoroutineScope = CoroutineScope(Dispatchers.IO)) {

    private val database = PlanPasikaDatabase.getDatabase(context, scope)
    private val planDao = database.trainingPlanDao()
    private val exerciseDao = database.exerciseDao()
    private val sessionDao = database.workoutSessionDao()
    private val measurementDao = database.bodyMeasurementDao()
    private val calendarDao = database.calendarDao()

    // Active session state in memory + persisted to Room
    private val _activeSessionState = MutableStateFlow<ActiveWorkoutSession?>(null)
    val activeSessionState: StateFlow<ActiveWorkoutSession?> = _activeSessionState.asStateFlow()

    // 1. CYCLES & WEEKS & DAYS
    val activeCycleFlow: Flow<TrainingCycleEntity?> = planDao.getActiveCycle()
    val allExercisesFlow: Flow<List<ExerciseDefinitionEntity>> = exerciseDao.getAllExercises()
    val allMeasurementsFlow: Flow<List<BodyMeasurementEntity>> = measurementDao.getAllMeasurements()
    val weightHistoryFlow: Flow<List<BodyMeasurementEntity>> = measurementDao.getWeightHistory()
    val allEventsFlow: Flow<List<CalendarEventEntity>> = calendarDao.getAllEvents()
    val allNotesFlow: Flow<List<WorkoutNoteEntity>> = calendarDao.getAllNotes()

    fun getWeeksForCycle(cycleId: String): Flow<List<TrainingWeekEntity>> = planDao.getWeeksForCycle(cycleId)
    fun getDaysForWeek(weekId: String): Flow<List<PlanTrainingDayEntity>> = planDao.getDaysForWeek(weekId)
    fun getExercisesForDay(dayId: String): Flow<List<PlanExerciseEntity>> = planDao.getExercisesForDay(dayId)

    suspend fun addWeek(cycleId: String, weekNumber: Int, name: String) {
        val week = TrainingWeekEntity(
            id = "week_${System.currentTimeMillis()}",
            cycleId = cycleId,
            weekNumber = weekNumber,
            name = name
        )
        planDao.insertWeek(week)
    }

    suspend fun deleteWeek(week: TrainingWeekEntity) {
        planDao.deleteWeek(week)
    }

    suspend fun addDay(weekId: String, dayOfWeek: Int, dayName: String, planName: String) {
        val day = PlanTrainingDayEntity(
            id = "day_${System.currentTimeMillis()}",
            weekId = weekId,
            dayOfWeek = dayOfWeek,
            dayName = dayName,
            planName = planName,
            manualStatus = DayStatus.UNRESOLVED
        )
        planDao.insertDay(day)
    }

    suspend fun updateDayStatus(dayId: String, status: DayStatus) {
        planDao.updateDayStatus(dayId, status)
    }

    suspend fun deleteDay(day: PlanTrainingDayEntity) {
        planDao.deleteDay(day)
    }

    suspend fun addExerciseToDay(dayId: String, exercise: ExerciseDefinitionEntity, setsCount: Int, reps: String, weightKg: Float, rpe: String) {
        val planExercise = PlanExerciseEntity(
            id = "pe_${System.currentTimeMillis()}",
            dayId = dayId,
            exerciseId = exercise.id,
            name = exercise.name,
            category = exercise.category,
            setsCount = setsCount,
            targetReps = reps,
            targetWeightKg = weightKg,
            targetRpe = rpe
        )
        planDao.insertPlanExercise(planExercise)
    }

    suspend fun deletePlanExercise(exercise: PlanExerciseEntity) {
        planDao.deletePlanExercise(exercise)
    }

    // 2. EXERCISE LIBRARY
    suspend fun saveExercise(exercise: ExerciseDefinitionEntity) {
        exerciseDao.insertExercise(exercise)
    }

    suspend fun deleteExercise(exercise: ExerciseDefinitionEntity) {
        exerciseDao.deleteExercise(exercise)
    }

    // 3. WORKOUT SESSION & TIMER
    fun startWorkoutFromPlan(dayId: String, dayName: String, planName: String, planExercises: List<PlanExerciseEntity>) {
        val activeExercises = planExercises.map { pe ->
            ActiveWorkoutExercise(
                id = "aex_${System.currentTimeMillis()}_${pe.id}",
                exerciseId = pe.exerciseId,
                name = pe.name,
                category = pe.category,
                sets = (1..pe.setsCount).map { setNum ->
                    WorkoutSet(
                        id = "set_${System.currentTimeMillis()}_${pe.id}_$setNum",
                        setNumber = setNum,
                        weightKg = pe.targetWeightKg,
                        reps = pe.targetReps.split("-").firstOrNull()?.toIntOrNull() ?: 8,
                        completed = false
                    )
                }
            )
        }

        val session = ActiveWorkoutSession(
            id = "session_${System.currentTimeMillis()}",
            name = "$dayName — $planName",
            startTime = System.currentTimeMillis(),
            elapsedSeconds = 0L,
            isPaused = false,
            planDayId = dayId,
            exercises = activeExercises
        )
        _activeSessionState.value = session
    }

    fun updateActiveSession(session: ActiveWorkoutSession?) {
        _activeSessionState.value = session
    }

    suspend fun finishWorkout(session: ActiveWorkoutSession) {
        // Calculate stats
        val completedSets = session.exercises.flatMap { it.sets }.filter { it.completed }
        val totalVolume = completedSets.sumOf { (it.weightKg * it.reps).toDouble() }.toFloat()

        val sessionEntity = WorkoutSessionEntity(
            id = session.id,
            name = session.name,
            date = java.text.SimpleDateFormat("yyyy-MM-dd", java.util.Locale.getDefault()).format(java.util.Date()),
            startTime = session.startTime,
            endTime = System.currentTimeMillis(),
            elapsedSeconds = session.elapsedSeconds,
            planDayId = session.planDayId,
            isCompleted = true,
            totalVolumeKg = totalVolume,
            totalSetsCount = completedSets.size,
            notes = session.notes
        )
        sessionDao.insertSession(sessionEntity)

        // Save sets
        val setEntities = session.exercises.flatMap { ex ->
            ex.sets.filter { it.completed }.map { s ->
                WorkoutSetEntity(
                    id = s.id,
                    sessionId = session.id,
                    exerciseId = ex.exerciseId,
                    exerciseName = ex.name,
                    category = ex.category,
                    setNumber = s.setNumber,
                    weightKg = s.weightKg,
                    reps = s.reps,
                    status = "COMPLETED"
                )
            }
        }
        sessionDao.insertSets(setEntities)

        // Update day status in plan
        session.planDayId?.let { dayId ->
            planDao.updateDayStatus(dayId, DayStatus.COMPLETED)
        }

        _activeSessionState.value = null
    }

    fun discardActiveWorkout() {
        _activeSessionState.value = null
    }

    // 4. MEASUREMENTS
    suspend fun addMeasurement(measurement: BodyMeasurementEntity) {
        measurementDao.insertMeasurement(measurement)
    }

    suspend fun deleteMeasurement(measurement: BodyMeasurementEntity) {
        measurementDao.deleteMeasurement(measurement)
    }

    // 5. CALENDAR & NOTES & SUBSTANCES
    suspend fun addCalendarEvent(event: CalendarEventEntity) {
        calendarDao.insertEvent(event)
    }

    suspend fun deleteCalendarEvent(event: CalendarEventEntity) {
        calendarDao.deleteEvent(event)
    }

    suspend fun addNote(note: WorkoutNoteEntity) {
        calendarDao.insertNote(note)
    }

    suspend fun deleteNote(note: WorkoutNoteEntity) {
        calendarDao.deleteNote(note)
    }

    suspend fun addSubstanceLog(substance: SubstanceLogEntity) {
        calendarDao.insertSubstance(substance)
    }

    suspend fun deleteSubstanceLog(substance: SubstanceLogEntity) {
        calendarDao.deleteSubstance(substance)
    }
}
