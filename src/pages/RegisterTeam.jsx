import React, { useState } from 'react';

const RegisterTeam = () => {
  const [form, setForm] = useState({ teamName: '', members: '' });
  const [success, setSuccess] = useState(null);

  const handleChange = e => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = e => {
    e.preventDefault();
    setSuccess('Team registered successfully!');
    setForm({ teamName: '', members: '' });
  };

  return (
    <div className="page-container">
      <h1 className="section-title" style={{ fontFamily: "'Montserrat', 'Poppins', Arial, sans-serif", fontWeight: '900' }}>Register Team</h1>
      <div className="card">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block font-semibold mb-1">Team Name</label>
            <input
              type="text"
              name="teamName"
              value={form.teamName}
              onChange={handleChange}
              required
              className="input"
            />
          </div>
          <div>
            <label className="block font-semibold mb-1">Members (comma separated)</label>
            <input
              type="text"
              name="members"
              value={form.members}
              onChange={handleChange}
              required
              className="input"
            />
          </div>
          <button type="submit" className="btn-primary w-full">Register</button>
          {success && <div className="text-green-600 mt-2">{success}</div>}
        </form>
      </div>
    </div>
  );
};

export default RegisterTeam; 