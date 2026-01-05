import { useEffect } from 'react';
import { useUser } from '../context/UserContext';

interface OAuthCallbackProps {
  provider: 'google' | 'github';
  onComplete: () => void;
}

export function OAuthCallback({ provider, onComplete }: OAuthCallbackProps) {
  const { login } = useUser();

  useEffect(() => {
    const handleCallback = async () => {
      try {
        const urlParams = new URLSearchParams(window.location.search);
        const code = urlParams.get('code');
        const error = urlParams.get('error');

        if (error) {
          console.error('OAuth error:', error);
          alert(`OAuth failed: ${error}`);
          onComplete();
          return;
        }

        if (!code) {
          console.error('No authorization code received');
          onComplete();
          return;
        }

        // In a real app, you would send the code to your backend
        // For now, we'll create a mock user based on the provider
        const mockUser = {
          id: Date.now().toString(),
          email: `user@${provider}.com`,
          name: `${provider.charAt(0).toUpperCase() + provider.slice(1)} User`,
          avatar: provider === 'github' 
            ? 'https://github.com/identicons/user.png'
            : undefined,
          provider,
          createdAt: new Date().toISOString(),
          lastLogin: new Date().toISOString(),
        };

        login(mockUser);
        
        // Clean up URL
        window.history.replaceState({}, document.title, '/');
        onComplete();
      } catch (error) {
        console.error('OAuth callback error:', error);
        onComplete();
      }
    };

    handleCallback();
  }, [provider, login, onComplete]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
        <p className="text-muted-foreground">Completing authentication...</p>
      </div>
    </div>
  );
}
