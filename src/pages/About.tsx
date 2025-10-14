import React, { useState, useRef, useEffect } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Testimonials from "@/components/Testimonials";
import SEO from "@/components/SEO";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Heart, Award, Users, Calendar, Zap, GraduationCap, Briefcase, Palette, Sparkles, Flower, ChevronRight, BookOpen, Clock, Star, ArrowRight } from "lucide-react";
import About4 from "@/assets/About4.jpg";
import FlowerClass from "@/assets/flower-arrangement-class.jpg";
import BeginnersCourseImage from "@/assets/Beginnerscourse.jpg";
import IntermediateCourseImage from "@/assets/IntermediateCours.jpg";
import BestGraduationImage from "@/assets/Advanced.jpg";
import DoorFlower from "@/assets/DoorFlower.jpg";
import RangoliImage from "@/assets/RangoliImage.jpg";
import HamperMakingWorkshopImage from "@/assets/HamperMakingWorkshop.jpg";
import GarlandMakingImage from "@/assets/GarlandMaking.jpg";
import { useNavigate } from "react-router-dom";
import api from '@/lib/api';
import { EnrollmentDialog } from "@/components/EnrollmentDialog";

// Improved animation hook with Intersection Observer
const useAnimateOnScroll = (delay = 0) => {
  const ref = useRef(null);
  const [isInView, setIsInView] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setTimeout(() => {
            setIsInView(true);
          }, delay);
        }
      },
      {
        threshold: 0.1,
        rootMargin: '-50px'
      }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => {
      if (ref.current) {
        observer.unobserve(ref.current);
      }
    };
  }, [delay]);

  return { ref, isInView };
};

const AnimatedSection = ({ children, className = "", delay = 0 }) => {
  const { ref, isInView } = useAnimateOnScroll(delay);

  return (
    <div
      ref={ref}
      className={`transition-all duration-1000 ease-out transform ${
        isInView
          ? "opacity-100 translate-y-0 scale-100"
          : "opacity-0 translate-y-8 scale-95"
      } ${className}`}
    >
      {children}
    </div>
  );
};

const About = () => {
  const navigate = useNavigate();
  const [showAdmin, setShowAdmin] = useState(false);
  const [activeStaff, setActiveStaff] = useState(0);
  const [instructors, setInstructors] = useState([]);
  const [loadingInstructors, setLoadingInstructors] = useState(false);
  const [impactsData, setImpactsData] = useState<any[]>([]);
  const [isImpactsLoading, setIsImpactsLoading] = useState(false);
  
  // New states for courses and workshops
  const [classes, setClasses] = useState<any[]>([]);
  const [loadingClasses, setLoadingClasses] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState<any>(null);
  const [showEnrollment, setShowEnrollment] = useState(false);
  const [expandedDescriptions, setExpandedDescriptions] = useState<Set<string>>(new Set());

  const stats = [
    {
      icon: Users,
      value: "5000",
      label: "Happy Students",
      description: "Trained in floral arts and event design",
    },
    {
      icon: Award,
      value: "15",
      label: "Years Experience",
      description: "In floral design and education",
    },
    {
      icon: Calendar,
      value: "500",
      label: "Classes Taught",
      description: "Hands-on floral design sessions",
    },
    {
      icon: Heart,
      value: "50000",
      label: "Flowers Arranged",
      description: "With love and creativity",
    },
  ];

  // Helper function to get icon component by name
  const getIconComponent = (iconName) => {
    const iconMap = {
      GraduationCap,
      Briefcase,
      Sparkles,
      Palette,
      Flower,
      Heart,
      Users,
      Award,
      Calendar,
      Zap
    };
    return iconMap[iconName] || GraduationCap;
  };

  // Staff Profiles Data (fallback)
  const staffProfiles = [
    {
      name: "Glory Arakal",
      role: "Director & Teaching Staff",
      icon: GraduationCap,
      description: "A floral teacher who turned a childhood fascination with flowers into a professional pursuit, receiving professional training from The Flower School New York City and interning with leading studios such as Birch and Brooklyn Blooms New York.",
      highlights: [
        "US Certified Public Accountant",
        "Trained at The Flower School NYC",
        "Interned with Birch and Brooklyn Blooms",
        "Mother's Day installation on Fifth Avenue NYC"
      ],
      color: "from-pink-500 to-rose-500"
    },
    {
      name: "Thomas Arakal",
      role: "Director of Administration & Teaching Staff",
      icon: Briefcase,
      description: "A Marine Engineering graduate with a master's degree in Business Administration, with international experience working with multinational companies in management and operations.",
      highlights: [
        "Marine Engineering graduate",
        "MBA with international experience",
        "Expert in floristry costing and budgeting",
        "Tablescape design specialist"
      ],
      color: "from-blue-500 to-cyan-500"
    },
    {
      name: "Ranjit Jana (Papai)",
      role: "Master Florist & Teaching Staff",
      icon: Sparkles,
      description: "A highly skilled Master Florist with over six years of professional experience, with expertise spanning floral shops and luxury establishments.",
      highlights: [
        "6+ years professional experience",
        "JW Marriott, The Leela Palace, Conrad Hotel",
        "Four Seasons Hotel experience",
        "Event décor and luxury floral design"
      ],
      color: "from-purple-500 to-pink-500"
    },
    {
      name: "Banothu Sri Rama",
      role: "Florist & Teaching Staff",
      icon: Palette,
      description: "A floral teacher who combines technical knowledge with creative design. An electrical engineer by qualification, pursued her passion for floristry.",
      highlights: [
        "Electrical Engineering background",
        "Trained at Meghaa Modi Design School",
        "Fresh and dry flower specialist",
        "Modern floral techniques"
      ],
      color: "from-green-500 to-emerald-500"
    },
    {
      name: "Geetha Somashekhar",
      role: "Ikebana Teaching Staff",
      icon: Flower,
      description: "An accomplished Ikebana teacher with over ten years of experience in the traditional Japanese art of flower arrangement.",
      highlights: [
        "10+ years Ikebana experience",
        "Jonin Sanyo Diploma holder",
        "Grade II Teacher's Diploma",
        "Sogetsu School of Ikebana"
      ],
      color: "from-orange-500 to-red-500"
    },
    {
      name: "Tara Vellara",
      role: "Resin Art Teaching Staff",
      icon: Heart,
      description: "A floral preservation artist with a background in architecture and interior design, transforming flowers into timeless works of art.",
      highlights: [
        "Architecture and interior design background",
        "MFA from Pratt Institute, New York",
        "Floral preservation specialist",
        "Resin artistry expert"
      ],
      color: "from-indigo-500 to-purple-500"
    }
  ];

  // Fetch instructors from API
  useEffect(() => {
    const fetchInstructors = async () => {
      setLoadingInstructors(true);
      try {
        const response = await api.get('/api/instructors');
        console.log('Response data:', response.data);
        
        // Handle the API response structure
        const instructorsData = response.data?.data || response.data || [];
        console.log('Setting instructors data:', instructorsData);
        
        if (Array.isArray(instructorsData) && instructorsData.length > 0) {
          setInstructors(instructorsData);
        } else {
          // Fallback to static data if no instructors from API
          setInstructors(staffProfiles);
        }
      } catch (error) {
        console.error('Error fetching instructors:', error);
        // Fallback to static data
        setInstructors(staffProfiles);
      } finally {
        setLoadingInstructors(false);
      }
    };

    const fetchImpacts = async () => {
      setIsImpactsLoading(true);
      try {
        const res = await api.get('/api/impacts');
        const data = Array.isArray(res.data) ? res.data : (res.data?.data || res.data?.impacts || []);
        if (Array.isArray(data) && data.length > 0) {
          setImpactsData(data);
        }
      } catch (error) {
        console.error('Error fetching impacts:', error);
      } finally {
        setIsImpactsLoading(false);
      }
    };

    const fetchClasses = async () => {
      setLoadingClasses(true);
      try {
        const response = await api.get('/api/courses');
        const classesData = response.data?.data || response.data || [];
        if (Array.isArray(classesData)) {
          setClasses(classesData);
        }
      } catch (error) {
        console.error('Error fetching classes:', error);
      } finally {
        setLoadingClasses(false);
      }
    };

    fetchInstructors();
    fetchImpacts();
    fetchClasses();
  }, []);

  // Helper functions for courses display
  const toggleDescription = (courseId: string) => {
    setExpandedDescriptions(prev => {
      const newSet = new Set(prev);
      if (newSet.has(courseId)) {
        newSet.delete(courseId);
      } else {
        newSet.add(courseId);
      }
      return newSet;
    });
  };

  const isDescriptionExpanded = (courseId: string) => {
    return expandedDescriptions.has(courseId);
  };

  const formatImageSrc = (image: any) => {
    if (!image) return "";

    if (image.startsWith("data:image")) {
      return image;
    }

    if (/^[A-Za-z0-9+/=]+$/.test(image)) {
      return `data:image/png;base64,${image}`;
    }

    return `/uploads/${image}`;
  };

  // Filter courses for display
  const professionalCourses = classes.filter(cls => 
    cls.category === "Professional Courses" || cls.category === "Advanced"
  );

  const specialWorkshops = classes.filter(cls => 
    cls.category === "Special Workshops" || cls.category === "Beginner" || cls.category === "Intermediate"
  );

  return (
    <>
      <SEO 
        title="About Bengaluru Flower School - Professional Floral Design Training in Bangalore"
        description="Discover the story of Bengaluru Flower School. Expert instructors, comprehensive courses, and professional flower arranging education in bangalore. Learn about our mission and values."
        keywords="about bengaluru flower school, flower school bangalore history, professional floristry training bengaluru, expert flower instructors bangalore, floral design education bengaluru"
      />
      <div className="min-h-screen bg-white font-sans">
        <Header
          onAdminClick={() => setShowAdmin(true)}
          onNavigate={(path) => navigate(path)}
        />

        <main className="pt-20">
          {/* Hero Section */}
          <AnimatedSection delay={100}>
            <section className="py-12 md:py-20 px-4 sm:px-6 bg-white">
              <div className="container mx-auto max-w-6xl">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                  {/* Text Content */}
                  <div className="text-center lg:text-left">
                    <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold mb-6 leading-tight">
                      <span className="bg-gradient-to-r from-pink-600 to-rose-600 bg-clip-text text-transparent">
                        About Our School
                      </span>
                    </h1>
                    <p className="text-lg sm:text-xl text-gray-700 leading-relaxed mb-8 font-sans">
                      India's premier hands-on floral education institute offering professional training
                      in floral design, techniques, and event styling for aspiring florists and creative enthusiasts.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                      <button
                        onClick={() => navigate('/classes')}
                        className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-pink-500 to-rose-500 text-white rounded-full font-semibold hover:from-pink-600 hover:to-rose-600 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1 font-sans"
                      >
                        Explore Courses
                        <ChevronRight className="w-5 h-5 ml-2" />
                      </button>
                    </div>
                  </div>

                  {/* Images Grid */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-4">
                      <img
                        src={About4}
                        alt="Flower School Bengaluru"
                        className="rounded-2xl shadow-lg w-full h-64 object-cover transform hover:scale-110 transition-transform duration-500"
                      />
                      <img
                        src={FlowerClass}
                        alt="Flower arrangement class"
                        className="rounded-2xl shadow-lg w-full h-64 object-cover transform hover:scale-105 transition-transform duration-500"
                      />
                    </div>
                    <div className="space-y-4 pt-8">
                      <img
                        src={BeginnersCourseImage}
                        alt="Beginner's course"
                        className="rounded-2xl shadow-lg w-full h-32 object-cover transform hover:scale-105 transition-transform duration-500"
                      />
                      <img
                        src={DoorFlower}
                        alt="Door flower decoration"
                        className="rounded-2xl shadow-lg w-full  object-cover transform hover:scale-105 transition-transform duration-500"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </section>
          </AnimatedSection>

          {/* Stats Section */}
          <AnimatedSection delay={200}>
            <section className="py-34 px-1 bg-white">
              <div className="container mx-auto max-w-6xl">
                <div className="text-center mb-16">
                  <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4">
                    <span className="bg-gradient-to-r from-pink-600 to-rose-600 bg-clip-text text-transparent">
                      Our Impact in Numbers
                    </span>
                  </h2>
                  <p className="text-xl text-gray-600 max-w-2xl mx-auto font-sans">
                    Transforming lives through the art of floral design
                  </p>
                </div>

                <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
                  {(impactsData && impactsData.length > 0) ? (
                    impactsData.map((imp, index) => (
                      <div key={imp.id || index} className="text-center group">
                        <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-pink-500 to-rose-500 rounded-2xl mb-6 transform group-hover:scale-110 transition-transform duration-500">
                          <Zap className="w-10 h-10 text-white" />
                        </div>
                        <div className="font-bold text-gray-900 mb-2 font-sans text-3xl md:text-4xl">
                          {imp.value}
                        </div>
                        <div className="font-semibold text-gray-800 mb-2 font-sans text-lg">
                          {imp.title}
                        </div>
                      </div>
                    ))
                  ) : (
                    stats.map((stat, index) => {
                      const StatIcon = stat.icon;
                      return (
                        <div key={index} className="text-center group">
                          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-pink-500 to-rose-500 rounded-2xl mb-6 transform group-hover:scale-110 transition-transform duration-500">
                            <StatIcon className="w-10 h-10 text-white" />
                          </div>
                          <div className="font-bold text-gray-900 mb-2 font-sans text-3xl md:text-4xl">
                            {stat.value}
                          </div>
                          <div className="font-semibold text-gray-800 mb-2 font-sans text-lg">
                            {stat.label}
                          </div>
                          <div className="text-gray-600 font-sans text-sm">
                            {stat.description}
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>
              </div>
            </section>
          </AnimatedSection>

          {/* Expert Team Section */}
          <AnimatedSection delay={300}>
            <section className="py-16 md:py-24 px-4 sm:px-6">
              <div className="container mx-auto max-w-6xl">
                <div className="text-center mb-16">
                  <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4">
                    <span className="bg-gradient-to-r from-pink-600 to-rose-600 bg-clip-text text-transparent">
                      Our Expert Instructors
                    </span>
                  </h2>
                  <p className="text-xl text-gray-600 max-w-2xl mx-auto font-sans">
                    Learn from industry professionals with years of experience
                  </p>
                </div>

                {/* Staff Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {loadingInstructors ? (
                    // Loading skeleton
                    Array.from({ length: 6 }).map((_, index) => (
                      <div key={index} className="group text-center p-8 rounded-2xl border border-gray-100 bg-white animate-pulse">
                        <div className="relative mb-6">
                          <div className="w-48 h-48 rounded-full bg-gray-200 mx-auto"></div>
                        </div>
                        <div className="h-6 bg-gray-200 rounded mb-3 mx-auto w-3/4"></div>
                        <div className="h-4 bg-gray-200 rounded mb-4 mx-auto w-1/2"></div>
                        <div className="h-16 bg-gray-200 rounded mb-6"></div>
                        <div className="space-y-2.5">
                          <div className="h-3 bg-gray-200 rounded"></div>
                          <div className="h-3 bg-gray-200 rounded"></div>
                        </div>
                      </div>
                    ))
                  ) : (
                    instructors.map((staff, index) => {
                      const StaffIcon = typeof staff.icon === 'string' ? getIconComponent(staff.icon) : staff.icon || getIconComponent('GraduationCap');
                      
                      // Handle both API data structure and static data structure
                      const staffName = staff.name;
                      const staffRole = staff.role || staff.specialization || 'Instructor';
                      const staffDescription = staff.description || staff.bio || '';
                      const staffHighlights = staff.highlights || [`${staff.experience_years || 0}+ years experience`, staff.email || ''];
                      const profileImage = staff.profile_image;
                      
                      return (
                        <div key={staff.id || index} className="group text-center p-8 rounded-2xl border border-gray-100 bg-white hover:border-pink-200 transition-all duration-500 hover:shadow-lg">
                          {/* Profile Image or Icon Circle */}
                          <div className="relative mb-6">
                            {profileImage ? (
                              <div className="w-48 h-48 rounded-full mx-auto overflow-hidden border-8 border-white shadow-lg transform group-hover:scale-110 transition-transform duration-500">
                                <img
                                  src={profileImage}
                                  alt={staffName}
                                  className="w-full h-full object-cover"
                                  onError={(e) => {
                                    // Fallback to icon if image fails to load
                                    const target = e.target as HTMLImageElement;
                                    target.style.display = 'none';
                                    const fallbackDiv = target.nextSibling as HTMLElement;
                                    if (fallbackDiv) {
                                      fallbackDiv.style.display = 'flex';
                                    }
                                  }}
                                />
                                <div className="w-full h-full rounded-full bg-gradient-to-br from-pink-50 to-rose-50 flex items-center justify-center" style={{display: 'none'}}>
                                  <StaffIcon className="w-16 h-16 text-pink-600" />
                                </div>
                              </div>
                            ) : (
                              <div className="w-48 h-48 rounded-full bg-gradient-to-br from-pink-50 to-rose-50 border-8 border-white shadow-md mx-auto flex items-center justify-center transform group-hover:scale-110 transition-transform duration-500">
                                <StaffIcon className="w-16 h-16 text-pink-600" />
                              </div>
                            )}
                          </div>

                          {/* Staff Info */}
                          <h3 className="text-xl font-bold text-gray-900 mb-3 font-sans">
                            {staffName}
                          </h3>
                          <div className="inline-block px-4 py-1.5 bg-pink-100 text-pink-700 rounded-full text-sm font-medium mb-4">
                            {staffRole}
                          </div>
                          <p className="text-gray-600 leading-relaxed mb-6 text-sm">
                            {staffDescription}
                          </p>

                          {/* Highlights */}
                          <div className="space-y-2.5">
                            {(staffHighlights || []).slice(0, 2).map((highlight, idx) => (
                              <div key={idx} className="flex items-center justify-center gap-2 text-gray-700 text-sm">
                                <span className="text-pink-500">•</span>
                                {highlight}
                              </div>
                            ))}
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>
              </div>
            </section>
          </AnimatedSection>

          {/* Professional Courses Section */}
<AnimatedSection delay={400}>
  <section className="py-8">
    <div className="container mx-auto max-w-6xl">
      <div className="text-center mb-12">
        <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4">
          <span className="bg-gradient-to-r from-pink-600 to-rose-600 bg-clip-text text-transparent">
            Professional Courses
          </span>
        </h2>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto font-sans">
          Comprehensive floral design programs for serious career development
        </p>
      </div>

      {loadingClasses ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 3 }).map((_, index) => (
            <Card key={index} className="overflow-hidden border-pink-100 animate-pulse">
              <div className="h-48 bg-gray-200"></div>
              <CardContent className="p-6 space-y-4">
                <div className="h-6 bg-gray-200 rounded"></div>
                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                <div className="h-4 bg-gray-200 rounded w-1/2"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : professionalCourses.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {professionalCourses.slice(0, 3).map((course) => {
            // Safely handle features data
            const courseFeatures = Array.isArray(course.features) 
              ? course.features 
              : [];

            // Safely handle features with topic property
            const formattedFeatures = courseFeatures.map(feature => {
              if (typeof feature === 'string') {
                return { topic: feature };
              }
              if (feature && typeof feature === 'object' && feature.topic) {
                return { topic: feature.topic };
              }
              return { topic: String(feature) };
            }).filter(feature => feature.topic && feature.topic.trim() !== '');

            return (
              <Card key={course.id} className="overflow-hidden hover:shadow-lg transition-all duration-300 border-pink-100 flex flex-col h-full">
                {/* Course Image - Natural Size */}
                <div className="flex-shrink-0  flex items-center justify-center overflow-hidden">
                  {course.image ? (
                    <div className="relative w-full">
                      <img
                        src={formatImageSrc(course.image)}
                        alt={course.title}
                        className="w-full h-auto object-contain max-h-64"
                        loading="lazy"
                      />
                      {course.popular && (
                        <Badge className="absolute top-3 right-3 bg-orange-500 hover:bg-orange-600 text-white text-xs">
                          🔥 Popular
                        </Badge>
                      )}
                      {course.category && (
                        <Badge variant="secondary" className="absolute top-3 left-3 bg-pink-100 text-pink-700 border-pink-200 text-xs">
                          {course.category}
                        </Badge>
                      )}
                    </div>
                  ) : (
                    <div className="w-full h-48 flex items-center justify-center bg-gradient-to-br from-pink-100 to-rose-100">
                      <BookOpen className="h-16 w-16 text-pink-400" />
                    </div>
                  )}
                </div>

                <CardContent className="p-6 flex-grow flex flex-col">
                  <div className="flex items-start justify-between mb-3">
                    <h3 className="text-lg font-bold text-gray-900 flex-1">
                      {course.title}
                    </h3>
                    <div className="flex items-center gap-1 flex-shrink-0 ml-2">
                      <Star className="h-4 w-4 text-yellow-400 fill-yellow-400" />
                      <span className="text-sm font-medium text-gray-700">
                        {course.rating?.toFixed(1) || "4.5"}
                      </span>
                    </div>
                  </div>

                  <div className="space-y-3 mb-4 flex-grow">
                    <div className={`text-sm text-gray-600 leading-relaxed ${
                      isDescriptionExpanded(course.id) ? '' : 'line-clamp-3'
                    }`}>
                      {course.description}
                    </div>
                    {course.description && course.description.length > 120 && (
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-6 px-2 text-xs text-pink-600 hover:text-pink-700 hover:bg-pink-50 -ml-2"
                        onClick={() => toggleDescription(course.id)}
                      >
                        {isDescriptionExpanded(course.id) ? (
                          <>Show less</>
                        ) : (
                          <>Read more</>
                        )}
                      </Button>
                    )}

                    <div className="flex items-center gap-4 text-sm text-gray-500 flex-wrap">
                      <div className="flex items-center gap-1">
                        <Clock className="h-4 w-4" />
                        <span>{course.duration}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Calendar className="h-4 w-4" />
                        <span>Next: {course.nextbatch}</span>
                      </div>
                      {course.sessions && (
                        <div className="flex items-center gap-1">
                          <Users className="h-4 w-4" />
                          <span>{course.sessions} sessions</span>
                        </div>
                      )}
                    </div>

                    {/* Course Features - Safe rendering */}
                    {formattedFeatures.length > 0 && (
                      <div className="mt-3">
                        <h4 className="text-sm font-medium text-gray-900 mb-2">You'll learn:</h4>
                        <div className="flex flex-wrap gap-1">
                          {formattedFeatures.slice(0, 3).map((feature, index) => (
                            <Badge 
                              key={index} 
                              variant="outline" 
                              className="text-xs bg-pink-50 border-pink-200 text-pink-700"
                            >
                              {feature.topic}
                            </Badge>
                          ))}
                          {formattedFeatures.length > 3 && (
                            <Badge variant="outline" className="text-xs bg-gray-50 border-gray-200 text-gray-600">
                              +{formattedFeatures.length - 3} more
                            </Badge>
                          )}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Price and Enrollment */}
                  <div className="mt-auto pt-4 border-t border-gray-100">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <span className="text-2xl font-bold text-gray-900">
                          ₹{course.price}
                        </span>
                        {course.originalPrice && (
                          <span className="text-sm text-gray-500 line-through">
                            ₹{course.originalPrice}
                          </span>
                        )}
                      </div>
                      {course.capacity && (
                        <div className="text-xs text-gray-500">
                          {course.enrolled || 0}/{course.capacity} enrolled
                        </div>
                      )}
                    </div>

                    <Button
                      className="w-full bg-pink-500 hover:bg-pink-600 text-white font-medium"
                      onClick={() => {
                        setSelectedCourse(course);
                        setShowEnrollment(true);
                      }}
                    >
                      Enroll Now
                      <ArrowRight className="h-4 w-4 ml-2" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      ) : (
        <div className="text-center py-8">
          <BookOpen className="h-16 w-16 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500">No professional courses available at the moment.</p>
        </div>
      )}

     
    </div>
  </section>
</AnimatedSection>

   <AnimatedSection delay={500}>
  <section className="py-16">
    <div className="container mx-auto max-w-6xl">
      <div className="text-center mb-12">
        <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4">
          <span className="bg-gradient-to-r from-pink-600 to-rose-600 bg-clip-text text-transparent">
            Special Workshops
          </span>
        </h2>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto font-sans">
          Short, intensive sessions for creative exploration and skill development
        </p>
      </div>

      {loadingClasses ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {Array.from({ length: 4 }).map((_, index) => (
            <Card key={index} className="overflow-hidden border-pink-100 animate-pulse">
              <div className="h-48 bg-gray-200"></div>
              <CardContent className="p-6 space-y-4">
                <div className="h-6 bg-gray-200 rounded"></div>
                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                <div className="h-4 bg-gray-200 rounded w-1/2"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : specialWorkshops.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {specialWorkshops.slice(0, 3).map((workshop) => {
            // Safely handle features data for workshops too
            const workshopFeatures = Array.isArray(workshop.features) 
              ? workshop.features 
              : [];

            const formattedFeatures = workshopFeatures.map(feature => {
              if (typeof feature === 'string') {
                return { topic: feature };
              }
              if (feature && typeof feature === 'object' && feature.topic) {
                return { topic: feature.topic };
              }
              return { topic: String(feature) };
            }).filter(feature => feature.topic && feature.topic.trim() !== '');

            return (
              <Card key={workshop.id} className="overflow-hidden hover:shadow-lg transition-all duration-300 border-pink-100 flex flex-col h-full">
                {/* Workshop Image - Natural Size */}
                <div className="flex-shrink-0 flex items-center justify-center overflow-hidden">
                  {workshop.image ? (
                    <div className="relative w-full">
                      <img
                        src={formatImageSrc(workshop.image)}
                        alt={workshop.title}
                        className="w-full h-auto object-contain max-h-64"
                        loading="lazy"
                      />
                      {workshop.popular && (
                        <Badge className="absolute top-3 right-3 bg-orange-500 hover:bg-orange-600 text-white text-xs">
                          🔥 Popular
                        </Badge>
                      )}
                      {workshop.category && (
                        <Badge variant="secondary" className="absolute top-3 left-3 bg-pink-100 text-pink-700 border-pink-200 text-xs">
                          Workshop
                        </Badge>
                      )}
                    </div>
                  ) : (
                    <div className="w-full h-48 flex items-center justify-center bg-gradient-to-br from-pink-100 to-rose-100">
                      <BookOpen className="h-16 w-16 text-pink-400" />
                    </div>
                  )}
                </div>

                <CardContent className="p-6 flex-grow flex flex-col">
                  <div className="flex items-start justify-between mb-3">
                    <h3 className="text-lg font-bold text-gray-900 flex-1">
                      {workshop.title}
                    </h3>
                    <div className="flex items-center gap-1 flex-shrink-0 ml-2">
                      <Star className="h-4 w-4 text-yellow-400 fill-yellow-400" />
                      <span className="text-sm font-medium text-gray-700">
                        {workshop.rating?.toFixed(1) || "4.5"}
                      </span>
                    </div>
                  </div>

                  <div className="space-y-3 mb-4 flex-grow">
                    <div className={`text-sm text-gray-600 leading-relaxed ${
                      isDescriptionExpanded(workshop.id) ? '' : 'line-clamp-3'
                    }`}>
                      {workshop.description}
                    </div>
                    {workshop.description && workshop.description.length > 120 && (
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-6 px-2 text-xs text-pink-600 hover:text-pink-700 hover:bg-pink-50 -ml-2"
                        onClick={() => toggleDescription(workshop.id)}
                      >
                        {isDescriptionExpanded(workshop.id) ? (
                          <>Show less</>
                        ) : (
                          <>Read more</>
                        )}
                      </Button>
                    )}

                    <div className="flex items-center gap-4 text-sm text-gray-500 flex-wrap">
                      <div className="flex items-center gap-1">
                        <Clock className="h-4 w-4 text-pink-500" />
                        <span>{workshop.duration}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Calendar className="h-4 w-4 text-pink-500" />
                        <span>Next: {workshop.nextbatch}</span>
                      </div>
                      {workshop.sessions && (
                        <div className="flex items-center gap-1">
                          <Users className="h-4 w-4 text-pink-500" />
                          <span>{workshop.sessions} sessions</span>
                        </div>
                      )}
                    </div>

                    {/* Workshop Highlights */}
                    {formattedFeatures.length > 0 && (
                      <div className="mt-3">
                        <h4 className="text-sm font-medium text-gray-900 mb-2">Workshop Highlights:</h4>
                        <div className="flex flex-wrap gap-1">
                          {formattedFeatures.slice(0, 2).map((feature, index) => (
                            <Badge 
                              key={index} 
                              variant="outline" 
                              className="text-xs bg-pink-50 border-pink-200 text-pink-700"
                            >
                              {feature.topic}
                            </Badge>
                          ))}
                          {formattedFeatures.length > 2 && (
                            <Badge variant="outline" className="text-xs bg-gray-50 border-gray-200 text-gray-600">
                              +{formattedFeatures.length - 2} more
                            </Badge>
                          )}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Price and Enrollment */}
                  <div className="mt-auto pt-4 border-t border-pink-100">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <span className="text-2xl font-bold text-gray-900">
                          ₹{workshop.price}
                        </span>
                        {workshop.originalPrice && (
                          <span className="text-sm text-gray-500 line-through">
                            ₹{workshop.originalPrice}
                          </span>
                        )}
                      </div>
                      {workshop.capacity && (
                        <div className="text-xs text-gray-500">
                          {workshop.enrolled || 0}/{workshop.capacity} spots
                        </div>
                      )}
                    </div>

                    <Button
                      className="w-full bg-pink-500 hover:bg-pink-600 text-white font-medium"
                      onClick={() => {
                        setSelectedCourse(workshop);
                        setShowEnrollment(true);
                      }}
                    >
                      Join Workshop
                      <ArrowRight className="h-4 w-4 ml-2" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      ) : (
        <div className="text-center py-8">
          <div className="w-24 h-24 mx-auto mb-4 rounded-full bg-pink-100 flex items-center justify-center">
            <BookOpen className="h-12 w-12 text-pink-500" />
          </div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">No Workshops Available</h3>
          <p className="text-gray-600 max-w-md mx-auto">
            Check back soon for our upcoming special workshops and creative sessions.
          </p>
        </div>
      )}

      <div className="text-center mt-8">
        <Button
          onClick={() => navigate('/classes')}
          variant="outline"
          className="border-pink-500 text-pink-600 hover:bg-pink-50 hover:border-pink-600 px-6 py-2"
        >
          View All Workshops
          <ArrowRight className="h-4 w-4 ml-2" />
        </Button>
      </div>
    </div>
  </section>
</AnimatedSection>
        
          {/* Testimonials Section */}
          <AnimatedSection delay={600}>
            <section className="bg-white">
              <Testimonials />
            </section>
          </AnimatedSection>
        </main>

        <Footer />

        {selectedCourse && (
          <EnrollmentDialog
            isOpen={showEnrollment}
            onClose={() => setShowEnrollment(false)}
            courseTitle={selectedCourse.title}
            courseId={selectedCourse.id}
            batch={selectedCourse.nextbatch}
            price={selectedCourse.price}
          />
        )}
      </div>
    </>
  );
};

export default About;