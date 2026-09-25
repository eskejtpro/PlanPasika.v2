package com.planpasika.v2.ui.screens.workout

import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.itemsIndexed
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.*
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.font.FontFamily
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.planpasika.v2.ui.theme.*

@Composable
fun WorkoutScreen(
    viewModel: WorkoutViewModel,
    onNavigateToPlans: () -> Unit,
    onWorkoutFinished: () -> Unit
) {
    val activeSession by viewModel.activeSession.collectAsState()
    var showDiscardDialog by remember { mutableStateOf(false) }

    if (activeSession == null) {
        Box(
            modifier = Modifier
                .fillMaxSize()
                .background(BackgroundDark)
                .padding(20.dp),
            contentAlignment = Alignment.Center
        ) {
            Column(
                horizontalAlignment = Alignment.CenterHorizontally,
                verticalArrangement = Arrangement.spacedBy(14.dp)
            ) {
                Icon(
                    imageVector = Icons.Default.FitnessCenter,
                    contentDescription = null,
                    tint = TextSecondary,
                    modifier = Modifier.size(56.dp)
                )
                Text(
                    text = "Brak aktywnego treningu",
                    style = MaterialTheme.typography.titleMedium,
                    fontWeight = FontWeight.Bold,
                    color = TextPrimary
                )
                Text(
                    text = "Wybierz zaplanowany dzień w module „Mój tydzień” lub „Plany” i kliknij „Rozpocznij trening”.",
                    style = MaterialTheme.typography.bodySmall,
                    color = TextSecondary,
                    textAlign = androidx.compose.ui.text.style.TextAlign.Center
                )
                Button(
                    onClick = onNavigateToPlans,
                    colors = ButtonDefaults.buttonColors(containerColor = NeonGreen),
                    shape = RoundedCornerShape(14.dp)
                ) {
                    Text(text = "Przejdź do planów", color = BackgroundDark, fontWeight = FontWeight.Black)
                }
            }
        }
        return
    }

    val session = activeSession!!
    val hours = session.elapsedSeconds / 3600
    val minutes = (session.elapsedSeconds % 3600) / 60
    val seconds = session.elapsedSeconds % 60
    val timeFormatted = String.format("%02d:%02d:%02d", hours, minutes, seconds)

    LazyColumn(
        modifier = Modifier
            .fillMaxSize()
            .background(BackgroundDark)
            .padding(horizontal = 16.dp),
        verticalArrangement = Arrangement.spacedBy(14.dp),
        contentPadding = PaddingValues(top = 16.dp, bottom = 96.dp)
    ) {
        // 1. Session Header with Timer & Controls
        item {
            Card(
                shape = RoundedCornerShape(20.dp),
                colors = CardDefaults.cardColors(containerColor = SurfaceElevated),
                border = CardDefaults.outlinedCardBorder().copy(
                    brush = androidx.compose.ui.graphics.SolidColor(NeonGreen.copy(alpha = 0.4f))
                ),
                modifier = Modifier.fillMaxWidth()
            ) {
                Column(modifier = Modifier.padding(16.dp), verticalArrangement = Arrangement.spacedBy(10.dp)) {
                    Row(
                        modifier = Modifier.fillMaxWidth(),
                        horizontalArrangement = Arrangement.SpaceBetween,
                        verticalAlignment = Alignment.CenterVertically
                    ) {
                        Column {
                            Text(
                                text = "SESJA TRENINGOWA",
                                fontSize = 10.sp,
                                fontWeight = FontWeight.Black,
                                color = NeonGreen,
                                letterSpacing = 1.sp
                            )
                            Text(
                                text = session.name,
                                style = MaterialTheme.typography.titleMedium,
                                fontWeight = FontWeight.Bold,
                                color = TextPrimary
                            )
                        }

                        IconButton(
                            onClick = { viewModel.togglePause() },
                            modifier = Modifier
                                .size(40.dp)
                                .background(if (session.isPaused) NeonGreen else Color(0xFF1E293B), RoundedCornerShape(12.dp))
                        ) {
                            Icon(
                                imageVector = if (session.isPaused) Icons.Default.PlayArrow else Icons.Default.Pause,
                                contentDescription = if (session.isPaused) "Wznów" else "Pauza",
                                tint = if (session.isPaused) BackgroundDark else TextPrimary
                            )
                        }
                    }

                    Row(
                        modifier = Modifier.fillMaxWidth(),
                        horizontalArrangement = Arrangement.SpaceBetween,
                        verticalAlignment = Alignment.CenterVertically
                    ) {
                        Text(
                            text = timeFormatted,
                            fontFamily = FontFamily.Monospace,
                            fontSize = 24.sp,
                            fontWeight = FontWeight.Black,
                            color = if (session.isPaused) Color(0xFFC084FC) else TextPrimary
                        )

                        Row(horizontalArrangement = Arrangement.spacedBy(8.dp)) {
                            OutlinedButton(
                                onClick = { showDiscardDialog = true },
                                shape = RoundedCornerShape(12.dp),
                                colors = ButtonDefaults.outlinedButtonColors(contentColor = Color(0xFFFCA5A5))
                            ) {
                                Text("Anuluj", fontSize = 11.sp, fontWeight = FontWeight.Bold)
                            }

                            Button(
                                onClick = { viewModel.finishWorkout(onWorkoutFinished) },
                                shape = RoundedCornerShape(12.dp),
                                colors = ButtonDefaults.buttonColors(containerColor = NeonGreen)
                            ) {
                                Text("Zakończ", fontSize = 11.sp, fontWeight = FontWeight.Black, color = BackgroundDark)
                            }
                        }
                    }
                }
            }
        }

        // 2. Exercises List
        itemsIndexed(session.exercises) { exIdx, exercise ->
            Card(
                shape = RoundedCornerShape(18.dp),
                colors = CardDefaults.cardColors(containerColor = SurfaceDark),
                modifier = Modifier.fillMaxWidth()
            ) {
                Column(modifier = Modifier.padding(14.dp), verticalArrangement = Arrangement.spacedBy(10.dp)) {
                    Row(
                        modifier = Modifier.fillMaxWidth(),
                        horizontalArrangement = Arrangement.SpaceBetween,
                        verticalAlignment = Alignment.CenterVertically
                    ) {
                        Text(
                            text = exercise.name,
                            style = MaterialTheme.typography.titleSmall,
                            fontWeight = FontWeight.Bold,
                            color = TextPrimary
                        )
                        Text(
                            text = exercise.category.displayName,
                            fontSize = 10.sp,
                            fontWeight = FontWeight.Bold,
                            color = NeonGreen,
                            modifier = Modifier
                                .background(Color(0xFF063B25), RoundedCornerShape(8.dp))
                                .padding(horizontal = 6.dp, vertical = 2.dp)
                        )
                    }

                    // Sets table header
                    Row(
                        modifier = Modifier.fillMaxWidth().padding(horizontal = 4.dp),
                        horizontalArrangement = Arrangement.SpaceBetween
                    ) {
                        Text("SERIA", fontSize = 10.sp, fontWeight = FontWeight.Bold, color = TextSecondary)
                        Text("CIĘŻAR (KG)", fontSize = 10.sp, fontWeight = FontWeight.Bold, color = TextSecondary)
                        Text("POWT.", fontSize = 10.sp, fontWeight = FontWeight.Bold, color = TextSecondary)
                        Text("STATUS", fontSize = 10.sp, fontWeight = FontWeight.Bold, color = TextSecondary)
                    }

                    // Sets rows
                    exercise.sets.forEachIndexed { setIdx, set ->
                        Row(
                            modifier = Modifier
                                .fillMaxWidth()
                                .background(if (set.completed) Color(0xFF062D1C) else Color(0xFF0D1420), RoundedCornerShape(10.dp))
                                .padding(horizontal = 8.dp, vertical = 6.dp),
                            horizontalArrangement = Arrangement.SpaceBetween,
                            verticalAlignment = Alignment.CenterVertically
                        ) {
                            Text(text = "${set.setNumber}", fontWeight = FontWeight.Bold, color = TextPrimary)
                            Text(text = "${set.weightKg} kg", fontWeight = FontWeight.Bold, color = TextPrimary)
                            Text(text = "${set.reps}", fontWeight = FontWeight.Bold, color = TextPrimary)

                            IconButton(
                                onClick = { viewModel.toggleSetCompleted(exIdx, setIdx) },
                                modifier = Modifier.size(32.dp)
                            ) {
                                Icon(
                                    imageVector = if (set.completed) Icons.Default.CheckCircle else Icons.Default.RadioButtonUnchecked,
                                    contentDescription = "Zalicz serię",
                                    tint = if (set.completed) NeonGreen else TextSecondary
                                )
                            }
                        }
                    }

                    // Add set button
                    OutlinedButton(
                        onClick = { viewModel.addSet(exIdx) },
                        modifier = Modifier.fillMaxWidth(),
                        shape = RoundedCornerShape(10.dp)
                    ) {
                        Icon(imageVector = Icons.Default.Add, contentDescription = null, modifier = Modifier.size(14.dp))
                        Spacer(modifier = Modifier.width(4.dp))
                        Text("+ Dodaj serię", fontSize = 11.sp, fontWeight = FontWeight.Bold)
                    }
                }
            }
        }
    }

    if (showDiscardDialog) {
        AlertDialog(
            onDismissRequest = { showDiscardDialog = false },
            title = { Text("Odrzucić trwający trening?") },
            text = { Text("Niezapisane serie z tej sesji zostaną usunięte. Oryginalny plan pozostanie nienaruszony.") },
            confirmButton = {
                TextButton(onClick = {
                    showDiscardDialog = false
                    viewModel.discardWorkout(onWorkoutFinished)
                }) {
                    Text("Odrzuć", color = MaterialTheme.colorScheme.error, fontWeight = FontWeight.Bold)
                }
            },
            dismissButton = {
                TextButton(onClick = { showDiscardDialog = false }) {
                    Text("Kontynuuj")
                }
            }
        )
    }
}
