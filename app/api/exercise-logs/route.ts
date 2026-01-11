import { sql } from "@/lib/db"
import { type NextRequest, NextResponse } from "next/server"

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { workout_log_id, exercise_name, set_number, weight, reps, rir } = body

    const result = await sql`
      INSERT INTO exercise_set_logs (workout_log_id, exercise_name, set_number, weight, reps, rir)
      VALUES (${workout_log_id}, ${exercise_name}, ${set_number}, ${weight}, ${reps}, ${rir})
      RETURNING *
    `

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
      const result = await sql`
        SELECT * FROM exercise_set_logs WHERE workout_log_id = ${workoutLogId} ORDER BY exercise_name, set_number
      `
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

    await sql`
      DELETE FROM exercise_set_logs WHERE id = ${id}
    `

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error deleting exercise log:", error)
    return NextResponse.json({ error: "Failed to delete log" }, { status: 500 })
  }
}
