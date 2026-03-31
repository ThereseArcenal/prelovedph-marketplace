import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../../utils/api';
import ListingCard from '../ListingCard';
import Loader from '../Loader';
import { FiSearch, FiArrowRight } from 'react-icons/fi';

const Home = () => {
  const [featuredListings, setFeaturedListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchFeaturedListings();
  }, []);

  const fetchFeaturedListings = async () => {
    try {
      const response = await api.get('/listings?sort=newest&limit=8');
      if (response.data.success) {
        setFeaturedListings(response.data.listings.slice(0, 8));
      }
    } catch (error) {
      console.error('Error fetching listings:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      window.location.href = `/listings?search=${encodeURIComponent(searchTerm)}`;
    }
  };

  const categories = [
    { name: 'Clothes', icon: '👕' },
    { name: 'Shoes', icon: '👟' },
    { name: 'Gadgets', icon: '📱' },
    { name: 'Accessories', icon: '💍' },
  ];

  const features = [
    {
      icon: '🛡️',
      title: 'Safe & Secure',
      description: 'Verified sellers and secure messaging for peace of mind'
    },
    {
      icon: '💰',
      title: 'Best Prices',
      description: 'Amazing deals on quality pre-loved items'
    },
    {
      icon: '♻️',
      title: 'Eco-Friendly',
      description: 'Reduce waste by giving items a second chance'
    }
  ];

  return (
    <div className="bg-gray-50">
      {/* ========== HERO SECTION - MINIMALIST ========== */}
      <div className="bg-green-600 text-white py-20">
        <div className="max-w-4xl mx-auto px-4 text-center sm:px-6 lg:px-8">
          <div className="text-5xl mb-4">♻️</div>
          <h1 className="text-4xl md:text-5xl font-bold mb-3">Give Items a Second Chance</h1>
          <p className="text-green-100 text-lg mb-8">
            Buy and sell pre-loved items. Sustainable shopping made simple.
          </p>

          {/* Search Bar */}
          <form onSubmit={handleSearch} className="max-w-2xl mx-auto mb-8">
            <div className="flex bg-white rounded-xl overflow-hidden shadow-md">
              <input
                type="text"
                placeholder="Search for clothes, shoes, gadgets..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="flex-1 px-5 py-3 text-gray-800 focus:outline-none text-base"
              />
              <button
                type="submit"
                className="bg-green-700 px-6 py-3 hover:bg-green-800 transition flex items-center gap-2 text-sm font-medium"
              >
                <FiSearch size={18} />
                <span>Search</span>
              </button>
            </div>
          </form>

          {/* Quick Categories */}
          <div className="flex flex-wrap justify-center gap-3">
            {categories.map((cat) => (
              <Link
                key={cat.name}
                to={`/listings?category=${cat.name}`}
                className="px-5 py-2 bg-white/20 rounded-full text-sm font-medium hover:bg-white/30 transition border border-white/30"
              >
                {cat.icon} {cat.name}
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* ========== CATEGORIES SECTION ========== */}
      <div className="max-w-6xl mx-auto px-4 py-16 sm:px-6 lg:px-8">
        <div className="text-center mb-10">
          <h2 className="text-2xl font-bold text-gray-800 mb-1">Shop by Category</h2>
          <p className="text-gray-500 text-sm">Find exactly what you're looking for</p>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {categories.map((category) => (
            <Link
              key={category.name}
              to={`/listings?category=${category.name}`}
              className="bg-white p-6 rounded-xl shadow-sm text-center hover:shadow-md transition border border-gray-100"
            >
              <div className="text-4xl mb-2">{category.icon}</div>
              <h3 className="font-medium text-gray-700 text-sm">{category.name}</h3>
            </Link>
          ))}
        </div>
      </div>

      {/* ========== HOT DEALS SECTION ========== */}
      <div className="bg-white py-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h2 className="text-2xl font-bold text-gray-800 mb-1">Hot Deals 🔥</h2>
              <p className="text-gray-500 text-sm">Amazing items at unbeatable prices</p>
            </div>
            <Link to="/listings" className="flex items-center gap-1 text-green-600 text-sm font-medium hover:text-green-700 transition">
              <span>Browse All</span>
              <FiArrowRight size={14} />
            </Link>
          </div>

          {loading ? (
            <Loader />
          ) : featuredListings.length === 0 ? (
            <div className="text-center py-16 bg-gray-50 rounded-xl">
              <div className="text-4xl mb-3">📭</div>
              <p className="text-gray-500 mb-4">No listings yet. Be the first to sell!</p>
              <Link to="/create-listing" className="inline-block bg-green-600 text-white px-6 py-2 rounded-lg text-sm font-medium hover:bg-green-700 transition">
                Start Selling
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              {featuredListings.map((listing) => (
                <ListingCard key={listing.id} listing={listing} />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* ========== FEATURES SECTION - MINIMALIST ========== */}
      <div className="py-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <h2 className="text-2xl font-bold text-gray-800 mb-1">Why Choose PrelovedPH?</h2>
            <p className="text-gray-500 text-sm">The best platform for sustainable secondhand shopping</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {features.map((feature, index) => (
              <div key={index} className="text-center p-6">
                <div className="text-4xl mb-3">{feature.icon}</div>
                <h3 className="font-semibold text-gray-800 mb-2">{feature.title}</h3>
                <p className="text-gray-500 text-sm">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ========== CTA SECTION - MINIMALIST ========== */}
      <div className="bg-green-600 text-white py-16">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-2xl font-bold mb-2">Ready to Start Selling?</h2>
          <p className="text-green-100 text-sm mb-6">Join thousands of sellers making money sustainably</p>
          <Link to="/create-listing" className="inline-block bg-white text-green-600 px-8 py-3 rounded-lg font-medium hover:bg-gray-100 transition text-sm">
            List Your Item Now
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Home;