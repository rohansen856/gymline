export interface UserProfile {
  id: number
  name: string
  age?: number
  height_cm?: number
  weight_kg?: number
  goal?: string
  protein_target: number
  water_target_liters: number
  steps_target: number
  sleep_target_hours: number
  proteinTarget: number
  waterTargetLiters: number
  stepsTarget: number
  sleepTargetHours: number
}

export interface WorkoutPlan {
  id: number
  dayOfWeek: number
  dayName: string
  workoutType: string
  exercises: Exercise[]
}

export interface Exercise {
  id: number
  name: string
  setsTarget: number
  repsTarget: string
  notes?: string
}

export interface WorkoutLog {
  id: number
  logDate: string
  dayType: string
  exercises: ExerciseSetLog[]
  cardioDone: boolean
  cardioDurationMin?: number
  notes?: string
}

export interface ExerciseSetLog {
  id: number
  exerciseName: string
  sets: SetRecord[]
}

export interface SetRecord {
  weight: number
  reps: number
  rir?: number
}

export interface DailyHabitLog {
  id: number
  logDate: string
  bodyWeightKg?: number
  proteinDone: boolean
  waterDone: boolean
  stepsDone: boolean
  cardioDone: boolean
  sleepHours?: number
  notes?: string
}

export interface FoodQualityChecklist {
  id: number
  logDate: string
  eggsChickenDone: boolean
  fruitsDone: boolean
  veggiesDone: boolean
  softDrinkAvoided: boolean
  junkControlled: boolean
}
