const fs = require('fs');
const path = require('path');
require('dotenv').config();

const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in .env');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function setupDatabase() {
  console.log('🚀 Setting up PrelovedPH Database...\n');

  try {
    // Read the SQL file
    const sqlPath = path.join(__dirname, 'config', 'database.sql');
    const sql = fs.readFileSync(sqlPath, 'utf-8');

    console.log('📂 SQL file loaded successfully');
    console.log('📝 Executing database schema...\n');

    // Execute SQL using Supabase query
    const { data, error } = await supabase.rpc('exec_sql', {
      sql: sql
    });

    if (error) {
      // Try alternative method - split by semicolons and execute statements
      console.log('⚠️  First method failed, trying alternative approach...\n');

      const statements = sql.split(';').filter(stmt => stmt.trim());
      let successCount = 0;
      let errorCount = 0;

      for (const statement of statements) {
        if (!statement.trim()) continue;

        const { error: execError } = await supabase.rpc('exec', {
          query: statement.trim()
        });

        if (!execError) {
          successCount++;
        } else {
          errorCount++;
          console.log(`⚠️  Statement failed: ${statement.substring(0, 50)}...`);
        }
      }

      console.log(`\n✅ Database setup completed!`);
      console.log(`✓ Executed: ${successCount} statements`);
      if (errorCount > 0) console.log(`⚠️  Failed: ${errorCount} statements`);
      return;
    }

    console.log('✅ Database schema applied successfully!');
    console.log('\n📊 Tables created:');
    console.log('  ✓ profiles');
    console.log('  ✓ listings');
    console.log('  ✓ messages');
    console.log('  ✓ favorites');
    console.log('  ✓ reports');
    console.log('\n🔐 Row Level Security enabled');
    console.log('🔍 Indexes created');
    console.log('📸 Storage bucket configured\n');

  } catch (err) {
    console.error('❌ Error setting up database:', err.message);
    console.error('\n💡 Alternative: Manually run the SQL in Supabase Dashboard:');
    console.error('1. Go to https://app.supabase.com/project/_/sql/new');
    console.error('2. Copy contents of backend/config/database.sql');
    console.error('3. Paste and execute\n');
    process.exit(1);
  }
}

setupDatabase();
