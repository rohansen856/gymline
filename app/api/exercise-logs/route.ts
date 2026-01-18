import { sql } from "@/lib/db"
import { executeWithRetry } from "@/lib/db-retry"
import { validateExerciseSetLog, ValidationError } from "@/lib/validation"
import { type NextRequest, NextResponse } from "next/server"

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    
    // Note: This API uses a different schema than validateExerciseSetLog expects
    // Manual validation for this specific structure
    const { workout_log_id, exercise_name, set_number, weight, reps, rir } = body

    // Basic validation
    if (!workout_log_id || typeof workout_log_id !== 'number') {
      return NextResponse.json(
        { error: "Workout log ID is required and must be a number", field: "workout_log_id" },
        { status: 400 }
      )
    }

    if (!exercise_name || typeof exercise_name !== 'string' || exercise_name.trim().length === 0) {
      return NextResponse.json(
        { error: "Exercise name is required", field: "exercise_name" },
        { status: 400 }
      )
    }

    if (!set_number || set_number < 1 || set_number > 20) {
      return NextResponse.json(
        { error: "Set number must be between 1 and 20", field: "set_number" },
        { status: 400 }
      )
    }

    if (reps !== undefined && reps !== null && (reps < 0 || reps > 500)) {
      return NextResponse.json(
        { error: "Reps must be between 0 and 500", field: "reps" },
        { status: 400 }
      )
    }

    if (weight !== undefined && weight !== null && (weight < 0 || weight > 500)) {
      return NextResponse.json(
        { error: "Weight must be between 0 and 500", field: "weight" },
        { status: 400 }
      )
    }

    if (rir !== undefined && rir !== null && (rir < 0 || rir > 10)) {
      return NextResponse.json(
        { error: "RIR must be between 0 and 10", field: "rir" },
        { status: 400 }
      )
    }

    const result = await executeWithRetry(
      () => sql`
        INSERT INTO exercise_set_logs (workout_log_id, exercise_name, set_number, weight, reps, rir)
        VALUES (${workout_log_id}, ${exercise_name}, ${set_number}, ${weight}, ${reps}, ${rir})
        RETURNING *
      `,
      "Save exercise log"
    )

    return NextResponse.json(result[0])
  } catch (error) {
    console.error("Error saving exercise log:", error)
    return NextResponse.json({ error: "Failed to save exercise" }, { status: 500 })
  }
}

export async function GET(req: NextRequest) {
  try {
    const workoutLogId = req.nextUrl.searchParams.get("workoutLogId")

    if (workoutLogId) {
      const result = await executeWithRetry(
        () => sql`
          SELECT * FROM exercise_set_logs WHERE workout_log_id = ${workoutLogId} ORDER BY exercise_name, set_number
        `,
        "Fetch exercise logs"
      )
      return NextResponse.json(result)
    }

    return NextResponse.json([])
  } catch (error) {
    console.error("Error fetching exercise logs:", error)
    return NextResponse.json({ error: "Failed to fetch logs" }, { status: 500 })
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const id = req.nextUrl.searchParams.get("id")
    
    if (!id) {
      return NextResponse.json({ error: "Exercise log ID required" }, { status: 400 })
    }

    await executeWithRetry(
      () => sql`
        DELETE FROM exercise_set_logs WHERE id = ${id}
      `,
      "Delete exercise log"
    )

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error deleting exercise log:", error)
    return NextResponse.json({ error: "Failed to delete log" }, { status: 500 })
  }
}
