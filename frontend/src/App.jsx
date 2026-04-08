import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import PostListing from './pages/PostListing';
import ListingDetail from './pages/ListingDetail';
import Profile from './pages/Profile';
import Login from './pages/Login';
import Grainient from './components/Grainient';

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
        <Grainient
          color1="#841f81"
          color2="#4a445f"
          color3="#4a399d"
          timeSpeed={0.2}
          colorBalance={0}
          warpStrength={1}
          warpFrequency={5}
          warpSpeed={2}
          warpAmplitude={50}
          blendAngle={0}
          blendSoftness={0.05}
          rotationAmount={500}
          noiseScale={2}
          grainAmount={0.1}
          grainScale={2}
          grainAnimated={false}
          contrast={1.5}
          gamma={1}
          saturation={1}
          centerX={0}
          centerY={0}
          zoom={0.9}
        />
      </div>

      {/* Main Content Layer */}
      <div className="relative z-10">
        <Navbar />
        <div className="max-w-7xl mx-auto px-6 pb-12">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/post" element={<PostListing />} />
            <Route path="/listing/:id" element={<ListingDetail />} />
            <Route path="/profile" element={<Profile />} />
          </Routes>
        </div>
      </div>
    </div>
  );
}

export default App;