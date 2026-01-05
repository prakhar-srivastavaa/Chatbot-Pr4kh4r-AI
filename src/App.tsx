import { useState, useEffect } from "react";
import { Chat } from "./components/Chat";
import { Login } from "./components/Login";
import { Profile } from "./components/Profile";
import { OAuthCallback } from "./components/OAuthCallback";
import { ThemeProvider } from "./components/ThemeProvider";
import { UserProvider, useUser } from "./context/UserContext";

function AppContent() {
  const { isAuthenticated, login } = useUser();
  const [currentView, setCurrentView] = useState<'chat' | 'profile' | 'oauth-callback'>('chat');
  const [oauthProvider, setOauthProvider] = useState<'google' | 'github' | null>(null);

  // Check if we're returning from OAuth
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const code = urlParams.get('code');
    const state = urlParams.get('state');
    
    if (code) {
      // Determine provider from state or URL
      const path = window.location.pathname;
      if (path.includes('google')) {
        setOauthProvider('google');
        setCurrentView('oauth-callback');
      } else if (path.includes('github')) {
        setOauthProvider('github');
        setCurrentView('oauth-callback');
      }
    }
  }, []);

  const handleLogin = (email: string, password: string) => {
    // Mock login - in production, validate with backend
    const mockUser = {
      id: Date.now().toString(),
      email,
      name: email.split('@')[0],
      provider: 'email' as const,
      createdAt: new Date().toISOString(),
      lastLogin: new Date().toISOString(),
    };
    login(mockUser);
  };

  const handleOAuthLogin = async (provider: 'google' | 'github') => {
    // OAuth is handled by initiateOAuthLogin in Login component
    // This callback is for the mock/fallback scenario
    console.log(`OAuth login initiated for ${provider}`);
  };

  return (
    <div className="h-screen w-full">
      {currentView === 'oauth-callback' && oauthProvider ? (
        <OAuthCallback 
          provider={oauthProvider} 
          onComplete={() => {
            setCurrentView('chat');
            setOauthProvider(null);
          }} 
        />
      ) : !isAuthenticated ? (
        <Login onLogin={handleLogin} onOAuthLogin={handleOAuthLogin} />
      ) : currentView === 'profile' ? (
        <Profile onBack={() => setCurrentView('chat')} />
      ) : (
        <Chat onNavigateToProfile={() => setCurrentView('profile')} />
      )}
    </div>
  );
}

export default function App() {
  return (
    <ThemeProvider defaultTheme="dark">
      <UserProvider>
        <AppContent />
      </UserProvider>
    </ThemeProvider>
  );
}