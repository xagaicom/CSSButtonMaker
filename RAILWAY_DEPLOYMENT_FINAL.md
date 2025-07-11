# Railway Deployment - Final Instructions

## The Problem
Railway uses `npm ci` which requires exact package-lock.json matches. Your current package-lock.json is from Replit and has different versions.

## Simple Solution

### 1. Download & Upload
- Download your complete project from Replit
- Upload ALL files to GitHub (overwrite everything)

### 2. Replace These Files in GitHub
**Replace content only, don't rename files:**

**A) Replace `package.json` with this content:**
```json
{
  "name": "css-button-maker-railway",
  "version": "1.0.0",
  "type": "module",
  "license": "MIT",
  "scripts": {
    "dev": "NODE_ENV=development tsx server/index.ts",
    "build": "npm install && vite build && esbuild server/index.ts --platform=node --packages=external --bundle --format=esm --outdir=dist",
    "start": "NODE_ENV=production node dist/index.js",
    "check": "tsc",
    "db:push": "drizzle-kit push"
  },
  "dependencies": {
    "@hookform/resolvers": "^3.10.0",
    "@neondatabase/serverless": "^0.10.4",
    "@radix-ui/react-accordion": "^1.2.4",
    "@radix-ui/react-alert-dialog": "^1.1.7",
    "@radix-ui/react-aspect-ratio": "^1.1.3",
    "@radix-ui/react-avatar": "^1.1.4",
    "@radix-ui/react-checkbox": "^1.1.5",
    "@radix-ui/react-collapsible": "^1.1.4",
    "@radix-ui/react-context-menu": "^2.2.7",
    "@radix-ui/react-dialog": "^1.1.7",
    "@radix-ui/react-dropdown-menu": "^2.1.7",
    "@radix-ui/react-hover-card": "^1.1.7",
    "@radix-ui/react-label": "^2.1.3",
    "@radix-ui/react-menubar": "^1.1.7",
    "@radix-ui/react-navigation-menu": "^1.2.6",
    "@radix-ui/react-popover": "^1.1.7",
    "@radix-ui/react-progress": "^1.1.3",
    "@radix-ui/react-radio-group": "^1.2.4",
    "@radix-ui/react-scroll-area": "^1.2.4",
    "@radix-ui/react-select": "^2.1.7",
    "@radix-ui/react-separator": "^1.1.3",
    "@radix-ui/react-slider": "^1.2.4",
    "@radix-ui/react-slot": "^1.2.0",
    "@radix-ui/react-switch": "^1.1.4",
    "@radix-ui/react-tabs": "^1.1.4",
    "@radix-ui/react-toast": "^1.2.7",
    "@radix-ui/react-toggle": "^1.1.3",
    "@radix-ui/react-toggle-group": "^1.1.3",
    "@radix-ui/react-tooltip": "^1.2.0",
    "@tanstack/react-query": "^5.60.5",
    "@types/bcrypt": "^5.0.2",
    "@types/memoizee": "^0.4.12",
    "@types/react-beautiful-dnd": "^13.1.8",
    "bcrypt": "^6.0.0",
    "class-variance-authority": "^0.7.1",
    "clsx": "^2.1.1",
    "cmdk": "^1.0.0",
    "connect-pg-simple": "^10.0.0",
    "date-fns": "^3.6.0",
    "drizzle-orm": "^0.37.0",
    "drizzle-zod": "^0.5.1",
    "embla-carousel-react": "^8.3.0",
    "express": "^5.0.1",
    "express-session": "^1.18.0",
    "framer-motion": "^11.11.17",
    "input-otp": "^1.4.1",
    "lucide-react": "^0.460.0",
    "memoizee": "^0.4.17",
    "memorystore": "^1.6.7",
    "nanoid": "^5.0.9",
    "next-themes": "^0.4.3",
    "openid-client": "^6.1.6",
    "passport": "^0.7.0",
    "passport-local": "^1.0.0",
    "react": "^18.3.1",
    "react-beautiful-dnd": "^13.1.1",
    "react-day-picker": "8.10.1",
    "react-dom": "^18.3.1",
    "react-hook-form": "^7.53.2",
    "react-icons": "^5.4.0",
    "react-resizable-panels": "^2.1.7",
    "recharts": "^2.13.3",
    "tailwind-merge": "^2.5.4",
    "tailwindcss-animate": "^1.0.7",
    "vaul": "^1.1.1",
    "wouter": "^3.3.5",
    "ws": "^8.18.0",
    "zod": "^3.23.8",
    "zod-validation-error": "^3.4.0"
  },
  "devDependencies": {
    "@tailwindcss/typography": "^0.5.15",
    "@types/connect-pg-simple": "^7.0.3",
    "@types/express": "^5.0.0",
    "@types/express-session": "^1.18.0",
    "@types/node": "^22.10.1",
    "@types/passport": "^1.0.16",
    "@types/passport-local": "^1.0.38",
    "@types/react": "^18.3.12",
    "@types/react-dom": "^18.3.1",
    "@types/ws": "^8.5.13",
    "@vitejs/plugin-react": "^4.3.3",
    "autoprefixer": "^10.4.20",
    "drizzle-kit": "^0.30.0",
    "esbuild": "^0.24.0",
    "postcss": "^8.5.2",
    "tailwindcss": "^3.4.17",
    "tsx": "^4.19.2",
    "typescript": "^5.6.3",
    "vite": "^5.4.19"
  }
}
```

**B) Replace `vite.config.ts` with content from `vite-railway.config.ts`**

**C) Replace `client/index.html` with content from `client/index-railway.html`** (removes Replit banner)

**D) Delete `package-lock.json`** (Railway will generate a new one)

### 3. Railway Configuration
- **Build Command**: `npm run build`
- **Start Command**: `npm start`
- **Environment Variables**:
  ```
  NODE_ENV = production
  SESSION_SECRET = css-button-maker-secret-railway-2025
  ```

### 4. Deploy
Railway will automatically build with fresh dependencies and deploy successfully.

## Why This Works
- Uses `npm install` instead of `npm ci` (no lock file conflicts)
- Compatible package versions for Railway
- Clean build process without Replit dependencies