package com.planpasika.v2

import android.os.Bundle
import androidx.activity.ComponentActivity
import androidx.activity.compose.setContent
import androidx.compose.foundation.background
import androidx.compose.foundation.layout.*
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Modifier
import androidx.compose.ui.unit.dp
import androidx.lifecycle.viewmodel.compose.viewModel
import androidx.navigation.NavGraph.Companion.findStartDestination
import androidx.navigation.compose.*
import com.planpasika.v2.navigation.Screen
import com.planpasika.v2.ui.screens.analytics.AnalyticsScreen
import com.planpasika.v2.ui.screens.analytics.AnalyticsViewModel
import com.planpasika.v2.ui.screens.calendar.CalendarScreen
import com.planpasika.v2.ui.screens.calendar.CalendarViewModel
import com.planpasika.v2.ui.screens.measurements.MeasurementsScreen
import com.planpasika.v2.ui.screens.measurements.MeasurementsViewModel
import com.planpasika.v2.ui.screens.myweek.MyWeekScreen
import com.planpasika.v2.ui.screens.myweek.MyWeekViewModel
import com.planpasika.v2.ui.screens.plans.PlansScreen
import com.planpasika.v2.ui.screens.plans.PlansViewModel
import com.planpasika.v2.ui.screens.settings.SettingsScreen
import com.planpasika.v2.ui.screens.settings.SettingsViewModel
import com.planpasika.v2.ui.screens.workout.WorkoutScreen
import com.planpasika.v2.ui.screens.workout.WorkoutViewModel
import com.planpasika.v2.ui.theme.*

class MainActivity : ComponentActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContent {
            val settingsViewModel: SettingsViewModel = viewModel()
            val settings by settingsViewModel.settingsState.collectAsState()

            PlanPasikaTheme(
                themeMode = settings.themeMode,
                pureBlack = settings.amoledPureBlack
            ) {
                MainAppScaffold()
            }
        }
    }
}

@Composable
fun MainAppScaffold() {
    val navController = rememberNavController()
    val navBackStackEntry by navController.currentBackStackEntryAsState()
    val currentDestination = navBackStackEntry?.destination

    Scaffold(
        bottomBar = {
            NavigationBar(
                containerColor = MaterialTheme.colorScheme.surface,
                contentColor = MaterialTheme.colorScheme.onSurface,
                tonalElevation = 8.dp
            ) {
                Screen.bottomNavItems.forEach { screen ->
                    val selected = currentDestination?.route == screen.route
                    NavigationBarItem(
                        icon = {
                            Icon(
                                imageVector = screen.icon,
                                contentDescription = screen.title
                            )
                        },
                        label = { Text(screen.title) },
                        selected = selected,
                        colors = NavigationBarItemDefaults.colors(
                            selectedIconColor = MaterialTheme.colorScheme.background,
                            selectedTextColor = MaterialTheme.colorScheme.primary,
                            indicatorColor = MaterialTheme.colorScheme.primary,
                            unselectedIconColor = MaterialTheme.colorScheme.onSurfaceVariant,
                            unselectedTextColor = MaterialTheme.colorScheme.onSurfaceVariant
                        ),
                        onClick = {
                            navController.navigate(screen.route) {
                                popUpTo(navController.graph.findStartDestination().id) {
                                    saveState = true
                                }
                                launchSingleTop = true
                                restoreState = true
                            }
                        }
                    )
                }
            }
        }
    ) { innerPadding ->
        NavHost(
            navController = navController,
            startDestination = Screen.MyWeek.route,
            modifier = Modifier
                .fillMaxSize()
                .padding(innerPadding)
        ) {
            composable(Screen.MyWeek.route) {
                val myWeekViewModel: MyWeekViewModel = viewModel()
                MyWeekScreen(
                    viewModel = myWeekViewModel,
                    onStartWorkout = { navController.navigate(Screen.Workout.route) },
                    onNavigateToCalendar = { navController.navigate(Screen.Calendar.route) },
                    onNavigateToPlans = { navController.navigate(Screen.Plans.route) },
                    onNavigateToSettings = { navController.navigate(Screen.Settings.route) }
                )
            }
            composable(Screen.Plans.route) {
                val plansViewModel: PlansViewModel = viewModel()
                PlansScreen(
                    viewModel = plansViewModel,
                    onNavigateToSettings = { navController.navigate(Screen.Settings.route) }
                )
            }
            composable(Screen.Workout.route) {
                val workoutViewModel: WorkoutViewModel = viewModel()
                WorkoutScreen(
                    viewModel = workoutViewModel,
                    onNavigateToPlans = { navController.navigate(Screen.Plans.route) },
                    onWorkoutFinished = { navController.navigate(Screen.MyWeek.route) }
                )
            }
            composable(Screen.Catalog.route) {
                com.planpasika.v2.ui.screens.catalog.CatalogScreen(
                    onAddToPlan = { navController.navigate(Screen.Plans.route) }
                )
            }
            composable(Screen.Calendar.route) {
                val calendarViewModel: CalendarViewModel = viewModel()
                CalendarScreen(
                    viewModel = calendarViewModel,
                    onNavigateToSettings = { navController.navigate(Screen.Settings.route) }
                )
            }
            composable(Screen.Analytics.route) {
                val analyticsViewModel: AnalyticsViewModel = viewModel()
                AnalyticsScreen(
                    viewModel = analyticsViewModel,
                    onNavigateToSettings = { navController.navigate(Screen.Settings.route) }
                )
            }
            composable(Screen.Measurements.route) {
                val measurementsViewModel: MeasurementsViewModel = viewModel()
                MeasurementsScreen(
                    viewModel = measurementsViewModel,
                    onNavigateToSettings = { navController.navigate(Screen.Settings.route) }
                )
            }
            composable(Screen.Settings.route) {
                val settingsViewModel: SettingsViewModel = viewModel()
                SettingsScreen(
                    viewModel = settingsViewModel,
                    onNavigateBack = { navController.popBackStack() }
                )
            }
        }
    }
}
