import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTournament } from '../contexts/TournamentContext';
import avt1 from '../assets/avatar/avt1.png';
import avt2 from '../assets/avatar/avt2.png';
import avt3 from '../assets/avatar/avt3.png';

// Example leaderboard data structure, should be replaced with real data if available
const leaderboardData = {
  1: [
    { team: 'Mohit', points: 100 },
    { team: 'ScoutOp', points: 80 },
    { team: 'jonny', points: 60 },
    { team: 'Delta', points: 50 },
    { team: 'Top', points: 40 },
  ],
  2: [
    { team: 'Mohit', points: 90 },
    { team: 'Jonny', points: 70 },
    { team: 'Scout', points: 50 },
    { team: 'Golf', points: 40 },
    { team: 'Hotel', points: 30 },
  ],
};

const avatars = [avt1, avt2, avt3];
const getTeamAvatar = (teamName) => {
  let hash = 0;
  for (let i = 0; i < teamName.length; i++) {
    hash = teamName.charCodeAt(i) + ((hash << 5) - hash);
  }
  const idx = Math.abs(hash) % avatars.length;
  return avatars[idx];
};

const Leaderboard = () => {
  const navigate = useNavigate();
  const { tournaments, loading } = useTournament();
  const [selectedTournament, setSelectedTournament] = useState(null);

  useEffect(() => {
    if (tournaments && tournaments.length > 0) {
      setSelectedTournament(tournaments[0].id);
    }
  }, [tournaments]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500"></div>
      </div>
    );
  }

  if (!tournaments || tournaments.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-screen text-white text-xl">
        No tournaments available.
      </div>
    );
  }

  // Use leaderboardData as a placeholder; replace with real data if available
  const data = leaderboardData[selectedTournament] || [];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 pt-2" style={{ fontFamily: "'Montserrat', 'Poppins', Arial, sans-serif" }}>
      <div className="container mx-auto px-4">
        {/* Back Button */}
        <button
          onClick={() => navigate(-1)}
          className="mb-6 bg-white/10 text-white px-4 py-2 rounded-lg hover:bg-white/20 transition-colors flex items-center gap-2"
          style={{ fontFamily: "'Montserrat', 'Poppins', Arial, sans-serif", marginRight: '16px' }}
        >
          <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="19" y1="12" x2="5" y2="12"/>
            <polyline points="12 19 5 12 12 5"/>
          </svg>
          Back
        </button>

        <div className="w-full flex flex-col justify-center items-center">
      <div className="w-full max-w-5xl flex flex-col items-center">
            <h1 className="text-4xl font-black mb-8 text-center text-white" style={{ fontFamily: "'Montserrat', 'Poppins', Arial, sans-serif", fontWeight: '900' }}>🏆 Leaderboard</h1>
            <div className="mb-6 flex flex-col items-center w-full max-w-md">
              <label className="font-semibold text-white mb-2 text-lg" style={{ fontFamily: "'Montserrat', 'Poppins', Arial, sans-serif" }}>Select Tournament:</label>
        <select
                value={selectedTournament || ''}
          onChange={e => setSelectedTournament(Number(e.target.value))}
                className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white font-medium focus:outline-none focus:border-red-500"
                style={{ fontFamily: "'Montserrat', 'Poppins', Arial, sans-serif" }}
        >
          {tournaments.map(t => (
                  <option key={t.id} value={t.id} className="bg-slate-800">{t.name}</option>
          ))}
        </select>
      </div>
            <div className="bg-gradient-to-br from-slate-800 to-slate-900 p-6 sm:p-8 rounded-2xl shadow-2xl w-full max-w-4xl mx-auto overflow-x-auto border border-white/10">
              <table className="min-w-[400px] w-full text-center text-base sm:text-lg border-separate border-spacing-y-3" style={{ fontFamily: "'Montserrat', 'Poppins', Arial, sans-serif" }}>
            <thead>
              <tr className="bg-gradient-to-r from-red-500 to-yellow-500 text-white">
                    <th className="py-4 rounded-l-xl text-lg sm:text-xl font-bold">Rank</th>
                    <th className="text-lg sm:text-xl font-bold">Team</th>
                    <th className="rounded-r-xl text-lg sm:text-xl font-bold">Points</th>
              </tr>
            </thead>
            <tbody>
              {data.length === 0 ? (
                <tr>
                      <td colSpan={3} className="py-12 text-gray-400 text-lg">No leaderboard data available.</td>
                </tr>
              ) : (
                data.map((row, idx) => {
                  let rankStyle = "";
                  let avatarBorder = "";
                  if (idx === 0) {
                        rankStyle = "text-yellow-400 font-extrabold text-2xl sm:text-3xl";
                        avatarBorder = "border-yellow-400 border-4";
                  } else if (idx === 1) {
                        rankStyle = "text-gray-300 font-bold text-xl sm:text-2xl";
                        avatarBorder = "border-gray-300 border-4";
                  } else if (idx === 2) {
                        rankStyle = "text-orange-500 font-bold text-xl sm:text-2xl";
                        avatarBorder = "border-orange-400 border-4";
                  } else {
                        rankStyle = "text-gray-200 text-lg sm:text-xl";
                        avatarBorder = "border-gray-500 border-2";
                  }
                  return (
                    <tr
                      key={idx}
                          className="bg-white/10 hover:bg-white/20 transition-all duration-300 rounded-xl"
                    >
                          <td className={`py-6 rounded-l-xl ${rankStyle}`}>
                            {idx === 0 && "🥇"}
                            {idx === 1 && "🥈"}
                            {idx === 2 && "🥉"}
                            {idx > 2 && `${idx + 1}`}
                          </td>
                          <td className="flex items-center gap-4 sm:gap-6 justify-center py-6">
                        <img
                          src={getTeamAvatar(row.team)}
                          alt={row.team}
                              className={`rounded-full object-cover ${avatarBorder} bg-white shadow-lg`}
                              style={{ width: '80px', height: '80px', borderRadius: '50%' }}
                        />
                            <span className="font-bold text-white text-lg sm:text-xl break-words max-w-[150px] sm:max-w-none">
                              {row.team}
                            </span>
                          </td>
                          <td className="rounded-r-xl text-white font-bold text-lg sm:text-xl">
                            {row.points} pts
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Leaderboard; 