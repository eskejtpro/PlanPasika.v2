package com.planpasika.v2.ui.theme

import android.app.Activity
import androidx.compose.foundation.isSystemInDarkTheme
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.graphics.toArgb
import androidx.compose.ui.platform.LocalView
import androidx.core.view.WindowCompat
import com.planpasika.v2.domain.model.AppThemeMode

fun getThemeColorScheme(themeMode: AppThemeMode, isSystemDark: Boolean, pureBlack: Boolean): ColorScheme {
    val effectiveMode = if (themeMode == AppThemeMode.SYSTEM) {
        if (isSystemDark) AppThemeMode.AMOLED else AppThemeMode.LIGHT
    } else {
        themeMode
    }

    return when (effectiveMode) {
        AppThemeMode.AMOLED -> darkColorScheme(
            primary = AmoledPrimary,
            secondary = AmoledSecondary,
            background = if (pureBlack) AmoledBackground else AmoledSurface,
            surface = AmoledSurface,
            surfaceVariant = AmoledSurfaceElevated,
            outline = AmoledOutline,
            onPrimary = Color(0xFF06090E),
            onSecondary = Color(0xFF06090E),
            onBackground = AmoledTextPrimary,
            onSurface = AmoledTextPrimary,
            onSurfaceVariant = AmoledTextSecondary
        )
        AppThemeMode.DARK_BLUE -> darkColorScheme(
            primary = DarkBluePrimary,
            secondary = DarkBlueSecondary,
            background = DarkBlueBackground,
            surface = DarkBlueSurface,
            surfaceVariant = DarkBlueSurfaceElevated,
            outline = DarkBlueOutline,
            onPrimary = Color(0xFF070F1E),
            onSecondary = Color(0xFF070F1E),
            onBackground = DarkBlueTextPrimary,
            onSurface = DarkBlueTextPrimary,
            onSurfaceVariant = DarkBlueTextSecondary
        )
        AppThemeMode.GRAPHITE -> darkColorScheme(
            primary = GraphitePrimary,
            secondary = GraphiteSecondary,
            background = GraphiteBackground,
            surface = GraphiteSurface,
            surfaceVariant = GraphiteSurfaceElevated,
            outline = GraphiteOutline,
            onPrimary = Color(0xFF18181B),
            onSecondary = Color(0xFF18181B),
            onBackground = GraphiteTextPrimary,
            onSurface = GraphiteTextPrimary,
            onSurfaceVariant = GraphiteTextSecondary
        )
        AppThemeMode.PURPLE_DARK -> darkColorScheme(
            primary = PurpleDarkPrimary,
            secondary = PurpleDarkSecondary,
            background = PurpleDarkBackground,
            surface = PurpleDarkSurface,
            surfaceVariant = PurpleDarkSurfaceElevated,
            outline = PurpleDarkOutline,
            onPrimary = Color(0xFF130D24),
            onSecondary = Color(0xFF130D24),
            onBackground = PurpleDarkTextPrimary,
            onSurface = PurpleDarkTextPrimary,
            onSurfaceVariant = PurpleDarkTextSecondary
        )
        AppThemeMode.RED_PERFORMANCE -> darkColorScheme(
            primary = RedPrimary,
            secondary = RedSecondary,
            background = RedBackground,
            surface = RedSurface,
            surfaceVariant = RedSurfaceElevated,
            outline = RedOutline,
            onPrimary = Color(0xFF1C0A0E),
            onSecondary = Color(0xFF1C0A0E),
            onBackground = RedTextPrimary,
            onSurface = RedTextPrimary,
            onSurfaceVariant = RedTextSecondary
        )
        AppThemeMode.LIGHT -> lightColorScheme(
            primary = LightPrimary,
            secondary = LightSecondary,
            background = LightBackground,
            surface = LightSurface,
            surfaceVariant = LightSurfaceElevated,
            outline = LightOutline,
            onPrimary = Color(0xFFFFFFFF),
            onSecondary = Color(0xFFFFFFFF),
            onBackground = LightTextPrimary,
            onSurface = LightTextPrimary,
            onSurfaceVariant = LightTextSecondary
        )
        AppThemeMode.SYSTEM -> darkColorScheme()
    }
}

@Composable
fun PlanPasikaTheme(
    themeMode: AppThemeMode = AppThemeMode.AMOLED,
    pureBlack: Boolean = true,
    content: @Composable () -> Unit
) {
    val isSystemDark = isSystemInDarkTheme()
    val colorScheme = getThemeColorScheme(themeMode, isSystemDark, pureBlack)
    val view = LocalView.current

    if (!view.isInEditMode) {
        SideEffect {
            val window = (view.context as Activity).window
            window.statusBarColor = colorScheme.background.toArgb()
            window.navigationBarColor = colorScheme.surface.toArgb()
            val isLight = themeMode == AppThemeMode.LIGHT || (themeMode == AppThemeMode.SYSTEM && !isSystemDark)
            WindowCompat.getInsetsController(window, view).isAppearanceLightStatusBars = isLight
            WindowCompat.getInsetsController(window, view).isAppearanceLightNavigationBars = isLight
        }
    }

    MaterialTheme(
        colorScheme = colorScheme,
        typography = Typography,
        content = content
    )
}
