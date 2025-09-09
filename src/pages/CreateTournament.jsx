import React, { useState } from 'react';
import { useTournament } from '../contexts/TournamentContext';
import tournaments from "./tournaments";

const CreateTournament = () => {
  const { createTournament } = useTournament();
  const [form, setForm] = useState({
    name: '',
    date: '',
    time: '',
    roomId: '',
    roomPassword: '',
    image: '',
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(null);
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setForm((prev) => ({ ...prev, image: reader.result }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);
    // Combine date and time into ISO string
    const startTime = new Date(`${form.date}T${form.time}`);
    const tournamentData = {
      name: form.name,
      image: form.image,
      startTime: startTime.toISOString(),
      endTime: new Date(startTime.getTime() + 2 * 60 * 60 * 1000).toISOString(), // 2 hours duration
      roomId: form.roomId,
      roomPassword: form.roomPassword,
      status: 'upcoming',
      prizePool: 0,
      entryFee: 0,
      maxTeams: 25,
      registeredTeams: [],
      map: 'Erangel',
    };
    const result = await createTournament(tournamentData);
    setLoading(false);
    if (result.success) {
      setSuccess('Tournament created successfully!');
      setForm({ name: '', date: '', time: '', roomId: '', roomPassword: '', image: '' });
    } else {
      setError(result.error || 'Failed to create tournament');
    }
  };

  return (
    <div className="p-4 max-w-xl mx-auto" style={{ fontFamily: "'Montserrat', 'Poppins', Arial, sans-serif" }}>
      <h1 className="text-2xl font-bold mb-4" style={{ fontFamily: "'Montserrat', 'Poppins', Arial, sans-serif", fontWeight: '900' }}>Create Tournament</h1>
      <form onSubmit={handleSubmit} className="bg-gray-100 p-4 rounded shadow space-y-4">
        <div>
          <label className="block font-semibold mb-1" style={{ fontFamily: "'Montserrat', 'Poppins', Arial, sans-serif" }}>Tournament Image</label>
          <input type="file" accept="image/*" onChange={handleImageChange} className="block" />
          {form.image && <img src={form.image} alt="Tournament" className="mt-2 h-32 rounded" />}
        </div>
        <div>
          <label className="block font-semibold mb-1" style={{ fontFamily: "'Montserrat', 'Poppins', Arial, sans-serif" }}>Name</label>
          <input type="text" name="name" value={form.name} onChange={handleChange} required className="input" style={{ fontFamily: "'Montserrat', 'Poppins', Arial, sans-serif" }} />
        </div>
        <div className="flex gap-2">
          <div className="flex-1">
            <label className="block font-semibold mb-1" style={{ fontFamily: "'Montserrat', 'Poppins', Arial, sans-serif" }}>Date</label>
            <input type="date" name="date" value={form.date} onChange={handleChange} required className="input" style={{ fontFamily: "'Montserrat', 'Poppins', Arial, sans-serif" }} />
          </div>
          <div className="flex-1">
            <label className="block font-semibold mb-1" style={{ fontFamily: "'Montserrat', 'Poppins', Arial, sans-serif" }}>Time</label>
            <input type="time" name="time" value={form.time} onChange={handleChange} required className="input" style={{ fontFamily: "'Montserrat', 'Poppins', Arial, sans-serif" }} />
          </div>
        </div>
        <div>
          <label className="block font-semibold mb-1" style={{ fontFamily: "'Montserrat', 'Poppins', Arial, sans-serif" }}>Room ID</label>
          <input type="text" name="roomId" value={form.roomId} onChange={handleChange} required className="input" style={{ fontFamily: "'Montserrat', 'Poppins', Arial, sans-serif" }} />
        </div>
        <div>
          <label className="block font-semibold mb-1" style={{ fontFamily: "'Montserrat', 'Poppins', Arial, sans-serif" }}>Room Password</label>
          <input type="text" name="roomPassword" value={form.roomPassword} onChange={handleChange} required className="input" style={{ fontFamily: "'Montserrat', 'Poppins', Arial, sans-serif" }} />
        </div>
        <button type="submit" className="btn-primary w-full" disabled={loading} style={{ fontFamily: "'Montserrat', 'Poppins', Arial, sans-serif" }}>
          {loading ? 'Creating...' : 'Create Tournament'}
        </button>
        {success && <div className="text-green-600 mt-2" style={{ fontFamily: "'Montserrat', 'Poppins', Arial, sans-serif" }}>{success}</div>}
        {error && <div className="text-red-600 mt-2" style={{ fontFamily: "'Montserrat', 'Poppins', Arial, sans-serif" }}>{error}</div>}
      </form>
      <div className="mt-4">
        <h2 className="text-xl font-bold mb-2" style={{ fontFamily: "'Montserrat', 'Poppins', Arial, sans-serif", fontWeight: '900' }}>Tournament Details</h2>
        <ul style={{ fontFamily: "'Montserrat', 'Poppins', Arial, sans-serif" }}>
          {tournaments.map(tournament => (
            <li key={tournament.id}>
              <strong>{tournament.name}</strong><br />
              Date: {tournament.date}<br />
              Location: {tournament.location}<br />
              Prize: {tournament.prize}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default CreateTournament; 