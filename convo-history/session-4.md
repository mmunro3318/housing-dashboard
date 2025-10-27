# Session 4 -- Vercel and Supabase Setup

## User

Okay -- let's get Vercel setup first. Walk me through the process. Perform any web searches you need to in order to have the most up-to-date information. _Also_ you could supply me with the prompt(s) to feed into my Perplexity Browser Agent to help/perform setup.

## Claude

[starting writing files by hand for basic Vite + React app]

## User

Hold up -- rather than creating files from scratch, perhaps we initialize our repo structure now. I'm thinking we use an `./app/frontend` and `./app/backend` structure unless you object.

## Claude

● Perfect! Let me explain my recommendation and reasoning:

Recommended Structure: Vercel-Native Monorepo

Given that we're deploying to Vercel and you want to minimize files, I recommend a Vercel-native structure with a single package.json:

```shell
housing-dashboard/
├── src/ # Frontend React code
│ ├── components/
│ ├── pages/
│ ├── App.jsx
│ └── main.jsx
├── api/ # Backend API routes (Vercel Serverless Functions)
│ ├── houses.js
│ ├── tenants.js
│ └── beds.js
├── public/ # Static assets
│ └── images/
├── docs/ # Documentation (existing)
├── package.json # Single package.json for both frontend and backend
├── vite.config.js # Vite config
├── vercel.json # Vercel routing config
└── index.html # Entry point
```

Why This Structure?

1. Minimizes Files ✅

- Single package.json (not 2-3 separate ones)
- Single build configuration
- No monorepo workspace complexity

2. Vercel-Native Pattern ✅

- Vercel automatically detects /api folder as serverless functions
- Frontend in /src builds with Vite as usual
- One deployment, one project in Vercel dashboard

3. Perfect for Your Project Size ✅

- Simple CRUD API (houses, beds, tenants, forms)
- Supabase handles database (so backend is just API routes)
- No need for complex Express server with middleware

4. Easy Development ✅

- Run npm run dev → Vite dev server (frontend) on port 3000
- Vercel automatically proxies /api requests in dev mode
- No need to run separate frontend/backend servers

How Backend Works with Serverless Functions

Each file in /api becomes an endpoint:

```js
// api/tenants.js
export default async function handler(req, res) {
  if (req.method === "GET") {
    // Fetch tenants from Supabase
    const { data } = await supabase.from("tenants").select("*");
    res.status(200).json(data);
  }

  if (req.method === "POST") {
    // Create new tenant
    const { data } = await supabase.from("tenants").insert(req.body);
    res.status(201).json(data);
  }
}
```

This becomes: https://housing-dashboard.vercel.app/api/tenants

Alternative (If You Prefer Separation)

If you'd rather have clear frontend/backend separation, I can do:

/frontend (separate package.json)
/backend (separate package.json)

But this adds complexity with:

- 2 package.json files
- 2 separate deployments OR monorepo workspace setup
- CORS configuration between frontend and backend

My recommendation: Start with the single-repo Vercel-native structure. If we outgrow it (need long-running processes, complex backend logic), we can refactor later.

Should I proceed with this structure? If yes, I'll:

1. Clean up the root files I just created
2. Initialize proper /src and /api folders
3. Create a minimal "Coming Soon" page
4. Walk you through Vercel deployment

Todos
☐ Initialize Vite + React frontend application
☐ Create Vercel account and link GitHub
☐ Configure Vercel project settings
☐ Add environment variables to Vercel (placeholders for now)
☐ Deploy initial version to production
☐ Enable preview deployments for all branches
☐ Test production URL and share with client

## User

Proceed with your serverless Vercel structure.

## Claude

● Excellent! ✅ Committed and pushed to both GitLab and GitHub

---

Now Let's Set Up Vercel

I'll guide you through this step-by-step. Since this requires browser interaction, I'll give you clear instructions and a Perplexity prompt you can use.

Step 1: Create Vercel Account

Open your browser and navigate to: https://vercel.com

Follow these steps:

1. Click "Sign Up"
2. Choose "Continue with GitHub" (easiest integration)
3. Authorize Vercel to access your GitHub account
4. Select "Hobby" plan (free tier - perfect for this project)

---

Step 2: Import Your Project

Once you're in the Vercel dashboard:

1. Click "Add New..." → "Project"
2. Select "Import Git Repository"
3. Find your repository: housing-dashboard

   - If you don't see it, click "Configure GitHub App" and grant Vercel access to the repository

4. Click "Import"

---

Step 3: Configure Project Settings ⚠️ STOP HERE - DON'T DEPLOY YET!

Vercel should auto-detect your settings, but verify:

Framework Preset: Vite ✅ (should auto-detect)

Build & Output Settings:

- Build Command: npm run build ✅
- Output Directory: dist ✅
- Install Command: npm install ✅

Root Directory: . (leave as default) ✅

❌ DO NOT CLICK "DEPLOY" YET - We need to add environment variables first (even if just placeholders)

---

Step 4: Add Environment Variables (Placeholders)

Before deploying, let's add placeholder environment variables so the structure is ready:

1. In Vercel project settings, go to "Settings" → "Environment Variables"
2. Add these placeholder variables (we'll update them when we set up Supabase):

Add each of these:

```md
| Name                   | Value                                            | Environment                            |
| ---------------------- | ------------------------------------------------ | -------------------------------------- |
| VITE_SUPABASE_URL      | https://placeholder.supabase.co                  | All (Production, Preview, Development) |
| VITE_SUPABASE_ANON_KEY | placeholder_key_will_update_after_supabase_setup | All                                    |
```

Click "Add" after each one.

---

Step 5: Deploy!

Now click "Deploy" 🚀

Vercel will:

- Clone your GitHub repository
- Run npm install
- Run npm run build
- Deploy to production

This takes ~2-3 minutes. Watch the build logs if you're curious!

---

Step 6: Get Your Production URL

Once deployed, you'll see:

- Production URL: Something like https://housing-dashboard-xyz.vercel.app
- Deployment Status: ✅ Ready

Copy this URL - this is your live application!

---

Step 7: Enable Preview Deployments

Preview deployments should be enabled by default, but let's verify:

1. Go to "Settings" → "Git"
2. Ensure "Automatically create Preview Deployments" is enabled ✅
3. Select "All branches"

Now every time you push to GitHub, Vercel will create a unique preview URL for that commit!

---

📋 Perplexity Browser Agent Prompts

If you want to use Perplexity to help with the setup, here are the prompts:

Prompt 1: Account Setup

I need to deploy a Vite + React application to Vercel. Walk me through:

1. Creating a free Vercel account linked to my GitHub account
2. Importing my GitHub repository "housing-dashboard" into Vercel
3. Verifying that Vercel auto-detects the Vite framework preset
4. What settings I should verify before deploying

Provide step-by-step instructions with screenshots references if possible.

Prompt 2: Environment Variables

I'm deploying a Vite + React app to Vercel that will eventually connect to Supabase.
How do I:

1. Add placeholder environment variables in Vercel (VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY)
2. Ensure these variables are available in Production, Preview, and Development environments
3. Understand why Vite variables need the VITE\_ prefix

Walk me through the Vercel dashboard navigation for adding environment variables.

Prompt 3: Preview Deployments

I want to enable Vercel preview deployments so every git push creates a unique URL I can share with my client for feedback.

How do I:

1. Enable automatic preview deployments for all branches in Vercel
2. Find the preview URL after pushing a commit
3. Share preview URLs with non-technical clients
4. Understand the difference between production and preview deployments

Provide step-by-step instructions.

---

Once You're Done

Let me know when you've completed these steps and share:

1. ✅ Your production URL (e.g., https://housing-dashboard-xyz.vercel.app)
2. ✅ Whether the build succeeded or if you encountered any errors

Then we can:

- Test the deployment by visiting the URL
- Set up Supabase next
- Update the environment variables with real Supabase credentials

Any questions before you start? I'm here to help troubleshoot if anything goes wrong!

Todos
☒ Set up Vercel-native monorepo structure
☒ Create minimal frontend with Coming Soon page
☒ Install dependencies and test local build
☒ Commit frontend initialization
☐ Create Vercel account and link GitHub
☐ Configure Vercel project settings
☐ Add environment variables to Vercel
☐ Deploy initial version to production
☐ Test production URL and share with client

## User

Success! Vercel deployment is complete with placeholder environment variables. Client has been emailed the preview link: housing-dashboard-5hlowacgt-mmunro3318s-projects.vercel.app

## Claude

● Excellent work! 🎉 That's a huge milestone! Your client now has a live URL they can visit, and every time you push code to GitHub, they'll automatically see the updates. This continuous feedback loop is
going to be invaluable.

● Perfect! 🚀 Vercel setup complete! All tasks finished successfully.

What You've Accomplished

✅ Vercel-native monorepo structure - Frontend (/src) + Backend (/api) in single project✅ Live production URL - housing-dashboard-5hlowacgt-mmunro3318s-projects.vercel.app✅ Automatic deployments - Every  
 push to main updates production✅ Preview deployments enabled - Every branch gets a unique URL✅ Client has visibility - They can watch progress in real-time✅ Purple/pink themed landing page - Matches
client's color preference✅ Placeholder environment variables - Ready for Supabase integration

Important note about the URL: That's your preview/production URL. Vercel typically assigns a cleaner domain alias like housing-dashboard.vercel.app - you can find this in your Vercel dashboard under
"Domains". Both URLs work, but the shorter one is easier to share.

---

What Happens Next

Every time you:

- Push to main → Vercel auto-deploys to production (your current URL)
- Push to a feature branch → Vercel creates a preview URL (e.g., housing-dashboard-git-feature-xyz.vercel.app)
- Create a Pull Request → Vercel bot comments with the preview URL

Your client can bookmark the production URL and see updates within minutes of you pushing code!

---

Next Steps: Supabase Setup

Now we need to set up Supabase (PostgreSQL database) so we can:

1. Create the 8 database tables (houses, beds, tenants, etc.)
2. Get real API keys to replace the placeholders in Vercel
3. Enable Row Level Security (RLS) for authentication
4. Set up Supabase Storage for profile pictures

Do you want to proceed with Supabase setup now? I can walk you through it step-by-step just like we did with Vercel. It will take about 15-20 minutes.

Or would you prefer to:

- Take a break and tackle Supabase later
- Work on something else first
- Update the project roadmap to mark Vercel deployment complete

Let me know what you'd like to do!

## User

Perfect! I'll collapse context before we proceed to Supabase setup. But I also want to build out a CI/CD pipeline after Supabase setup so we ensure we never push breaking code. You have some context left, so go ahead and update documentation with progress and a note on current directory structure. Consider all documents that need to be update.

## Claude
