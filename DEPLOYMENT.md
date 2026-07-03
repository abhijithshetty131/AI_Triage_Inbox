# 🚀 Quick Start Guide

## Local Development (Recommended for Testing)

### 1. Install Node.js (if not already installed)
- Download from: https://nodejs.org/ (LTS version 18+)
- Verify installation: `node --version` and `npm --version`

### 2. Clone and Setup

```bash
# Navigate to project directory
cd React_app_assignment

# Install dependencies
npm install

# Start development server
npm run dev
```

The app will automatically open at `http://localhost:5173`

### 3. Test Features

**Keyboard Navigation:**
- Press `j` to go to next item
- Press `k` to go to previous item
- Press `Space` to select/unselect current item
- Press `d` to mark selected items as done
- Press `/` to focus search box

**Debug Mode:**
- Click the **🐛 Debug** button in the top-right corner
- Scroll to bottom to see debug panel with item statistics

**AI Assist:**
- Select an item from the list (left panel)
- Watch the AI panel generate suggestions in real-time
- Edit the draft reply directly
- Click "Regenerate" to get new suggestions

---

## Deployment Options

### Option A: Deploy to Vercel (Recommended - Free Tier Available)

1. **Fork the repository** on GitHub (or create a new GitHub repo and push this code)

2. **Connect to Vercel:**
   - Go to https://vercel.com
   - Click "Add New..." → "Project"
   - Select your GitHub repository
   - Click "Import"

3. **Configure:**
   - Framework: Vite
   - Root Directory: ./
   - Build Command: `npm run build`
   - Output Directory: dist
   - Click "Deploy"

✅ Your app will be live in ~1-2 minutes with auto-updates on every push!

### Option B: Deploy to Netlify (Alternative)

1. **Build locally first:**
   ```bash
   npm run build
   ```

2. **Deploy:**
   - Go to https://netlify.com
   - Click "Add New Site" → "Deploy manually"
   - Drag and drop the `dist/` folder
   - Your site is live!

### Option C: Deploy to GitHub Pages (Free)

1. **Update `vite.config.ts`:**
   ```typescript
   export default defineConfig({
     base: '/React_app_assignment/', // Add your repo name
     // ... rest of config
   })
   ```

2. **Build:**
   ```bash
   npm run build
   ```

3. **Push to GitHub:**
   ```bash
   git add .
   git commit -m "Deploy to GitHub Pages"
   git push origin main
   ```

4. **Enable GitHub Pages:**
   - Go to Settings → Pages
   - Source: Deploy from a branch
   - Branch: main, /root
   - Save

✅ Live at `https://yourusername.github.io/React_app_assignment/`

---

## Running Lighthouse Audit Locally

### 1. Install Lighthouse CLI (Optional)
```bash
npm install -g @lhci/cli@latest lighthouse
```

### 2. Run Audit
```bash
# Start the dev server in one terminal
npm run dev

# In another terminal, run audit
lighthouse http://localhost:5173 --view
```

### 3. Or Use Chrome DevTools
1. Open http://localhost:5173 in Chrome
2. Press `F12` to open DevTools
3. Go to "Lighthouse" tab
4. Select "Desktop" and click "Analyze page load"
5. Wait for results and take a screenshot

---

## Environment Variables

The app works 100% without environment variables (Mock AI mode).

For optional real AI provider integration:
1. Create `.env.local` in the root directory
2. Add your API key:
   ```
   VITE_OPENAI_API_KEY=sk_xxx...
   ```
3. Restart dev server: `npm run dev`

The app will automatically use real AI if the env var is set, otherwise fall back to Mock AI.

---

## Troubleshooting

### Issue: `npm: command not found`
**Solution:** Install Node.js from https://nodejs.org/

### Issue: Port 5173 already in use
**Solution:** 
```bash
npm run dev -- --port 3000
```

### Issue: Styles not loading
**Solution:** 
```bash
npm install
npm run dev
```

### Issue: AI panel shows error
**Solution:** This is intentional! Click "Retry" to regenerate. Debug mode shows why it failed.

---

## Project Commands

```bash
npm run dev       # Start dev server
npm run build     # Build for production
npm run preview   # Preview production build locally
npm run type-check # TypeScript type checking
npm run lint      # Run ESLint (if configured)
```

---

## Support

- 📖 See [README.md](./README.md) for full documentation
- ⏱️ See [TIMELOG.md](./TIMELOG.md) for development timeline
- 🐛 Check Debug Mode (🐛 button) for AI diagnostics
- 💬 Source code is well-commented

---

**Ready to deploy? Pick an option above and get your app live in minutes!**
