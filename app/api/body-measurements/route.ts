import { sql } from "@/lib/db"
import { executeWithRetry } from "@/lib/db-retry"
import { type NextRequest, NextResponse } from "next/server"

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const startDate = searchParams.get("startDate")
    const endDate = searchParams.get("endDate")
    const limit = searchParams.get("limit")

    let query
    if (startDate && endDate) {
      query = () => sql`
        SELECT * FROM body_measurements 
        WHERE user_id = 1 
        AND measurement_date BETWEEN ${startDate} AND ${endDate}
        ORDER BY measurement_date DESC
      `
    } else if (limit) {
      query = () => sql`
        SELECT * FROM body_measurements 
        WHERE user_id = 1 
        ORDER BY measurement_date DESC
        LIMIT ${parseInt(limit)}
      `
    } else {
      query = () => sql`
        SELECT * FROM body_measurements 
        WHERE user_id = 1 
        ORDER BY measurement_date DESC
      `
    }

    const result = await executeWithRetry(query, "Fetch body measurements")
    return NextResponse.json(result)
  } catch (error) {
    console.error("Error fetching body measurements:", error)
    return NextResponse.json({ error: "Failed to fetch body measurements" }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const {
      measurement_date,
      weight_kg,
      chest_cm,
      waist_cm,
      hips_cm,
      bicep_left_cm,
      bicep_right_cm,
      forearm_left_cm,
      forearm_right_cm,
      thigh_left_cm,
      thigh_right_cm,
      calf_left_cm,
      calf_right_cm,
      neck_cm,
      shoulders_cm,
      body_fat_percentage,
      notes,
    } = body

    const result = await executeWithRetry(
      () => sql`
        INSERT INTO body_measurements (
          user_id, measurement_date, weight_kg, chest_cm, waist_cm, hips_cm,
          bicep_left_cm, bicep_right_cm, forearm_left_cm, forearm_right_cm,
          thigh_left_cm, thigh_right_cm, calf_left_cm, calf_right_cm,
          neck_cm, shoulders_cm, body_fat_percentage, notes
        )
        VALUES (
          1, ${measurement_date}, ${weight_kg}, ${chest_cm}, ${waist_cm}, ${hips_cm},
          ${bicep_left_cm}, ${bicep_right_cm}, ${forearm_left_cm}, ${forearm_right_cm},
          ${thigh_left_cm}, ${thigh_right_cm}, ${calf_left_cm}, ${calf_right_cm},
          ${neck_cm}, ${shoulders_cm}, ${body_fat_percentage}, ${notes}
        )
        ON CONFLICT (user_id, measurement_date) 
        DO UPDATE SET
          weight_kg = EXCLUDED.weight_kg,
          chest_cm = EXCLUDED.chest_cm,
          waist_cm = EXCLUDED.waist_cm,
          hips_cm = EXCLUDED.hips_cm,
          bicep_left_cm = EXCLUDED.bicep_left_cm,
          bicep_right_cm = EXCLUDED.bicep_right_cm,
          forearm_left_cm = EXCLUDED.forearm_left_cm,
          forearm_right_cm = EXCLUDED.forearm_right_cm,
          thigh_left_cm = EXCLUDED.thigh_left_cm,
          thigh_right_cm = EXCLUDED.thigh_right_cm,
          calf_left_cm = EXCLUDED.calf_left_cm,
          calf_right_cm = EXCLUDED.calf_right_cm,
          neck_cm = EXCLUDED.neck_cm,
          shoulders_cm = EXCLUDED.shoulders_cm,
          body_fat_percentage = EXCLUDED.body_fat_percentage,
          notes = EXCLUDED.notes,
          updated_at = CURRENT_TIMESTAMP
        RETURNING *
      `,
      "Save body measurement"
    )

    return NextResponse.json(result[0])
  } catch (error) {
    console.error("Error saving body measurement:", error)
    return NextResponse.json({ error: "Failed to save body measurement" }, { status: 500 })
  }
}
