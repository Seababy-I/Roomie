// UPDATED: frontend/src/pages/Home.jsx

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, SlidersHorizontal, X, IndianRupee, MapPin, User, Bed, RotateCcw, ArrowRight, Sparkles } from 'lucide-react';
import ListingCard from '../components/ListingCard';
import axios from 'axios';

const FilterDrawer = ({ isOpen, onClose, filters, setFilters, onApply, onClear }) => {
  // MODIFIED: autocomplete state + static suggestions
  const locationSuggestions = ['TC', 'Tiger Circle', 'MIT Gate', 'End Point', 'Bus Stand'];
  const [locationInput, setLocationInput] = useState(filters.location || '');
  const [filteredSuggestions, setFilteredSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const locationRef = useRef(null);

  // MODIFIED: keep local input synced with parent filter state
  useEffect(() => {
    setLocationInput(filters.location || '');
  }, [filters.location]);

  // MODIFIED: dynamic case-insensitive filtering
  useEffect(() => {
    const query = locationInput.trim().toLowerCase();
    if (!query) {
      setFilteredSuggestions(locationSuggestions);
      setShowSuggestions(false);
      return;
    }

    const matches = locationSuggestions.filter((location) =>
      location.toLowerCase().includes(query)
    );

    setFilteredSuggestions(matches);
    setShowSuggestions(matches.length > 0);
  }, [locationInput]);

  // MODIFIED: close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (locationRef.current && !locationRef.current.contains(event.target)) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // MODIFIED: allow free text
  const handleLocationChange = (e) => {
    const value = e.target.value;
    setLocationInput(value);
    setFilters({ ...filters, location: value });
  };

  // MODIFIED: select suggestion and close dropdown
  const handleLocationSelect = (value) => {
    setLocationInput(value);
    setFilters({ ...filters, location: value });
    setShowSuggestions(false);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-bg-dark/80 backdrop-blur-sm z-[110]"
          />
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed right-0 top-0 h-full w-full max-w-md bg-card-dark z-[120] p-8 shadow-2xl border-l border-white/5 overflow-y-auto"
          >
            <div className="flex justify-between items-center mb-10">
              <h3 className="text-2xl font-extrabold tracking-tight flex items-center gap-2">
                <SlidersHorizontal className="text-accent-cyan" /> Refine Search
              </h3>
              <button onClick={onClose} className="p-2 hover:bg-white/5 rounded-full transition-colors"><X /></button>
            </div>

            <div className="space-y-10">
              <div className="space-y-4">
                <label className="text-xs font-bold text-text-secondary uppercase tracking-widest flex items-center gap-2">
                  <IndianRupee className="w-3.5 h-3.5" /> Monthly Budget
                </label>
                <div className="grid grid-cols-2 gap-4">
                  <input
                    type="number" placeholder="Min"
                    value={filters.minRent} onChange={(e) => setFilters({ ...filters, minRent: e.target.value })}
                    className="bg-bg-dark border border-white/5 rounded-xl p-3 text-sm focus:border-accent-cyan outline-none transition-all focus:ring-4 focus:ring-accent-cyan/10"
                  />
                  <input
                    type="number" placeholder="Max"
                    value={filters.maxRent} onChange={(e) => setFilters({ ...filters, maxRent: e.target.value })}
                    className="bg-bg-dark border border-white/5 rounded-xl p-3 text-sm focus:border-accent-cyan outline-none transition-all focus:ring-4 focus:ring-accent-cyan/10"
                  />
                </div>
              </div>

              <div className="space-y-4">
                <label className="text-xs font-bold text-text-secondary uppercase tracking-widest flex items-center gap-2">
                  <MapPin className="w-3.5 h-3.5" /> Preferred Location
                </label>

                {/* MODIFIED: autocomplete input with free text support */}
                <div ref={locationRef} className="relative">
                  <input
                    type="text"
                    placeholder="e.g. TC, End Point"
                    value={locationInput}
                    onChange={handleLocationChange}
                    onFocus={() => setShowSuggestions(filteredSuggestions.length > 0)}
                    className="w-full bg-bg-dark border border-white/5 rounded-xl p-3 text-sm focus:border-accent-cyan outline-none transition-all focus:ring-4 focus:ring-accent-cyan/10"
                  />

                  {showSuggestions && filteredSuggestions.length > 0 && (
                    <div className="absolute top-[calc(100%+0.5rem)] left-0 right-0 z-20 overflow-hidden rounded-2xl border border-white/8 bg-card-dark/95 backdrop-blur-xl shadow-2xl">
                      {filteredSuggestions.map((location) => (
                        <button
                          key={location}
                          type="button"
                          onMouseDown={(e) => e.preventDefault()}
                          onClick={() => handleLocationSelect(location)}
                          className="w-full px-4 py-3 text-left text-sm text-text-primary transition-colors hover:bg-white/5"
                        >
                          {location}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              <div className="space-y-4">
                <label className="text-xs font-bold text-text-secondary uppercase tracking-widest flex items-center gap-2">
                  <Bed className="w-3.5 h-3.5" /> Flat Type
                </label>
                <div className="flex flex-wrap gap-2">
                  {['1BHK', '2BHK', '3BHK', 'PG', 'Other'].map(type => (
                    <button
                      key={type}
                      onClick={() => setFilters({ ...filters, flatType: filters.flatType === type ? '' : type })}
                      className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-wider transition-all border ${filters.flatType === type ? 'bg-accent-cyan text-white border-accent-cyan shadow-lg shadow-accent-cyan/20' : 'bg-bg-dark text-text-secondary border-white/5 hover:border-white/20'}`}
                    >
                      {type}
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-4">
                <label className="text-xs font-bold text-text-secondary uppercase tracking-widest flex items-center gap-2">
                  <User className="w-3.5 h-3.5" /> Gender Preference
                </label>
                <div className="grid grid-cols-2 gap-3">
                  {['Male', 'Female'].map(g => (
                    <button
                      key={g}
                      onClick={() => setFilters({ ...filters, genderPreference: g })}
                      className={`py-3 rounded-xl text-xs font-bold transition-all border ${filters.genderPreference === g ? 'bg-accent-cyan text-white border-accent-cyan shadow-lg shadow-accent-cyan/20' : 'bg-bg-dark text-text-secondary border-white/5 hover:border-white/20'}`}
                    >
                      {g}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex gap-4 pt-10 border-t border-white/5 mt-auto">
                <button
                  onClick={onClear}
                  className="flex-1 bg-white/5 hover:bg-white/10 text-text-secondary py-4 rounded-2xl font-bold transition-all flex items-center justify-center gap-2"
                >
                  <RotateCcw className="w-4 h-4" /> Reset
                </button>
                <button
                  onClick={onApply}
                  className="flex-[2] bg-accent-cyan hover:bg-indigo-700 text-white py-4 rounded-2xl font-extrabold transition-all shadow-xl shadow-accent-cyan/20"
                >
                  Apply Filters
                </button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

const Home = () => {
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeSearch, setActiveSearch] = useState('');

  const [filters, setFilters] = useState({
    minRent: '',
    maxRent: '',
    location: '',
    genderPreference: '',
    flatType: ''
  });

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchListings({ ...filters, location: activeSearch });
    }, 500);
    return () => clearTimeout(timer);
  }, [activeSearch]);

  const fetchListings = async (customFilters = filters) => {
    setLoading(true);
    try {
      const apiBase = 'https://roomie-m9ps.onrender.com/api';
      const params = new URLSearchParams();
      if (customFilters.minRent) params.append('minRent', customFilters.minRent);
      if (customFilters.maxRent) params.append('maxRent', customFilters.maxRent);
      if (customFilters.location) params.append('location', customFilters.location);
      if (customFilters.genderPreference) params.append('genderPreference', customFilters.genderPreference);
      if (customFilters.flatType) params.append('flatType', customFilters.flatType);

      const { data } = await axios.get(`${apiBase}/listings?${params.toString()}`);
      setListings(data.listings);
      setLoading(false);
    } catch (err) {
      setError('Failed to load listings.');
      setLoading(false);
    }
  };

  const handleApplyFilters = () => {
    fetchListings();
    setIsFilterOpen(false);
  };

  const handleClearFilters = () => {
    const cleared = { minRent: '', maxRent: '', location: '', genderPreference: '', flatType: '' };
    setFilters(cleared);
    fetchListings(cleared);
    setIsFilterOpen(false);
  };

  return (
    <div className="relative">
      <FilterDrawer
        isOpen={isFilterOpen}
        onClose={() => setIsFilterOpen(false)}
        filters={filters}
        setFilters={setFilters}
        onApply={handleApplyFilters}
        onClear={handleClearFilters}
      />

      <div className="relative z-10 space-y-24 pb-20 pt-8">
        <header className="pt-6 pb-10 text-center space-y-12 max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="space-y-8"
          >
            <h1 className="text-5xl md:text-7xl font-black tracking-tighter leading-[1] md:leading-[0.98] select-none font-display">
              Find your <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-accent-cyan via-indigo-400 to-accent-cyan bg-[length:200%_auto] animate-gradient-slow drop-shadow-[0_0_30px_rgba(99,102,241,0.3)]">Perfect Roomie. </span>
            </h1>
            <p className="text-xl md:text-2xl text-text-secondary max-w-3xl mx-auto leading-relaxed font-medium">
              The absolute best system to find your perfect room and compatible roommates at MIT. 
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.4, duration: 0.6 }}
            className="flex flex-col md:flex-row gap-5 items-center justify-center pt-8 px-6"
          >
            <div className="relative w-full max-w-xl group">
              <Search className="absolute left-7 top-1/2 -translate-y-1/2 w-6 h-6 text-text-secondary group-focus-within:text-accent-cyan transition-all duration-300" />
              <input
                type="text"
                value={activeSearch}
                onChange={(e) => setActiveSearch(e.target.value)}
                placeholder="Where in Manipal do you want to live?"
                className="w-full bg-card-dark/40 backdrop-blur-2xl border border-white/5 focus:border-accent-cyan rounded-[2rem] py-7 pl-16 pr-8 text-text-primary text-lg placeholder:text-text-secondary/40 outline-none transition-all focus:ring-[15px] focus:ring-accent-cyan/5 shadow-[0_30px_60px_-15px_rgba(0,0,0,0.5)]"
              />
            </div>
            <button
              onClick={() => setIsFilterOpen(true)}
              className="w-full md:w-auto flex items-center justify-center gap-4 bg-card-dark/40 backdrop-blur-2xl border border-white/5 hover:border-accent-cyan px-12 py-7 rounded-[2rem] font-black transition-all shadow-[0_30px_60px_-15px_rgba(0,0,0,0.5)] group hover:-translate-y-2 hover:shadow-accent-cyan/10 active:scale-95 text-lg"
            >
              <SlidersHorizontal className="w-6 h-6 group-hover:rotate-180 transition-transform duration-700 ease-out" /> Refine
            </button>
          </motion.div>
        </header>

        <section className="space-y-16 px-6">
          <div className="flex flex-col md:flex-row items-end justify-between gap-10">
            <div className="space-y-3">
              <h2
                className="text-5xl font-extrabold tracking-normal leading-[1.05]"
                style={{ fontFamily: "'DM Sans', system-ui, sans-serif" }}
              >
                Curated Rooms
              </h2>
              <div className="h-1.5 w-24 bg-accent-cyan rounded-full" />
            </div>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
              {[1, 2, 3].map(s => (
                <div key={s} className="h-[500px] bg-card-dark/20 rounded-[3rem] animate-pulse border border-white/5 shadow-inner" />
              ))}
            </div>
          ) : listings.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-40 text-center gap-10 bg-card-dark/20 backdrop-blur-lg rounded-[4rem] border border-dashed border-white/10 mx-auto">
              <div className="p-12 bg-accent-cyan/5 rounded-full ring-1 ring-accent-cyan/10">
                <Search className="w-20 h-20 text-accent-cyan/30" />
              </div>
              <div className="space-y-4">
                <h3 className="text-3xl font-black tracking-tight">Nothing on our radar...</h3>
                <p className="text-text-secondary font-medium max-w-md mx-auto">Adjust your filters or try searching for a broader location like 'Manipal'.</p>
              </div>
              <button onClick={handleClearFilters} className="bg-white/5 px-10 py-5 rounded-full font-black hover:bg-accent-cyan hover:text-white transition-all flex items-center gap-3">
                <RotateCcw className="w-5 h-5" /> Reset My Search
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
              <AnimatePresence>
                {listings.map((listing, index) => (
                  <motion.div
                    key={listing._id}
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <ListingCard listing={listing} />
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          )}
        </section>
      </div>
    </div>
  );
};

export default Home;
