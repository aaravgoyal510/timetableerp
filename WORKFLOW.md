# 📋 Git Workflow Guidelines

## When to Push to GitHub

### ✅ PUSH After Completing These:

1. **Feature Complete**
   - Full CRUD module working
   - All pages tested
   - No console errors

2. **Bug Fixes**
   - Critical bugs resolved
   - Tested and verified

3. **Major Milestones**
   - Project structure changes
   - Dependency updates
   - Configuration improvements

4. **Documentation**
   - README updates
   - Guide improvements
   - Major doc changes

5. **Release Preparation**
   - Version ready for deployment
   - All tests passing
   - Build successful

### ❌ DON'T PUSH After:

- Single file edits
- Small tweaks
- Experimental code
- Incomplete features
- Work in progress
- Commented-out code
- Debug logging additions

## Recommended Workflow

```bash
# Work on feature
npm run dev

# Make changes, test thoroughly
# When feature is COMPLETE:

# 1. Validate locally (runs lint + type-check + build)
npm run validate

# Or use pre-push command
npm run pre-push

# 2. Commit with clear message
git add .
git commit -m "feat: Add student role mapping with CRUD operations"

# 3. Push (validation runs automatically)
git push
```

## Commit Message Format

Use conventional commits:

- `feat:` - New feature
- `fix:` - Bug fix
- `docs:` - Documentation
- `style:` - Formatting, no code change
- `refactor:` - Code restructuring
- `test:` - Adding tests
- `chore:` - Maintenance

**Examples:**
```
feat: Add teacher-subject relationship management
fix: Resolve TypeScript build errors
docs: Update README with deployment instructions
refactor: Consolidate dependencies using npm workspaces
```

## Pre-Push Safety

**Automatic Validation (runs on every git push):**
1. ✅ **ESLint** - Code quality and style checking
2. ✅ **Type Check** - TypeScript type validation
3. ✅ **Build** - Production build compilation

**If any check fails:**
- Push is aborted ❌
- Fix errors
- Try again

**Manual check:**
```bash
npm run validate    # Run all checks
npm run pre-push    # Same as validate
npm run lint        # Just linting
npm run type-check  # Just type checking
npm run build       # Just build
```

## Fixing Issues

### Linting Errors
```bash
npm run lint:fix    # Auto-fix what's possible
npm run lint        # Check remaining issues
```

### TypeScript Errors
```bash
npm run type-check  # See type errors
```

### Build Errors
```bash
npm run build      # See build errors
npm run clean      # Clean and retry
npm run build
```

## Benefits

- ✅ Never push broken code
- ✅ Prevent Vercel deployment crashes
- ✅ Clean commit history
- ✅ Consistent code quality
- ✅ Professional workflow
- ✅ Catch errors before CI/CD
