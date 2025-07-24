import React, { useState, useEffect } from "react";
import BotScreen from "./pages/BotScreen";
import LoginScreen from "./pages/LoginScreen";
import RegisterScreen from "./pages/RegisterScreen";

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showRegister, setShowRegister] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('userToken');
    const userId = localStorage.getItem('userId');
    const userData = localStorage.getItem('userData');
    
    if (token && userId) {
      setIsAuthenticated(true);
      const user = userData ? JSON.parse(userData) : { id: userId };
      setUser(user);
    }
    
    setLoading(false);
  }, []);

  const handleLogin = (userData) => {
    setIsAuthenticated(true);
    setUser(userData);
    setShowRegister(false);
  };

  const handleRegister = (userData) => {
    setIsAuthenticated(true);
    setUser(userData);
    setShowRegister(false);
  };

  const handleLogout = () => {
    localStorage.removeItem('userToken');
    localStorage.removeItem('userId');
    localStorage.removeItem('userData');
    setIsAuthenticated(false);
    setUser(null);
  };

  if (loading) {
    return (
      <div style={{
        minHeight: '100vh',
        background: 'linear-gradient(180deg, #111118 0%, #353345 100%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: '#ffffff',
        fontFamily: 'Galano Grotesque, Inter, Arial, sans-serif'
      }}>
        Yükleniyor...
      </div>
    );
  }

  if (!isAuthenticated) {
    if (showRegister) {
      return (
        <RegisterScreen 
          onRegister={handleRegister}
          onSwitchToLogin={() => setShowRegister(false)}
        />
      );
    } else {
      return (
        <LoginScreen 
          onLogin={handleLogin}
          onSwitchToRegister={() => setShowRegister(true)}
        />
      );
    }
  }

  return <BotScreen user={user} onLogout={handleLogout} />;
}

export default App;
