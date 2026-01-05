import { useState } from "react";
import { Chat } from "./components/Chat";
import { Login } from "./components/Login";
import { ThemeProvider } from "./components/ThemeProvider";

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(true); // Changed to true to preview chat interface

  const handleLogin = (email: string, password: string) => {
    // In a real app, you would validate credentials with a backend
    console.log("Login attempt:", email);
    setIsAuthenticated(true);
  };

  return (
    <ThemeProvider defaultTheme="dark">
      <div className="h-screen w-full">
        {isAuthenticated ? <Chat /> : <Login onLogin={handleLogin} />}
      </div>
    </ThemeProvider>
  );
}