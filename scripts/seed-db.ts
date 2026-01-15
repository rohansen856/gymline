import { neon } from "@neondatabase/serverless";

async function seedData() {
  try {
    console.log('🌱 Seeding database...');
    
    const sql = neon(process.env.DATABASE_URL!);
    
    // Create default user
    const user = await sql`
      INSERT INTO users (name, age, height_cm, weight_kg, goal, protein_target, water_target_liters, steps_target, sleep_target_hours)
      VALUES ('Rohan', 21, 180, 63.5, 'Athletic + Lean Strength', 140, 3, 8000, 7.5)
      ON CONFLICT (id) DO NOTHING
      RETURNING *
    `;
    
    if (user.length > 0) {
      console.log('✅ Default user created:', user[0].name);
    } else {
      console.log('ℹ️  Default user already exists');
    }
    
    console.log('\n✅ Database seeded successfully!');
    
  } catch (error) {
    console.error('❌ Database seeding failed:', error);
    process.exit(1);
  }
}

seedData();
