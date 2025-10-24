import React, { useEffect, useState } from 'react';
import { Calendar, Users, Clock, Phone, ArrowLeft } from 'lucide-react';
import Eventvenue from '@/assets/EventImage.jpg';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from './ui/button';
import { motion, Variants } from 'framer-motion';

type Props = {
  onBack?: () => void;
};

// Animation variants
const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      duration: 0.6,
      staggerChildren: 0.1
    }
  }
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: "easeOut"
    }
  }
};

const slideInLeft: Variants = {
  hidden: { opacity: 0, x: -50 },
  visible: {
    opacity: 1,
    x: 0,
    transition: {
      duration: 0.7,
      ease: "easeOut"
    }
  }
};

const slideInRight: Variants = {
  hidden: { opacity: 0, x: 50 },
  visible: {
    opacity: 1,
    x: 0,
    transition: {
      duration: 0.7,
      ease: "easeOut"
    }
  }
};

const scaleIn: Variants = {
  hidden: { opacity: 0, scale: 0.9 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: {
      duration: 0.5,
      ease: "easeOut"
    }
  }
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2
    }
  }
};

// Fallback pricing data used when backend fetch fails or returns empty
const pricingData: Array<{ day: string; time: string; price: string }> = [
  { day: 'Weekdays', time: '10:00 AM – 6:00 PM', price: '₹2,000' },
  { day: 'Weekends', time: '10:00 AM – 10:00 PM', price: '₹3,000' },
  { day: 'Evenings', time: '6:00 PM – 10:00 PM', price: '₹2,500' }
];

const EventVenue = ({ onBack }: Props) => {
  const navigate = useNavigate();

  // Reset scroll position when component mounts
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  
  const [livePricing, setLivePricing] = useState<Array<{ day: string; time: string; price: string }>>([]);

  // Load pricing from backend on mount. The admin API returns a map of { key: { label, price } }
  useEffect(() => {
    let cancelled = false;
    const fetchPricing = async () => {
      try {
        // Allow overriding backend URL via Vite env, otherwise default to localhost:5000
        // Note: using full origin avoids CORS issues when frontend runs on a different port
        const API_BASE = (import.meta.env && import.meta.env.VITE_API_BASE) ? import.meta.env.VITE_API_BASE : 'http://localhost:5000';
        const res = await fetch(`${API_BASE}/api/admin/event-pricing`);
        if (!res.ok) throw new Error(`Status ${res.status}`);
        const json = await res.json();
        const data = json?.data || {};
        const items: Array<{ day: string; time: string; price: string }> = [];
        Object.keys(data).forEach((k) => {
          const it = data[k] || {};
          const label = String(it.label || '');
          const price = it.price ? String(it.price) : '';
          // Attempt to split label into day + time part
          // Expect formats like: "Weekdays 10:00 AM – 3:00 PM"
          const m = label.match(/^([^\d]+)\s+(.+)$/);
          if (m) {
            const day = m[1].trim();
            const time = m[2].trim();
            items.push({ day, time, price: price ? `₹${price}` : '—' });
          } else if (label) {
            items.push({ day: label, time: '', price: price ? `₹${price}` : '—' });
          }
        });
        if (!cancelled && items.length > 0) setLivePricing(items);
      } catch (err) {
        console.debug('Failed to fetch live pricing, using fallback', err);
      }
    };
    fetchPricing();
    return () => { cancelled = true; };
  }, []);
 
  const highlights = [
    "1400 sq. ft. air-conditioned hall",
    "Attached pantry for food service",
    "3 well-maintained toilets",
    "Tables and chairs included",
    "Beautiful cherry blossom tree centerpiece"
  ];
 
  const idealFor = [
    "Corporate Events",
    "Birthday Parties",
    "Baby Showers",
    "Proposals",
    "Team Building",
    "Workshops"
  ];

  const handleBackToHome = () => {
    if (onBack) {
      onBack();
      setTimeout(() => window.scrollTo(0, 0), 100);
      return;
    }
    navigate("/", { replace: true });
  };

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      className="min-h-screen bg-gray-50 py-12 px-4"
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Back Button */}
        <motion.button
          variants={itemVariants}
          onClick={handleBackToHome}
          className="mb-6 inline-flex items-center gap-2 text-pink-600 hover:text-pink-700 hover:bg-pink-100 px-4 py-2 rounded-lg transition-colors"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Home
        </motion.button>
        
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <motion.div
            variants={itemVariants}
            className="text-center mb-12"
          >
            <motion.h1 
              className="text-5xl font-bold bg-gradient-to-r from-pink-600 to-rose-600 bg-clip-text text-transparent mb-4"
              initial={{ opacity: 0, y: -30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
            >
              Event Venue
            </motion.h1>
            <motion.p 
              className="text-lg text-gray-600"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.3 }}
            >
              A beautiful space for your special occasions
            </motion.p>
          </motion.div>
 
          {/* Main Image and Description */}
          <motion.div
            variants={staggerContainer}
            className="p-8 mb-12"
          >
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
              <motion.div variants={slideInLeft}>
                <motion.img
                  src={Eventvenue}
                  alt="Event Venue"
                  className="w-full rounded-lg shadow-lg"
                  whileHover={{ scale: 1.02 }}
                  transition={{ duration: 0.3 }}
                />
              </motion.div>
              
              <motion.div variants={slideInRight}>
                <motion.h2 
                  className="text-2xl font-bold text-gray-800 mb-4"
                  variants={itemVariants}
                >
                  Perfect Space for Every Celebration
                </motion.h2>
                <motion.p 
                  className="text-gray-600 mb-6 leading-relaxed"
                  variants={itemVariants}
                >
                  Our 1400 sq. ft. event hall features a stunning cherry blossom tree
                  centerpiece and provides the perfect setting for your special events.
                  From corporate meetings to birthday celebrations, our venue offers
                  elegance and functionality in one beautiful space.
                </motion.p>
                <motion.div variants={itemVariants}>
                  <Link
                    to="/contact"
                    className="mx-[150px] inline-flex items-center bg-pink-500 text-white px-6 py-3 rounded-lg hover:bg-pink-600 transition-colors shadow-md"
                  >
                    <Phone className="w-4 h-4 mr-2" />
                    Book Now
                  </Link>
                </motion.div>
              </motion.div>
            </div>
          </motion.div>
 
          {/* Quick Info */}
          <motion.div
            variants={staggerContainer}
            className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12"
          >
            <motion.div 
              variants={scaleIn}
              className="bg-white rounded-lg p-6 text-center shadow-md"
              whileHover={{ 
                scale: 1.05,
                boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)"
              }}
            >
              <Users className="w-8 h-8 text-pink-500 mx-auto mb-3" />
              <h3 className="font-semibold text-gray-800">1400 sq. ft.</h3>
              <p className="text-gray-600 text-sm">Spacious Hall</p>
            </motion.div>
            
            <motion.div 
              variants={scaleIn}
              className="bg-white rounded-lg p-6 text-center shadow-md"
              whileHover={{ 
                scale: 1.05,
                boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)"
              }}
              transition={{ delay: 0.1 }}
            >
              <Calendar className="w-8 h-8 text-pink-500 mx-auto mb-3" />
              <h3 className="font-semibold text-gray-800">All Events</h3>
              <p className="text-gray-600 text-sm">Any Occasion</p>
            </motion.div>
            
            <motion.div 
              variants={scaleIn}
              className="bg-white rounded-lg p-6 text-center shadow-md"
              whileHover={{ 
                scale: 1.05,
                boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)"
              }}
              transition={{ delay: 0.2 }}
            >
              <Clock className="w-8 h-8 text-pink-500 mx-auto mb-3" />
              <h3 className="font-semibold text-gray-800">Flexible</h3>
              <p className="text-gray-600 text-sm">Timing Options</p>
            </motion.div>
          </motion.div>
 
          {/* Features and Pricing */}
          <motion.div
            variants={staggerContainer}
            className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12"
          >
            {/* Venue Features */}
            <motion.div 
              variants={slideInLeft}
              className="bg-white rounded-lg shadow-md p-6"
              whileHover={{ boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)" }}
            >
              <motion.h3 
                className="text-xl font-bold text-gray-800 mb-6"
                variants={itemVariants}
              >
                What's Included
              </motion.h3>
              <motion.ul 
                className="space-y-3"
                variants={staggerContainer}
              >
                {highlights.map((highlight, index) => (
                  <motion.li 
                    key={index} 
                    className="flex items-center"
                    variants={itemVariants}
                    whileHover={{ x: 10 }}
                    transition={{ type: "spring", stiffness: 300 }}
                  >
                    <div className="w-2 h-2 bg-pink-500 rounded-full mr-3" />
                    <span className="text-gray-700">{highlight}</span>
                  </motion.li>
                ))}
              </motion.ul>
             
              <motion.h3 
                className="text-xl font-bold text-gray-800 mt-8 mb-4"
                variants={itemVariants}
              >
                Perfect For
              </motion.h3>
              <motion.div 
                className="grid grid-cols-2 gap-2"
                variants={staggerContainer}
              >
                {idealFor.map((item, index) => (
                  <motion.span 
                    key={index} 
                    className="text-sm text-gray-600 bg-gray-100 px-3 py-1 rounded text-center"
                    variants={itemVariants}
                    whileHover={{ 
                      scale: 1.05,
                      backgroundColor: "rgb(253, 242, 248)"
                    }}
                  >
                    {item}
                  </motion.span>
                ))}
              </motion.div>
            </motion.div>
 
            {/* Pricing */}
            <motion.div 
              variants={slideInRight}
              className="bg-white rounded-lg shadow-md p-6"
              whileHover={{ boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)" }}
            >
              <motion.h3 
                className="text-xl font-bold text-gray-800 mb-6"
                variants={itemVariants}
              >
                Pricing
              </motion.h3>
              <motion.div 
                className="space-y-4"
                variants={staggerContainer}
              >
                {(livePricing.length ? livePricing : pricingData).map((item, index) => (
                  <motion.div 
                    key={index} 
                    className="flex justify-between items-center p-4 bg-gray-50 rounded-lg"
                    variants={itemVariants}
                    whileHover={{ 
                      scale: 1.02,
                      backgroundColor: "rgb(255, 255, 255)",
                      boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)"
                    }}
                  >
                    <div>
                      <div className="font-semibold text-gray-800">{item.day}</div>
                      <div className="text-sm text-gray-600">{item.time}</div>
                    </div>
                    <div className="text-xl font-bold text-pink-600">
                      {item.price}
                    </div>
                  </motion.div>
                ))}
              </motion.div>
             
              <motion.div 
                className="mt-6 p-4 bg-pink-50 rounded-lg"
                variants={itemVariants}
                whileHover={{ scale: 1.02 }}
              >
                <p className="text-sm text-gray-700">
                  <strong>Note:</strong> Decorations, flowers, and catering are available at additional cost.
                </p>
              </motion.div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
};
 
export default EventVenue;