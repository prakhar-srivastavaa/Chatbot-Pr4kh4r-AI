import { useState, useEffect } from "react";
import { Chat } from "./components/Chat";
import { Login } from "./components/Login";
import { Profile } from "./components/Profile";
import { OAuthCallback } from "./components/OAuthCallback";
import { PasswordPrompt } from "./components/PasswordPrompt";
import { ThemeProvider } from "./components/ThemeProvider";
import { UserProvider, useUser } from "./context/UserContext";

function AppContent() {
  const { isAuthenticated, login } = useUser();
  const [currentView, setCurrentView] = useState<'chat' | 'profile' | 'oauth-callback'>('chat');
  const [oauthProvider, setOauthProvider] = useState<'google' | 'github' | null>(null);
  const [showPasswordPrompt, setShowPasswordPrompt] = useState(false);
  const [oauthUserData, setOauthUserData] = useState<any>(null);

  // Check if we're returning from OAuth
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const code = urlParams.get('code');
    
    if (code) {
      // Determine provider from URL path
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
    console.log(`OAuth login initiated for ${provider}`);
  };

  const handleOAuthComplete = (userData: any) => {
    // Store user data and show password prompt
    setOauthUserData(userData);
    setShowPasswordPrompt(true);
    setCurrentView('chat');
  };

  const handlePasswordSet = (password: string) => {
    if (oauthUserData) {
      // Merge password with OAuth user data
      const userWithPassword = {
        ...oauthUserData,
        password, // Note: In production, hash this on backend
      };
      login(userWithPassword);
      setShowPasswordPrompt(false);
      setOauthUserData(null);
    }
  };

  return (
    <div className="h-screen w-full">
      {currentView === 'oauth-callback' && oauthProvider ? (
        <OAuthCallback 
          provider={oauthProvider} 
          onComplete={handleOAuthComplete}
        />
      ) : !isAuthenticated ? (
        <Login onLogin={handleLogin} onOAuthLogin={handleOAuthLogin} />
      ) : currentView === 'profile' ? (
        <Profile onBack={() => setCurrentView('chat')} />
      ) : (
        <Chat onNavigateToProfile={() => setCurrentView('profile')} />
      )}
      
      {/* Password prompt after OAuth login */}
      <PasswordPrompt
        open={showPasswordPrompt}
        userData={oauthUserData}
        onComplete={handlePasswordSet}
        onSkip={() => {
          // Skip password, login without it
          if (oauthUserData) {
            login(oauthUserData);
          }
          setShowPasswordPrompt(false);
          setOauthUserData(null);
        }}
      />
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