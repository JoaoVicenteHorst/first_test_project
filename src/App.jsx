import { useState } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import Login from './components/Login';
import Register from './components/Register';
import UserManagement from './components/UserManagement';
import './App.css';

function AppContent() {
  const { isAuthenticated, loading } = useAuth();
  const [showLogin, setShowLogin] = useState(true);

  if (loading) {
    return (
      <div className="loading" style={{ minHeight: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        <div className="spinner"></div>
        <p>Loading...</p>
      </div>
    );
  }

  if (!isAuthenticated()) {
    return showLogin ? (
      <Login onSwitchToRegister={() => setShowLogin(false)} />
    ) : (
      <Register onSwitchToLogin={() => setShowLogin(true)} />
    );
  }

  return <UserManagement />;
}

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;


