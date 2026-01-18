/**
 * Validation utilities for input sanitization and validation
 */

export class ValidationError extends Error {
  constructor(
    message: string,
    public field?: string,
    public code?: string
  ) {
    super(message)
    this.name = "ValidationError"
  }
}

/**
 * Validate required fields
 */
export function validateRequired<T>(
  value: T,
  fieldName: string
): asserts value is NonNullable<T> {
  if (value === null || value === undefined || value === "") {
    throw new ValidationError(`${fieldName} is required`, fieldName, "REQUIRED")
  }
}

/**
 * Validate number range
 */
export function validateNumber(
  value: any,
  fieldName: string,
  options: {
    min?: number
    max?: number
    required?: boolean
    allowNull?: boolean
  } = {}
): number | null {
  // Handle null/undefined
  if (value === null || value === undefined || value === "") {
    if (options.required) {
      throw new ValidationError(`${fieldName} is required`, fieldName, "REQUIRED")
    }
    if (options.allowNull) {
      return null
    }
    throw new ValidationError(`${fieldName} must be a valid number`, fieldName, "INVALID_TYPE")
  }

  const num = typeof value === "string" ? parseFloat(value) : value

  if (isNaN(num) || !isFinite(num)) {
    throw new ValidationError(`${fieldName} must be a valid number`, fieldName, "INVALID_NUMBER")
  }

  if (options.min !== undefined && num < options.min) {
    throw new ValidationError(
      `${fieldName} must be at least ${options.min}`,
      fieldName,
      "MIN_VALUE"
    )
  }

  if (options.max !== undefined && num > options.max) {
    throw new ValidationError(
      `${fieldName} must be at most ${options.max}`,
      fieldName,
      "MAX_VALUE"
    )
  }

  return num
}

/**
 * Validate date string (YYYY-MM-DD format)
 */
export function validateDate(
  value: any,
  fieldName: string,
  options: {
    required?: boolean
    minDate?: Date
    maxDate?: Date
  } = {}
): string {
  if (!value) {
    if (options.required) {
      throw new ValidationError(`${fieldName} is required`, fieldName, "REQUIRED")
    }
    return ""
  }

  const dateRegex = /^\d{4}-\d{2}-\d{2}$/
  if (!dateRegex.test(value)) {
    throw new ValidationError(
      `${fieldName} must be in YYYY-MM-DD format`,
      fieldName,
      "INVALID_DATE_FORMAT"
    )
  }

  const date = new Date(value)
  if (isNaN(date.getTime())) {
    throw new ValidationError(`${fieldName} must be a valid date`, fieldName, "INVALID_DATE")
  }

  if (options.minDate && date < options.minDate) {
    throw new ValidationError(
      `${fieldName} must be after ${options.minDate.toISOString().split("T")[0]}`,
      fieldName,
      "DATE_TOO_EARLY"
    )
  }

  if (options.maxDate && date > options.maxDate) {
    throw new ValidationError(
      `${fieldName} must be before ${options.maxDate.toISOString().split("T")[0]}`,
      fieldName,
      "DATE_TOO_LATE"
    )
  }

  return value
}

/**
 * Validate boolean value
 */
export function validateBoolean(
  value: any,
  fieldName: string,
  options: { required?: boolean } = {}
): boolean {
  if (value === null || value === undefined) {
    if (options.required) {
      throw new ValidationError(`${fieldName} is required`, fieldName, "REQUIRED")
    }
    return false
  }

  if (typeof value === "boolean") {
    return value
  }

  if (typeof value === "string") {
    const lower = value.toLowerCase()
    if (lower === "true" || lower === "1") return true
    if (lower === "false" || lower === "0") return false
  }

  if (typeof value === "number") {
    return value !== 0
  }

  throw new ValidationError(`${fieldName} must be a boolean value`, fieldName, "INVALID_BOOLEAN")
}

/**
 * Validate string length
 */
export function validateString(
  value: any,
  fieldName: string,
  options: {
    required?: boolean
    minLength?: number
    maxLength?: number
    pattern?: RegExp
    trim?: boolean
  } = {}
): string {
  if (value === null || value === undefined || value === "") {
    if (options.required) {
      throw new ValidationError(`${fieldName} is required`, fieldName, "REQUIRED")
    }
    return ""
  }

  let str = String(value)
  if (options.trim !== false) {
    str = str.trim()
  }

  if (options.minLength !== undefined && str.length < options.minLength) {
    throw new ValidationError(
      `${fieldName} must be at least ${options.minLength} characters`,
      fieldName,
      "MIN_LENGTH"
    )
  }

  if (options.maxLength !== undefined && str.length > options.maxLength) {
    throw new ValidationError(
      `${fieldName} must be at most ${options.maxLength} characters`,
      fieldName,
      "MAX_LENGTH"
    )
  }

  if (options.pattern && !options.pattern.test(str)) {
    throw new ValidationError(`${fieldName} has an invalid format`, fieldName, "INVALID_FORMAT")
  }

  return str
}

/**
 * Body Measurements Validation Schema
 */
export function validateBodyMeasurement(data: any) {
  return {
    measurement_date: validateDate(data.measurement_date, "Measurement date", {
      required: true,
      maxDate: new Date(),
    }),
    weight_kg: validateNumber(data.weight_kg, "Weight", {
      min: 20,
      max: 300,
      allowNull: true,
    }),
    body_fat_percentage: validateNumber(data.body_fat_percentage, "Body fat percentage", {
      min: 1,
      max: 60,
      allowNull: true,
    }),
    chest_cm: validateNumber(data.chest_cm, "Chest", { min: 30, max: 200, allowNull: true }),
    waist_cm: validateNumber(data.waist_cm, "Waist", { min: 30, max: 200, allowNull: true }),
    hips_cm: validateNumber(data.hips_cm, "Hips", { min: 30, max: 200, allowNull: true }),
    bicep_left_cm: validateNumber(data.bicep_left_cm, "Left bicep", {
      min: 10,
      max: 80,
      allowNull: true,
    }),
    bicep_right_cm: validateNumber(data.bicep_right_cm, "Right bicep", {
      min: 10,
      max: 80,
      allowNull: true,
    }),
    forearm_left_cm: validateNumber(data.forearm_left_cm, "Left forearm", {
      min: 10,
      max: 60,
      allowNull: true,
    }),
    forearm_right_cm: validateNumber(data.forearm_right_cm, "Right forearm", {
      min: 10,
      max: 60,
      allowNull: true,
    }),
    thigh_left_cm: validateNumber(data.thigh_left_cm, "Left thigh", {
      min: 20,
      max: 100,
      allowNull: true,
    }),
    thigh_right_cm: validateNumber(data.thigh_right_cm, "Right thigh", {
      min: 20,
      max: 100,
      allowNull: true,
    }),
    calf_left_cm: validateNumber(data.calf_left_cm, "Left calf", {
      min: 15,
      max: 80,
      allowNull: true,
    }),
    calf_right_cm: validateNumber(data.calf_right_cm, "Right calf", {
      min: 15,
      max: 80,
      allowNull: true,
    }),
    neck_cm: validateNumber(data.neck_cm, "Neck", { min: 20, max: 80, allowNull: true }),
    shoulders_cm: validateNumber(data.shoulders_cm, "Shoulders", {
      min: 30,
      max: 200,
      allowNull: true,
    }),
    notes: validateString(data.notes, "Notes", { maxLength: 500, required: false }),
  }
}

/**
 * Daily Habits Validation Schema
 */
export function validateDailyHabit(data: any) {
  return {
    log_date: validateDate(data.log_date, "Log date", {
      required: true,
      maxDate: new Date(),
    }),
    body_weight_kg: validateNumber(data.body_weight_kg, "Body weight", {
      min: 20,
      max: 300,
      allowNull: true,
    }),
    protein_done: validateBoolean(data.protein_done, "Protein completed"),
    water_done: validateBoolean(data.water_done, "Water completed"),
    steps_done: validateBoolean(data.steps_done, "Steps completed"),
    cardio_done: validateBoolean(data.cardio_done, "Cardio completed"),
    sleep_hours: validateNumber(data.sleep_hours, "Sleep hours", {
      min: 0,
      max: 24,
      allowNull: true,
    }),
    notes: validateString(data.notes, "Notes", { maxLength: 500, required: false }),
  }
}

/**
 * Workout Log Validation Schema
 */
export function validateWorkoutLog(data: any) {
  return {
    log_date: validateDate(data.log_date, "Log date", {
      required: true,
      maxDate: new Date(),
    }),
    day_type: validateString(data.day_type, "Day type", {
      required: false,
      maxLength: 50,
    }),
    cardio_done: validateBoolean(data.cardio_done, "Cardio completed"),
    cardio_duration_min: validateNumber(data.cardio_duration_min, "Cardio duration", {
      min: 0,
      max: 480,
      allowNull: true,
    }),
    notes: validateString(data.notes, "Notes", { maxLength: 500, required: false }),
  }
}

/**
 * Food Quality Validation Schema
 */
export function validateFoodQuality(data: any) {
  return {
    log_date: validateDate(data.log_date, "Log date", {
      required: true,
      maxDate: new Date(),
    }),
    eggs_chicken_done: validateBoolean(data.eggs_chicken_done, "Eggs/chicken completed"),
    fruits_done: validateBoolean(data.fruits_done, "Fruits completed"),
    veggies_done: validateBoolean(data.veggies_done, "Veggies completed"),
    soft_drink_avoided: validateBoolean(data.soft_drink_avoided, "Soft drinks avoided"),
    junk_controlled: validateBoolean(data.junk_controlled, "Junk food controlled"),
  }
}

/**
 * Exercise Set Log Validation Schema
 */
export function validateExerciseSetLog(data: any) {
  return {
    workout_log_id: validateNumber(data.workout_log_id, "Workout log ID", {
      required: true,
      min: 1,
    }),
    exercise_id: validateNumber(data.exercise_id, "Exercise ID", {
      required: true,
      min: 1,
    }),
    set_number: validateNumber(data.set_number, "Set number", {
      required: true,
      min: 1,
      max: 20,
    }),
    reps_completed: validateNumber(data.reps_completed, "Reps completed", {
      required: true,
      min: 0,
      max: 500,
    }),
    weight_kg: validateNumber(data.weight_kg, "Weight", {
      min: 0,
      max: 500,
      allowNull: true,
    }),
    notes: validateString(data.notes, "Notes", { maxLength: 200, required: false }),
  }
}
