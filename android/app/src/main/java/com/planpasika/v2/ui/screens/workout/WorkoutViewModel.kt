package com.planpasika.v2.ui.screens.workout

import android.app.Application
import androidx.lifecycle.AndroidViewModel
import androidx.lifecycle.viewModelScope
import com.planpasika.v2.data.repository.PlanPasikaRepository
import com.planpasika.v2.domain.model.*
import kotlinx.coroutines.Job
import kotlinx.coroutines.delay
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.launch

class WorkoutViewModel(application: Application) : AndroidViewModel(application) {

    private val repository = PlanPasikaRepository(application.applicationContext, viewModelScope)
    val activeSession: StateFlow<ActiveWorkoutSession?> = repository.activeSessionState

    private var timerJob: Job? = null

    init {
        startTimerTicker()
    }

    private fun startTimerTicker() {
        timerJob?.cancel()
        timerJob = viewModelScope.launch {
            while (true) {
                delay(1000)
                val current = activeSession.value
                if (current != null && !current.isPaused) {
                    repository.updateActiveSession(
                        current.copy(elapsedSeconds = current.elapsedSeconds + 1)
                    )
                }
            }
        }
    }

    fun togglePause() {
        val current = activeSession.value ?: return
        repository.updateActiveSession(current.copy(isPaused = !current.isPaused))
    }

    fun toggleSetCompleted(exerciseIndex: Int, setIndex: Int) {
        val current = activeSession.value ?: return
        val updatedExercises = current.exercises.toMutableList()
        val exercise = updatedExercises[exerciseIndex]
        val updatedSets = exercise.sets.toMutableList()
        val set = updatedSets[setIndex]

        updatedSets[setIndex] = set.copy(completed = !set.completed)
        updatedExercises[exerciseIndex] = exercise.copy(sets = updatedSets)

        repository.updateActiveSession(current.copy(exercises = updatedExercises))
    }

    fun updateSetWeightAndReps(exerciseIndex: Int, setIndex: Int, weight: Float, reps: Int) {
        val current = activeSession.value ?: return
        val updatedExercises = current.exercises.toMutableList()
        val exercise = updatedExercises[exerciseIndex]
        val updatedSets = exercise.sets.toMutableList()
        val set = updatedSets[setIndex]

        updatedSets[setIndex] = set.copy(weightKg = weight, reps = reps)
        updatedExercises[exerciseIndex] = exercise.copy(sets = updatedSets)

        repository.updateActiveSession(current.copy(exercises = updatedExercises))
    }

    fun addSet(exerciseIndex: Int) {
        val current = activeSession.value ?: return
        val updatedExercises = current.exercises.toMutableList()
        val exercise = updatedExercises[exerciseIndex]
        val updatedSets = exercise.sets.toMutableList()
        val lastSet = updatedSets.lastOrNull()

        val newSet = WorkoutSet(
            id = "set_${System.currentTimeMillis()}",
            setNumber = updatedSets.size + 1,
            weightKg = lastSet?.weightKg ?: 0f,
            reps = lastSet?.reps ?: 8,
            completed = false
        )
        updatedSets.add(newSet)
        updatedExercises[exerciseIndex] = exercise.copy(sets = updatedSets)

        repository.updateActiveSession(current.copy(exercises = updatedExercises))
    }

    fun finishWorkout(onFinished: () -> Unit) {
        val current = activeSession.value ?: return
        viewModelScope.launch {
            repository.finishWorkout(current)
            onFinished()
        }
    }

    fun discardWorkout(onDiscarded: () -> Unit) {
        repository.discardActiveWorkout()
        onDiscarded()
    }
}
