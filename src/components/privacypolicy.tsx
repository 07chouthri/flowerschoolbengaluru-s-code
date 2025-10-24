import { Button } from "@/components/ui/button";
import { ArrowLeft, Shield, Lock, Eye, Mail, Phone, MapPin, Users, Cookie, Key, Link, RefreshCw } from "lucide-react";
import { useNavigate } from "react-router-dom";
import Footer from "./Footer";

const PrivacyPolicy = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-purple-50 py-8">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl">
        {/* Header Section */}
        <div className="text-center mb-12">
          <div className="flex justify-center mb-4">
            <div className="bg-gradient-to-r from-pink-600 to-purple-600 p-4 rounded-2xl shadow-lg">
              <Shield className="h-12 w-12 text-white" />
            </div>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4 bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent">
            Privacy Policy
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Your privacy is important to us. Learn how we protect and handle your personal information.
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

        {/* Privacy Policy Content */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
          {/* 1. Introduction */}
          <div className="mb-12">
            <div className="flex items-center gap-3 mb-6">
              <div className="bg-pink-100 p-2 rounded-lg">
                <Users className="h-6 w-6 text-pink-600" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900">1. Introduction</h2>
            </div>
            <div className="text-gray-600 space-y-4">
              <p>
                Welcome to Our Flower School Bengaluru & Bouquet Bar. We value your privacy and are committed to protecting your personal information. This Privacy Policy explains how we collect, use, and safeguard your information when you visit our website or interact with our flower shop and flower school services.
              </p>
              <p>
                By using our website, you agree to the terms of this Privacy Policy.
              </p>
            </div>
          </div>

          <div className="border-t border-gray-200 my-8"></div>

          {/* 2. Information We Collect */}
          <div className="mb-12">
            <div className="flex items-center gap-3 mb-6">
              <div className="bg-pink-100 p-2 rounded-lg">
                <Eye className="h-6 w-6 text-pink-600" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900">2. Information We Collect</h2>
            </div>
            <div className="text-gray-600 space-y-4">
              <p>We may collect the following types of information:</p>
              
              <div className="ml-4">
                <h3 className="font-semibold text-gray-900 mb-3">a. Personal Information:</h3>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>Name</li>
                  <li>Email address</li>
                  <li>Phone number</li>
                  <li>Billing and delivery address</li>
                  <li>Payment details (processed securely through third-party payment providers)</li>
                </ul>
              </div>

              <div className="ml-4">
                <h3 className="font-semibold text-gray-900 mb-3">b. Non-Personal Information:</h3>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>Browser type and version</li>
                  <li>IP address</li>
                  <li>Pages visited and time spent on our website</li>
                  <li>Device information and cookies (for analytics and site performance)</li>
                </ul>
              </div>
            </div>
          </div>

          <div className="border-t border-gray-200 my-8"></div>

          {/* 3. How We Use Your Information */}
          <div className="mb-12">
            <div className="flex items-center gap-3 mb-6">
              <div className="bg-pink-100 p-2 rounded-lg">
                <RefreshCw className="h-6 w-6 text-pink-600" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900">3. How We Use Your Information</h2>
            </div>
            <div className="text-gray-600">
              <p className="mb-4">We use your information to:</p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Process and deliver flower orders</li>
                <li>Enrol you in our flower school courses or workshops</li>
                <li>Communicate with you regarding your orders, classes, or inquiries</li>
                <li>Send updates, promotions, or newsletters (only with your consent)</li>
                <li>Improve our website, products, and services</li>
                <li>Comply with legal and regulatory requirements</li>
              </ul>
            </div>
          </div>

          <div className="border-t border-gray-200 my-8"></div>

          {/* 4. Sharing Your Information */}
          <div className="mb-12">
            <div className="flex items-center gap-3 mb-6">
              <div className="bg-pink-100 p-2 rounded-lg">
                <Users className="h-6 w-6 text-pink-600" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900">4. Sharing Your Information</h2>
            </div>
            <div className="text-gray-600 space-y-4">
              <p>We do not sell or rent your personal information. We may share limited information only with:</p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Delivery partners to complete your flower deliveries</li>
                <li>Payment processors for secure transaction handling</li>
                <li>Email or SMS service providers for communication purposes</li>
                <li>Legal authorities, if required by law</li>
              </ul>
              <p>All third-party partners are required to protect your information and use it only for the intended purpose.</p>
            </div>
          </div>

          <div className="border-t border-gray-200 my-8"></div>

          {/* 5. Cookies and Tracking Technologies */}
          <div className="mb-12">
            <div className="flex items-center gap-3 mb-6">
              <div className="bg-pink-100 p-2 rounded-lg">
                <Cookie className="h-6 w-6 text-pink-600" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900">5. Cookies and Tracking Technologies</h2>
            </div>
            <div className="text-gray-600">
              <p>Our website uses cookies to enhance your browsing experience and analyse site performance. You can choose to disable cookies through your browser settings, but some features of the website may not function properly without them.</p>
            </div>
          </div>

          <div className="border-t border-gray-200 my-8"></div>

          {/* 6. Data Security */}
          <div className="mb-12">
            <div className="flex items-center gap-3 mb-6">
              <div className="bg-pink-100 p-2 rounded-lg">
                <Lock className="h-6 w-6 text-pink-600" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900">6. Data Security</h2>
            </div>
            <div className="text-gray-600">
              <p>We use appropriate administrative, technical, and physical safeguards to protect your personal information from unauthorized access, misuse, or disclosure.</p>
            </div>
          </div>

          <div className="border-t border-gray-200 my-8"></div>

          {/* 7. Your Rights */}
          <div className="mb-12">
            <div className="flex items-center gap-3 mb-6">
              <div className="bg-pink-100 p-2 rounded-lg">
                <Key className="h-6 w-6 text-pink-600" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900">7. Your Rights</h2>
            </div>
            <div className="text-gray-600 space-y-4">
              <p>You have the right to:</p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Access, update, or correct your personal information</li>
                <li>Request deletion of your data, where applicable</li>
                <li>Withdraw consent for marketing communications at any time</li>
              </ul>
              <p>To exercise these rights, please contact us at <a href="mailto:info@flowerschoolbengaluru.com" className="text-pink-600 hover:text-pink-700 underline">info@flowerschoolbengaluru.com</a>.</p>
            </div>
          </div>

          <div className="border-t border-gray-200 my-8"></div>

          {/* 8. Retention of Information */}
          <div className="mb-12">
            <div className="flex items-center gap-3 mb-6">
              <div className="bg-pink-100 p-2 rounded-lg">
                <RefreshCw className="h-6 w-6 text-pink-600" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900">8. Retention of Information</h2>
            </div>
            <div className="text-gray-600">
              <p>We retain your personal information only as long as necessary to fulfil the purposes outlined in this policy or as required by law.</p>
            </div>
          </div>

          <div className="border-t border-gray-200 my-8"></div>

          {/* 9. Links to Other Websites */}
          <div className="mb-12">
            <div className="flex items-center gap-3 mb-6">
              <div className="bg-pink-100 p-2 rounded-lg">
                <Link className="h-6 w-6 text-pink-600" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900">9. Links to Other Websites</h2>
            </div>
            <div className="text-gray-600">
              <p>Our website may contain links to third-party sites. We are not responsible for the privacy practices or content of these external websites.</p>
            </div>
          </div>

          <div className="border-t border-gray-200 my-8"></div>

          {/* 10. Updates to This Policy */}
          <div className="mb-12">
            <div className="flex items-center gap-3 mb-6">
              <div className="bg-pink-100 p-2 rounded-lg">
                <RefreshCw className="h-6 w-6 text-pink-600" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900">10. Updates to This Policy</h2>
            </div>
            <div className="text-gray-600">
              <p>We may update this Privacy Policy from time to time. The latest version will always be posted on this page with the updated date.</p>
            </div>
          </div>

          <div className="border-t border-gray-200 my-8"></div>

          {/* 11. Contact Us */}
          <div className="mb-12">
            <div className="flex items-center gap-3 mb-6">
              <div className="bg-pink-100 p-2 rounded-lg">
                <Mail className="h-6 w-6 text-pink-600" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900">11. Contact Us</h2>
            </div>
            <div className="text-gray-600 space-y-4">
              <p>If you have any questions or concerns about this Privacy Policy, please contact us at:</p>
              
              <div className="bg-gray-50 rounded-lg p-6 border-l-4 border-pink-600">
                <h3 className="font-semibold text-gray-900 mb-3">Flower School Bengaluru & Bouquet Bar</h3>
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Phone className="h-4 w-4 text-pink-600" />
                    <span>Phone: +91 99728 03847</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Mail className="h-4 w-4 text-pink-600" />
                    <span>Email: info@flowerschoolbengaluru.com</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <MapPin className="h-4 w-4 text-pink-600 mt-1 flex-shrink-0" />
                    <span>Address: #440, 18th Main Rd, 6th block Koramangala, Koramangala, Bengaluru, Karnataka 560095, India</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Note */}
        <div className="text-center mt-8">
          <p className="text-gray-500 text-sm">
            Thank you for trusting Flower School Bengaluru & Bouquet Bar
          </p>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default PrivacyPolicy;