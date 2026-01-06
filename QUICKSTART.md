# 🎯 Quick Start Guide - OAuth with Real User Data

## What Changed?

Now OAuth fetches **real user data** from Google/GitHub:
- ✅ Your actual name (not "Google User")
- ✅ Your real email address
- ✅ Your profile picture from Google/GitHub
- ✅ Delete button on recent chats (hover to see)

## Setup in 3 Steps

### Step 1: Get Client Secrets

**For Google:**
1. Go to https://console.cloud.google.com/
2. Select your project → APIs & Services → Credentials
3. Click on your OAuth 2.0 Client ID
4. Copy the **Client Secret** (starts with `GOCSPX-`)

**For GitHub:**
1. Go to https://github.com/settings/developers
2. Click on your OAuth App
3. Click "Generate a new client secret"
4. Copy it immediately (you won't see it again!)

### Step 2: Add to .env File

Open `.env` and add:
```env
GOOGLE_CLIENT_SECRET=GOCSPX-your-actual-secret-here
GITHUB_CLIENT_SECRET=your-github-secret-here
```

### Step 3: Start Both Servers

**Option A: Use the convenience script (Windows)**
```bash
start-all.bat
```

**Option B: Manual (open 2 terminals)**

Terminal 1 - Backend:
```bash
node server.js
```

Terminal 2 - Frontend:
```bash
npm run dev
```

## Test It!

1. Open http://localhost:3030
2. Click "Sign in with Google" or "Sign in with GitHub"
3. Authenticate
4. Check your profile - you should see:
   - Your real name ✅
   - Your real email ✅
   - Your profile picture ✅

## New Feature: Delete Recent Chats

- Hover over any recent chat in the sidebar
- Click the 🗑️ trash icon that appears
- Chat will be deleted from history

## Troubleshooting

### "Still showing Google User"
→ Backend server not running. Start it: `node server.js`

### "Backend OAuth exchange failed"
→ Check that client secrets are in `.env` (not client IDs, the SECRETS)

### "Cannot fetch user data"
→ Make sure both servers are running (3030 for frontend, 3031 for backend)

### Port already in use
→ Stop other processes or change ports in `vite.config.ts` and `server.js`

## What If I Don't Want the Backend?

The app will work with placeholder data:
- Name: "Google User" / "GitHub User"
- Email: "user@google.com"
- No profile picture

This is fine for development, but you won't get real OAuth data.

## Need More Help?

See detailed documentation:
- [BACKEND_SETUP.md](./BACKEND_SETUP.md) - Backend server details
- [OAUTH_SETUP.md](./OAUTH_SETUP.md) - Getting OAuth credentials
- [OAUTH_TROUBLESHOOTING.md](./OAUTH_TROUBLESHOOTING.md) - Common issues
