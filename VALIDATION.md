# 🛡️ Pre-Push Validation

This project has comprehensive pre-push validation to prevent deployment crashes on Vercel and other platforms.

## What Gets Validated

Every `git push` automatically runs these checks (in order):

### 1. ✅ ESLint - Code Quality
- Checks code style and quality
- Detects potential bugs
- Ensures consistent formatting
- **Max warnings:** 999 (allows warnings, blocks errors)

**Command:**
```bash
npm run lint
```

**Fix issues:**
```bash
npm run lint:fix
```

### 2. ✅ Type Check - TypeScript Validation
- Validates all TypeScript types
- Catches type errors before runtime
- Ensures type safety across codebase

**Command:**
```bash
npm run type-check
```

### 3. ✅ Build - Production Compilation
- Compiles TypeScript to JavaScript
- Bundles code with Vite
- Optimizes for production
- **This is what Vercel runs**

**Command:**
```bash
npm run build
```

## How It Works

### Automatic (on git push)
```bash
git push
# Automatically runs: lint → type-check → build
# If any fails → push is ABORTED
# If all pass → push proceeds
```

### Manual (before committing)
```bash
npm run validate
# Or
npm run pre-push
# Both run the same checks
```

## Validation Flow

```
┌─────────────┐
│  git push   │
└──────┬──────┘
       │
       v
┌─────────────────────┐
│  [1/4] ESLint      │
│  Checking code...   │
└──────┬──────────────┘
       │ ✅ Pass
       v
┌─────────────────────┐
│  [2/4] Type Check  │
│  Validating TS...   │
└──────┬──────────────┘
       │ ✅ Pass
       v
┌─────────────────────┐
│  [3/4] Build       │
│  Compiling...       │
└──────┬──────────────┘
       │ ✅ Pass
       v
┌─────────────────────┐
│  [4/4] All Passed  │
│  🚀 Pushing...      │
└─────────────────────┘
```

## If Validation Fails

### ESLint Error
```bash
❌ LINT FAILED - Push aborted

Fix linting errors before pushing.
Run: npm run lint:fix (to auto-fix)
```

**Solution:**
```bash
npm run lint:fix    # Fix what can be auto-fixed
npm run lint        # Check remaining issues
# Fix manually
npm run validate    # Verify all checks pass
git push            # Try again
```

### Type Check Error
```bash
❌ TYPE CHECK FAILED - Push aborted

Fix TypeScript errors before pushing.
```

**Solution:**
```bash
npm run type-check  # See all type errors
# Fix type errors in code
npm run validate    # Verify all checks pass
git push            # Try again
```

### Build Error
```bash
❌ BUILD FAILED - Push aborted

Fix the build errors before pushing.
```

**Solution:**
```bash
npm run build      # See build errors
# Fix the errors
npm run clean      # Clean if needed
npm run build      # Verify build works
npm run validate   # Verify all checks pass
git push           # Try again
```

## Quick Commands Reference

| Command | Description | When to Use |
|---------|-------------|-------------|
| `npm run validate` | Run all checks | Before committing |
| `npm run pre-push` | Same as validate | Before pushing |
| `npm run lint` | ESLint only | Check code style |
| `npm run lint:fix` | Auto-fix lint issues | Fix linting |
| `npm run lint:strict` | Strict mode (no warnings) | For production |
| `npm run type-check` | TypeScript only | Check types |
| `npm run build` | Build only | Test compilation |
| `npm run clean` | Clean build | Fix build issues |

## Benefits

### 🛡️ Safety
- Never push broken code
- Prevent deployment crashes
- Catch errors before CI/CD

### ⚡ Speed
- Fast feedback loop
- Fix issues locally
- Save CI/CD time

### 💰 Cost Savings
- No failed deployments
- No rollbacks
- Less debugging in production

### 📊 Quality
- Consistent code style
- Type-safe codebase
- Production-ready code

## Configuration Files

- `.git/hooks/pre-push` - Git hook (Unix/Linux/Mac)
- `.git/hooks/pre-push.bat` - Git hook (Windows)
- `frontend/.eslintrc.json` - ESLint config
- `frontend/tsconfig.json` - TypeScript config
- `package.json` - All validation scripts

## Bypassing Validation (NOT RECOMMENDED)

If you absolutely must push without validation:
```bash
git push --no-verify
```

⚠️ **Warning:** This can cause deployment failures!

## For CI/CD

These same checks should run in your CI/CD pipeline:

```yaml
# Example for GitHub Actions
- name: Validate
  run: npm run validate
```

## Troubleshooting

### Hook Not Running
**Problem:** Pre-push hook not executing

**Solution:**
```bash
# Make hook executable (Unix/Linux/Mac)
chmod +x .git/hooks/pre-push

# Or run manually before push
npm run pre-push && git push
```

### Too Slow
**Problem:** Validation takes too long

**Solution:**
```bash
# Run just the build (fastest)
npm run build && git push --no-verify

# But this skips lint and type-check!
```

### Too Many Warnings
**Problem:** Lots of ESLint warnings

**Solution:**
```bash
# Auto-fix what you can
npm run lint:fix

# Warnings are allowed, only errors block push
# Fix errors first, then warnings gradually
```

## More Information

- See [WORKFLOW.md](WORKFLOW.md) for when to push
- See [START_HERE.md](START_HERE.md) for quick start
- See [README.md](README.md) for full documentation
