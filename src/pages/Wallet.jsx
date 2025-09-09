import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import apiService from '../utils/api';

const Wallet = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [wallet, setWallet] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadWallet() {
      try {
        if (!user) {
          setLoading(false);
          return;
        }

        // Use wallet from auth if present
        if (typeof user.wallet === 'number') {
          setWallet(user.wallet);
        }

        // Attempt to fetch fresh value from API
        const users = await apiService.getUsers();
        // Match by _id or email
        const matched = Array.isArray(users)
          ? users.find((u) => u._id === user.id || u.email === user.email)
          : null;
        if (matched && typeof matched.wallet === 'number') {
          setWallet(matched.wallet);
        } else if (typeof user.wallet === 'number') {
          setWallet(user.wallet);
        } else {
          setWallet(0);
        }
      } catch (err) {
        // Fallback to user wallet or 0
        setWallet(typeof user?.wallet === 'number' ? user.wallet : 0);
      } finally {
        setLoading(false);
      }
    }

    loadWallet();
  }, [user]);

  // Auto-refresh wallet on window focus and at intervals
  useEffect(() => {
    let intervalId;
    let isUnmounted = false;

    async function refreshOnDemand() {
      if (!user || isUnmounted) return;
      try {
        const users = await apiService.getUsers();
        const matched = Array.isArray(users)
          ? users.find((u) => u._id === user.id || u.email === user.email)
          : null;
        if (matched && typeof matched.wallet === 'number') {
          setWallet(matched.wallet);
        }
      } catch (_) {
        // ignore transient errors
      }
    }

    const handleFocus = () => refreshOnDemand();
    window.addEventListener('focus', handleFocus);

    // Poll every 15s
    intervalId = setInterval(refreshOnDemand, 15000);

    return () => {
      isUnmounted = true;
      window.removeEventListener('focus', handleFocus);
      if (intervalId) clearInterval(intervalId);
    };
  }, [user]);

  return (
      <div 
        style={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #111111 0%, #18181b 100%)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'flex-start',
        position: 'relative',
        paddingTop: 0,
        fontFamily: "'Montserrat', 'Poppins', Arial, sans-serif"
      }}
    >
      {/* Full Width Facecard with Back Button */}
      <div style={{
        background: 'linear-gradient(135deg, rgba(220,38,38,0.8) 0%, rgba(0,0,0,0.9) 100%)',
        borderRadius: 25,
        boxShadow: '0 8px 32px rgba(220,38,38,0.3), 0 4px 16px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.1)',
        padding: 20,
        width: '88%',
        margin: '5px 6% 10px 6%',
        textAlign: 'center',
        border: '1px solid rgba(220,38,38,0.3)',
        position: 'relative'
      }}>
        {/* Back Button in Left Corner */}
        <button
          onClick={() => navigate(-1)}
              style={{
              position: 'absolute',
              top: '15px',
              left: '15px',
              background: 'rgba(220,38,38,0.8)',
              color: 'white',
              padding: '8px 12px',
              borderRadius: '100px',
              border: '2px solid white',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              transition: 'background 0.3s ease',
              fontFamily: "'Montserrat', 'Poppins', Arial, sans-serif",
              zIndex: 10
            }}
          onMouseOver={(e) => e.target.style.background = 'rgba(220,38,38,1)'}
          onMouseOut={(e) => e.target.style.background = 'rgba(220,38,38,0.8)'}
        >
          <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="19" y1="12" x2="5" y2="12"/>
            <polyline points="12 19 5 12 12 5"/>
          </svg>
        </button>

        {/* Wallet Title */}
        <h1 style={{ 
          color: 'rgb(255, 0, 0)', 
          fontWeight: '900', 
          fontSize: '2.2rem', 
          marginBottom: 18, 
          letterSpacing: 1, 
          fontFamily: "'Montserrat', 'Poppins', Arial, sans-serif",
          marginTop: '10px'
        }}>
                WALLET
              </h1>

              {/* Balance Display */}
        <div style={{
          background: 'rgba(239,68,68,0.1)',
          borderRadius: 12,
          padding: 20,
          marginBottom: 24,
          border: '1px solid rgba(239,68,68,0.3)'
        }}>
          <div style={{ fontSize: '1rem', color: '#f87171', marginBottom: 8 }}>
            Current Balance
          </div>
          <div style={{ 
            fontSize: '2.5rem', 
            fontWeight: '900', 
            color: '#ffffff',
            fontFamily: "'Montserrat', 'Poppins', Arial, sans-serif"
          }}>
                  {loading ? '...' : `₹${wallet}`}
                </div>
              </div>

        {/* Action Buttons */}
        <div style={{ display: 'flex', gap: 12, marginBottom: 16 }}>
              <button
            style={{
              flex: 1,
              background: 'rgb(207, 0, 0)',
              color: '#ffffff',
              border: 'none',
              borderRadius: 12,
              padding: '16px',
              fontSize: '1rem',
              fontWeight: '700',
              cursor: 'pointer',
              transition: 'all 0.3s ease',
              fontFamily: "'Montserrat', 'Poppins', Arial, sans-serif"
            }}
            onMouseOver={(e) => {
              e.target.style.background = '#dc2626';
              e.target.style.transform = 'scale(1.02)';
            }}
            onMouseOut={(e) => {
              e.target.style.background = 'rgb(207, 0, 0)';
              e.target.style.transform = 'scale(1)';
            }}
                onClick={() => navigate('/pay')}
              >
            💰 ADD
              </button>

          <button
            style={{
              flex: 1,
              background: 'rgba(255, 0, 0, 0.2)',
              color: '#f87171',
              border: '1px solid rgba(239,68,68,0.5)',
              borderRadius: 12,
              padding: '16px',
              fontSize: '1rem',
              fontWeight: '700',
              cursor: 'pointer',
              transition: 'all 0.3s ease',
              fontFamily: "'Montserrat', 'Poppins', Arial, sans-serif"
            }}
            onMouseOver={(e) => {
              e.target.style.background = 'rgba(239,68,68,0.3)';
              e.target.style.transform = 'scale(1.02)';
            }}
            onMouseOut={(e) => {
              e.target.style.background = 'rgba(255, 0, 0, 0.2)';
              e.target.style.transform = 'scale(1)';
            }}
            onClick={() => {
              alert('Withdraw functionality coming soon!');
            }}
          >
            💸 WITHDRAW
          </button>
          </div>

        {/* Footer Info */}
        <div style={{ 
          fontSize: '0.875rem', 
          color: '#9ca3af',
          fontFamily: "'Montserrat', 'Poppins', Arial, sans-serif"
        }}>
          Secure • Fast • Reliable
        </div>
      </div>
    </div>
  );
};

export default Wallet; 