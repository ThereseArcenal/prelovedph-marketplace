import React from 'react';
import { Link } from 'react-router-dom';
import { FiHeart, FiUsers, FiGlobe, FiShield, FiTrendingUp, FiTruck } from 'react-icons/fi';

const About = () => {
  return (
    <div className="animate-fade-in">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-green-600 to-green-500 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 text-center sm:px-6 lg:px-8">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">About PrelovedPH</h1>
          <p className="text-xl max-w-2xl mx-auto">
            We're on a mission to make sustainable shopping accessible to every Filipino
          </p>
        </div>
      </div>
      
      {/* Mission Section */}
      <div className="max-w-7xl mx-auto px-4 py-16 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          <div className="text-center">
            <div className="bg-green-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4">
              <FiHeart className="w-10 h-10 text-green-600" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Our Mission</h3>
            <p className="text-gray-600">
              To give pre-loved items a second chance while building a community of conscious consumers who value sustainability and quality.
            </p>
          </div>
          
          <div className="text-center">
            <div className="bg-green-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4">
              <FiUsers className="w-10 h-10 text-green-600" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Our Community</h3>
            <p className="text-gray-600">
              Join thousands of buyers and sellers across the Philippines who are making sustainable choices and finding amazing deals.
            </p>
          </div>
          
          <div className="text-center">
            <div className="bg-green-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4">
              <FiGlobe className="w-10 h-10 text-green-600" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Our Impact</h3>
            <p className="text-gray-600">
              Reducing waste one item at a time. Every purchase on PrelovedPH helps keep items out of landfills and reduces carbon footprint.
            </p>
          </div>
        </div>
        
        {/* Story Section */}
        <div className="bg-gray-50 rounded-2xl p-8 mb-16">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            <div>
              <h2 className="text-2xl font-bold text-gray-800 mb-4">Our Story</h2>
              <p className="text-gray-600 mb-4">
                PrelovedPH was born from a simple idea: what if we could make buying and selling pre-loved items as easy as shopping at a mall?
              </p>
              <p className="text-gray-600 mb-4">
                Founded in 2024, we started as a small community of thrift enthusiasts in Cebu who wanted to create a safer, more convenient way to trade pre-loved items. Today, we've grown into a nationwide platform connecting thousands of Filipinos who believe in giving items a second chance.
              </p>
              <p className="text-gray-600">
                Whether you're looking for a vintage find, upgrading your gadgets, or decluttering your home, PrelovedPH is here to help you shop sustainably and sell responsibly.
              </p>
            </div>
            <div className="bg-gradient-to-r from-green-500 to-green-600 rounded-xl p-6 text-white text-center">
              <div className="text-4xl mb-2">♻️</div>
              <p className="text-lg font-semibold">"Give items a second chance"</p>
              <p className="text-green-100 text-sm mt-2">- Our Promise</p>
            </div>
          </div>
        </div>
        
        {/* How It Works */}
        <div className="mb-16">
          <h2 className="text-2xl font-bold text-gray-800 text-center mb-8">How It Works</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="bg-green-600 text-white w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4 text-xl font-bold">
                1
              </div>
              <h3 className="font-semibold mb-2">Find an Item</h3>
              <p className="text-gray-600 text-sm">
                Browse through thousands of pre-loved items in your local area. Use filters to find exactly what you're looking for.
              </p>
            </div>
            <div className="text-center">
              <div className="bg-green-600 text-white w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4 text-xl font-bold">
                2
              </div>
              <h3 className="font-semibold mb-2">Contact Seller</h3>
              <p className="text-gray-600 text-sm">
                Message the seller directly through our platform or reach out via WhatsApp for quick responses.
              </p>
            </div>
            <div className="text-center">
              <div className="bg-green-600 text-white w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4 text-xl font-bold">
                3
              </div>
              <h3 className="font-semibold mb-2">Make a Deal</h3>
              <p className="text-gray-600 text-sm">
                Arrange payment and pickup directly with the seller. Meet locally or arrange shipping.
              </p>
            </div>
          </div>
        </div>
        
        {/* Features */}
        <div className="mb-16">
          <h2 className="text-2xl font-bold text-gray-800 text-center mb-8">Why Choose PrelovedPH?</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flex items-start space-x-3 p-4 bg-white rounded-xl shadow-sm">
              <FiShield className="text-green-600 text-xl mt-1" />
              <div>
                <h3 className="font-semibold">Safe & Secure</h3>
                <p className="text-gray-600 text-sm">Verified sellers and secure messaging for your peace of mind</p>
              </div>
            </div>
            <div className="flex items-start space-x-3 p-4 bg-white rounded-xl shadow-sm">
              <FiTrendingUp className="text-green-600 text-xl mt-1" />
              <div>
                <h3 className="font-semibold">Best Prices</h3>
                <p className="text-gray-600 text-sm">Get amazing deals on quality pre-loved items from your community</p>
              </div>
            </div>
            <div className="flex items-start space-x-3 p-4 bg-white rounded-xl shadow-sm">
              <FiTruck className="text-green-600 text-xl mt-1" />
              <div>
                <h3 className="font-semibold">Local Community</h3>
                <p className="text-gray-600 text-sm">Buy and sell within your local area. Support your neighbors!</p>
              </div>
            </div>
            <div className="flex items-start space-x-3 p-4 bg-white rounded-xl shadow-sm">
              <FiHeart className="text-green-600 text-xl mt-1" />
              <div>
                <h3 className="font-semibold">Eco-Friendly</h3>
                <p className="text-gray-600 text-sm">Reduce waste and help the environment by giving items a second life</p>
              </div>
            </div>
          </div>
        </div>
        
        {/* CTA */}
        <div className="bg-green-600 rounded-2xl p-8 text-white text-center">
          <h2 className="text-2xl font-bold mb-4">Ready to Join the PrelovedPH Community?</h2>
          <p className="mb-6">Start buying and selling sustainably today!</p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link to="/register" className="bg-white text-green-600 px-6 py-2 rounded-lg font-semibold hover:bg-gray-100 transition">
              Create Account
            </Link>
            <Link to="/listings" className="bg-green-700 text-white px-6 py-2 rounded-lg font-semibold hover:bg-green-800 transition">
              Browse Items
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;