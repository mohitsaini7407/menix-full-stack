import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import bgmi1 from '../assets/bgmi1.jpeg';
import bgmi2 from '../assets/bgmi2.jpg';
import bgmi3 from '../assets/bgmi3.jpg';

const sliderImages = [bgmi1, bgmi2, bgmi3];

// Fallback image in case assets don't load
const fallbackImage = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjIyMCIgdmlld0JveD0iMCAwIDQwMCAyMjAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSI0MDAiIGhlaWdodD0iMjIwIiBmaWxsPSIjMzMzIi8+Cjx0ZXh0IHg9IjIwMCIgeT0iMTEwIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBmaWxsPSIjZjg3MTcxIiBmb250LWZhbWlseT0iQXJpYWwiIGZvbnQtc2l6ZT0iMjQiPkJHTUkgVG91cm5hbWVudDwvdGV4dD4KPC9zdmc+';

const Home = () => {
  const [current, setCurrent] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrent((prev) => (prev + 1) % sliderImages.length);
    }, 2500);
    return () => clearInterval(interval);
  }, []);

  return (
    <div
      style={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #111111 0%, #18181b 100%)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
        paddingTop: 0,
        fontFamily: "'Montserrat', 'Poppins', Arial, sans-serif"
      }}
    >
      <div style={{
        background: 'rgba(24,24,27,0.85)',
        borderRadius: 16,
        boxShadow: '0 4px 24px rgba(0,0,0,0.4)',
        padding: 32,
        maxWidth: 420,
        width: '90vw',
        margin: '1px 0 24px 0',
        textAlign: 'center',
      }}>
        <h1 style={{ color: '#f87171', fontWeight: '900', fontSize: '2.2rem', marginBottom: 18, letterSpacing: 1, fontFamily: "'Montserrat', 'Poppins', Arial, sans-serif" }}>Welcome to Menix BGMI Tournaments</h1>
        <div style={{ position: 'relative', width: '100%', height: 220, marginBottom: 24, backgroundColor: '#333', borderRadius: 12, overflow: 'hidden' }}>
          {sliderImages.map((img, idx) => (
            <img
              key={idx}
              src={img || fallbackImage}
              alt={`BGMI Slide ${idx+1}`}
              onError={(e) => {
                console.log(`Failed to load image ${idx + 1}:`, img);
                e.target.src = fallbackImage;
              }}
              onLoad={() => console.log(`Successfully loaded image ${idx + 1}`)}
              style={{
                width: '100%',
                height: 220,
                objectFit: 'cover',
                borderRadius: 12,
                boxShadow: idx === current ? '0 2px 16px #b91c1c88' : 'none',
                opacity: idx === current ? 1 : 0,
                position: 'absolute',
                top: 0,
                left: 0,
                transition: 'opacity 0.7s',
                zIndex: idx === current ? 2 : 1,
              }}
            />
          ))}
          <div style={{ position: 'absolute', bottom: 10, left: '50%', transform: 'translateX(-50%)', display: 'flex', gap: 8 }}>
            {sliderImages.map((_, idx) => (
              <span key={idx} style={{
                width: 10, height: 10, borderRadius: '50%',
                background: idx === current ? '#b91c1c' : '#fff',
                opacity: idx === current ? 1 : 0.5,
                display: 'inline-block',
                transition: 'background 0.3s',
              }} />
            ))}
          </div>
        </div>
        <button
          className="btn"
          style={{ width: '100%', fontSize: '1.2rem', fontFamily: "'Montserrat', 'Poppins', Arial, sans-serif" }}
          onClick={() => navigate('/tournaments')}
        >
          BGMI Tournament
        </button>
      </div>
    </div>
  );
};

export default Home;