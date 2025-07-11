# CSS Button Maker

A professional CSS gradient button designer web application with admin panel, Google AdSense integration, and dynamic branding system.

## Features

- 🎨 **50+ Button Presets** - Comprehensive collection of modern button styles
- 🎯 **Live Preview** - Real-time button preview with hover and click effects
- 🌈 **Advanced Color Picker** - Eyedropper tool and full color palette
- 💾 **Save/Load Designs** - Persistent button design storage
- 🔐 **Admin Panel** - Complete management system for customization
- 💰 **Monetization Ready** - Google AdSense integration with 5 strategic placements
- 🎭 **Dynamic Branding** - Customizable app logo and settings
- 📱 **Responsive Design** - Mobile-friendly interface

## Quick Deploy to Railway

### 1. Create Private Repository
- Create a new private GitHub repository
- Push this code to your private repository

### 2. Deploy to Railway
- Go to [railway.app](https://railway.app)
- Click "New Project" → "Deploy from GitHub repo"
- Select your private repository

### 3. Set Environment Variables
```bash
SESSION_SECRET=your_session_secret_key
NODE_ENV=production
REPLIT_DOMAINS=your-railway-domain.railway.app
```

### 4. Add PostgreSQL Database
- Go to Railway dashboard
- Click "Add Service" → "Database" → "PostgreSQL"

### 5. Initialize Database
```bash
npm run db:push
```

## Local Development

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Start production server
npm start
```

## Admin Access
- URL: `/admin-panel`
- Default credentials: `admin` / `admin123`
- **Important**: Change password after first login

## Google AdSense Setup
1. Access admin panel
2. Navigate to "Ad Management"
3. Add your AdSense codes to 5 strategic locations

## Tech Stack
- React 18 + TypeScript
- Node.js + Express
- PostgreSQL + Drizzle ORM
- Tailwind CSS + shadcn/ui
- TanStack Query

## License
MIT