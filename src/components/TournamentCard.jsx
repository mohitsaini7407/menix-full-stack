import { Link } from 'react-router-dom';
import CountdownTimer from './CountdownTimer';

const TournamentCard = ({ tournament }) => {
  const {
    id,
    name,
    startTime,
    endTime,
    prizePool,
    entryFee,
    maxTeams,
    registeredTeams = [],
    status,
    map,
    roomId,
    roomPassword
  } = tournament;

  const availableSlots = maxTeams - registeredTeams.length;
  const isFull = availableSlots <= 0;
  const isLive = status === 'ongoing';
  const isUpcoming = status === 'upcoming';
  const isCompleted = status === 'completed';

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const formatTime = (dateString) => {
    return new Date(dateString).toLocaleString('en-IN', {
      day: 'numeric',
      month: 'short',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div className="tournament-card">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-xl font-bold text-white">{name}</h3>
        <div className="flex items-center space-x-2">
          {isLive && <span className="live-indicator">LIVE</span>}
          {isUpcoming && <span className="bg-blue-500 text-white px-3 py-1 rounded-full text-sm font-semibold">UPCOMING</span>}
          {isCompleted && <span className="bg-gray-500 text-white px-3 py-1 rounded-full text-sm font-semibold">COMPLETED</span>}
        </div>
      </div>

      {/* Tournament Details */}
      <div className="grid grid-cols-2 gap-4 mb-4">
        <div>
          <p className="text-gray-400 text-sm">Prize Pool</p>
          <p className="text-green-400 font-bold">{formatCurrency(prizePool)}</p>
        </div>
        <div>
          <p className="text-gray-400 text-sm">Entry Fee</p>
          <p className="text-yellow-400 font-bold">{formatCurrency(entryFee)}</p>
        </div>
        <div>
          <p className="text-gray-400 text-sm">Map</p>
          <p className="text-white font-semibold">{map}</p>
        </div>
        <div>
          <p className="text-gray-400 text-sm">Teams</p>
          <p className="text-white font-semibold">
            {registeredTeams.length}/{maxTeams}
          </p>
        </div>
      </div>

      {/* Time Information */}
      <div className="mb-4">
        <p className="text-gray-400 text-sm mb-2">Start Time</p>
        <p className="text-white font-semibold">{formatTime(startTime)}</p>
        {isUpcoming && (
          <div className="mt-2">
            <p className="text-gray-400 text-sm mb-1">Starts in</p>
            <CountdownTimer targetTime={startTime} />
          </div>
        )}
      </div>

      {/* Room Information (for live matches) */}
      {isLive && roomId && (
        <div className="mb-4 p-3 bg-green-900/20 border border-green-500/30 rounded-lg">
          <p className="text-green-400 text-sm font-semibold mb-2">Match Room</p>
          <div className="grid grid-cols-2 gap-2 text-sm">
            <div>
              <span className="text-gray-400">Room ID:</span>
              <span className="text-white ml-2">{roomId}</span>
            </div>
            <div>
              <span className="text-gray-400">Password:</span>
              <span className="text-white ml-2">{roomPassword}</span>
            </div>
          </div>
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex space-x-2">
        <Link
          to={`/tournament/${id}`}
          className="btn-primary flex-1 text-center"
        >
          View Details
        </Link>
        
        {isLive ? (
          <Link
            to={`/tournament/${id}/live`}
            className="btn-secondary flex-1 text-center"
          >
            Watch Live
          </Link>
        ) : isUpcoming && !isFull ? (
          <Link
            to={`/tournament/${id}/register`}
            className="btn-secondary flex-1 text-center"
          >
            Register Team
          </Link>
        ) : isUpcoming && isFull ? (
          <span className="bg-gray-600 text-gray-300 px-4 py-2 rounded-lg flex-1 text-center">
            Tournament Full
          </span>
        ) : null}
      </div>

      {/* Slots Status */}
      {isUpcoming && (
        <div className="mt-3 text-center">
          <p className={`text-sm ${isFull ? 'text-red-400' : 'text-green-400'}`}>
            {isFull ? 'No slots available' : `${availableSlots} slots remaining`}
          </p>
        </div>
      )}
    </div>
  );
};

export default TournamentCard; 