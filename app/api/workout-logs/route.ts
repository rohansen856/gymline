import { sql } from "@/lib/db"
import { executeWithRetry } from "@/lib/db-retry"
import { type NextRequest, NextResponse } from "next/server"

export async function GET(req: NextRequest) {
  try {
    const logDate = req.nextUrl.searchParams.get("date")

    if (logDate) {
      const result = await executeWithRetry(
        () => sql`
          SELECT * FROM workout_logs WHERE user_id = 1 AND log_date = ${logDate}
        `,
        "Fetch workout log by date"
      )
      return NextResponse.json(result[0] || null)
    }

    const result = await executeWithRetry(
      () => sql`
        SELECT * FROM workout_logs WHERE user_id = 1 ORDER BY log_date DESC LIMIT 30
      `,
      "Fetch workout logs"
    )
    return NextResponse.json(result)
  } catch (error) {
    console.error("Error fetching workout logs:", error)
    return NextResponse.json({ error: "Failed to fetch logs" }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { log_date, day_type, cardio_done, cardio_duration_min, notes } = body

    const result = await executeWithRetry(
      () => sql`
        INSERT INTO workout_logs (user_id, log_date, day_type, cardio_done, cardio_duration_min, notes)
        VALUES (1, ${log_date}, ${day_type}, ${cardio_done}, ${cardio_duration_min}, ${notes})
        ON CONFLICT (user_id, log_date) DO UPDATE SET
          day_type = ${day_type},
          cardio_done = ${cardio_done},
          cardio_duration_min = ${cardio_duration_min},
          notes = ${notes},
          updated_at = CURRENT_TIMESTAMP
        RETURNING *
      `,
      "Save workout log"
    )

    return NextResponse.json(result[0])
  } catch (error) {
    console.error("Error saving workout log:", error)
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
        DELETE FROM workout_logs WHERE user_id = 1 AND log_date = ${logDate}
      `,
      "Delete workout log"
    )

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error deleting workout log:", error)
    return NextResponse.json({ error: "Failed to delete log" }, { status: 500 })
  }
}
