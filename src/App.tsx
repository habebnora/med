import { useState, useEffect } from 'react';
import { LoginPage } from './components/LoginPage';
import { DashboardPage } from './components/DashboardPage';
import { Toaster } from './components/ui/sonner';

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const loggedIn = localStorage.getItem('isLoggedIn');
    if (loggedIn === 'true') {
      setIsLoggedIn(true);
    }
  }, []);

  const handleLogin = () => {
    setIsLoggedIn(true);
    localStorage.setItem('isLoggedIn', 'true');
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    localStorage.removeItem('isLoggedIn');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50" dir="rtl">
      {!isLoggedIn ? (
        <LoginPage onLogin={handleLogin} />
      ) : (
        <DashboardPage onLogout={handleLogout} />
      )}
      <Toaster position="top-center" richColors />
    </div>
  );
}