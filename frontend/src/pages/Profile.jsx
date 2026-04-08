import React, { useState, useEffect } from 'react';
import { User, Mail, Phone, Calendar, Grid, Heart, LogOut, Trash2, ExternalLink, ShieldCheck } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

const Profile = () => {
  const [activeTab, setActiveTab] = useState('listings');
  const [user, setUser] = useState(null);
  const [myListings, setMyListings] = useState([]);
  const [myInterests, setMyInterests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isEditingPhone, setIsEditingPhone] = useState(false);
  const [newPhone, setNewPhone] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        navigate('/');
        return;
      }

      const config = { headers: { Authorization: `Bearer ${token}` } };
      const apiBase = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

      // Parallel fetching
      const [resUser, resInterests] = await Promise.all([
        axios.get(`${apiBase}/auth/me`, config),
        axios.get(`${apiBase}/interests/mine`, config)
      ]);

      setUser(resUser.data);
      setMyInterests(resInterests.data);

      // Fetch my listings using public list filtered by my user ID
      const resListings = await axios.get(`${apiBase}/listings?limit=100`, config);
      // Filter locally for now or we could add my listings endpoint
      const filtered = resListings.data.listings.filter(l => l.userId._id === resUser.data._id);
      setMyListings(filtered);

      setLoading(false);
    } catch (err) {
      console.error(err);
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userInfo');
    navigate('/');
  };

  const handleUpdatePhone = async () => {
    if (!newPhone.trim()) return;
    try {
      const token = localStorage.getItem('token');
      const apiBase = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
      const { data } = await axios.put(`${apiBase}/auth/me`, { phone: newPhone }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setUser(data);
      setIsEditingPhone(false);
    } catch (err) {
      alert('Failed to update phone number');
    }
  };

  const handleDeleteListing = async (id) => {
    if (!window.confirm('Delete this listing permanently?')) return;
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`${import.meta.env.VITE_API_URL || 'http://localhost:5000/api'}/listings/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setMyListings(myListings.filter(l => l._id !== id));
    } catch (err) {
      alert('Delete failed');
    }
  };

  if (loading) return <div className="py-20 text-center text-text-secondary animate-pulse">Loading profile...</div>;

  return (
    <div className="max-w-6xl mx-auto pt-32 pb-8 px-6 space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-700">

      {/* User Info Header */}
      <section className="bg-card-dark rounded-3xl p-10 border border-white/5 flex flex-col md:flex-row justify-between items-center gap-10 shadow-xl relative overflow-hidden">
        <div className="absolute top-0 left-0 w-32 h-32 bg-accent-cyan/10 blur-[100px] rounded-full" />

        <div className="flex flex-col md:flex-row items-center gap-8 relative">
          <div className="w-32 h-32 bg-accent-cyan/20 rounded-full flex items-center justify-center border-4 border-accent-cyan/30 shadow-2xl relative group">
            <User className="w-16 h-16 text-accent-cyan" />
            <div className="absolute -bottom-2 -right-2 bg-green-500 p-1.5 rounded-full border-4 border-card-dark shadow-lg">
              <ShieldCheck className="w-4 h-4 text-white" />
            </div>
          </div>

          <div className="text-center md:text-left space-y-2">
            <h1 className="text-4xl font-extrabold tracking-tight">{user?.name}</h1>
            <div className="flex flex-col gap-1">
              <div className="flex items-center justify-center md:justify-start gap-2 text-text-secondary">
                <Mail className="w-4 h-4" /> <span>{user?.email}</span>
              </div>
              <div className="flex items-center justify-center md:justify-start gap-2 text-text-secondary w-full">
                <Phone className="w-4 h-4" /> 
                {isEditingPhone ? (
                  <div className="flex items-center gap-2">
                    <input 
                      type="text" 
                      value={newPhone} 
                      onChange={e => setNewPhone(e.target.value)}
                      placeholder="Enter phone number"
                      className="bg-bg-dark border border-white/10 rounded-lg px-3 py-1 text-sm text-text-primary focus:outline-none focus:border-accent-cyan"
                    />
                    <button onClick={handleUpdatePhone} className="text-xs font-bold text-accent-cyan hover:underline">Save</button>
                    <button onClick={() => setIsEditingPhone(false)} className="text-xs font-bold text-text-secondary hover:underline">Cancel</button>
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <span>{user?.phone || 'Add phone number in settings'}</span>
                    <button 
                      onClick={() => { setIsEditingPhone(true); setNewPhone(user?.phone || ''); }}
                      className="text-[10px] uppercase font-bold tracking-wider text-accent-cyan ml-2 hover:underline"
                    >
                      {user?.phone ? 'Edit' : 'Add'}
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        <button
          onClick={handleLogout}
          className="bg-white/5 hover:bg-red-500/10 text-text-secondary hover:text-red-400 border border-white/5 hover:border-red-500/20 px-8 py-3 rounded-2xl font-bold transition-all flex items-center gap-2 group"
        >
          <LogOut className="w-5 h-5 group-hover:-translate-x-1 transition-transform" /> Sign Out
        </button>
      </section>

      {/* Tabs Navigation */}
      <section className="space-y-8">
        <div className="flex gap-4 border-b border-white/5">
          <button
            onClick={() => setActiveTab('listings')}
            className={`px-6 pb-4 text-lg font-bold transition-all relative ${activeTab === 'listings' ? 'text-accent-cyan' : 'text-text-secondary hover:text-text-primary'}`}
          >
            My Listings ({myListings.length})
            {activeTab === 'listings' && <motion.div layoutId="tab" className="absolute bottom-0 left-0 right-0 h-1 bg-accent-cyan rounded-t-full" />}
          </button>
          <button
            onClick={() => setActiveTab('interests')}
            className={`px-6 pb-4 text-lg font-bold transition-all relative ${activeTab === 'interests' ? 'text-accent-cyan' : 'text-text-secondary hover:text-text-primary'}`}
          >
            Interests Sent ({myInterests.length})
            {activeTab === 'interests' && <motion.div layoutId="tab" className="absolute bottom-0 left-0 right-0 h-1 bg-accent-cyan rounded-t-full" />}
          </button>
        </div>

        {/* Tab Content */}
        <div>
          <AnimatePresence mode="wait">
            {activeTab === 'listings' ? (
              <motion.div
                key="listings"
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 10 }}
                className="grid grid-cols-1 md:grid-cols-2 gap-6"
              >
                {myListings.length === 0 ? (
                  <div className="col-span-full py-20 text-center bg-white/5 rounded-3xl border border-dashed border-white/10">
                    <p className="text-text-secondary mb-4">You haven't posted any listings yet.</p>
                    <Link to="/post" className="text-accent-cyan font-bold hover:underline">Click here to post one</Link>
                  </div>
                ) : myListings.map(listing => (
                  <div key={listing._id} className="bg-card-dark rounded-2xl p-6 border border-white/5 flex gap-6 group hover:border-white/10 transition-all">
                    <img src={listing.images[0] || 'https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?q=80&w=2671&auto=format&fit=crop'} className="w-24 h-24 rounded-xl object-cover" />
                    <div className="flex-1 flex flex-col justify-between">
                      <div>
                        <h4 className="font-bold text-lg leading-tight mb-1">{listing.title}</h4>
                        <p className="text-xs text-text-secondary">{listing.location}</p>
                      </div>
                      <div className="flex justify-between items-center mt-4">
                        <p className="text-accent-cyan font-black text-sm">₹{listing.rent.toLocaleString()}</p>
                        <div className="flex gap-2">
                          <Link to={`/listing/${listing._id}`} className="p-2 bg-white/5 rounded-lg hover:bg-accent-cyan/20 hover:text-accent-cyan transition-colors" title="View details">
                            <ExternalLink className="w-4 h-4" />
                          </Link>
                          <button
                            onClick={() => handleDeleteListing(listing._id)}
                            className="p-2 bg-white/5 rounded-lg hover:bg-red-500/20 hover:text-red-400 transition-colors" title="Delete listing">
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </motion.div>
            ) : (
              <motion.div
                key="interests"
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                className="space-y-4"
              >
                {myInterests.length === 0 ? (
                  <div className="py-20 text-center bg-white/5 rounded-3xl border border-dashed border-white/10">
                    <p className="text-text-secondary">You haven't shown interest in any listings yet.</p>
                    <Link to="/" className="text-accent-cyan font-bold hover:underline">Explore listings</Link>
                  </div>
                ) : myInterests.map(interest => (
                  <div key={interest._id} className="bg-card-dark rounded-2xl p-6 border border-white/5 flex flex-col md:flex-row justify-between items-center gap-6 group hover:border-white/10 transition-all">
                    <div className="flex items-center gap-6 w-full">
                      <img src={interest.listingId.images[0] || 'https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?q=80&w=2671&auto=format&fit=crop'} className="w-16 h-16 rounded-xl object-cover" />
                      <div className="flex-1">
                        <Link to={`/listing/${interest.listingId._id}`} className="font-bold text-lg hover:text-accent-cyan transition-colors">{interest.listingId.title}</Link>
                        <p className="text-sm text-text-secondary">Owner: {interest.listingId.userId.name}</p>
                      </div>
                    </div>

                    <div className="flex flex-col md:items-end gap-2 w-full md:w-auto">
                      <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest text-center shadow-sm ${interest.status === 'accepted' ? 'bg-green-500/20 text-green-400 border border-green-500/20' : interest.status === 'rejected' ? 'bg-red-500/20 text-red-400 border border-red-500/20' : 'bg-yellow-500/10 text-yellow-500 border border-yellow-500/10'}`}>
                        {interest.status}
                      </span>
                      {interest.status === 'accepted' && (
                        <div className="flex items-center gap-2 text-xs font-mono text-green-400 bg-green-400/5 px-3 py-2 rounded-lg border border-green-400/10">
                          <Phone className="w-3.5 h-3.5" /> {interest.listingId.userId.phone || '999-XXX-XXXX'}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </section>
    </div>
  );
};

export default Profile;
