import React from 'react';
import { Calendar, Users, Clock, Phone } from 'lucide-react';
import Eventvenue from '@/assets/EventVenue.jpg';
import { Link } from 'react-router-dom';
 
const EventVenue = () => {
  const pricingData = [
    { day: "Weekdays", time: "10:00 AM – 3:00 PM", price: "₹25,000" },
    { day: "Weekdays", time: "5:00 PM – 11:00 PM", price: "₹30,000" },
    { day: "Weekends", time: "10:00 AM – 3:00 PM", price: "₹30,000" },
    { day: "Weekends", time: "5:00 PM – 12:00 AM", price: "₹35,000" }
  ];
 
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
 
  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-6xl mx-auto">
       
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold bg-gradient-to-r from-pink-600 to-rose-600 bg-clip-text text-transparent mb-4">
            Event Venue
          </h1>
          <p className="text-lg text-gray-600">
            A beautiful space for your special occasions
          </p>
        </div>
 
        {/* Main Image and Description */}
        <div className="p-8 mb-12">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
            <div>
              <img
                src={Eventvenue}
                alt="Event Venue"
                className="w-full rounded-lg"
              />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-800 mb-4">
                Perfect Space for Every Celebration
              </h2>
              <p className="text-gray-600 mb-6 leading-relaxed">
                Our 1400 sq. ft. event hall features a stunning cherry blossom tree
                centerpiece and provides the perfect setting for your special events.
                From corporate meetings to birthday celebrations, our venue offers
                elegance and functionality in one beautiful space.
              </p>
              <Link
                to="/contact"
                className="mx-[150px] inline-flex items-center bg-pink-500 text-white px-6 py-3 rounded-lg hover:bg-pink-600 transition-colors"
              >
                <Phone className="w-4 h-4 mr-2" />
                Book Now
              </Link>
            </div>
          </div>
        </div>
 
        {/* Quick Info */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <div className="rounded-lg p-6 text-center shadow-md">
            <Users className="w-8 h-8 text-pink-500 mx-auto mb-3" />
            <h3 className="font-semibold text-gray-800">1400 sq. ft.</h3>
            <p className="text-gray-600 text-sm">Spacious Hall</p>
          </div>
          <div className="bg-white rounded-lg p-6 text-center shadow-md">
            <Calendar className="w-8 h-8 text-pink-500 mx-auto mb-3" />
            <h3 className="font-semibold text-gray-800">All Events</h3>
            <p className="text-gray-600 text-sm">Any Occasion</p>
          </div>
          <div className="bg-white rounded-lg p-6 text-center shadow-md">
            <Clock className="w-8 h-8 text-pink-500 mx-auto mb-3" />
            <h3 className="font-semibold text-gray-800">Flexible</h3>
            <p className="text-gray-600 text-sm">Timing Options</p>
          </div>
        </div>
 
        {/* Features and Pricing */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
         
          {/* Venue Features */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-xl font-bold text-gray-800 mb-6">What's Included</h3>
            <ul className="space-y-3">
              {highlights.map((highlight, index) => (
                <li key={index} className="flex items-center">
                  <div className="w-2 h-2 bg-pink-500 rounded-full mr-3" />
                  <span className="text-gray-700">{highlight}</span>
                </li>
              ))}
            </ul>
           
            <h3 className="text-xl font-bold text-gray-800 mt-8 mb-4">Perfect For</h3>
            <div className="grid grid-cols-2 gap-2">
              {idealFor.map((item, index) => (
                <span key={index} className="text-sm text-gray-600 bg-gray-100 px-3 py-1 rounded">
                  {item}
                </span>
              ))}
            </div>
          </div>
 
          {/* Pricing */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-xl font-bold text-gray-800 mb-6">Pricing</h3>
            <div className="space-y-4">
              {pricingData.map((item, index) => (
                <div key={index} className="flex justify-between items-center p-4 bg-gray-50 rounded-lg">
                  <div>
                    <div className="font-semibold text-gray-800">{item.day}</div>
                    <div className="text-sm text-gray-600">{item.time}</div>
                  </div>
                  <div className="text-xl font-bold text-pink-600">
                    {item.price}
                  </div>
                </div>
              ))}
            </div>
           
            <div className="mt-6 p-4 bg-pink-50 rounded-lg">
              <p className="text-sm text-gray-700">
                <strong>Note:</strong> Decorations, flowers, and catering are available at additional cost.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
 
export default EventVenue;
 