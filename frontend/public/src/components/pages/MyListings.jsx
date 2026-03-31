import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import api from '../../utils/api';
import toast from 'react-hot-toast';
import { FiEdit2, FiTrash2, FiCheckCircle, FiXCircle, FiEye } from 'react-icons/fi';

const MyListings = () => {
  const { user } = useAuth();
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('active');

  useEffect(() => {
    fetchListings();
  }, []);

  const fetchListings = async () => {
    try {
      const response = await api.get('/listings/user/my-listings');
      if (response.data.success) {
        setListings(response.data.listings);
      }
    } catch (error) {
      toast.error('Failed to fetch listings');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this listing? This action cannot be undone.')) return;
    
    try {
      await api.delete(`/listings/${id}`);
      toast.success('Listing deleted');
      fetchListings();
    } catch (error) {
      toast.error('Failed to delete');
    }
  };

  const handleMarkAsSold = async (id) => {
    try {
      await api.patch(`/listings/${id}/status`, { status: 'sold' });
      toast.success('Marked as sold');
      fetchListings();
    } catch (error) {
      toast.error('Failed to update');
    }
  };

  const handleMarkAsActive = async (id) => {
    try {
      await api.patch(`/listings/${id}/status`, { status: 'active' });
      toast.success('Listing reactivated');
      fetchListings();
    } catch (error) {
      toast.error('Failed to update');
    }
  };

  const filteredListings = listings.filter(listing => {
    if (activeTab === 'active') return listing.status === 'active';
    if (activeTab === 'sold') return listing.status === 'sold';
    if (activeTab === 'inactive') return listing.status === 'inactive';
    return true;
  });

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-PH', {
      style: 'currency',
      currency: 'PHP',
      minimumFractionDigits: 0,
    }).format(price);
  };

  if (!user) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">Please login to view your listings</p>
        <Link to="/login" className="btn-primary inline-block mt-4">Login</Link>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
      </div>
    );
  }

  const tabs = [
    { id: 'active', label: 'Active', count: listings.filter(l => l.status === 'active').length },
    { id: 'sold', label: 'Sold', count: listings.filter(l => l.status === 'sold').length },
    { id: 'inactive', label: 'Inactive', count: listings.filter(l => l.status === 'inactive').length },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
        <h1 className="text-2xl font-bold text-gray-800">My Listings</h1>
        <Link to="/create-listing" className="btn-primary">
          + Sell New Item
        </Link>
      </div>
      
      {/* Tabs */}
      <div className="flex space-x-2 border-b border-gray-200 mb-6">
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-4 py-2 font-medium transition ${
              activeTab === tab.id
                ? 'text-green-600 border-b-2 border-green-600'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            {tab.label} ({tab.count})
          </button>
        ))}
      </div>
      
      {filteredListings.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-xl">
          <p className="text-gray-500 mb-4">No {activeTab} listings found.</p>
          {activeTab === 'active' && (
            <Link to="/create-listing" className="btn-primary inline-block">
              List Your First Item
            </Link>
          )}
        </div>
      ) : (
        <div className="space-y-4">
          {filteredListings.map((listing) => (
            <div key={listing.id} className="bg-white rounded-xl shadow-md p-4 flex flex-col sm:flex-row gap-4 hover:shadow-lg transition">
              <img 
                src={listing.images?.[0] || 'https://via.placeholder.com/100'} 
                alt={listing.title}
                className="w-24 h-24 object-cover rounded-lg"
              />
              <div className="flex-1">
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-2">
                  <div>
                    <h3 className="font-semibold text-gray-800">{listing.title}</h3>
                    <p className="text-green-600 font-bold">{formatPrice(listing.price)}</p>
                    <div className="flex items-center space-x-3 text-sm text-gray-500 mt-1">
                      <span>{listing.views} views</span>
                      <span>•</span>
                      <span className="capitalize">{listing.condition}</span>
                      <span>•</span>
                      <span>{listing.category}</span>
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    {listing.status === 'active' && (
                      <button
                        onClick={() => handleMarkAsSold(listing.id)}
                        className="text-green-600 hover:text-green-700 p-1"
                        title="Mark as Sold"
                      >
                        <FiCheckCircle size={18} />
                      </button>
                    )}
                    {listing.status === 'sold' && (
                      <button
                        onClick={() => handleMarkAsActive(listing.id)}
                        className="text-blue-600 hover:text-blue-700 p-1"
                        title="Reactivate Listing"
                      >
                        <FiEye size={18} />
                      </button>
                    )}
                    <Link
                      to={`/listing/${listing.id}`}
                      className="text-gray-500 hover:text-gray-600 p-1"
                      title="View"
                    >
                      <FiEye size={18} />
                    </Link>
                    <button
                      onClick={() => handleDelete(listing.id)}
                      className="text-red-500 hover:text-red-600 p-1"
                      title="Delete"
                    >
                      <FiTrash2 size={18} />
                    </button>
                  </div>
                </div>
                <div className="mt-3 flex flex-wrap gap-2">
                  {listing.status === 'active' && (
                    <span className="badge bg-green-100 text-green-800">Active</span>
                  )}
                  {listing.status === 'sold' && (
                    <span className="badge bg-red-100 text-red-800">Sold</span>
                  )}
                  {listing.status === 'inactive' && (
                    <span className="badge bg-gray-100 text-gray-800">Inactive</span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyListings;