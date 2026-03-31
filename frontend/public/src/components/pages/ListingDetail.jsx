import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import api from '../../utils/api';
import toast from 'react-hot-toast';
import { 
  FiMapPin, FiEye, FiMessageCircle, FiWhatsApp, FiHeart, 
  FiShare2, FiArrowLeft, FiCheckCircle, FiXCircle 
} from 'react-icons/fi';

const ListingDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [listing, setListing] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(0);
  const [message, setMessage] = useState('');
  const [isFavorited, setIsFavorited] = useState(false);

  useEffect(() => {
    fetchListing();
    if (user) {
      checkFavorite();
    }
  }, [id, user]);

  const fetchListing = async () => {
    try {
      const response = await api.get(`/listings/${id}`);
      if (response.data.success) {
        setListing(response.data.listing);
      }
    } catch (error) {
      toast.error('Listing not found');
      navigate('/listings');
    } finally {
      setLoading(false);
    }
  };

  const checkFavorite = async () => {
    try {
      const response = await api.get(`/favorites/check/${id}`);
      setIsFavorited(response.data.isFavorited);
    } catch (error) {
      console.error('Check favorite error:', error);
    }
  };

  const toggleFavorite = async () => {
    if (!user) {
      toast.error('Please login to save favorites');
      navigate('/login');
      return;
    }

    try {
      if (isFavorited) {
        await api.delete(`/favorites/${id}`);
        setIsFavorited(false);
        toast.success('Removed from favorites');
      } else {
        await api.post('/favorites', { listing_id: id });
        setIsFavorited(true);
        toast.success('Added to favorites');
      }
    } catch (error) {
      toast.error('Failed to update favorites');
    }
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!user) {
      toast.error('Please login to send messages');
      navigate('/login');
      return;
    }

    if (!message.trim()) {
      toast.error('Please enter a message');
      return;
    }

    try {
      await api.post('/messages', {
        listing_id: listing.id,
        message: message,
      });
      toast.success('Message sent! Redirecting to chat...');
      setMessage('');

      // Navigate to messages page
      setTimeout(() => {
        navigate('/messages');
      }, 800);
    } catch (error) {
      toast.error('Failed to send message');
    }
  };

  const handleWhatsApp = () => {
    const phone = listing.contact_phone || listing.profiles?.phone;
    if (!phone) {
      toast.error('Seller phone number not available');
      return;
    }
    const text = `Hi! I'm interested in your item: ${listing.title}. Is it still available?`;
    window.open(`https://wa.me/${phone.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(text)}`, '_blank');
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: listing.title,
        text: `Check out this item on PrelovedPH: ${listing.title}`,
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      toast.success('Link copied to clipboard!');
    }
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-PH', {
      style: 'currency',
      currency: 'PHP',
      minimumFractionDigits: 0,
    }).format(price);
  };

  const conditionColors = {
    'New': 'bg-green-100 text-green-800',
    'Like New': 'bg-blue-100 text-blue-800',
    'Good': 'bg-yellow-100 text-yellow-800',
    'Fair': 'bg-orange-100 text-orange-800',
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
      </div>
    );
  }

  if (!listing) return null;

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
      {/* Back Button */}
      <button
        onClick={() => navigate(-1)}
        className="flex items-center space-x-2 text-gray-600 hover:text-green-600 mb-6"
      >
        <FiArrowLeft />
        <span>Back</span>
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Image Gallery */}
        <div className="space-y-4">
          <div className="bg-white rounded-xl shadow-md overflow-hidden">
            <img
              src={listing.images[selectedImage]}
              alt={listing.title}
              className="w-full h-96 object-contain bg-gray-50"
            />
          </div>
          {listing.images.length > 1 && (
            <div className="flex space-x-2 overflow-x-auto pb-2">
              {listing.images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedImage(idx)}
                  className={`w-20 h-20 rounded-lg overflow-hidden border-2 flex-shrink-0 ${
                    selectedImage === idx ? 'border-green-500' : 'border-transparent'
                  }`}
                >
                  <img src={img} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>
        
        {/* Item Details */}
        <div className="space-y-6">
          {/* Title and Price */}
          <div>
            <div className="flex items-start justify-between gap-4">
              <h1 className="text-2xl font-bold text-gray-800">{listing.title}</h1>
              <button
                onClick={toggleFavorite}
                className="p-2 rounded-full hover:bg-gray-100 transition"
              >
                <FiHeart 
                  size={24} 
                  className={isFavorited ? 'fill-red-500 text-red-500' : 'text-gray-400'} 
                />
              </button>
            </div>
            <p className="text-3xl font-bold text-green-600 mt-2">{formatPrice(listing.price)}</p>
          </div>
          
          {/* Status Badge */}
          <div className="flex flex-wrap gap-2">
            <span className={`px-3 py-1 rounded-full text-sm font-medium ${conditionColors[listing.condition]}`}>
              {listing.condition}
            </span>
            {listing.status === 'sold' && (
              <span className="bg-red-100 text-red-800 px-3 py-1 rounded-full text-sm font-medium flex items-center space-x-1">
                <FiXCircle size={14} />
                <span>Sold</span>
              </span>
            )}
          </div>
          
          {/* Details Grid */}
          <div className="grid grid-cols-2 gap-4 py-4 border-y border-gray-100">
            <div className="flex items-center space-x-2 text-gray-600">
              <FiMapPin />
              <span>{listing.location || 'Location not specified'}</span>
            </div>
            <div className="flex items-center space-x-2 text-gray-600">
              <FiEye />
              <span>{listing.views} views</span>
            </div>
            {listing.brand && (
              <div>
                <span className="text-gray-500">Brand:</span>
                <span className="ml-2 text-gray-800">{listing.brand}</span>
              </div>
            )}
            {listing.size && (
              <div>
                <span className="text-gray-500">Size:</span>
                <span className="ml-2 text-gray-800">{listing.size}</span>
              </div>
            )}
            {listing.color && (
              <div>
                <span className="text-gray-500">Color:</span>
                <span className="ml-2 text-gray-800">{listing.color}</span>
              </div>
            )}
            <div>
              <span className="text-gray-500">Category:</span>
              <span className="ml-2 text-gray-800">{listing.category}</span>
            </div>
          </div>
          
          {/* Description */}
          <div>
            <h3 className="font-semibold text-gray-800 mb-2">Description</h3>
            <p className="text-gray-600 whitespace-pre-wrap leading-relaxed">
              {listing.description}
            </p>
          </div>
          
          {/* Seller Info */}
          <div className="bg-gray-50 rounded-xl p-4">
            <h3 className="font-semibold text-gray-800 mb-3">Seller Information</h3>
            <div className="flex items-center space-x-3">
              <img 
                src={listing.profiles?.avatar_url || 'https://via.placeholder.com/50'} 
                alt={listing.profiles?.name}
                className="w-12 h-12 rounded-full object-cover"
              />
              <div className="flex-1">
                <p className="font-medium text-gray-800">{listing.profiles?.name}</p>
                <p className="text-sm text-gray-500">
                  {listing.profiles?.location || 'Location not set'}
                </p>
                <div className="flex items-center space-x-2 mt-1">
                  <span className="text-xs text-gray-500">⭐ {listing.profiles?.rating || 0}</span>
                  <span className="text-xs text-gray-400">•</span>
                  <span className="text-xs text-gray-500">{listing.profiles?.total_sales || 0} sales</span>
                </div>
              </div>
            </div>
          </div>
          
          {/* Contact Options */}
          {listing.status !== 'sold' && (
            <div className="space-y-3">
              <button
                onClick={handleWhatsApp}
                className="w-full bg-green-500 text-white py-3 rounded-lg hover:bg-green-600 transition font-medium flex items-center justify-center space-x-2"
              >
                <FiWhatsApp size={20} />
                <span>Contact via WhatsApp</span>
              </button>
              
              <form onSubmit={handleSendMessage} className="space-y-3">
                <textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="I'm interested in this item. Is it still available?"
                  rows="3"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 resize-none"
                />
                <button 
                  type="submit" 
                  className="w-full bg-blue-500 text-white py-3 rounded-lg hover:bg-blue-600 transition flex items-center justify-center space-x-2"
                >
                  <FiMessageCircle size={18} />
                  <span>Send Message</span>
                </button>
              </form>
            </div>
          )}

          {/* Share Button */}
          <button
            onClick={handleShare}
            className="w-full border border-gray-300 text-gray-600 py-3 rounded-lg hover:bg-gray-50 transition flex items-center justify-center space-x-2"
          >
            <FiShare2 size={18} />
            <span>Share this item</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default ListingDetail;