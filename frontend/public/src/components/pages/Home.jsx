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

  return (
    <div className="bg-slate-50">
      {/* ========== HERO SECTION ========== */}
      <div className="bg-gradient-to-r from-emerald-600 to-emerald-700 text-white py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h1 className="text-6xl font-bold mb-4">Give Items a Second Chance</h1>
            <p className="text-2xl text-emerald-50 font-light">
              Buy and sell pre-loved items. Sustainable shopping made simple.
            </p>
          </div>

          {/* Search Bar */}
          <form onSubmit={handleSearch} className="max-w-3xl mx-auto mb-12">
            <div className="flex shadow-2xl rounded-xl overflow-hidden">
              <input
                type="text"
                placeholder="Search for clothes, shoes, gadgets, accessories..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="flex-1 px-6 py-4 text-gray-800 focus:outline-none text-lg"
              />
              <button
                type="submit"
                className="bg-emerald-800 px-8 py-4 hover:bg-emerald-900 transition font-semibold flex items-center space-x-2"
              >
                <FiSearch size={20} />
                <span>Search</span>
              </button>
            </div>
          </form>

          {/* Quick Categories */}
          <div className="flex flex-wrap justify-center gap-4">
            {categories.map((cat) => (
              <Link
                key={cat.name}
                to={`/listings?category=${cat.name}`}
                className="px-6 py-3 bg-white/20 backdrop-blur text-white rounded-full font-semibold hover:bg-white/30 transition-all border border-white/30"
              >
                {cat.icon} {cat.name}
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* ========== CATEGORIES SECTION ========== */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="mb-12">
          <h2 className="text-4xl font-bold text-gray-900 mb-2">Shop by Category</h2>
          <p className="text-gray-600 text-lg">Find exactly what you're looking for</p>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-6">
          {categories.map((category) => (
            <Link
              key={category.name}
              to={`/listings?category=${category.name}`}
              className="group bg-white p-8 rounded-xl shadow-md hover:shadow-xl hover:translate-y-(-2px) transition-all"
            >
              <div className="text-6xl mb-4 group-hover:scale-110 transition-transform">{category.icon}</div>
              <h3 className="font-semibold text-gray-800 text-lg group-hover:text-emerald-600 transition-colors">{category.name}</h3>
            </Link>
          ))}
        </div>
      </div>

      {/* ========== HOT DEALS SECTION ========== */}
      <div className="bg-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center mb-12">
            <div>
              <h2 className="text-4xl font-bold text-gray-900 mb-2">🔥 Hot Deals</h2>
              <p className="text-gray-600">Amazing items at unbeatable prices</p>
            </div>
            <Link to="/listings" className="flex items-center space-x-2 text-emerald-600 hover:text-emerald-700 font-semibold hover:scale-105 transition-transform">
              <span>Browse All</span>
              <FiArrowRight />
            </Link>
          </div>

          {loading ? (
            <Loader />
          ) : featuredListings.length === 0 ? (
            <div className="text-center py-16 bg-slate-50 rounded-xl">
              <div className="text-5xl mb-4">📭</div>
              <p className="text-gray-600 text-lg mb-6">No listings yet. Be the first to sell!</p>
              <Link to="/create-listing" className="inline-block bg-emerald-600 text-white px-8 py-3 rounded-xl font-semibold hover:bg-emerald-700 transition">
                Start Selling Now
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {featuredListings.map((listing) => (
                <ListingCard key={listing.id} listing={listing} />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* ========== FEATURES SECTION ========== */}
      <div className="bg-gradient-to-br from-slate-50 to-slate-100 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Why Choose PrelovedPH?</h2>
            <p className="text-gray-600 text-lg">The best platform for sustainable secondhand shopping</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="group bg-white p-8 rounded-xl shadow-md hover:shadow-xl transition-all hover:translate-y-(-4px)">
              <div className="text-5xl mb-4 group-hover:scale-110 transition-transform">🛡️</div>
              <h3 className="text-xl font-bold text-gray-800 mb-3">Safe & Secure</h3>
              <p className="text-gray-600">Verified sellers, secure messaging, and buyer protection</p>
            </div>
            <div className="group bg-white p-8 rounded-xl shadow-md hover:shadow-xl transition-all hover:translate-y-(-4px)">
              <div className="text-5xl mb-4 group-hover:scale-110 transition-transform">💰</div>
              <h3 className="text-xl font-bold text-gray-800 mb-3">Best Prices</h3>
              <p className="text-gray-600">Amazing deals on quality pre-loved items at unbeatable prices</p>
            </div>
            <div className="group bg-white p-8 rounded-xl shadow-md hover:shadow-xl transition-all hover:translate-y-(-4px)">
              <div className="text-5xl mb-4 group-hover:scale-110 transition-transform">♻️</div>
              <h3 className="text-xl font-bold text-gray-800 mb-3">Eco-Friendly</h3>
              <p className="text-gray-600">Reduce waste by giving items a second chance. Shop sustainably.</p>
            </div>
          </div>
        </div>
      </div>

      {/* ========== CTA SECTION ========== */}
      <div className="bg-gradient-to-r from-emerald-600 to-emerald-700 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold mb-4">Ready to Start Selling?</h2>
          <p className="text-xl mb-8 text-emerald-50">Join thousands of sellers making money sustainably</p>
          <Link to="/create-listing" className="inline-block bg-white text-emerald-600 px-10 py-4 rounded-xl font-bold hover:bg-gray-100 transition-all hover:scale-105">
            List Your Item Now
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Home;
