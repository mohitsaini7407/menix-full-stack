import React from 'react';
import { useNavigate } from 'react-router-dom';

const Header = ({ title }) => {
  const navigate = useNavigate();
  return (
    <div className="flex items-center p-4" style={{ fontFamily: "'Montserrat', 'Poppins', Arial, sans-serif" }}>
      <button
        onClick={() => navigate(-1)}
        className="bg-white/10 text-white px-3 py-2 rounded-lg hover:bg-white/20 transition-colors flex items-center gap-2"
        aria-label="Back"
        style={{ marginRight: '16px',marginLeft: '10px',marginTop: '15px',borderRadius: '100px' }}
      >
        <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <line x1="19" y1="12" x2="5" y2="12"/>
          <polyline points="12 19 5 12 12 5"/>
        </svg>
      </button>
      {title && <span className="ml-6 text-lg font-bold text-white" style={{ fontFamily: "'Montserrat', 'Poppins', Arial, sans-serif", fontWeight: '900' }}>{title}</span>}
    </div>
  );
};

export default Header; 