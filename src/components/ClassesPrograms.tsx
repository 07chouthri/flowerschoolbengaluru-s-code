import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Sparkles, Clock, Tag, Zap } from "lucide-react";
import BeginnersCourseImage from "@/assets/Beginnerscourse.jpg";
import IntermediateCourseImage from "@/assets/IntermediateCourse.jpg";
import BestGraduationImage from "@/assets/BestGraduation.jpg";
import { useState, useEffect, useRef } from "react";

const ClassesPrograms = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState(0);
  const sectionRef = useRef<HTMLElement>(null);

  const courses = [
    {
      id: 1,
      title: "Beginner's Course to Floristry",
      duration: "5 Days",
      price: "75,000",
      image: BeginnersCourseImage,
      description: "This 5-day course introduces the fundamentals of floral design and provides hands-on training in essential techniques and introduces the Modern & Traditional styles of arrangement.",
      highlights: [
        "Design with hard-stemmed flowers",
        "Handle soft-stemmed blooms",
        "Create garden-style centrepieces",
        "Craft hand-tied bouquets",
        "Four beginner-level foam arrangements"
      ],
      gradient: "from-blue-400 to-purple-500"
    },
    {
      id: 2,
      title: "Intermediate Course to Floristry",
      duration: "5 Days",
      price: "75,000",
      image: IntermediateCourseImage,
      description: "This 5-day course builds on foundational floristry skills and offers hands-on training in intermediate floral design techniques.",
      highlights: [
        "Source and purchase fresh flowers from local markets",
        "Create elegant monochromatic arrangements",
        "Craft hand-tied wedding bouquets",
        "Basics of event styling and tablescaping",
        "Three foam-based floral arrangements",
        "Gift hamper design using basket"
      ],
      gradient: "from-green-400 to-teal-500"
    },
    {
      id: 3,
      title: "Advanced Course to Floristry",
      duration: "5 Days",
      price: "75,000",
      image: BestGraduationImage,
      description: "This 5-day Advanced Series course is designed for florists to elevate their technical and creative skills.",
      highlights: [
        "Advanced color theory and pricing strategies",
        "Recipe management for business",
        "Classic compote arrangement design",
        "Impactful weekly arrangements",
        "Advanced vase styling techniques",
        "Framing technique mastery"
      ],
      gradient: "from-orange-400 to-red-500"
    }
  ];

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.2 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  const totalPrice = 75000 * 3;
  const discountPrice = totalPrice * 0.95;

  return (
    <section ref={sectionRef} className="py-20 bg-gradient-to-br from-white via-pink-50/30 to-purple-50/30 overflow-hidden">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header Section */}
        <div className={`text-center mb-16 transform transition-all duration-1000 ${
          isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
        }`}>
          <div className="inline-flex items-center gap-2 bg-gradient-to-r from-pink-100 to-purple-100 px-6 py-3 rounded-full mb-6 border border-pink-200">
            <Sparkles className="h-5 w-5 text-pink-600" />
            <span className="text-pink-700 font-semibold">Professional Floristry Courses</span>
          </div>
          
          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 mb-4">
            We Offer{" "}
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-pink-400 to-rose-400 font-semibold ml-3">
              Following Courses
            </span>
          </h2>
          
          <p className="text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
            Transform your passion into expertise with our comprehensive 3-tier floristry program
          </p>
        </div>

        {/* Main Course Showcase */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16 items-center">
          {/* Left Side - Course Image */}
          <div className="relative group">
            <div className="relative overflow-hidden rounded-3xl shadow-2xl">
              <img
                src={courses[selectedCourse].image}
                alt={courses[selectedCourse].title}
                className="w-full h-[500px] object-cover transform group-hover:scale-105 transition-transform duration-700 ease-out"
              />
              
              {/* Image Navigation Dots */}
              <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 flex gap-2">
                {courses.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedCourse(index)}
                    className={`w-3 h-3 rounded-full transition-all duration-300 ${
                      selectedCourse === index 
                        ? 'bg-white w-8' 
                        : 'bg-white/50 hover:bg-white/80'
                    }`}
                  />
                ))}
              </div>
              
              {/* Price Badge */}
              <div className="absolute top-6 right-6 bg-white/95 backdrop-blur-sm px-4 py-2 rounded-full shadow-lg">
                <div className="flex items-center gap-2">
                  <Tag className="h-4 w-4 text-pink-600" />
                  <span className="font-bold text-gray-900">₹{courses[selectedCourse].price}/-</span>
                </div>
              </div>
              
              {/* Duration Badge */}
              <div className="absolute top-6 left-6 bg-white/95 backdrop-blur-sm px-4 py-2 rounded-full shadow-lg">
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-purple-600" />
                  <span className="font-medium text-gray-900">{courses[selectedCourse].duration}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Side - Course Content */}
          <div className="space-y-6">
            <div className="flex items-center gap-4 mb-6">
              <div className={`w-12 h-12 rounded-2xl bg-gradient-to-r ${courses[selectedCourse].gradient} flex items-center justify-center`}>
                <span className="text-2xl">🌸</span>
              </div>
              <div>
                <span className="text-sm font-medium text-pink-600 bg-pink-50 px-3 py-1 rounded-full">
                  Course {selectedCourse + 1} of 3
                </span>
                <h3 className="text-3xl font-bold text-gray-900 mt-1">
                  {courses[selectedCourse].title}
                </h3>
              </div>
            </div>

            <p className="text-lg text-gray-600 leading-relaxed">
              {courses[selectedCourse].description}
            </p>

            <div className="space-y-3">
              <h4 className="font-semibold text-gray-900 flex items-center gap-2">
                <Zap className="h-5 w-5 text-yellow-500" />
                What You'll Learn:
              </h4>
              <div className="grid gap-2">
                {courses[selectedCourse].highlights.map((highlight, index) => (
                  <div key={index} className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-pink-400 rounded-full"></div>
                    <span className="text-gray-700">{highlight}</span>
                  </div>
                ))}
              </div>
            </div>

            <Button 
              size="lg" 
              className="w-full bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-700 hover:to-purple-700 text-white py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
              onClick={() => window.location.href = '/contact'}
            >
              Enroll Now - ₹{courses[selectedCourse].price}/-
            </Button>
          </div>
        </div>

        {/* Course Selection Tabs */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          {courses.map((course, index) => (
            <Card 
              key={course.id}
              className={`cursor-pointer transition-all duration-300 border-2 ${
                selectedCourse === index 
                  ? 'border-pink-300 shadow-xl scale-105' 
                  : 'border-gray-200 hover:border-pink-200 hover:shadow-lg'
              }`}
              onClick={() => setSelectedCourse(index)}
            >
              <CardContent className="p-6">
                <div className="flex items-center gap-4 mb-4">
                  <div className={`w-10 h-10 rounded-xl bg-gradient-to-r ${course.gradient} flex items-center justify-center`}>
                    <span className="text-white font-bold">{index + 1}</span>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 line-clamp-1">{course.title.split(' ')[0]}</h4>
                    <p className="text-sm text-gray-600">{course.duration}</p>
                  </div>
                </div>
                <p className="text-gray-600 text-sm mb-4 line-clamp-2">{course.description}</p>
                <div className="flex justify-between items-center">
                  <span className="font-bold text-gray-900">₹{course.price}/-</span>
                  <Button variant="outline" size="sm" className="border-pink-200 text-pink-600 hover:bg-pink-50">
                    View Details
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Special Discount Banner */}
        <div className="bg-gradient-to-r from-pink-500 to-purple-600 rounded-3xl p-8 text-white mb-12 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-16 translate-x-16"></div>
          <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/10 rounded-full translate-y-12 -translate-x-12"></div>
          
          <div className="relative z-10 text-center">
            <h3 className="text-2xl font-bold mb-2">✨ Special Bundle Offer!</h3>
            <p className="text-lg mb-4 opacity-90">
              Enroll in all 3 courses together and get <span className="font-bold">5% discount</span>
            </p>
            <div className="flex justify-center items-center gap-4 mb-4">
              <span className="text-2xl line-through opacity-70">₹{totalPrice}/-</span>
              <span className="text-3xl font-bold">₹{discountPrice.toLocaleString()}/-</span>
              <span className="bg-white text-pink-600 px-3 py-1 rounded-full text-sm font-bold">Save ₹{(totalPrice * 0.05).toLocaleString()}</span>
            </div>
            <Button 
              size="lg" 
              className="bg-white text-pink-600 hover:bg-gray-100 font-semibold px-8 py-3 rounded-xl"
              onClick={() => window.location.href = '/contact'}
            >
              Enroll in All 3 Courses
            </Button>
          </div>
        </div>

        {/* CTA Section */}
        <div className="text-center">
          <h3 className="text-3xl font-bold text-gray-900 mb-4">
            Ready to Start Your <span className="text-pink-600">Floral Journey</span>?
          </h3>
          <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
            Join our community of flower enthusiasts and learn from industry experts in our state-of-the-art facilities.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              size="lg" 
              className="bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-700 hover:to-purple-700 text-white px-8 py-3 rounded-xl"
              onClick={() => window.location.href = '/contact'}
            >
              Book a Campus Tour
            </Button>
            <Button 
              variant="outline" 
              size="lg"
              className="border-pink-300 text-pink-600 hover:bg-pink-50 px-8 py-3 rounded-xl"
            >
              Download Brochure
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ClassesPrograms;