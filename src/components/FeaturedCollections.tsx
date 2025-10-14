import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowRight, Heart, Sparkles, Eye } from "lucide-react";
import { useState, useEffect, useRef } from "react";

// Using your provided collection images
import Collection1 from "@/assets/Collection1.jpg";
import Collection2 from "@/assets/Collection2.jpg";
import Collection3 from "@/assets/Collection3.jpg";
import Collection4 from "@/assets/Collection4.jpg";
import Collection5 from "@/assets/Collection5.jpg";
import Collection6 from "@/assets/Collection6.jpg";

const FeaturedCollections = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [hoveredCard, setHoveredCard] = useState<number | null>(null);
  const [likedCards, setLikedCards] = useState<number[]>([]);
  const sectionRef = useRef<HTMLElement>(null);

  const collections = [
    {
      title: "Spring Blooms",
      description: "Fresh seasonal arrangements",
      image: Collection1,
      content: "Celebrate the vibrant energy of spring with our handpicked seasonal blooms. Perfect for brightening any space and mood. Learn about the symbolism of each flower and how to create your own spring-inspired arrangements with our expert-led classes.",
      list: [
        "Locally sourced spring flowers",
        "Eco-friendly packaging",
        "Arrangements for home and office",
        "Tips for keeping your blooms fresh",
        "Workshops on spring floral design",
        "Guided flower selection for beginners",
        "Seasonal flower care guides",
        "Access to exclusive spring events",
        "Meet-and-greet with local growers",
        "Spring flower photography tips"
      ]
    },
    {
      title: "Romantic Bouquets",
      description: "Perfect for special moments",
      image: Collection2,
      content: "Express your love and affection with our romantic bouquets, crafted to make every occasion unforgettable. Discover the language of flowers and how to personalize your bouquet for anniversaries, proposals, or just because.",
      list: [
        "Classic roses and exotic blooms",
        "Custom love notes included",
        "Same-day delivery for surprises",
        "Anniversary and proposal specials",
        "Couples' bouquet-making classes",
        "Heart-shaped arrangement workshops",
        "Flower meaning and symbolism sessions",
        "Gift wrapping and presentation tips",
        "Private romantic event decor",
        "Personalized color palette advice"
      ]
    },
    {
      title: "Elegant Centerpieces",
      description: "For sophisticated events",
      image: Collection3,
      content: "Add a touch of elegance to your gatherings with our stunning centerpieces, designed for weddings, galas, and more. Our team will help you match your event theme and create a lasting impression for your guests.",
      list: [
        "Custom event consultations",
        "Premium vases and vessels",
        "On-site setup and styling",
        "Seasonal centerpiece workshops",
        "Rental options for large events",
        "Table styling and decor tips",
        "Floral color theory guidance",
        "Event mood board creation",
        "VIP event floral packages",
        "Post-event flower care and donation"
      ]
    },
    {
      title: "Tropical Paradise",
      description: "Exotic floral arrangements",
      image: Collection4,
      content: "Bring the tropics home with our lush, exotic arrangements featuring rare and vibrant flowers. Learn how to care for tropical blooms and incorporate them into your home or event decor.",
      list: [
        "Imported tropical flowers",
        "Bold, colorful designs",
        "Care instructions for exotics",
        "Tropical bouquet classes",
        "Perfect for summer parties",
        "DIY tropical centerpiece kits",
        "Tropical flower identification guides",
        "Workshops on color blending",
        "Tips for long-lasting tropical displays",
        "Access to rare and unique species"
      ]
    },
    {
      title: "Wedding Collection",
      description: "Bridal bouquets & decor",
      image: Collection5,
      content: "Make your big day magical with our bespoke wedding bouquets and floral decor, tailored to your vision. We offer full-service planning, from concept to installation, to ensure your wedding is truly unforgettable.",
      list: [
        "Bridal and bridesmaid bouquets",
        "Boutonnieres and corsages",
        "Venue floral installations",
        "Pre-wedding floral consultations",
        "Workshops for DIY brides",
        "Floral arch and aisle design",
        "Flower girl basket workshops",
        "Reception table centerpiece ideas",
        "Keepsake bouquet preservation",
        "On-site wedding day support"
      ]
    },
    {
      title: "Modern Minimalist",
      description: "Clean and contemporary designs",
      image: Collection6,
      content: "Discover the beauty of simplicity with our modern minimalist arrangements, perfect for stylish spaces. Explore the art of less-is-more with our curated selection and design classes.",
      list: [
        "Sleek, geometric vases",
        "Monochrome and pastel palettes",
        "Low-maintenance plant options",
        "Minimalist floral design classes",
        "Perfect for offices and studios",
        "Zen-inspired arrangement workshops",
        "Tips for styling with negative space",
        "Modern plant care guides",
        "Exclusive minimalist decor pieces",
        "Consultations for interior designers"
      ]
    }
  ];

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.1 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  const handleLike = (index: number, e: React.MouseEvent) => {
    e.stopPropagation();
    setLikedCards(prev => 
      prev.includes(index) 
        ? prev.filter(i => i !== index)
        : [...prev, index]
    );
  };

  const handleCardClick = (title: string) => {
    console.log(`Viewing ${title} collection`);
  };

  return (
    <section ref={sectionRef} className="py-8 md:py-16 lg:py-20 relative overflow-hidden">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Animated Header */}
        <div className={`text-center mb-10 md:mb-14 transform transition-all duration-1000 ${
          isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
        }`}>
          <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-2 md:mb-4 font-playfair">
            <span className="bg-gradient-to-r from-pink-600 to-rose-600 bg-clip-text text-transparent">
              Featured Collections
            </span>
          </h2>
          <p className="text-lg sm:text-xl md:text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed px-4 font-sans">
            Discover our carefully curated selection of premium flowers and arrangements
          </p>
        </div>

        {/* Stacked Cards, alternating image/content sides */}
        <div className="flex flex-col gap-12">
          {collections.map((collection, index) => {
            const isImageLeft = index % 2 === 0;
            return (
              <div
                key={collection.title}
                className={`w-full flex flex-col md:flex-row items-stretch md:items-center ${isImageLeft ? '' : 'md:flex-row-reverse'} transition-all duration-700
                  ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-16'}
                `}
                style={{ transitionDelay: `${index * 120}ms`, minHeight: '350px' }}
                onMouseEnter={() => setHoveredCard(index)}
                onMouseLeave={() => setHoveredCard(null)}
              >
                {/* Image Full Size */}
                <div className="w-full md:w-1/2 min-h-[400px] md:min-h-[600px] flex items-stretch p-4 md:p-6">
                  <img
                    src={collection.image}
                    alt={collection.title}
                    className="w-full h-full object-cover transition-transform duration-500 shadow-none rounded-2xl"
                    style={{ minHeight: '400px', minWidth: '100%', borderRadius: '1rem', height: '100%', maxHeight: 'none' }}
                  />
                </div>
                {/* Content */}
                <div className="w-full md:w-1/2 flex flex-col justify-center px-0 md:px-10 py-8 md:py-0 text-left">
                  <div className="flex items-center mb-2">
                    <Sparkles className="text-pink-400 w-7 h-7 mr-2 animate-spin-slow" />
                    <h3 className="text-2xl font-bold font-playfair text-pink-700 animate-fade-in-up drop-shadow-sm">
                      {collection.title}
                    </h3>
                  </div>
                  <p className="text-lg md:text-xl text-black font-semibold mb-4 animate-fade-in-up delay-100 font-sans">
                    {collection.description}
                  </p>
                  {/* Flower School related content - unique per collection */}
                  <div className="mb-4 animate-fade-in-up delay-200">
                    <p className="text-base text-pink-700 font-bold mb-2">Why choose this collection at Flower School?</p>
                    <p className="text-base text-black font-semibold mb-2">{collection.content}</p>
                    <ul className="list-disc list-inside text-base text-black mt-1 space-y-1">
                      {collection.list.map((item, idx) => (
                        <li key={idx}>{item}</li>
                      ))}
                    </ul>
                  </div>
                  {/* Removed Heart and Eye icons as requested */}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default FeaturedCollections;