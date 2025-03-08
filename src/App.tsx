import React, { useState, useEffect } from 'react';
import SignUp from './components/SignUp';
import Login from './components/Login';
import Dashboard from './components/Dashboard';
import CreditAlert from './components/CreditAlert';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showSignup, setShowSignup] = useState(false);
  const [user, setUser] = useState<{ userName: string; credits: number } | null>(null);
  const [showCreditAlert, setShowCreditAlert] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const userData = localStorage.getItem('user');
    if (token && userData) {
      setIsLoggedIn(true);
      setUser(JSON.parse(userData));
    }
  }, []);

  useEffect(() => {
    if (user && user.credits < 50) {
      setShowCreditAlert(true);
    }
  }, [user]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setIsLoggedIn(false);
    setUser(null);
  };

  if (!isLoggedIn) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          {showSignup ? (
            <SignUp onSuccess={() => setShowSignup(false)} />
          ) : (
            <Login 
              onSuccess={(userData) => {
                setIsLoggedIn(true);
                setUser(userData);
              }}
              onSignupClick={() => setShowSignup(true)}
            />
          )}
        </div>
      </div>
    );
  }

  return (
    <>
      {showCreditAlert && <CreditAlert onClose={() => setShowCreditAlert(false)} />}
      <Dashboard user={user!} onLogout={handleLogout} />
    </>
  );
}

export default App