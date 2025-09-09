import React, { useState, useEffect } from 'react';

const ApiTest = () => {
  const [healthStatus, setHealthStatus] = useState(null);
  const [tournaments, setTournaments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const API_BASE_URL = import.meta.env.VITE_API_URL || 'https://menix-backend.vercel.app';

  // Test health check
  const testHealth = async () => {
    try {
      setLoading(true);
      setError(null);
      console.log('Testing health check at:', `${API_BASE_URL}/api/health`);
      const response = await fetch(`${API_BASE_URL}/api/health`);
      const result = await response.json();
      setHealthStatus(result);
    } catch (err) {
      setError(err.message);
      console.error('Health check error:', err);
    } finally {
      setLoading(false);
    }
  };

  // Test tournaments
  const testTournaments = async () => {
    try {
      setLoading(true);
      setError(null);
      console.log('Testing tournaments at:', `${API_BASE_URL}/api/tournaments`);
      const response = await fetch(`${API_BASE_URL}/api/tournaments`);
      const result = await response.json();
      setTournaments(result);
    } catch (err) {
      setError(err.message);
      console.error('Tournaments error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    testHealth();
    testTournaments();
  }, []);

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <h2 className="text-2xl font-bold text-gray-900">API Connection Test</h2>
      
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h3 className="text-lg font-semibold mb-4">Environment Variables</h3>
        <p><strong>API URL:</strong> {API_BASE_URL}</p>
        <p><strong>Environment:</strong> {import.meta.env.MODE}</p>
      </div>
      
      {/* Health Check */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h3 className="text-lg font-semibold mb-4">Backend Health Check</h3>
        <button
          onClick={testHealth}
          disabled={loading}
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded disabled:opacity-50"
        >
          {loading ? 'Testing...' : 'Test Health'}
        </button>
        
        {healthStatus && (
          <div className="mt-4 p-4 bg-green-100 rounded">
            <pre className="text-sm">{JSON.stringify(healthStatus, null, 2)}</pre>
          </div>
        )}
      </div>

      {/* Tournaments Test */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h3 className="text-lg font-semibold mb-4">Tournaments Test</h3>
        <button
          onClick={testTournaments}
          disabled={loading}
          className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded disabled:opacity-50 mb-4"
        >
          {loading ? 'Loading...' : 'Test Tournaments'}
        </button>
        
        {tournaments.length > 0 ? (
          <div className="space-y-2">
            {tournaments.map((tournament, index) => (
              <div key={index} className="p-3 bg-gray-50 rounded">
                <strong>Name:</strong> {tournament.name} | 
                <strong>Type:</strong> {tournament.type} | 
                <strong>Status:</strong> {tournament.status}
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-500">No tournaments found</p>
        )}
      </div>

      {/* Error Display */}
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          <strong>Error:</strong> {error}
        </div>
      )}
    </div>
  );
};

export default ApiTest; 