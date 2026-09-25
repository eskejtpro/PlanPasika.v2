package com.planpasika.v2.ui.screens.analytics

import android.app.Application
import androidx.lifecycle.AndroidViewModel
import androidx.lifecycle.viewModelScope
import com.planpasika.v2.data.local.dao.CategoryCount
import com.planpasika.v2.data.local.entities.WorkoutSessionEntity
import com.planpasika.v2.data.repository.PlanPasikaRepository
import com.planpasika.v2.domain.model.ExerciseCategory
import kotlinx.coroutines.flow.*

data class AnalyticsUiState(
    val totalWorkoutsCount: Int = 0,
    val totalSetsCount: Int = 0,
    val totalTonnageKg: Float = 0f,
    val categoryDistribution: Map<ExerciseCategory, Int> = emptyMap(),
    val completedSessions: List<WorkoutSessionEntity> = emptyList()
)

class AnalyticsViewModel(application: Application) : AndroidViewModel(application) {

    private val repository = PlanPasikaRepository(application.applicationContext, viewModelScope)

    val uiState: StateFlow<AnalyticsUiState> = MutableStateFlow(
        AnalyticsUiState(
            totalWorkoutsCount = 14,
            totalSetsCount = 168,
            totalTonnageKg = 18450f,
            categoryDistribution = mapOf(
                ExerciseCategory.CHEST to 42,
                ExerciseCategory.BACK to 38,
                ExerciseCategory.LEGS to 40,
                ExerciseCategory.SHOULDERS to 24,
                ExerciseCategory.BICEPS to 12,
                ExerciseCategory.TRICEPS to 12
            )
        )
    ).asStateFlow()
}
