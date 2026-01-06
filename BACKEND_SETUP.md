# 🔧 Backend Server Setup for OAuth

## Why Do You Need This?

OAuth requires a backend server to securely exchange authorization codes for access tokens. This keeps your client secrets safe and allows you to fetch real user data (name, email, profile picture) from Google/GitHub.

## Quick Setup (5 minutes)

### 1. Get Your Client Secrets

**Google:**
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Select your project → Credentials → Your OAuth Client
3. Copy the **Client Secret** (not the Client ID)

**GitHub:**
1. Go to [GitHub OAuth Apps](https://github.com/settings/developers)
2. Select your OAuth App
3. Click "Generate a new client secret"
4. Copy the secret immediately (it won't be shown again)

### 2. Add Secrets to .env

```env
GOOGLE_CLIENT_SECRET=GOCSPX-xxxxxxxxxxxxxxxxxxxxx
GITHUB_CLIENT_SECRET=ghp_xxxxxxxxxxxxxxxxxxxxxxxxxxxx
```

⚠️ **Never commit these secrets to git!** Make sure `.env` is in your `.gitignore`.

### 3. Install Backend Dependencies

```bash
# Install backend packages
npm install express cors node-fetch dotenv --save
```

### 4. Start Both Servers

Open **two terminals**:

**Terminal 1 - Frontend (Vite):**
```bash
npm run dev
```
This starts your React app on `http://localhost:3030`

**Terminal 2 - Backend (OAuth Server):**
```bash
node server.js
```
This starts your OAuth backend on `http://localhost:3031`

## Testing OAuth

1. Open `http://localhost:3030` in your browser
2. Click "Sign in with Google" or "Sign in with GitHub"
3. Authenticate with the provider
4. You should be redirected back with your **real** profile data:
   - ✅ Your actual name
   - ✅ Your email address
   - ✅ Your profile picture

## Troubleshooting

### "Backend OAuth exchange failed"
- Make sure backend server is running on port 3031
- Check that client secrets are set in `.env`
- Verify the secrets are correct (no extra spaces)

### Still seeing "Google User" / "GitHub User"?
- This is the fallback when the backend isn't running
- Start the backend server: `node server.js`
- Check browser console for error messages

### "CORS error"
- Make sure both servers are running
- Backend should log: `🚀 OAuth backend server running on http://localhost:3031`

## Production Deployment

For production, you'll need to:
1. Deploy the backend server (Heroku, Railway, Vercel serverless, etc.)
2. Update `VITE_BACKEND_URL` to your production backend URL
3. Add production redirect URIs to Google/GitHub OAuth apps
4. Use environment variables for all secrets (never hardcode)

## Alternative: Serverless Functions

Instead of running a Node.js server, you can use serverless functions:
- **Vercel**: Create `api/auth/[provider]/callback.ts`
- **Netlify**: Create `netlify/functions/oauth-callback.ts`
- **AWS Lambda**: Deploy as Lambda function with API Gateway

See your hosting provider's docs for OAuth implementation examples.
