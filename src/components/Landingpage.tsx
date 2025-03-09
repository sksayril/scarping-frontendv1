import React from 'react';
import { MapPin, Users, BadgeCheck, ArrowRight, Search, Building, Database, Shield } from 'lucide-react';

interface LandingPageProps {
  onGetStarted: () => void;
}

export default function LandingPage({ onGetStarted }: LandingPageProps) {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <div className="relative bg-blue-600 overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-blue-800 opacity-90"></div>
        </div>
        <div className="relative container mx-auto px-4 py-24">
          <div className="max-w-3xl mx-auto text-center">
            <div className="animate-bounce mb-8 inline-flex items-center justify-center p-4 bg-blue-500 rounded-full">
              <MapPin className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-5xl md:text-6xl font-bold mb-6 text-white leading-tight">
              Transform Your B2B Sales with <span className="text-blue-200">Verified Leads</span>
            </h1>
            <p className="text-xl mb-12 text-blue-100 leading-relaxed">
              Access 150 high-quality, verified business leads from Google Maps for just $199. 
              Supercharge your sales pipeline with accurate data.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={onGetStarted}
                className="group bg-white text-blue-600 px-8 py-4 rounded-full font-semibold text-lg hover:bg-blue-50 transition-all transform hover:scale-105 flex items-center justify-center"
              >
                Get Started
                <ArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" />
              </button>
              {/* <button className="bg-blue-500 text-white px-8 py-4 rounded-full font-semibold text-lg hover:bg-blue-400 transition-all transform hover:scale-105">
                Watch Demo
              </button> */}
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="py-24 px-4 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Why Choose Our B2B Lead Service?</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">Get access to premium business data that's verified and ready for your sales team to use.</p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white p-8 rounded-2xl shadow-lg transform hover:-translate-y-2 transition-all">
              <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mb-6">
                <Search className="w-8 h-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold mb-4">Google Maps Verified</h3>
              <p className="text-gray-600 leading-relaxed">
                Every business lead is verified through Google Maps, ensuring you get accurate location and contact details.
              </p>
            </div>
            <div className="bg-white p-8 rounded-2xl shadow-lg transform hover:-translate-y-2 transition-all">
              <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mb-6">
                <Building className="w-8 h-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold mb-4">Quality B2B Data</h3>
              <p className="text-gray-600 leading-relaxed">
                Access comprehensive business profiles including industry, size, and key decision-makers.
              </p>
            </div>
            <div className="bg-white p-8 rounded-2xl shadow-lg transform hover:-translate-y-2 transition-all">
              <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mb-6">
                <Database className="w-8 h-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold mb-4">Regular Updates</h3>
              <p className="text-gray-600 leading-relaxed">
                Our database is continuously updated to ensure you always have the latest business information.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Pricing Section */}
      <div className="py-24 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Simple, Transparent Pricing</h2>
            <p className="text-gray-600">Start growing your business today with verified leads</p>
          </div>
          <div className="bg-white rounded-3xl shadow-2xl overflow-hidden transform hover:scale-105 transition-all">
            <div className="bg-blue-600 p-8 text-center">
              <div className="inline-block bg-blue-500 rounded-full px-6 py-2 text-white text-sm font-semibold mb-4">
                MOST POPULAR
              </div>
              <div className="text-white mb-4">
                <span className="text-6xl font-bold">₹199</span>
                <span className="text-xl">/one-time</span>
              </div>
              <p className="text-blue-100 text-xl">150 Verified Business Leads</p>
            </div>
            <div className="p-8">
              <ul className="space-y-4 mb-8">
                <li className="flex items-center text-gray-700">
                  <Shield className="w-5 h-5 text-blue-600 mr-3" />
                  <span>100% verified business data</span>
                </li>
                <li className="flex items-center text-gray-700">
                  <Users className="w-5 h-5 text-blue-600 mr-3" />
                  <span>Complete contact information</span>
                </li>
                <li className="flex items-center text-gray-700">
                  <BadgeCheck className="w-5 h-5 text-blue-600 mr-3" />
                  <span>Export in CSV/Excel format</span>
                </li>
                <li className="flex items-center text-gray-700">
                  <MapPin className="w-5 h-5 text-blue-600 mr-3" />
                  <span>Detailed location data</span>
                </li>
              </ul>
              <button
                onClick={onGetStarted}
                className="w-full bg-blue-600 text-white py-4 rounded-xl font-semibold text-lg hover:bg-blue-700 transition-colors flex items-center justify-center group"
              >
                Get Started Now
                <ArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Trust Section */}
      {/* <div className="bg-gray-50 py-16 px-4">
        <div className="max-w-6xl mx-auto text-center">
          <h3 className="text-2xl font-semibold text-gray-900 mb-8">Trusted by Growing Businesses</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 items-center opacity-50">
            <img src="https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=200&h=100&fit=crop&crop=entropy&q=80" alt="Company logo" className="h-12 object-contain mx-auto" />
            <img src="https://images.unsplash.com/photo-1611162616305-c69b3fa7fbe0?w=200&h=100&fit=crop&crop=entropy&q=80" alt="Company logo" className="h-12 object-contain mx-auto" />
            <img src="https://images.unsplash.com/photo-1611162618071-b39a2ec055fb?w=200&h=100&fit=crop&crop=entropy&q=80" alt="Company logo" className="h-12 object-contain mx-auto" />
            <img src="https://images.unsplash.com/photo-1611162616475-46b635cb6868?w=200&h=100&fit=crop&crop=entropy&q=80" alt="Company logo" className="h-12 object-contain mx-auto" />
          </div>
        </div> */}
      {/* </div> */}
    </div>
  );
}