import { sql } from "@/lib/db"
import { type NextRequest, NextResponse } from "next/server"

export async function GET() {
  try {
    const result = await sql`
      SELECT * FROM users WHERE id = 1
    `

    if (result.length === 0) {
      // Return null if no user exists - frontend should handle profile creation
      return NextResponse.json(null)
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

    // Check if user exists
    const existing = await sql`SELECT id FROM users WHERE id = 1`
    
    if (existing.length === 0) {
      // Create new user if doesn't exist
      await sql`
        INSERT INTO users (name, age, height_cm, weight_kg, goal, protein_target, water_target_liters, steps_target, sleep_target_hours)
        VALUES (${name}, ${age}, ${height_cm}, ${weight_kg}, ${goal}, ${protein_target}, ${water_target_liters}, ${steps_target}, ${sleep_target_hours})
      `
    } else {
      // Update existing user
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
    }

    const updated = await sql`SELECT * FROM users WHERE id = 1`
    return NextResponse.json(updated[0])
  } catch (error) {
    console.error("Error updating user:", error)
    return NextResponse.json({ error: "Failed to update user" }, { status: 500 })
  }
}
