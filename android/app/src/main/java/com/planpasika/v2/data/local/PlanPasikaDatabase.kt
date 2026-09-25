package com.planpasika.v2.data.local

import android.content.Context
import androidx.room.*
import androidx.sqlite.db.SupportSQLiteDatabase
import com.planpasika.v2.data.local.dao.*
import com.planpasika.v2.data.local.entities.*
import com.planpasika.v2.domain.model.DayStatus
import com.planpasika.v2.domain.model.ExerciseCategory
import kotlinx.coroutines.CoroutineScope
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.launch

class Converters {
    @TypeConverter
    fun fromCategory(category: ExerciseCategory): String = category.name

    @TypeConverter
    fun toCategory(value: String): ExerciseCategory = try {
        ExerciseCategory.valueOf(value)
    } catch (_: Exception) {
        ExerciseCategory.OTHER
    }

    @TypeConverter
    fun fromDayStatus(status: DayStatus): String = status.name

    @TypeConverter
    fun toDayStatus(value: String): DayStatus = try {
        DayStatus.valueOf(value)
    } catch (_: Exception) {
        DayStatus.UNRESOLVED
    }
}

@Database(
    entities = [
        TrainingCycleEntity::class,
        TrainingWeekEntity::class,
        PlanTrainingDayEntity::class,
        PlanExerciseEntity::class,
        ExerciseDefinitionEntity::class,
        WorkoutSessionEntity::class,
        WorkoutSetEntity::class,
        BodyMeasurementEntity::class,
        CalendarEventEntity::class,
        SubstanceLogEntity::class,
        WorkoutNoteEntity::class
    ],
    version = 1,
    exportSchema = false
)
@TypeConverters(Converters::class)
abstract class PlanPasikaDatabase : RoomDatabase() {

    abstract fun trainingPlanDao(): TrainingPlanDao
    abstract fun exerciseDao(): ExerciseDao
    abstract fun workoutSessionDao(): WorkoutSessionDao
    abstract fun bodyMeasurementDao(): BodyMeasurementDao
    abstract fun calendarDao(): CalendarDao

    companion object {
        @Volatile
        private var INSTANCE: PlanPasikaDatabase? = null

        fun getDatabase(context: Context, scope: CoroutineScope): PlanPasikaDatabase {
            return INSTANCE ?: synchronized(this) {
                val instance = Room.databaseBuilder(
                    context.applicationContext,
                    PlanPasikaDatabase::class.java,
                    "planpasika_v2_database"
                )
                    .addCallback(DatabaseCallback(scope))
                    .fallbackToDestructiveMigration()
                    .build()
                INSTANCE = instance
                instance
            }
        }

        private class DatabaseCallback(
            private val scope: CoroutineScope
        ) : RoomDatabase.Callback() {
            override fun onCreate(db: SupportSQLiteDatabase) {
                super.onCreate(db)
                INSTANCE?.let { database ->
                    scope.launch(Dispatchers.IO) {
                        populateInitialData(database)
                    }
                }
            }
        }

        suspend fun populateInitialData(db: PlanPasikaDatabase) {
            // Seed Starter Exercises
            val starterExercises = listOf(
                ExerciseDefinitionEntity("ex_1", "Wyciskanie sztangi na ławce poziomej", ExerciseCategory.CHEST, "Sztanga", "Zachowaj retrakcję i depresję łopatek, dotknij klatki na wysokości mostka."),
                ExerciseDefinitionEntity("ex_2", "Wyciskanie hantli na skosie dodatnim", ExerciseCategory.CHEST, "Hantle", "Kąt ławki 30 stopni, pełen zakres ruchu."),
                ExerciseDefinitionEntity("ex_3", "Podciąganie na drążku (nachwyt)", ExerciseCategory.BACK, "Masa ciała", "Pełne wyjście z martwego zwisu, broda nad drążek."),
                ExerciseDefinitionEntity("ex_4", "Wiosłowanie sztangą w opadzie tułowia", ExerciseCategory.BACK, "Sztanga", "Kąt tułowia ok. 45 stopni, ciągnij łokciami do bioder."),
                ExerciseDefinitionEntity("ex_5", "Żołnierskie wyciskanie (OHP)", ExerciseCategory.SHOULDERS, "Sztanga", "Napięte pośladki i brzuch, głowa przechodzi pod gryfem."),
                ExerciseDefinitionEntity("ex_6", "Wznosy bokiem z hantlami", ExerciseCategory.SHOULDERS, "Hantle", "Lekkie ugięcie w łokciach, prowadź ruch łokciem."),
                ExerciseDefinitionEntity("ex_7", "Przysiad ze sztangą na plecach", ExerciseCategory.LEGS, "Sztanga", "Kolana w linii palców, biodro poniżej linii kolan."),
                ExerciseDefinitionEntity("ex_8", "Rumuński martwy ciąg (RDL)", ExerciseCategory.LEGS, "Sztanga", "Cofaj biodra w tył, utrzymuj proste plecy."),
                ExerciseDefinitionEntity("ex_9", "Uginanie przedramion z supinacją", ExerciseCategory.BICEPS, "Hantle", "Pełna supinacja w szczytowym momencie skurczu."),
                ExerciseDefinitionEntity("ex_10", "Wyciskanie francuskie ze sztangą łamaną", ExerciseCategory.TRICEPS, "Sztanga łamana", "Łokcie wąsko, kontroluj fazę negatywną.")
            )
            db.exerciseDao().insertExercises(starterExercises)

            // Seed Initial Training Cycle
            val cycle = TrainingCycleEntity("cycle_1", "Cykl 2: Hipertrofia & Objętość", "14.09.2026", true)
            db.trainingPlanDao().insertCycle(cycle)

            val week1 = TrainingWeekEntity("week_1", "cycle_1", 1, "Tydzień 1")
            val week2 = TrainingWeekEntity("week_2", "cycle_1", 2, "Tydzień 2")
            val week3 = TrainingWeekEntity("week_3", "cycle_1", 3, "Tydzień 3")
            db.trainingPlanDao().insertWeek(week1)
            db.trainingPlanDao().insertWeek(week2)
            db.trainingPlanDao().insertWeek(week3)

            // Seed Days for Week 2
            val day1 = PlanTrainingDayEntity("day_w2_1", "week_2", 1, "Poniedziałek", "Push — Klatka & Barki & Triceps", DayStatus.COMPLETED)
            val day2 = PlanTrainingDayEntity("day_w2_2", "week_2", 2, "Wtorek", "Pull — Plecy & Biceps", DayStatus.UNRESOLVED)
            val day3 = PlanTrainingDayEntity("day_w2_4", "week_2", 4, "Czwartek", "Legs — Czworogłowe & Pośladki", DayStatus.UNRESOLVED)
            val day4 = PlanTrainingDayEntity("day_w2_6", "week_2", 6, "Sobota", "Upper Body & Ramiona", DayStatus.UNRESOLVED)
            db.trainingPlanDao().insertDay(day1)
            db.trainingPlanDao().insertDay(day2)
            db.trainingPlanDao().insertDay(day3)
            db.trainingPlanDao().insertDay(day4)

            // Seed Exercises for Day 1
            val ex1 = PlanExerciseEntity("pe_1", "day_w2_1", "ex_1", "Wyciskanie sztangi na ławce poziomej", ExerciseCategory.CHEST, 4, "6-8", 90f, "8.5", 0)
            val ex2 = PlanExerciseEntity("pe_2", "day_w2_1", "ex_2", "Wyciskanie hantli na skosie dodatnim", ExerciseCategory.CHEST, 3, "8-10", 32f, "8", 1)
            val ex3 = PlanExerciseEntity("pe_3", "day_w2_1", "ex_5", "Żołnierskie wyciskanie (OHP)", ExerciseCategory.SHOULDERS, 3, "8-10", 55f, "8", 2)
            val ex4 = PlanExerciseEntity("pe_4", "day_w2_1", "ex_10", "Wyciskanie francuskie ze sztangą łamaną", ExerciseCategory.TRICEPS, 3, "10-12", 35f, "8.5", 3)
            db.trainingPlanDao().insertPlanExercises(listOf(ex1, ex2, ex3, ex4))

            // Seed Sample Body Measurements
            val measurement1 = BodyMeasurementEntity("m_1", "2026-09-01", 83.2f, 108f, 39.5f, 34f, 122f, 84f, 102f, 62f, 38.5f, "Start cyklu")
            val measurement2 = BodyMeasurementEntity("m_2", "2026-09-15", 83.8f, 109f, 40.0f, 34.5f, 123f, 83.5f, 102.5f, 62.5f, 38.8f, "Kontrola formy po 2 tyg.")
            val measurement3 = BodyMeasurementEntity("m_3", "2026-09-24", 84.4f, 109.5f, 40.3f, 35.0f, 124f, 83.0f, 103.0f, 63.0f, 39.0f, "Aktualny pomiar")
            db.bodyMeasurementDao().insertMeasurement(measurement1)
            db.bodyMeasurementDao().insertMeasurement(measurement2)
            db.bodyMeasurementDao().insertMeasurement(measurement3)

            // Seed Sample Notes and Events
            val note1 = WorkoutNoteEntity("n_1", "2026-09-24", "Regeneracja i sen", "8h głębokiego snu, pełna regeneracja po treningu Push.")
            db.calendarDao().insertNote(note1)

            val event1 = CalendarEventEntity("ev_1", "Zawody Trójbój Siłowy (Debiuty)", "2026-10-18", "09:00", "ZAWODY", "Docelowy start sezonu jesiennego.")
            db.calendarDao().insertEvent(event1)
        }
    }
}
