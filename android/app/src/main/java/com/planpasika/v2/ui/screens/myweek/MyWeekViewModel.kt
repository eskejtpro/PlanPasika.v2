package com.planpasika.v2.ui.screens.myweek

import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import com.planpasika.v2.domain.model.*
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.asStateFlow
import kotlinx.coroutines.flow.update
import kotlinx.coroutines.launch
import java.time.DayOfWeek
import java.time.LocalDate
import java.time.format.DateTimeFormatter
import java.util.Locale

class MyWeekViewModel : ViewModel() {

    private val _uiState = MutableStateFlow(MyWeekUiState())
    val uiState: StateFlow<MyWeekUiState> = _uiState.asStateFlow()

    // Mock in-memory repository (docelowo Room SQLite w kolejnym etapie)
    private val plansStorage = mutableMapOf<String, PlanDay>()

    init {
        seedInitialWeek()
        loadWeekData()
    }

    private fun seedInitialWeek() {
        val today = LocalDate.now()
        val monday = today.with(DayOfWeek.MONDAY)

        val samplePlans = listOf(
            PlanDay(
                date = monday.toString(),
                dayOfWeek = 1,
                dayType = DayType.WORKOUT,
                workoutName = "Klatka + Triceps (Góra A)",
                manualStatus = DayStatus.COMPLETED,
                hasRecordedSession = true
            ),
            PlanDay(
                date = monday.plusDays(1).toString(),
                dayOfWeek = 2,
                dayType = DayType.WORKOUT,
                workoutName = "Plecy + Biceps (Góra B)",
                manualStatus = DayStatus.COMPLETED,
                hasRecordedSession = true
            ),
            PlanDay(
                date = monday.plusDays(2).toString(),
                dayOfWeek = 3,
                dayType = DayType.REST,
                manualStatus = DayStatus.UNRESOLVED
            ),
            PlanDay(
                date = monday.plusDays(3).toString(),
                dayOfWeek = 4,
                dayType = DayType.WORKOUT,
                workoutName = "Nogi + Brzuch (Dół A)",
                manualStatus = DayStatus.COMPLETED,
                hasRecordedSession = true
            ),
            PlanDay(
                date = monday.plusDays(4).toString(),
                dayOfWeek = 5,
                dayType = DayType.WORKOUT,
                workoutName = "Barki + Ramiona (Hipertrofia)",
                manualStatus = DayStatus.UNRESOLVED,
                hasRecordedSession = false
            ),
            PlanDay(
                date = monday.plusDays(5).toString(),
                dayOfWeek = 6,
                dayType = DayType.REST,
                manualStatus = DayStatus.UNRESOLVED
            ),
            PlanDay(
                date = monday.plusDays(6).toString(),
                dayOfWeek = 7,
                dayType = DayType.EMPTY,
                manualStatus = DayStatus.UNRESOLVED
            )
        )

        samplePlans.forEach { plansStorage[it.date] = it }
    }

    fun loadWeekData() {
        viewModelScope.launch {
            val today = LocalDate.now()
            val monday = today.with(DayOfWeek.MONDAY)
            val sunday = monday.plusDays(6)

            val formatterPolish = DateTimeFormatter.ofPattern("d MMMM yyyy", Locale("pl"))
            val rangeFormatted = "${monday.dayOfMonth}–${sunday.dayOfMonth} ${sunday.format(DateTimeFormatter.ofPattern("LLLL yyyy", Locale("pl")))}"

            val shortNames = listOf("Pn", "Wt", "Śr", "Cz", "Pt", "So", "Nd")
            val fullNames = listOf("Poniedziałek", "Wtorek", "Środa", "Czwartek", "Piątek", "Sobota", "Niedziela")

            val days = (0..6).map { i ->
                val date = monday.plusDays(i.toLong())
                val dateStr = date.toString()
                val isToday = date == today

                val plan = plansStorage[dateStr] ?: PlanDay(
                    date = dateStr,
                    dayOfWeek = i + 1,
                    dayType = DayType.EMPTY,
                    manualStatus = DayStatus.UNRESOLVED
                )

                WeekDayItem(
                    date = dateStr,
                    dayOfWeek = i + 1,
                    dayShort = shortNames[i],
                    dayFull = fullNames[i],
                    dayNumber = date.dayOfMonth,
                    isToday = isToday,
                    plan = plan
                )
            }

            val todayPlan = plansStorage[today.toString()]

            val upcoming = listOf(
                UpcomingEvent(
                    id = "up_1",
                    dateLabel = "Jutro, Sobota",
                    title = "Dzień wolny (Regeneracja)",
                    type = "rest"
                ),
                UpcomingEvent(
                    id = "up_2",
                    dateLabel = "Niedziela",
                    title = "Planowanie kolejnego tygodnia",
                    type = "note",
                    subtitle = "Przygotuj progresję obciążeń"
                )
            )

            _uiState.update {
                it.copy(
                    weekRangeFormatted = rangeFormatted,
                    weekDays = days,
                    todayPlan = todayPlan,
                    upcomingEvents = upcoming
                )
            }
        }
    }

    fun onSelectDay(day: WeekDayItem) {
        _uiState.update { it.copy(selectedDayPreview = day) }
    }

    fun onDismissPreview() {
        _uiState.update { it.copy(selectedDayPreview = null) }
    }

    fun updateDayPlan(date: String, dayType: DayType, workoutName: String?, status: DayStatus) {
        val existing = plansStorage[date] ?: PlanDay(date = date, dayOfWeek = 1)
        val updated = existing.copy(
            dayType = dayType,
            workoutName = workoutName,
            manualStatus = status
        )
        plansStorage[date] = updated
        loadWeekData()
    }
}
