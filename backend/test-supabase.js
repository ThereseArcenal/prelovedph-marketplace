const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_ANON_KEY
);

async function test() {
  console.log('=' .repeat(50));
  console.log('🔍 Testing Supabase Connection');
  console.log('=' .repeat(50));
  console.log('📡 Supabase URL:', process.env.SUPABASE_URL);
  console.log('🔑 Anon Key:', process.env.SUPABASE_ANON_KEY ? '✅ Set' : '❌ Missing');
  console.log('');

  if (!process.env.SUPABASE_URL || !process.env.SUPABASE_ANON_KEY) {
    console.log('❌ ERROR: Missing Supabase credentials in .env file');
    console.log('Please add:');
    console.log('  SUPABASE_URL=your_url');
    console.log('  SUPABASE_ANON_KEY=your_key');
    return;
  }

  try {
    console.log('📡 Attempting to connect...');
    const { data, error } = await supabase
      .from('profiles')
      .select('count', { count: 'exact', head: true });
    
    if (error) {
      console.log('❌ Error connecting:', error.message);
      if (error.message.includes('relation') && error.message.includes('does not exist')) {
        console.log('⚠️  The "profiles" table doesn\'t exist yet.');
        console.log('   You need to run the database schema in Supabase SQL Editor first.');
      }
    } else {
      console.log('✅ Connection successful!');
      console.log('📊 Database is ready!');
    }
  } catch (err) {
    console.log('❌ Connection failed:', err.message);
  }
  
  console.log('');
  console.log('=' .repeat(50));
}

test();