import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import api from '../../utils/api';
import ListingCard from '../ListingCard';
import FilterSidebar from '../FilterSidebar';
import Loader from '../Loader';
import { FiGrid, FiList } from 'react-icons/fi';

const Listings = () => {
  const [searchParams] = useSearchParams();
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState('grid');
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

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-PH', {
      style: 'currency',
      currency: 'PHP',
      minimumFractionDigits: 0,
    }).format(price);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
      <div className="flex flex-col md:flex-row gap-8">
        {/* Sidebar Filters */}
        <div className="md:w-80">
          <FilterSidebar filters={filters} onFilterChange={setFilters} />
        </div>
        
        {/* Main Content */}
        <div className="flex-1">
          {/* Header */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-800">
                {searchParams.get('search') ? `Search: "${searchParams.get('search')}"` : 'All Items'}
              </h1>
              <p className="text-gray-500 text-sm mt-1">{listings.length} items found</p>
            </div>
            
            <div className="flex items-center space-x-4">
              {/* Sort */}
              <select
                value={filters.sort}
                onChange={(e) => setFilters({ ...filters, sort: e.target.value })}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 text-sm"
              >
                <option value="newest">Newest First</option>
                <option value="price_asc">Price: Low to High</option>
                <option value="price_desc">Price: High to Low</option>
              </select>
              
              {/* View Toggle */}
              <div className="flex border border-gray-300 rounded-lg overflow-hidden">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-2 ${viewMode === 'grid' ? 'bg-green-500 text-white' : 'bg-white text-gray-600'}`}
                >
                  <FiGrid size={18} />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-2 ${viewMode === 'list' ? 'bg-green-500 text-white' : 'bg-white text-gray-600'}`}
                >
                  <FiList size={18} />
                </button>
              </div>
            </div>
          </div>
          
          {/* Results */}
          {loading ? (
            <Loader />
          ) : listings.length === 0 ? (
            <div className="text-center py-16 bg-white rounded-xl">
              <p className="text-gray-500 text-lg mb-4">No items found</p>
              <p className="text-gray-400">Try adjusting your filters or search terms</p>
              <button
                onClick={() => setFilters({ category: 'All', condition: 'All', minPrice: '', maxPrice: '', sort: 'newest' })}
                className="btn-outline mt-4"
              >
                Clear Filters
              </button>
            </div>
          ) : viewMode === 'grid' ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {listings.map((listing) => (
                <ListingCard key={listing.id} listing={listing} />
              ))}
            </div>
          ) : (
            <div className="space-y-4">
              {listings.map((listing) => (
                <div key={listing.id} className="bg-white rounded-xl shadow-md p-4 flex gap-4 hover:shadow-lg transition">
                  <img src={listing.images?.[0]} alt={listing.title} className="w-32 h-32 object-cover rounded-lg" />
                  <div className="flex-1">
                    <h3 className="font-semibold text-lg">{listing.title}</h3>
                    <p className="text-green-600 font-bold text-xl">{formatPrice(listing.price)}</p>
                    <p className="text-gray-500 text-sm mt-1 line-clamp-2">{listing.description}</p>
                    <div className="flex items-center justify-between mt-2">
                      <span className="text-xs text-gray-400">Condition: {listing.condition}</span>
                      <Link to={`/listing/${listing.id}`} className="text-green-600 text-sm hover:underline">
                        View Details →
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Listings;