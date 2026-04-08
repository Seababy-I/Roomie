import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { PlusCircle, IndianRupee, MapPin, Bed, User, Calendar, Tag, FileText, CheckCircle2 } from 'lucide-react';
import axios from 'axios';

const PostListing = () => {
  const [formData, setFormData] = useState({
    title: '',
    rent: '',
    location: '',
    flatType: '1BHK',
    genderPreference: 'Any',
    moveInDate: '',
    description: '',
    amenities: '',
    cleanliness: 'Medium',
    sleepSchedule: 'Flexible',
    foodPreference: 'Any'
  });

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      // Mocking token for now until Auth is fully integrated
      const token = localStorage.getItem('token');

      const config = {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        }
      };

      const payload = {
        ...formData,
        amenities: formData.amenities.split(',').map(item => item.trim()),
        compatibilityTags: {
          cleanliness: formData.cleanliness,
          sleepSchedule: formData.sleepSchedule,
          foodPreference: formData.foodPreference
        }
      };

      await axios.post(`${import.meta.env.VITE_API_URL || 'http://localhost:5000/api'}/listings`, payload, config);
      setSuccess(true);
      setLoading(false);
    } catch (err) {
      setError(err.response?.data?.message || 'Something went wrong. Make sure you are logged in.');
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center animate-in fade-in zoom-in duration-500">
        <div className="bg-accent-cyan/20 p-6 rounded-full mb-6">
          <CheckCircle2 className="w-16 h-16 text-accent-cyan" />
        </div>
        <h2 className="text-4xl font-extrabold mb-4">Listing Posted Successfully!</h2>
        <p className="text-text-secondary mb-10 max-w-md">Your roommate request is now live for others to discover.</p>
        <button
          onClick={() => window.location.href = '/'}
          className="bg-accent-cyan hover:bg-indigo-700 text-white px-10 py-4 rounded-2xl font-bold transition-all shadow-xl shadow-accent-cyan/20"
        >
          View All Listings
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-12">
      <div className="text-center">
        <h1 className="text-4xl font-extrabold mb-3 tracking-tight">Post a New Listing</h1>
        <p className="text-text-secondary">Fill in the details to find your next great roommate.</p>
      </div>

      <motion.form
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        onSubmit={handleSubmit}
        className="bg-card-dark/82 backdrop-blur-xl rounded-3xl p-10 border border-white/8 space-y-10 shadow-2xl"
      >
        {/* Core Details Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-4">
            <label className="text-sm font-bold text-text-secondary flex items-center gap-2 uppercase tracking-widest"><FileText className="w-4 h-4" /> Listing Title</label>
            <input
              name="title" required value={formData.title} onChange={handleChange}
              placeholder="e.g. Spacious 2BHK near TC"
              className="w-full bg-white/5 border border-white/5 rounded-2xl p-4 text-text-primary focus:border-accent-cyan outline-none transition-all"
            />
          </div>

          <div className="space-y-4">
            <label className="text-sm font-bold text-text-secondary flex items-center gap-2 uppercase tracking-widest"><IndianRupee className="w-4 h-4" /> Monthly Rent (₹)</label>
            <input
              name="rent" type="number" required value={formData.rent} onChange={handleChange}
              placeholder="e.g. 15000"
              className="w-full bg-white/5 border border-white/5 rounded-2xl p-4 text-text-primary focus:border-accent-cyan outline-none transition-all"
            />
          </div>

          <div className="space-y-4">
            <label className="text-sm font-bold text-text-secondary flex items-center gap-2 uppercase tracking-widest"><MapPin className="w-4 h-4" /> Location</label>
            <input
              name="location" required value={formData.location} onChange={handleChange}
              placeholder="e.g. Tiger Circle, Manipal"
              className="w-full bg-white/5 border border-white/5 rounded-2xl p-4 text-text-primary focus:border-accent-cyan outline-none transition-all"
            />
          </div>

          <div className="space-y-4">
            <label className="text-sm font-bold text-text-secondary flex items-center gap-2 uppercase tracking-widest"><Calendar className="w-4 h-4" /> Move-in Date</label>
            <input
              name="moveInDate" type="date" required value={formData.moveInDate} onChange={handleChange}
              className="w-full bg-white/5 border border-white/5 rounded-2xl p-4 text-text-primary focus:border-accent-cyan outline-none transition-all color-scheme-dark"
            />
          </div>
        </div>

        {/* Preferences Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-6 border-t border-white/5">
          <div className="space-y-4">
            <label className="text-sm font-bold text-text-secondary flex items-center gap-2 uppercase tracking-widest"><Bed className="w-4 h-4" /> Flat Type</label>
            <select name="flatType" value={formData.flatType} onChange={handleChange} className="w-full bg-white/5 border border-white/5 rounded-2xl p-4 text-text-primary focus:border-accent-cyan outline-none appearance-none cursor-pointer">
              {['1BHK', '2BHK', '3BHK', 'PG', 'Other'].map(type => <option key={type} className="bg-card-dark">{type}</option>)}
            </select>
          </div>

          <div className="space-y-4">
            <label className="text-sm font-bold text-text-secondary flex items-center gap-2 uppercase tracking-widest"><User className="w-4 h-4" /> Gender Preference</label>
            <select name="genderPreference" value={formData.genderPreference} onChange={handleChange} className="w-full bg-white/5 border border-white/5 rounded-2xl p-4 text-text-primary focus:border-accent-cyan outline-none appearance-none cursor-pointer">
              {['Any', 'Male', 'Female'].map(gender => <option key={gender} className="bg-card-dark">{gender}</option>)}
            </select>
          </div>
        </div>

        {/* Compatibility Section */}
        <div className="space-y-6 pt-6 border-t border-white/5">
          <h3 className="text-lg font-bold text-accent-cyan">Roommate Compatibility Tags</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-3">
              <label className="text-xs font-bold text-text-secondary uppercase">Cleanliness</label>
              <select name="cleanliness" value={formData.cleanliness} onChange={handleChange} className="w-full bg-white/5 border border-white/5 rounded-xl p-3 text-sm focus:border-accent-cyan outline-none">
                {['Low', 'Medium', 'High'].map(v => <option key={v} className="bg-card-dark">{v}</option>)}
              </select>
            </div>
            <div className="space-y-3">
              <label className="text-xs font-bold text-text-secondary uppercase">Sleep Schedule</label>
              <select name="sleepSchedule" value={formData.sleepSchedule} onChange={handleChange} className="w-full bg-white/5 border border-white/5 rounded-xl p-3 text-sm focus:border-accent-cyan outline-none">
                {['Flexible', 'Early Bird', 'Night Owl'].map(v => <option key={v} className="bg-card-dark">{v}</option>)}
              </select>
            </div>
            <div className="space-y-3">
              <label className="text-xs font-bold text-text-secondary uppercase">Food Preference</label>
              <select name="foodPreference" value={formData.foodPreference} onChange={handleChange} className="w-full bg-white/5 border border-white/5 rounded-xl p-3 text-sm focus:border-accent-cyan outline-none">
                {['Any', 'Veg', 'Non-Veg'].map(v => <option key={v} className="bg-card-dark">{v}</option>)}
              </select>
            </div>
          </div>
        </div>

        {/* Description & Amenities */}
        <div className="space-y-8 pt-6 border-t border-white/5">
          <div className="space-y-4">
            <label className="text-sm font-bold text-text-secondary flex items-center gap-2 uppercase tracking-widest"><Tag className="w-4 h-4" /> Amenities (comma separated)</label>
            <input
              name="amenities" value={formData.amenities} onChange={handleChange}
              placeholder="e.g. WiFi, AC, Parking, Gym"
              className="w-full bg-white/5 border border-white/5 rounded-2xl p-4 text-text-primary focus:border-accent-cyan outline-none transition-all font-mono text-sm"
            />
          </div>

          <div className="space-y-4">
            <label className="text-sm font-bold text-text-secondary flex items-center gap-2 uppercase tracking-widest"><FileText className="w-4 h-4" /> Description</label>
            <textarea
              name="description" required rows="4" value={formData.description} onChange={handleChange}
              placeholder="Describe your flat, roommates, and what you are looking for..."
              className="w-full bg-white/5 border border-white/5 rounded-2xl p-4 text-text-primary focus:border-accent-cyan outline-none transition-all resize-none"
            />
          </div>
        </div>

        {error && <p className="text-red-400 font-bold bg-red-400/10 p-4 rounded-xl border border-red-400/20">{error}</p>}

        <button
          disabled={loading}
          type="submit"
          className="w-full py-5 rounded-2xl font-extrabold text-lg transition-all flex justify-center items-center gap-3 text-white border border-white/12 bg-accent-cyan/18 hover:bg-accent-cyan/24 backdrop-blur-2xl shadow-lg shadow-black/20 disabled:bg-gray-700/40 disabled:border-white/5 disabled:text-white/60"
        >
          {loading ? 'Posting...' : <><PlusCircle className="w-6 h-6" /> Publish Listing</>}
        </button>
      </motion.form>
    </div>
  );
};

export default PostListing;
