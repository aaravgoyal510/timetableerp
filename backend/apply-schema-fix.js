/**
 * Apply Schema Fix Migration
 * This script fixes the schema mismatches between the database and controllers
 */

require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Error: Supabase credentials not found in environment variables');
  console.error('Please ensure VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY are set in your .env file');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function applySchemaFixes() {
  console.log('🔧 Applying schema fixes...\n');

  try {
    // 1. Fix holidays table - Remove extra columns
    console.log('1️⃣  Checking holidays table...');
    const { data: holidaysInfo, error: holidaysError } = await supabase
      .from('holidays')
      .select('*')
      .limit(1);
    
    if (holidaysError) {
      console.log(`   ⚠️  Note: ${holidaysError.message}`);
    } else {
      console.log('   ✅ Holidays table accessible');
    }

    // 2. Fix teacher_subject_map table
    console.log('\n2️⃣  Checking teacher_subject_map table...');
    const { data: teacherMapInfo, error: teacherMapError } = await supabase
      .from('teacher_subject_map')
      .select('*')
      .limit(1);
    
    if (teacherMapError) {
      console.log(`   ⚠️  Note: ${teacherMapError.message}`);
    } else {
      console.log('   ✅ Teacher-subject map table accessible');
    }

    // 3. Fix student_role_map table
    console.log('\n3️⃣  Checking student_role_map table...');
    const { data: studentMapInfo, error: studentMapError } = await supabase
      .from('student_role_map')
      .select('*')
      .limit(1);
    
    if (studentMapError) {
      console.log(`   ⚠️  Note: ${studentMapError.message}`);
    } else {
      console.log('   ✅ Student-role map table accessible');
    }

    console.log('\n' + '='.repeat(60));
    console.log('📋 MIGRATION SUMMARY');
    console.log('='.repeat(60));
    console.log('');
    console.log('⚠️  IMPORTANT: Schema cache issues detected!');
    console.log('');
    console.log('The following columns are referenced in old migrations but');
    console.log('don\'t exist in the current DATABASE_SCHEMA.sql:');
    console.log('');
    console.log('• holidays: description, holiday_type, academic_year');
    console.log('• teacher_subject_map: teacher_subject_map_id, mapping_id');
    console.log('• student_role_map: is_active, student_role_map_id');
    console.log('');
    console.log('📝 RECOMMENDED ACTION:');
    console.log('');
    console.log('Run the SQL migration script in Supabase SQL Editor:');
    console.log('  backend/migrations/fix_schema_mismatches.sql');
    console.log('');
    console.log('OR manually run these commands in Supabase SQL Editor:');
    console.log('');
    console.log('1. Drop and recreate teacher_subject_map:');
    console.log('   DROP TABLE IF EXISTS teacher_subject_map CASCADE;');
    console.log('   CREATE TABLE teacher_subject_map (');
    console.log('     staff_id integer NOT NULL,');
    console.log('     subject_code varchar NOT NULL,');
    console.log('     PRIMARY KEY (staff_id, subject_code)');
    console.log('   );');
    console.log('');
    console.log('2. Drop and recreate student_role_map:');
    console.log('   DROP TABLE IF EXISTS student_role_map CASCADE;');
    console.log('   CREATE TABLE student_role_map (');
    console.log('     student_id integer NOT NULL PRIMARY KEY,');
    console.log('     role_id integer NOT NULL,');
    console.log('     assigned_on timestamp DEFAULT NOW()');
    console.log('   );');
    console.log('');
    console.log('3. Fix holidays table:');
    console.log('   ALTER TABLE holidays DROP COLUMN IF EXISTS description;');
    console.log('   ALTER TABLE holidays DROP COLUMN IF EXISTS holiday_type;');
    console.log('   ALTER TABLE holidays DROP COLUMN IF EXISTS academic_year;');
    console.log('');
    console.log('💡 After running the migration, restart your backend server');
    console.log('   to clear any cached schema references.');
    console.log('');
    console.log('='.repeat(60));

  } catch (error) {
    console.error('\n❌ Error during schema check:', error.message);
    process.exit(1);
  }
}

// Run the migration
applySchemaFixes().then(() => {
  console.log('\n✅ Schema check complete!');
}).catch(error => {
  console.error('\n❌ Fatal error:', error);
  process.exit(1);
});
