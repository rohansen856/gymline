import { sql } from "@/lib/db"
import { type NextRequest, NextResponse } from "next/server"

export async function GET(req: NextRequest) {
  try {
    const logDate = req.nextUrl.searchParams.get("date")

    if (logDate) {
      const result = await sql`
        SELECT * FROM food_quality_checklist WHERE user_id = 1 AND log_date = ${logDate}
      `
      return NextResponse.json(result[0] || null)
    }

    const result = await sql`
      SELECT * FROM food_quality_checklist WHERE user_id = 1 ORDER BY log_date DESC LIMIT 30
    `
    return NextResponse.json(result)
  } catch (error) {
    console.error("Error fetching food quality:", error)
    return NextResponse.json({ error: "Failed to fetch logs" }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { log_date, eggs_chicken_done, fruits_done, veggies_done, soft_drink_avoided, junk_controlled } = body

    const result = await sql`
      INSERT INTO food_quality_checklist (user_id, log_date, eggs_chicken_done, fruits_done, veggies_done, soft_drink_avoided, junk_controlled)
      VALUES (1, ${log_date}, ${eggs_chicken_done}, ${fruits_done}, ${veggies_done}, ${soft_drink_avoided}, ${junk_controlled})
      ON CONFLICT (user_id, log_date) DO UPDATE SET
        eggs_chicken_done = ${eggs_chicken_done},
        fruits_done = ${fruits_done},
        veggies_done = ${veggies_done},
        soft_drink_avoided = ${soft_drink_avoided},
        junk_controlled = ${junk_controlled},
        updated_at = CURRENT_TIMESTAMP
      RETURNING *
    `

    return NextResponse.json(result[0])
  } catch (error) {
    console.error("Error saving food quality:", error)
    return NextResponse.json({ error: "Failed to save log" }, { status: 500 })
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const logDate = req.nextUrl.searchParams.get("date")
    
    if (!logDate) {
      return NextResponse.json({ error: "Date required" }, { status: 400 })
    }

    await sql`
      DELETE FROM food_quality_checklist WHERE user_id = 1 AND log_date = ${logDate}
    `

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error deleting food quality log:", error)
    return NextResponse.json({ error: "Failed to delete log" }, { status: 500 })
  }
}
