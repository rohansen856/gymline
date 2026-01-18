import { neon } from "@neondatabase/serverless";
import { readFileSync } from "fs";
import { join } from "path";
import dotenv from "dotenv";

// Load environment variables
dotenv.config();

async function initDatabase() {
  try {
    console.log('🔄 Initializing database...');
    
    if (!process.env.DATABASE_URL) {
      console.error('❌ DATABASE_URL environment variable is not set!');
      console.log('\n💡 Please add your database connection string to the .env file:');
      console.log('   DATABASE_URL="your-neon-connection-string"');
      process.exit(1);
    }
    
    const sql = neon(process.env.DATABASE_URL);
    
    // Read the schema files
    const schemaPath = join(__dirname, '01-init-schema.sql');
    const bodyMeasurementsPath = join(__dirname, '02-body-measurements.sql');
    
    const schema = readFileSync(schemaPath, 'utf-8');
    const bodyMeasurementsSchema = readFileSync(bodyMeasurementsPath, 'utf-8');
    
    // Combine schemas
    const fullSchema = schema + '\n\n' + bodyMeasurementsSchema;
    
    // Remove comments and split by semicolon
    const cleanedSchema = fullSchema
      .split('\n')
      .filter(line => !line.trim().startsWith('--'))
      .join('\n');
    
    const statements = cleanedSchema
      .split(';')
      .map(s => s.trim())
      .filter(s => s.length > 10); // Filter out very short statements
    
    console.log(`📝 Executing ${statements.length} statements...`);
    
    for (let i = 0; i < statements.length; i++) {
      const statement = statements[i];
      try {
        await sql.query(statement);
        console.log(`  ✓ Statement ${i + 1} executed`);
      } catch (error: any) {
        // Ignore "already exists" errors
        if (error.message.includes('already exists')) {
          console.log(`  ℹ️  Statement ${i + 1}: Already exists (skipped)`);
        } else {
          console.log(`  ⚠️  Statement ${i + 1}: ${error.message}`);
        }
      }
    }
    
    console.log('\n✅ Database initialized successfully!');
    
    // Verify tables were created
    const tables = await sql`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public'
      ORDER BY table_name
    `;
    
    console.log('\n📊 Created tables:');
    tables.forEach((t: any) => console.log(`  - ${t.table_name}`));
    
  } catch (error) {
    console.error('❌ Database initialization failed:', error);
    process.exit(1);
  }
}

initDatabase();
