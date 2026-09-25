package com.planpasika.v2

import android.os.Bundle
import androidx.activity.ComponentActivity
import androidx.activity.compose.setContent
import androidx.compose.foundation.background
import androidx.compose.foundation.layout.*
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.unit.dp
import androidx.lifecycle.viewmodel.compose.viewModel
import androidx.navigation.NavGraph.Companion.findStartDestination
import androidx.navigation.compose.*
import com.planpasika.v2.navigation.Screen
import com.planpasika.v2.ui.screens.myweek.MyWeekScreen
import com.planpasika.v2.ui.screens.myweek.MyWeekViewModel
import com.planpasika.v2.ui.theme.*

class MainActivity : ComponentActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContent {
            PlanPasikaTheme {
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
                containerColor = SurfaceDark,
                contentColor = TextPrimary,
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
                            selectedIconColor = BackgroundDark,
                            selectedTextColor = NeonGreen,
                            indicatorColor = NeonGreen,
                            unselectedIconColor = TextSecondary,
                            unselectedTextColor = TextSecondary
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
                val plansViewModel: com.planpasika.v2.ui.screens.plans.PlansViewModel = viewModel()
                com.planpasika.v2.ui.screens.plans.PlansScreen(
                    viewModel = plansViewModel,
                    onNavigateToSettings = { navController.navigate(Screen.Settings.route) }
                )
            }
            composable(Screen.Workout.route) {
                Box(
                    modifier = Modifier
                        .fillMaxSize()
                        .background(BackgroundDark),
                    contentAlignment = androidx.compose.ui.Alignment.Center
                ) {
                    Text(text = "Moduł Trening (Jetpack Compose)", color = TextPrimary)
                }
            }
            composable(Screen.Catalog.route) {
                com.planpasika.v2.ui.screens.catalog.CatalogScreen(
                    onAddToPlan = { navController.navigate(Screen.Plans.route) }
                )
            }
            composable(Screen.Calendar.route) {
                Box(
                    modifier = Modifier
                        .fillMaxSize()
                        .background(BackgroundDark),
                    contentAlignment = androidx.compose.ui.Alignment.Center
                ) {
                    Text(text = "Moduł Kalendarz (Jetpack Compose)", color = TextPrimary)
                }
            }
            composable(Screen.Analytics.route) {
                Box(
                    modifier = Modifier
                        .fillMaxSize()
                        .background(BackgroundDark),
                    contentAlignment = androidx.compose.ui.Alignment.Center
                ) {
                    Text(text = "Moduł Analizy (Jetpack Compose)", color = TextPrimary)
                }
            }
            composable(Screen.Settings.route) {
                val settingsViewModel: com.planpasika.v2.ui.screens.settings.SettingsViewModel = viewModel()
                com.planpasika.v2.ui.screens.settings.SettingsScreen(
                    viewModel = settingsViewModel,
                    onNavigateBack = { navController.popBackStack() }
                )
            }
        }
    }
}
