import {
  ExerciseCategory,
  ExerciseDefinition,
  PlanDay,
  SubstanceEntry,
  CalendarNote,
  CalendarEvent,
  TrainingCycle,
  ActiveWorkoutSession,
  BodyMeasurementEntry,
  BodyWeightEntry,
} from '../domain/types';

// Pre-seeded exercise library strictly mapped to one of 7 categories with equipment & technique
export const INITIAL_EXERCISES: ExerciseDefinition[] = [
  // Klatka piersiowa
  {
    id: 'ex_chest_1',
    name: 'Wyciskanie sztangi na ławce poziomej',
    category: 'Klatka piersiowa',
    equipment: 'Sztanga',
    technique: 'Ściągnij i zablokuj łopatki. Opuść gryf na wysokość dolnej części mostka pod pełną kontrolą (tempo 3-0-1), dotknij klatki z sekundową pauzą i dynamicznie wyciśnij.',
    defaultSets: 4,
    defaultReps: '8-10',
    defaultRpe: '8',
    isCustom: false,
  },
  {
    id: 'ex_chest_2',
    name: 'Wyciskanie hantli na skosie dodatnim',
    category: 'Klatka piersiowa',
    equipment: 'Hantle',
    technique: 'Kąt ławki 30°. Łokcie prowadzone pod kątem ok. 45-60° do tułowia. Głębokie rozciągnięcie w dolnej fazie bez nadmiernego wyginania odcinka lędźwiowego.',
    defaultSets: 3,
    defaultReps: '10-12',
    defaultRpe: '8.5',
    isCustom: false,
  },
  {
    id: 'ex_chest_3',
    name: 'Rozpiętki z linkami wyciągu',
    category: 'Klatka piersiowa',
    equipment: 'Wyciąg',
    technique: 'Lekko ugięte łokcie przez cały czas trwania ruchu. Skup się na maksymalnym rozciągnięciu w tył oraz mocnym spięciu klatki w fazie koncentrycznej.',
    defaultSets: 3,
    defaultReps: '12-15',
    defaultRpe: '9',
    isCustom: false,
  },
  {
    id: 'ex_chest_4',
    name: 'Dipsy na klatkę (poręcze)',
    category: 'Klatka piersiowa',
    equipment: 'Masa ciała',
    technique: 'Pochyl tułów w przód pod kątem ok. 30°, łokcie szerzej niż przy dipsach na triceps. Schodź do kąta 90° w łokciu z kontrolą torebki stawowej barku.',
    defaultSets: 3,
    defaultReps: '8-10',
    defaultRpe: '8.5',
    isCustom: false,
  },

  // Plecy
  {
    id: 'ex_back_1',
    name: 'Martwy ciąg klasyczny',
    category: 'Plecy',
    equipment: 'Sztanga',
    technique: 'Piszczele 2-3 cm od gryfu, stopy na szerokość bioder. Zablokuj najszersze (jakbyś chciał złamać sztangę), wdech przeponowy, pchnij ziemię nogami, wyprost w biodrach.',
    defaultSets: 4,
    defaultReps: '5-6',
    defaultRpe: '8.5',
    isCustom: false,
  },
  {
    id: 'ex_back_2',
    name: 'Podciąganie na drążku nachwytem',
    category: 'Plecy',
    equipment: 'Masa ciała',
    technique: 'Chwyt nieco szerszy niż barki. Rozpocznij ruch od depresji łopatek, ciągnij klatkę piersiową w stronę drążka, unikaj bujania ciałem.',
    defaultSets: 4,
    defaultReps: '6-8',
    defaultRpe: '8',
    isCustom: false,
  },
  {
    id: 'ex_back_3',
    name: 'Wiosłowanie sztangą w opadzie tułowia',
    category: 'Plecy',
    equipment: 'Sztanga',
    technique: 'Opad tułowia ok. 45-60°, grzbiet w neutralnej pozycji. Prowadź łokcie blisko ciała, kierując gryf w okolice pępka/dolnych żeber.',
    defaultSets: 4,
    defaultReps: '8-10',
    defaultRpe: '8',
    isCustom: false,
  },
  {
    id: 'ex_back_4',
    name: 'Ściąganie drążka wyciągu górnego',
    category: 'Plecy',
    equipment: 'Wyciąg',
    technique: 'Tułów odchylony o max 10-15°. Ściągaj łokcie w dół i do środka, pauza 1s na wysokości obojczyka.',
    defaultSets: 3,
    defaultReps: '10-12',
    defaultRpe: '8.5',
    isCustom: false,
  },

  // Barki
  {
    id: 'ex_shoulders_1',
    name: 'Wyciskanie żołnierskie (OHP)',
    category: 'Barki',
    equipment: 'Sztanga',
    technique: 'Stopy pod biodrami, napięte pośladki i brzuch. Przedramiona pionowo pod gryfem. Ruch po prostej trajektorii blisko twarzy, głowa wraca pod gryf po minięciu czoła.',
    defaultSets: 4,
    defaultReps: '6-8',
    defaultRpe: '8',
    isCustom: false,
  },
  {
    id: 'ex_shoulders_2',
    name: 'Wznosy hantli bokiem',
    category: 'Barki',
    equipment: 'Hantle',
    technique: 'Lekkie pochylenie tułowia w przód (10°), ruch w płaszczyźnie łopatki (scaption plane, ok. 30° w przód). Nie unoś ponad poziom barków.',
    defaultSets: 4,
    defaultReps: '12-15',
    defaultRpe: '9',
    isCustom: false,
  },
  {
    id: 'ex_shoulders_3',
    name: 'Face pulls na wyciągu',
    category: 'Barki',
    equipment: 'Wyciąg',
    technique: 'Sznur na wysokości oczu. Ciągnij do nasady nosa/uszu z jednoczesną rotacją zewnętrzną przedramion. Świetna praca tyłu barku i rotatorów.',
    defaultSets: 3,
    defaultReps: '15-20',
    defaultRpe: '8',
    isCustom: false,
  },
  {
    id: 'ex_shoulders_4',
    name: 'Wznosy w opadzie tułowia (tył barku)',
    category: 'Barki',
    equipment: 'Hantle',
    technique: 'Opad tułowia prawie równoległy do podłoża. Unoszenie ramion w bok z lekkim ugięciem łokci, bez angażowania czworobocznego grzbietu.',
    defaultSets: 3,
    defaultReps: '12-15',
    defaultRpe: '8.5',
    isCustom: false,
  },

  // Nogi
  {
    id: 'ex_legs_1',
    name: 'Przysiad ze sztangą na plecach (Back Squat)',
    category: 'Nogi',
    equipment: 'Sztanga',
    technique: 'Sztanga na mięśniach czworobocznych (high-bar) lub grzebieniu łopatki (low-bar). Biodra i kolana zginają się jednocześnie, kolana prowadzone w osi stóp, głębokość poniżej kąta prostego.',
    defaultSets: 4,
    defaultReps: '6-8',
    defaultRpe: '8',
    isCustom: false,
  },
  {
    id: 'ex_legs_2',
    name: 'Wypychanie ciężaru na suwnicy',
    category: 'Nogi',
    equipment: 'Maszyna',
    technique: 'Stopy na środku platformy na szerokość barków. Nie odrywaj miednicy od oparcia w dolnym punkcie, nie blokuj kolan w pełnym wyproście.',
    defaultSets: 4,
    defaultReps: '10-12',
    defaultRpe: '8.5',
    isCustom: false,
  },
  {
    id: 'ex_legs_3',
    name: 'Rumuński martwy ciąg (RDL)',
    category: 'Nogi',
    equipment: 'Sztanga',
    technique: 'Lekkie ugięcie w kolanach utrzymywane przez cały ruch. Pchaj biodra w tył aż poczujesz mocne rozciągnięcie kulszowo-goleniowych, gryf ślizga się po udach.',
    defaultSets: 3,
    defaultReps: '8-10',
    defaultRpe: '8',
    isCustom: false,
  },
  {
    id: 'ex_legs_4',
    name: 'Wspięcia na palce stojąc (łydki)',
    category: 'Nogi',
    equipment: 'Maszyna',
    technique: 'Pełny zakres ruchu: 2 sekundy głębokiego rozciągnięcia na dole, dynamiczne wyjście na palce i 1s pauzy na szczycie.',
    defaultSets: 4,
    defaultReps: '12-15',
    defaultRpe: '9',
    isCustom: false,
  },

  // Biceps
  {
    id: 'ex_biceps_1',
    name: 'Uginanie przedramion ze sztangą łamaną',
    category: 'Biceps',
    equipment: 'Sztanga',
    technique: 'Łokcie zablokowane przy żebrach. Brak bujania biodrami. Faza negatywna 3 sekundy pod pełną kontrolą.',
    defaultSets: 3,
    defaultReps: '8-10',
    defaultRpe: '8.5',
    isCustom: false,
  },
  {
    id: 'ex_biceps_2',
    name: 'Uginanie hantli z supinacją z siedzenia',
    category: 'Biceps',
    equipment: 'Hantle',
    technique: 'Rozpocznij z chwytem neutralnym (młotkowym), od połowy ruchu wykonuj płynną supinację nadgarstka (kciuk na zewnątrz), maksymalny skurcz.',
    defaultSets: 3,
    defaultReps: '10-12',
    defaultRpe: '8.5',
    isCustom: false,
  },
  {
    id: 'ex_biceps_3',
    name: 'Uginanie młotkowe stojąc',
    category: 'Biceps',
    equipment: 'Hantle',
    technique: 'Chwyt neutralny przez cały ruch. Kładzie nacisk na mięsień ramienny (brachialis) oraz ramienno-promieniowy.',
    defaultSets: 3,
    defaultReps: '10-12',
    defaultRpe: '8',
    isCustom: false,
  },

  // Triceps
  {
    id: 'ex_triceps_1',
    name: 'Wyciskanie francuskie ze sztangą leżąc',
    category: 'Triceps',
    equipment: 'Sztanga',
    technique: 'Ramiona odchylone lekko w tył (nie pionowo), aby utrzymać napięcie na głowie długiej tricepsa. Opad gryfu w stronę czubka głowy.',
    defaultSets: 3,
    defaultReps: '10-12',
    defaultRpe: '8.5',
    isCustom: false,
  },
  {
    id: 'ex_triceps_2',
    name: 'Prostowanie ramion na wyciągu (sznur)',
    category: 'Triceps',
    equipment: 'Wyciąg',
    technique: 'Klatka wypchnięta, łokcie stabilne przy bokach. Na dole ruchu rozszerz końcówki sznura na zewnątrz dla mocniejszego spięcia głowy bocznej.',
    defaultSets: 3,
    defaultReps: '12-15',
    defaultRpe: '9',
    isCustom: false,
  },
  {
    id: 'ex_triceps_3',
    name: 'Wyciskanie wąskim chwytem',
    category: 'Triceps',
    equipment: 'Sztanga',
    technique: 'Chwyt na szerokość barków (ok. 30-40 cm). Łokcie blisko tułowia, pauza na dolnej części mostka.',
    defaultSets: 3,
    defaultReps: '8-10',
    defaultRpe: '8',
    isCustom: false,
  },

  // Pozostałe
  {
    id: 'ex_other_1',
    name: 'Allahy (spięcia brzucha na wyciągu)',
    category: 'Pozostałe',
    equipment: 'Wyciąg',
    technique: 'Klęcząc przed wyciągiem z linką przy skroniach. Zwijaj kręgosłup jak harmonijkę przyciągając żebra do miednicy, nie zginaj się w samych biodrach.',
    defaultSets: 3,
    defaultReps: '15-20',
    defaultRpe: '8.5',
    isCustom: false,
  },
  {
    id: 'ex_other_2',
    name: 'Plank izometryczny',
    category: 'Pozostałe',
    equipment: 'Masa ciała',
    technique: 'Napięte pośladki, brzuch i czworogłowe. Miednica w tylnopochyleniu (hollow body), łokcie pod barkami.',
    defaultSets: 3,
    defaultReps: '45-60s',
    defaultRpe: '8',
    isCustom: false,
  },
  {
    id: 'ex_other_3',
    name: 'Spacer farmera z hantlami',
    category: 'Pozostałe',
    equipment: 'Hantle',
    technique: 'Ciężkie hantle po bokach, łopatki ściągnięte, wysoka sylwetka. Równe, kontrolowane kroki bez kołysania tułowiem.',
    defaultSets: 3,
    defaultReps: '40m',
    defaultRpe: '9',
    isCustom: false,
  },
];

// Helper to get formatted dates for current week
export function getDatesForCurrentWeek(): string[] {
  const now = new Date();
  // find Monday of current week
  const day = now.getDay();
  const diff = now.getDate() - day + (day === 0 ? -6 : 1);
  const monday = new Date(now);
  monday.setDate(diff);

  const week: string[] = [];
  for (let i = 0; i < 7; i++) {
    const d = new Date(monday);
    d.setDate(monday.getDate() + i);
    week.push(d.toISOString().split('T')[0]);
  }
  return week;
}

export function generateInitialPlans(): PlanDay[] {
  const currentWeek = getDatesForCurrentWeek();
  const dayNames = ['Poniedziałek', 'Wtorek', 'Środa', 'Czwartek', 'Piątek', 'Sobota', 'Niedziela'];

  return [
    {
      date: currentWeek[0],
      dayOfWeek: 1,
      dayType: 'WORKOUT',
      workoutName: 'Klatka + Triceps (Góra A)',
      manualStatus: 'COMPLETED',
      hasRecordedSession: true,
      exercises: [
        INITIAL_EXERCISES[0], // Wyciskanie sztangi
        INITIAL_EXERCISES[1], // Wyciskanie hantli skos
        INITIAL_EXERCISES[15], // Prostowanie ramion
      ],
    },
    {
      date: currentWeek[1],
      dayOfWeek: 2,
      dayType: 'WORKOUT',
      workoutName: 'Plecy + Biceps (Góra B)',
      manualStatus: 'COMPLETED',
      hasRecordedSession: true,
      exercises: [
        INITIAL_EXERCISES[4], // Podciąganie
        INITIAL_EXERCISES[5], // Wiosłowanie
        INITIAL_EXERCISES[12], // Uginanie sztanga
      ],
    },
    {
      date: currentWeek[2],
      dayOfWeek: 3,
      dayType: 'REST',
      manualStatus: 'UNRESOLVED',
      hasRecordedSession: false,
    },
    {
      date: currentWeek[3],
      dayOfWeek: 4,
      dayType: 'WORKOUT',
      workoutName: 'Nogi + Brzuch (Dół A)',
      manualStatus: 'COMPLETED',
      hasRecordedSession: true,
      exercises: [
        INITIAL_EXERCISES[8], // Przysiad
        INITIAL_EXERCISES[10], // RDL
        INITIAL_EXERCISES[18], // Allahy
      ],
    },
    {
      date: currentWeek[4],
      dayOfWeek: 5,
      dayType: 'WORKOUT',
      workoutName: 'Barki + Ramiona (Hipertrofia)',
      manualStatus: 'UNRESOLVED',
      hasRecordedSession: false,
      exercises: [
        INITIAL_EXERCISES[6], // OHP
        INITIAL_EXERCISES[7], // Wznosy bokiem
        INITIAL_EXERCISES[13], // Uginanie z supinacją
        INITIAL_EXERCISES[16], // Wyciskanie wąskim chwytem
      ],
    },
    {
      date: currentWeek[5],
      dayOfWeek: 6,
      dayType: 'REST',
      manualStatus: 'UNRESOLVED',
      hasRecordedSession: false,
    },
    {
      date: currentWeek[6],
      dayOfWeek: 7,
      dayType: 'EMPTY',
      manualStatus: 'UNRESOLVED',
      hasRecordedSession: false,
    },
  ];
}

export const INITIAL_CYCLES: TrainingCycle[] = [
  {
    id: 'cycle_1',
    name: 'Cykl 1: Budowanie bazy siłowej (5x5)',
    startDate: '2026-08-01',
    endDate: '2026-08-31',
    isActive: false,
  },
  {
    id: 'cycle_2',
    name: 'Cykl 2: Hipertrofia & Objętość (Góra/Dół)',
    startDate: '2026-09-01',
    endDate: '2026-09-30',
    isActive: true,
  },
];

export const INITIAL_SUBSTANCES: SubstanceEntry[] = [
  {
    id: 'sub_1',
    date: new Date().toISOString().split('T')[0],
    time: '07:30',
    name: 'Kreatyna Monohydrat',
    details: '5g rozpuszczone w wodzie po śniadaniu',
  },
  {
    id: 'sub_2',
    date: new Date().toISOString().split('T')[0],
    time: '08:00',
    name: 'Omega-3 + D3 & K2',
    details: '2 kapsułki do posiłku bogatego w tłuszcze',
  },
  {
    id: 'sub_3',
    date: new Date(Date.now() - 86400000).toISOString().split('T')[0],
    time: '16:00',
    name: 'Białko serwatkowe WPC',
    details: '30g z wodą bezpośrednio po sesji treningowej',
  },
];

export const INITIAL_NOTES: CalendarNote[] = [
  {
    id: 'note_1',
    date: new Date().toISOString().split('T')[0],
    content: 'Dzisiaj skupienie na tempie opuszczania 3-0-1-0. Barki dobrze rozgrzane rotatorem.',
    createdAt: new Date().toLocaleTimeString('pl-PL', { hour: '2-digit', minute: '2-digit' }),
  },
  {
    id: 'note_2',
    date: new Date(Date.now() - 86400000).toISOString().split('T')[0],
    content: 'Wczorajszy martwy ciąg: stabilny chwyt bez pasków do 140kg, pas użyty w ostatniej serii.',
    createdAt: '18:45',
  },
];

export const INITIAL_EVENTS: CalendarEvent[] = [
  {
    id: 'event_1',
    date: new Date().toISOString().split('T')[0],
    time: '18:30',
    title: 'Konsultacja z fizjoterapeutą (rotatory & biodro)',
    category: 'ZDROWIE',
    description: 'Ocena mobilności obręczy barkowej i stawu biodrowego przed ciężkim blokiem push/pull.',
    createdAt: '09:00',
  },
  {
    id: 'event_2',
    date: new Date(Date.now() + 86400000 * 2).toISOString().split('T')[0],
    time: '07:30',
    title: 'Badania krwi - profil hormonalny i lipidogram',
    category: 'ZDROWIE',
    description: 'Rano na czczo: Morfologia, Testosteron, E2, Prolaktyna, ALT/AST, Lipidogram.',
    createdAt: '10:15',
  },
  {
    id: 'event_3',
    date: new Date(Date.now() + 86400000 * 5).toISOString().split('T')[0],
    time: '11:00',
    title: 'Sprawdzian maksów siłowych (Test 1RM)',
    category: 'TRENING',
    description: 'Testy 1RM: Wyciskanie leżąc, Martwy ciąg, Przysiad ze sztangą.',
    createdAt: '12:00',
  },
];

export const INITIAL_ACTIVE_WORKOUT: ActiveWorkoutSession = {
  id: 'session_active_1',
  name: 'Barki + Ramiona (Hipertrofia)',
  startTime: Date.now() - 1420 * 1000, // ~23 mins ago
  elapsedSeconds: 1420,
  isPaused: false,
  notes: 'Dobre tempo, barki solidnie dogrzane. Skupienie na pełnej blokadzie w OHP i kontroli fazy ekscentrycznej.',
  exercises: [
    {
      id: 'active_ex_1',
      exerciseId: 'ex_shoulders_1',
      name: 'Wyciskanie żołnierskie (OHP)',
      category: 'Barki',
      skipped: false,
      sets: [
        { id: 'set_1_1', setNumber: 1, weightKg: 50, reps: 8, completed: true, previousWeightKg: 47.5, previousReps: 8 },
        { id: 'set_1_2', setNumber: 2, weightKg: 52.5, reps: 8, completed: true, previousWeightKg: 50, previousReps: 8 },
        { id: 'set_1_3', setNumber: 3, weightKg: 55, reps: 6, completed: false, previousWeightKg: 52.5, previousReps: 6 },
        { id: 'set_1_4', setNumber: 4, weightKg: 55, reps: 6, completed: false, previousWeightKg: 52.5, previousReps: 5 },
      ],
    },
    {
      id: 'active_ex_2',
      exerciseId: 'ex_shoulders_2',
      name: 'Wznosy hantli bokiem',
      category: 'Barki',
      skipped: false,
      sets: [
        { id: 'set_2_1', setNumber: 1, weightKg: 12, reps: 12, completed: true, previousWeightKg: 10, previousReps: 12 },
        { id: 'set_2_2', setNumber: 2, weightKg: 12, reps: 12, completed: false, previousWeightKg: 12, previousReps: 10 },
        { id: 'set_2_3', setNumber: 3, weightKg: 12, reps: 10, completed: false, previousWeightKg: 12, previousReps: 10 },
      ],
    },
    {
      id: 'active_ex_3',
      exerciseId: 'ex_biceps_1',
      name: 'Uginanie przedramion ze sztangą łamaną',
      category: 'Biceps',
      skipped: false,
      sets: [
        { id: 'set_3_1', setNumber: 1, weightKg: 35, reps: 10, completed: false, previousWeightKg: 32.5, previousReps: 10 },
        { id: 'set_3_2', setNumber: 2, weightKg: 35, reps: 10, completed: false, previousWeightKg: 35, previousReps: 8 },
        { id: 'set_3_3', setNumber: 3, weightKg: 35, reps: 8, completed: false, previousWeightKg: 35, previousReps: 8 },
      ],
    },
    {
      id: 'active_ex_4',
      exerciseId: 'ex_triceps_2',
      name: 'Prostowanie ramion na wyciągu (sznur)',
      category: 'Triceps',
      skipped: false,
      sets: [
        { id: 'set_4_1', setNumber: 1, weightKg: 27.5, reps: 12, completed: false, previousWeightKg: 25, previousReps: 12 },
        { id: 'set_4_2', setNumber: 2, weightKg: 27.5, reps: 12, completed: false, previousWeightKg: 27.5, previousReps: 10 },
      ],
    },
  ],
};

import { TrainingCycleData } from '../domain/types';

export const INITIAL_TRAINING_CYCLE_DATA: TrainingCycleData = {
  id: 'cycle_main_1',
  name: 'Cykl 2: Hipertrofia & Objętość',
  startDate: '14.09.2026',
  weeks: [
    {
      id: 'week_1',
      weekNumber: 1,
      name: 'Tydzień 1',
      days: [
        {
          id: 'w1_d1',
          dayOfWeek: 1,
          dayName: 'Poniedziałek',
          planName: 'Push',
          manualStatus: 'COMPLETED',
          exercises: [
            {
              id: 'w1_ex_1',
              exerciseId: 'ex_chest_1',
              name: 'Wyciskanie sztangi na ławce poziomej',
              category: 'Klatka piersiowa',
              sets: [
                { id: 'w1_s1', setNumber: 1, weightKg: 75, reps: 8, completed: true },
                { id: 'w1_s2', setNumber: 2, weightKg: 75, reps: 8, completed: true },
                { id: 'w1_s3', setNumber: 3, weightKg: 75, reps: 8, completed: true },
              ],
            },
            {
              id: 'w1_ex_2',
              exerciseId: 'ex_chest_2',
              name: 'Wyciskanie hantli na skosie dodatnim',
              category: 'Klatka piersiowa',
              sets: [
                { id: 'w1_s4', setNumber: 1, weightKg: 28, reps: 10, completed: true },
                { id: 'w1_s5', setNumber: 2, weightKg: 28, reps: 10, completed: true },
              ],
            },
          ],
        },
        {
          id: 'w1_d2',
          dayOfWeek: 2,
          dayName: 'Wtorek',
          planName: 'Pull',
          manualStatus: 'COMPLETED',
          exercises: [
            {
              id: 'w1_ex_3',
              exerciseId: 'ex_back_1',
              name: 'Martwy ciąg klasyczny',
              category: 'Plecy',
              sets: [
                { id: 'w1_s6', setNumber: 1, weightKg: 120, reps: 6, completed: true },
                { id: 'w1_s7', setNumber: 2, weightKg: 130, reps: 5, completed: true },
              ],
            },
          ],
        },
      ],
    },
    {
      id: 'week_2',
      weekNumber: 2,
      name: 'Tydzień 2',
      days: [
        {
          id: 'w2_d1',
          dayOfWeek: 1,
          dayName: 'Poniedziałek',
          planName: 'Push',
          manualStatus: 'COMPLETED',
          notes: 'Pauza 1 sek. na klatce przy każdym wyciskaniu. Kontrola fazy negatywnej 3-0-1. Nie schodzić poniżej 8 powtórzeń.',
          exercises: [
            {
              id: 'w2_ex_1',
              exerciseId: 'ex_chest_1',
              name: 'Wyciskanie sztangi na ławce poziomej',
              category: 'Klatka piersiowa',
              notes: 'Pauza 1 sek. na klatce',
              sets: [
                { id: 'w2_s1', setNumber: 1, weightKg: 80, reps: 8, completed: true },
                { id: 'w2_s2', setNumber: 2, weightKg: 80, reps: 8, completed: true },
                { id: 'w2_s3', setNumber: 3, weightKg: 80, reps: 8, completed: true },
              ],
            },
            {
              id: 'w2_ex_2',
              exerciseId: 'ex_chest_2',
              name: 'Wyciskanie hantli na skosie dodatnim',
              category: 'Klatka piersiowa',
              sets: [
                { id: 'w2_s4', setNumber: 1, weightKg: 30, reps: 10, completed: true },
                { id: 'w2_s5', setNumber: 2, weightKg: 30, reps: 10, completed: true },
                { id: 'w2_s6', setNumber: 3, weightKg: 30, reps: 10, completed: true },
              ],
            },
            {
              id: 'w2_ex_3',
              exerciseId: 'ex_chest_3',
              name: 'Rozpiętki z linkami wyciągu',
              category: 'Klatka piersiowa',
              sets: [
                { id: 'w2_s7', setNumber: 1, weightKg: 15, reps: 12, completed: true },
                { id: 'w2_s8', setNumber: 2, weightKg: 15, reps: 12, completed: true },
                { id: 'w2_s9', setNumber: 3, weightKg: 15, reps: 12, completed: true },
              ],
            },
            {
              id: 'w2_ex_4',
              exerciseId: 'ex_triceps_2',
              name: 'Prostowanie ramion na wyciągu (sznur)',
              category: 'Triceps',
              sets: [
                { id: 'w2_s10', setNumber: 1, weightKg: 25, reps: 12, completed: true },
                { id: 'w2_s11', setNumber: 2, weightKg: 27.5, reps: 10, completed: true },
                { id: 'w2_s12', setNumber: 3, weightKg: 27.5, reps: 10, completed: true },
              ],
            },
          ],
        },
        {
          id: 'w2_d2',
          dayOfWeek: 2,
          dayName: 'Wtorek',
          planName: 'Pull',
          manualStatus: 'UNRESOLVED',
          exercises: [
            {
              id: 'w2_ex_5',
              exerciseId: 'ex_back_1',
              name: 'Martwy ciąg klasyczny',
              category: 'Plecy',
              sets: [
                { id: 'w2_s13', setNumber: 1, weightKg: 120, reps: 6, completed: false },
                { id: 'w2_s14', setNumber: 2, weightKg: 130, reps: 6, completed: false },
                { id: 'w2_s15', setNumber: 3, weightKg: 140, reps: 4, completed: false },
              ],
            },
            {
              id: 'w2_ex_6',
              exerciseId: 'ex_back_2',
              name: 'Podciąganie na drążku nachwytem',
              category: 'Plecy',
              sets: [
                { id: 'w2_s16', setNumber: 1, weightKg: 0, reps: 8, completed: false },
                { id: 'w2_s17', setNumber: 2, weightKg: 0, reps: 8, completed: false },
                { id: 'w2_s18', setNumber: 3, weightKg: 0, reps: 8, completed: false },
              ],
            },
            {
              id: 'w2_ex_7',
              exerciseId: 'ex_biceps_1',
              name: 'Uginanie przedramion ze sztangą łamaną',
              category: 'Biceps',
              sets: [
                { id: 'w2_s19', setNumber: 1, weightKg: 35, reps: 10, completed: false },
                { id: 'w2_s20', setNumber: 2, weightKg: 35, reps: 10, completed: false },
                { id: 'w2_s21', setNumber: 3, weightKg: 35, reps: 8, completed: false },
              ],
            },
          ],
        },
        {
          id: 'w2_d3',
          dayOfWeek: 3,
          dayName: 'Środa',
          planName: 'Legs',
          manualStatus: 'NOT_COMPLETED',
          exercises: [
            {
              id: 'w2_ex_8',
              exerciseId: 'ex_legs_1',
              name: 'Przysiad ze sztangą na plecach (Back Squat)',
              category: 'Nogi',
              sets: [
                { id: 'w2_s22', setNumber: 1, weightKg: 100, reps: 8, completed: false },
                { id: 'w2_s23', setNumber: 2, weightKg: 110, reps: 8, completed: false },
                { id: 'w2_s24', setNumber: 3, weightKg: 115, reps: 6, completed: false },
              ],
            },
            {
              id: 'w2_ex_9',
              exerciseId: 'ex_legs_3',
              name: 'Rumuński martwy ciąg (RDL)',
              category: 'Nogi',
              sets: [
                { id: 'w2_s25', setNumber: 1, weightKg: 90, reps: 10, completed: false },
                { id: 'w2_s26', setNumber: 2, weightKg: 90, reps: 10, completed: false },
                { id: 'w2_s27', setNumber: 3, weightKg: 90, reps: 10, completed: false },
              ],
            },
            {
              id: 'w2_ex_10',
              exerciseId: 'ex_other_1',
              name: 'Allahy (spięcia brzucha na wyciągu)',
              category: 'Pozostałe',
              sets: [
                { id: 'w2_s28', setNumber: 1, weightKg: 35, reps: 15, completed: false },
                { id: 'w2_s29', setNumber: 2, weightKg: 35, reps: 15, completed: false },
              ],
            },
          ],
        },
      ],
    },
    {
      id: 'week_3',
      weekNumber: 3,
      name: 'Tydzień 3',
      days: [
        {
          id: 'w3_d1',
          dayOfWeek: 1,
          dayName: 'Poniedziałek',
          planName: 'Push',
          manualStatus: 'UNRESOLVED',
          exercises: [
            {
              id: 'w3_ex_1',
              exerciseId: 'ex_chest_1',
              name: 'Wyciskanie sztangi na ławce poziomej',
              category: 'Klatka piersiowa',
              sets: [
                { id: 'w3_s1', setNumber: 1, weightKg: 82.5, reps: 8, completed: false },
                { id: 'w3_s2', setNumber: 2, weightKg: 82.5, reps: 8, completed: false },
                { id: 'w3_s3', setNumber: 3, weightKg: 82.5, reps: 8, completed: false },
              ],
            },
          ],
        },
        {
          id: 'w3_d2',
          dayOfWeek: 2,
          dayName: 'Wtorek',
          planName: 'Pull',
          manualStatus: 'UNRESOLVED',
          exercises: [
            {
              id: 'w3_ex_2',
              exerciseId: 'ex_back_1',
              name: 'Martwy ciąg klasyczny',
              category: 'Plecy',
              sets: [
                { id: 'w3_s4', setNumber: 1, weightKg: 125, reps: 6, completed: false },
                { id: 'w3_s5', setNumber: 2, weightKg: 135, reps: 6, completed: false },
              ],
            },
          ],
        },
      ],
    },
  ],
};

// Initial realistic body measurement samples
export const INITIAL_BODY_MEASUREMENTS: BodyMeasurementEntry[] = [
  {
    id: 'meas_1',
    date: '2026-08-28',
    biceps: 37.5,
    triceps: 31.0,
    chest: 104.0,
    shoulders: 121.0,
    waist: 83.5,
    hips: 97.0,
    thigh: 59.0,
    calf: 38.0,
    notes: 'Początek cyklu masowego, pomiar rano na czczo',
  },
  {
    id: 'meas_2',
    date: '2026-09-07',
    biceps: 37.8,
    triceps: 31.4,
    chest: 105.0,
    shoulders: 122.0,
    waist: 83.8,
    hips: 97.5,
    thigh: 59.8,
    calf: 38.2,
    notes: 'Koniec 1. tygodnia, dobra regeneracja',
  },
  {
    id: 'meas_3',
    date: '2026-09-14',
    biceps: 38.2,
    triceps: 31.8,
    chest: 106.2,
    shoulders: 123.0,
    waist: 84.0,
    hips: 98.0,
    thigh: 60.5,
    calf: 38.5,
    notes: 'Pomiar kontrolny po bloku push/pull',
  },
  {
    id: 'meas_4',
    date: '2026-09-24',
    biceps: 38.5,
    triceps: 32.2,
    chest: 107.0,
    shoulders: 124.2,
    waist: 84.2,
    hips: 98.4,
    thigh: 61.2,
    calf: 38.8,
    notes: 'Pełna pompa, obwody stabilnie w górę',
  },
];

// Initial realistic body weight samples
export const INITIAL_BODY_WEIGHT: BodyWeightEntry[] = [
  { id: 'w_1', date: '2026-08-28', weight: 75.0, notes: 'Waga startowa cyklu' },
  { id: 'w_2', date: '2026-09-02', weight: 75.6, notes: 'Rano na czczo' },
  { id: 'w_3', date: '2026-09-08', weight: 76.3, notes: 'Wzrost glikogenu po deloadzie' },
  { id: 'w_4', date: '2026-09-14', weight: 77.1, notes: 'Stabilny bilans +350 kcal' },
  { id: 'w_5', date: '2026-09-19', weight: 77.9, notes: 'Rano po dniu odpoczynku' },
  { id: 'w_6', date: '2026-09-24', weight: 78.4, notes: 'Aktualna masa ciała, brak retencji wody' },
];

