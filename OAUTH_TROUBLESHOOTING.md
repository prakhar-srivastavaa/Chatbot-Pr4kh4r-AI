# OAuth Troubleshooting Guide

## Current Setup Status

Your app now has:
- ✅ OAuth configuration with Vite environment variables
- ✅ Google and GitHub OAuth buttons
- ✅ OAuth redirect flow implementation
- ✅ Callback handler for OAuth returns
- ✅ TypeScript type definitions

## How OAuth Works in This App

### 1. **User Clicks OAuth Button**
- Triggers `initiateOAuthLogin(provider)` function
- Constructs OAuth URL with your Client ID
- Redirects browser to Google/GitHub login page

### 2. **User Logs In on Provider**
- User authenticates on Google/GitHub
- Provider redirects back to your app with `code` parameter
- URL will be: `http://localhost:3030/auth/google/callback?code=xxxxx`

### 3. **App Handles Callback**
- `OAuthCallback` component detects the `code` parameter
- In production: sends code to backend to exchange for access token
- Currently: creates a mock user (since no backend yet)

## ⚠️ Important: OAuth Requires Backend

**OAuth cannot work fully without a backend server** because:
- Client secrets must be kept secure (server-side only)
- Token exchange must happen server-side
- Frontend-only OAuth is a security risk

### What Works Now (Without Backend):
- ✅ OAuth button redirects to Google/GitHub
- ✅ User can authenticate
- ✅ Gets redirected back with authorization code
- ❌ Cannot exchange code for access token (needs backend)
- ✅ Creates mock user for development

### What You Need for Full OAuth:

**Option 1: Express Backend (Recommended)**

Create `server.js`:
```javascript
const express = require('express');
const axios = require('axios');
require('dotenv').config();

const app = express();
app.use(express.json());

// Google OAuth
app.post('/api/auth/google/callback', async (req, res) => {
  const { code } = req.body;
  
  const tokenResponse = await axios.post('https://oauth2.googleapis.com/token', {
    code,
    client_id: process.env.GOOGLE_CLIENT_ID,
    client_secret: process.env.GOOGLE_CLIENT_SECRET, // Add this to .env
    redirect_uri: process.env.VITE_GOOGLE_REDIRECT_URI,
    grant_type: 'authorization_code',
  });

  const { access_token } = tokenResponse.data;
  
  const userResponse = await axios.get('https://www.googleapis.com/oauth2/v2/userinfo', {
    headers: { Authorization: \`Bearer \${access_token}\` },
  });

  res.json(userResponse.data);
});

app.listen(3001, () => console.log('Server on port 3001'));
```

**Option 2: Use Firebase Auth**
- Free and managed
- No backend code needed
- Handles OAuth automatically
- See: https://firebase.google.com/docs/auth

**Option 3: Use Supabase Auth**
- Free tier available
- Built-in OAuth
- See: https://supabase.com/docs/guides/auth

## 🔧 Testing OAuth (Without Backend)

### What Happens Now:
1. Click Google/GitHub button
2. Redirects to provider login
3. After login, redirects back with code
4. App creates mock user and logs you in
5. You're in the chat interface

This is sufficient for **frontend development and testing**.

## 🐛 Common Issues

### "OAuth button does nothing"
**Check:**
```bash
# 1. Verify .env has your Client IDs
cat .env

# 2. Restart dev server after .env changes
npm run dev
```

### "Redirect URI mismatch"
**Fix:**
1. Go to your OAuth app settings (Google/GitHub)
2. Make sure redirect URI is EXACTLY: `http://localhost:3030/auth/google/callback` (or github)
3. No trailing slashes, no extra characters

### "Client ID is undefined"
**Fix:**
1. Make sure .env variables start with `VITE_`
2. Restart dev server: `npm run dev`
3. Check console: `console.log(import.meta.env.VITE_GOOGLE_CLIENT_ID)`

### "Gets stuck on loading screen"
**Check browser console for errors:**
- Open DevTools (F12)
- Look for red errors
- Share the error message

## 📋 Quick Checklist

- [ ] Created OAuth apps on Google/GitHub
- [ ] Copied Client IDs to .env file
- [ ] Restarted dev server after .env changes
- [ ] Redirect URIs match exactly in OAuth app settings
- [ ] No typos in .env variable names (must start with VITE_)
- [ ] Browser allows popups/redirects (not blocked)

## 🎯 Next Steps

### For Development:
Current setup is fine! OAuth redirects work, mock login happens.

### For Production:
1. **Set up backend** (Express/Firebase/Supabase)
2. **Add Client Secrets** to backend .env (not frontend!)
3. **Update callback handler** to use real backend API
4. **Test with real OAuth flow**
5. **Deploy both frontend and backend**

## 💡 Quick Test

Run this in browser console:
```javascript
console.log('Google Client ID:', import.meta.env.VITE_GOOGLE_CLIENT_ID);
console.log('GitHub Client ID:', import.meta.env.VITE_GITHUB_CLIENT_ID);
```

If these show your actual Client IDs, the .env is working!

## 📞 Still Stuck?

1. Check browser console for errors
2. Check network tab for failed requests
3. Verify OAuth app settings on Google/GitHub
4. Make sure redirect URIs match EXACTLY
5. Try in incognito mode to rule out cookie issues
