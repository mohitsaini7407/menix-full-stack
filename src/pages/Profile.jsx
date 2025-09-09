import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const user = {
  username: 'john_doe',
  email: 'john@example.com',
  mobile: '', // Example: empty mobile
  profilePic: 'https://ui-avatars.com/api/?name=John+Doe&background=random',
  teams: ['Alpha', 'Bravo'],
  earnings: 1500,
  pastTournaments: [
    { name: 'Spring Invitational', result: '1st Place', prize: '$1000' },
    { name: 'Summer Showdown', result: '2nd Place', prize: '$500' },
  ],
};

const Profile = () => {
  const navigate = useNavigate();
  useEffect(() => {
    navigate('/profile-details', { replace: true });
  }, [navigate]);
  return null;
};

export default Profile; 