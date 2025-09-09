import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import { useAuth } from '../contexts/AuthContext';
import { useTournament } from '../contexts/TournamentContext';

const TournamentDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { getTournament } = useTournament();
  const [isRegistered, setIsRegistered] = useState(false);
  const [loading, setLoading] = useState(false);
  const [wallet, setWallet] = useState(null);
  const [notification, setNotification] = useState('');
  
  // Find the specific tournament by ID from MongoDB
  const tournament = getTournament(id);

  useEffect(() => {
    if (user && user.id) {
      // For now, use user's wallet from auth context
      setWallet(user.wallet || 0);
      
      // Check if user is already registered for this tournament
      // This will be implemented when we add registration tracking
      setIsRegistered(false);
    }
  }, [user, id]);

  const handleRegister = async () => {
    console.log('Register button clicked!');
    console.log('User:', user);
    console.log('Wallet:', wallet);
    console.log('Tournament:', tournament);
    console.log('Tournament entry fee:', tournament?.entryFee);
    
    if (!user || !user.id) {
      console.log('No user found, redirecting to login');
      navigate('/login');
      return;
    }
    if (wallet === null || wallet < (tournament?.entryFee || 0)) {
      console.log('Insufficient balance');
      setNotification('Insufficient balance!');
      setTimeout(() => setNotification(''), 2000);
      return;
    }
    console.log('Starting registration process...');
    setLoading(true);
    try {
      // For now, just simulate successful registration
      // This will be implemented when we add the registration endpoint
      setTimeout(() => {
        setIsRegistered(true);
        setWallet(wallet - (tournament?.entryFee || 0));
        setNotification('Registration successful!');
        setLoading(false);
        setTimeout(() => setNotification(''), 2000);
      }, 1000);
    } catch (err) {
      setNotification('Registration failed.');
      setLoading(false);
      setTimeout(() => setNotification(''), 2000);
    }
  };

  return (
    <>
      <Header title="Tournament Details" />
      {notification && (
        <div style={{position:'fixed',top:20,left:'50%',transform:'translateX(-50%)',background:'#f87171',color:'#fff',padding:'10px 24px',borderRadius:8,zIndex:1000,fontWeight:'bold',boxShadow:'0 2px 8px rgba(0,0,0,0.15)'}}>
          {notification}
        </div>
      )}
      <div className="page-container" style={{ fontFamily: "'Montserrat', 'Poppins', Arial, sans-serif" }}>
        <div className="card">
          {!tournament ? (
            <div className="text-center text-white text-2xl mt-20">
              Tournament not found
            </div>
          ) : (
            <>
              <h2 className="text-xl font-bold mb-4" style={{ fontFamily: "'Montserrat', 'Poppins', Arial, sans-serif", fontWeight: '900' }}>BGMI {tournament.type} League</h2>
              
              {/* Tournament Details Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6" style={{ fontFamily: "'Montserrat', 'Poppins', Arial, sans-serif" }}>
                {/* Basic Info */}
                <div className="space-y-3">
                  <h3 className="text-lg font-bold text-blue-400 mb-3" style={{ fontFamily: "'Montserrat', 'Poppins', Arial, sans-serif", fontWeight: '900' }}>Tournament Info</h3>
                  <p><strong>Start Time:</strong> {tournament.startTime ? new Date(tournament.startTime).toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' }) : 'N/A'}</p>
                  <p><strong>Prize Pool:</strong> <span className="text-green-400 font-bold">₹{tournament.prize}</span></p>
                  <p><strong>Entry Fee:</strong> <span className="text-red-400 font-bold">₹{tournament.entryFee}</span></p>
                  <p><strong>Slots:</strong> <span className="text-blue-400 font-bold">{tournament.joined} / {tournament.totalSlots}</span></p>
                </div>
                
                {/* Game Details */}
                <div className="space-y-3">
                  <p><strong>Match Type:</strong> <span className="text-orange-400 font-bold">{tournament.matchType || tournament.type}</span></p>
                  <p><strong>Map:</strong> <span className="text-purple-400 font-bold">{tournament.map || 'TBD'}</span></p>
                  <p><strong>Game Mode:</strong> <span className="text-cyan-400 font-bold">{tournament.gameMode || 'Classic'}</span></p>
                </div>
              </div>
              
              {/* Register Button */}
              {tournament.status === 'Active' && tournament.joined !== tournament.totalSlots && (
                <>
                {isRegistered ? (
                  <button
                    className="mt-2 w-full bg-green-600 text-white px-6 py-3 rounded-lg font-bold cursor-not-allowed"
                    style={{ fontFamily: "'Montserrat', 'Poppins', Arial, sans-serif" }}
                    disabled={true}
                  >
                    ✓ Registered
                  </button>
                ) : (
                  <button
                    onClick={handleRegister}
                    className="mt-2 w-full bg-red-700 text-white px-6 py-3 rounded-lg font-bold hover:bg-red-800 transition-colors"
                    style={{ fontFamily: "'Montserrat', 'Poppins', Arial, sans-serif" }}
                    disabled={loading || wallet === null || wallet < tournament.entryFee}
                  >
                    {loading ? 'Registering...' : `Register for ₹${tournament.entryFee}`}
                  </button>
                )}
                </>
              )}
            </>
          )}
        </div>

        {/* Second Card - Prize Pool Distribution and Registered Players */}
        {tournament && (
          <div className="card mt-6">
            <h2 className="text-xl font-bold mb-4" style={{ fontFamily: "'Montserrat', 'Poppins', Arial, sans-serif", fontWeight: '900' }}>Tournament Details</h2>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Prize Pool Distribution Section */}
              <div>
                <h3 className="text-lg font-bold mb-3 text-green-400" style={{ fontFamily: "'Montserrat', 'Poppins', Arial, sans-serif", fontWeight: '900' }}>Prize Pool Distribution</h3>
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse" style={{ fontFamily: "'Montserrat', 'Poppins', Arial, sans-serif" }}>
                    <thead>
                      <tr className="bg-green-600 text-white">
                        <th className="px-3 py-2 text-left font-bold border border-gray-300 text-sm" style={{ fontWeight: '900' }}>Rank</th>
                        <th className="px-3 py-2 text-left font-bold border border-gray-300 text-sm" style={{ fontWeight: '900' }}>Prize</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr className="bg-white/10 hover:bg-white/20 transition-colors">
                        <td className="px-3 py-2 border border-gray-300 font-bold text-yellow-400 text-sm" style={{ fontWeight: '700' }}>🥇 1st</td>
                        <td className="px-3 py-2 border border-gray-300 font-bold text-green-400 text-sm" style={{ fontWeight: '700' }}>₹{Math.round(tournament.prize * 0.5)}</td>
                      </tr>
                      <tr className="bg-white/10 hover:bg-white/20 transition-colors">
                        <td className="px-3 py-2 border border-gray-300 font-bold text-gray-300 text-sm" style={{ fontWeight: '700' }}>🥈 2nd</td>
                        <td className="px-3 py-2 border border-gray-300 font-bold text-green-400 text-sm" style={{ fontWeight: '700' }}>₹{Math.round(tournament.prize * 0.3)}</td>
                      </tr>
                      <tr className="bg-white/10 hover:bg-white/20 transition-colors">
                        <td className="px-3 py-2 border border-gray-300 font-bold text-orange-400 text-sm" style={{ fontWeight: '700' }}>🥉 3rd</td>
                        <td className="px-3 py-2 border border-gray-300 font-bold text-green-400 text-sm" style={{ fontWeight: '700' }}>₹{Math.round(tournament.prize * 0.2)}</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Registered Players Section */}
              <div>
                <h3 className="text-lg font-bold mb-3 text-blue-400" style={{ fontFamily: "'Montserrat', 'Poppins', Arial, sans-serif", fontWeight: '900' }}>Registered Players</h3>
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse" style={{ fontFamily: "'Montserrat', 'Poppins', Arial, sans-serif" }}>
                    <thead>
                      <tr className="bg-blue-600 text-white">
                        <th className="px-3 py-2 text-left font-bold border border-gray-300 text-sm" style={{ fontWeight: '900' }}>ID</th>
                        <th className="px-3 py-2 text-left font-bold border border-gray-300 text-sm" style={{ fontWeight: '900' }}>Player Name</th>
                      </tr>
                    </thead>
                    <tbody>
                      {tournament.joined > 0 ? (
                        Array.from({ length: Math.min(tournament.joined, 5) }, (_, index) => (
                          <tr key={index} className="bg-white/10 hover:bg-white/20 transition-colors">
                            <td className="px-3 py-2 border border-gray-300 font-bold text-blue-400 text-sm" style={{ fontWeight: '700' }}>
                              #{index + 1}
                            </td>
                            <td className="px-3 py-2 border border-gray-300 font-bold text-white text-sm" style={{ fontWeight: '700' }}>
                              Player{index + 1}
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr className="bg-white/10">
                          <td colSpan={2} className="px-3 py-2 border border-gray-300 text-center text-gray-400 text-sm">
                            No players registered yet
                          </td>
                        </tr>
                      )}
                      {tournament.joined > 5 && (
                        <tr className="bg-white/10">
                          <td colSpan={2} className="px-3 py-2 border border-gray-300 text-center text-gray-400 text-sm">
                            +{tournament.joined - 5} more players
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
                
                {/* Registration Progress */}
                <div className="mt-3">
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-xs font-semibold text-gray-300" style={{ fontFamily: "'Montserrat', 'Poppins', Arial, sans-serif" }}>
                      Progress: {tournament.joined}/{tournament.totalSlots}
                    </span>
                    <span className="text-xs font-semibold text-red-400" style={{ fontFamily: "'Montserrat', 'Poppins', Arial, sans-serif" }}>
                      {Math.round((tournament.joined / tournament.totalSlots) * 100)}%
                    </span>
                  </div>
                  <div className="w-full flex gap-1 h-3">
                    {Array.from({ length: tournament.totalSlots }, (_, index) => (
                      <div
                        key={index}
                        className="flex-1 h-full transition-all duration-300 ease-in-out"
                        style={{
                          backgroundColor: index < tournament.joined ? '#dc2626' : 'white',
                          border: '1px solid #374151',
                          borderRadius: '2px'
                        }}
                      ></div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default TournamentDetail; 