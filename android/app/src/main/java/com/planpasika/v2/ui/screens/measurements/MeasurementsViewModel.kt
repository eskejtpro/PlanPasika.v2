package com.planpasika.v2.ui.screens.measurements

import android.app.Application
import androidx.lifecycle.AndroidViewModel
import androidx.lifecycle.viewModelScope
import com.planpasika.v2.data.local.entities.BodyMeasurementEntity
import com.planpasika.v2.data.repository.PlanPasikaRepository
import kotlinx.coroutines.flow.*
import kotlinx.coroutines.launch

data class MeasurementsStats(
    val currentWeightKg: Float? = null,
    val startingWeightKg: Float? = null,
    val totalWeightChangeKg: Float? = null,
    val minWeightKg: Float? = null,
    val maxWeightKg: Float? = null,
    val currentBicepsCm: Float? = null,
    val totalBicepsChangeCm: Float? = null,
    val currentWaistCm: Float? = null,
    val totalWaistChangeCm: Float? = null,
    val totalMeasurementsCount: Int = 0
)

class MeasurementsViewModel(application: Application) : AndroidViewModel(application) {

    private val repository = PlanPasikaRepository(application.applicationContext, viewModelScope)

    val measurementsList: StateFlow<List<BodyMeasurementEntity>> = repository.allMeasurementsFlow
        .stateIn(viewModelScope, SharingStarted.WhileSubscribed(5000), emptyList())

    val stats: StateFlow<MeasurementsStats> = measurementsList.map { list ->
        if (list.isEmpty()) return@map MeasurementsStats()
        val sortedAsc = list.sortedBy { it.date }
        val first = sortedAsc.firstOrNull()
        val latest = sortedAsc.lastOrNull()

        val weights = list.mapNotNull { it.weightKg }
        val minW = weights.minOrNull()
        val maxW = weights.maxOrNull()

        val startW = first?.weightKg
        val currW = latest?.weightKg
        val diffW = if (startW != null && currW != null) currW - startW else null

        val startBic = first?.bicepsCm
        val currBic = latest?.bicepsCm
        val diffBic = if (startBic != null && currBic != null) currBic - startBic else null

        val startWaist = first?.waistCm
        val currWaist = latest?.waistCm
        val diffWaist = if (startWaist != null && currWaist != null) currWaist - startWaist else null

        MeasurementsStats(
            currentWeightKg = currW,
            startingWeightKg = startW,
            totalWeightChangeKg = diffW,
            minWeightKg = minW,
            maxWeightKg = maxW,
            currentBicepsCm = currBic,
            totalBicepsChangeCm = diffBic,
            currentWaistCm = currWaist,
            totalWaistChangeCm = diffWaist,
            totalMeasurementsCount = list.size
        )
    }.stateIn(viewModelScope, SharingStarted.WhileSubscribed(5000), MeasurementsStats())

    fun addMeasurement(
        date: String,
        weight: Float?,
        chest: Float?,
        biceps: Float?,
        triceps: Float?,
        shoulders: Float?,
        waist: Float?,
        hips: Float?,
        thigh: Float?,
        calf: Float?,
        notes: String?
    ) {
        viewModelScope.launch {
            val entity = BodyMeasurementEntity(
                id = "m_${System.currentTimeMillis()}",
                date = date,
                weightKg = weight,
                chestCm = chest,
                bicepsCm = biceps,
                tricepsCm = triceps,
                shouldersCm = shoulders,
                waistCm = waist,
                hipsCm = hips,
                thighCm = thigh,
                calfCm = calf,
                notes = notes
            )
            repository.addMeasurement(entity)
        }
    }

    fun deleteMeasurement(measurement: BodyMeasurementEntity) {
        viewModelScope.launch {
            repository.deleteMeasurement(measurement)
        }
    }
}
