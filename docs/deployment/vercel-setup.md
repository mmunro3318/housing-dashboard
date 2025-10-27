# Vercel Deployment Setup Guide

**Last Updated**: October 27, 2025
**Project**: Housing Dashboard
**Purpose**: Enable continuous client feedback through preview deployments
**Status**: ✅ **COMPLETED** - Vercel deployed successfully on October 27, 2025

---

## Deployment Status

✅ **Production URL**: [https://housing-dashboard-5hlowacgt-mmunro3318s-projects.vercel.app](https://housing-dashboard-5hlowacgt-mmunro3318s-projects.vercel.app)
✅ **Vercel Account**: Linked to GitHub
✅ **Environment Variables**: Placeholder values added (will update after Supabase setup)
✅ **Preview Deployments**: Enabled for all branches
✅ **Auto-deployments**: Active (push to `main` = production deploy)
✅ **Client Notification**: URL shared with client on October 27, 2025

---

## Overview

This guide walks you through deploying the Housing Dashboard to Vercel for development and production hosting. Vercel provides:

- **Automatic deployments** on every git push
- **Preview URLs** for every commit (share with client for feedback)
- **Production deployment** on main branch
- **Environment variable management** (secure API keys)
- **Free tier** sufficient for development/testing

---

## Prerequisites

- GitHub repository set up and pushed
- Vercel account (free tier is fine)
- Environment variables ready (`.env` file contents)

---

## Part 1: Create Vercel Account & Link GitHub

### Step 1: Sign Up for Vercel

1. Go to [vercel.com](https://vercel.com)
2. Click **"Sign Up"**
3. Choose **"Continue with GitHub"** (easiest integration)
4. Authorize Vercel to access your GitHub account
5. Select **"Hobby"** plan (free tier)

---

### Step 2: Import Project from GitHub

1. From Vercel Dashboard, click **"Add New..."** → **"Project"**
2. Select **"Import Git Repository"**
3. Find your repository: `housing-dashboard`
   - If not visible, click **"Configure GitHub App"** and grant access to the repository
4. Click **"Import"**

---

### Step 3: Configure Project Settings

**Framework Preset**: Vercel should auto-detect **"Vite"** (React + Vite)

**Build & Output Settings**:
- **Build Command**: `npm run build` (default)
- **Output Directory**: `dist` (default for Vite)
- **Install Command**: `npm install` (default)

**Root Directory**: `.` (project root - leave as default)

**Don't deploy yet** - we need to add environment variables first!

---

## Part 2: Configure Environment Variables

### Step 1: Add Environment Variables

1. In Vercel project settings, go to **"Settings"** → **"Environment Variables"**

2. Add each variable from your `.env` file:

**Supabase Variables**:
```
VITE_SUPABASE_URL=https://xxxxx.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOi...
```

**Google Sheets Variables** (for backend/API routes):
```
GOOGLE_SHEETS_PRIVATE_KEY_PATH=./credentials/google-service-account.json
GOOGLE_SHEETS_CLIENT_EMAIL=your-service-account@project.iam.gserviceaccount.com
```

**Square Variables** (when ready for payment integration):
```
SQUARE_APPLICATION_ID=sandbox-sq0idb-xxxxx
SQUARE_ACCESS_TOKEN=EAAAl...
SQUARE_LOCATION_ID=L...
```

3. For each variable:
   - **Name**: Variable name (e.g., `VITE_SUPABASE_URL`)
   - **Value**: Paste the value from your `.env`
   - **Environment**: Select **all** (Production, Preview, Development)
   - Click **"Add"**

### Important Notes:

- **VITE_ Prefix**: Frontend environment variables in Vite **must** start with `VITE_` to be exposed to the client
- **Secrets**: Sensitive keys (like `SQUARE_ACCESS_TOKEN`) should only be used in server-side API routes, not exposed to frontend
- **Google Service Account**: For backend, you may need to upload the JSON file to Vercel (see Part 4)

---

## Part 3: Initial Deployment

### Step 1: Deploy

1. Click **"Deploy"** button
2. Vercel will:
   - Clone your repository
   - Install dependencies (`npm install`)
   - Run build command (`npm run build`)
   - Deploy to production

3. Wait for deployment to complete (~2-3 minutes)

---

### Step 2: Get Production URL

Once deployed, you'll see:
- **Production URL**: `https://housing-dashboard.vercel.app` (or similar)
- **Deployment Status**: ✅ Ready

Copy this URL - this is your live application!

---

## Part 4: Enable Preview Deployments

Preview deployments automatically create unique URLs for every commit/branch.

### Automatic Preview URLs

**How it works**:
1. You push a commit to GitHub (any branch)
2. Vercel automatically builds and deploys that commit
3. You get a unique preview URL: `https://housing-dashboard-git-feature-branch.vercel.app`
4. Share this URL with client for feedback
5. Client views the exact code from that commit

**Enable Preview Deployments** (should be on by default):
1. Go to **"Settings"** → **"Git"**
2. Ensure **"Automatically create Preview Deployments"** is enabled
3. Select **"All branches"** (or specific branches)

---

## Part 5: Share Preview URLs with Client

### Method 1: From Vercel Dashboard

1. Go to **"Deployments"** tab in Vercel
2. Find the latest deployment for your branch
3. Click on the deployment
4. Copy the **"Visit"** URL
5. Send to client: "Hi [Client], here's the latest version for feedback: [URL]"

---

### Method 2: From GitHub (via Vercel Bot)

Vercel automatically comments on GitHub Pull Requests with preview URLs.

**Workflow**:
1. Create a feature branch: `git checkout -b feature/intake-form`
2. Make changes and commit: `git commit -m "Add intake form"`
3. Push to GitHub: `git push origin feature/intake-form`
4. Create Pull Request on GitHub
5. Vercel bot comments with preview URL
6. Copy URL from PR comment and share with client

---

## Part 6: Production Deployment Workflow

### Main Branch = Production

**Setup**:
- `main` branch is your production branch
- Every push to `main` triggers a production deployment
- Production URL stays the same: `https://housing-dashboard.vercel.app`

**Recommended Workflow**:
1. Develop on feature branch: `git checkout -b feature/xyz`
2. Get client feedback via preview URL
3. Merge to `main` when ready: `git merge feature/xyz`
4. Push to `main`: `git push origin main`
5. Vercel auto-deploys to production

---

## Part 7: Custom Domain (Optional)

Once ready for production, you can add a custom domain.

### Step 1: Purchase Domain

Options:
- **Vercel Domains**: Buy directly through Vercel ($20/year for `.com`)
- **External**: Use existing domain from GoDaddy, Namecheap, etc.

---

### Step 2: Add Domain to Vercel

1. Go to **"Settings"** → **"Domains"**
2. Click **"Add Domain"**
3. Enter your domain: `housingdashboard.com`
4. Vercel provides DNS instructions

---

### Step 3: Configure DNS

**If using Vercel Domains**: Auto-configured ✅

**If using external domain**:
1. Log in to your domain registrar (GoDaddy, Namecheap, etc.)
2. Update DNS records:
   - **A Record**: Point to `76.76.21.21` (Vercel IP)
   - **CNAME Record**: Point `www` to `cname.vercel-dns.com`
3. Wait for DNS propagation (~15 minutes to 48 hours)

---

### Step 4: Enable HTTPS

Vercel automatically provisions SSL certificates (via Let's Encrypt).

Once DNS propagates:
- `https://housingdashboard.com` will work with SSL ✅
- Vercel forces HTTPS (redirects HTTP → HTTPS)

---

## Part 8: Handling Backend API Routes (Server-Side)

### Option 1: Serverless Functions (Vercel Functions)

Vite doesn't natively support API routes, but you can add Vercel Serverless Functions.

**File Structure**:
```
/api
  /payments.js       → https://housing-dashboard.vercel.app/api/payments
  /google-sheets.js  → https://housing-dashboard.vercel.app/api/google-sheets
```

**Example Serverless Function** (`/api/payments.js`):
```javascript
// api/payments.js
export default async function handler(req, res) {
  if (req.method === 'POST') {
    const { tenantId, amount } = req.body;

    // Your backend logic here
    // Access environment variables via process.env.SQUARE_ACCESS_TOKEN

    res.status(200).json({ success: true, paymentId: '123' });
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
}
```

**Accessing Environment Variables**:
```javascript
const supabaseUrl = process.env.VITE_SUPABASE_URL;        // Frontend var
const squareToken = process.env.SQUARE_ACCESS_TOKEN;      // Backend secret
```

---

### Option 2: Separate Backend (Node/Express)

If you prefer a separate backend:
1. Deploy Node/Express backend to Vercel as a separate project
2. Set frontend `VITE_API_URL` to backend URL
3. Configure CORS on backend

---

## Part 9: Google Service Account JSON File

Your Google Sheets API requires a service account JSON file. Vercel doesn't support uploading files directly, so:

### Option 1: Environment Variable (Recommended)

1. Convert JSON file contents to a single-line string:
```bash
cat google-service-account.json | jq -c
```

2. Copy the output and add as environment variable in Vercel:
   - **Name**: `GOOGLE_SERVICE_ACCOUNT_JSON`
   - **Value**: `{"type":"service_account","project_id":"...","private_key":"..."}`

3. In your code, parse it:
```javascript
const serviceAccount = JSON.parse(process.env.GOOGLE_SERVICE_ACCOUNT_JSON);
```

---

### Option 2: Vercel Storage (Blob)

1. Upload JSON file to Vercel Blob storage
2. Access it from your serverless function

**Not recommended for API keys** - use environment variables instead.

---

## Part 10: Monitoring & Logs

### View Deployment Logs

1. Go to **"Deployments"** tab
2. Click on a deployment
3. Click **"View Function Logs"** or **"Build Logs"**
4. Debug errors from here

---

### Common Issues

**Build Fails**:
- Check build logs for error messages
- Ensure all dependencies are in `package.json`
- Verify `npm run build` works locally first

**Environment Variables Not Working**:
- Ensure variable names are correct (case-sensitive)
- Frontend vars must have `VITE_` prefix
- Redeploy after adding new environment variables

**404 Errors on Routes**:
- For React Router, add `vercel.json`:
```json
{
  "rewrites": [
    { "source": "/(.*)", "destination": "/" }
  ]
}
```

---

## Part 11: Continuous Deployment Workflow

### Recommended Git Workflow

1. **Feature Development**:
   ```bash
   git checkout -b feature/intake-form
   # Make changes
   git add .
   git commit -m "Add intake form with e-signatures"
   git push origin feature/intake-form
   ```

2. **Get Preview URL**:
   - Vercel auto-deploys to: `https://housing-dashboard-git-feature-intake-form.vercel.app`
   - Share with client for feedback

3. **Client Feedback Loop**:
   - Client reviews preview URL
   - You make adjustments on the same branch
   - Push changes: `git push origin feature/intake-form`
   - Vercel updates the same preview URL

4. **Merge to Production**:
   ```bash
   git checkout main
   git merge feature/intake-form
   git push origin main
   ```
   - Vercel auto-deploys to production: `https://housing-dashboard.vercel.app`

---

## Part 12: Cost Considerations

### Vercel Free Tier (Hobby Plan)

**Includes**:
- Unlimited deployments
- 100 GB bandwidth/month
- 100 GB-hours serverless function execution/month
- Automatic HTTPS
- Preview deployments

**Sufficient for**:
- Development and testing
- Small production apps (<10k monthly users)
- This project's MVP phase

### When to Upgrade (Pro Plan - $20/month)

Upgrade if you exceed:
- 1 TB bandwidth/month
- 1000 GB-hours function execution/month
- Need team collaboration features

---

## Part 13: Security Best Practices

1. **Never commit `.env` files**: Already in `.gitignore` ✅
2. **Use environment variables**: Store all API keys in Vercel environment variables ✅
3. **Restrict API access**: Add authentication to serverless functions
4. **Enable RLS**: Supabase Row Level Security should be enabled
5. **CORS configuration**: Only allow requests from your Vercel domain

---

## Part 14: Quick Reference Commands

### Redeploy Manually

```bash
# From Vercel CLI (optional install)
npm i -g vercel
vercel --prod
```

### Rollback to Previous Deployment

1. Go to **"Deployments"** tab
2. Find previous successful deployment
3. Click **"..."** menu → **"Promote to Production"**

---

## Part 15: Next Steps After Setup

Once Vercel is configured:

1. **✅ Share production URL with client** for initial feedback
2. **✅ Share preview URLs** as you develop new features
3. **Set up monitoring** (Vercel Analytics - free tier available)
4. **Configure custom domain** when ready for launch
5. **Document deployment process** in README.md

---

## Troubleshooting

### Build Fails with "Module not found"

**Solution**: Ensure all imports match actual file paths (case-sensitive on Vercel)
```bash
# Wrong on Windows (might work locally)
import Header from './Components/Header';

# Correct (exact case match)
import Header from './components/Header';
```

---

### Environment Variables Not Loading

**Solution**: Redeploy after adding variables
1. Add environment variables in Vercel settings
2. Go to **"Deployments"** → **"..."** → **"Redeploy"**

---

### Supabase Connection Fails

**Solution**: Check CORS settings in Supabase
1. Go to Supabase Dashboard → **"Settings"** → **"API"**
2. Add Vercel URL to allowed origins: `https://housing-dashboard.vercel.app`

---

## Support Resources

- [Vercel Documentation](https://vercel.com/docs)
- [Vite Deployment Guide](https://vitejs.dev/guide/static-deploy.html#vercel)
- [Vercel Serverless Functions](https://vercel.com/docs/functions)
- [Supabase + Vercel Integration](https://supabase.com/docs/guides/getting-started/tutorials/with-vercel)

---

## Summary Checklist

- [ ] Create Vercel account and link GitHub
- [ ] Import `housing-dashboard` repository
- [ ] Add all environment variables (Supabase, Google Sheets, Square)
- [ ] Deploy to production
- [ ] Test production URL
- [ ] Enable preview deployments for all branches
- [ ] Share preview URL with client for feedback
- [ ] Configure custom domain (optional, later)
- [ ] Set up monitoring/analytics (optional)
- [ ] Document deployment process in README

---

**Congratulations!** Your Housing Dashboard is now deployed on Vercel with continuous deployment enabled. Every commit will automatically build and deploy, giving your client real-time access to review progress.
