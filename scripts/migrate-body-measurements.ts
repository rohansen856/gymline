import { sql } from "@/lib/db"
import * as fs from "fs"
import * as path from "path"

async function runMigration() {
  try {
    console.log("Running body measurements migration...")

    const migrationSQL = fs.readFileSync(
      path.join(process.cwd(), "scripts", "02-body-measurements.sql"),
      "utf-8"
    )

    // Split by semicolons and execute each statement
    const statements = migrationSQL
      .split(";")
      .map((s) => s.trim())
      .filter((s) => s.length > 0)

    for (const statement of statements) {
      console.log(`Executing: ${statement.substring(0, 50)}...`)
      await sql.unsafe(statement)
    }

    console.log("✓ Body measurements table created successfully!")

    // Check if table exists
    const tables = await sql`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public' 
      AND table_name = 'body_measurements'
    `
    
    if (tables.length > 0) {
      console.log("✓ Verified: body_measurements table exists")
    } else {
      console.log("⚠ Warning: body_measurements table not found")
    }

    process.exit(0)
  } catch (error) {
    console.error("Error running migration:", error)
    process.exit(1)
  }
}

runMigration()
