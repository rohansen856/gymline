import { sql } from "@/lib/db"
import { type NextRequest, NextResponse } from "next/server"

export async function GET(req: NextRequest) {
  try {
    const workoutPlanId = req.nextUrl.searchParams.get("workoutPlanId")

    if (workoutPlanId) {
      const result = await sql`
        SELECT * FROM exercises WHERE workout_plan_id = ${workoutPlanId} ORDER BY order_index
      `
      return NextResponse.json(result)
    }

    const result = await sql`
      SELECT * FROM exercises ORDER BY workout_plan_id, order_index
    `
    return NextResponse.json(result)
  } catch (error) {
    console.error("Error fetching exercises:", error)
    return NextResponse.json({ error: "Failed to fetch exercises" }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { workout_plan_id, name, sets_target, reps_target, notes, order_index } = body

    const result = await sql`
      INSERT INTO exercises (workout_plan_id, name, sets_target, reps_target, notes, order_index)
      VALUES (${workout_plan_id}, ${name}, ${sets_target}, ${reps_target}, ${notes || null}, ${order_index || 0})
      RETURNING *
    `

    return NextResponse.json(result[0])
  } catch (error) {
    console.error("Error creating exercise:", error)
    return NextResponse.json({ error: "Failed to create exercise" }, { status: 500 })
  }
}

export async function PUT(req: NextRequest) {
  try {
    const body = await req.json()
    const { id, name, sets_target, reps_target, notes, order_index } = body

    if (!id) {
      return NextResponse.json({ error: "Exercise ID required" }, { status: 400 })
    }

    const result = await sql`
      UPDATE exercises SET
        name = ${name},
        sets_target = ${sets_target},
        reps_target = ${reps_target},
        notes = ${notes || null},
        order_index = ${order_index || 0}
      WHERE id = ${id}
      RETURNING *
    `

    return NextResponse.json(result[0])
  } catch (error) {
    console.error("Error updating exercise:", error)
    return NextResponse.json({ error: "Failed to update exercise" }, { status: 500 })
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const id = req.nextUrl.searchParams.get("id")
    
    if (!id) {
      return NextResponse.json({ error: "Exercise ID required" }, { status: 400 })
    }

    await sql`
      DELETE FROM exercises WHERE id = ${id}
    `

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error deleting exercise:", error)
    return NextResponse.json({ error: "Failed to delete exercise" }, { status: 500 })
  }
}
