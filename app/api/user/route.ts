import { sql } from "@/lib/db"
import { type NextRequest, NextResponse } from "next/server"

export async function GET() {
  try {
    // Get or create default user
    const result = await sql`
      SELECT * FROM users WHERE id = 1
    `

    if (result.length === 0) {
      // Create default user
      await sql`
        INSERT INTO users (name, age, height_cm, weight_kg, goal, protein_target, water_target_liters, steps_target, sleep_target_hours)
        VALUES ('Alex', 28, 180, 75, 'Athletic + Lean Strength', 140, 3, 8000, 7.5)
      `

      const newUser = await sql`SELECT * FROM users WHERE id = 1`
      return NextResponse.json(newUser[0])
    }

    return NextResponse.json(result[0])
  } catch (error) {
    console.error("Error fetching user:", error)
    return NextResponse.json({ error: "Failed to fetch user" }, { status: 500 })
  }
}

export async function PUT(req: NextRequest) {
  try {
    const body = await req.json()
    const {
      name,
      age,
      height_cm,
      weight_kg,
      goal,
      protein_target,
      water_target_liters,
      steps_target,
      sleep_target_hours,
    } = body

    await sql`
      UPDATE users SET
        name = ${name},
        age = ${age},
        height_cm = ${height_cm},
        weight_kg = ${weight_kg},
        goal = ${goal},
        protein_target = ${protein_target},
        water_target_liters = ${water_target_liters},
        steps_target = ${steps_target},
        sleep_target_hours = ${sleep_target_hours},
        updated_at = CURRENT_TIMESTAMP
      WHERE id = 1
    `

    const updated = await sql`SELECT * FROM users WHERE id = 1`
    return NextResponse.json(updated[0])
  } catch (error) {
    console.error("Error updating user:", error)
    return NextResponse.json({ error: "Failed to update user" }, { status: 500 })
  }
}
