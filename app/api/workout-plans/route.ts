import { sql } from "@/lib/db"
import { executeWithRetry } from "@/lib/db-retry"
import { type NextRequest, NextResponse } from "next/server"

export async function GET(req: NextRequest) {
  try {
    const userId = req.nextUrl.searchParams.get("userId") || "1"

    // Fetch workout plans with exercises
    const workoutPlans = await executeWithRetry(
      () => sql`
        SELECT * FROM workout_plans WHERE user_id = ${userId} ORDER BY day_of_week
      `,
      "Fetch workout plans"
    )

    // Fetch all exercises for these workout plans
    const workoutPlanIds = workoutPlans.map((plan: any) => plan.id)
    
    if (workoutPlanIds.length === 0) {
      return NextResponse.json([])
    }

    const exercises = await executeWithRetry(
      () => sql`
        SELECT * FROM exercises 
        WHERE workout_plan_id = ANY(${workoutPlanIds})
        ORDER BY workout_plan_id, order_index
      `,
      "Fetch exercises"
    )

    // Combine workout plans with their exercises
    const result = workoutPlans.map((plan: any) => ({
      ...plan,
      exercises: exercises.filter((ex: any) => ex.workout_plan_id === plan.id)
    }))

    return NextResponse.json(result)
  } catch (error) {
    console.error("Error fetching workout plans:", error)
    return NextResponse.json({ error: "Failed to fetch workout plans" }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { user_id, day_of_week, day_name, workout_type } = body

    const result = await executeWithRetry(
      () => sql`
        INSERT INTO workout_plans (user_id, day_of_week, day_name, workout_type)
        VALUES (${user_id || 1}, ${day_of_week}, ${day_name}, ${workout_type})
        RETURNING *
      `,
      "Create workout plan"
    )

    return NextResponse.json(result[0])
  } catch (error) {
    console.error("Error creating workout plan:", error)
    return NextResponse.json({ error: "Failed to create workout plan" }, { status: 500 })
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const id = req.nextUrl.searchParams.get("id")
    
    if (!id) {
      return NextResponse.json({ error: "Workout plan ID required" }, { status: 400 })
    }

    await executeWithRetry(
      () => sql`
        DELETE FROM workout_plans WHERE id = ${id}
      `,
      "Delete workout plan"
    )

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error deleting workout plan:", error)
    return NextResponse.json({ error: "Failed to delete workout plan" }, { status: 500 })
  }
}
