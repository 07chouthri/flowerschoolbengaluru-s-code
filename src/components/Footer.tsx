import Logo from "@/assets/Flower_School_Logo_1757484169081.png";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Facebook, Instagram, Twitter, Linkedin, Mail, Phone, MapPin, Heart } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import api from '@/lib/api';


const Footer = () => {
  const [email, setEmail] = useState("");
  const [isSubscribing, setIsSubscribing] = useState(false);

  const handleSubscribe = async () => {
    if (!email.trim()) {
      toast.error("Please enter your email address");
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      toast.error("Please enter a valid email address");
      return;
    }

    setIsSubscribing(true);
    try {
      await api.post('/api/landing/email', { email });
      toast.success("Successfully subscribed to our newsletter!");
      setEmail("");
    } catch (error) {
      console.error("Subscription error:", error);
      toast.error("Failed to subscribe. Please try again.");
    } finally {
      setIsSubscribing(false);
    }
  };
  const quickLinks = [
    { name: "Home", href: "/" },
    { name: "Classes", href: "/classes" },
    { name: "About Us", href: "/about" },
    { name: "Contact", href: "/contact" },
  ];

  const socialLinks = [
    { icon: Instagram, href: "https://www.instagram.com/theflowerschoolbengaluru?igsh=ZGUzMzM3NWJiOQ==", label: "Instagram" },
    { icon: Twitter, href: "https://x.com/flowerschoolblr?s=21", label: "Twitter" },
    { icon: Facebook, href: "https://www.facebook.com/share/1CXNE2aonp/", label: "Facebook" },
    { icon: Linkedin, href: "https://www.linkedin.com/company/theflowerschoolbengaluru/", label: "LinkedIn" },
  ];

  return (
    <footer className="bg-gradient-to-br from-gray-50 to-white border-t border-gray-200">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main Footer Content */}
        <div className="py-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">

          {/* Brand Section */}
          <div className="lg:col-span-1">
            <div className="mb-4 flex items-center gap-3">
              <img
                src={Logo}
                alt="Flower School Logo"
                className="h-16 w-auto object-contain"
              />
              <span className="text-2xl font-bold text-gray-900">
                The Flower School Bengaluru
              </span>
            </div>

            <p className="text-gray-600 mb-6 leading-relaxed">
              Creating beautiful moments with the art of flowers. From professional floristry courses
              to creative workshops, we bring the beauty of nature into your life.
            </p>

            <div className="flex space-x-4">
              {socialLinks.map((social) => (
                <Button
                  key={social.label}
                  variant="outline"
                  size="icon"
                  className="border-gray-300 hover:bg-pink-600 hover:text-white hover:border-pink-600 transition-colors"
                  asChild
                >
                  <a href={social.href} aria-label={social.label} target="_blank" rel="noopener noreferrer">
                    <social.icon className="h-4 w-4" />
                  </a>
                </Button>
              ))}
            </div>
          </div>
          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-semibold text-gray-900 mb-6">Quick Links</h4>
            <ul className="space-y-3">
              {quickLinks.map((link) => (
                <li key={link.name}>
                  <a
                    href={link.href}
                    className="text-gray-600 hover:text-pink-600 transition-colors block py-1"
                  >
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Information */}
          <div>
            <h4 className="text-lg font-semibold text-gray-900 mb-6">Contact Info</h4>
            <div className="space-y-4 mb-6">
              <div className="flex items-center text-gray-600">
                <Phone className="h-4 w-4 mr-3 text-pink-600" />
                <span>+91 99728 03847</span>
              </div>
              <div className="flex items-center text-gray-600">
                <Mail className="h-4 w-4 mr-3 text-pink-600" />
                <span>info@flowerschoolbengaluru.com</span>
              </div>
              <div className="flex items-start text-gray-600">
                <MapPin className="h-4 w-4 mr-3 text-pink-600 mt-1 flex-shrink-0" />
                <span className="text-sm">
                  SIPANI EAST AVENUE, 6th Block, Koramangala, Bengaluru, Karnataka 560095
                </span>
              </div>
            </div>
          </div>

          {/* Newsletter Signup */}
          <div>
            <h4 className="text-lg font-semibold text-gray-900 mb-6">Stay Updated</h4>
            <p className="text-gray-600 mb-4 text-sm">
              Subscribe to get updates on new courses, workshops, and floral tips.
            </p>
            <div className="flex space-x-2">
              <Input
                type="email"
                placeholder="Your email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="border-gray-300 focus:border-pink-600"
                disabled={isSubscribing}
              />
              <Button
                size="sm"
                className="bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-700 hover:to-purple-700 text-white"
                onClick={handleSubscribe}
                disabled={isSubscribing}
              >
                {isSubscribing ? "Subscribing..." : "Subscribe"}
              </Button>
            </div>
          </div>
        </div>
        {/* Bottom Footer */}
        <div className="py-8 border-t border-gray-200">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <div className="text-gray-600 text-sm">
              © 2024 Flower School Bengaluru. All rights reserved.
            </div>
            <div className="flex items-center space-x-4 text-sm">
              <a href="/privacy" className="text-gray-600 hover:text-pink-600 transition-colors">
                Privacy Policy
              </a>
              <a href="/terms" className="text-gray-600 hover:text-pink-600 transition-colors">
                Terms of Service
              </a>
              <div className="flex items-center text-gray-600">
                Made with <Heart className="h-4 w-4 mx-1 text-pink-600" /> for flower lovers
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
