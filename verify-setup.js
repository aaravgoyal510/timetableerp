#!/usr/bin/env node

/**
 * Verification Script - Check if everything is set up correctly
 */

const fs = require('fs');
const path = require('path');

const GREEN = '\x1b[32m';
const RED = '\x1b[31m';
const YELLOW = '\x1b[33m';
const RESET = '\x1b[0m';

let allGood = true;

console.log('\n' + YELLOW + '=' .repeat(50) + RESET);
console.log(YELLOW + 'Timetable ERP - Setup Verification' + RESET);
console.log(YELLOW + '=' .repeat(50) + RESET + '\n');

// Check 1: Backend .env
console.log('Checking backend configuration...');
const backendEnv = path.join(__dirname, 'backend', '.env');
if (fs.existsSync(backendEnv)) {
  const envContent = fs.readFileSync(backendEnv, 'utf8');
  if (envContent.includes('SUPABASE_URL') && envContent.includes('SUPABASE_KEY')) {
    console.log(GREEN + '✓' + RESET + ' Backend .env file exists with credentials\n');
  } else {
    console.log(RED + '✗' + RESET + ' Backend .env missing SUPABASE credentials\n');
    allGood = false;
  }
} else {
  console.log(RED + '✗' + RESET + ' Backend .env file not found\n');
  allGood = false;
}

// Check 2: Frontend .env
console.log('Checking frontend configuration...');
const frontendEnv = path.join(__dirname, 'frontend', '.env');
if (fs.existsSync(frontendEnv)) {
  console.log(GREEN + '✓' + RESET + ' Frontend .env file exists\n');
} else {
  console.log(RED + '✗' + RESET + ' Frontend .env file not found\n');
  allGood = false;
}

// Check 3: Backend package.json
console.log('Checking backend structure...');
const backendPackage = path.join(__dirname, 'backend', 'package.json');
if (fs.existsSync(backendPackage)) {
  console.log(GREEN + '✓' + RESET + ' Backend package.json exists\n');
} else {
  console.log(RED + '✗' + RESET + ' Backend package.json not found\n');
  allGood = false;
}

// Check 4: Frontend package.json
console.log('Checking frontend structure...');
const frontendPackage = path.join(__dirname, 'frontend', 'package.json');
if (fs.existsSync(frontendPackage)) {
  console.log(GREEN + '✓' + RESET + ' Frontend package.json exists\n');
} else {
  console.log(RED + '✗' + RESET + ' Frontend package.json not found\n');
  allGood = false;
}

// Check 5: Database schema file
console.log('Checking database schema...');
const dbSchema = path.join(__dirname, 'DATABASE_SCHEMA.sql');
if (fs.existsSync(dbSchema)) {
  console.log(GREEN + '✓' + RESET + ' DATABASE_SCHEMA.sql found\n');
} else {
  console.log(RED + '✗' + RESET + ' DATABASE_SCHEMA.sql not found\n');
  allGood = false;
}

// Check 6: Backend node_modules
console.log('Checking backend dependencies...');
const backendModules = path.join(__dirname, 'backend', 'node_modules');
if (fs.existsSync(backendModules)) {
  console.log(GREEN + '✓' + RESET + ' Backend dependencies installed\n');
} else {
  console.log(YELLOW + '⚠' + RESET + ' Backend dependencies not installed. Run: cd backend && npm install\n');
}

// Check 7: Frontend node_modules
console.log('Checking frontend dependencies...');
const frontendModules = path.join(__dirname, 'frontend', 'node_modules');
if (fs.existsSync(frontendModules)) {
  console.log(GREEN + '✓' + RESET + ' Frontend dependencies installed\n');
} else {
  console.log(YELLOW + '⚠' + RESET + ' Frontend dependencies not installed. Run: cd frontend && npm install\n');
}

// Summary
console.log(YELLOW + '=' .repeat(50) + RESET);
if (allGood) {
  console.log(GREEN + 'All critical checks passed! ✓' + RESET);
  console.log('\nYou can now proceed with:');
  console.log('  1. Set up Supabase database using DATABASE_SCHEMA.sql');
  console.log('  2. Run: cd backend && npm run dev');
  console.log('  3. Run: cd frontend && npm run dev');
  console.log('  4. Open: http://localhost:3000');
} else {
  console.log(RED + 'Some checks failed. Please review the errors above.' + RESET);
  process.exit(1);
}

console.log(YELLOW + '=' .repeat(50) + RESET + '\n');
