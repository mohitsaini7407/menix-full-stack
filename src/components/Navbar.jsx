import React, { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import logo from '../assets/logo.png';
import walletLogo from '../assets/wallet.png';
import avt1 from '../assets/avatar/avt1.png';
import avt2 from '../assets/avatar/avt2.png';
import avt3 from '../assets/avatar/avt3.png';
import Box from '@mui/material/Box';
import SwipeableDrawer from '@mui/material/SwipeableDrawer';
import List from '@mui/material/List';
import Divider from '@mui/material/Divider';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import IconButton from '@mui/material/IconButton';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import PersonIcon from '@mui/icons-material/Person';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';
import LogoutIcon from '@mui/icons-material/Logout';

const avatars = [avt1, avt2, avt3];
const getProfileAvatar = (user) => {
  const key = user?.username || user?.email || '';
  let hash = 0;
  for (let i = 0; i < key.length; i++) {
    hash = key.charCodeAt(i) + ((hash << 5) - hash);
  }
  const idx = Math.abs(hash) % avatars.length;
  return avatars[idx];
};

const Navbar = () => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [showNavbar, setShowNavbar] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(window.scrollY);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // Move the conditional return after all hooks
  useEffect(() => {
    let ticking = false;
    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          const currentScrollY = window.scrollY;
          if (currentScrollY > lastScrollY && currentScrollY > 40) {
            setShowNavbar(false); // Hide on scroll down
          } else {
            setShowNavbar(true); // Show on scroll up
          }
          setLastScrollY(currentScrollY);
          ticking = false;
        });
        ticking = true;
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [lastScrollY]);

  const toggleDrawer = (open) => (event) => {
    if (
      event &&
      event.type === 'keydown' &&
      (event.key === 'Tab' ||
        event.key === 'Shift')
    ) {
      return;
    }
    setIsMenuOpen(open);
  };

  const handleLogout = () => {
    logout();
    setIsMenuOpen(false);
    navigate('/login', { replace: true });
  };

  const handleMenuClick = () => {
    setIsMenuOpen(false);
  };

  // Now check if not home page, return null
  const isHomePage = location.pathname === '/';
  if (!isHomePage) {
    return null;
  }

  const menuList = () => (
    <Box
      sx={{ 
        width: 350,
        background: 'rgba(0, 0, 0, 0.9)',
        color: 'white',
        height: '100%'
      }}
      role="presentation"
      onClick={toggleDrawer(false)}
      onKeyDown={toggleDrawer(false)}
    >
      {/* Header Section with Profile */}
      <Box sx={{ 
        background: 'linear-gradient(135deg, #dc2626 0%, #000000 100%)', 
        p: 3, 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'space-between' 
      }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          {user && (
            <>
              <img
                src={getProfileAvatar(user)}
                alt="Profile"
                style={{
                  width: '100px', 
                  height: '100px', 
                  borderRadius: '50px',
                  border: '3px solid white',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.3)'
                }}
              />
              <Box>
                <Box sx={{ 
                  color: 'white', 
                  fontSize: '1.125rem', 
                  fontWeight: 'bold',
                  fontFamily: "'Montserrat', 'Poppins', Arial, sans-serif"
                }}>
                  {user.username || 'User'}
                </Box>
                <Box sx={{ 
                  color: '#fecaca', 
                  fontSize: '0.875rem',
                  fontFamily: "'Montserrat', 'Poppins', Arial, sans-serif"
                }}>
                  {user.email || user.phone || 'Welcome!'}
                </Box>
              </Box>
            </>
          )}
        </Box>
        <IconButton 
          onClick={toggleDrawer(false)}
          sx={{ color: 'white' }}
        >
          <ChevronLeftIcon />
        </IconButton>
      </Box>

      <Divider sx={{ backgroundColor: 'rgba(255, 255, 255, 0.2)' }} />
      
      {/* Menu Items */}
      <List sx={{ py: 2 }}>
        <ListItem disablePadding>
          <ListItemButton 
            component={Link} 
            to="/profile-details"
            onClick={handleMenuClick}
            sx={{ 
              py: 2,
              '&:hover': { backgroundColor: 'rgba(255, 255, 255, 0.1)' }
            }}
          >
            <ListItemIcon>
              <PersonIcon sx={{ color: '#dc2626' }} />
            </ListItemIcon>
            <ListItemText 
              primary="My Profile" 
              sx={{ 
                fontFamily: "'Montserrat', 'Poppins', Arial, sans-serif",
                fontWeight: 500,
                color: 'white'
              }}
            />
          </ListItemButton>
        </ListItem>
        
        <ListItem disablePadding>
          <ListItemButton 
            component={Link} 
            to="/tournaments"
            onClick={handleMenuClick}
            sx={{ 
              py: 2,
              '&:hover': { backgroundColor: 'rgba(255, 255, 255, 0.1)' }
            }}
          >
            <ListItemIcon>
              <ShoppingCartIcon sx={{ color: '#dc2626' }} />
            </ListItemIcon>
            <ListItemText 
              primary="Orders" 
              sx={{ 
                fontFamily: "'Montserrat', 'Poppins', Arial, sans-serif",
                fontWeight: 500,
                color: 'white'
              }}
            />
          </ListItemButton>
        </ListItem>
        
        <ListItem disablePadding>
          <ListItemButton 
            component={Link} 
            to="/wallet"
            onClick={handleMenuClick}
            sx={{ 
              py: 2,
              '&:hover': { backgroundColor: 'rgba(255, 255, 255, 0.1)' }
            }}
          >
            <ListItemIcon>
              <AccountBalanceWalletIcon sx={{ color: '#dc2626' }} />
            </ListItemIcon>
            <ListItemText 
              primary="Wallet" 
              sx={{ 
                fontFamily: "'Montserrat', 'Poppins', Arial, sans-serif",
                fontWeight: 500,
                color: 'white'
              }}
            />
          </ListItemButton>
        </ListItem>
      </List>
      
      <Divider sx={{ backgroundColor: 'rgba(255, 255, 255, 0.2)' }} />
      
      <List>
        <ListItem disablePadding>
          <ListItemButton 
            onClick={handleLogout}
            sx={{ 
              py: 2,
              color: '#dc2626',
              '&:hover': { backgroundColor: 'rgba(220, 38, 38, 0.1)' }
            }}
          >
            <ListItemIcon sx={{ color: '#dc2626' }}>
              <LogoutIcon />
            </ListItemIcon>
            <ListItemText 
              primary="Logout" 
              sx={{ 
                fontFamily: "'Montserrat', 'Poppins', Arial, sans-serif",
                fontWeight: 500
              }}
            />
          </ListItemButton>
        </ListItem>
      </List>
    </Box>
  );

  return (
    <>
      {/* Horizontal Top Navbar */}
      <nav className="navbar" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexDirection: 'row', width: '100%', fontFamily: "'Montserrat', 'Poppins', Arial, sans-serif" }}>
        {/* Hamburger menu on the far left */}
        <div className="navbar-hamburger" style={{ marginRight: '16px' }}>
          <button
            onClick={toggleDrawer(true)}
            className="p-0 focus:outline-none flex-shrink-0"
            aria-label="Toggle menu"
            style={{background: 'transparent', boxShadow: 'none'}}
          >
            <svg width="28" height="28" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="3" y1="6" x2="25" y2="6"></line>
              <line x1="3" y1="14" x2="25" y2="14"></line>
              <line x1="3" y1="22" x2="25" y2="22"></line>
            </svg>
          </button>
        </div>

        {/* Menix logo and name centered */}
        <div className="navbar-logo" style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <img 
            src={logo} 
            alt="Menix Logo" 
            style={{height:48, width:48, objectFit:'contain', marginTop: '4px'}} 
            className="flex-shrink-0"
            onError={(e) => {
              console.log('Logo failed to load, using fallback');
              e.target.style.display = 'none';
            }}
          />
          <span className="text-xs text-white font-bold tracking-widest truncate max-w-[60px]" style={{ fontFamily: "'Montserrat', 'Poppins', Arial, sans-serif" }}>Menix</span>
        </div>

        {/* Wallet icon on the far right */}
        <div className="navbar-wallet" style={{ marginLeft: '16px', display: 'flex', alignItems: 'center', justifyContent: 'flex-end' }}>
          <Link to="/wallet" title="Wallet" className="inline-flex items-center justify-center flex-shrink-0" style={{marginRight: 0}}>
            <img 
              src={walletLogo} 
              alt="Wallet" 
              style={{ width: 44, height: 44, borderRadius: '50%', boxShadow: '0 2px 8px rgba(0,0,0,0.25)', border: '2.5px solid #e40019', background: '#fff', padding: 4 }}
              onError={(e) => {
                console.log('Wallet logo failed to load');
                e.target.style.display = 'none';
              }}
            />
          </Link>
        </div>
      </nav>

      {/* Material-UI SwipeableDrawer */}
      <SwipeableDrawer
        anchor="left"
        open={isMenuOpen}
        onClose={toggleDrawer(false)}
        onOpen={toggleDrawer(true)}
        sx={{
          '& .MuiDrawer-paper': {
            width: 350,
            boxSizing: 'border-box',
          },
        }}
      >
        {menuList()}
      </SwipeableDrawer>
    </>
  );
};

export default Navbar; 