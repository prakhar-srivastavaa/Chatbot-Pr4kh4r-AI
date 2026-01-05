# OAuth Setup Guide

## 🔐 Getting Your OAuth Credentials

### Google OAuth (5 minutes)

1. **Go to Google Cloud Console**: https://console.cloud.google.com/
2. **Create a new project** (or select existing)
3. **Enable APIs**:
   - Click "APIs & Services" → "Enable APIs and Services"
   - Search for "Google+ API" and enable it
4. **Create OAuth Credentials**:
   - Go to "Credentials" → "Create Credentials" → "OAuth 2.0 Client ID"
   - If prompted, configure the OAuth consent screen first:
     - User Type: External
     - App name: "Pr4kh4r AI Chatbot"
     - User support email: your-email@gmail.com
     - Add your email in "Developer contact information"
     - Save and continue through the scopes (no need to add any)
     - Add test users: your-email@gmail.com
5. **Configure OAuth Client**:
   - Application type: "Web application"
   - Name: "Pr4kh4r Chatbot"
   - Authorized redirect URIs:
     - http://localhost:3030/auth/google/callback
     - (Add production URL later)
6. **Copy your credentials**:
   - Copy the "Client ID" (looks like: xxxxx.apps.googleusercontent.com)
   - Paste it in your `.env` file as `VITE_GOOGLE_CLIENT_ID`

### GitHub OAuth (3 minutes)

1. **Go to GitHub Settings**: https://github.com/settings/developers
2. **Click "New OAuth App"**
3. **Fill in the form**:
   - Application name: "Pr4kh4r AI Chatbot"
   - Homepage URL: http://localhost:3030
   - Authorization callback URL: http://localhost:3030/auth/github/callback
   - Application description: (optional)
4. **Register application**
5. **Copy your credentials**:
   - Copy the "Client ID"
   - Paste it in your `.env` file as `VITE_GITHUB_CLIENT_ID`

## ⚠️ Important Notes

- **Client Secret**: For security, OAuth requires a backend server. The client secrets should NEVER be in your frontend code or .env file.
- **Backend Required**: You'll need a backend server (see SETUP.md) to complete the OAuth flow securely.
- **Test Users**: In development, make sure to add yourself as a test user in Google OAuth consent screen.

## ✅ Your .env file should look like:

```env
# Google OAuth
VITE_GOOGLE_CLIENT_ID=123456789-abcdefghijk.apps.googleusercontent.com
VITE_GOOGLE_REDIRECT_URI=http://localhost:3030/auth/google/callback

# GitHub OAuth
VITE_GITHUB_CLIENT_ID=Iv1.a1b2c3d4e5f6g7h8
VITE_GITHUB_REDIRECT_URI=http://localhost:3030/auth/github/callback
```

## 🚀 Quick Test (Without Backend)

For development/testing without a backend, you can use mock authentication:
- The app is already set up to accept email/password login
- OAuth buttons will redirect but won't complete without a backend
- See SETUP.md for backend implementation

## 📚 Need Help?

- Google OAuth docs: https://developers.google.com/identity/protocols/oauth2
- GitHub OAuth docs: https://docs.github.com/en/apps/oauth-apps/building-oauth-apps/authorizing-oauth-apps
