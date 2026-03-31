import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import api from '../../utils/api';
import ListingCard from '../ListingCard';
import Loader from '../Loader';
import { FiGrid, FiList, FiSliders } from 'react-icons/fi';

const Listings = () => {
  const [searchParams] = useSearchParams();
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState('grid');
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [filters, setFilters] = useState({
    category: searchParams.get('category') || 'All',
    condition: 'All',
    minPrice: '',
    maxPrice: '',
    sort: 'newest',
  });

  useEffect(() => {
    fetchListings();
  }, [filters, searchParams]);

  const fetchListings = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (filters.category !== 'All') params.append('category', filters.category);
      if (filters.condition !== 'All') params.append('condition', filters.condition);
      if (filters.minPrice) params.append('minPrice', filters.minPrice);
      if (filters.maxPrice) params.append('maxPrice', filters.maxPrice);
      if (filters.sort) params.append('sort', filters.sort);
      
      const search = searchParams.get('search');
      if (search) params.append('search', search);
      
      const response = await api.get(`/listings?${params.toString()}`);
      if (response.data.success) {
        setListings(response.data.listings);
      }
    } catch (error) {
      console.error('Error fetching listings:', error);
    } finally {
      setLoading(false);
    }
  };

  const clearFilters = () => {
    setFilters({ category: 'All', condition: 'All', minPrice: '', maxPrice: '', sort: 'newest' });
  };

  const categories = ['All', 'Clothes', 'Shoes', 'Gadgets', 'Accessories', 'Books', 'Home', 'Others'];
  const conditions = ['All', 'New', 'Like New', 'Good', 'Fair'];

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-PH', {
      style: 'currency',
      currency: 'PHP',
      minimumFractionDigits: 0,
    }).format(price);
  };

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="max-w-6xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-800">
            {searchParams.get('search') ? `Search: "${searchParams.get('search')}"` : 'All Items'}
          </h1>
          <p className="text-gray-500 text-sm mt-1">{listings.length} items found</p>
        </div>

        <div className="flex flex-col md:flex-row gap-8">
          
          {/* Sidebar Filters - Desktop */}
          <div className="hidden md:block w-64 flex-shrink-0">
            <div className="bg-white rounded-xl p-5 sticky top-20 border border-gray-100">
              <h3 className="font-semibold text-gray-800 mb-4">Filters</h3>
              
              {/* Category Filter */}
              <div className="mb-5">
                <label className="block text-xs font-medium text-gray-500 uppercase tracking-wider mb-2">
                  Category
                </label>
                <select
                  value={filters.category}
                  onChange={(e) => setFilters({ ...filters, category: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-green-500 text-sm bg-white"
                >
                  {categories.map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>
              
              {/* Condition Filter */}
              <div className="mb-5">
                <label className="block text-xs font-medium text-gray-500 uppercase tracking-wider mb-2">
                  Condition
                </label>
                <select
                  value={filters.condition}
                  onChange={(e) => setFilters({ ...filters, condition: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-green-500 text-sm bg-white"
                >
                  {conditions.map(cond => (
                    <option key={cond} value={cond}>{cond}</option>
                  ))}
                </select>
              </div>
              
              {/* Price Range */}
              <div className="mb-5">
                <label className="block text-xs font-medium text-gray-500 uppercase tracking-wider mb-2">
                  Price Range
                </label>
                <div className="flex gap-2">
                  <input
                    type="number"
                    placeholder="Min ₱"
                    value={filters.minPrice}
                    onChange={(e) => setFilters({ ...filters, minPrice: e.target.value })}
                    className="w-1/2 px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-green-500 text-sm"
                  />
                  <input
                    type="number"
                    placeholder="Max ₱"
                    value={filters.maxPrice}
                    onChange={(e) => setFilters({ ...filters, maxPrice: e.target.value })}
                    className="w-1/2 px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-green-500 text-sm"
                  />
                </div>
              </div>
              
              {/* Clear Filters */}
              <button
                onClick={clearFilters}
                className="w-full text-center text-sm text-green-600 hover:text-green-700 font-medium py-2 border-t border-gray-100 mt-2 pt-4"
              >
                Clear all filters
              </button>
            </div>
          </div>

          {/* Mobile Filter Button */}
          <div className="md:hidden mb-4">
            <button
              onClick={() => setIsFilterOpen(!isFilterOpen)}
              className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm font-medium text-gray-700"
            >
              <FiSliders size={16} />
              Filters
              {(filters.category !== 'All' || filters.condition !== 'All' || filters.minPrice || filters.maxPrice) && (
                <span className="ml-1 w-2 h-2 bg-green-500 rounded-full"></span>
              )}
            </button>
          </div>

          {/* Mobile Filters Dropdown */}
          {isFilterOpen && (
            <div className="md:hidden bg-white rounded-xl p-5 mb-6 border border-gray-100">
              <div className="flex justify-between items-center mb-4">
                <h3 className="font-semibold text-gray-800">Filters</h3>
                <button onClick={() => setIsFilterOpen(false)} className="text-gray-400 text-sm">Close</button>
              </div>
              
              <div className="mb-4">
                <label className="block text-xs font-medium text-gray-500 mb-1">Category</label>
                <select
                  value={filters.category}
                  onChange={(e) => setFilters({ ...filters, category: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm"
                >
                  {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                </select>
              </div>
              
              <div className="mb-4">
                <label className="block text-xs font-medium text-gray-500 mb-1">Condition</label>
                <select
                  value={filters.condition}
                  onChange={(e) => setFilters({ ...filters, condition: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm"
                >
                  {conditions.map(cond => <option key={cond} value={cond}>{cond}</option>)}
                </select>
              </div>
              
              <div className="mb-4">
                <label className="block text-xs font-medium text-gray-500 mb-1">Price Range</label>
                <div className="flex gap-2">
                  <input type="number" placeholder="Min" value={filters.minPrice} onChange={(e) => setFilters({ ...filters, minPrice: e.target.value })} className="w-1/2 px-3 py-2 border border-gray-200 rounded-lg text-sm" />
                  <input type="number" placeholder="Max" value={filters.maxPrice} onChange={(e) => setFilters({ ...filters, maxPrice: e.target.value })} className="w-1/2 px-3 py-2 border border-gray-200 rounded-lg text-sm" />
                </div>
              </div>
              
              <button onClick={clearFilters} className="w-full text-center text-sm text-green-600 font-medium py-2">
                Clear all filters
              </button>
            </div>
          )}
          
          {/* Main Content */}
          <div className="flex-1">
            {/* Sort and View Controls */}
            <div className="flex justify-between items-center mb-6">
              <div className="flex items-center gap-2">
                <span className="text-xs text-gray-400">Sort by:</span>
                <select
                  value={filters.sort}
                  onChange={(e) => setFilters({ ...filters, sort: e.target.value })}
                  className="px-3 py-1.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-green-500 text-sm bg-white"
                >
                  <option value="newest">Newest</option>
                  <option value="price_asc">Price: Low to High</option>
                  <option value="price_desc">Price: High to Low</option>
                </select>
              </div>
              
              {/* View Toggle */}
              <div className="flex border border-gray-200 rounded-lg overflow-hidden bg-white">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-2 ${viewMode === 'grid' ? 'bg-green-500 text-white' : 'text-gray-500'}`}
                >
                  <FiGrid size={16} />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-2 ${viewMode === 'list' ? 'bg-green-500 text-white' : 'text-gray-500'}`}
                >
                  <FiList size={16} />
                </button>
              </div>
            </div>
            
            {/* Results */}
            {loading ? (
              <Loader />
            ) : listings.length === 0 ? (
              <div className="text-center py-16 bg-white rounded-xl border border-gray-100">
                <div className="text-5xl mb-4">🔍</div>
                <p className="text-gray-500 font-medium mb-2">No items found</p>
                <p className="text-gray-400 text-sm mb-6">Try adjusting your filters or search terms</p>
                <button
                  onClick={clearFilters}
                  className="text-green-600 text-sm font-medium hover:text-green-700"
                >
                  Clear all filters
                </button>
              </div>
            ) : viewMode === 'grid' ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                {listings.map((listing) => (
                  <ListingCard key={listing.id} listing={listing} />
                ))}
              </div>
            ) : (
              <div className="space-y-3">
                {listings.map((listing) => (
                  <Link key={listing.id} to={`/listing/${listing.id}`} className="flex bg-white rounded-xl p-4 gap-4 hover:shadow-md transition border border-gray-100">
                    <img src={listing.images?.[0] || 'https://via.placeholder.com/100'} alt={listing.title} className="w-24 h-24 object-cover rounded-lg" />
                    <div className="flex-1 min-w-0">
                      <h3 className="font-medium text-gray-800 truncate">{listing.title}</h3>
                      <p className="text-green-600 font-bold text-lg">{formatPrice(listing.price)}</p>
                      <p className="text-gray-500 text-sm mt-1 line-clamp-1">{listing.description}</p>
                      <div className="flex items-center gap-3 mt-2">
                        <span className="text-xs text-gray-400">Condition: {listing.condition}</span>
                        <span className="text-xs text-green-600">View Details →</span>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Newsletter Section */}
        <div className="mt-16 pt-8 border-t border-gray-200">
          <div className="bg-white rounded-xl p-8 text-center border border-gray-100">
            <h3 className="text-lg font-semibold text-gray-800 mb-2">Stay Updated</h3>
            <p className="text-gray-500 text-sm mb-6">Get the latest deals and sustainability tips delivered to your inbox</p>
            <form className="max-w-md mx-auto flex flex-col sm:flex-row gap-3">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-green-500 text-sm"
              />
              <button className="px-6 py-2 bg-green-600 text-white rounded-lg text-sm font-medium hover:bg-green-700 transition">
                Subscribe
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Listings;