package com.planpasika.v2.ui.screens.measurements

import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.*
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.planpasika.v2.data.local.entities.BodyMeasurementEntity
import com.planpasika.v2.ui.theme.*

@Composable
fun MeasurementsScreen(
    viewModel: MeasurementsViewModel,
    onNavigateToSettings: () -> Unit = {}
) {
    val measurements by viewModel.measurementsList.collectAsState()
    val stats by viewModel.stats.collectAsState()
    var showAddDialog by remember { mutableStateOf(false) }

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
                        text = "Pomiary & Waga",
                        style = MaterialTheme.typography.titleLarge.copy(fontWeight = FontWeight.Black),
                        color = TextPrimary
                    )
                    Text(
                        text = "Kontrola obwodów i analiza progresu (cm / kg)",
                        style = MaterialTheme.typography.bodySmall,
                        color = TextSecondary
                    )
                }

                Row(horizontalArrangement = Arrangement.spacedBy(6.dp)) {
                    Button(
                        onClick = { showAddDialog = true },
                        colors = ButtonDefaults.buttonColors(containerColor = NeonGreen),
                        shape = RoundedCornerShape(12.dp),
                        contentPadding = PaddingValues(horizontal = 12.dp, vertical = 6.dp)
                    ) {
                        Icon(imageVector = Icons.Default.Add, contentDescription = null, tint = BackgroundDark, modifier = Modifier.size(16.dp))
                        Spacer(modifier = Modifier.width(4.dp))
                        Text(text = "Pomiar", color = BackgroundDark, fontWeight = FontWeight.Bold, fontSize = 12.sp)
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
        }

        // 2. Summary Stats Cards
        item {
            Row(modifier = Modifier.fillMaxWidth(), horizontalArrangement = Arrangement.spacedBy(8.dp)) {
                // Weight Card
                Card(
                    shape = RoundedCornerShape(16.dp),
                    colors = CardDefaults.cardColors(containerColor = SurfaceElevated),
                    modifier = Modifier.weight(1f)
                ) {
                    Column(modifier = Modifier.padding(12.dp), verticalArrangement = Arrangement.spacedBy(4.dp)) {
                        Text("WAGA", fontSize = 10.sp, fontWeight = FontWeight.Black, color = TextSecondary)
                        Text(
                            text = if (stats.currentWeightKg != null) "${stats.currentWeightKg} kg" else "—",
                            fontSize = 18.sp,
                            fontWeight = FontWeight.Black,
                            color = NeonGreen
                        )
                        val diff = stats.totalWeightChangeKg
                        if (diff != null) {
                            Text(
                                text = if (diff >= 0) "+${diff} kg" else "${diff} kg",
                                fontSize = 11.sp,
                                fontWeight = FontWeight.Bold,
                                color = if (diff >= 0) NeonGreen else Color(0xFFFCA5A5)
                            )
                        }
                    }
                }

                // Biceps Card
                Card(
                    shape = RoundedCornerShape(16.dp),
                    colors = CardDefaults.cardColors(containerColor = SurfaceElevated),
                    modifier = Modifier.weight(1f)
                ) {
                    Column(modifier = Modifier.padding(12.dp), verticalArrangement = Arrangement.spacedBy(4.dp)) {
                        Text("BICEPS", fontSize = 10.sp, fontWeight = FontWeight.Black, color = TextSecondary)
                        Text(
                            text = if (stats.currentBicepsCm != null) "${stats.currentBicepsCm} cm" else "—",
                            fontSize = 18.sp,
                            fontWeight = FontWeight.Black,
                            color = Color(0xFF38BDF8)
                        )
                        val diff = stats.totalBicepsChangeCm
                        if (diff != null) {
                            Text(
                                text = if (diff >= 0) "+${diff} cm" else "${diff} cm",
                                fontSize = 11.sp,
                                fontWeight = FontWeight.Bold,
                                color = Color(0xFF38BDF8)
                            )
                        }
                    }
                }

                // Waist Card
                Card(
                    shape = RoundedCornerShape(16.dp),
                    colors = CardDefaults.cardColors(containerColor = SurfaceElevated),
                    modifier = Modifier.weight(1f)
                ) {
                    Column(modifier = Modifier.padding(12.dp), verticalArrangement = Arrangement.spacedBy(4.dp)) {
                        Text("TALIA", fontSize = 10.sp, fontWeight = FontWeight.Black, color = TextSecondary)
                        Text(
                            text = if (stats.currentWaistCm != null) "${stats.currentWaistCm} cm" else "—",
                            fontSize = 18.sp,
                            fontWeight = FontWeight.Black,
                            color = Color(0xFFF59E0B)
                        )
                        val diff = stats.totalWaistChangeCm
                        if (diff != null) {
                            Text(
                                text = if (diff >= 0) "+${diff} cm" else "${diff} cm",
                                fontSize = 11.sp,
                                fontWeight = FontWeight.Bold,
                                color = Color(0xFFF59E0B)
                            )
                        }
                    }
                }
            }
        }

        // 3. History List
        item {
            Text(
                text = "HISTORIA POMIARÓW (${measurements.size})",
                fontSize = 11.sp,
                fontWeight = FontWeight.Black,
                letterSpacing = 1.sp,
                color = TextSecondary
            )
        }

        items(measurements) { item ->
            Card(
                shape = RoundedCornerShape(16.dp),
                colors = CardDefaults.cardColors(containerColor = SurfaceDark),
                modifier = Modifier.fillMaxWidth()
            ) {
                Column(modifier = Modifier.padding(14.dp), verticalArrangement = Arrangement.spacedBy(8.dp)) {
                    Row(
                        modifier = Modifier.fillMaxWidth(),
                        horizontalArrangement = Arrangement.SpaceBetween,
                        verticalAlignment = Alignment.CenterVertically
                    ) {
                        Text(text = item.date, fontWeight = FontWeight.Bold, color = TextPrimary, fontSize = 13.sp)
                        if (item.weightKg != null) {
                            Text(text = "${item.weightKg} kg", fontWeight = FontWeight.Black, color = NeonGreen, fontSize = 14.sp)
                        }
                    }

                    // Key circumferences
                    Row(modifier = Modifier.fillMaxWidth(), horizontalArrangement = Arrangement.SpaceBetween) {
                        item.chestCm?.let { Text("Klatka: ${it} cm", fontSize = 11.sp, color = TextSecondary) }
                        item.bicepsCm?.let { Text("Biceps: ${it} cm", fontSize = 11.sp, color = TextSecondary) }
                        item.waistCm?.let { Text("Talia: ${it} cm", fontSize = 11.sp, color = TextSecondary) }
                        item.thighCm?.let { Text("Udo: ${it} cm", fontSize = 11.sp, color = TextSecondary) }
                    }

                    item.notes?.let {
                        Text(text = it, fontSize = 11.sp, color = TextMuted)
                    }
                }
            }
        }
    }
}
