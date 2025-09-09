import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import avt1 from '../assets/avatar/avt1.png';
import avt2 from '../assets/avatar/avt2.png';
import avt3 from '../assets/avatar/avt3.png';
import users, { defaultUserPic } from './users';

const avatars = [avt1, avt2, avt3];
const getProfileAvatar = (user) => {
  const key = user?.username || user?.email || '';
  let hash = 0;
  for (let i = 0; i < key.length; i++) {
    hash = key.charCodeAt(i) + ((hash << 5) - hash);
  }
  const idx = Math.abs(hash) % avatars.length;
  return avatars[idx];
};

const ProfileDetails = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  // Find the full user object from users.js if only username/email is stored in auth
  const fullUser = user
    ? users.find(
        u =>
          u.username === user.username ||
          u.email === user.email
      ) || user
    : null;

  if (!fullUser) return <div className="text-center mt-8">No user data found.</div>;

  const handleLogout = () => {
    logout();
    navigate('/login', { replace: true });
  };

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
      {/* Profile Box - Similar to Wallet */}
      <div style={{
        background: 'linear-gradient(135deg, rgba(220,38,38,0.8) 0%, rgba(0,0,0,0.9) 100%)',
        borderRadius: 25,
        boxShadow: '0 8px 32px rgba(220,38,38,0.3), 0 4px 16px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.1)',
        padding: 20,
        width: '88%',
        margin: '5px 6% 10px 6%',
        textAlign: 'center',
        border: '1px solid rgba(220,38,38,0.3)',
        position: 'relative',
        minHeight: '200px'
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

        {/* Profile Title */}
        <h1 style={{ 
          color: 'rgb(255, 0, 0)', 
          fontWeight: '900', 
          fontSize: '2.2rem', 
          marginBottom: 18, 
          letterSpacing: 1, 
          fontFamily: "'Montserrat', 'Poppins', Arial, sans-serif",
          marginTop: '10px'
        }}>
          PROFILE
        </h1>

        {/* Profile Image - Positioned half on box, half on black background */}
        <div style={{
          position: 'absolute',
          left: '50%',
          transform: 'translateX(-50%)',
          bottom: '-60px',
          zIndex: 20
        }}>
          <img
            src={getProfileAvatar(fullUser)}
            alt="Profile Avatar"
            style={{
              width: '120px',
              height: '120px',
              borderRadius: '50%',
              objectFit: 'cover',
              border: '4px solid white',
              boxShadow: '0 4px 16px rgba(0,0,0,0.3)'
            }}
          />
        </div>
      </div>

      {/* Content Section - Black Background */}
      <div style={{
        width: '88%',
        margin: '70px 6% 20px 6%',
        paddingTop: '20px'
      }}>
        {/* User Info Section */}
        <div style={{
          textAlign: 'center',
          marginBottom: '30px',
          background: 'rgba(239,68,68,0.1)',
          borderRadius: 12,
          padding: 20,
          border: '1px solid rgba(239,68,68,0.3)'
        }}>
          <h2 style={{
            fontSize: '2rem',
            fontWeight: '900',
            color: '#ffffff',
            marginBottom: '10px',
            fontFamily: "'Montserrat', 'Poppins', Arial, sans-serif"
          }}>
            {fullUser.username || 'NA'}
          </h2>
          <p style={{
            fontSize: '1.1rem',
            color: '#f87171',
            marginBottom: '5px',
            fontFamily: "'Montserrat', 'Poppins', Arial, sans-serif"
          }}>
            {fullUser.email || 'NA'}
          </p>
          {fullUser.mobile && (
            <p style={{
              fontSize: '1rem',
              color: '#f87171',
              fontFamily: "'Montserrat', 'Poppins', Arial, sans-serif"
            }}>
              {fullUser.mobile}
            </p>
          )}
        </div>

        {/* Additional Info Cards */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {/* Teams Section */}
          {fullUser.teams && (
            <div style={{
              background: 'rgba(239,68,68,0.1)',
              borderRadius: 12,
              padding: 20,
              border: '1px solid rgba(239,68,68,0.3)'
            }}>
              <h3 style={{
                fontSize: '1.2rem',
                fontWeight: '700',
                color: '#ffffff',
                marginBottom: '15px',
                fontFamily: "'Montserrat', 'Poppins', Arial, sans-serif"
              }}>
                Teams
              </h3>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                {fullUser.teams.map((team, idx) => (
                  <span key={idx} style={{
                    background: 'rgb(207, 0, 0)',
                    color: 'white',
                    padding: '8px 16px',
                    borderRadius: '20px',
                    fontSize: '0.9rem',
                    fontWeight: '600'
                  }}>
                    {team}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Earnings Section */}
          {fullUser.earnings && (
            <div style={{
              background: 'rgba(239,68,68,0.1)',
              borderRadius: 12,
              padding: 20,
              border: '1px solid rgba(239,68,68,0.3)'
            }}>
              <h3 style={{
                fontSize: '1.2rem',
                fontWeight: '700',
                color: '#ffffff',
                marginBottom: '10px',
                fontFamily: "'Montserrat', 'Poppins', Arial, sans-serif"
              }}>
                Total Earnings
              </h3>
              <p style={{
                fontSize: '2rem',
                fontWeight: '900',
                color: '#10b981',
                fontFamily: "'Montserrat', 'Poppins', Arial, sans-serif"
              }}>
                ₹{fullUser.earnings}
              </p>
            </div>
          )}

          {/* Past Tournaments Section */}
          {fullUser.pastTournaments && (
            <div style={{
              background: 'rgba(239,68,68,0.1)',
              borderRadius: 12,
              padding: 20,
              border: '1px solid rgba(239,68,68,0.3)'
            }}>
              <h3 style={{
                fontSize: '1.2rem',
                fontWeight: '700',
                color: '#ffffff',
                marginBottom: '15px',
                fontFamily: "'Montserrat', 'Poppins', Arial, sans-serif"
              }}>
                Past Tournaments
              </h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {fullUser.pastTournaments.map((t, idx) => (
                  <div key={idx} style={{
                    background: 'rgba(0,0,0,0.3)',
                    borderRadius: '8px',
                    padding: '12px',
                    border: '1px solid rgba(239,68,68,0.2)'
                  }}>
                    <p style={{
                      color: '#ffffff',
                      fontWeight: '600',
                      marginBottom: '4px',
                      fontSize: '1rem'
                    }}>
                      {t.name}
                    </p>
                    <p style={{
                      color: '#f87171',
                      fontSize: '0.9rem'
                    }}>
                      {t.result} - {t.prize}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Logout Button */}
        <div style={{ textAlign: 'center', marginTop: '30px' }}>
          <button
            onClick={handleLogout}
            style={{
              background: 'rgb(207, 0, 0)',
              color: '#ffffff',
              border: 'none',
              borderRadius: 12,
              padding: '12px 32px',
              fontSize: '1rem',
              fontWeight: '700',
              cursor: 'pointer',
              transition: 'background 0.3s ease',
              fontFamily: "'Montserrat', 'Poppins', Arial, sans-serif"
            }}
            onMouseOver={(e) => e.target.style.background = 'rgb(185, 0, 0)'}
            onMouseOut={(e) => e.target.style.background = 'rgb(207, 0, 0)'}
          >
            Logout
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProfileDetails; 