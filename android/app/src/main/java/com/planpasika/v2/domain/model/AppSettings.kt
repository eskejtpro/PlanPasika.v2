package com.planpasika.v2.domain.model

enum class AppThemeMode(val title: String, val description: String) {
    AMOLED("PlanPasika AMOLED", "Głęboka czerń, neonowa zieleń i turkus"),
    DARK_BLUE("Dark Blue", "Ciemny granat z błękitnymi akcentami"),
    GRAPHITE("Graphite", "Grafitowe tło ze szmaragdowym akcentem"),
    PURPLE_DARK("Purple Dark", "Głęboki fiolet i neonowy purpurowy blask"),
    RED_PERFORMANCE("Red Performance", "Agresywna czerwień i głęboki karmazyn"),
    LIGHT("Light Clean", "Jasne tło z ciemnym tekstem i zielenią"),
    SYSTEM("Systemowy", "Automatyczne dopasowanie do motywu Androida")
}

enum class UiDensity(val title: String) {
    COMPACT("Kompaktowy"),
    STANDARD("Standardowy"),
    LARGE("Duży")
}

enum class FontScaleOption(val title: String) {
    SMALL("Mały"),
    STANDARD("Standardowy"),
    LARGE("Duży")
}

enum class CardRadiusOption(val title: String) {
    SMALL("Małe (8dp)"),
    STANDARD("Standardowe (16dp)"),
    LARGE("Duże (24dp)")
}

data class AppSettings(
    // 1. Wygląd
    val themeMode: AppThemeMode = AppThemeMode.AMOLED,
    val uiDensity: UiDensity = UiDensity.STANDARD,
    val fontScale: FontScaleOption = FontScaleOption.STANDARD,
    val cardRadius: CardRadiusOption = CardRadiusOption.STANDARD,
    val animationsEnabled: Boolean = true,
    val glowEffectsEnabled: Boolean = true,
    val amoledPureBlack: Boolean = true,

    // 2. Trening & Timery
    val autoRestTimer: Boolean = true,
    val defaultRestDurationSeconds: Int = 90,
    val vibrateOnTimerEnd: Boolean = true,
    val soundOnTimerEnd: Boolean = true,
    val quickAddSeconds: Int = 30,
    val autoAdvanceNextSet: Boolean = false,

    // 3. Plan
    val firstDayOfWeek: String = "MONDAY", // "MONDAY" | "SUNDAY"
    val confirmDeleteExercise: Boolean = true,
    val confirmDeleteDay: Boolean = true,
    val confirmDeleteWeek: Boolean = true,
    val defaultNewDayStatus: String = "UNRESOLVED",

    // 4. Kalendarz
    val calendarRemindersEnabled: Boolean = false,
    val calendarReminderTime: String = "18:00",
    val calendarReminderVibrate: Boolean = true,
    val calendarReminderSound: Boolean = true,
    val calendarNeutralContent: Boolean = true,

    // 5. Pomiary
    val weightUnit: String = "kg",
    val lengthUnit: String = "cm",
    val decimalPlaces: Int = 1,

    // 6. Aplikacja
    val startScreenRoute: String = "my_week", // "my_week", "plans", "workout", "calendar", "analytics", "measurements"
    val rememberLastScreen: Boolean = true
)
