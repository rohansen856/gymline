import { sql } from "@/lib/db"
import { executeWithRetry } from "@/lib/db-retry"
import { validateDailyHabit, ValidationError } from "@/lib/validation"
import { type NextRequest, NextResponse } from "next/server"

export async function GET(req: NextRequest) {
  try {
    const logDate = req.nextUrl.searchParams.get("date")

    if (logDate) {
      const result = await executeWithRetry(
        () => sql`
          SELECT * FROM daily_habit_logs WHERE user_id = 1 AND log_date = ${logDate}
        `,
        "Fetch daily habits by date"
      )
      return NextResponse.json(result[0] || null)
    }

    const result = await executeWithRetry(
      () => sql`
        SELECT * FROM daily_habit_logs WHERE user_id = 1 ORDER BY log_date DESC LIMIT 30
      `,
      "Fetch daily habits"
    )
    return NextResponse.json(result)
  } catch (error) {
    console.error("Error fetching habit logs:", error)
    return NextResponse.json({ error: "Failed to fetch logs" }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    
    // Validate input
    const validatedData = validateDailyHabit(body)
    const { log_date, body_weight_kg, protein_done, water_done, steps_done, cardio_done, sleep_hours, notes } = validatedData

    const result = await executeWithRetry(
      () => sql`
        INSERT INTO daily_habit_logs (user_id, log_date, body_weight_kg, protein_done, water_done, steps_done, cardio_done, sleep_hours, notes)
        VALUES (1, ${log_date}, ${body_weight_kg}, ${protein_done}, ${water_done}, ${steps_done}, ${cardio_done}, ${sleep_hours}, ${notes})
        ON CONFLICT (user_id, log_date) DO UPDATE SET
          body_weight_kg = ${body_weight_kg},
          protein_done = ${protein_done},
          water_done = ${water_done},
          steps_done = ${steps_done},
          cardio_done = ${cardio_done},
          sleep_hours = ${sleep_hours},
          notes = ${notes},
          updated_at = CURRENT_TIMESTAMP
        RETURNING *
      `,
      "Save daily habit log"
    )

    return NextResponse.json(result[0])
  } catch (error) {
    if (error instanceof ValidationError) {
      return NextResponse.json(
        { error: error.message, field: error.field, code: error.code },
        { status: 400 }
      )
    }
    console.error("Error saving habit log:", error)
    return NextResponse.json({ error: "Failed to save log" }, { status: 500 })
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const logDate = req.nextUrl.searchParams.get("date")
    
    if (!logDate) {
      return NextResponse.json({ error: "Date required" }, { status: 400 })
    }

    await executeWithRetry(
      () => sql`
        DELETE FROM daily_habit_logs WHERE user_id = 1 AND log_date = ${logDate}
      `,
      "Delete daily habit log"
    )

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error deleting habit log:", error)
    return NextResponse.json({ error: "Failed to delete log" }, { status: 500 })
  }
}
