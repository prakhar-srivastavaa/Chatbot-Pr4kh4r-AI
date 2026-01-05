# ✅ Complete Setup Checklist

## Step 1: Install Dependencies
```bash
npm install
```
- [x] All packages installed
- [x] TypeScript types added (@types/react, @types/node)

## Step 2: OAuth Setup

### Google OAuth
1. [ ] Go to [Google Cloud Console](https://console.cloud.google.com/)
2. [ ] Create new project or select existing
3. [ ] Enable Google+ API
4. [ ] Create OAuth 2.0 Client ID
5. [ ] Configure consent screen (add yourself as test user)
6. [ ] Set redirect URI: `http://localhost:3030/auth/google/callback`
7. [ ] Copy Client ID
8. [ ] Paste in `.env` as `VITE_GOOGLE_CLIENT_ID`

### GitHub OAuth
1. [ ] Go to [GitHub Developer Settings](https://github.com/settings/developers)
2. [ ] Click "New OAuth App"
3. [ ] Set Homepage URL: `http://localhost:3030`
4. [ ] Set Authorization callback URL: `http://localhost:3030/auth/github/callback`
5. [ ] Copy Client ID
6. [ ] Paste in `.env` as `VITE_GITHUB_CLIENT_ID`

### Environment Variables
```env
VITE_GOOGLE_CLIENT_ID=your_google_client_id
VITE_GOOGLE_REDIRECT_URI=http://localhost:3030/auth/google/callback
VITE_GITHUB_CLIENT_ID=your_github_client_id
VITE_GITHUB_REDIRECT_URI=http://localhost:3030/auth/github/callback
```

## Step 3: Run the App
```bash
npm run dev
```
- [ ] Dev server starts without errors
- [ ] App loads in browser
- [ ] No console errors

## Step 4: Test Login

### Email/Password Login (Works Immediately)
- [ ] Can open login page
- [ ] Can enter email and password
- [ ] Can log in successfully
- [ ] Redirects to chat interface

### OAuth Login (Requires Setup)
- [ ] Google button redirects to Google login
- [ ] GitHub button redirects to GitHub login
- [ ] After login, redirects back to app
- [ ] Creates user profile
- [ ] Shows chat interface

## Step 5: Test Features

### Profile
- [ ] Click user avatar in sidebar
- [ ] Click "Profile" in dropdown
- [ ] Can see profile information
- [ ] Can edit name, phone, bio
- [ ] Can save changes
- [ ] Changes persist after refresh

### Chat
- [ ] Can create new chat
- [ ] Can send messages
- [ ] Can see AI responses
- [ ] Chats appear in "Recents" section
- [ ] Can switch between chats
- [ ] Can delete chats

### Sidebar
- [ ] Can drag separator to resize sidebar
- [ ] Sidebar width changes
- [ ] Chat area adjusts accordingly
- [ ] Min/max width constraints work

### Theme
- [ ] Can toggle dark/light theme
- [ ] Theme persists after refresh
- [ ] All components respect theme

## Common Issues & Fixes

### ❌ OAuth buttons don't redirect
**Solution:**
- Check `.env` file has Client IDs
- Restart dev server after .env changes
- Verify Client IDs are correct (no spaces, quotes)

### ❌ "Redirect URI mismatch" error
**Solution:**
- Check OAuth app settings
- Make sure redirect URI EXACTLY matches: `http://localhost:3030/auth/google/callback`
- No trailing slash, no extra characters

### ❌ TypeScript errors
**Solution:**
```bash
npm install --save-dev @types/react @types/react-dom @types/node
```

### ❌ "Cannot find module" errors
**Solution:**
```bash
rm -rf node_modules package-lock.json
npm install
```

### ❌ Port already in use
**Solution:**
- Kill process on port 5173
- Or let Vite use another port (it will auto-detect)

## Production Deployment

### Before Deploying:
- [ ] Set up backend server for OAuth (see SETUP.md)
- [ ] Add Client Secrets to backend
- [ ] Update redirect URIs to production URLs
- [ ] Test OAuth flow with production URLs
- [ ] Set up database for user persistence
- [ ] Configure CORS properly
- [ ] Add rate limiting
- [ ] Enable HTTPS

### Deploy Frontend:
```bash
npm run build
# Deploy dist/ folder to Vercel/Netlify
```

### Deploy Backend:
- Deploy to Railway/Render/Heroku
- Add environment variables
- Update frontend to use backend URL

## 🎉 Success Indicators

✅ App runs without console errors
✅ Can log in with email/password
✅ OAuth redirects work
✅ Profile shows user data
✅ Chats save and persist
✅ Sidebar resizes correctly
✅ Theme toggle works
✅ Data persists after refresh

## 📚 Documentation

- [OAUTH_SETUP.md](./OAUTH_SETUP.md) - Detailed OAuth setup instructions
- [OAUTH_TROUBLESHOOTING.md](./OAUTH_TROUBLESHOOTING.md) - OAuth debugging guide
- [SETUP.md](./SETUP.md) - Complete project setup
- [README.md](./README.md) - Project overview

## 🆘 Need Help?

1. Check browser console for errors (F12)
2. Read OAUTH_TROUBLESHOOTING.md
3. Verify .env file is correct
4. Make sure dev server restarted after .env changes
5. Try incognito mode to rule out cache issues
