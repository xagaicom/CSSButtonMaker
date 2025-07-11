# Railway Clean Deployment - Final Instructions

## Clean GitHub Repository Setup

### 1. Download Project from Replit
- Click 3-dot menu → Download as ZIP
- Extract all files

### 2. Upload to Fresh GitHub Repository
Upload ALL files from the extracted folder to your new GitHub repository.

### 3. Make These Changes in GitHub

**A) Replace `package.json` with this clean version:**
```json
{
  "name": "css-button-maker",
  "version": "1.0.0",
  "type": "module",
  "scripts": {
    "build": "npm install && cd client && vite build && cd .. && esbuild server/index.ts --platform=node --packages=external --bundle --format=esm --outdir=dist",
    "start": "NODE_ENV=production node dist/index.js"
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
    "bcrypt": "^5.1.1",
    "class-variance-authority": "^0.7.1",
    "clsx": "^2.1.1",
    "cmdk": "^1.0.0",
    "connect-pg-simple": "^9.0.1",
    "date-fns": "^3.6.0",
    "drizzle-orm": "^0.33.0",
    "drizzle-zod": "^0.5.1",
    "embla-carousel-react": "^8.3.0",
    "express": "^4.19.2",
    "express-session": "^1.18.0",
    "framer-motion": "^11.5.4",
    "input-otp": "^1.2.4",
    "lucide-react": "^0.446.0",
    "memoizee": "^0.4.17",
    "memorystore": "^1.6.7",
    "nanoid": "^5.0.7",
    "next-themes": "^0.3.0",
    "openid-client": "^5.6.5",
    "passport": "^0.7.0",
    "passport-local": "^1.0.0",
    "react": "^18.3.1",
    "react-beautiful-dnd": "^13.1.1",
    "react-day-picker": "^8.10.1",
    "react-dom": "^18.3.1",
    "react-hook-form": "^7.53.0",
    "react-icons": "^5.3.0",
    "react-resizable-panels": "^2.1.2",
    "recharts": "^2.12.7",
    "tailwind-merge": "^2.5.2",
    "tailwindcss-animate": "^1.0.7",
    "vaul": "^0.9.2",
    "wouter": "^3.3.5",
    "ws": "^8.18.0",
    "zod": "^3.23.8",
    "zod-validation-error": "^3.4.0"
  },
  "devDependencies": {
    "@tailwindcss/typography": "^0.5.15",
    "@types/connect-pg-simple": "^7.0.3",
    "@types/express": "^4.17.21",
    "@types/express-session": "^1.18.0",
    "@types/node": "^22.5.4",
    "@types/passport": "^1.0.16",
    "@types/passport-local": "^1.0.38",
    "@types/react": "^18.3.5",
    "@types/react-dom": "^18.3.0",
    "@types/ws": "^8.5.12",
    "@vitejs/plugin-react": "^4.3.1",
    "autoprefixer": "^10.4.20",
    "drizzle-kit": "^0.24.2",
    "esbuild": "^0.23.1",
    "postcss": "^8.4.45",
    "tailwindcss": "^3.4.10",
    "tsx": "^4.19.0",
    "typescript": "^5.5.4",
    "vite": "^5.4.3"
  }
}
```

**B) Replace `vite.config.ts` with this clean version:**
```typescript
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./client/src"),
      "@shared": path.resolve(__dirname, "./shared"),
      "@assets": path.resolve(__dirname, "./attached_assets"),
    },
  },
  root: "client",
  build: {
    outDir: "../dist/public",
    emptyOutDir: true,
  },
});
```

**C) Remove Replit banner from `client/index.html`:**
Remove these lines if they exist:
```html
<!-- This is a replit script which adds a banner on the top of the page when opened in development mode outside the replit environment -->
<script type="text/javascript" src="https://replit.com/public/js/replit-dev-banner.js"></script>
```

**D) Delete `package-lock.json`** (Railway will generate fresh one)

### 4. Railway Setup
1. Connect your GitHub repository to Railway
2. **Build Command**: `npm run build`
3. **Start Command**: `npm start`
4. **Environment Variables**:
   ```
   NODE_ENV=production
   SESSION_SECRET=css-button-maker-secret-railway-2025
   ```
5. Add PostgreSQL database (Railway will create DATABASE_URL automatically)

### 5. Deploy
Railway will automatically build and deploy your CSS Button Maker.

## Why This Works
- Uses stable, compatible package versions
- Proper build sequence: client directory → vite build → backend build
- No Replit dependencies
- Fresh package-lock.json prevents version conflicts
- All 50+ button styles and features preserved