import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import PostListing from './pages/PostListing';
import ListingDetail from './pages/ListingDetail';
import Profile from './pages/Profile';
import Login from './pages/Login';
import Aurora from './components/Aurora';

function App() {
  return (
    <div className="min-h-screen text-text-primary font-sans selection:bg-accent-cyan selection:text-white">

      {/* Background Layer - Grainient */}
      <div style={{
        position: 'fixed',
        inset: 0,
        zIndex: 0,
        width: '100vw',
        height: '100vh',
        pointerEvents: 'none',
      }}>
        <Aurora
          colorStops={["#0f114d", "#957c9c", "#460c42"]}
          blend={0.52}
          amplitude={1.0}
          speed={1.3}
        />
      </div>

      {/* Main Content Layer */}
      <div className="relative z-10">
        <Navbar />
        <div className="max-w-7xl mx-auto px-6 pt-32 pb-12">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/post" element={<PostListing />} />
            <Route path="/listing/:id" element={<ListingDetail />} />
            <Route path="/profile" element={<Profile />} />
          </Routes>

          {/* Footer */}
          <footer className="relative mt-6 h-10 text-center flex items-center justify-center">
            <div className="absolute left-0 right-0 top-0 border-t border-white/5" />
            <p className="m-0 pt-1 leading-none text-text-secondary text-xs font-black uppercase tracking-[0.3em] opacity-50 hover:opacity-100 transition-opacity duration-500">
              Made by <span className="text-accent-cyan">Priyali</span>
            </p>
          </footer>
        </div>
      </div>
    </div>
  );
}

export default App;
