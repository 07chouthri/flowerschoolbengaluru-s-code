import { useState, useRef, useEffect } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import SEO from "@/components/SEO";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MapPin, Phone, Mail, Clock, MessageCircle, Instagram, Facebook, Twitter, ExternalLink, PhoneCall } from "lucide-react";
import ContactBg from "@/assets/Contactbg.jpg";
import api from '@/lib/api';

// Animation hook
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
      className={`transition-all duration-1000 ease-out transform ${isInView
          ? "opacity-100 translate-y-0 scale-100"
          : "opacity-0 translate-y-8 scale-95"
        } ${className}`}
    >
      {children}
    </div>
  );
};

const Contact = () => {
  const [showAdmin, setShowAdmin] = useState(false);
  const [officeTimings, setOfficeTimings] = useState([]);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: ""
  });

  useEffect(() => {
    fetchOfficeTimings();
  }, []);

  const fetchOfficeTimings = async () => {
    try {
      const response = await api.get('/api/office-timing');
      if (response.data.success) {
        setOfficeTimings(response.data.data);
      }
    } catch (error) {
      console.error('Error fetching office timings:', error);
    }
  };

  const formatTime = (timeString: string) => {
    if (!timeString) return '';
    const [hours, minutes] = timeString.split(':');
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const displayHour = hour % 12 || 12;
    return `${displayHour}:${minutes} ${ampm}`;
  };

  const handleNavigation = (section: string) => {
    // Handle navigation within contact page if needed
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission here
    console.log("Form submitted:", formData);
    // Reset form
    setFormData({
      name: "",
      email: "",
      phone: "",
      subject: "",
      message: ""
    });
  };

  const contactInfo = [
    {
      icon: Phone,
      title: "Call Us",
      details: [
        "Main: +91 99728 03847",
        
       
      ]
    },
    {
      icon: Mail,
      title: "Email Us",
      details: [
        "info@flowerschoolbengaluru.com",
        
      ]
    },
    {
      icon: Clock,
      title: "Business Hours",
      details: officeTimings.length > 0
        ? officeTimings.map(timing =>
          timing.is_holiday
            ? `${timing.office_day}: Closed`
            : `${timing.office_day}: ${formatTime(timing.open_time)} - ${formatTime(timing.close_time)}`
        )
        : [
          "Mon-Sat: 9:00 AM - 8:00 PM",
          "Sunday: 10:00 AM - 6:00 PM"
        ]
    }
  ];

  const socialLinks = [
    { icon: Instagram, href: "#", label: "Instagram" },
    { icon: Facebook, href: "#", label: "Facebook" },
    { icon: Twitter, href: "#", label: "Twitter" },
  ];

  const quickLinks = [
    { name: "Home", href: "/" },
    { name: "Classes", href: "/classes" },
    { name: "About Us", href: "/about" },
    { name: "Gallery", href: "/gallery" },
    { name: "Contact", href: "/contact" }
  ];

  const openWhatsApp = () => {
    window.open('https://wa.me/919972803847?text=Hello! I would like to place a flower order.', '_blank');
  };

  const makeCall = () => {
    window.open('tel:+919972803847', '_self');
  };

  const openMapsInNewTab = () => {
    window.open('https://www.google.com/maps/place/SIPANI+EAST+AVENUE,+6th+Block,+Koramangala,+Bengaluru,+Karnataka+560095', '_blank');
  };

  return (
    <div className="min-h-screen bg-background">
      <Header onAdminClick={() => setShowAdmin(true)} onNavigate={handleNavigation} />

      <main className="pt-1">
        {/* Page Header with Background Image */}
        <AnimatedSection delay={100}>
          <section
            className="relative h-[200px] md:h-[500px] px-4 sm:px-6"
            style={{
              backgroundImage: `url(${ContactBg})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              // backgroundRepeat: 'no-repeat',
              borderRadius: '20px',
            }}
          >
            {/* Overlay for better text readability */}
            <div className="absolute inset-0 bg-black/10"></div>
            <div className="container mx-auto relative z-10 flex flex-col items-center justify-center h-full text-center">
              <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold leading-tight mb-4">
                <span className="bg-gradient-to-r from-pink-600 to-rose-600 bg-clip-text text-transparent">
                  Get in Touch with us
                </span>
              </h1>
              <p className="text-lg sm:text-xl md:text-2xl text-gray-700 max-w-2xl mx-auto leading-tight mt-2">
                Ready to order flowers or join our classes? We're here to help!
              </p>
            </div>


          </section>
        </AnimatedSection>

        {/* Contact Information Cards */}
        <AnimatedSection delay={200}>
          <section className="py-16 md:py-20 px-4 sm:px-6 bg-white">
            <div className="container mx-auto">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-16 md:mb-20">
                {contactInfo.map((info, index) => (
                  <Card key={index} className="text-center hover:shadow-xl transition-all duration-500 ease-out hover:scale-105 border-0 bg-gradient-to-br from-pink-50 to-rose-50">
                    <CardContent className="p-8">
                      <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-pink-500 to-rose-500 rounded-full mb-6 mx-auto">
                        <info.icon className="h-8 w-8 text-white" />
                      </div>
                      <h3 className="font-bold text-xl mb-4">{info.title}</h3>
                      <div className="space-y-2 text-gray-700 font-sans">
                        {info.details.map((detail, idx) => (
                          <p key={idx} className="break-words text-base">{detail}</p>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {/* Contact Section Layout */}
              <div className="grid lg:grid-cols-2 gap-12 md:gap-16">
                {/* Contact Info - Left Side */}
                <div className="space-y-8">
                  <div>
                    <h3 className="text-2xl sm:text-3xl font-bold mb-6">Contact Information</h3>
                    <div className="space-y-4">
                      <div className="flex items-start space-x-4">
                        <MapPin className="w-6 h-6 text-pink-600 mt-1 flex-shrink-0" />
                        <div>
                          <div className="font-semibold text-lg">Address</div>
                          <div className="text-gray-700 font-sans text-base">
                            #440, 18th Main Road, 6th Cross, 6th block Koramangala, koramangala, Bengaluru, Karnataka – 560095
                          </div>
                        </div>
                      </div>
                      <div className="flex items-start space-x-4">
                        <Phone className="w-6 h-6 text-pink-600 mt-1 flex-shrink-0" />
                        <div>
                          <div className="font-semibold text-lg">Phone</div>
                          <div className="text-gray-700 font-sans text-base">+91 99728 03847</div>
                        </div>
                      </div>
                      <div className="flex items-start space-x-4">
                        <Mail className="w-6 h-6 text-pink-600 mt-1 flex-shrink-0" />
                        <div>
                          <div className="font-semibold text-lg">Email</div>
                          <div className="text-gray-700 font-sans text-base break-words">
                            info@flowerschoolbengaluru.com
                          </div>
                        </div>
                      </div>
                      <div className="flex items-start space-x-4">
                        <Clock className="w-6 h-6 text-pink-600 mt-1 flex-shrink-0" />
                        <div>
                          <div className="font-semibold text-lg">Business Hours</div>
                          <div className="text-gray-700 font-sans text-base space-y-1">
                            {officeTimings.length > 0 ? (
                              officeTimings.map((timing, idx) => (
                                <div key={idx} className={timing.is_holiday ? "text-red-600" : ""}>
                                  {timing.is_holiday
                                    ? `${timing.office_day}: Closed`
                                    : `${timing.office_day}: ${formatTime(timing.open_time)} - ${formatTime(timing.close_time)}`
                                  }
                                </div>
                              ))
                            ) : (
                              <>
                                <div>Mon-Sat: 9:00 AM - 8:00 PM</div>
                                <div>Sunday: 10:00 AM - 6:00 PM</div>
                              </>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Quick Action Buttons */}
                  <div className="space-y-4">
                    <h4 className="text-xl font-semibold">Quick Actions</h4>
                    <div className="flex flex-col sm:flex-row gap-4">
                      <Button
                        className="bg-gradient-to-r from-pink-500 to-rose-500 text-white font-sans text-lg py-6 hover:from-pink-600 hover:to-rose-600 transition-all duration-300"
                        onClick={openWhatsApp}
                        size="lg"
                      >
                        <MessageCircle className="w-5 h-5 mr-3" />
                        WhatsApp Order
                      </Button>
                      <Button
                        onClick={makeCall}
                        size="lg"
                        className="font-sans text-lg py-6 bg-white text-pink-600 border-2 border-pink-600 hover:bg-pink-600 hover:text-white transition-all duration-300"
                      >
                        <PhoneCall className="w-5 h-5 mr-3" />
                        Call Now
                      </Button>
                    </div>
                  </div>
                </div>

                {/* Map - Right Side */}
                <div className="space-y-8">
                  {/* Google Maps Integration with Overlay */}
                  <div className="relative rounded-2xl overflow-hidden h-80 md:h-96 shadow-2xl">
                    <iframe
                      src="https://www.google.com/maps/embed?pb=!1m17!1m12!1m3!1d2855.610430364254!2d77.62079447507593!3d12.94!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m2!1m1!2zMTLCsDU2JzI0LjAiTiA3N8KwMzcnMjIuOCJF!5e0!3m2!1sen!2sin!4v1710153926784!5m2!1sen!2sin"
                      width="100%"
                      height="100%"
                      style={{ border: 0 }}
                      allowFullScreen
                      loading="lazy"
                      referrerPolicy="no-referrer-when-downgrade"
                      title="Flower School Bengaluru Location"
                      className="absolute inset-0"
                    ></iframe>

                    {/* Map Overlay Button */}
                    <div className="absolute bottom-6 right-6">
                      <Button
                        onClick={openMapsInNewTab}
                        size="lg"
                        className="bg-white/90 backdrop-blur-sm hover:bg-white font-sans text-base px-6 py-3"
                      >
                        <ExternalLink className="w-5 h-5 mr-2" />
                        Open Map
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </AnimatedSection>
      </main>

      <Footer />
    </div>
  );
};

export default Contact;