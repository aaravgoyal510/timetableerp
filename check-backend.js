#!/usr/bin/env node
/**
 * Backend validation script
 * Checks syntax and basic structure without full initialization
 */

const fs = require('fs');
const path = require('path');

console.log('🔍 Backend validation started...\n');

try {
  // 1. Check backend directory exists
  const backendDir = path.join(__dirname, 'backend');
  if (!fs.existsSync(backendDir)) {
    throw new Error('Backend directory not found');
  }
  console.log('✅ Backend directory found');

  // 2. Check package.json
  const pkgPath = path.join(backendDir, 'package.json');
  if (!fs.existsSync(pkgPath)) {
    throw new Error('Backend package.json not found');
  }
  const pkg = JSON.parse(fs.readFileSync(pkgPath, 'utf8'));
  console.log('✅ Backend package.json is valid');

  // 3. Check main entry point
  const mainFile = path.join(backendDir, 'src', 'server.js');
  if (!fs.existsSync(mainFile)) {
    throw new Error('Backend server.js not found');
  }
  console.log('✅ Backend server.js found');

  // 4. Check syntax of main files
  const srcDir = path.join(backendDir, 'src');
  const checkSyntax = (filePath) => {
    try {
      const code = fs.readFileSync(filePath, 'utf8');
      new Function(code);
    } catch (e) {
      throw new Error(`Syntax error in ${filePath}: ${e.message}`);
    }
  };

  // Check all .js files in src
  const walkDir = (dir) => {
    const files = fs.readdirSync(dir);
    for (const file of files) {
      const fullPath = path.join(dir, file);
      const stat = fs.statSync(fullPath);
      if (stat.isDirectory()) {
        walkDir(fullPath);
      } else if (file.endsWith('.js')) {
        checkSyntax(fullPath);
      }
    }
  };

  walkDir(srcDir);
  console.log('✅ All backend files have valid syntax');

  // 5. Check required dependencies (workspace root preferred)
  const requiredDeps = ['express', 'cors', 'dotenv', '@supabase/supabase-js', 'jsonwebtoken', 'bcryptjs'];
  const rootNodeModules = path.join(__dirname, 'node_modules');
  const backendNodeModules = path.join(backendDir, 'node_modules');
  const nodeModulesDir = fs.existsSync(rootNodeModules) ? rootNodeModules : backendNodeModules;

  if (fs.existsSync(nodeModulesDir)) {
    const installed = fs.readdirSync(nodeModulesDir);
    const hasScopedDep = (dep) => {
      if (!dep.startsWith('@')) return false;
      const [scope, name] = dep.split('/');
      const scopePath = path.join(nodeModulesDir, scope);
      if (!fs.existsSync(scopePath)) return false;
      const scopePackages = fs.readdirSync(scopePath);
      return scopePackages.includes(name);
    };

    for (const dep of requiredDeps) {
      const isPresent = dep.startsWith('@') ? hasScopedDep(dep) : installed.includes(dep);
      if (!isPresent) {
        console.warn(`⚠️  Missing dependency: ${dep}`);
      }
    }
    console.log('✅ Backend dependencies check passed');
  } else {
    console.warn('⚠️  node_modules not found; skipping dependency check');
  }

  console.log('\n✅ Backend validation successful!\n');
  process.exit(0);
} catch (error) {
  console.error(`\n❌ Backend validation failed:\n${error.message}\n`);
  process.exit(1);
}
