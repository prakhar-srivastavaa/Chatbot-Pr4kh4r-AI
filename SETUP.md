# Pr4kh4r AI Chatbot - Setup Instructions

## Prerequisites

- Node.js (v18 or higher)
- npm or yarn package manager
- Git (optional, for version control)

## Installation

1. **Clone or download the project**
   ```bash
   cd "z:\$100,000,000\chatbot (Community)"
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

## OAuth Setup (Google & GitHub)

### Google OAuth Setup

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Enable the Google+ API
4. Go to "Credentials" → "Create Credentials" → "OAuth 2.0 Client ID"
5. Configure the OAuth consent screen
6. Set authorized redirect URIs:
   - `http://localhost:3030/auth/google/callback` (for development)
   - `https://yourdomain.com/auth/google/callback` (for production)
7. Copy the Client ID

### GitHub OAuth Setup

1. Go to [GitHub Developer Settings](https://github.com/settings/developers)
2. Click "New OAuth App"
3. Fill in the application details:
   - **Application name**: Pr4kh4r AI Chatbot
   - **Homepage URL**: `http://localhost:3030` (or your domain)
   - **Authorization callback URL**: `http://localhost:3030/auth/github/callback`
4. Copy the Client ID and generate a Client Secret

### Configure Environment Variables

1. Create a `.env` file in the root directory:
   ```bash
   cp .env.example .env
   ```

2. Edit the `.env` file and add your OAuth credentials:
   ```env
   VITE_GOOGLE_CLIENT_ID=your_google_client_id_here
   VITE_GOOGLE_REDIRECT_URI=http://localhost:3030/auth/google/callback

   VITE_GITHUB_CLIENT_ID=your_github_client_id_here
   VITE_GITHUB_REDIRECT_URI=http://localhost:3030/auth/github/callback
   ```

## Backend Setup (Required for OAuth)

**Important**: OAuth requires a backend server to securely handle token exchanges. The current implementation provides the frontend structure, but you need to set up a backend.

### Option 1: Express.js Backend

Create a simple Express server:

```javascript
// server.js
const express = require('express');
const axios = require('axios');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

// Google OAuth callback
app.post('/api/auth/google/callback', async (req, res) => {
  const { code } = req.body;
  try {
    const tokenResponse = await axios.post('https://oauth2.googleapis.com/token', {
      code,
      client_id: process.env.GOOGLE_CLIENT_ID,
      client_secret: process.env.GOOGLE_CLIENT_SECRET,
      redirect_uri: process.env.GOOGLE_REDIRECT_URI,
      grant_type: 'authorization_code',
    });

    const { access_token } = tokenResponse.data;
    
    // Get user info
    const userResponse = await axios.get('https://www.googleapis.com/oauth2/v2/userinfo', {
      headers: { Authorization: `Bearer ${access_token}` },
    });

    res.json({ user: userResponse.data, token: access_token });
  } catch (error) {
    res.status(400).json({ error: 'Authentication failed' });
  }
});

// GitHub OAuth callback
app.post('/api/auth/github/callback', async (req, res) => {
  const { code } = req.body;
  try {
    const tokenResponse = await axios.post('https://github.com/login/oauth/access_token', {
      code,
      client_id: process.env.GITHUB_CLIENT_ID,
      client_secret: process.env.GITHUB_CLIENT_SECRET,
      redirect_uri: process.env.GITHUB_REDIRECT_URI,
    }, {
      headers: { Accept: 'application/json' },
    });

    const { access_token } = tokenResponse.data;
    
    // Get user info
    const userResponse = await axios.get('https://api.github.com/user', {
      headers: { Authorization: `Bearer ${access_token}` },
    });

    res.json({ user: userResponse.data, token: access_token });
  } catch (error) {
    res.status(400).json({ error: 'Authentication failed' });
  }
});

app.listen(3001, () => console.log('Auth server running on port 3001'));
```

Install backend dependencies:
```bash
npm install express axios cors dotenv
```

### Option 2: Firebase Authentication

Use Firebase Authentication for a managed solution. See [Firebase Auth Docs](https://firebase.google.com/docs/auth).

## Running the Application

1. **Start the development server**
   ```bash
   npm run dev
   ```

2. **If using custom backend, start it separately**
   ```bash
   node server.js
   ```

3. Open your browser and navigate to `http://localhost:3030`

## Features

- ✅ Dark/Light theme toggle
- ✅ Resizable sidebar (drag the separator between sidebar and chat)
- ✅ Recent chats tracking
- ✅ Responsive design (mobile-friendly)
- ✅ OAuth login (Google & GitHub)
- ✅ Chat history management

## Responsive Design

The application is fully responsive:
- **Desktop**: Full sidebar with resizable panels
- **Tablet (< 768px)**: Sidebar becomes toggleable
- **Mobile (< 640px)**: Optimized layout with hidden resize handle

## Troubleshooting

### OAuth not working
- Ensure your `.env` file has the correct credentials
- Check that redirect URIs match exactly in OAuth provider settings
- Make sure your backend server is running
- Check browser console for errors

### Sidebar not resizing
- Ensure you're dragging the thin vertical line between sidebar and chat
- The sidebar has min width of 200px and max width of 480px
- On mobile devices (< 640px), resizing is disabled

### Build fails
- Clear node_modules and reinstall: `rm -rf node_modules && npm install`
- Check Node.js version: `node --version` (should be v18+)

## Production Deployment

1. **Build the application**
   ```bash
   npm run build
   ```

2. **Update OAuth redirect URIs** to your production domain

3. **Deploy** to your hosting service (Vercel, Netlify, etc.)

4. **Set environment variables** in your hosting platform

## Security Notes

- Never commit `.env` file to version control
- Keep OAuth client secrets secure (server-side only)
- Use HTTPS in production
- Implement proper session management
- Add rate limiting to prevent abuse

## Support

For issues or questions, please open an issue in the repository.

## License

MIT License
