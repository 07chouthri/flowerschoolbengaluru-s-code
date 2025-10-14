import { Button } from "@/components/ui/button";
import { useEffect, useState, useRef } from "react";
import { motion, useInView } from "framer-motion";
import School from "@/assets/School.jpg";
import School1 from "@/assets/School1.jpg";
import School2 from "@/assets/School2.jpg";
import CherryBlossom from "@/assets/cherryblossom.jpg";
import { useNavigate } from "react-router-dom";

// Import the logos
import FlowerSchoolLogo from "@/assets/Flower_School_Logo_1757484169081 copy.png";
import EcommerceBouquetLogo from "@/assets/E_Commerce_Bouquet_Bar_Logo_1757433847861.png";
import EventVenue from "./EventVenue";
import EventImage from "@/assets/EventImage.jpg";

interface HeroProps {
  onNavigate?: (section: string) => void;
}

const Hero = ({ onNavigate }: HeroProps) => {
  const navigate = useNavigate();
  const [currentImage, setCurrentImage] = useState<number>(0);
  const [showCherryBlossom, setShowCherryBlossom] = useState<boolean>(true);
  const [showEventVenue, setShowEventVenue] = useState<boolean>(false);
  const [displayText, setDisplayText] = useState<string>("");
  const images: string[] = [School, School1, School2];
  const sectionRef = useRef<HTMLElement>(null);
  const isInView = useInView(sectionRef, { once: true });
  const fullText: string = "Start Your Floral Journey With Us";

  useEffect(() => {
    let currentIndex = 0;
    const interval = setInterval(() => {
      if (currentIndex <= fullText.length) {
        setDisplayText(fullText.slice(0, currentIndex));
        currentIndex++;
      } else {
        clearInterval(interval);
      }
    }, 80);

    return () => clearInterval(interval);
  }, [fullText]);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImage((prev) => (prev + 1) % images.length);
    }, 4000);
    return () => clearInterval(interval);
  }, [images.length]);

  useEffect(() => {
    const checkBackground = async () => {
      try {
        const img = new Image();
        img.src = CherryBlossom;
        img.onload = () => {
          setShowCherryBlossom(true);
        };
        img.onerror = () => {
          setShowCherryBlossom(false);
        };
      } catch (error) {
        setShowCherryBlossom(false);
      }
    };

    checkBackground();
  }, []);

  const handleEventVenueClick = () => {
    setShowEventVenue(true);
  };

  const handleBackToHome = () => {
    setShowEventVenue(false);
  };

  return (
    <section ref={sectionRef} className="relative min-h-screen flex items-center justify-center overflow-hidden py-4 md:py-20">
      {/* Cherry Blossom Background */}
      {showCherryBlossom && (
        <div className="absolute inset-0">
          <img
            src={CherryBlossom}
            alt="Cherry Blossom Background"
            className="w-full h-full object-cover opacity-20 rounded-[10px]"
          />
        </div>
      )}

      {/* Fallback Background Pattern */}
      {!showCherryBlossom && (
        <div className="absolute inset-0 opacity-15">
          <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-pink-50 to-rose-50"></div>
        </div>
      )}

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="flex flex-col items-center justify-center max-w-7xl mx-auto">

          {/* Hero Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6 }}
            className="mb-12 md:mb-16 px-2 text-center"
          >
            <h1 className="text-1xl sm:text-3xl md:text-4xl lg:text-5xl font-bold leading-tight mb-10">
              <span className="bg-gradient-to-r from-pink-500 via-pink-600 to-pink-700 bg-clip-text text-transparent">
                Welcome to The 
              </span>
              <br />
              <span className="bg-gradient-to-r from-pink-500 via-pink-600 to-pink-700 bg-clip-text text-transparent">
                Flower School Bengaluru
              </span>
            </h1>

            {/* Typing Animation */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={isInView ? { opacity: 1 } : {}}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="text-lg sm:text-xl md:text-2xl font-semibold text-gray-700 mt-6"
            >
              {displayText}
              <span className="animate-pulse ml-1 ">|</span>
            </motion.div>
          </motion.div>

          {/* Mission Statement */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="mb-16 md:mb-20 max-w-3xl mx-4 text-center"
          >
            <div className="">
              <blockquote className="text-lg md:text-xl text-gray-700 font-medium leading-relaxed italic">
                "Cultivating creativity with nature's finest blooms. Our mission is to teach floral design
                with deep respect for both artistry and environment."
              </blockquote>
            </div>
          </motion.div>

          {/* Services Grid */}
          <div className="w-full max-w-7xl space-y-16 md:space-y-20">
            
            {/* Flower School and Bouquet Bar - Equal Size Grid */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.8 }}
              className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-12"
            >
              {/* Flower School Card */}
              <div className="relative h-full">
                <div className="bg-gradient-to-br from-pink-50 to-rose-50 rounded-2xl p-1 shadow-2xl h-full">
                  <div className="bg-white rounded-xl overflow-hidden relative flex flex-col items-center justify-between p-8 h-full">
                    <img
                      src={FlowerSchoolLogo}
                      alt="Flower School Logo"
                      className="w-full h-40 md:h-48 object-contain mb-6"
                    />

                    <div className="text-center flex-1 flex flex-col justify-between w-full">
                      <div>
                        <div className="inline-flex items-center gap-3 mb-4 justify-center">
                          <div className="w-3 h-3 bg-gradient-to-r from-pink-500 to-rose-500 rounded-full"></div>
                          <span className="text-sm font-semibold text-block uppercase tracking-wide">Education</span>
                        </div>

                        <h3 className="text-2xl md:text-3xl font-bold text-pink-600 mb-6">
                          Floral Design Courses
                        </h3>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6">
                          <div className="flex items-center gap-3">
                            <div className="w-6 h-6 bg-pink-100 rounded-lg flex items-center justify-center">
                              <div className="w-2 h-2 bg-pink-500 rounded-full"></div>
                            </div>
                            <span className="text-gray-700 text-sm">Expert Instructors</span>
                          </div>
                          <div className="flex items-center gap-3">
                            <div className="w-6 h-6 bg-pink-100 rounded-lg flex items-center justify-center">
                              <div className="w-2 h-2 bg-pink-500 rounded-full"></div>
                            </div>
                            <span className="text-gray-700 text-sm">Creative Environment</span>
                          </div>
                          <div className="flex items-center gap-3">
                            <div className="w-6 h-6 bg-pink-100 rounded-lg flex items-center justify-center">
                              <div className="w-2 h-2 bg-pink-500 rounded-full"></div>
                            </div>
                            <span className="text-gray-700 text-sm">Certification Programs</span>
                          </div>
                          <div className="flex items-center gap-3">
                            <div className="w-6 h-6 bg-pink-100 rounded-lg flex items-center justify-center">
                              <div className="w-2 h-2 bg-pink-500 rounded-full"></div>
                            </div>
                            <span className="text-gray-700 text-sm">Hands-on Learning</span>
                          </div>
                        </div>
                      </div>

                      <div className="flex justify-center mt-4">
                        <Button
                          size="lg"
                          className="bg-gradient-to-r from-pink-500 to-rose-500 text-white rounded-xl hover:from-pink-600 hover:to-rose-600 shadow-lg transform hover:-translate-y-0.5 transition-all duration-300 px-8 py-3 font-semibold"
                          onClick={() => navigate("/classes")}
                        >
                          Explore Courses
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Exquisite Bouquets Card */}
              <div className="relative h-full">
                <div className="bg-gradient-to-br from-rose-50 to-pink-50 rounded-2xl p-1 shadow-2xl h-full">
                  <div className="bg-white rounded-xl overflow-hidden relative flex flex-col items-center justify-between p-8 h-full">
                    <img
                      src={EcommerceBouquetLogo}
                      alt="Bouquet Bar Logo"
                      className="w-full h-40 md:h-48 object-contain mb-6"
                    />

                    <div className="text-center flex-1 flex flex-col justify-between w-full">
                      <div>
                        <div className="inline-flex items-center gap-3 mb-4 justify-center">
                          <div className="w-3 h-3 bg-gradient-to-r from-rose-500 to-pink-500 rounded-full"></div>
                          <span className="text-sm font-semibold uppercase tracking-wide">Floral Shop</span>
                        </div>

                        <h3 className="text-2xl md:text-3xl font-bold text-rose-600 mb-6">
                          Exquisite Bouquets
                        </h3>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6">
                          <div className="flex items-center gap-3">
                            <div className="w-6 h-6 bg-rose-100 rounded-lg flex items-center justify-center">
                              <div className="w-2 h-2 bg-rose-500 rounded-full"></div>
                            </div>
                            <span className="text-gray-700 text-sm">Custom Arrangements</span>
                          </div>
                          <div className="flex items-center gap-3">
                            <div className="w-6 h-6 bg-rose-100 rounded-lg flex items-center justify-center">
                              <div className="w-2 h-2 bg-rose-500 rounded-full"></div>
                            </div>
                            <span className="text-gray-700 text-sm">Same-day Delivery</span>
                          </div>
                          <div className="flex items-center gap-3">
                            <div className="w-6 h-6 bg-rose-100 rounded-lg flex items-center justify-center">
                              <div className="w-2 h-2 bg-rose-500 rounded-full"></div>
                            </div>
                            <span className="text-gray-700 text-sm">Fresh Flowers Daily</span>
                          </div>
                          <div className="flex items-center gap-3">
                            <div className="w-6 h-6 bg-rose-100 rounded-lg flex items-center justify-center">
                              <div className="w-2 h-2 bg-rose-500 rounded-full"></div>
                            </div>
                            <span className="text-gray-700 text-sm">Premium Quality</span>
                          </div>
                        </div>
                      </div>

                      <div className="flex justify-center mt-4">
                        <Button
                          size="lg"
                          className="bg-gradient-to-r from-rose-500 to-pink-500 text-white rounded-xl hover:from-rose-600 hover:to-pink-600 shadow-lg transform hover:-translate-y-0.5 transition-all duration-300 px-8 py-3 font-semibold"
                          onClick={() => window.open("https://app.flowerschoolbengaluru.com/shop", "_blank")}
                        >
                          Shop Bouquets
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Event Venue Section - Below */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 1.2 }}
              className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-12 items-center"
            >
              {/* Content */}
              <div className="space-y-6">
                <div className="inline-flex items-center gap-3 mb-4">
                  <div className="w-3 h-3 bg-gradient-to-r from-rose-500 to-pink-500 rounded-full"></div>
                  <span className="text-sm font-semibold text-block uppercase tracking-wide">Venue Rental</span>
                </div>
                
                <h3 className="text-3xl md:text-4xl font-bold text-rose-600">
                  Event Venue
                </h3>
             
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 py-4">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-rose-100 rounded-lg flex items-center justify-center">
                      <div className="w-2 h-2 bg-rose-500 rounded-full"></div>
                    </div>
                    <span className="text-gray-700 font-medium">1400 sq. ft. Space</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-rose-100 rounded-lg flex items-center justify-center">
                      <div className="w-2 h-2 bg-rose-500 rounded-full"></div>
                    </div>
                    <span className="text-gray-700 font-medium">Beautiful Ambiance</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-rose-100 rounded-lg flex items-center justify-center">
                      <div className="w-2 h-2 bg-rose-500 rounded-full"></div>
                    </div>
                    <span className="text-gray-700 font-medium">Flexible Layouts</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-rose-100 rounded-lg flex items-center justify-center">
                      <div className="w-2 h-2 bg-rose-500 rounded-full"></div>
                    </div>
                    <span className="text-gray-700 font-medium">Full Support</span>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-4 pt-4">
                  <Button
                    size="lg"
                    className="bg-gradient-to-r from-rose-500 to-pink-500 text-white rounded-xl hover:from-rose-600 hover:to-pink-600 shadow-lg transform hover:-translate-y-1 transition-all duration-300 px-8 py-3 font-semibold"
                    onClick={handleEventVenueClick}
                  >
                    View Venue
                  </Button>
                </div>
              </div>

              {/* Visual */}
              <div className="relative">
                <div className="bg-gradient-to-br from-rose-50 to-pink-50 rounded-2xl p-1 shadow-2xl">
                  <div className="bg-white rounded-xl overflow-hidden">
                    <img
                      src={EventImage}
                      alt="Event Venue Space"
                      className="w-full h-64 md:h-80 object-cover"
                    />
                  </div>
                </div>
              </div>
            </motion.div>
          </div>

        </div>
      </div>
    </section>
  );
};

export default Hero;
