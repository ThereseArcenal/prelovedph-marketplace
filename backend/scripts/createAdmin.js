const { supabaseAdmin } = require('../config/supabase');
require('dotenv').config();

async function createAdmin() {
  const email = process.env.ADMIN_EMAIL || 'admin@prelovedph.com';
  const password = process.env.ADMIN_PASSWORD || 'Admin@PrelovedPH2024!';
  const name = 'Admin';

  console.log(`Creating admin user: ${email}`);

  try {
    // Create admin user
    const { data: userData, error: userError } = await supabaseAdmin.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
      user_metadata: { name, role: 'admin' }
    });

    if (userError) {
      if (userError.message.includes('already registered')) {
        console.log('User already exists, updating role...');
        
        // Get user by email
        const { data: users } = await supabaseAdmin.auth.admin.listUsers();
        const existingUser = users.users.find(u => u.email === email);
        
        if (existingUser) {
          // Update profile role
          const { error: profileError } = await supabaseAdmin
            .from('profiles')
            .update({ role: 'admin', name })
            .eq('id', existingUser.id);
          
          if (profileError) throw profileError;
          console.log('Admin role updated successfully!');
        }
      } else {
        throw userError;
      }
    } else {
      console.log('Admin user created:', userData.user.id);
      
      // Update profile role
      const { error: profileError } = await supabaseAdmin
        .from('profiles')
        .update({ role: 'admin' })
        .eq('id', userData.user.id);
      
      if (profileError) throw profileError;
      console.log('Admin role set successfully!');
    }

    console.log('\nAdmin Credentials:');
    console.log(`Email: ${email}`);
    console.log(`Password: ${password}`);
    console.log('\nPlease change the password after first login!');
    
  } catch (error) {
    console.error('Error creating admin:', error.message);
  }
}

createAdmin();