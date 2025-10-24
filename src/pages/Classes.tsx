import { useState, useEffect, useRef } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import SEO from "@/components/SEO";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar, Clock, Users, Star, BookOpen, ImageIcon, ArrowRight, GraduationCap, Award, Target, Heart, ChevronDown, ChevronUp } from "lucide-react";
import api, { endpoints } from "@/lib/api";
import { EnrollmentDialog } from "@/components/EnrollmentDialog";
import schoolClassroomImage from "@/assets/school-classroom.jpg";
import schoolGraduationImage from "@/assets/school-graduation.jpg";      

interface Feature {
  topic: string;
}

interface FlowerClass {
  id: string;
  title: string;
  description: string;
  price: string;
  duration: string;
  sessions: number;
  features: Feature[];
  popular: boolean;
  nextbatch: string;
  created_at: string;
  image: string | null;
  category?: " Workshops" | "Diploma course" | null;
  capacity?: number;
  enrolled?: number;
  rating?: number;
}

interface Achievement {
  title: string;
  description: string;
  icon: JSX.Element;
  gradient: string;
}

const Classes = () => {
  const [classes, setClasses] = useState<FlowerClass[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedLevel, setSelectedLevel] = useState("All");
  const [showEnrollment, setShowEnrollment] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState<FlowerClass | null>(null);
  const [imageErrors, setImageErrors] = useState<Set<string>>(new Set());
  const [isVisible, setIsVisible] = useState(false);
  const [hoveredCard, setHoveredCard] = useState<number | null>(null);
  const [expandedDescriptions, setExpandedDescriptions] = useState<Set<string>>(new Set());
  const [expandedFeatures, setExpandedFeatures] = useState<Set<string>>(new Set());
  const coursesSectionRef = useRef<HTMLDivElement>(null);

  // Achievements data following project patterns
  const achievements: Achievement[] = [
    {
      title: "Expert Instructors",
      description: "Learn from certified master florists with years of professional experience",
      icon: <GraduationCap className="h-8 w-8" />,
      gradient: "from-pink-500 to-rose-500"
    },
    {
      title: "Hands-On Training",
      description: "Practice with real flowers and professional equipment in our modern studios",
      icon: <Target className="h-8 w-8" />,
      gradient: "from-purple-500 to-pink-500"
    },
    {
      title: "Industry Recognition",
      description: "Receive certificates that are valued by employers and floral industry professionals",
      icon: <Award className="h-8 w-8" />,
      gradient: "from-rose-500 to-pink-500"
    },
    {
      title: "Passionate Community",
      description: "Join a supportive network of flower enthusiasts and professional florists",
      icon: <Heart className="h-8 w-8" />,
      gradient: "from-pink-500 to-purple-500"
    }
  ];

  // Enhanced base64 image handler following project patterns
  const formatImageSrc = (image) => {
    if (!image) return "";

    // Case 1: Full Base64 with prefix
    if (image.startsWith("data:image")) {
      return image;
    }

    // Case 2: Raw Base64 (no prefix yet)
    if (/^[A-Za-z0-9+/=]+$/.test(image)) {
      return `data:image/png;base64,${image}`;
    }

    // Case 3: Normal image path or URL
    return `/uploads/${image}`;
  };

  const handleImageError = (imageId: string) => {
    console.warn(`Image failed to load for course: ${imageId}`);
    setImageErrors(prev => new Set(prev).add(imageId));
  };

  const handleImageLoad = (imageId: string) => {
    // Remove from error set if image loads successfully
    setImageErrors(prev => {
      const newSet = new Set(prev);
      newSet.delete(imageId);
      return newSet;
    });
  };

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

  useEffect(() => {
    const fetchClasses = async () => {
      try {
        console.log('Fetching courses...');

        const coursesRes = await api.get(endpoints.courses);
        console.log('API Response - Courses:', coursesRes.data);

        const processData = (data: any[]): FlowerClass[] => {
          if (!Array.isArray(data)) {
            console.warn('Invalid data format received:', data);
            return [];
          }

          return data.map((cls: any) => {
            console.log('Processing course image:', cls.title, 'Image type:', typeof cls.image, 'Image length:', cls.image?.length);

              // normalize features: backend may return JSON-string, bracketed string, comma-separated or array
              const normalizeFeatures = (raw: any): Feature[] => {
                try {
                  if (!raw) return [{ topic: "Comprehensive floral training" }];

                  // If it's already an array
                  if (Array.isArray(raw)) {
                    return raw.map((f: any) => ({ topic: typeof f === 'string' ? f : (f.topic || 'Feature') }));
                  }

                  // If it's a JSON string like '["a","b"]'
                  if (typeof raw === 'string') {
                    const trimmed = raw.trim();

                    // Sometimes the backend stores a JS-style array as a string, try JSON.parse
                    if ((trimmed.startsWith('[') && trimmed.endsWith(']')) || (trimmed.startsWith('{') && trimmed.endsWith('}'))) {
                      try {
                        const parsed = JSON.parse(trimmed);
                        if (Array.isArray(parsed)) {
                          return parsed.map((f: any) => ({ topic: typeof f === 'string' ? f : (f.topic || 'Feature') }));
                        }
                        // if parsed object, fallthrough
                      } catch (e) {
                        // fallthrough to comma-split
                      }
                    }

                    // Fallback: comma separated string
                    return trimmed.split(/,|\n/).map(s => ({ topic: s.trim() })).filter(f => f.topic.length > 0);
                  }

                  // final fallback
                  return [{ topic: String(raw) }];
                } catch (e) {
                  return [{ topic: "Comprehensive floral training" }];
                }
              };

              return {
              id: cls.id?.toString() || crypto.randomUUID(),
              title: cls.title || "Untitled Course",
              description: cls.description || "No description available",
              price: cls.price?.toString() || "0",
              duration: cls.duration || "Not specified",
              sessions: cls.sessions || 1,
              features: normalizeFeatures(cls.features),
              popular: Boolean(cls.popular),
              nextbatch: cls.nextbatch || "Coming soon",
              created_at: cls.created_at || new Date().toISOString(),
              image: cls.image, // Keep original image data for processing
              category: cls.category || "Beginner",
              capacity: cls.capacity || 20,
              enrolled: cls.enrolled || 0,
              rating: cls.rating || 4.5,
            };
          });
        };

        const processedClasses = processData(coursesRes.data || []);
        console.log('Processed classes:', processedClasses);
        setClasses(processedClasses);

      } catch (error) {
        console.error("API fetch failed:", error);
        setClasses([]);
      } finally {
        setLoading(false);
      }
    };

    fetchClasses();
  }, []);

  useEffect(() => {
    // Trigger animation on component mount
    const timer = setTimeout(() => setIsVisible(true), 100);
    return () => clearTimeout(timer);
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-pink-500"></div>
      </div>
    );
  }

  const filtered = selectedLevel === "All"
    ? classes
    : classes.filter((cls) => cls.category === selectedLevel);

  // Scroll to courses section and set filter
  const handleCourseTypeClick = (level: string) => {
    setSelectedLevel(level);
    setTimeout(() => {
      coursesSectionRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, 100); // allow filter to update first
  };

  return (
    <>
      <SEO
        title="Flower Arranging Classes in Bengaluru - Professional Courses at Bangalore Flower School"
        description="Enroll in comprehensive flower arranging classes in Bengaluru. From beginner to advanced courses, learn professional floral design techniques in bangalore."
        keywords="flower arranging classes bengaluru, flower courses bangalore, floral design classes bengaluru, professional floristry bengaluru, flower arrangement workshops bangalore, flower school classes bengaluru"
      />
      <div className="min-h-screen bg-background">
        <Header onAdminClick={() => { }} onNavigate={() => { }} />

        <main>
          {/* Hero Section */}
          <section className="mt-6 bg-white">
            <div className="container mx-auto text-center px-4">
              <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-pink-500 to-rose-500 bg-clip-text text-transparent">
                Our Courses
              </h1>
              <p className="text-xl text-gray-800 mb-4 max-w-3xl mx-auto leading-relaxed">
                Transform your passion for flowers into professional skills with our
                expert-led courses. Whether you're a beginner or a seasoned floral designer,
                we provide hands-on training to elevate your creativity and career.
              </p>
              <p className="text-lg text-gray-800 max-w-3xl mx-auto leading-relaxed">
                Learn advanced techniques in floral arrangement, event decoration,
                bouquet styling, and more — all guided by experienced mentors dedicated
                to helping you grow in the world of floral artistry.
              </p>
            </div>
          </section>

          {/* Compact Course Type Boxes (Diploma / Workshops) */}
          <section className="py-8 bg-white">
            <div className="container mx-auto px-4">
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4 max-w-2xl mx-auto">
                {/* Diploma Courses Box */}
                <div
                  className="flex items-center gap-4 bg-white border-2 border-pink-200 rounded-xl p-4 w-full sm:w-auto hover:border-pink-400 hover:shadow-lg transition-all duration-300 cursor-pointer group"
                  onClick={() => handleCourseTypeClick("Diploma courses")}
                >
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-pink-500 to-rose-500 flex items-center justify-center text-white group-hover:scale-110 transition-transform duration-300">
                    <GraduationCap className="w-6 h-6" />
                  </div>
                  <div className="text-left">
                    <div className="text-base font-semibold text-gray-900">Diploma Courses</div>
                    <div className="text-sm text-gray-600">Professional certification programs</div>
                  </div>
                </div>

                {/* Workshops Box */}
                <div
                  className="flex items-center gap-4 bg-white border-2 border-purple-200 rounded-xl p-4 w-full sm:w-auto hover:border-purple-400 hover:shadow-lg transition-all duration-300 cursor-pointer group"
                  onClick={() => handleCourseTypeClick("Special Workshops")}
                >
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white group-hover:scale-110 transition-transform duration-300">
                    <BookOpen className="w-6 h-6" />
                  </div>
                  <div className="text-left">
                    <div className="text-base font-semibold text-gray-900">Workshops</div>
                    <div className="text-sm text-gray-600">Short intensive sessions</div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Interactive Main Showcase Grid */}
          <section className="py-16 bg-white">
            <div className="container mx-auto">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-16">
                {/* Left side - Graduation image with enhanced interaction */}
                <div className="relative group cursor-pointer">
                  <div className="relative overflow-hidden rounded-3xl shadow-2xl hover:shadow-3xl transition-all duration-500">
                    <div className="absolute inset-0 bg-gradient-to-bl from-rose-500/20 to-pink-500/20 z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                    <img
                      src={schoolGraduationImage}
                      alt="Flower school graduation ceremony"
                      className="w-full h-96 object-cover transform group-hover:scale-110 transition-transform duration-700 ease-out"
                    />

                    {/* Floating elements */}
                    <div className="absolute top-4 left-4 w-4 h-4 bg-rose-500 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500 animate-pulse" />
                    <div className="absolute top-8 right-8 w-3 h-3 bg-pink-500 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-700 animate-ping" />
                  </div>
                </div>

                {/* Right side - Classroom image with enhanced interaction */}
                <div className="relative group cursor-pointer">
                  <div className="relative overflow-hidden rounded-3xl shadow-2xl hover:shadow-3xl transition-all duration-500">
                    <div className="absolute inset-0 bg-gradient-to-br from-pink-500/20 to-purple-500/20 z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                    <img
                      src={schoolClassroomImage}
                      alt="Flower school classroom with students learning"
                      className="w-full h-96 object-cover transform group-hover:scale-110 transition-transform duration-700 ease-out"
                    />

                    {/* Floating elements */}
                    <div className="absolute bottom-4 right-4 w-4 h-4 bg-purple-500 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500 animate-pulse" />
                    <div className="absolute bottom-8 left-8 w-3 h-3 bg-pink-500 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-700 animate-ping" />
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Filter Section */}
          <section className="py-8 bg-white">
            <div className="container mx-auto">
              {/* Course Count */}
              <div className="text-center mb-8">
                <p className="text-lg text-muted-foreground">
                  <BookOpen className="h-5 w-5 inline mr-2 text-pink-500" />
                  {classes.length} Course{classes.length !== 1 ? 's' : ''} Available
                </p>
              </div>

              {/* Level Filter */}
              <div className="flex justify-center gap-2 mb-8 flex-wrap">
                {["Diploma courses"," Workshops"].map((level) => (
                  <Button
                    key={level}
                    variant={selectedLevel === level ? "default" : "outline"}
                    size="sm"
                    onClick={() => setSelectedLevel(level)}
                    className={selectedLevel === level
                      ? "bg-pink-500 hover:bg-pink-600 text-white border-pink-500"
                      : "border-pink-300 text-pink-600 hover:bg-pink-50 hover:text-pink-700 hover:border-pink-400"
                    }
                  >
                    {level}
                    {level !== "All" && (
                      <span className="ml-1 text-xs">
                        ({classes.filter(cls => cls.category === level).length})
                      </span>
                    )}
                  </Button>
                ))}
              </div>
            </div>
          </section>

          {/* Classes Available Section */}
          <section className="py-10 bg-white" ref={coursesSectionRef}>
            <div className="container mx-auto">
              {filtered.length === 0 ? (
                <div className="text-center py-16">
                  <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-pink-100 flex items-center justify-center">
                    <BookOpen className="h-8 w-8 text-pink-500" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">No courses found</h3>
                  <p className="text-muted-foreground">
                    {selectedLevel !== "All"
                      ? `No ${selectedLevel.toLowerCase()} level courses available.`
                      : `No courses are currently available.`}
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filtered.map((cls, index) => (
                    <Card
                      key={cls.id}
                      className="overflow-hidden hover:shadow-lg transition-all duration-300 hover:scale-[1.02] border-pink-100 h-full flex flex-col"
                    >
                      {/* Course Image - Natural Size with Flexible Container */}
                      <div className="relative flex-shrink-0 bg-gray-50 min-h-[180px] flex items-center justify-center overflow-hidden">
                        {imageErrors.has(cls.id) ? (
                          <div className="w-full h-full bg-gradient-to-br from-pink-100 via-purple-50 to-orange-100 flex items-center justify-center p-4">
                            <div className="text-center">
                              <div className="w-16 h-16 mx-auto mb-3 rounded-full bg-white/80 flex items-center justify-center shadow-lg">
                                <ImageIcon className="h-8 w-8 text-pink-500" />
                              </div>
                              <p className="text-sm font-medium text-pink-600">{cls.title}</p>
                              <p className="text-xs text-muted-foreground mt-1">Course Image</p>
                            </div>
                          </div>
                        ) : (
                          <>
                            <img
                              src={formatImageSrc(cls.image)}
                              alt={cls.title}
                              className="w-full h-auto max-h-[280px] object-contain"
                              onError={() => handleImageError(cls.id)}
                              onLoad={() => handleImageLoad(cls.id)}
                              loading="lazy"
                            />
                            {cls.popular && (
                              <Badge className="absolute top-3 right-3 bg-orange-500 hover:bg-orange-600 text-white text-xs">
                                🔥 Popular
                              </Badge>
                            )}
                            {cls.category && (
                              <Badge variant="secondary" className="absolute top-3 left-3 bg-pink-100 text-pink-700 border-pink-200 text-xs">
                                {cls.category}
                              </Badge>
                            )}
                          </>
                        )}
                      </div>

                      {/* Card Content - Improved Alignment */}
                      <CardContent className="flex-grow flex flex-col p-4 space-y-4">
                        {/* Title and Rating */}
                        <div className="flex items-start justify-between gap-2">
                          <CardTitle className="text-lg font-semibold text-gray-900 leading-tight flex-1">
                            {cls.title}
                          </CardTitle>
                          <div className="flex items-center gap-1 flex-shrink-0">
                            <Star className="h-4 w-4 text-yellow-400 fill-yellow-400" />
                            <span className="text-sm font-medium text-gray-700">
                              {cls.rating?.toFixed(1) || "4.5"}
                            </span>
                          </div>
                        </div>

                        {/* Description */}
                        <div className="space-y-2">
                          <div className={`text-sm text-gray-600 leading-relaxed ${
                            isDescriptionExpanded(cls.id) ? '' : 'line-clamp-2'
                          }`}>
                            {cls.description}
                          </div>
                          {cls.description.length > 100 && (
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-6 px-2 text-xs text-pink-600 hover:text-pink-700 hover:bg-pink-50 -ml-2"
                              onClick={() => toggleDescription(cls.id)}
                            >
                              {isDescriptionExpanded(cls.id) ? (
                                <>
                                  Show less <ChevronUp className="h-3 w-3 ml-1" />
                                </>
                              ) : (
                                <>
                                  Read more <ChevronDown className="h-3 w-3 ml-1" />
                                </>
                              )}
                            </Button>
                          )}
                        </div>

                        {/* Course Details */}
                        <div className="space-y-2">
                          <div className="flex items-center gap-2 text-sm text-gray-600">
                            <Calendar className="h-4 w-4 text-pink-500 flex-shrink-0" />
                            <span className="truncate">Next: {cls.nextbatch}</span>
                          </div>
                          <div className="flex items-center gap-2 text-sm text-gray-600">
                            <Clock className="h-4 w-4 text-pink-500 flex-shrink-0" />
                            <span>{cls.duration} session{cls.sessions > 1 ? 's' : ''}</span>
                          </div>
                         
                        </div>

                        {/* Features */}
                        <div className="space-y-2">
                          <h4
                            className={`text-sm font-medium cursor-pointer select-none ${expandedFeatures.has(cls.id) ? 'text-pink-600' : 'text-gray-900'}`}
                            onClick={() => {
                              setExpandedFeatures(prev => {
                                const newSet = new Set(prev);
                                if (newSet.has(cls.id)) newSet.delete(cls.id);
                                else newSet.add(cls.id);
                                return newSet;
                              });
                            }}
                            role="button"
                            aria-expanded={expandedFeatures.has(cls.id)}
                          >
                            What you'll learn:
                          </h4>

                          <div className="flex flex-wrap gap-2">
                            {cls.features && cls.features.length > 0 ? (
                              (expandedFeatures.has(cls.id) ? cls.features : cls.features.slice(0, 2)).map((f, fi) => (
                                <Badge key={fi} variant="outline" className="text-xs bg-gray-50 border-gray-200 text-gray-600 px-2 py-1">
                                  {f.topic}
                                </Badge>
                              ))
                            ) : (
                              <span className="text-xs text-gray-500">No features listed</span>
                            )}

                            {cls.features && cls.features.length > 2 && (
                              <Badge
                                variant="outline"
                                role="button"
                                aria-expanded={expandedFeatures.has(cls.id)}
                                className="text-xs bg-gray-50 border-gray-200 text-gray-600 px-2 py-1 cursor-pointer hover:bg-pink-50"
                                onClick={() => {
                                  setExpandedFeatures(prev => {
                                    const newSet = new Set(prev);
                                    if (newSet.has(cls.id)) newSet.delete(cls.id);
                                    else newSet.add(cls.id);
                                    return newSet;
                                  });
                                }}
                              >
                                {expandedFeatures.has(cls.id) ? 'Show less' : `+${cls.features.length - 2} more`}
                              </Badge>
                            )}
                          </div>
                        </div>

                        {/* Price and CTA */}
                        <div className="mt-auto pt-4 border-t border-pink-100">
                          <div className="flex items-center justify-between mb-3">
                            
                          </div>

                          <Button
                            className="w-full font-medium bg-pink-500 hover:bg-pink-600 text-white border-pink-500 disabled:bg-gray-300 disabled:text-gray-500 disabled:border-gray-300 h-10"
                            disabled={(cls.enrolled || 0) >= (cls.capacity || 20)}
                            onClick={() => {
                              setSelectedCourse(cls);
                              setShowEnrollment(true);
                            }}
                          >
                            {(cls.enrolled || 0) < (cls.capacity || 20) ? "Enroll Now" : "Join Waitlist"}
                            <ArrowRight className="h-4 w-4 ml-2" />
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </div>
          </section>

          {/* Animated Achievements Grid */}
          <section className="py-14 bg-white">
            <div className="container mx-auto">
              {/* Section Header */}
              <div className="text-center mb-12">
                <div className="inline-flex items-center gap-2 mb-4 px-4 py-2 rounded-full bg-pink-100 border border-pink-200">
                  <div className="w-2 h-2 bg-pink-500 rounded-full animate-pulse"></div>
                  <span className="text-sm font-semibold text-pink-700 uppercase tracking-wide">Why Choose Us</span>
                </div>
                <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                   <span className="bg-gradient-to-r from-pink-600 to-rose-600 bg-clip-text text-transparent">What Makes Our School Special</span>
                </h2>
                <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                  We're committed to providing the best floral education experience with industry-leading standards and passionate mentorship.
                </p>
              </div>

              {/* Achievements Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {achievements.map((achievement, index) => (
                  <div
                    key={achievement.title}
                    className={`transform transition-all duration-500 ease-out ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
                      }`}
                    style={{ transitionDelay: `${index * 150}ms` }}
                  >
                    <Card className="h-full border border-pink-100 hover:border-pink-300 hover:shadow-xl transition-all duration-300 group bg-white/80 backdrop-blur-sm">
                      <CardContent className="p-6 text-center">
                        {/* Gradient Icon Container */}
                        <div className={`w-20 h-20 mx-auto mb-6 rounded-2xl bg-gradient-to-br ${achievement.gradient} flex items-center justify-center group-hover:scale-110 transition-transform duration-300 shadow-lg`}>
                          <div className="text-white">
                            {achievement.icon}
                          </div>
                        </div>

                        {/* Title */}
                        <h3 className="text-xl font-bold mb-4 text-gray-900 group-hover:text-pink-600 transition-colors duration-300">
                          {achievement.title}
                        </h3>

                        {/* Description */}
                        <p className="text-gray-600 leading-relaxed">
                          {achievement.description}
                        </p>
                      </CardContent>
                    </Card>
                  </div>
                ))}
              </div>
            </div>
          </section>
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

export default Classes;