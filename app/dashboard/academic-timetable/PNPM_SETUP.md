# Setup Guide for pnpm Users

## Quick Setup

### 1. Install pnpm (if not already installed)
```bash
npm install -g pnpm
# or
curl -fsSL https://get.pnpm.io/install.sh | sh -
```

### 2. Install Project Dependencies
```bash
pnpm install
```

### 3. Setup Environment
```bash
# Copy environment template
cp .env.example .env

# Edit .env and add your database URL
# DATABASE_URL="postgresql://user:password@localhost:5432/timetable_db"
```

### 4. Initialize Database
```bash
# Generate Prisma Client
pnpm db:generate

# Create tables in database
pnpm db:push

# Seed time slots
pnpm exec tsx scripts/seed-meeting-times.ts
```

### 5. Start Development Server
```bash
pnpm dev
```

Open http://localhost:3000

## pnpm Benefits

✅ **Faster**: 2x faster than npm
✅ **Disk Efficient**: Uses hard links to save space
✅ **Strict**: Better dependency management
✅ **Compatible**: Works with all npm packages

## Common pnpm Commands

```bash
# Install dependencies
pnpm install

# Add a package
pnpm add <package>
pnpm add -D <package>  # dev dependency

# Remove a package
pnpm remove <package>

# Run scripts
pnpm dev
pnpm build
pnpm start

# Database commands
pnpm db:push
pnpm db:studio
pnpm db:generate

# Update dependencies
pnpm update

# Clean install
pnpm store prune
rm -rf node_modules pnpm-lock.yaml
pnpm install
```

## Troubleshooting

### Issue: Peer dependency warnings
**Solution**: Already configured in `.npmrc`
```
auto-install-peers=true
```

### Issue: Hoisting problems
**Solution**: Already configured in `.npmrc`
```
shamefully-hoist=true
```

### Issue: Module resolution errors
**Solution**: Clean install
```bash
rm -rf node_modules .next
pnpm install
```

### Issue: Prisma Client not found
**Solution**: Regenerate after install
```bash
pnpm db:generate
```

## Workspace Setup (Optional)

If you want to add more packages to your monorepo:

Create `pnpm-workspace.yaml`:
```yaml
packages:
  - 'packages/*'
  - 'apps/*'
```

## CI/CD with pnpm

### GitHub Actions
```yaml
- uses: pnpm/action-setup@v2
  with:
    version: 8
- uses: actions/setup-node@v3
  with:
    node-version: 18
    cache: 'pnpm'
- run: pnpm install --frozen-lockfile
- run: pnpm build
```

### Vercel
Vercel automatically detects pnpm if `pnpm-lock.yaml` exists.

### Docker
```dockerfile
FROM node:18-alpine
RUN corepack enable && corepack prepare pnpm@8.0.0 --activate
WORKDIR /app
COPY pnpm-lock.yaml package.json ./
RUN pnpm install --frozen-lockfile
COPY . .
RUN pnpm build
CMD ["pnpm", "start"]
```

## Performance Tips

1. **Use frozen lockfile in CI**:
   ```bash
   pnpm install --frozen-lockfile
   ```

2. **Cache the store**:
   ```bash
   pnpm config set store-dir ~/.pnpm-store
   ```

3. **Parallel execution**:
   ```bash
   pnpm -r --parallel run build
   ```

## Migration from npm/yarn

If you have `package-lock.json` or `yarn.lock`:

```bash
# Remove old lock files
rm package-lock.json yarn.lock

# Install with pnpm
pnpm install

# This creates pnpm-lock.yaml
```

---

**You're all set!** pnpm will handle everything more efficiently than npm. 🚀
