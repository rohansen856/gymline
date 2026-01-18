import { sql } from "@/lib/db"
import { executeWithRetry } from "@/lib/db-retry"
import { validateString, validateNumber, ValidationError } from "@/lib/validation"
import { type NextRequest, NextResponse } from "next/server"

export async function GET() {
  try {
    const result = await executeWithRetry(
      () => sql`
        SELECT * FROM users WHERE id = 1
      `,
      "Fetch user"
    )

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
    
    // Validate user input
    const name = validateString(body.name, "Name", { required: true, minLength: 1, maxLength: 100 })
    const age = validateNumber(body.age, "Age", { min: 10, max: 120, allowNull: true })
    const height_cm = validateNumber(body.height_cm, "Height", { min: 50, max: 300, allowNull: true })
    const weight_kg = validateNumber(body.weight_kg, "Weight", { min: 20, max: 300, allowNull: true })
    const goal = validateString(body.goal, "Goal", { maxLength: 200, required: false })
    const protein_target = validateNumber(body.protein_target, "Protein target", { min: 0, max: 500, allowNull: true })
    const water_target_liters = validateNumber(body.water_target_liters, "Water target", { min: 0, max: 20, allowNull: true })
    const steps_target = validateNumber(body.steps_target, "Steps target", { min: 0, max: 100000, allowNull: true })
    const sleep_target_hours = validateNumber(body.sleep_target_hours, "Sleep target", { min: 0, max: 24, allowNull: true })

    // Check if user exists
    const existing = await executeWithRetry(
      () => sql`SELECT id FROM users WHERE id = 1`,
      "Check existing user"
    )
    
    if (existing.length === 0) {
      // Create new user if doesn't exist
      await executeWithRetry(
        () => sql`
          INSERT INTO users (name, age, height_cm, weight_kg, goal, protein_target, water_target_liters, steps_target, sleep_target_hours)
          VALUES (${name}, ${age}, ${height_cm}, ${weight_kg}, ${goal}, ${protein_target}, ${water_target_liters}, ${steps_target}, ${sleep_target_hours})
        `,
        "Create user"
      )
    } else {
      // Update existing user
      await executeWithRetry(
        () => sql`
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
        `,
        "Update user"
      )
    }

    const updated = await executeWithRetry(
      () => sql`SELECT * FROM users WHERE id = 1`,
      "Fetch updated user"
    )
    return NextResponse.json(updated[0])
  } catch (error) {
    if (error instanceof ValidationError) {
      return NextResponse.json(
        { error: error.message, field: error.field, code: error.code },
        { status: 400 }
      )
    }
    console.error("Error updating user:", error)
    return NextResponse.json({ error: "Failed to update user" }, { status: 500 })
  }
}
