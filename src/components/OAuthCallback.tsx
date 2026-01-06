import { useEffect } from 'react';

interface OAuthCallbackProps {
  provider: 'google' | 'github';
  onComplete: (userData: any) => void;
}

export function OAuthCallback({ provider, onComplete }: OAuthCallbackProps) {

  useEffect(() => {
    const handleCallback = async () => {
      try {
        const urlParams = new URLSearchParams(window.location.search);
        const code = urlParams.get('code');
        const error = urlParams.get('error');

        if (error) {
          console.error('OAuth error:', error);
          alert(`OAuth failed: ${error}`);
          onComplete(null);
          return;
        }

        if (!code) {
          console.error('No authorization code received');
          onComplete(null);
          return;
        }

        // Exchange code for access token via backend
        try {
          const backendUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:3031';
          const response = await fetch(`${backendUrl}/api/auth/${provider}/callback`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ code }),
          });

          if (!response.ok) {
            throw new Error('Backend OAuth exchange failed');
          }

          const { user: userData } = await response.json();
          
          console.log(`✅ OAuth login successful for ${provider}:`, userData);
          
          const userProfile = {
            ...userData,
            createdAt: new Date().toISOString(),
            lastLogin: new Date().toISOString(),
          };

          // Pass user data to parent to show password prompt
          onComplete(userProfile);
        } catch (fetchError) {
          console.error('Failed to exchange OAuth code:', fetchError);
          console.warn('Make sure backend server is running on http://localhost:3031');
          onComplete(null);
        }
        
        // Clean up URL
        window.history.replaceState({}, document.title, '/');
      } catch (error) {
        console.error('OAuth callback error:', error);
        onComplete(null);
      }
    };

    handleCallback();
  }, [provider, onComplete]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
        <p className="text-muted-foreground">Completing authentication...</p>
      </div>
    </div>
  );
}
