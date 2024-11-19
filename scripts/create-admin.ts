import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config();

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  throw new Error('Missing Supabase environment variables');
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function createAdminAccount() {
  const adminEmail = 'admin@example.com';
  const adminPassword = 'admin123';

  try {
    // Create admin user account
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email: adminEmail,
      password: adminPassword,
    });

    if (authError) throw authError;

    if (!authData.user) {
      throw new Error('Failed to create admin user');
    }

    // Insert admin user profile with role
    const { error: profileError } = await supabase
      .from('users')
      .insert({
        id: authData.user.id,
        email: adminEmail,
        name: 'Admin User',
        role: 'admin',
        avatar: `https://ui-avatars.com/api/?name=Admin+User&background=0D8ABC&color=fff`
      });

    if (profileError) throw profileError;

    console.log('Admin account created successfully!');
    console.log('Email:', adminEmail);
    console.log('Password:', adminPassword);
    console.log('\nPlease change the password after first login.');

  } catch (error: any) {
    console.error('Error creating admin account:', error.message);
  } finally {
    process.exit(0);
  }
}

createAdminAccount();