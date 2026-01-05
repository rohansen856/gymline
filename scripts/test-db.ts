// Test database connection
import { neon } from "@neondatabase/serverless";

async function testConnection() {
  try {
    console.log('Testing database connection...');
    console.log('DATABASE_URL exists:', !!process.env.DATABASE_URL);
    
    const sql = neon(process.env.DATABASE_URL!);
    
    const result = await sql`SELECT NOW() as current_time`;
    console.log('✅ Database connection successful!');
    console.log('Server time:', result[0].current_time);
    
    const tables = await sql`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public'
      ORDER BY table_name
    `;
    console.log('\n📊 Tables in database:');
    tables.forEach((t: any) => console.log(`  - ${t.table_name}`));
    
  } catch (error) {
    console.error('❌ Database connection failed:', error);
    process.exit(1);
  }
}

testConnection();
