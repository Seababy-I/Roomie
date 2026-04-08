import React, { useState, useEffect, useRef } from 'react';
import { Search, User, PlusCircle, LogIn, LogOut, Menu, X, Sparkles } from 'lucide-react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

const RoomieMark = ({ className = "w-10 h-10" }) => (
  <svg
    viewBox="0 0 64 64"
    className={className}
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    aria-hidden="true"
  >
    <defs>
      <linearGradient id="roomie-bg" x1="8" y1="8" x2="56" y2="56" gradientUnits="userSpaceOnUse">
        <stop stopColor="#2D1858" />
        <stop offset="1" stopColor="#1A1134" />
      </linearGradient>
      <linearGradient id="roomie-stroke" x1="10" y1="8" x2="54" y2="56" gradientUnits="userSpaceOnUse">
        <stop stopColor="#8B5CF6" />
        <stop offset="1" stopColor="#5B36D6" />
      </linearGradient>
      <linearGradient id="roomie-arch" x1="8" y1="45" x2="56" y2="45" gradientUnits="userSpaceOnUse">
        <stop stopColor="#C4B5FD" stopOpacity="0.9" />
        <stop offset="0.55" stopColor="#A78BFA" stopOpacity="0.8" />
        <stop offset="1" stopColor="#818CF8" stopOpacity="0.45" />
      </linearGradient>
    </defs>

    <rect x="6.5" y="6.5" width="51" height="51" rx="15" fill="url(#roomie-bg)" />
    <rect x="6.5" y="6.5" width="51" height="51" rx="15" stroke="url(#roomie-stroke)" strokeWidth="1.5" />

    <circle cx="24" cy="22" r="10" fill="#D8C7FF" fillOpacity="0.92" />
    <circle cx="38" cy="22" r="10" fill="#8A8DF4" fillOpacity="0.72" />

    <path
      d="M9 43C16 38.5 25 36.5 32 36.5C39 36.5 48 38.5 55 43"
      stroke="url(#roomie-arch)"
      strokeWidth="4.5"
      strokeLinecap="round"
    />
    <path
      d="M23 48C26.5 45 29.5 43.2 32 42.2C34.6 43.1 37.6 45 41 48"
      stroke="#A78BFA"
      strokeOpacity="0.7"
      strokeWidth="3.5"
      strokeLinecap="round"
    />
  </svg>
);

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [scrolled, setScrolled] = useState(false);
  const [navVisible, setNavVisible] = useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const lastScrollY = useRef(0);
  const token = localStorage.getItem('token');
  const userInfo = JSON.parse(localStorage.getItem('userInfo') || '{}');

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      setScrolled(currentScrollY > 20);

      if (mobileMenuOpen) {
        setNavVisible(true);
      } else if (currentScrollY <= 140) {
        setNavVisible(true);
      } else if (currentScrollY - lastScrollY.current > 8) {
        setNavVisible(false);
      } else {
        setNavVisible(true);
      }

      lastScrollY.current = currentScrollY;
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [mobileMenuOpen]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userInfo');
    navigate('/login');
  };

  const NavLink = ({ to, children, icon: Icon }) => {
    const isActive = location.pathname === to;
    return (
      <Link
        to={to}
        className={`relative flex items-center gap-2 px-4 py-2 rounded-full text-sm font-bold transition-all duration-300 ${isActive ? 'text-white' : 'text-text-secondary hover:text-white hover:bg-white/5'
          }`}
      >
        {Icon && <Icon className="w-4 h-4" />}
        {children}
        {isActive && (
          <motion.div
            layoutId="nav-pill"
            className="absolute inset-0 rounded-full -z-10 border border-white/12 bg-accent-cyan/18 shadow-lg shadow-black/20 backdrop-blur-2xl"
            transition={{ type: 'spring', bounce: 0.2, duration: 0.6 }}
          />
        )}
      </Link>
    );
  };

  return (
    <motion.div
      className="fixed top-6 left-0 right-0 z-[100] flex justify-center px-6"
      initial={{ y: 0, opacity: 1 }}
      animate={{ y: navVisible ? 0 : -120, opacity: navVisible ? 1 : 0 }}
      transition={{ duration: 0.3, ease: 'easeInOut' }}
    >
      <motion.nav
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className={`w-full max-w-4xl flex items-center justify-between px-6 py-3 rounded-full border shadow-2xl transition-all duration-500 ${scrolled ? 'bg-card-dark/35 border-white/12 backdrop-blur-3xl' : 'bg-card-dark/20 border-white/8 backdrop-blur-2xl'
          }`}
      >
        {/* LOGO */}
        <Link to="/" className="flex items-center gap-3 group">
          <div className="flex items-center justify-center rounded-2xl transition-transform duration-300 group-hover:scale-[1.03]">
            <RoomieMark className="w-10 h-10 drop-shadow-[0_8px_24px_rgba(79,70,229,0.2)]" />
          </div>
          <span className="text-xl font-black tracking-tighter text-[#D8C7FF]">Roomie</span>
        </Link>

        {/* DESKTOP NAV */}
        <div className="hidden md:flex items-center gap-2">
          <NavLink to="/">Rooms</NavLink>
          <NavLink to="/post" icon={PlusCircle}>Post</NavLink>
        </div>

        {/* ACTIONS */}
        <div className="flex items-center gap-3">
          {token ? (
            <div className="flex items-center gap-2">
              <button
                onClick={() => navigate('/profile')}
                className="flex items-center gap-2 p-1.5 pr-4 border border-white/5 bg-white/5 hover:bg-white/10 rounded-full transition-all group"
              >
                <div className="w-8 h-8 rounded-full overflow-hidden border border-accent-cyan/30 bg-accent-cyan/10 flex items-center justify-center">
                   <User className="w-4 h-4 text-accent-cyan" />
                </div>
                <span className="text-xs font-bold text-text-secondary group-hover:text-text-primary hidden lg:block transition-colors">
                  Dashboard
                </span>
              </button>
              <button
                onClick={handleLogout}
                className="p-2.5 hover:bg-red-500/10 rounded-full transition-all text-text-secondary hover:text-red-400"
                title="Logout"
              >
                <LogOut className="w-5 h-5" />
              </button>
            </div>
          ) : (
            <Link
              to="/login"
              className="px-6 py-2.5 rounded-full font-black text-xs transition-all flex items-center gap-2 active:scale-95 text-white border border-white/12 bg-accent-cyan/18 hover:bg-accent-cyan/24 backdrop-blur-2xl shadow-lg shadow-black/20"
            >
              <LogIn className="w-4 h-4" /> <span>Sign In</span>
            </Link>
          )}

          {/* MOBILE TOGGLE */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2.5 hover:bg-white/5 rounded-full transition-all text-text-secondary"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </motion.nav>

      {/* MOBILE MENU */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            className="absolute top-24 left-6 right-6 p-6 bg-card-dark/95 backdrop-blur-2xl rounded-[2.5rem] border border-white/5 shadow-2xl z-50 md:hidden flex flex-col gap-4"
          >
            <Link
              to="/"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center gap-4 p-4 hover:bg-white/5 rounded-2xl transition-all"
            >
              <Sparkles className="w-5 h-5 text-accent-cyan" />
              <span className="font-black">Browse Rooms</span>
            </Link>
            <Link
              to="/post"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center gap-4 p-4 hover:bg-white/5 rounded-2xl transition-all"
            >
              <PlusCircle className="w-5 h-5 text-accent-cyan" />
              <span className="font-black">Post Listing</span>
            </Link>
            {token ? (
              <>
                <Link
                  to="/profile"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center gap-4 p-4 hover:bg-white/5 rounded-2xl transition-all"
                >
                  <User className="w-5 h-5 text-accent-cyan" />
                  <span className="font-black">My Profile</span>
                </Link>
                <button
                  onClick={() => { handleLogout(); setMobileMenuOpen(false); }}
                  className="flex items-center gap-4 p-4 hover:bg-red-500/5 text-red-400 rounded-2xl transition-all"
                >
                  <LogOut className="w-5 h-5" />
                  <span className="font-black">Logout</span>
                </button>
              </>
            ) : (
              <Link
                to="/login"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full bg-accent-cyan p-5 rounded-2xl text-center font-black"
              >
                Sign In to Roomie
              </Link>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default Navbar;
