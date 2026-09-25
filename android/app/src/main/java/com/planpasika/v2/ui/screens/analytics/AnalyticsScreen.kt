package com.planpasika.v2.ui.screens.analytics

import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.Settings
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.planpasika.v2.domain.model.ExerciseCategory
import com.planpasika.v2.ui.theme.*

@Composable
fun AnalyticsScreen(
    viewModel: AnalyticsViewModel,
    onNavigateToSettings: () -> Unit = {}
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
        // 1. Header with Settings ⚙
        item {
            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.SpaceBetween,
                verticalAlignment = Alignment.CenterVertically
            ) {
                Column {
                    Text(
                        text = "Analizy & Statystyki",
                        style = MaterialTheme.typography.titleLarge.copy(fontWeight = FontWeight.Black),
                        color = TextPrimary
                    )
                    Text(
                        text = "Objętość · Tonaż · Podział serii wg partii",
                        style = MaterialTheme.typography.bodySmall,
                        color = TextSecondary
                    )
                }

                IconButton(
                    onClick = onNavigateToSettings,
                    modifier = Modifier
                        .size(36.dp)
                        .background(SurfaceElevated, RoundedCornerShape(12.dp))
                ) {
                    Icon(
                        imageVector = Icons.Default.Settings,
                        contentDescription = "Ustawienia",
                        tint = NeonGreen,
                        modifier = Modifier.size(18.dp)
                    )
                }
            }
        }

        // 2. Global KPIs
        item {
            Row(modifier = Modifier.fillMaxWidth(), horizontalArrangement = Arrangement.spacedBy(8.dp)) {
                Card(
                    shape = RoundedCornerShape(16.dp),
                    colors = CardDefaults.cardColors(containerColor = SurfaceElevated),
                    modifier = Modifier.weight(1f)
                ) {
                    Column(modifier = Modifier.padding(12.dp), verticalArrangement = Arrangement.spacedBy(4.dp)) {
                        Text("TRENINGI", fontSize = 10.sp, fontWeight = FontWeight.Black, color = TextSecondary)
                        Text("${uiState.totalWorkoutsCount}", fontSize = 20.sp, fontWeight = FontWeight.Black, color = NeonGreen)
                        Text("ukończone", fontSize = 10.sp, color = TextSecondary)
                    }
                }

                Card(
                    shape = RoundedCornerShape(16.dp),
                    colors = CardDefaults.cardColors(containerColor = SurfaceElevated),
                    modifier = Modifier.weight(1f)
                ) {
                    Column(modifier = Modifier.padding(12.dp), verticalArrangement = Arrangement.spacedBy(4.dp)) {
                        Text("SERIE", fontSize = 10.sp, fontWeight = FontWeight.Black, color = TextSecondary)
                        Text("${uiState.totalSetsCount}", fontSize = 20.sp, fontWeight = FontWeight.Black, color = Color(0xFF38BDF8))
                        Text("robocze zaliczone", fontSize = 10.sp, color = TextSecondary)
                    }
                }

                Card(
                    shape = RoundedCornerShape(16.dp),
                    colors = CardDefaults.cardColors(containerColor = SurfaceElevated),
                    modifier = Modifier.weight(1f)
                ) {
                    Column(modifier = Modifier.padding(12.dp), verticalArrangement = Arrangement.spacedBy(4.dp)) {
                        Text("TONAŻ", fontSize = 10.sp, fontWeight = FontWeight.Black, color = TextSecondary)
                        Text("${(uiState.totalTonnageKg / 1000).toInt()} t", fontSize = 20.sp, fontWeight = FontWeight.Black, color = Color(0xFFF59E0B))
                        Text("${uiState.totalTonnageKg.toInt()} kg", fontSize = 10.sp, color = TextSecondary)
                    }
                }
            }
        }

        // 3. Category Series Distribution
        item {
            Text(
                text = "PODZIAŁ SERII ROBOCZYCH (WG PARTII)",
                fontSize = 11.sp,
                fontWeight = FontWeight.Black,
                letterSpacing = 1.sp,
                color = TextSecondary
            )
        }

        item {
            Card(
                shape = RoundedCornerShape(18.dp),
                colors = CardDefaults.cardColors(containerColor = SurfaceDark),
                modifier = Modifier.fillMaxWidth()
            ) {
                Column(modifier = Modifier.padding(14.dp), verticalArrangement = Arrangement.spacedBy(10.dp)) {
                    val maxSets = uiState.categoryDistribution.values.maxOrNull()?.coerceAtLeast(1) ?: 1

                    uiState.categoryDistribution.forEach { (cat, count) ->
                        val percent = (count.toFloat() / maxSets.toFloat())

                        Column(verticalArrangement = Arrangement.spacedBy(4.dp)) {
                            Row(
                                modifier = Modifier.fillMaxWidth(),
                                horizontalArrangement = Arrangement.SpaceBetween
                            ) {
                                Text(text = cat.displayName, fontSize = 12.sp, fontWeight = FontWeight.Bold, color = TextPrimary)
                                Text(text = "$count serii", fontSize = 12.sp, fontWeight = FontWeight.Black, color = NeonGreen)
                            }

                            Box(
                                modifier = Modifier
                                    .fillMaxWidth()
                                    .height(8.dp)
                                    .background(Color(0xFF0D1420), RoundedCornerShape(4.dp))
                            ) {
                                Box(
                                    modifier = Modifier
                                        .fillMaxWidth(percent)
                                        .fillMaxHeight()
                                        .background(NeonGreen, RoundedCornerShape(4.dp))
                                )
                            }
                        }
                    }
                }
            }
        }
    }
}
