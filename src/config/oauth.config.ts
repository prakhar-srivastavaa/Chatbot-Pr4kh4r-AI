// OAuth Configuration
// Replace these with your actual OAuth credentials

export const oauthConfig = {
  google: {
    clientId: import.meta.env.VITE_GOOGLE_CLIENT_ID || 'YOUR_GOOGLE_CLIENT_ID',
    redirectUri: import.meta.env.VITE_GOOGLE_REDIRECT_URI || 'http://localhost:5173/auth/google/callback',
    authEndpoint: 'https://accounts.google.com/o/oauth2/v2/auth',
    scope: 'openid email profile',
  },
  github: {
    clientId: import.meta.env.VITE_GITHUB_CLIENT_ID || 'YOUR_GITHUB_CLIENT_ID',
    redirectUri: import.meta.env.VITE_GITHUB_REDIRECT_URI || 'http://localhost:5173/auth/github/callback',
    authEndpoint: 'https://github.com/login/oauth/authorize',
    scope: 'read:user user:email',
  },
};

// OAuth Helper Functions
export const initiateOAuthLogin = (provider: 'google' | 'github') => {
  const config = oauthConfig[provider];
  
  const params = new URLSearchParams({
    client_id: config.clientId,
    redirect_uri: config.redirectUri,
    scope: config.scope,
    response_type: 'code',
    ...(provider === 'google' && { access_type: 'offline', prompt: 'consent' }),
  });

  const authUrl = `${config.authEndpoint}?${params.toString()}`;
  window.location.href = authUrl;
};

export const handleOAuthCallback = async (provider: 'google' | 'github', code: string) => {
  try {
    // In a real app, send this code to your backend
    // Your backend will exchange it for an access token
    const response = await fetch(`/api/auth/${provider}/callback`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ code }),
    });

    if (!response.ok) {
      throw new Error('OAuth authentication failed');
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('OAuth callback error:', error);
    throw error;
  }
};
