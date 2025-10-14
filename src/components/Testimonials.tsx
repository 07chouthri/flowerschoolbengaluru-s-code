import { Card, CardContent } from "@/components/ui/card";
import { Star, Quote, ChevronLeft, ChevronRight, Loader2 } from "lucide-react";
import { useState, useEffect, useRef } from "react";
import api from '@/lib/api';

interface Feedback {
  student_name: string;
  course_name: string;
  feedback_text: string;
  rating: number;
  created_at?: string;
}

const Testimonials = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [hoveredCard, setHoveredCard] = useState<number | null>(null);
  const [feedbackData, setFeedbackData] = useState<Feedback[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchFeedback = async () => {
      try {
        setLoading(true);
        console.log('Fetching feedback...');
        
        const response = await api.get('/api/Feedback');
        console.log('API Response:', response);
        console.log('Response data:', response.data);
        
        if (response.data && response.data.success) {
          if (response.data.data && Array.isArray(response.data.data)) {
            console.log('Setting feedback data:', response.data.data);
            setFeedbackData(response.data.data);
            setError(null);
          } else {
            console.log('No data array found');
            setFeedbackData([]);
            setError('No testimonials found');
          }
        } else {
          throw new Error('API response indicates failure');
        }
      } catch (err) {
        console.error('Error fetching feedback:', err);
        setError(err instanceof Error ? err.message : 'Failed to load testimonials');
        
        // Set fallback data on error
        setFeedbackData([
          {
            student_name: "Sarah Johnson",
            course_name: "Wedding Flowers",
            feedback_text: "Blossom Studio created the most breathtaking wedding arrangements. Every detail was perfect, and their flower arrangement class helped me understand the artistry behind it all.",
            rating: 5
          },
          {
            student_name: "Michael Chen",
            course_name: "Event Planning",
            feedback_text: "I've been working with Blossom Studio for years. Their creativity and attention to detail is unmatched. The wedding flower program gave me insights I use in every event.",
            rating: 5
          },
          {
            student_name: "Emily Rodriguez",
            course_name: "Kids Floral Art",
            feedback_text: "My daughter absolutely loved the kids' floral art workshop! The instructors were patient and creative. She still talks about the beautiful arrangement she made.",
            rating: 5
          }
        ]);
      } finally {
        setLoading(false);
      }
    };

    fetchFeedback();
  }, []);

  const nextSlide = () => {
    if (feedbackData.length > 0) {
      setCurrentSlide((prev) => (prev + 1) % feedbackData.length);
    }
  };

  const prevSlide = () => {
    if (feedbackData.length > 0) {
      setCurrentSlide((prev) => (prev - 1 + feedbackData.length) % feedbackData.length);
    }
  };

  const scrollToSlide = (index: number) => {
    if (scrollContainerRef.current && feedbackData.length > 0) {
      const cardWidth = scrollContainerRef.current.offsetWidth;
      scrollContainerRef.current.scrollTo({
        left: index * cardWidth,
        behavior: 'smooth'
      });
    }
    setCurrentSlide(index);
  };

  // Auto-scroll for mobile carousel
  useEffect(() => {
    if (feedbackData.length === 0) return;
    
    const interval = setInterval(() => {
      nextSlide();
    }, 5000);

    return () => clearInterval(interval);
  }, [feedbackData.length]);

  // Update scroll position when currentSlide changes
  useEffect(() => {
    if (feedbackData.length > 0) {
      scrollToSlide(currentSlide);
    }
  }, [currentSlide, feedbackData.length]);

  // Helper function to get avatar emoji based on name
  const getAvatarEmoji = (name: string) => {
    const emojis = ["👨‍🎓", "👩‍🎓", "👨‍💼", "👩‍💼", "👨‍🏫", "👩‍🏫", "👨‍🎨", "👩‍🎨"];
    const index = name ? name.length % emojis.length : 0;
    return emojis[index];
  };

  // Helper function to get gradient based on rating
  const getGradient = (rating: number) => {
    if (rating >= 5) return "from-green-100 to-emerald-100";
    if (rating >= 4) return "from-blue-100 to-cyan-100";
    if (rating >= 3) return "from-yellow-100 to-orange-100";
    return "from-pink-100 to-rose-100";
  };

  // Loading state
  if (loading) {
    return (
      <section className="py-12 md:py-16 lg:py-20 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold leading-tight mb-8">
              <span className="bg-gradient-to-r from-pink-600 to-rose-600 bg-clip-text text-transparent">
                What Our Happy Students Say
              </span>
            </h2>
            <div className="flex justify-center items-center gap-3 text-gray-600">
              <Loader2 className="h-6 w-6 animate-spin" />
              <span>Loading testimonials...</span>
            </div>
          </div>
        </div>
      </section>
    );
  }

  // Main render - No animations
  return (
    <section className="py-12 md:py-16 lg:py-20 relative overflow-hidden bg-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Header - No animations */}
        <div className="text-center mb-8 md:mb-12 lg:mb-16">
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold leading-tight mb-4 md:mb-6">
            <span className="bg-gradient-to-r from-pink-600 to-rose-600 bg-clip-text text-transparent">
              What Our Happy Students Say
            </span>
          </h2>
          <p className="text-base sm:text-lg md:text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed px-2">
            Hear from our satisfied students and workshop participants about their learning journey
          </p>
          {error && feedbackData.length > 0 && (
            <p className="text-sm text-orange-600 mt-2">
              Showing sample testimonials due to connection issues
            </p>
          )}
          {/* Debug info - remove in production */}
          <div className="text-xs text-gray-500 mt-2">
            {feedbackData.length > 0 ? `Showing ${feedbackData.length} testimonials` : 'No testimonials available'}
          </div>
        </div>

        {/* Show testimonials if we have data */}
        {feedbackData.length > 0 ? (
          <>
            {/* Mobile Carousel */}
            <div className="lg:hidden relative mb-8">
              {/* Navigation Arrows for Mobile */}
              <div className="flex justify-between items-center mb-4">
                <button
                  onClick={prevSlide}
                  className="p-2 sm:p-3 rounded-full bg-white/80 backdrop-blur-sm border border-gray-200 shadow-lg hover:shadow-xl z-20"
                >
                  <ChevronLeft className="h-4 w-4 sm:h-5 sm:w-5 text-gray-700" />
                </button>
                
                <div className="flex gap-1">
                  {feedbackData.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => scrollToSlide(index)}
                      className={`w-2 h-2 rounded-full ${
                        currentSlide === index 
                          ? 'bg-gradient-to-r from-pink-500 to-rose-500 w-4' 
                          : 'bg-gray-300'
                      }`}
                    />
                  ))}
                </div>
                
                <button
                  onClick={nextSlide}
                  className="p-2 sm:p-3 rounded-full bg-white/80 backdrop-blur-sm border border-gray-200 shadow-lg hover:shadow-xl z-20"
                >
                  <ChevronRight className="h-4 w-4 sm:h-5 sm:w-5 text-gray-700" />
                </button>
              </div>

              {/* Mobile Carousel Container */}
              <div 
                ref={scrollContainerRef}
                className="flex overflow-x-auto snap-x snap-mandatory scrollbar-hide space-x-4 pb-4 -mx-4 px-4"
                style={{ 
                  scrollbarWidth: 'none', 
                  msOverflowStyle: 'none',
                  scrollSnapType: 'x mandatory'
                }}
              >
                {feedbackData.map((feedback, index) => (
                  <div
                    key={`mobile-${feedback.student_name}-${index}`}
                    className="flex-shrink-0 w-[85vw] sm:w-[80vw] snap-center"
                  >
                    <Card className="group relative overflow-hidden border border-gray-200/60 hover:border-pink-300 shadow-lg hover:shadow-xl cursor-pointer h-full">
                      <div className={`absolute inset-0 bg-gradient-to-br ${getGradient(feedback.rating)} opacity-0 group-hover:opacity-10 z-0`} />
                      
                      <CardContent className="p-4 sm:p-6 relative z-10">
                        <div className="flex items-center mb-3 sm:mb-4">
                          <div className="text-3xl sm:text-4xl mr-3 sm:mr-4">
                            {getAvatarEmoji(feedback.student_name)}
                          </div>
                          <div className="flex-1">
                            <h4 className="font-semibold text-gray-900 text-sm sm:text-base">
                              {feedback.student_name}
                            </h4>
                            <p className="text-xs sm:text-sm text-gray-600">{feedback.course_name}</p>
                            <p className="text-xs text-gray-500 flex items-center gap-1 mt-1">
                              📍 Bangalore
                            </p>
                          </div>
                        </div>
                        
                        <div className="flex items-center mb-3 sm:mb-4">
                          {[...Array(Math.min(Math.max(feedback.rating, 1), 5))].map((_, i) => (
                            <Star
                              key={i}
                              className="h-3 w-3 sm:h-4 sm:w-4 fill-yellow-400 text-yellow-400"
                            />
                          ))}
                          <span className="ml-2 text-xs sm:text-sm text-gray-600 font-medium">{feedback.rating}.0</span>
                        </div>
                        
                        <div className="relative">
                          <Quote className="h-4 w-4 sm:h-6 sm:w-6 text-pink-200 absolute -top-1 -left-1" />
                          <p className="text-gray-600 leading-relaxed italic pl-4 sm:pl-6 text-xs sm:text-sm">
                            "{feedback.feedback_text}"
                          </p>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                ))}
              </div>
            </div>

            {/* Desktop Grid - No animations */}
            <div className="hidden lg:grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
              {feedbackData.map((feedback, index) => (
                <div
                  key={`desktop-${feedback.student_name}-${index}`}
                  onMouseEnter={() => setHoveredCard(index)}
                  onMouseLeave={() => setHoveredCard(null)}
                >
                  <Card className="group relative overflow-hidden border border-gray-200/60 hover:border-pink-300 shadow-lg hover:shadow-2xl cursor-pointer h-full">
                    <div className={`absolute inset-0 bg-gradient-to-br ${getGradient(feedback.rating)} opacity-0 group-hover:opacity-10 z-0`} />
                    
                    <CardContent className="p-6 relative z-10">
                      <div className="flex items-center mb-4">
                        <div className="text-4xl mr-4">
                          {getAvatarEmoji(feedback.student_name)}
                        </div>
                        <div className="flex-1">
                          <h4 className="font-semibold text-gray-900 group-hover:text-pink-600">
                            {feedback.student_name}
                          </h4>
                          <p className="text-sm text-gray-600">{feedback.course_name}</p>
                          <p className="text-xs text-gray-500 flex items-center gap-1">
                            📍 Bangalore
                          </p>
                        </div>
                      </div>
                      
                      <div className="flex items-center mb-4">
                        {[...Array(Math.min(Math.max(feedback.rating, 1), 5))].map((_, i) => (
                          <Star
                            key={i}
                            className="h-4 w-4 fill-yellow-400 text-yellow-400"
                          />
                        ))}
                        <span className="ml-2 text-sm text-gray-600 font-medium">{feedback.rating}.0</span>
                      </div>
                      
                      <div className="relative">
                        <Quote className="h-8 w-8 text-pink-200 absolute -top-2 -left-2" />
                        <p className="text-gray-600 leading-relaxed italic pl-6 text-sm">
                          "{feedback.feedback_text}"
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              ))}
            </div>
          </>
        ) : (
          /* No data available */
          <div className="text-center py-12">
            <div className="text-gray-600">
              <p className="text-lg mb-2">No testimonials available at the moment.</p>
              <p className="text-sm">Please check back later.</p>
              {error && (
                <p className="text-xs text-red-500 mt-2">Error: {error}</p>
              )}
            </div>
          </div>
        )}
      </div>

      <style>{`
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </section>
  );
};

export default Testimonials;