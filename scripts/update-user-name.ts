// Update user name to Rohan
import { neon } from "@neondatabase/serverless";

async function updateUser() {
  try {
    const sql = neon(process.env.DATABASE_URL!);
    
    await sql`
      UPDATE users 
      SET name = 'Rohan',
          updated_at = CURRENT_TIMESTAMP
      WHERE id = 1
    `;
    
    const users = await sql`SELECT * FROM users WHERE id = 1`;
    
    console.log('✅ User updated successfully:');
    console.log(JSON.stringify(users[0], null, 2));
    
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
}

updateUser();
