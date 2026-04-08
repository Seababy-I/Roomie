import React from 'react';
import { MapPin, User, IndianRupee } from 'lucide-react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import BorderGlow from './BorderGlow';

const fallbackImages = [
  'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?q=80&w=1600&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1484154218962-a197022b5858?q=80&w=1600&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?q=80&w=1600&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1494526585095-c41746248156?q=80&w=1600&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?q=80&w=1600&auto=format&fit=crop&sat=-10',
  'https://images.unsplash.com/photo-1460317442991-0ec209397118?q=80&w=1600&auto=format&fit=crop',
];

const ListingCard = ({ listing }) => {
  const fallbackSeed = `${listing._id || ''}-${listing.title || ''}-${listing.location || ''}`;
  const fallbackIndex = Array.from(fallbackSeed).reduce(
    (sum, char) => sum + char.charCodeAt(0),
    0
  ) % fallbackImages.length;
  const displayImage = listing.images?.[0] || fallbackImages[fallbackIndex];

  return (
    <Link to={`/listing/${listing._id}`}>
      <motion.div 
        whileHover={{ y: -10, scale: 1.02 }}
        transition={{ type: "spring", stiffness: 400, damping: 10 }}
        className="group relative" // Remove redundant background/border as BorderGlow handles it
      >
        <BorderGlow
          edgeSensitivity={20}
          glowColor="268 100 76" // Indigo/Violet bloom
          backgroundColor="#13131A"
          borderRadius={40} // 2.5rem
          glowRadius={60}
          glowIntensity={1.2}
          coneSpread={30}
          animated={false} // Enable only on hover via custom logic if desired, but default true for 'alive' feel
          colors={['#6366F1', '#A78BFA', '#3B82F6']} // Indigo, Violet, Blue
          className="w-full"
        >
          {/* Active Card Content */}
          <div className="relative overflow-hidden w-full rounded-[2.5rem]">
            <div className="relative h-64 w-full overflow-hidden rounded-t-[2.5rem]">
              <img 
                src={displayImage} 
                alt={listing.title} 
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                loading="lazy"
              />
              <div className="absolute top-6 left-6 bg-bg-dark/80 backdrop-blur-md text-text-primary px-4 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest border border-white/10 shadow-xl">
                {listing.flatType}
              </div>
            </div>
            
            <div className="p-8 space-y-6">
              <div className="space-y-1">
                <h3
                  className="text-[1.7rem] font-bold tracking-normal leading-[1.15] group-hover:text-accent-cyan transition-colors line-clamp-1"
                  style={{ fontFamily: "'DM Sans', system-ui, sans-serif" }}
                >
                  {listing.title}
                </h3>
                <div className="flex items-center gap-2 text-text-secondary text-sm">
                    <MapPin className="w-4 h-4 text-accent-cyan/60" /> <span>{listing.location}</span>
                </div>
                <div className="flex items-center gap-2 text-text-secondary text-sm">
                    <User className="w-4 h-4 text-accent-cyan/60" /> <span>Posted by <span className="text-white font-medium">{listing.userId?.name || 'User'}</span></span>
                </div>
              </div>
              
              <div className="flex items-center justify-between pt-6 border-t border-white/5">
                <div className="flex items-center gap-2 text-accent-cyan">
                  <IndianRupee className="w-5 h-5" />
                  <span className="text-2xl font-black tracking-tighter">
                    {listing.rent?.toLocaleString() || '0'}
                    <span className="text-xs font-normal text-text-secondary ml-1 lowercase">/ month</span>
                  </span>
                </div>

                <div className="flex items-center gap-1.5 px-3 py-1.5 bg-white/5 rounded-lg border border-white/5">
                   <User className="w-3.5 h-3.5 text-text-secondary" />
                   <span className="text-[10px] font-bold text-text-secondary uppercase">{listing.genderPreference}</span>
                </div>
              </div>
            </div>
          </div>
        </BorderGlow>
      </motion.div>
    </Link>
  );
};

export default ListingCard;
