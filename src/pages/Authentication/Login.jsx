import React, { useState, useEffect } from 'react';
import { useAuth } from "../../contexts/AuthContext";
import { useNavigate, Link } from 'react-router-dom';
import authService from '../../services/authService';

const Login = () => {
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [isReady, setIsReady] = useState(false);
  const [serverStatus, setServerStatus] = useState('checking');

  const { login } = useAuth();
  const navigate = useNavigate();

  // Check server health on component mount
  useEffect(() => {
    const checkServer = async () => {
      try {
        const isHealthy = await authService.checkServerHealth();
        setServerStatus(isHealthy ? 'online' : 'offline');
      } catch (error) {
        console.error('Server health check failed:', error);
        setServerStatus('offline');
      }
    };

    checkServer();
    setIsReady(true);
  }, []);

  // Don't render until component is ready
  if (!isReady) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center">
        <div className="text-white text-xl">Loading...</div>
      </div>
    );
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    try {
      const result = await authService.login(identifier, password);
      
      if (result.success) {
        login(result.user);
        setLoading(false);
        navigate('/');
      } else {
        setError(result.error);
        setLoading(false);
      }
    } catch (err) {
      console.error('Login error:', err);
      setError('Login failed. Please try again.');
      setLoading(false);
    }
  };

  return (
    <div className="page-container" style={{ fontFamily: "'Montserrat', 'Poppins', Arial, sans-serif" }}>
      <h1 className="section-title" style={{ fontFamily: "'Montserrat', 'Poppins', Arial, sans-serif", fontWeight: '900' }}>Login</h1>
      
      {/* Server Status Indicator */}
      {serverStatus === 'checking' && (
        <div className="text-center mb-4 p-2 bg-blue-500 bg-opacity-20 rounded text-blue-300">
          Checking server connection...
        </div>
      )}
      
      {serverStatus === 'offline' && (
        <div className="text-center mb-4 p-2 bg-red-500 bg-opacity-20 rounded text-red-300">
          ⚠️ Server connection issue. Please check your internet connection.
        </div>
      )}
      
      <div className="card">
        <form onSubmit={handleSubmit}>
          <label style={{ fontFamily: "'Montserrat', 'Poppins', Arial, sans-serif", marginBottom: '8px', display: 'block' }}>Mobile Number or Email</label>
          <input
            type="text"
            value={identifier}
            onChange={e => setIdentifier(e.target.value)}
            placeholder="Enter mobile number or email"
            required
            style={{ fontFamily: "'Montserrat', 'Poppins', Arial, sans-serif", marginBottom: '16px' }}
          />
          <label style={{ fontFamily: "'Montserrat', 'Poppins', Arial, sans-serif", marginBottom: '8px', display: 'block' }}>Password</label>
          <div style={{ position: 'relative', marginBottom: '16px' }}>
            <input
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder="Enter password"
              required
              style={{ paddingRight: 40, fontFamily: "'Montserrat', 'Poppins', Arial, sans-serif" }}
            />
            <button
              type="button"
              onClick={() => setShowPassword((v) => !v)}
              style={{
                position: 'absolute',
                right: 8,
                top: '50%',
                transform: 'translateY(-50%)',
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                padding: 0,
                color: '#f87171',
              }}
              tabIndex={-1}
              aria-label={showPassword ? 'Hide password' : 'Show password'}
            >
              {showPassword ? (
                <svg width="22" height="22" fill="#f87171" viewBox="0 0 24 24"><path d="M12 5c-7 0-10 7-10 7s3 7 10 7 10-7 10-7-3-7-10-7zm0 12c-2.761 0-5-2.239-5-5s2.239-5 5-5 5 2.239 5 5-2.239 5-5 5zm0-8c-1.654 0-3 1.346-3 3s1.346 3 3 3 3-1.346 3-3-1.346-3-3-3z"/></svg>
              ) : (
                <svg width="22" height="22" fill="#f87171" viewBox="0 0 24 24"><path d="M1.393 4.21l2.122 2.122c-1.13 1.13-2.01 2.47-2.515 3.668-.13.312-.13.658 0 .97.505 1.198 1.385 2.538 2.515 3.668 2.21 2.21 5.15 3.362 8.485 3.362 1.49 0 2.93-.23 4.28-.67l2.12 2.12 1.414-1.414-18-18-1.414 1.414zm10.607 13.79c-2.761 0-5-2.239-5-5 0-.512.08-1.008.22-1.47l1.53 1.53c-.16.3-.25.64-.25.94 0 1.654 1.346 3 3 3 .3 0 .64-.09.94-.25l1.53 1.53c-.462.14-.958.22-1.47.22zm7.07-2.12l-1.53-1.53c.16-.3.25-.64.25-.94 0-1.654-1.346-3-3-3-.3 0-.64.09-.94.25l-1.53-1.53c.462-.14.958-.22 1.47-.22 2.761 0 5 2.239 5 5 0 .512-.08 1.008-.22 1.47z"/></svg>
              )}
            </button>
          </div>
          {error && <div className="text-center mb-4" style={{color:'#f87171', fontFamily: "'Montserrat', 'Poppins', Arial, sans-serif"}}>{error}</div>}
          <button 
            type="submit" 
            className="btn" 
            style={{width:'100%', fontFamily: "'Montserrat', 'Poppins', Arial, sans-serif", marginBottom: '16px'}} 
            disabled={loading || serverStatus === 'offline'}
          >
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>
        <div className="text-center mt-6" style={{ fontFamily: "'Montserrat', 'Poppins', Arial, sans-serif" }}>
          Don't have an account? <Link to="/signup" style={{color:'#f87171'}}>Sign up</Link>
        </div>
      </div>
    </div>
  );
};

export default Login;
