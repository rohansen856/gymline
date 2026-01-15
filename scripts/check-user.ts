// Check current user in database
import { neon } from "@neondatabase/serverless";

async function checkUser() {
  try {
    const sql = neon(process.env.DATABASE_URL!);
    
    const users = await sql`SELECT * FROM users WHERE id = 1`;
    
    if (users.length > 0) {
      console.log('Current user in database:');
      console.log(JSON.stringify(users[0], null, 2));
    } else {
      console.log('No user found with id = 1');
    }
    
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
}

checkUser();
