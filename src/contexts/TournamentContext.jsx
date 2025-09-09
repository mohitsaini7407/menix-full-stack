import { createContext, useContext, useState, useEffect } from 'react';
import apiService from '../utils/api';

const TournamentContext = createContext();

export const useTournament = () => {
  const context = useContext(TournamentContext);
  if (!context) {
    throw new Error('useTournament must be used within a TournamentProvider');
  }
  return context;
};

export const TournamentProvider = ({ children }) => {
  const [tournaments, setTournaments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [liveMatches, setLiveMatches] = useState([]);

  // Use shared API service for requests

  // Fetch tournaments from API
  const fetchTournaments = async () => {
    try {
      console.log('Fetching tournaments from API service');
      const data = await apiService.get('/api/tournaments');
      if (Array.isArray(data)) {
        setTournaments(data);
      } else {
        console.error('Tournaments data is not an array:', data);
        setTournaments([]);
      }
    } catch (error) {
      console.error('Error fetching tournaments:', error);
      setTournaments([]);
    } finally {
      setLoading(false);
    }
  };

  // Create new tournament (admin only)
  const createTournament = async (tournamentData) => {
    try {
      const newTournament = await apiService.post('/api/tournaments', tournamentData);
        setTournaments(prev => {
          if (!Array.isArray(prev)) return [newTournament];
          return [...prev, newTournament];
        });
        return { success: true, tournament: newTournament };
      
    } catch (error) {
      console.error('Error creating tournament:', error);
      return { success: false, error: error.message };
    }
  };

  // Register team for tournament
  const registerTeam = async (tournamentId, teamData) => {
    try {
      const result = await apiService.post(`/api/tournaments/${tournamentId}/register`, teamData);
        // Update tournament with new registration
        setTournaments(prev => {
          if (!Array.isArray(prev)) return prev;
          
          return prev.map(t => 
            (t._id || t.id) === tournamentId 
              ? { ...t, registeredTeams: [...(t.registeredTeams || []), result.team] }
              : t
          );
        });
        return { success: true, registration: result };
      
    } catch (error) {
      console.error('Error registering team:', error);
      return { success: false, error: error.message };
    }
  };

  // Get tournament by ID
  const getTournament = (id) => {
    if (!Array.isArray(tournaments)) return null;
    return tournaments.find(t => (t._id || t.id) === id || (t._id || t.id) === parseInt(id));
  };

  // Update tournament status based on time
  const updateTournamentStatus = () => {
    if (!Array.isArray(tournaments)) return;
    
    const now = new Date();
    setTournaments(prev => {
      if (!Array.isArray(prev)) return prev;
      
      return prev.map(tournament => {
        const startTime = new Date(tournament.startTime);
        const endTime = new Date(tournament.endTime);
        
        let status = tournament.status;
        if (now < startTime) {
          status = 'upcoming';
        } else if (now >= startTime && now <= endTime) {
          status = 'ongoing';
        } else {
          status = 'completed';
        }
        
        return { ...tournament, status };
      });
    });
  };

  // Get tournaments by status
  const getTournamentsByStatus = (status) => {
    if (!Array.isArray(tournaments)) return [];
    return tournaments.filter(t => t.status === status);
  };

  // Get upcoming tournaments
  const getUpcomingTournaments = () => {
    return getTournamentsByStatus('upcoming');
  };

  // Get ongoing tournaments
  const getOngoingTournaments = () => {
    return getTournamentsByStatus('ongoing');
  };

  // Get completed tournaments
  const getCompletedTournaments = () => {
    return getTournamentsByStatus('completed');
  };

  useEffect(() => {
    fetchTournaments();
    
    // Update tournament status every minute
    const interval = setInterval(updateTournamentStatus, 60000);
    
    return () => clearInterval(interval);
  }, []);

  // Update live matches
  useEffect(() => {
    if (Array.isArray(tournaments)) {
      const ongoing = getOngoingTournaments();
      setLiveMatches(ongoing);
    }
  }, [tournaments]);

  const value = {
    tournaments: Array.isArray(tournaments) ? tournaments : [],
    liveMatches: Array.isArray(liveMatches) ? liveMatches : [],
    loading,
    createTournament,
    registerTeam,
    getTournament,
    getUpcomingTournaments,
    getOngoingTournaments,
    getCompletedTournaments,
    fetchTournaments,
  };

  return (
    <TournamentContext.Provider value={value}>
      {children}
    </TournamentContext.Provider>
  );
}; 