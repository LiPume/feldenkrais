import { config as loadEnv } from 'dotenv';
import { createClient } from '@supabase/supabase-js';

loadEnv({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const studentId = '23050824';
const password = '123456';

function normalizeStudentId(id: string) {
  return id.trim();
}

function encodeStudentId(id: string) {
  return Array.from(normalizeStudentId(id).toLowerCase())
    .map((char) => char.codePointAt(0)!.toString(16).padStart(4, '0'))
    .join('');
}

function buildStudentAuthEmail(studentId: string) {
  return `student-${encodeStudentId(studentId)}@student.feldenkrais.local`;
}

const internalEmail = buildStudentAuthEmail(studentId);
console.log('Internal email:', internalEmail);

// Use admin client to check the user
const admin = createClient(supabaseUrl, serviceRoleKey, {
  auth: { autoRefreshToken: false, persistSession: false },
});

console.log('\n--- Step 1: Check if user exists in Supabase Auth ---');
const { data: userList, error: listError } = await admin.auth.admin.listUsers();
if (listError) {
  console.error('Error listing users:', listError);
} else {
  const foundUser = userList.users.find(
    (u) => u.email === internalEmail || u.email?.includes('23050824'),
  );
  if (foundUser) {
    console.log('User found:', foundUser.email);
    console.log('  id:', foundUser.id);
    console.log('  confirmed:', foundUser.confirmed_at !== null);
    console.log('  created:', foundUser.created_at);
    console.log('  metadata:', JSON.stringify(foundUser.user_metadata));
  } else {
    console.log('User NOT found in Supabase Auth');
    console.log('All user emails:');
    userList.users.forEach((u) => console.log(' -', u.email));
  }
}

console.log('\n--- Step 2: Try sign in with password ---');
const signInClient = createClient(supabaseUrl, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!);
const { data, error } = await signInClient.auth.signInWithPassword({
  email: internalEmail,
  password,
});
if (error) {
  console.error('Sign-in error:', error.message);
  console.error('Error code:', error.code);
} else {
  console.log('Sign-in SUCCESS!');
  console.log('User:', data.user?.email);
}
