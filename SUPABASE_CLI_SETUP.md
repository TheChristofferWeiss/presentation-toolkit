# Supabase CLI Setup & Edge Function Deployment

## ✅ Supabase CLI Installed

The CLI is now installed via Homebrew (version 2.51.0).

## Step 1: Get Access Token

1. Go to: https://supabase.com/dashboard/account/tokens
2. Click **"Generate new token"**
3. Name it: `cli-access`
4. Click **"Generate token"**
5. **Copy the token** (you'll only see it once!)

## Step 2: Login with Token

Run this command with your token:

```bash
cd /Users/christoffer/presentation-toolkit
supabase login --token YOUR_TOKEN_HERE
```

Replace `YOUR_TOKEN_HERE` with the token you copied.

**Example:**
```bash
supabase login --token sbp_1234567890abcdef...
```

## Step 3: Link Your Project

```bash
supabase link --project-ref gsiefiffawsvabrgnmaf
```

## Step 4: Deploy Edge Function

```bash
supabase functions deploy process-presentation
```

## Alternative: Deploy via Supabase Dashboard

If CLI doesn't work, you can deploy edge functions manually:

### Manual Edge Function Deployment

1. Go to: https://supabase.com/dashboard/project/gsiefiffawsvabrgnmaf/functions
2. Click **"Create a new function"**
3. Name: `process-presentation`
4. Copy the code from: `supabase/functions/process-presentation/index.ts`
5. Add the other files as imports
6. Click **"Deploy"**

## Files to Deploy

Your edge function files are in:
```
supabase/functions/process-presentation/
├── index.ts              # Main handler
├── pptx-to-png.ts        # PNG generation
├── element-extractor.ts  # Element extraction
├── pptx-parser.ts        # PPTX parsing
├── font-extractor.ts     # Font handling
└── validation.ts         # Input validation
```

## Note: Edge Functions are Optional

Your main app is already live on Vercel! The edge functions are only needed for:
- Processing uploaded PPTX files
- Extracting elements and animations
- Generating slide PNG references

The Font Hunter and other CLI tools work without edge functions.

## Current Status

✅ **Vercel App:** https://presentation-toolkit-pcreh6y8k-christoffer-weiss-projects.vercel.app
✅ **GitHub Repo:** https://github.com/TheChristofferWeiss/presentation-toolkit
✅ **Supabase CLI:** Installed
⏳ **Edge Functions:** Not deployed yet (optional)

## What Works Now

Without edge functions deployed:
- ✅ Landing page
- ✅ Supabase connection test
- ✅ Font Hunter CLI (Python)
- ✅ Web interface (Flask)
- ✅ PDF converter
- ✅ Font extractor

What requires edge functions:
- ⏳ PPTX upload and processing via web
- ⏳ Interactive presentation rendering from uploaded files

## Quick Commands

```bash
# Login
supabase login --token YOUR_TOKEN

# Link project
supabase link --project-ref gsiefiffawsvabrgnmaf

# Deploy function
supabase functions deploy process-presentation

# Check function status
supabase functions list

# View function logs
supabase functions logs process-presentation
```

---

**Next:** Get your access token from https://supabase.com/dashboard/account/tokens
