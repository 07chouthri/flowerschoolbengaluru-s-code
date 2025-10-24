import { Button } from "@/components/ui/button";
import { ArrowLeft, Truck, Ban, Clock, MapPin, Phone, Mail, Shield, Package, AlertCircle } from "lucide-react";

import { useNavigate } from "react-router-dom";
import Footer from "./Footer";

const TermsService = () => {
  const navigate = useNavigate();

  const deliveryTerms = [
    {
      icon: MapPin,
      title: "1. Delivery Coverage",
      content: "Flower School Bengaluru & Bouquet Bar currently offers delivery services available across Bangalore. Deliveries outside these areas may be accommodated upon request and may be subject to additional delivery fees."
    },
    {
      icon: Clock,
      title: "2. Delivery Schedule",
      content: "Standard delivery hours are from 9:00 AM to 6:00 PM, Monday through Sunday.",
      list: [
        "Same-day delivery is available for orders placed before 3:00 PM.",
        "While every effort will be made to deliver within the requested time slot, specific delivery times cannot be guaranteed due to variable traffic, weather, or operational conditions."
      ]
    },
    {
      icon: Truck,
      title: "3. Delivery Fees",
      content: "Delivery charges are determined based on the delivery location and type of service (standard, express, or midnight)."
    },
    {
      icon: Shield,
      title: "4. Recipient Availability",
      content: "It is the customer's responsibility to ensure that the recipient is available to accept the delivery at the provided address. If the recipient is unavailable at the time of delivery:",
      list: [
        "The delivery partner may contact the recipient or leave the order with a neighbour, security guard, or reception (if permitted).",
        "If delivery cannot be completed, a re-delivery fee may apply."
      ]
    },
    {
      icon: AlertCircle,
      title: "5. Incorrect or Incomplete Address",
      content: "Flower School Bengaluru & Bouquet Bar is not responsible for non-delivery or delays resulting from incorrect, incomplete, or insufficient delivery details provided by the customer. Please verify the address carefully before placing your order."
    },
    {
      icon: Package,
      title: "6. Substitution Policy",
      content: "Due to seasonal and regional availability, certain flowers, wrapping materials, or containers may need to be substituted with similar items of equal or higher value. Such substitutions are made while maintaining the overall design, theme, and value of the arrangement."
    },
    {
      icon: Clock,
      title: "7. Delivery Delays",
      content: "In the event of unforeseen circumstances such as extreme weather conditions, traffic disruptions, strikes, or public holidays, deliveries may be delayed. Flower School Bengaluru & Bouquet Bar will make every reasonable effort to notify customers and complete delivery as soon as possible."
    },
    {
      icon: Ban,
      title: "8. Order Modification and Cancellation",
      list: [
        "Same-Day and Next-Day Deliveries: Cancellations or refunds are not permitted for same-day or next-day deliveries, as order processing begins immediately after confirmation.",
        "Advance Orders (Beyond Next-Day): Cancellations are allowed within 24 hours of placing the order. Any requests made after this period will not be accepted.",
        "Delivery Fees: In the event of a cancellation after dispatch to the delivery partner, delivery charges are non-refundable.",
        "Once an order is prepared, dispatched, or delivered, it cannot be cancelled or refunded."
      ]
    },
    {
      icon: Shield,
      title: "9. Non-Delivery Due to Recipient Refusal",
      content: "If the recipient refuses to accept the delivery for any reason, the order will be considered delivered and no refund will be issued."
    },
    {
      icon: Package,
      title: "10. Proof of Delivery",
      content: "Proof of delivery, such as a delivery photo, signature, or confirmation message, may be provided upon request for verification purposes."
    },
    {
      icon: Truck,
      title: "11. Third-Party Delivery Policy",
      list: [
        "Once an order is handed over to a Delivery Partner, the responsibility for the safe and timely delivery of the product lies with them.",
        "We ensure all products leave our premises in perfect condition. However, we are not liable for any delay, damage, or loss occurring after handover to the Delivery Partner.",
        "Claims for damage or delay caused during transit should be raised directly with the Delivery Partner where applicable."
      ]
    }
  ];

  const refundPolicy = [
    {
      icon: Ban,
      title: "1. General Policy",
      content: "At Flower School Bengaluru & Bouquet Bar, every floral arrangement is carefully handcrafted using fresh, perishable blooms. Due to the nature of our products, all sales are final, and we maintain a strict no refund policy once an order has been placed."
    },
    {
      icon: Package,
      title: "2. Perishable Nature of Flowers",
      content: "Flowers are natural and perishable products, and their lifespan depends on various factors such as temperature, handling, and care. As such, we cannot offer refunds or returns once the order has been delivered."
    },
    {
      icon: Shield,
      title: "3. Order Accuracy and Quality",
      content: "We strive to ensure that every order matches the description and quality expected. However, minor variations in colour, shape, or size may occur due to seasonal and regional availability — these are not considered defects and do not qualify for a refund or replacement."
    },
    {
      icon: AlertCircle,
      title: "4. Incorrect or Incomplete Delivery Information",
      content: "Flower School Bengaluru & Bouquet Bar is not responsible for delays, failed deliveries, or incorrect items due to inaccurate or incomplete delivery details provided by the customer. In such cases, refunds will not be issued."
    },
    {
      icon: Shield,
      title: "5. Customer Responsibility",
      content: "It is the customer's responsibility to provide correct delivery details and ensure recipient availability. Once an order is confirmed and prepared, it cannot be cancelled, refunded, or modified."
    },
    {
      icon: Package,
      title: "6. Exceptional Cases",
      content: "While refunds are not provided, we value our customers and are committed to resolving genuine concerns. If there is a clear issue with the quality or delivery of your order, please contact us within 24 hours of delivery, along with supporting photos. At our discretion, a replacement or store credit may be offered as a goodwill gesture — this does not constitute a change to our no refund policy."
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-pink-50 py-8">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl">
        {/* Header Section */}
        <div className="text-center mb-12">
          <div className="flex justify-center mb-4">
            <div className="bg-gradient-to-r from-pink-600 to-pink-700 p-4 rounded-2xl shadow-lg">
              <Shield className="h-12 w-12 text-white" />
            </div>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4 bg-gradient-to-r from-pink-600 to-pink-700 bg-clip-text text-transparent">
            Terms & Services
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Understanding our delivery terms and refund policy helps ensure a smooth experience.
          </p>
        </div>

        {/* Back Button */}
        <div className="mb-8">
          <Button
            variant="outline"
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900 border-gray-300 hover:border-pink-600 transition-all duration-300"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Home
          </Button>
        </div>

        {/* Last Updated */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8 text-center">
          <p className="text-sm text-gray-600">
            <span className="font-semibold text-pink-600">Last Updated:</span> December 2024
          </p>
        </div>

        {/* Delivery Terms & Conditions Section */}
        <div className="mb-16">
          <div className="text-center mb-8">
            <div className="bg-gradient-to-r from-pink-600 to-pink-700 text-white p-6 rounded-2xl shadow-lg">
              <Truck className="h-12 w-12 mx-auto mb-4" />
              <h2 className="text-3xl font-bold mb-3">Delivery Terms & Conditions</h2>
              <p className="text-pink-100 opacity-90">
                Important information about our delivery services and policies
              </p>
            </div>
          </div>

          <div className="space-y-6">
            {deliveryTerms.map((term, index) => {
              const IconComponent = term.icon;
              return (
                <div 
                  key={index}
                  className="bg-white rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-all duration-300 overflow-hidden"
                >
                  <div className="p-6 md:p-8">
                    <div className="flex items-start gap-4">
                      {IconComponent && (
                        <div className="bg-pink-100 p-3 rounded-lg flex-shrink-0">
                          <IconComponent className="h-6 w-6 text-pink-600" />
                        </div>
                      )}
                      <div className="flex-1">
                        <h3 className="text-xl font-semibold text-gray-900 mb-3">
                          {term.title}
                        </h3>
                        
                        {term.content && (
                          <p className="text-gray-600 mb-4 leading-relaxed">
                            {term.content}
                          </p>
                        )}

                        {term.list && (
                          <ul className="space-y-2">
                            {term.list.map((item, itemIndex) => (
                              <li key={itemIndex} className="flex items-start gap-2 text-gray-600">
                                <span className="text-pink-600 mt-1">•</span>
                                <span>{item}</span>
                              </li>
                            ))}
                          </ul>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* No Refund Policy Section */}
        <div className="mb-16">
          <div className="text-center mb-8">
            <div className="bg-gradient-to-r from-pink-600 to-pink-700 text-white p-6 rounded-2xl shadow-lg">
              <Ban className="h-12 w-12 mx-auto mb-4" />
              <h2 className="text-3xl font-bold mb-3">No Refund Policy</h2>
              <p className="text-pink-100 opacity-90">
                Understanding our policy on returns and refunds
              </p>
            </div>
          </div>

          <div className="space-y-6">
            {refundPolicy.map((policy, index) => {
              const IconComponent = policy.icon;
              return (
                <div 
                  key={index}
                  className="bg-white rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-all duration-300 overflow-hidden"
                >
                  <div className="p-6 md:p-8">
                    <div className="flex items-start gap-4">
                      {IconComponent && (
                        <div className="bg-pink-100 p-3 rounded-lg flex-shrink-0">
                          <IconComponent className="h-6 w-6 text-pink-600" />
                        </div>
                      )}
                      <div className="flex-1">
                        <h3 className="text-xl font-semibold text-gray-900 mb-3">
                          {policy.title}
                        </h3>
                        
                        <p className="text-gray-600 mb-4 leading-relaxed">
                          {policy.content}
                        </p>

                        {policy.list && (
                          <ul className="space-y-2">
                            {policy.list.map((item, itemIndex) => (
                              <li key={itemIndex} className="flex items-start gap-2 text-gray-600">
                                <span className="text-pink-600 mt-1">•</span>
                                <span>{item}</span>
                              </li>
                            ))}
                          </ul>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Contact Section */}
        <div className="bg-gradient-to-r from-pink-600 to-pink-700 rounded-2xl shadow-lg p-8 md:p-10 text-white">
          <div className="text-center mb-6">
            <h2 className="text-2xl md:text-3xl font-bold mb-3">Contact Us</h2>
            <p className="text-pink-100 opacity-90">
              Have questions about our terms? We're here to help clarify.
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-6 text-center">
            <div className="flex flex-col items-center">
              <div className="bg-white bg-opacity-20 p-3 rounded-full mb-3">
                <Phone className="h-6 w-6" />
              </div>
              <p className="font-semibold">+91 99728 03847</p>
            </div>
            
            <div className="flex flex-col items-center">
              <div className="bg-white bg-opacity-20 p-3 rounded-full mb-3">
                <Mail className="h-6 w-6" />
              </div>
              <p className="font-semibold">info@flowerschoolbengaluru.com</p>
            </div>
            
            <div className="flex flex-col items-center">
              <div className="bg-white bg-opacity-20 p-3 rounded-full mb-3">
                <MapPin className="h-6 w-6" />
              </div>
              <p className="font-semibold text-sm">
                #440, 18th Main Rd, 6th Block<br />Koramangala, Bengaluru
              </p>
            </div>
          </div>
        </div>

        {/* Footer Note */}
        <div className="text-center mt-8">
          <p className="text-gray-500 text-sm">
            Thank you for choosing Flower School Bengaluru & Bouquet Bar
          </p>
        </div>
      </div>
      <Footer/>
    </div>
  );
};

export default TermsService;