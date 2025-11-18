import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { authAPI } from '../api/auth';
import './Auth.css';

function Login({ onSwitchToRegister }) {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    setError(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const response = await authAPI.login(formData);
      login(response.user, response.token);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <div className="auth-header">
          <h1>🔐 Login</h1>
          <p>Welcome back! Please login to your account.</p>
        </div>

        {error && (
          <div className="error-message">
            <p>⚠️ {error}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              required
              placeholder="Enter your email"
              disabled={loading}
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleInputChange}
              required
              placeholder="Enter your password"
              disabled={loading}
            />
          </div>

          <button 
            type="submit" 
            className="btn btn-primary btn-full"
            disabled={loading}
          >
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>

        <div className="auth-footer">
          <p>
            Don't have an account?{' '}
            <button 
              className="link-button" 
              onClick={onSwitchToRegister}
              disabled={loading}
            >
              Register here
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Login;


