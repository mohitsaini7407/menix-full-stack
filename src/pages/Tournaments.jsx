import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

import Header from '../components/Header';
import CountdownTimer from '../components/CountdownTimer';
import { useAuth } from '../contexts/AuthContext';
import { useTournament } from '../contexts/TournamentContext';

// Add Google Fonts link for Montserrat in index.html (manual step if not already done)
// <link href="https://fonts.googleapis.com/css2?family=Montserrat:wght@700;900&display=swap" rel="stylesheet">

const FILTERS = [
  { label: 'All', value: null },
  { label: 'Solo', value: 'solo' },
  { label: 'Squad', value: 'squad' },
  { label: 'Completed', value: 'completed' }
];

const Tournaments = () => {
  const [selectedFilter, setSelectedFilter] = useState(null);
  const navigate = useNavigate();
  const { user } = useAuth();
  const { tournaments, loading } = useTournament();
  const [registeredTournaments, setRegisteredTournaments] = useState([]);

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }
    
    // For now, we'll use empty registered tournaments since we haven't implemented registration tracking yet
    setRegisteredTournaments([]);
  }, [user, navigate]);

  const handleRegisterClick = (tournament) => {
      navigate(`/tournament/${tournament._id || tournament.id}`);
  };

  // Don't render until we have tournaments data
  if (loading || !Array.isArray(tournaments)) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center">
        <div className="text-white text-xl">Loading tournaments...</div>
      </div>
    );
  }

  return (
    <>
      <Header title="Tournaments" />
      {/* Filters */}
      <div className="w-full flex items-center justify-center" style={{ minHeight: 80, marginLeft: 10, marginRight: 10 }}>
        <div className="w-full max-w-4xl flex flex-row justify-center items-center gap-2 sm:gap-4 md:gap-6 bg-white/10 rounded-xl shadow-lg p-2 sm:p-4 md:p-6 flex-nowrap overflow-x-auto">
          {FILTERS.map(f => (
            <button
              key={f.value === null ? 'all' : f.value}
              className={`px-2 sm:px-4 md:px-6 py-1 sm:py-2 md:py-3 rounded-lg font-bold text-xs sm:text-base md:text-lg transition border-2 border-transparent hover:border-red-400 hover:bg-red-100/20 focus:outline-none whitespace-nowrap ${selectedFilter === f.value ? 'bg-red-800 text-white border-red-800' : 'bg-white/20 text-red-500'}`}
              onClick={() => setSelectedFilter(f.value)}
              style={{ fontFamily: "'Montserrat', 'Poppins', Arial, sans-serif" }}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>
      {/* Tournament Details Grid */}
      <div className="w-full flex flex-col items-center gap-6 py-8 overflow-x-auto" style={{ marginLeft: 10, marginRight: 10 }}>
        {tournaments
          .filter(t => {
            if (selectedFilter === 'completed') return t.status?.toLowerCase() === 'completed';
            if (t.status?.toLowerCase() === 'completed') return false;
            if (!selectedFilter) return true;
            if (selectedFilter === 'solo' || selectedFilter === 'squad') return t.type?.toLowerCase() === selectedFilter;
            if (selectedFilter === 'active') return t.status?.toLowerCase() === 'active';
            return true;
          })
          .map(t => (
            <div
              key={t._id || t.id}
              className="relative max-w-2xl w-full bg-black rounded-2xl shadow-2xl border-2 border-red-600 p-4 sm:p-6 md:p-8 flex flex-col mb-6 transition-transform duration-200 hover:scale-105 hover:shadow-red-700/50"
              style={{ fontFamily: "'Montserrat', 'Poppins', Arial, sans-serif", boxShadow: '0 8px 32px 0 rgba(0,0,0,0.75)' }}
            >
              {/* Status badge */}
              {/* Removed status badge for Full and Completed */}
              {/* Title left, Start Time right, both on top line */}
              <div className="flex justify-between items-center">
                <h3 style={{display:'inline'}}><strong>BGMI {t.type === 'solo' ? '🧑‍🎤 Solo' : t.type === 'squad' ? '👥 Squad' : t.type} League</strong></h3>
                <span style={{display: 'inline',margin:15}}>
                  <strong>Start Time:</strong> {t.startTime ? new Date(t.startTime).toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' }) : 'N/A'}
                </span>
              </div>
              {/* Countdown Timer for upcoming tournaments */}
              {/* Removed countdown for 'Active' tournaments */}
              <br />
              {/* Prize Pool, Entry Fee, Type with icons */}
              <div className="flex flex-wrap gap-4 items-center mb-2">
                <span className="flex items-center gap-1 bg-yellow-700/20 px-2 py-1 rounded text-yellow-300 font-bold text-lg">
                  🏆 Prize: <strong>₹{t.prize}</strong> <span role="img" aria-label="money">💰</span><span style={{marginLeft:'20px'}}>Map: {t.map ? t.map : 'Unknown'}</span>
              </span>
              </div>
              <span className="bg-yellow-700" style={{height: '1px',width: '100px'}}></span>
              {/* Red progress line on white background for slots filled */}
              <div className="w-full flex justify-center mb-2">
                <div className="relative" style={{ width: '80%', maxWidth: 400, height: 6 }}>
                  {/* White background line */}
                  <div
                    className="absolute top-0 left-0 rounded-full"
                    style={{ width: '100%', height: '100%', background: '#fff', borderRadius: '30px', zIndex: 1 }}
                  />
                  {/* Red progress overlay */}
                  <div 
                    className="absolute top-0 left-0 rounded-full"
                    style={{
                      width: `${Math.max(4, Math.round((t.joined / t.totalSlots) * 100))}%`,
                      height: '100%',
                      background: 'red',
                      transition: 'width 0.6s cubic-bezier(0.4,0,0.2,1)',
                      borderRadius: '30px',
                      zIndex: 2
                    }}
                  />
                </div>
              </div>
              <div className="flex items-center justify-center gap-1 my-2">
                {Array.from({ length: t.totalSlots }).map((_, idx) => (
                  <span
                    key={idx}
                    className={`inline-block w-3 h-3 rounded-full border-2 transition-colors duration-300 ${
                      idx < t.joined
                        ? 'bg-red-600 border-red-400'
                        : 'bg-gray-800 border-gray-600'
                    }`}
                  />
                ))}
              </div>
              {/* Slots badge and progress line below */}
              <div className="flex flex-nowrap justify-between items-center w-full mb-2">
                <div className="px-4 py-1 rounded-full font-bold text-xs sm:text-sm bg-gray-900 text-red-400 border border-red-600 tracking-wide" style={{ fontFamily: "'Montserrat', 'Poppins', Arial, sans-serif" }}>
                  Slots: {t.joined} / {t.totalSlots}
                </div>
              </div>
              {/* Button */}
              <div className="flex justify-end w-full mb-2">
                <button
                  className={`w-full px-4 py-2 rounded-lg font-extrabold text-lg shadow transition border-2 mt-2 uppercase tracking-wide ${
                    t.status === 'Active' && t.joined !== t.totalSlots
                      ? 'bg-red-700 text-white border-red-600 hover:bg-red-800'
                      : 'bg-gray-800 text-gray-400 border-gray-700 cursor-not-allowed'
                  }`}
                  disabled={t.status !== 'Active' || t.joined === t.totalSlots}
                  onClick={() => handleRegisterClick(t)}
                  style={{ fontFamily: "'Montserrat', 'Poppins', Arial, sans-serif" }}
                >
                  {t.status === 'Active'
                    ? t.joined === t.totalSlots
                      ? 'Full'
                      : `Register ₹${t.entryFee}`
                    : 'Completed'}
                </button>
              </div>
            </div>

))}
      </div>
    </>
  );
};

export default Tournaments; 
