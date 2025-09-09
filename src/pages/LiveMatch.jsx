import React from 'react';

const liveMatch = {
  name: 'Spring Invitational',
  roomId: '12345',
  roomPassword: 'abcde',
  livestream: 'https://youtube.com/example',
  leaderboard: [
    { team: 'Alpha', points: 50 },
    { team: 'Bravo', points: 40 },
    { team: 'Charlie', points: 30 },
  ],
};

const LiveMatch = () => {
  return (
    <div className="page-container">
      <h1 className="section-title" style={{ fontFamily: "'Montserrat', 'Poppins', Arial, sans-serif", fontWeight: '900' }}>Live Match</h1>
      <div className="card">
        <h2 className="text-lg font-bold mb-2">{liveMatch.name}</h2>
        <p>Room ID: {liveMatch.roomId}</p>
        <p>Room Password: {liveMatch.roomPassword}</p>
        <p>Livestream: <a href={liveMatch.livestream} target="_blank" rel="noopener noreferrer">Watch here</a></p>
        <h3 className="font-semibold mt-4">Leaderboard</h3>
        <ul>
          {liveMatch.leaderboard.map((row, idx) => (
            <li key={idx}>{row.team}: {row.points} points</li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default LiveMatch; 