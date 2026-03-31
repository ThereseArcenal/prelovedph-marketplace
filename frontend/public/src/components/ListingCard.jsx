import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { FiHeart, FiMapPin, FiClock, FiShare2 } from 'react-icons/fi';
import { useAuth } from '../context/AuthContext';
import api from '../utils/api';
import toast from 'react-hot-toast';

const ListingCard = ({ listing }) => {
  const { user } = useAuth();
  const [isFavorited, setIsFavorited] = useState(listing.is_favorited || false);

  const handleFavorite = async (e) => {
    e.preventDefault();
    if (!user) {
      toast.error('Please login to favorite items');
      return;
    }

    try {
      if (isFavorited) {
        await api.delete(`/favorites/${listing.id}`);
        toast.success('Removed from favorites');
      } else {
        await api.post(`/favorites`, { listing_id: listing.id });
        toast.success('Added to favorites!');
      }
      setIsFavorited(!isFavorited);
    } catch (error) {
      toast.error('Error updating favorites');
    }
  };

  const handleShare = (e) => {
    e.preventDefault();
    const url = `${window.location.origin}/listing/${listing.id}`;
    const text = `Check out this ${listing.title} on PrelovedPH!`;

    if (navigator.share) {
      navigator.share({
        title: listing.title,
        text: text,
        url: url,
      }).catch(err => console.log('Error sharing:', err));
    } else {
      navigator.clipboard.writeText(url);
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

  const getConditionColor = (condition) => {
    const colors = {
      'New': 'from-emerald-400 to-emerald-600',
      'Like New': 'from-blue-400 to-blue-600',
      'Good': 'from-yellow-400 to-yellow-600',
      'Fair': 'from-orange-400 to-orange-600',
    };
    return colors[condition] || 'from-slate-400 to-slate-600';
  };

  const getTimeAgo = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    return date.toLocaleDateString();
  };

  return (
    <Link to={`/listing/${listing.id}`}>
      <div className="card-hover group animate-fade-in">
        {/* Image Container */}
        <div className="relative overflow-hidden bg-gradient-to-br from-slate-200 to-slate-300 aspect-square rounded-t-xl">
          <img
            src={listing.image_urls?.[0] || 'https://via.placeholder.com/300?text=No+Image'}
            alt={listing.title}
            className="w-full h-full object-cover group-hover:scale-125 transition-transform duration-500"
            loading="lazy"
          />

          {/* Condition Badge */}
          {listing.condition && (
            <div className={`absolute top-4 left-4 px-4 py-2 rounded-full text-white text-sm font-bold bg-gradient-to-r ${getConditionColor(listing.condition)} shadow-lg`}>
              {listing.condition}
            </div>
          )}

          {/* Hot Deal Badge */}
          {listing.discount && (
            <div className="absolute top-4 right-4 px-3 py-1 bg-red-500 text-white rounded-full text-xs font-bold shadow-lg">
              🔥 -{listing.discount}%
            </div>
          )}

          {/* Action Buttons */}
          <div className="absolute top-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <button
              onClick={handleFavorite}
              className="bg-white rounded-full p-2 shadow-lg hover:bg-emerald-50 transition-colors"
            >
              <FiHeart
                size={20}
                className={isFavorited ? 'fill-red-500 text-red-500' : 'text-slate-600'}
              />
            </button>
            <button
              onClick={handleShare}
              className="bg-white rounded-full p-2 shadow-lg hover:bg-emerald-50 transition-colors"
            >
              <FiShare2 size={20} className="text-slate-600" />
            </button>
          </div>

          {/* Image Count */}
          {listing.image_urls && listing.image_urls.length > 1 && (
            <div className="absolute bottom-4 right-4 bg-black bg-opacity-70 text-white px-3 py-1 rounded-full text-xs font-bold">
              📷 {listing.image_urls.length}
            </div>
          )}
        </div>

        {/* Content */}
        <div className="p-5 flex flex-col flex-grow bg-white rounded-b-xl">
          {/* Category Tag */}
          {listing.category && (
            <div className="mb-2">
              <span className="text-xs font-bold text-emerald-600 uppercase tracking-wider">
                {listing.category}
              </span>
            </div>
          )}

          {/* Title */}
          <h3 className="font-bold text-slate-900 line-clamp-2 mb-2 group-hover:text-emerald-600 transition-colors text-lg">
            {listing.title}
          </h3>

          {/* Description */}
          <p className="text-slate-600 text-sm line-clamp-2 mb-4 flex-grow">
            {listing.description}
          </p>

          {/* Location & Time */}
          <div className="flex items-center justify-between text-xs text-slate-500 mb-4 space-x-2">
            {listing.location && (
              <div className="flex items-center space-x-1">
                <FiMapPin size={14} className="text-emerald-600" />
                <span>{listing.location}</span>
              </div>
            )}
            <div className="flex items-center space-x-1">
              <FiClock size={14} className="text-slate-400" />
              <span>{getTimeAgo(listing.created_at)}</span>
            </div>
          </div>

          {/* Price & Seller Info */}
          <div className="border-t border-slate-200 pt-4 flex items-end justify-between">
            <div>
              <p className="text-3xl font-bold text-emerald-600">
                {formatPrice(listing.price)}
              </p>
            </div>
            {listing.seller && (
              <div className="text-right">
                <img
                  src={listing.seller?.avatar_url || 'https://via.placeholder.com/32'}
                  alt={listing.seller?.name}
                  className="w-12 h-12 rounded-full object-cover border-2 border-emerald-500 mx-auto mb-1"
                  loading="lazy"
                />
                <p className="text-xs font-semibold text-slate-700">
                  {listing.seller?.name?.split(' ')[0]}
                </p>
                {listing.seller?.rating && (
                  <p className="text-xs text-yellow-500">
                    ★ {listing.seller.rating.toFixed(1)}
                  </p>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
};

export default ListingCard;
