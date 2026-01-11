import { sql } from "@/lib/db"
import { type NextRequest, NextResponse } from "next/server"

export async function GET(req: NextRequest) {
  try {
    const userId = 1
    const days = Number.parseInt(req.nextUrl.searchParams.get("days") || "7")

    // Get workout completion stats
    const workoutStats = await sql`
      SELECT COUNT(*) as total_workouts
      FROM workout_logs
      WHERE user_id = ${userId}
      AND log_date >= CURRENT_DATE - INTERVAL '${days} days'
    `

    // Get habit adherence stats
    const habitStats = await sql`
      SELECT 
        COUNT(*) as total_logs,
        SUM(CASE WHEN protein_done THEN 1 ELSE 0 END) as protein_days,
        SUM(CASE WHEN water_done THEN 1 ELSE 0 END) as water_days,
        SUM(CASE WHEN steps_done THEN 1 ELSE 0 END) as steps_days,
        AVG(sleep_hours) as avg_sleep,
        AVG(body_weight_kg) as avg_weight
      FROM daily_habit_logs
      WHERE user_id = ${userId}
      AND log_date >= CURRENT_DATE - INTERVAL '${days} days'
    `

    // Get food quality stats
    const foodStats = await sql`
      SELECT 
        COUNT(*) as total_logs,
        SUM(CASE WHEN eggs_chicken_done THEN 1 ELSE 0 END) as eggs_chicken_days,
        SUM(CASE WHEN fruits_done THEN 1 ELSE 0 END) as fruits_days,
        SUM(CASE WHEN veggies_done THEN 1 ELSE 0 END) as veggies_days,
        SUM(CASE WHEN soft_drink_avoided THEN 1 ELSE 0 END) as soft_drink_avoided_days,
        SUM(CASE WHEN junk_controlled THEN 1 ELSE 0 END) as junk_controlled_days
      FROM food_quality_checklist
      WHERE user_id = ${userId}
      AND log_date >= CURRENT_DATE - INTERVAL '${days} days'
    `

    // Get recent weight trend
    const weightTrend = await sql`
      SELECT log_date, body_weight_kg
      FROM daily_habit_logs
      WHERE user_id = ${userId}
      AND body_weight_kg IS NOT NULL
      ORDER BY log_date DESC
      LIMIT ${days}
    `

    return NextResponse.json({
      workout_stats: workoutStats[0],
      habit_stats: habitStats[0],
      food_stats: foodStats[0],
      weight_trend: weightTrend,
    })
  } catch (error) {
    console.error("Error fetching stats:", error)
    return NextResponse.json({ error: "Failed to fetch stats" }, { status: 500 })
  }
}
