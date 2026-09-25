package com.planpasika.v2.navigation

import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.Analytics
import androidx.compose.material.icons.filled.CalendarMonth
import androidx.compose.material.icons.filled.DateRange
import androidx.compose.material.icons.filled.FitnessCenter
import androidx.compose.material.icons.filled.MenuBook
import androidx.compose.material.icons.filled.Today
import androidx.compose.material.icons.filled.Straighten
import androidx.compose.material.icons.filled.Settings
import androidx.compose.ui.graphics.vector.ImageVector

sealed class Screen(val route: String, val title: String, val icon: ImageVector) {
    object MyWeek : Screen("my_week", "Dzisiaj", Icons.Default.Today)
    object Plans : Screen("plans", "Plany", Icons.Default.DateRange)
    object Workout : Screen("workout", "Trening", Icons.Default.FitnessCenter)
    object Catalog : Screen("catalog", "Katalog", Icons.Default.MenuBook)
    object Calendar : Screen("calendar", "Kalendarz", Icons.Default.CalendarMonth)
    object Analytics : Screen("analytics", "Analizy", Icons.Default.Analytics)
    object Measurements : Screen("measurements", "Pomiary", Icons.Default.Straighten)
    object Settings : Screen("settings", "Ustawienia", Icons.Default.Settings)

    companion object {
        val bottomNavItems = listOf(MyWeek, Plans, Workout, Catalog, Calendar, Analytics, Measurements)
    }
}
