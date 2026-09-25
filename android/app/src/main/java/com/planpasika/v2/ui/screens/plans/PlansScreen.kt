package com.planpasika.v2.ui.screens.plans

import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.LazyRow
import androidx.compose.foundation.lazy.items
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.*
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.planpasika.v2.domain.model.DayStatus
import com.planpasika.v2.domain.model.PlanExerciseItem
import com.planpasika.v2.domain.model.PlanTrainingDay
import com.planpasika.v2.ui.theme.*

@Composable
fun PlansScreen(
    viewModel: PlansViewModel
) {
    val uiState by viewModel.uiState.collectAsState()
    val selectedWeek = uiState.weeks.find { it.id == uiState.selectedWeekId } ?: uiState.weeks.firstOrNull()
    val selectedDay = selectedWeek?.days?.find { it.id == uiState.selectedDayId }

    LazyColumn(
        modifier = Modifier
            .fillMaxSize()
            .background(BackgroundDark)
            .padding(horizontal = 16.dp),
        verticalArrangement = Arrangement.spacedBy(14.dp),
        contentPadding = PaddingValues(top = 16.dp, bottom = 96.dp)
    ) {
        // 1. CYKL TRENINGOWY
        item {
            Card(
                modifier = Modifier.fillMaxWidth(),
                shape = RoundedCornerShape(20.dp),
                colors = CardDefaults.cardColors(containerColor = SurfaceElevated),
                border = CardDefaults.outlinedCardBorder().copy(brush = androidx.compose.ui.graphics.SolidColor(SurfaceBorder))
            ) {
                Column(modifier = Modifier.padding(14.dp)) {
                    Text(
                        text = "CYKL TRENINGOWY",
                        fontSize = 10.sp,
                        fontWeight = FontWeight.ExtraBold,
                        color = NeonGreen,
                        letterSpacing = 1.sp
                    )
                    Spacer(modifier = Modifier.height(2.dp))
                    Text(
                        text = uiState.cycleName,
                        style = MaterialTheme.typography.titleMedium,
                        color = TextPrimary
                    )
                    Text(
                        text = "Cykl rozpoczęty: ${uiState.cycleStartDate}",
                        style = MaterialTheme.typography.bodyMedium,
                        color = TextSecondary
                    )

                    Spacer(modifier = Modifier.height(10.dp))

                    // Tygodnie: [Tydzień 1] [Tydzień 2] [Tydzień 3]... + Dodaj
                    LazyRow(
                        horizontalArrangement = Arrangement.spacedBy(8.dp)
                    ) {
                        items(uiState.weeks) { week ->
                            val isSelected = week.id == uiState.selectedWeekId
                            Box(
                                modifier = Modifier
                                    .clip(RoundedCornerShape(12.dp))
                                    .background(if (isSelected) Color(0xFF142334) else SurfaceDark)
                                    .border(
                                        1.dp,
                                        if (isSelected) NeonGreen else SurfaceBorder,
                                        RoundedCornerShape(12.dp)
                                    )
                                    .clickable { viewModel.selectWeek(week.id) }
                                    .padding(horizontal = 12.dp, vertical = 8.dp)
                            ) {
                                Text(
                                    text = week.name,
                                    fontSize = 12.sp,
                                    fontWeight = FontWeight.Bold,
                                    color = if (isSelected) NeonGreen else TextSecondary
                                )
                            }
                        }

                        item {
                            OutlinedButton(
                                onClick = { viewModel.addNewWeek() },
                                shape = RoundedCornerShape(12.dp),
                                contentPadding = PaddingValues(horizontal = 10.dp, vertical = 6.dp)
                            ) {
                                Icon(Icons.Default.Add, contentDescription = null, tint = NeonGreen, modifier = Modifier.size(14.dp))
                                Spacer(modifier = Modifier.width(4.dp))
                                Text(text = "Nowy tydzień", fontSize = 11.sp, color = NeonGreen)
                            }
                        }
                    }
                }
            }
        }

        // 2. WIDOK PLANU DNIA (JEŻELI WYBRANY JEST DZIEŃ)
        if (selectedDay != null && selectedWeek != null) {
            item {
                Row(
                    modifier = Modifier.fillMaxWidth(),
                    verticalAlignment = Alignment.CenterVertically
                ) {
                    TextButton(
                        onClick = { viewModel.backToWeek() },
                        contentPadding = PaddingValues(0.dp)
                    ) {
                        Icon(Icons.Default.ChevronLeft, contentDescription = null, tint = NeonGreen)
                        Text(text = "Wróć do ${selectedWeek.name}", color = NeonGreen, fontWeight = FontWeight.Bold)
                    }
                }
            }

            item {
                Card(
                    modifier = Modifier.fillMaxWidth(),
                    shape = RoundedCornerShape(20.dp),
                    colors = CardDefaults.cardColors(containerColor = SurfaceElevated)
                ) {
                    Column(modifier = Modifier.padding(16.dp)) {
                        Text(
                            text = "${selectedWeek.name.uppercase()} — ${selectedDay.dayName.uppercase()}",
                            fontSize = 11.sp,
                            fontWeight = FontWeight.ExtraBold,
                            color = NeonGreen
                        )
                        Text(
                            text = selectedDay.planName,
                            style = MaterialTheme.typography.headlineMedium,
                            color = TextPrimary
                        )
                        Text(
                            text = "${selectedDay.exercises.size} ćwiczeń w planie",
                            style = MaterialTheme.typography.bodyMedium
                        )

                        Spacer(modifier = Modifier.height(14.dp))

                        // Duże ręczne sterowanie statusem
                        Text(
                            text = "STATUS DNIA (RĘCZNY)",
                            fontSize = 10.sp,
                            fontWeight = FontWeight.Bold,
                            color = TextSecondary
                        )
                        Spacer(modifier = Modifier.height(6.dp))
                        Row(
                            modifier = Modifier.fillMaxWidth(),
                            horizontalArrangement = Arrangement.spacedBy(8.dp)
                        ) {
                            Button(
                                onClick = { viewModel.setDayStatus(selectedWeek.id, selectedDay.id, DayStatus.COMPLETED) },
                                modifier = Modifier.weight(1f),
                                colors = ButtonDefaults.buttonColors(
                                    containerColor = if (selectedDay.manualStatus == DayStatus.COMPLETED) NeonGreen else SurfaceDark,
                                    contentColor = if (selectedDay.manualStatus == DayStatus.COMPLETED) BackgroundDark else TextPrimary
                                ),
                                shape = RoundedCornerShape(12.dp)
                            ) {
                                Text(text = "ZALICZ", fontWeight = FontWeight.ExtraBold, fontSize = 11.sp)
                            }

                            Button(
                                onClick = { viewModel.setDayStatus(selectedWeek.id, selectedDay.id, DayStatus.NOT_COMPLETED) },
                                modifier = Modifier.weight(1f),
                                colors = ButtonDefaults.buttonColors(
                                    containerColor = if (selectedDay.manualStatus == DayStatus.NOT_COMPLETED) Color(0xFFE11D48) else SurfaceDark,
                                    contentColor = Color.White
                                ),
                                shape = RoundedCornerShape(12.dp)
                            ) {
                                Text(text = "NIEZALICZONY", fontWeight = FontWeight.Bold, fontSize = 10.sp)
                            }

                            OutlinedButton(
                                onClick = { viewModel.setDayStatus(selectedWeek.id, selectedDay.id, DayStatus.UNRESOLVED) },
                                modifier = Modifier.weight(0.8f),
                                shape = RoundedCornerShape(12.dp)
                            ) {
                                Text(text = "RESET", fontSize = 10.sp, color = TextSecondary)
                            }
                        }
                    }
                }
            }

            // Sekcja: Uwagi do planu dnia
            item {
                Card(
                    modifier = Modifier.fillMaxWidth(),
                    shape = RoundedCornerShape(16.dp),
                    colors = CardDefaults.cardColors(containerColor = SurfaceDark),
                    border = CardDefaults.outlinedCardBorder().copy(brush = androidx.compose.ui.graphics.SolidColor(SurfaceBorder))
                ) {
                    Column(modifier = Modifier.padding(14.dp)) {
                        Text(
                            text = "UWAGI DO PLANU DNIA",
                            fontSize = 10.sp,
                            fontWeight = FontWeight.ExtraBold,
                            color = NeonGreen
                        )
                        Spacer(modifier = Modifier.height(4.dp))
                        Text(
                            text = selectedDay.notes ?: "Brak wpisanych uwag do tego planu dnia.",
                            fontSize = 12.sp,
                            color = if (selectedDay.notes != null) TextPrimary else TextSecondary
                        )
                    }
                }
            }

            // Lista ćwiczeń i serii
            items(selectedDay.exercises) { ex ->
                ExercisePlanCard(
                    exercise = ex,
                    onAddSet = { viewModel.addSetToExercise(selectedWeek.id, selectedDay.id, ex.id) }
                )
            }
        } else if (selectedWeek != null) {
            // 3. WIDOK TYGODNIA (DNI TRENINGOWE)
            item {
                Row(
                    modifier = Modifier.fillMaxWidth(),
                    horizontalArrangement = Arrangement.SpaceBetween,
                    verticalAlignment = Alignment.CenterVertically
                ) {
                    Text(
                        text = "${selectedWeek.name.uppercase()} — DNI TRENINGOWE",
                        style = MaterialTheme.typography.labelSmall,
                        color = TextSecondary
                    )
                }
            }

            items(selectedWeek.days) { day ->
                TrainingDayItemRow(
                    day = day,
                    onClick = { viewModel.selectDay(day.id) }
                )
            }

            item {
                OutlinedButton(
                    onClick = {
                        val unused = listOf(
                            Pair(1, "Poniedziałek"),
                            Pair(2, "Wtorek"),
                            Pair(3, "Środa"),
                            Pair(4, "Czwartek"),
                            Pair(5, "Piątek"),
                            Pair(6, "Sobota"),
                            Pair(7, "Niedziela")
                        ).firstOrNull { d -> selectedWeek.days.none { it.dayOfWeek == d.first } }

                        if (unused != null) {
                            viewModel.addDayToWeek(selectedWeek.id, unused.first, unused.second, "Nowy trening")
                        }
                    },
                    modifier = Modifier.fillMaxWidth(),
                    shape = RoundedCornerShape(14.dp)
                ) {
                    Icon(Icons.Default.Add, contentDescription = null, tint = NeonGreen)
                    Spacer(modifier = Modifier.width(6.dp))
                    Text(text = "Dodaj dzień treningowy", color = NeonGreen, fontWeight = FontWeight.Bold)
                }
            }
        }
    }
}

@Composable
fun TrainingDayItemRow(
    day: PlanTrainingDay,
    onClick: () -> Unit
) {
    Box(
        modifier = Modifier
            .fillMaxWidth()
            .clip(RoundedCornerShape(16.dp))
            .background(SurfaceDark)
            .border(1.dp, SurfaceBorder, RoundedCornerShape(16.dp))
            .clickable { onClick() }
            .padding(14.dp)
    ) {
        Row(
            modifier = Modifier.fillMaxWidth(),
            horizontalArrangement = Arrangement.SpaceBetween,
            verticalAlignment = Alignment.CenterVertically
        ) {
            Column {
                Row(verticalAlignment = Alignment.CenterVertically) {
                    Text(
                        text = day.dayName,
                        fontWeight = FontWeight.Bold,
                        fontSize = 14.sp,
                        color = TextPrimary
                    )
                    Spacer(modifier = Modifier.width(6.dp))
                    Text(
                        text = "— ${day.planName}",
                        fontWeight = FontWeight.SemiBold,
                        fontSize = 13.sp,
                        color = NeonGreen
                    )
                }
                Spacer(modifier = Modifier.height(2.dp))
                Text(
                    text = "${day.exercises.size} ćwiczeń",
                    fontSize = 11.sp,
                    color = TextSecondary
                )
            }

            // Status chip
            when (day.manualStatus) {
                DayStatus.COMPLETED -> {
                    Box(
                        modifier = Modifier
                            .clip(RoundedCornerShape(8.dp))
                            .background(Color(0xFF063B25))
                            .padding(horizontal = 8.dp, vertical = 4.dp)
                    ) {
                        Text(text = "Zaliczony", fontSize = 10.sp, fontWeight = FontWeight.Bold, color = NeonGreen)
                    }
                }
                DayStatus.NOT_COMPLETED -> {
                    Box(
                        modifier = Modifier
                            .clip(RoundedCornerShape(8.dp))
                            .background(Color(0xFF381018))
                            .padding(horizontal = 8.dp, vertical = 4.dp)
                    ) {
                        Text(text = "Niezaliczony", fontSize = 10.sp, fontWeight = FontWeight.Bold, color = Color(0xFFFB7185))
                    }
                }
                DayStatus.UNRESOLVED -> {
                    Box(
                        modifier = Modifier
                            .clip(RoundedCornerShape(8.dp))
                            .background(Color(0xFF332408))
                            .padding(horizontal = 8.dp, vertical = 4.dp)
                    ) {
                        Text(text = "Nierozstrzygnięty", fontSize = 10.sp, fontWeight = FontWeight.Medium, color = Color(0xFFFBBF24))
                    }
                }
            }
        }
    }
}

@Composable
fun ExercisePlanCard(
    exercise: PlanExerciseItem,
    onAddSet: () -> Unit
) {
    Card(
        modifier = Modifier.fillMaxWidth(),
        shape = RoundedCornerShape(16.dp),
        colors = CardDefaults.cardColors(containerColor = SurfaceDark),
        border = CardDefaults.outlinedCardBorder().copy(brush = androidx.compose.ui.graphics.SolidColor(SurfaceBorder))
    ) {
        Column(modifier = Modifier.padding(14.dp)) {
            Text(
                text = exercise.name,
                fontWeight = FontWeight.Bold,
                fontSize = 14.sp,
                color = TextPrimary
            )
            Text(
                text = exercise.category.displayName,
                fontSize = 11.sp,
                color = NeonGreen
            )

            if (!exercise.notes.isNullOrBlank()) {
                Spacer(modifier = Modifier.height(2.dp))
                Text(
                    text = "Uwaga: ${exercise.notes}",
                    fontSize = 11.sp,
                    color = TextSecondary,
                    fontStyle = androidx.compose.ui.text.font.FontStyle.Italic
                )
            }

            Spacer(modifier = Modifier.height(10.dp))

            // Serie
            exercise.sets.forEach { set ->
                Row(
                    modifier = Modifier
                        .fillMaxWidth()
                        .padding(vertical = 3.dp),
                    horizontalArrangement = Arrangement.SpaceBetween,
                    verticalAlignment = Alignment.CenterVertically
                ) {
                    Text(
                        text = "S${set.setNumber}",
                        fontWeight = FontWeight.Bold,
                        fontSize = 12.sp,
                        color = TextSecondary
                    )
                    Text(
                        text = "${set.weightKg} kg",
                        fontWeight = FontWeight.ExtraBold,
                        fontSize = 13.sp,
                        color = TextPrimary
                    )
                    Text(
                        text = "${set.reps} powt.",
                        fontWeight = FontWeight.Bold,
                        fontSize = 12.sp,
                        color = TextSecondary
                    )
                }
            }

            Spacer(modifier = Modifier.height(8.dp))

            TextButton(
                onClick = onAddSet,
                contentPadding = PaddingValues(0.dp)
            ) {
                Icon(Icons.Default.Add, contentDescription = null, tint = NeonGreen, modifier = Modifier.size(14.dp))
                Spacer(modifier = Modifier.width(4.dp))
                Text(text = "Dodaj serię", fontSize = 11.sp, color = NeonGreen)
            }
        }
    }
}
