import React, { useState, useEffect } from 'react';
import { Search, User, PlusCircle, LogIn, LogOut, Menu, X, Sparkles } from 'lucide-react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const token = localStorage.getItem('token');
  const userInfo = JSON.parse(localStorage.getItem('userInfo') || '{}');

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

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
            className="absolute inset-0 bg-accent-cyan rounded-full -z-10 shadow-lg shadow-accent-cyan/20"
            transition={{ type: 'spring', bounce: 0.2, duration: 0.6 }}
          />
        )}
      </Link>
    );
  };

  return (
    <div className="fixed top-6 left-0 right-0 z-[100] flex justify-center px-6">
      <motion.nav
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className={`w-full max-w-4xl flex items-center justify-between px-6 py-3 rounded-full border border-white/10 shadow-2xl transition-all duration-500 ${scrolled ? 'bg-card-dark/60 backdrop-blur-2xl' : 'bg-card-dark/40 backdrop-blur-xl'
          }`}
      >
        {/* LOGO */}
        <Link to="/" className="flex items-center gap-2 group">
          <div className="w-9 h-9 bg-accent-cyan rounded-xl flex items-center justify-center shadow-lg group-hover:rotate-12 transition-transform duration-300 ring-1 ring-white/10">
            <Sparkles className="w-5 h-5 text-white fill-current" />
          </div>
          <span className="text-xl font-black tracking-tighter text-text-primary">Roomie</span>
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
              className="px-6 py-2.5 bg-accent-cyan hover:bg-indigo-700 text-white rounded-full font-black text-xs transition-all shadow-lg shadow-accent-cyan/20 flex items-center gap-2 active:scale-95"
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
    </div>
  );
};

export default Navbar;
