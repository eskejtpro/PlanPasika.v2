package com.planpasika.v2.ui.screens.catalog

import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.LazyRow
import androidx.compose.foundation.lazy.items
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.Add
import androidx.compose.material.icons.filled.BookmarkAdd
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.planpasika.v2.domain.model.ExerciseCategory
import com.planpasika.v2.domain.model.ExerciseDefinition
import com.planpasika.v2.ui.theme.*

@Composable
fun CatalogScreen(
    onAddToPlan: (ExerciseDefinition) -> Unit = {}
) {
    var selectedCategory by remember { mutableStateOf("Wszystkie") }
    val categories = listOf("Wszystkie", "Klata", "Biceps", "Triceps", "Barki", "Plecy", "Nogi")

    val sampleExercises = remember {
        listOf(
            ExerciseDefinition(
                id = "ex_chest_1",
                name = "Wyciskanie sztangi na ławce poziomej",
                category = ExerciseCategory.CHEST,
                notes = "Sztanga · Ściągnij łopatki, tempo 3-0-1, pauza na dole"
            ),
            ExerciseDefinition(
                id = "ex_chest_2",
                name = "Wyciskanie hantli na skosie dodatnim",
                category = ExerciseCategory.CHEST,
                notes = "Hantle · Kąt 30°, głębokie rozciągnięcie"
            ),
            ExerciseDefinition(
                id = "ex_back_1",
                name = "Martwy ciąg klasyczny",
                category = ExerciseCategory.BACK,
                notes = "Sztanga · Zablokuj najszersze, wdech przeponowy"
            ),
            ExerciseDefinition(
                id = "ex_legs_1",
                name = "Przysiad ze sztangą na plecach",
                category = ExerciseCategory.LEGS,
                notes = "Sztanga · Zejście poniżej kąta prostego, kolana w osi stóp"
            ),
            ExerciseDefinition(
                id = "ex_biceps_1",
                name = "Uginanie przedramion ze sztangą łamaną",
                category = ExerciseCategory.BICEPS,
                notes = "Sztanga · Łokcie zablokowane przy żebrach, faza negatywna 3s"
            ),
            ExerciseDefinition(
                id = "ex_triceps_1",
                name = "Wyciskanie francuskie ze sztangą leżąc",
                category = ExerciseCategory.TRICEPS,
                notes = "Sztanga · Opad gryfu w stronę czubka głowy"
            ),
            ExerciseDefinition(
                id = "ex_shoulders_1",
                name = "Wyciskanie żołnierskie (OHP)",
                category = ExerciseCategory.SHOULDERS,
                notes = "Sztanga · Napięty brzuch i pośladki, prosta trajektoria"
            )
        )
    }

    val filteredList = remember(selectedCategory) {
        if (selectedCategory == "Wszystkie") {
            sampleExercises
        } else {
            val catEnum = when (selectedCategory) {
                "Klata" -> ExerciseCategory.CHEST
                "Biceps" -> ExerciseCategory.BICEPS
                "Triceps" -> ExerciseCategory.TRICEPS
                "Barki" -> ExerciseCategory.SHOULDERS
                "Plecy" -> ExerciseCategory.BACK
                "Nogi" -> ExerciseCategory.LEGS
                else -> ExerciseCategory.OTHER
            }
            sampleExercises.filter { it.category == catEnum }
        }
    }

    LazyColumn(
        modifier = Modifier
            .fillMaxSize()
            .background(BackgroundDark)
            .padding(horizontal = 16.dp),
        verticalArrangement = Arrangement.spacedBy(14.dp),
        contentPadding = PaddingValues(top = 16.dp, bottom = 96.dp)
    ) {
        // Nagłówek
        item {
            Card(
                modifier = Modifier.fillMaxWidth(),
                shape = RoundedCornerShape(20.dp),
                colors = CardDefaults.cardColors(containerColor = SurfaceElevated)
            ) {
                Column(modifier = Modifier.padding(14.dp)) {
                    Text(
                        text = "BAZA WIEDZY & WZORCE TECHNIKI",
                        fontSize = 10.sp,
                        fontWeight = FontWeight.ExtraBold,
                        color = NeonGreen
                    )
                    Spacer(modifier = Modifier.height(2.dp))
                    Text(
                        text = "Katalog ćwiczeń",
                        style = MaterialTheme.typography.titleLarge,
                        color = TextPrimary
                    )
                    Text(
                        text = "Partie: Klata · Biceps · Triceps · Barki · Plecy · Nogi",
                        fontSize = 12.sp,
                        color = TextSecondary
                    )
                }
            }
        }

        // Poziomy wybór partii
        item {
            LazyRow(
                horizontalArrangement = Arrangement.spacedBy(8.dp)
            ) {
                items(categories) { cat ->
                    val isSelected = cat == selectedCategory
                    Box(
                        modifier = Modifier
                            .clip(RoundedCornerShape(12.dp))
                            .background(if (isSelected) Color(0xFF142334) else SurfaceDark)
                            .border(1.dp, if (isSelected) NeonGreen else SurfaceBorder, RoundedCornerShape(12.dp))
                            .clickable { selectedCategory = cat }
                            .padding(horizontal = 14.dp, vertical = 8.dp)
                    ) {
                        Text(
                            text = cat,
                            fontSize = 12.sp,
                            fontWeight = FontWeight.Bold,
                            color = if (isSelected) NeonGreen else TextSecondary
                        )
                    }
                }
            }
        }

        // Lista ćwiczeń
        items(filteredList) { exercise ->
            Card(
                modifier = Modifier.fillMaxWidth(),
                shape = RoundedCornerShape(16.dp),
                colors = CardDefaults.cardColors(containerColor = SurfaceDark),
                border = CardDefaults.outlinedCardBorder().copy(brush = androidx.compose.ui.graphics.SolidColor(SurfaceBorder))
            ) {
                Column(modifier = Modifier.padding(14.dp)) {
                    Row(
                        modifier = Modifier.fillMaxWidth(),
                        horizontalArrangement = Arrangement.SpaceBetween,
                        verticalAlignment = Alignment.CenterVertically
                    ) {
                        Column(modifier = Modifier.weight(1f)) {
                            Text(
                                text = exercise.category.displayName,
                                fontSize = 10.sp,
                                fontWeight = FontWeight.Bold,
                                color = NeonGreen
                            )
                            Text(
                                text = exercise.name,
                                fontSize = 14.sp,
                                fontWeight = FontWeight.Bold,
                                color = TextPrimary
                            )
                        }

                        // Przycisk edycji dla każdego ćwiczenia
                        OutlinedButton(
                            onClick = { /* Otwórz edycję ćwiczenia: nazwa, serie, powtórzenia, opis */ },
                            shape = RoundedCornerShape(10.dp),
                            contentPadding = PaddingValues(horizontal = 8.dp, vertical = 2.dp)
                        ) {
                            Text(text = "Edytuj", fontSize = 11.sp, color = NeonGreen)
                        }
                    }

                    if (!exercise.notes.isNullOrBlank()) {
                        Spacer(modifier = Modifier.height(6.dp))
                        Text(
                            text = exercise.notes,
                            fontSize = 12.sp,
                            color = TextSecondary
                        )
                    }

                    Spacer(modifier = Modifier.height(10.dp))

                    Row(
                        modifier = Modifier.fillMaxWidth(),
                        horizontalArrangement = Arrangement.SpaceBetween,
                        verticalAlignment = Alignment.CenterVertically
                    ) {
                        Text(
                            text = "3-4 serie · 8-10 powt. · RPE 8",
                            fontSize = 11.sp,
                            color = TextSecondary
                        )

                        FilledTonalButton(
                            onClick = { onAddToPlan(exercise) },
                            colors = ButtonDefaults.filledTonalButtonColors(
                                containerColor = SurfaceElevated,
                                contentColor = NeonGreen
                            ),
                            shape = RoundedCornerShape(10.dp),
                            contentPadding = PaddingValues(horizontal = 10.dp, vertical = 4.dp)
                        ) {
                            Icon(Icons.Default.BookmarkAdd, contentDescription = null, modifier = Modifier.size(14.dp))
                            Spacer(modifier = Modifier.width(4.dp))
                            Text(text = "Dodaj do planu", fontSize = 11.sp, fontWeight = FontWeight.Bold)
                        }
                    }
                }
            }
        }
    }
}
