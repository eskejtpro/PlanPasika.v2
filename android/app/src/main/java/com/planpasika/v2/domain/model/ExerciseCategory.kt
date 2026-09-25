package com.planpasika.v2.domain.model

enum class ExerciseCategory(val displayName: String) {
    CHEST("Klatka piersiowa"),
    BACK("Plecy"),
    SHOULDERS("Barki"),
    LEGS("Nogi"),
    BICEPS("Biceps"),
    TRICEPS("Triceps"),
    OTHER("Pozostałe");

    companion object {
        fun fromDisplayName(name: String): ExerciseCategory {
            return entries.firstOrNull { it.displayName.equals(name, ignoreCase = true) } ?: OTHER
        }
    }
}
