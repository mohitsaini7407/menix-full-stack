import { BrowserRouter as Router, Routes, Route, useLocation, useNavigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { TournamentProvider } from './contexts/TournamentContext';
import ApiTest from './components/ApiTest';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Tournaments from './pages/Tournaments';
import CreateTournament from './pages/CreateTournament';
import TournamentDetail from './pages/TournamentDetail';
import RegisterTeam from './pages/RegisterTeam';
import LiveMatch from './pages/LiveMatch';
import Leaderboard from './pages/Leaderboard';
import Profile from './pages/Profile';
import Login from './pages/Authentication/Login';
import Signup from './pages/Authentication/Signup';
import ProtectedRoute from './components/ProtectedRoute';
import ProfileDetails from './pages/ProfileDetails';
import React, { useEffect } from 'react';
import Wallet from './pages/Wallet';
import Pay from './pages/Pay';
import { App as CapApp } from '@capacitor/app';

// Wrap the main App logic in a component that has access to useNavigate and useLocation
function AppWithBackButton() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, loading } = useAuth();

  // Show loading state while auth is being determined
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center">
        <div className="text-white text-xl">Loading...</div>
      </div>
    );
  }

  // Redirect to login if not authenticated (except for login and signup pages)
  useEffect(() => {
    const publicPaths = ['/login', '/signup'];
    if (!user && !publicPaths.includes(location.pathname)) {
      navigate('/login', { replace: true });
    }
  }, [user, location.pathname, navigate]);

  // Android back button handling
  useEffect(() => {
    const handler = () => {
      if (location.pathname === '/') {
        CapApp.exitApp();
      } else {
        navigate(-1);
      }
    };

    let removeListener;
    CapApp.addListener('backButton', handler).then((listener) => {
      removeListener = listener;
    });

    return () => {
      if (removeListener && typeof removeListener.remove === 'function') {
        removeListener.remove();
      }
    };
  }, [location, navigate]);

  // Pull-to-refresh logic
  React.useEffect(() => {
    let startY = 0;
    let isPulling = false;
    let threshold = 80; // px
    let startScroll = 0;
    let lastTouchTime = 0;

    const onTouchStart = (e) => {
      if (window.scrollY === 0) {
        startY = e.touches[0].clientY;
        startScroll = window.scrollY;
        isPulling = true;
        lastTouchTime = Date.now();
      }
    };
    const onTouchMove = (e) => {
      if (!isPulling) return;
      const currentY = e.touches[0].clientY;
      if (currentY - startY > threshold && window.scrollY === 0) {
        window.location.reload();
        isPulling = false;
      }
    };
    const onTouchEnd = () => {
      isPulling = false;
    };
    window.addEventListener('touchstart', onTouchStart, { passive: true });
    window.addEventListener('touchmove', onTouchMove, { passive: true });
    window.addEventListener('touchend', onTouchEnd, { passive: true });
    return () => {
      window.removeEventListener('touchstart', onTouchStart);
      window.removeEventListener('touchmove', onTouchMove);
      window.removeEventListener('touchend', onTouchEnd);
    };
  }, []);

  // Show only login/signup pages if not authenticated
  if (!user && !['/login', '/signup'].includes(location.pathname)) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900" style={{ fontFamily: "'Montserrat', 'Poppins', Arial, sans-serif" }}>
        <main className="container mx-auto px-4 py-8" style={{marginLeft: 1, marginRight: 1}}>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="*" element={<Login />} />
          </Routes>
        </main>
      </div>
    );
  }

  // If user is not authenticated and we're on login/signup, show those pages
  if (!user && ['/login', '/signup'].includes(location.pathname)) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900" style={{ fontFamily: "'Montserrat', 'Poppins', Arial, sans-serif" }}>
        <main className="container mx-auto px-4 py-8" style={{marginLeft: 1, marginRight: 1}}>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="*" element={<Login />} />
          </Routes>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900" style={{ fontFamily: "'Montserrat', 'Poppins', Arial, sans-serif" }}>
      <Navbar />
      <main className="container mx-auto px-4 py-8" style={{marginLeft: 1, marginRight: 1}}>
        <TournamentProvider>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/tournaments" element={<Tournaments />} />
            <Route path="/tournament/:id" element={<TournamentDetail />} />
            <Route path="/tournament/:id/register" element={<RegisterTeam />} />
            <Route path="/tournament/:id/live" element={<LiveMatch />} />
            <Route path="/leaderboard" element={<Leaderboard />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route 
              path="/admin/create" 
              element={
                <ProtectedRoute adminOnly>
                  <CreateTournament />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/profile" 
              element={
                <ProtectedRoute>
                  <Profile />
                </ProtectedRoute>
              } 
            />
            <Route path="/profile-details" element={<ProfileDetails />} />
            <Route path="/wallet" element={<Wallet />} />
            <Route path="/pay" element={<Pay />} />
            <Route path="/api-test" element={<ApiTest />} />
            <Route path="*" element={<div className="text-center text-white text-2xl mt-20" style={{ fontFamily: "'Montserrat', 'Poppins', Arial, sans-serif" }}>404 - Page Not Found</div>} />
          </Routes>
        </TournamentProvider>
      </main>
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <Router>
        <AppWithBackButton />
      </Router>
    </AuthProvider>
  );
}

export default App;
