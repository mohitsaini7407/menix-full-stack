import React, { useState } from 'react';
import apiService from '../../utils/api';
import { useAuth } from "../../contexts/AuthContext";
import { useNavigate } from 'react-router-dom';

function generateOTP() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

const Signup = () => {
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [step, setStep] = useState(1); // 1: form, 2: otp
  const [otp, setOtp] = useState('');
  const [enteredOtp, setEnteredOtp] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();

  const isEmail = (val) => /^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(val);
  const isMobile = (val) => /^\d{10}$/.test(val);

  // Live error for password mismatch
  const passwordMismatch = password && confirmPassword && password !== confirmPassword;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    let id = identifier;
    if (isEmail(id)) id = id.toLowerCase();
    if (!isEmail(id) && !isMobile(id)) {
      setError('Please enter a valid email or 10-digit mobile number.');
      return;
    }
    if (password.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }
    if (passwordMismatch) {
      setError('Passwords do not match.');
      return;
    }
    setIdentifier(id); // update state to lowercased if email
    
    // Generate OTP and send to backend
    const generatedOtp = generateOTP();
    setOtp(generatedOtp);
    try {
      const data = await apiService.post('/send-otp', { identifier: id, otp: generatedOtp });
      if (!data.success) {
        throw new Error(data.error || 'Failed to send OTP');
      }
      setSuccess(`OTP sent to ${id}. Please check and enter the OTP.`);
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError(err.message || 'Failed to send OTP. Please try again.');
      return;
    }
    setStep(2);
  };

  const handleOtpSubmit = async (e) => {
    e.preventDefault();
    setError('');
    let id = identifier;
    if (isEmail(id)) id = id.toLowerCase();
    if (enteredOtp !== otp) {
      setError('Invalid OTP. Please try again.');
      return;
    }
    setLoading(true);
    try {
      const data = await apiService.post('/signup', { identifier: id, password });
      if (!data.success) throw new Error(data.error || 'Failed to save user');
      setSuccess('Signup successful! Redirecting...');
      login(data.user);
      setTimeout(() => navigate('/'), 1200);
    } catch (err) {
      setError('Signup failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const eyeBtnStyle = {
    position: 'absolute',
    right: 0,
    top: '50%',
    transform: 'translateY(-50%)',
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    padding: 0,
    color: '#f87171',
    height: '2.5em',
    width: 40,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    lineHeight: 1,
  };

  return (
    <div className="page-container" style={{ fontFamily: "'Montserrat', 'Poppins', Arial, sans-serif" }}>
      <h1 className="section-title" style={{ fontFamily: "'Montserrat', 'Poppins', Arial, sans-serif", fontWeight: '900' }}>Signup</h1>
      <div className="card">
        {step === 1 && (
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
            <label style={{ fontFamily: "'Montserrat', 'Poppins', Arial, sans-serif", marginBottom: '8px', display: 'block' }}>New Password</label>
            <div style={{ position: 'relative', marginBottom: '16px' }}>
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="Enter new password"
                required
                style={{ paddingRight: 40, fontFamily: "'Montserrat', 'Poppins', Arial, sans-serif" }}
              />
              <button
                type="button"
                onClick={() => setShowPassword((v) => !v)}
                style={eyeBtnStyle}
                tabIndex={-1}
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? (
                  <svg width="22" height="22" fill="#f87171" viewBox="0 0 24 24"><path d="M12 5c-7 0-10 7-10 7s3 7 10 7 10-7 10-7-3-7-10-7zm0 12c-2.761 0-5-2.239-5-5s2.239-5 5-5 5 2.239 5 5-2.239 5-5 5zm0-8c-1.654 0-3 1.346-3 3s1.346 3 3 3 3-1.346 3-3-1.346-3-3-3z"/></svg>
                ) : (
                  <svg width="22" height="22" fill="#f87171" viewBox="0 0 24 24"><path d="M1.393 4.21l2.122 2.122c-1.13 1.13-2.01 2.47-2.515 3.668-.13.312-.13.658 0 .97.505 1.198 1.385 2.538 2.515 3.668 2.21 2.21 5.15 3.362 8.485 3.362 1.49 0 2.93-.23 4.28-.67l2.12 2.12 1.414-1.414-18-18-1.414 1.414zm10.607 13.79c-2.761 0-5-2.239-5-5 0-.512.08-1.008.22-1.47l1.53 1.53c-.16.3-.25.64-.25.94 0 1.654 1.346 3 3 3 .3 0 .64-.09.94-.25l1.53 1.53c-.462.14-.958.22-1.47.22zm7.07-2.12l-1.53-1.53c.16-.3.25-.64.25-.94 0-1.654-1.346-3-3-3-.3 0-.64.09-.94.25l-1.53-1.53c.462-.14-.958-.22-1.47-.22 2.761 0 5 2.239 5 5 0 .512-.08 1.008-.22 1.47z"/></svg>
                )}
              </button>
            </div>
            <label style={{ fontFamily: "'Montserrat', 'Poppins', Arial, sans-serif", marginBottom: '8px', display: 'block' }}>Confirm Password</label>
            <div style={{ position: 'relative', marginBottom: '16px' }}>
              <input
                type={showConfirmPassword ? 'text' : 'password'}
                value={confirmPassword}
                onChange={e => setConfirmPassword(e.target.value)}
                placeholder="Confirm password"
                required
                style={{ paddingRight: 40, fontFamily: "'Montserrat', 'Poppins', Arial, sans-serif" }}
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword((v) => !v)}
                style={eyeBtnStyle}
                tabIndex={-1}
                aria-label={showConfirmPassword ? 'Hide password' : 'Show password'}
              >
                {showConfirmPassword ? (
                  <svg width="22" height="22" fill="#f87171" viewBox="0 0 24 24"><path d="M12 5c-7 0-10 7-10 7s3 7 10 7 10-7 10-7-3-7-10-7zm0 12c-2.761 0-5-2.239-5-5s2.239-5 5-5 5 2.239 5 5-2.239 5-5 5zm0-8c-1.654 0-3 1.346-3 3s1.346 3 3 3 3-1.346 3-3-1.346-3-3-3z"/></svg>
                ) : (
                  <svg width="22" height="22" fill="#f87171" viewBox="0 0 24 24"><path d="M1.393 4.21l2.122 2.122c-1.13 1.13-2.01 2.47-2.515 3.668-.13.312-.13.658 0 .97.505 1.198 1.385 2.538 2.515 3.668 2.21 2.21 5.15 3.362 8.485 3.362 1.49 0 2.93-.23 4.28-.67l2.12 2.12 1.414-1.414-18-18-1.414 1.414zm10.607 13.79c-2.761 0-5-2.239-5-5 0-.512.08-1.008.22-1.47l1.53 1.53c-.16.3-.25.64-.25.94 0 1.654 1.346 3 3 3 .3 0 .64-.09.94-.25l1.53 1.53c-.462.14-.958.22-1.47.22zm7.07-2.12l-1.53-1.53c.16-.3.25-.64.25-.94 0-1.654-1.346-3-3-3-.3 0-.64.09-.94.25l-1.53-1.53c.462-.14-.958-.22-1.47-.22 2.761 0 5 2.239 5 5 0 .512-.08 1.008-.22 1.47z"/></svg>
                )}
              </button>
            </div>
            {passwordMismatch && <div className="text-center mb-4" style={{color:'#f87171', fontFamily: "'Montserrat', 'Poppins', Arial, sans-serif"}}>Passwords do not match.</div>}
            {error && <div className="text-center mb-4" style={{color:'#f87171', fontFamily: "'Montserrat', 'Poppins', Arial, sans-serif"}}>{error}</div>}
            <button type="submit" className="btn" style={{width:'100%', fontFamily: "'Montserrat', 'Poppins', Arial, sans-serif", marginBottom: '16px'}} disabled={loading}>Sign Up</button>
            
            {/* Login link for existing users */}
            <div className="text-center" style={{ fontFamily: "'Montserrat', 'Poppins', Arial, sans-serif" }}>
              <span style={{ color: '#6b7280' }}>Already have an account? </span>
              <button 
                type="button"
                onClick={() => navigate('/login')}
                style={{
                  background: 'none',
                  border: 'none',
                  color: '#f87171',
                  textDecoration: 'underline',
                  cursor: 'pointer',
                  fontFamily: "'Montserrat', 'Poppins', Arial, sans-serif",
                  fontWeight: '600'
                }}
              >
                Login
              </button>
            </div>
          </form>
        )}
        {step === 2 && (
          <form onSubmit={handleOtpSubmit}>
            <div className="text-center mb-4" style={{ fontFamily: "'Montserrat', 'Poppins', Arial, sans-serif" }}>
              <b>OTP sent to your {isEmail(identifier) ? 'email' : 'WhatsApp/mobile'}.</b>
            </div>
            <label style={{ fontFamily: "'Montserrat', 'Poppins', Arial, sans-serif", marginBottom: '8px', display: 'block' }}>Enter OTP</label>
            <input
              type="text"
              value={enteredOtp}
              onChange={e => setEnteredOtp(e.target.value)}
              placeholder="Enter 6-digit OTP"
              required
              style={{ fontFamily: "'Montserrat', 'Poppins', Arial, sans-serif", marginBottom: '16px' }}
            />
            {error && <div className="text-center mb-4" style={{color:'#f87171', fontFamily: "'Montserrat', 'Poppins', Arial, sans-serif"}}>{error}</div>}
            <button type="submit" className="btn" style={{width:'100%', fontFamily: "'Montserrat', 'Poppins', Arial, sans-serif", marginBottom: '16px'}} disabled={loading}>{loading ? 'Verifying...' : 'Verify OTP'}</button>
          </form>
        )}
        {success && <div className="text-center mt-6" style={{color:'#22c55e',fontWeight:600, fontFamily: "'Montserrat', 'Poppins', Arial, sans-serif"}}>{success}</div>}
      </div>
    </div>
  );
};

export default Signup; 