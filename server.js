// Simple OAuth Backend Server for Development
// This server handles OAuth token exchange securely

import express from 'express';
import cors from 'cors';
import fetch from 'node-fetch';
import dotenv from 'dotenv';

// Load environment variables from .env file
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3031;

app.use(cors());
app.use(express.json());

// Environment variables
const GOOGLE_CLIENT_ID = process.env.VITE_GOOGLE_CLIENT_ID;
const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET;
const GITHUB_CLIENT_ID = process.env.VITE_GITHUB_CLIENT_ID;
const GITHUB_CLIENT_SECRET = process.env.GITHUB_CLIENT_SECRET;

// Validate environment variables
if (!GOOGLE_CLIENT_ID || !GOOGLE_CLIENT_SECRET) {
  console.warn('⚠️  Google OAuth credentials missing in .env file');
}
if (!GITHUB_CLIENT_ID || !GITHUB_CLIENT_SECRET) {
  console.warn('⚠️  GitHub OAuth credentials missing in .env file');
}

// Google OAuth callback
app.post('/api/auth/google/callback', async (req, res) => {
  try {
    const { code } = req.body;
    
    console.log('📥 Received Google OAuth callback with code');
    
    // Exchange code for access token
    const tokenResponse = await fetch('https://oauth2.googleapis.com/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        code,
        client_id: GOOGLE_CLIENT_ID,
        client_secret: GOOGLE_CLIENT_SECRET,
        redirect_uri: 'http://localhost:3030/auth/google/callback',
        grant_type: 'authorization_code',
      }),
    });

    const tokens = await tokenResponse.json();
    
    if (!tokens.access_token) {
      console.error('❌ Failed to get access token:', tokens);
      throw new Error(tokens.error_description || 'Failed to get access token');
    }
    
    console.log('✅ Got access token, fetching user info...');

    // Get user info
    const userResponse = await fetch('https://www.googleapis.com/oauth2/v2/userinfo', {
      headers: {
        Authorization: `Bearer ${tokens.access_token}`,
      },
    });

    const userData = await userResponse.json();
    
    console.log('✅ Google user data fetched:', userData.email);

    res.json({
      user: {
        id: userData.id,
        email: userData.email,
        name: userData.name,
        avatar: userData.picture,
        provider: 'google',
      },
      accessToken: tokens.access_token,
    });
  } catch (error) {
    console.error('❌ Google OAuth error:', error.message);
    res.status(500).json({ error: error.message || 'OAuth authentication failed' });
  }
});

// GitHub OAuth callback
app.post('/api/auth/github/callback', async (req, res) => {
  try {
    const { code } = req.body;
    
    console.log('📥 Received GitHub OAuth callback with code');
    
    // Exchange code for access token
    const tokenResponse = await fetch('https://github.com/login/oauth/access_token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify({
        client_id: GITHUB_CLIENT_ID,
        client_secret: GITHUB_CLIENT_SECRET,
        code,
        redirect_uri: 'http://localhost:3030/auth/github/callback',
      }),
    });

    const tokens = await tokenResponse.json();
    
    if (!tokens.access_token) {
      console.error('❌ Failed to get access token:', tokens);
      throw new Error(tokens.error_description || 'Failed to get access token');
    }
    
    console.log('✅ Got access token, fetching user info...');

    // Get user info
    const userResponse = await fetch('https://api.github.com/user', {
      headers: {
        Authorization: `Bearer ${tokens.access_token}`,
        'Accept': 'application/json',
      },
    });

    const userData = await userResponse.json();

    // Get user email if not public
    let email = userData.email;
    if (!email) {
      const emailResponse = await fetch('https://api.github.com/user/emails', {
        headers: {
          Authorization: `Bearer ${tokens.access_token}`,
          'Accept': 'application/json',
        },
      });
      const emails = await emailResponse.json();
      const primaryEmail = emails.find(e => e.primary);
      email = primaryEmail?.email || `${userData.login}@github.com`;
    }
    
    console.log('✅ GitHub user data fetched:', userData.login);

    res.json({
      user: {
        id: userData.id.toString(),
        email,
        name: userData.name || userData.login,
        avatar: userData.avatar_url,
        provider: 'github',
      },
      accessToken: tokens.access_token,
    });
  } catch (error) {
    console.error('❌ GitHub OAuth error:', error.message);
    res.status(500).json({ error: error.message || 'OAuth authentication failed' });
  }
});

app.listen(PORT, () => {
  console.log('\n🚀 OAuth Backend Server Started!');
  console.log(`📍 Server: http://localhost:${PORT}`);
  console.log('\n📋 Configuration:');
  console.log(`   Google Client ID: ${GOOGLE_CLIENT_ID ? '✅ Set' : '❌ Missing'}`);
  console.log(`   Google Secret: ${GOOGLE_CLIENT_SECRET ? '✅ Set' : '❌ Missing'}`);
  console.log(`   GitHub Client ID: ${GITHUB_CLIENT_ID ? '✅ Set' : '❌ Missing'}`);
  console.log(`   GitHub Secret: ${GITHUB_CLIENT_SECRET ? '✅ Set' : '❌ Missing'}`);
  console.log('\n⚡ Ready to handle OAuth requests!\n');
});
