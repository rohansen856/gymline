import { neon } from "@neondatabase/serverless";
import dotenv from "dotenv";

// Load environment variables
dotenv.config();

async function seedWorkoutPlans() {
  try {
    console.log('🏋️ Seeding workout plans...');
    
    if (!process.env.DATABASE_URL) {
      console.error('❌ DATABASE_URL environment variable is not set!');
      process.exit(1);
    }
    
    const sql = neon(process.env.DATABASE_URL);

    // First, ensure user exists
    await sql`
      INSERT INTO users (id, name, age, height_cm, weight_kg, goal, protein_target, water_target_liters, steps_target, sleep_target_hours)
      VALUES (1, 'User', 25, 170, 70, 'Athletic + Lean Strength + Chest/Arms', 140, 3, 8000, 7.5)
      ON CONFLICT (id) DO UPDATE SET
        goal = 'Athletic + Lean Strength + Chest/Arms',
        protein_target = 140,
        water_target_liters = 3,
        steps_target = 8000,
        sleep_target_hours = 7.5
    `;

    // Delete existing workout plans for user 1
    await sql`DELETE FROM exercises WHERE workout_plan_id IN (SELECT id FROM workout_plans WHERE user_id = 1)`;
    await sql`DELETE FROM workout_plans WHERE user_id = 1`;

    // MONDAY - Upper Strength (Chest/Back)
    const mondayPlan = await sql`
      INSERT INTO workout_plans (user_id, day_of_week, day_name, workout_type)
      VALUES (1, 1, 'Monday', 'Upper Strength (Chest/Back)')
      RETURNING id
    `;
    const mondayId = mondayPlan[0].id;
    
    await sql`
      INSERT INTO exercises (workout_plan_id, name, sets_target, reps_target, order_index) VALUES
      (${mondayId}, 'Bench Press', 5, '5', 1),
      (${mondayId}, 'Pullups/Lat Pulldown', 4, '8-10', 2),
      (${mondayId}, 'Incline DB Press', 4, '8-10', 3),
      (${mondayId}, 'Barbell Row', 4, '8-10', 4),
      (${mondayId}, 'Cable Fly', 3, '12-15', 5),
      (${mondayId}, 'Rope Pushdown', 3, '12-15', 6)
    `;

    // TUESDAY - Lower Strength + Core
    const tuesdayPlan = await sql`
      INSERT INTO workout_plans (user_id, day_of_week, day_name, workout_type)
      VALUES (1, 2, 'Tuesday', 'Lower Strength + Core')
      RETURNING id
    `;
    const tuesdayId = tuesdayPlan[0].id;
    
    await sql`
      INSERT INTO exercises (workout_plan_id, name, sets_target, reps_target, order_index) VALUES
      (${tuesdayId}, 'Squat', 5, '5', 1),
      (${tuesdayId}, 'RDL', 4, '8-10', 2),
      (${tuesdayId}, 'Leg Press', 3, '12-15', 3),
      (${tuesdayId}, 'Walking Lunges', 2, '12-15 each', 4),
      (${tuesdayId}, 'Calf Raises', 4, '15-20', 5),
      (${tuesdayId}, 'Hanging Leg Raise', 3, '12-15', 6),
      (${tuesdayId}, 'Cable Crunch', 3, '15-20', 7)
    `;

    // WEDNESDAY - Rest/Active Recovery
    const wednesdayPlan = await sql`
      INSERT INTO workout_plans (user_id, day_of_week, day_name, workout_type)
      VALUES (1, 3, 'Wednesday', 'Rest / Active Recovery')
      RETURNING id
    `;
    const wednesdayId = wednesdayPlan[0].id;
    
    await sql`
      INSERT INTO exercises (workout_plan_id, name, sets_target, reps_target, notes, order_index) VALUES
      (${wednesdayId}, 'Steps / Walk', 1, '6k-10k', 'Light activity', 1),
      (${wednesdayId}, 'Mobility Work', 1, '15-20 min', 'Stretching and foam rolling', 2)
    `;

    // THURSDAY - Push Hypertrophy (Chest Priority)
    const thursdayPlan = await sql`
      INSERT INTO workout_plans (user_id, day_of_week, day_name, workout_type)
      VALUES (1, 4, 'Thursday', 'Push Hypertrophy (Chest Priority)')
      RETURNING id
    `;
    const thursdayId = thursdayPlan[0].id;
    
    await sql`
      INSERT INTO exercises (workout_plan_id, name, sets_target, reps_target, order_index) VALUES
      (${thursdayId}, 'Incline Bench', 4, '8-10', 1),
      (${thursdayId}, 'Flat DB Press', 4, '10-12', 2),
      (${thursdayId}, 'Dips', 3, '10-12', 3),
      (${thursdayId}, 'Lateral Raises', 5, '12-15', 4),
      (${thursdayId}, 'Rear Delt Fly', 3, '15-20', 5),
      (${thursdayId}, 'OH Tricep Extension', 3, '12-15', 6),
      (${thursdayId}, 'Rope Pushdown', 2, '15-20', 7)
    `;

    // FRIDAY - Pull Hypertrophy
    const fridayPlan = await sql`
      INSERT INTO workout_plans (user_id, day_of_week, day_name, workout_type)
      VALUES (1, 5, 'Friday', 'Pull Hypertrophy')
      RETURNING id
    `;
    const fridayId = fridayPlan[0].id;
    
    await sql`
      INSERT INTO exercises (workout_plan_id, name, sets_target, reps_target, order_index) VALUES
      (${fridayId}, 'Deadlift', 4, '4', 1),
      (${fridayId}, 'Seated Cable Row', 4, '10-12', 2),
      (${fridayId}, 'Wide Lat Pulldown', 4, '10-12', 3),
      (${fridayId}, 'Face Pulls', 3, '15-20', 4),
      (${fridayId}, 'EZ Bar Curl', 3, '10-12', 5),
      (${fridayId}, 'Hammer Curl', 3, '10-12', 6)
    `;

    // SATURDAY - Arms + Conditioning
    const saturdayPlan = await sql`
      INSERT INTO workout_plans (user_id, day_of_week, day_name, workout_type)
      VALUES (1, 6, 'Saturday', 'Arms + Conditioning')
      RETURNING id
    `;
    const saturdayId = saturdayPlan[0].id;
    
    await sql`
      INSERT INTO exercises (workout_plan_id, name, sets_target, reps_target, order_index) VALUES
      (${saturdayId}, 'Close-Grip Bench', 4, '8-10', 1),
      (${saturdayId}, 'Incline DB Curl', 4, '10-12', 2),
      (${saturdayId}, 'Cable Pushdown', 3, '12-15', 3),
      (${saturdayId}, 'Preacher/Machine Curl', 3, '12-15', 4),
      (${saturdayId}, 'Cable Fly', 3, '12-15', 5),
      (${saturdayId}, 'Lateral Raise', 3, '15-20', 6)
    `;

    // SUNDAY - Full Rest
    const sundayPlan = await sql`
      INSERT INTO workout_plans (user_id, day_of_week, day_name, workout_type)
      VALUES (1, 0, 'Sunday', 'Full Rest')
      RETURNING id
    `;
    const sundayId = sundayPlan[0].id;
    
    await sql`
      INSERT INTO exercises (workout_plan_id, name, sets_target, reps_target, notes, order_index) VALUES
      (${sundayId}, 'Recovery', 1, 'All day', 'Complete rest day', 1),
      (${sundayId}, 'Stretching', 1, '10-15 min', 'Light stretching if needed', 2)
    `;

    console.log('✅ Workout plans seeded successfully!');
    console.log('📊 Created 7 workout plans with exercises for:');
    console.log('   - Monday: Upper Strength (6 exercises)');
    console.log('   - Tuesday: Lower Strength + Core (7 exercises)');
    console.log('   - Wednesday: Rest/Active Recovery (2 activities)');
    console.log('   - Thursday: Push Hypertrophy (7 exercises)');
    console.log('   - Friday: Pull Hypertrophy (6 exercises)');
    console.log('   - Saturday: Arms + Conditioning (6 exercises)');
    console.log('   - Sunday: Full Rest (2 activities)');
    
  } catch (error) {
    console.error('❌ Error seeding workout plans:', error);
    process.exit(1);
  }
}

seedWorkoutPlans();
