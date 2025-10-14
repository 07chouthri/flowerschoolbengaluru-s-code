import { useState } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import FeaturedCollections from "@/components/FeaturedCollections";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ShoppingCart, Heart, Star } from "lucide-react";

const Shop = () => {
  const [showAdmin, setShowAdmin] = useState(false);

  const handleNavigation = (section: string) => {
    // Handle navigation within shop page if needed
  };

  const products = [
    {
      id: 1,
      name: "Red Rose Bouquet",
      price: "$29.99",
      originalPrice: "$39.99",
      image: "/placeholder.svg",
      rating: 4.8,
      reviews: 124,
      discount: "25%",
      category: "Roses"
    },
    {
      id: 2,
      name: "White Lily Arrangement",
      price: "$34.99",
      originalPrice: "$44.99",
      image: "/placeholder.svg",
      rating: 4.9,
      reviews: 89,
      discount: "22%",
      category: "Lilies"
    },
    {
      id: 3,
      name: "Purple Orchid Set",
      price: "$59.99",
      originalPrice: "$79.99",
      image: "/placeholder.svg",
      rating: 4.7,
      reviews: 156,
      discount: "25%",
      category: "Orchids"
    },
    {
      id: 4,
      name: "Mixed Seasonal Bouquet",
      price: "$45.99",
      originalPrice: "$59.99",
      image: "/placeholder.svg",
      rating: 4.6,
      reviews: 203,
      discount: "23%",
      category: "Bouquets"
    },
    {
      id: 5,
      name: "Sunflower Delight",
      price: "$24.99",
      originalPrice: "$32.99",
      image: "/placeholder.svg",
      rating: 4.5,
      reviews: 87,
      discount: "24%",
      category: "Seasonal"
    },
    {
      id: 6,
      name: "Elegant Tulip Mix",
      price: "$39.99",
      originalPrice: "$49.99",
      image: "/placeholder.svg",
      rating: 4.8,
      reviews: 112,
      discount: "20%",
      category: "Tulips"
    }
  ];

  const categories = ["All", "Roses", "Lilies", "Orchids", "Bouquets", "Seasonal", "Tulips"];
  const [selectedCategory, setSelectedCategory] = useState("All");

  const filteredProducts = selectedCategory === "All" 
    ? products 
    : products.filter(product => product.category === selectedCategory);

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-primary/5 to-accent/10">
      <Header onAdminClick={() => setShowAdmin(true)} onNavigate={handleNavigation} />
      
      <main className="pt-20">
        {/* Page Header */}
        <section className="bg-gradient-hero py-20 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-primary/20 via-transparent to-accent/20" />
          <div className="container mx-auto px-4 relative z-10">
            <div className="text-center animate-fade-in">
              <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 drop-shadow-lg">
                Flower Shop
              </h1>
              <p className="text-xl md:text-2xl text-white/90 max-w-3xl mx-auto leading-relaxed">
                Discover our beautiful collection of fresh flowers, arrangements, and bouquets for every occasion
              </p>
              <div className="mt-8">
                <Button size="lg" className="text-lg px-8 py-4 rounded-full hover-scale">
                  Shop Now
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* Category Filter */}
        <section className="py-12 bg-card/50 backdrop-blur border-b border-border/20">
          <div className="container mx-auto px-4">
            <h2 className="text-2xl font-semibold text-center mb-8 text-foreground">
              Shop by Category
            </h2>
            <div className="flex flex-wrap gap-3 justify-center">
              {categories.map((category) => (
                <Button
                  key={category}
                  variant={selectedCategory === category ? "default" : "outline"}
                  onClick={() => setSelectedCategory(category)}
                  className="rounded-full px-6 py-3 text-base hover-scale transition-all duration-300"
                >
                  {category}
                </Button>
              ))}
            </div>
          </div>
        </section>

        {/* Products Grid */}
        <section className="py-20 bg-gradient-to-b from-background to-card/30">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-4xl font-bold text-foreground mb-4">
                {selectedCategory === "All" ? "All Products" : selectedCategory}
              </h2>
              <p className="text-muted-foreground">
                {filteredProducts.length} beautiful {selectedCategory.toLowerCase()} available
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredProducts.map((product, index) => (
                <Card 
                  key={product.id} 
                  className="group hover:shadow-flower transition-all duration-500 overflow-hidden bg-card/80 backdrop-blur hover:-translate-y-2 animate-fade-in"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <div className="relative">
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-full h-64 object-cover group-hover:scale-110 transition-transform duration-700"
                    />
                    {product.discount && (
                      <Badge className="absolute top-4 left-4 bg-gradient-to-r from-red-500 to-pink-500 text-white rounded-full px-3 py-1">
                        {product.discount} OFF
                      </Badge>
                    )}
                    <Button
                      size="icon"
                      variant="outline"
                      className="absolute top-4 right-4 rounded-full bg-white/90 backdrop-blur-sm hover:bg-white hover:text-red-500 transition-all duration-300"
                    >
                      <Heart className="h-4 w-4" />
                    </Button>
                    <div className="absolute inset-0 bg-gradient-primary opacity-0 group-hover:opacity-10 transition-opacity duration-300" />
                  </div>
                  
                  <CardContent className="p-6">
                    <div className="flex items-center gap-1 mb-3">
                      <div className="flex items-center">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`h-4 w-4 ${
                              i < Math.floor(product.rating)
                                ? "fill-yellow-400 text-yellow-400"
                                : "text-gray-300"
                            }`}
                          />
                        ))}
                      </div>
                      <span className="text-sm text-muted-foreground font-medium">
                        {product.rating} ({product.reviews} reviews)
                      </span>
                    </div>
                    
                    <h3 className="font-bold text-xl mb-3 text-foreground group-hover:text-primary transition-colors duration-300">
                      {product.name}
                    </h3>
                    
                    <div className="flex items-center gap-3 mb-6">
                      <span className="text-3xl font-bold text-primary">{product.price}</span>
                      {product.originalPrice && (
                        <span className="text-base text-muted-foreground line-through">
                          {product.originalPrice}
                        </span>
                      )}
                    </div>
                    
                    <Button className="w-full text-base py-3 hover-scale">
                      <ShoppingCart className="mr-2 h-5 w-5" />
                      Add to Cart
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

       
      </main>

      <Footer />
    </div>
  );
};

export default Shop;