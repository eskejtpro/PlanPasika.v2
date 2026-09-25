package com.planpasika.v2.ui.screens.myweek

import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.*
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Brush
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.font.FontFamily
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.planpasika.v2.domain.model.DayStatus
import com.planpasika.v2.domain.model.DayType
import com.planpasika.v2.ui.theme.*

@Composable
fun MyWeekScreen(
    viewModel: MyWeekViewModel,
    onStartWorkout: () -> Unit,
    onNavigateToCalendar: () -> Unit,
    onNavigateToPlans: () -> Unit
) {
    val uiState by viewModel.uiState.collectAsState()

    LazyColumn(
        modifier = Modifier
            .fillMaxSize()
            .background(BackgroundDark)
            .padding(horizontal = 16.dp),
        verticalArrangement = Arrangement.spacedBy(14.dp),
        contentPadding = PaddingValues(top = 16.dp, bottom = 96.dp)
    ) {
        // 1. TOP HEADER: PlanPasika.v2 + Zakres dat + Kalendarz CTA
        item {
            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.SpaceBetween,
                verticalAlignment = Alignment.CenterVertically
            ) {
                Column {
                    Row(verticalAlignment = Alignment.CenterVertically) {
                        Text(
                            text = "PlanPasika",
                            style = MaterialTheme.typography.titleLarge,
                            color = TextPrimary
                        )
                        Text(
                            text = ".v2",
                            style = MaterialTheme.typography.titleLarge,
                            color = NeonGreen
                        )
                        Spacer(modifier = Modifier.width(6.dp))
                        Box(
                            modifier = Modifier
                                .clip(RoundedCornerShape(12.dp))
                                .background(Color(0xFF063B25))
                                .border(1.dp, NeonGreen.copy(alpha = 0.4f), RoundedCornerShape(12.dp))
                                .padding(horizontal = 6.dp, vertical = 2.dp)
                        ) {
                            Text(
                                text = "PRO",
                                fontSize = 9.sp,
                                fontWeight = FontWeight.Bold,
                                color = NeonGreen
                            )
                        }
                    }
                    Spacer(modifier = Modifier.height(2.dp))
                    Row(verticalAlignment = Alignment.CenterVertically) {
                        Box(
                            modifier = Modifier
                                .size(6.dp)
                                .clip(CircleShape)
                                .background(NeonGreen)
                        )
                        Spacer(modifier = Modifier.width(6.dp))
                        Text(
                            text = uiState.weekRangeFormatted,
                            style = MaterialTheme.typography.bodyMedium,
                            color = TextSecondary
                        )
                    }
                }

                FilledTonalButton(
                    onClick = onNavigateToCalendar,
                    colors = ButtonDefaults.filledTonalButtonColors(
                        containerColor = SurfaceElevated,
                        contentColor = TextPrimary
                    ),
                    shape = RoundedCornerShape(12.dp),
                    contentPadding = PaddingValues(horizontal = 12.dp, vertical = 6.dp)
                ) {
                    Icon(
                        imageVector = Icons.Default.CalendarMonth,
                        contentDescription = "Kalendarz",
                        tint = NeonGreen,
                        modifier = Modifier.size(16.dp)
                    )
                    Spacer(modifier = Modifier.width(6.dp))
                    Text(text = "Kalendarz", fontSize = 12.sp, fontWeight = FontWeight.Bold)
                }
            }
        }

        // 2. SEKCJA: MÓJ TYDZIEŃ (7 dni)
        item {
            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.SpaceBetween,
                verticalAlignment = Alignment.CenterVertically
            ) {
                Text(
                    text = "MÓJ TYDZIEŃ",
                    style = MaterialTheme.typography.labelSmall,
                    color = TextSecondary,
                    letterSpacing = 1.sp
                )
                Text(
                    text = "Pełny plan ›",
                    style = MaterialTheme.typography.labelSmall,
                    color = NeonGreen,
                    modifier = Modifier.clickable { onNavigateToPlans() }
                )
            }
        }

        items(uiState.weekDays) { dayItem ->
            WeekDayRow(
                dayItem = dayItem,
                onClick = { viewModel.onSelectDay(dayItem) }
            )
        }

        // 3. KARTA AKTYWNOŚCI NA DZIŚ
        item {
            TodayActionCard(
                todayPlan = uiState.todayPlan,
                isSessionRunning = uiState.isSessionRunning,
                onStartWorkout = onStartWorkout,
                onNavigateToPlans = onNavigateToPlans
            )
        }

        // 4. NAJBLIŻSZE WYDARZENIA (2-3 wpisy)
        item {
            Text(
                text = "NAJBLIŻSZE WYDARZENIA",
                style = MaterialTheme.typography.labelSmall,
                color = TextSecondary,
                letterSpacing = 1.sp
            )
        }

        items(uiState.upcomingEvents) { event ->
            UpcomingEventRow(event = event, onClick = onNavigateToCalendar)
        }
    }

    // Modal podglądu dnia
    uiState.selectedDayPreview?.let { day ->
        DayDetailsDialog(
            dayItem = day,
            onDismiss = { viewModel.onDismissPreview() },
            onStartWorkout = {
                viewModel.onDismissPreview()
                onStartWorkout()
            },
            onNavigateToPlans = {
                viewModel.onDismissPreview()
                onNavigateToPlans()
            }
        )
    }
}

@Composable
fun WeekDayRow(
    dayItem: WeekDayItem,
    onClick: () -> Unit
) {
    val isToday = dayItem.isToday
    val isWorkout = dayItem.plan.dayType == DayType.WORKOUT
    val isRest = dayItem.plan.dayType == DayType.REST

    val borderColor = if (isToday) NeonGreen.copy(alpha = 0.6f) else SurfaceBorder
    val backgroundColor = if (isToday) Color(0xFF142334) else SurfaceDark

    Box(
        modifier = Modifier
            .fillMaxWidth()
            .clip(RoundedCornerShape(16.dp))
            .background(backgroundColor)
            .border(1.dp, borderColor, RoundedCornerShape(16.dp))
            .clickable { onClick() }
            .padding(12.dp)
    ) {
        Row(
            modifier = Modifier.fillMaxWidth(),
            verticalAlignment = Alignment.CenterVertically,
            horizontalArrangement = Arrangement.SpaceBetween
        ) {
            // Kolumna 1: Dzień & Numer
            Row(verticalAlignment = Alignment.CenterVertically) {
                Box(
                    modifier = Modifier
                        .size(36.dp)
                        .clip(RoundedCornerShape(10.dp))
                        .background(if (isToday) NeonGreen else SurfaceElevated),
                    contentAlignment = Alignment.Center
                ) {
                    Column(horizontalAlignment = Alignment.CenterHorizontally) {
                        Text(
                            text = dayItem.dayShort,
                            fontSize = 9.sp,
                            fontWeight = FontWeight.Bold,
                            color = if (isToday) BackgroundDark else TextSecondary
                        )
                        Text(
                            text = dayItem.dayNumber.toString(),
                            fontSize = 12.sp,
                            fontWeight = FontWeight.ExtraBold,
                            color = if (isToday) BackgroundDark else TextPrimary
                        )
                    }
                }
                Spacer(modifier = Modifier.width(10.dp))
                Column {
                    Text(
                        text = dayItem.dayFull,
                        fontSize = 13.sp,
                        fontWeight = FontWeight.Bold,
                        color = if (isToday) NeonGreen else TextPrimary
                    )
                    if (isToday) {
                        Text(
                            text = "DZIŚ",
                            fontSize = 9.sp,
                            fontWeight = FontWeight.ExtraBold,
                            color = NeonGreen
                        )
                    }
                }
            }

            // Kolumna 2: Trening
            Box(
                modifier = Modifier
                    .weight(1f)
                    .padding(horizontal = 8.dp)
            ) {
                Text(
                    text = when {
                        isWorkout -> dayItem.plan.workoutName ?: "Trening"
                        isRest -> "Dzień wolny"
                        else -> "Brak planu"
                    },
                    fontSize = 12.sp,
                    fontWeight = if (isWorkout) FontWeight.Bold else FontWeight.Normal,
                    color = when {
                        isWorkout -> TextPrimary
                        isRest -> StatusRest
                        else -> TextMuted
                    },
                    maxLines = 1
                )
            }

            // Kolumna 3: Status
            StatusBadge(dayItem.plan.manualStatus, dayItem.plan.dayType)
        }
    }
}

@Composable
fun StatusBadge(status: DayStatus, dayType: DayType) {
    if (dayType == DayType.REST) {
        Box(
            modifier = Modifier
                .clip(RoundedCornerShape(8.dp))
                .background(Color(0xFF082F38))
                .border(1.dp, StatusRest.copy(alpha = 0.4f), RoundedCornerShape(8.dp))
                .padding(horizontal = 8.dp, vertical = 3.dp)
        ) {
            Text(text = "Wolne", fontSize = 10.sp, fontWeight = FontWeight.Bold, color = StatusRest)
        }
        return
    }

    if (dayType == DayType.EMPTY) {
        Box(
            modifier = Modifier
                .clip(RoundedCornerShape(8.dp))
                .background(Color(0xFF111822))
                .padding(horizontal = 8.dp, vertical = 3.dp)
        ) {
            Text(text = "Brak", fontSize = 10.sp, fontWeight = FontWeight.Medium, color = TextMuted)
        }
        return
    }

    when (status) {
        DayStatus.COMPLETED -> {
            Box(
                modifier = Modifier
                    .clip(RoundedCornerShape(8.dp))
                    .background(Color(0xFF063B25))
                    .border(1.dp, StatusCompleted.copy(alpha = 0.4f), RoundedCornerShape(8.dp))
                    .padding(horizontal = 8.dp, vertical = 3.dp)
            ) {
                Text(text = "Wykonany", fontSize = 10.sp, fontWeight = FontWeight.Bold, color = StatusCompleted)
            }
        }
        DayStatus.NOT_COMPLETED -> {
            Box(
                modifier = Modifier
                    .clip(RoundedCornerShape(8.dp))
                    .background(Color(0xFF381018))
                    .border(1.dp, StatusNotCompleted.copy(alpha = 0.4f), RoundedCornerShape(8.dp))
                    .padding(horizontal = 8.dp, vertical = 3.dp)
            ) {
                Text(text = "Niewykonany", fontSize = 10.sp, fontWeight = FontWeight.Bold, color = StatusNotCompleted)
            }
        }
        DayStatus.UNRESOLVED -> {
            Box(
                modifier = Modifier
                    .clip(RoundedCornerShape(8.dp))
                    .background(Color(0xFF332408))
                    .border(1.dp, StatusUnresolved.copy(alpha = 0.4f), RoundedCornerShape(8.dp))
                    .padding(horizontal = 8.dp, vertical = 3.dp)
            ) {
                Text(text = "Zaplanowany", fontSize = 10.sp, fontWeight = FontWeight.Medium, color = StatusUnresolved)
            }
        }
    }
}

@Composable
fun TodayActionCard(
    todayPlan: com.planpasika.v2.domain.model.PlanDay?,
    isSessionRunning: Boolean,
    onStartWorkout: () -> Unit,
    onNavigateToPlans: () -> Unit
) {
    Card(
        modifier = Modifier.fillMaxWidth(),
        shape = RoundedCornerShape(20.dp),
        colors = CardDefaults.cardColors(containerColor = SurfaceElevated),
        border = CardDefaults.outlinedCardBorder().copy(brush = Brush.linearGradient(listOf(SurfaceBorder, NeonGreen.copy(alpha = 0.3f))))
    ) {
        Column(modifier = Modifier.padding(16.dp)) {
            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.SpaceBetween,
                verticalAlignment = Alignment.CenterVertically
            ) {
                Text(
                    text = "DZISIAJ",
                    fontSize = 11.sp,
                    fontWeight = FontWeight.Bold,
                    color = NeonGreen
                )
                if (isSessionRunning) {
                    Text(
                        text = "SESJA W TOKU",
                        fontSize = 10.sp,
                        fontWeight = FontWeight.Bold,
                        color = NeonGreen
                    )
                }
            }

            Spacer(modifier = Modifier.height(6.dp))

            Text(
                text = when {
                    todayPlan?.dayType == DayType.WORKOUT -> todayPlan.workoutName ?: "Trening"
                    todayPlan?.dayType == DayType.REST -> "Dzień regeneracji"
                    else -> "Brak zaplanowanego treningu"
                },
                fontSize = 16.sp,
                fontWeight = FontWeight.ExtraBold,
                color = TextPrimary
            )

            Spacer(modifier = Modifier.height(14.dp))

            if (todayPlan?.dayType == DayType.WORKOUT) {
                Button(
                    onClick = onStartWorkout,
                    modifier = Modifier.fillMaxWidth(),
                    shape = RoundedCornerShape(14.dp),
                    colors = ButtonDefaults.buttonColors(
                        containerColor = NeonGreen,
                        contentColor = BackgroundDark
                    )
                ) {
                    Icon(
                        imageVector = Icons.Default.PlayArrow,
                        contentDescription = null,
                        modifier = Modifier.size(18.dp)
                    )
                    Spacer(modifier = Modifier.width(6.dp))
                    Text(
                        text = if (isSessionRunning) "Wróć do aktywnego treningu" else "Rozpocznij trening",
                        fontWeight = FontWeight.ExtraBold,
                        fontSize = 14.sp
                    )
                }
            } else {
                OutlinedButton(
                    onClick = onNavigateToPlans,
                    modifier = Modifier.fillMaxWidth(),
                    shape = RoundedCornerShape(14.dp),
                    colors = ButtonDefaults.outlinedButtonColors(contentColor = TextPrimary),
                    border = ButtonDefaults.outlinedButtonBorder.copy(brush = Brush.linearGradient(listOf(SurfaceBorder, SurfaceBorder)))
                ) {
                    Icon(
                        imageVector = Icons.Default.Edit,
                        contentDescription = null,
                        modifier = Modifier.size(16.dp),
                        tint = NeonGreen
                    )
                    Spacer(modifier = Modifier.width(6.dp))
                    Text(text = "Zarządzaj planem w module Plany", fontSize = 12.sp, fontWeight = FontWeight.Bold)
                }
            }
        }
    }
}

@Composable
fun UpcomingEventRow(
    event: com.planpasika.v2.domain.model.UpcomingEvent,
    onClick: () -> Unit
) {
    Box(
        modifier = Modifier
            .fillMaxWidth()
            .clip(RoundedCornerShape(14.dp))
            .background(SurfaceDark)
            .border(1.dp, SurfaceBorder, RoundedCornerShape(14.dp))
            .clickable { onClick() }
            .padding(12.dp)
    ) {
        Row(
            modifier = Modifier.fillMaxWidth(),
            verticalAlignment = Alignment.CenterVertically
        ) {
            Icon(
                imageVector = when (event.type) {
                    "workout" -> Icons.Default.FitnessCenter
                    "rest" -> Icons.Default.Coffee
                    else -> Icons.Default.Notes
                },
                contentDescription = null,
                tint = NeonGreen,
                modifier = Modifier.size(20.dp)
            )
            Spacer(modifier = Modifier.width(12.dp))
            Column(modifier = Modifier.weight(1f)) {
                Text(
                    text = event.title,
                    fontSize = 13.sp,
                    fontWeight = FontWeight.Bold,
                    color = TextPrimary
                )
                Text(
                    text = event.dateLabel,
                    fontSize = 11.sp,
                    color = TextSecondary
                )
            }
            Icon(
                imageVector = Icons.Default.ChevronRight,
                contentDescription = null,
                tint = TextMuted,
                modifier = Modifier.size(18.dp)
            )
        }
    }
}

@Composable
fun DayDetailsDialog(
    dayItem: WeekDayItem,
    onDismiss: () -> Unit,
    onStartWorkout: () -> Unit,
    onNavigateToPlans: () -> Unit
) {
    AlertDialog(
        onDismissRequest = onDismiss,
        containerColor = SurfaceElevated,
        title = {
            Column {
                Text(
                    text = "Szczegóły dnia",
                    fontSize = 11.sp,
                    fontWeight = FontWeight.Bold,
                    color = NeonGreen
                )
                Text(
                    text = "${dayItem.dayFull}, ${dayItem.dayNumber}",
                    style = MaterialTheme.typography.titleLarge,
                    color = TextPrimary
                )
            }
        },
        text = {
            Column(verticalArrangement = Arrangement.spacedBy(8.dp)) {
                Text(
                    text = "Data: ${dayItem.date}",
                    fontSize = 12.sp,
                    color = TextSecondary
                )
                Text(
                    text = "Trening: ${dayItem.plan.workoutName ?: if (dayItem.plan.dayType == DayType.REST) "Dzień wolny" else "Brak planu"}",
                    fontSize = 14.sp,
                    fontWeight = FontWeight.Bold,
                    color = TextPrimary
                )
                Row(verticalAlignment = Alignment.CenterVertically) {
                    Text(text = "Status: ", fontSize = 12.sp, color = TextSecondary)
                    StatusBadge(dayItem.plan.manualStatus, dayItem.plan.dayType)
                }
            }
        },
        confirmButton = {
            if (dayItem.plan.dayType == DayType.WORKOUT) {
                Button(
                    onClick = onStartWorkout,
                    colors = ButtonDefaults.buttonColors(containerColor = NeonGreen, contentColor = BackgroundDark),
                    shape = RoundedCornerShape(10.dp)
                ) {
                    Text(text = "Rozpocznij trening", fontWeight = FontWeight.Bold)
                }
            }
        },
        dismissButton = {
            TextButton(onClick = onNavigateToPlans) {
                Text(text = "Edytuj w Planach", color = NeonGreen)
            }
        }
    )
}
