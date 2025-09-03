# Netlify Deployment Fix

## Problem
Netlify is automatically applying the Next.js plugin even though this is a React/Vite project.

## Solution Options

### Option 1: Manual Netlify Site Settings (Recommended)
1. Go to your Netlify dashboard: https://app.netlify.com
2. Find your site: `connectorbynova` or similar
3. Go to **Site Settings** → **Build & Deploy** → **Build Settings**
4. Remove any plugins from the **Plugins** section
5. Set build settings:
   - Build command: `npm run build`
   - Publish directory: `dist`
   - Node version: `18`
6. Go to **Environment Variables** and add:
   ```
   VITE_FIREBASE_API_KEY = AIzaSyDhZuInExe2qVK4Px3hsQ8VNRARcxvFm2Y
   VITE_FIREBASE_AUTH_DOMAIN = connetor-by-nova.firebaseapp.com
   VITE_FIREBASE_PROJECT_ID = connetor-by-nova
   VITE_FIREBASE_STORAGE_BUCKET = connetor-by-nova.firebasestorage.app
   VITE_FIREBASE_MESSAGING_SENDER_ID = 683556317411
   VITE_FIREBASE_APP_ID = 1:683556317411:web:c03007d53a027791f03dd6
   VITE_FIREBASE_MEASUREMENT_ID = G-5R8CRKLXN5
   ```
7. Trigger a new deploy

### Option 2: Delete and Recreate Site
1. Delete the current Netlify site
2. Create a new site from GitHub
3. Don't enable any plugins during setup
4. Use the netlify.toml configuration

### Option 3: Use Netlify CLI
```bash
npm install -g netlify-cli
netlify login
netlify init
netlify deploy --prod
```

## Current Status
- ✅ Code is ready for deployment
- ✅ Build works locally
- ❌ Netlify plugin conflict needs manual fix
