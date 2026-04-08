import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { MapPin, User, IndianRupee, Bed, Calendar, CheckCircle, XCircle, Info, Phone, Mail, Award, Clock, ArrowLeft } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';

const ListingDetail = () => {
  const { id } = useParams();
  const [listing, setListing] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [interests, setInterests] = useState([]);
  const [userStatus, setUserStatus] = useState(null); // 'pending', 'accepted', 'rejected' or null
  const [isOwner, setIsOwner] = useState(false);

  // Mock currentUser info for now
  const currentUser = JSON.parse(localStorage.getItem('userInfo')) || { _id: 'mock-user-id' };

  useEffect(() => {
    fetchListing();
  }, [id]);

  const fetchListing = async () => {
    try {
      const apiBase = 'https://roomie-m9ps.onrender.com/api';
      const { data } = await axios.get(`${apiBase}/listings/${id}`);
      setListing(data);

      const ownerId = data.userId._id || data.userId;
      const ownerCheck = ownerId === currentUser._id;
      setIsOwner(ownerCheck);

      if (ownerCheck) {
        fetchInterests();
      } else {
        // Check if user already applied (if logged in)
        const userInterest = data.interestedUsers?.find(u => u._id === currentUser._id || u === currentUser._id);
        // We'll need another backend call for status if we don't include it in listing
        // For simplicity, let's assume we fetch all interests for context or check status from separate API
      }
      setLoading(false);
    } catch (err) {
      setError('Failed to load listing.');
      setLoading(false);
    }
  };

  const fetchInterests = async () => {
    try {
      const apiBase = 'https://roomie-m9ps.onrender.com/api';
      const token = localStorage.getItem('token');
      const { data } = await axios.get(`${apiBase}/interests/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setInterests(data);
    } catch (err) {
      console.error('Error fetching interests');
    }
  };

  const handleStatusUpdate = async (interestId, newStatus) => {
    try {
      const apiBase = 'https://roomie-m9ps.onrender.com/api';
      const token = localStorage.getItem('token');
      await axios.patch(`${apiBase}/interests/${interestId}`,
        { status: newStatus },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      fetchInterests();
    } catch (err) {
      alert('Failed to update status');
    }
  };

  const expressInterest = async () => {
    try {
      const apiBase = 'https://roomie-m9ps.onrender.com/api';
      const token = localStorage.getItem('token');
      await axios.post(`${apiBase}/interests/${id}`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      alert('Interest expressed!');
      fetchListing();
    } catch (err) {
      alert(err.response?.data?.message || 'Login to express interest');
    }
  };

  const handleWhatsAppClick = () => {
    if (!listing?.userId?.phone) {
      alert("Owner's contact information is not available.");
      return;
    }

    // Phone number validation and formatting
    let phoneNum = listing.userId.phone.replace(/\D/g, '');
    
    // Basic validation: Check if it's a valid length (e.g., 10 for India without prefix, or 12 with prefix)
    if (phoneNum.length < 10) {
      alert("Invalid phone number format on this listing.");
      return;
    }

    // Add India country code if not present
    if (phoneNum.length === 10) {
      phoneNum = '91' + phoneNum;
    }

    const message = `Hi, I am interested in your room listing: "${listing.title}". Can you share more details?`;
    const encodedMessage = encodeURIComponent(message);
    const whatsappUrl = `https://wa.me/${phoneNum}?text=${encodedMessage}`;

    window.open(whatsappUrl, '_blank');
  };

  if (loading) return <div className="py-20 text-center text-text-secondary animate-pulse">Loading listing details...</div>;
  if (!listing) return <div className="py-20 text-center text-red-400">Listing not found</div>;

  return (
    <div className="max-w-6xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <Link to="/" className="inline-flex items-center gap-2 text-text-secondary hover:text-accent-cyan transition-colors mb-4">
        <ArrowLeft className="w-5 h-5" /> Back to Browse
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

        {/* Main Content Area */}
        <div className="lg:col-span-2 space-y-8">
          <div className="bg-card-dark rounded-3xl overflow-hidden border border-white/5 shadow-2xl">
            <div className="h-[400px] w-full">
              <img
                src={listing.images?.[0] || 'https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?q=80&w=2671&auto=format&fit=crop'}
                alt={listing.title}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="p-8 space-y-6">
              <div className="flex justify-between items-start">
                <h1 className="text-4xl font-extrabold tracking-tight">{listing.title}</h1>
                <span className="bg-accent-cyan/20 text-accent-cyan px-4 py-1.5 rounded-full text-sm font-bold uppercase tracking-wider">
                  {listing.flatType}
                </span>
              </div>

              <div className="flex flex-wrap gap-6 text-text-secondary">
                <div className="flex items-center gap-2"><MapPin className="w-5 h-5 text-accent-cyan" /> {listing.location}</div>
                <div className="flex items-center gap-2"><IndianRupee className="w-5 h-5 text-accent-cyan" /> ₹{listing.rent?.toLocaleString()} / mo</div>
                <div className="flex items-center gap-2"><User className="w-5 h-5 text-accent-cyan" /> {listing.genderPreference} preferred</div>
                <div className="flex items-center gap-2"><Calendar className="w-5 h-5 text-accent-cyan" /> Move in: {new Date(listing.moveInDate).toLocaleDateString()}</div>
              </div>

              <div className="flex items-center gap-3 pt-6 border-t border-white/5">
                <div className="w-10 h-10 bg-accent-cyan/20 rounded-full flex items-center justify-center border border-accent-cyan/30">
                   <User className="w-5 h-5 text-accent-cyan" />
                </div>
                <div>
                   <p className="text-[10px] uppercase font-bold text-text-secondary tracking-widest">Posted By</p>
                   <p className="font-bold text-lg leading-none">{listing.userId?.name || 'Verified User'}</p>
                </div>
              </div>

              <div className="pt-8 border-t border-white/5">
                <h3 className="text-2xl font-bold mb-4">Description</h3>
                <p className="text-text-secondary leading-relaxed whitespace-pre-line">{listing.description}</p>
              </div>

              <div className="pt-8 border-t border-white/5">
                <h3 className="text-2xl font-bold mb-4">Amenities</h3>
                <div className="flex flex-wrap gap-3">
                  {listing.amenities?.map((a, i) => (
                    <span key={i} className="bg-white/5 px-4 py-2 rounded-xl text-sm font-medium border border-white/5">{a}</span>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Compatibility Details */}
          <div className="bg-card-dark rounded-3xl p-8 border border-white/5 shadow-lg">
            <h3 className="text-2xl font-bold mb-6">Compatibility Profile</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="flex items-center gap-4 bg-white/5 p-4 rounded-2xl">
                <div className="p-3 bg-accent-cyan/10 rounded-xl"><CheckCircle className="text-accent-cyan w-6 h-6" /></div>
                <div>
                  <p className="text-[10px] uppercase font-bold text-text-secondary">Cleanliness</p>
                  <p className="font-bold">{listing.compatibilityTags?.cleanliness || 'Medium'}</p>
                </div>
              </div>
              <div className="flex items-center gap-4 bg-white/5 p-4 rounded-2xl">
                <div className="p-3 bg-accent-cyan/10 rounded-xl"><Clock className="text-accent-cyan w-6 h-6" /></div>
                <div>
                  <p className="text-[10px] uppercase font-bold text-text-secondary">Sleep Schedule</p>
                  <p className="font-bold">{listing.compatibilityTags?.sleepSchedule || 'Flexible'}</p>
                </div>
              </div>
              <div className="flex items-center gap-4 bg-white/5 p-4 rounded-2xl">
                <div className="p-3 bg-accent-cyan/10 rounded-xl"><Award className="text-accent-cyan w-6 h-6" /></div>
                <div>
                  <p className="text-[10px] uppercase font-bold text-text-secondary">Food Preference</p>
                  <p className="font-bold">{listing.compatibilityTags?.foodPreference || 'Any'}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Sidebar Interactions */}
        <div className="space-y-8">
          <div className="bg-card-dark rounded-3xl p-8 border border-white/5 shadow-xl sticky top-24">
            {isOwner ? (
              <div>
                <h3 className="text-xl font-bold mb-6 flex items-center gap-2"><User className="text-accent-cyan" /> Interest Requests ({interests.length})</h3>
                <div className="space-y-4 max-h-[500px] overflow-y-auto pr-2 custom-scrollbar">
                  <AnimatePresence>
                    {interests.length === 0 ? <p className="text-text-secondary text-sm italic">No requests yet.</p> :
                      interests.map(i => (
                        <motion.div
                          key={i._id}
                          layout
                          className="p-4 bg-white/5 rounded-2xl space-y-3 border border-white/5"
                        >
                          <div className="flex justify-between items-start">
                            <div>
                               <p className="font-bold">{i.userId?.name || 'Anonymous'}</p>
                               <p className="text-xs text-text-secondary">{i.userId?.email || ''}</p>
                            </div>
                            <span className={`text-[10px] px-2 py-0.5 font-bold uppercase rounded-md ${i.status === 'accepted' ? 'bg-green-500/20 text-green-400' : i.status === 'rejected' ? 'bg-red-500/20 text-red-400' : 'bg-yellow-500/20 text-yellow-400'}`}>
                              {i.status}
                            </span>
                          </div>

                          {i.status === 'accepted' && (
                            <div className="bg-green-500/10 p-3 rounded-lg text-xs text-green-400 font-mono border border-green-500/20">
                              Contact: {i.userId?.phone || '999-XXX-XXXX'}
                            </div>
                          )}

                          {i.status === 'pending' && (
                            <div className="flex gap-2 pt-2">
                              <button
                                onClick={() => handleStatusUpdate(i._id, 'accepted')}
                                className="flex-1 bg-green-500/20 hover:bg-green-500/40 text-green-400 py-2 rounded-xl text-xs font-bold transition-all"
                              >
                                Accept
                              </button>
                              <button
                                onClick={() => handleStatusUpdate(i._id, 'rejected')}
                                className="flex-1 bg-red-500/20 hover:bg-red-500/40 text-red-400 py-2 rounded-xl text-xs font-bold transition-all"
                              >
                                Reject
                              </button>
                            </div>
                          )}
                        </motion.div>
                      ))}
                  </AnimatePresence>
                </div>
              </div>
            ) : (
              <div className="space-y-6">
                <div className="p-6 bg-accent-cyan/10 rounded-2xl border border-accent-cyan/20">
                  <h3 className="text-lg font-bold mb-4">Interested in this room?</h3>
                  <p className="text-sm text-text-secondary mb-6 leading-relaxed">
                    Contact the owner directly on WhatsApp to discuss further details.
                  </p>

                  <div className="space-y-3">
                    <button
                      onClick={handleWhatsAppClick}
                      className="w-full bg-green-600 hover:bg-green-700 text-white py-4 rounded-2xl font-extrabold transition-all shadow-xl shadow-green-600/20 flex items-center justify-center gap-3"
                    >
                      <Phone className="w-5 h-5" /> I'm Interested
                    </button>
                    
                    <button
                      onClick={expressInterest}
                      className="w-full bg-accent-cyan/20 hover:bg-accent-cyan/30 text-accent-cyan py-3 rounded-2xl font-bold transition-all flex items-center justify-center gap-2 border border-accent-cyan/30"
                    >
                      <CheckCircle className="w-4 h-4" /> Save Interest
                    </button>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-4 bg-white/5 rounded-2xl text-xs text-text-secondary leading-relaxed">
                  <Info className="w-5 h-5 text-accent-cyan shrink-0" />
                  <p>WhatsApp will open in a new tab with a pre-filled message for the owner.</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>

  );
};

export default ListingDetail;
