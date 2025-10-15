# Deployment Guide - Vercel

Complete guide to deploying the Presentation Toolkit to Vercel.

## Prerequisites

- GitHub account
- Vercel account (free tier works)
- Supabase project (already configured)

## Step 1: Push to GitHub

### Create Repository on GitHub

1. Go to https://github.com/new
2. Repository name: `presentation-toolkit`
3. Description: "Event tech toolkit for presentation processing with interactive web presentations"
4. Choose **Public** or **Private**
5. **Do NOT** initialize with README, .gitignore, or license
6. Click **Create repository**

### Push Your Code

The repository is initialized and ready. Run these commands:

```bash
cd /Users/christoffer/presentation-toolkit

# Add all files
git add .

# Commit
git commit -m "Initial commit: Presentation toolkit with interactive presentation system"

# Add your GitHub repository as remote
git remote add origin https://github.com/YOUR_USERNAME/presentation-toolkit.git

# Push to GitHub
git push -u origin main
```

Replace `YOUR_USERNAME` with your GitHub username.

## Step 2: Deploy to Vercel

### Option A: Deploy via Vercel Dashboard (Easiest)

1. Go to https://vercel.com
2. Click **"Add New Project"**
3. Click **"Import Git Repository"**
4. Select your `presentation-toolkit` repository
5. Configure project:
   - **Framework Preset:** Vite
   - **Build Command:** `npm run build`
   - **Output Directory:** `dist`
   - **Install Command:** `npm install`

6. **Add Environment Variables:**
   Click "Environment Variables" and add:
   
   ```
   VITE_SUPABASE_URL=https://gsiefiffawsvabrgnmaf.supabase.co
   VITE_SUPABASE_PUBLISHABLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdzaWVmaWZmYXdzdmFicmdubWFmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjA0NTU3ODcsImV4cCI6MjA3NjAzMTc4N30.78-ebdMYpWIBzEfQ6wP8qnMEoKEz9SSvzN6i63exgnM
   VITE_SUPABASE_PROJECT_ID=gsiefiffawsvabrgnmaf
   ```

7. Click **"Deploy"**

### Option B: Deploy via Vercel CLI

```bash
# Install Vercel CLI
npm install -g vercel

# Login to Vercel
vercel login

# Deploy
vercel

# Follow the prompts:
# - Set up and deploy? Yes
# - Which scope? Your account
# - Link to existing project? No
# - What's your project's name? presentation-toolkit
# - In which directory is your code located? ./
# - Want to override settings? No

# Add environment variables
vercel env add VITE_SUPABASE_URL production
vercel env add VITE_SUPABASE_PUBLISHABLE_KEY production
vercel env add VITE_SUPABASE_PROJECT_ID production

# Deploy to production
vercel --prod
```

## Step 3: Configure Supabase for Vercel

### Update Supabase CORS Settings

1. Go to your Supabase dashboard
2. Navigate to **Settings** → **API**
3. Scroll to **API Settings**
4. Add your Vercel domain to allowed origins:
   - `https://your-project.vercel.app`
   - `https://presentation-toolkit.vercel.app` (or your custom domain)

### Update Storage CORS

1. Go to **Storage** → **Policies**
2. Ensure your `presentations` bucket allows public read access
3. Add CORS configuration if needed

## Step 4: Test Deployment

1. Visit your Vercel URL (e.g., `https://presentation-toolkit.vercel.app`)
2. Check Supabase connection status
3. Verify environment variables are loaded
4. Test the application features

## Step 5: Custom Domain (Optional)

### Add Custom Domain in Vercel

1. Go to your project in Vercel
2. Click **"Settings"** → **"Domains"**
3. Add your custom domain
4. Follow DNS configuration instructions
5. Wait for DNS propagation (can take up to 48 hours)

## Automatic Deployments

Vercel automatically deploys when you push to GitHub:

```bash
# Make changes to your code
git add .
git commit -m "Your commit message"
git push

# Vercel automatically builds and deploys!
```

## Environment Variables Management

### Add New Environment Variable

```bash
# Via CLI
vercel env add VARIABLE_NAME production

# Via Dashboard
# Go to Project → Settings → Environment Variables → Add
```

### View Environment Variables

```bash
vercel env ls
```

### Pull Environment Variables Locally

```bash
vercel env pull .env.local
```

## Troubleshooting

### Build Fails

**Error:** "Cannot find module 'react'"
- **Fix:** Ensure `package.json` has all dependencies
- Run: `npm install` locally to verify

**Error:** "Vite build failed"
- **Fix:** Check `vite.config.ts` is present
- Verify all imports are correct

### Environment Variables Not Working

- Ensure variables start with `VITE_` prefix
- Redeploy after adding env vars: `vercel --prod`
- Check spelling matches exactly

### Supabase Connection Fails

- Verify Supabase project is active
- Check API keys are correct
- Ensure CORS is configured
- Verify database tables exist

### 404 on Refresh

- Check `vercel.json` has rewrite rules
- Ensure SPA routing is configured

## Monitoring

### View Logs

```bash
# View deployment logs
vercel logs

# View specific deployment
vercel logs [deployment-url]
```

### Analytics

- Go to Vercel Dashboard → Your Project → Analytics
- View real-time traffic, performance, and errors

## Production Checklist

- [ ] GitHub repository created and code pushed
- [ ] Vercel project deployed successfully
- [ ] Environment variables configured
- [ ] Supabase CORS settings updated
- [ ] Database tables created
- [ ] Storage bucket configured
- [ ] Application loads without errors
- [ ] Supabase connection successful
- [ ] Custom domain configured (optional)
- [ ] SSL certificate active (automatic with Vercel)

## Costs

### Free Tier Includes:
- **Vercel:** Unlimited personal projects, 100GB bandwidth
- **Supabase:** 500MB database, 1GB file storage, 2GB bandwidth
- **GitHub:** Unlimited public/private repositories

### Scaling:
- Both services have paid tiers for production apps
- Monitor usage in respective dashboards

## Next Steps

1. **Deploy Edge Functions:** See `QUICKSTART_PRESENTATION_SYSTEM.md`
2. **Set up CI/CD:** Already automatic with GitHub + Vercel
3. **Add monitoring:** Integrate Sentry or LogRocket
4. **Performance optimization:** Enable Vercel Analytics

## Support

- **Vercel Docs:** https://vercel.com/docs
- **Supabase Docs:** https://supabase.com/docs
- **GitHub Issues:** Use your repository's Issues tab

---

**Your app is now live!** 🚀

Share your Vercel URL with others to show off your interactive presentation system.
