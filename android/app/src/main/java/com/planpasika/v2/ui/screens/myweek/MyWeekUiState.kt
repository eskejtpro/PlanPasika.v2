package com.planpasika.v2.ui.screens.myweek

import com.planpasika.v2.domain.model.PlanDay
import com.planpasika.v2.domain.model.UpcomingEvent

data class WeekDayItem(
    val date: String,
    val dayOfWeek: Int,
    val dayShort: String,
    val dayFull: String,
    val dayNumber: Int,
    val isToday: Boolean,
    val plan: PlanDay
)

data class MyWeekUiState(
    val weekRangeFormatted: String = "",
    val weekDays: List<WeekDayItem> = emptyList(),
    val todayPlan: PlanDay? = null,
    val isSessionRunning: Boolean = false,
    val upcomingEvents: List<UpcomingEvent> = emptyList(),
    val selectedDayPreview: WeekDayItem? = null
)
