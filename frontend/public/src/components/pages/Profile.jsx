import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import api from '../../utils/api';
import { FiUser, FiPhone, FiMapPin, FiMail, FiEdit2, FiShoppingBag, FiHeart, FiSave, FiX } from 'react-icons/fi';
import toast from 'react-hot-toast';

const Profile = () => {
  const { user, profile, updateProfile, logout, fetchUser } = useAuth();
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [userListings, setUserListings] = useState([]);
  const [favoritesCount, setFavoritesCount] = useState(0);
  const [salesCount, setSalesCount] = useState(0);
  const [uploading, setUploading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    location: '',
    avatar_url: '',
    bio: '',
  });

  useEffect(() => {
    if (profile) {
      setFormData({
        name: profile.name || '',
        phone: profile.phone || '',
        location: profile.location || '',
        avatar_url: profile.avatar_url || '',
        bio: profile.bio || '',
      });
    }
    fetchUserStats();
  }, [profile]);

  const fetchUserStats = async () => {
    try {
      // Fetch user's listings
      const listingsResponse = await api.get('/listings/user/my-listings');
      if (listingsResponse.data.success) {
        setUserListings(listingsResponse.data.listings);
        const soldCount = listingsResponse.data.listings.filter(l => l.status === 'sold').length;
        setSalesCount(soldCount);
      }

      // Fetch favorites count
      const favoritesResponse = await api.get('/favorites');
      if (favoritesResponse.data.success) {
        setFavoritesCount(favoritesResponse.data.favorites.length);
      }
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleImageChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Auto-upload image
    setUploading(true);
    try {
      const formDataUpload = new FormData();
      formDataUpload.append('avatar', file);

      const response = await api.post('/auth/upload-avatar', formDataUpload, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      if (response.data.success) {
        setFormData({ ...formData, avatar_url: response.data.avatar_url });
        toast.success('Profile picture uploaded!');
        e.target.value = '';
        await fetchUser();
      }
    } catch (error) {
      console.error('Upload error:', error);
      toast.error(error.response?.data?.message || 'Failed to upload image');
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const response = await api.put('/auth/profile', formData);
      if (response.data.success) {
        toast.success('Profile updated successfully!');
        setIsEditing(false);
        // Refresh user data
        await fetchUser();
      }
    } catch (error) {
      toast.error('Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  if (!user) {
    navigate('/login');
    return null;
  }

  const memberSince = user.created_at || user.user_metadata?.created_at || new Date().toISOString();

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
      {/* Profile Header */}
      <div className="bg-gradient-to-r from-green-600 to-green-500 rounded-2xl p-8 text-white mb-8">
        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
          <img
            src={profile?.avatar_url || 'https://via.placeholder.com/120'}
            alt={profile?.name || 'User'}
            className="w-28 h-28 rounded-full border-4 border-white shadow-lg object-cover"
            onError={(e) => {
              e.target.src = 'https://via.placeholder.com/120';
            }}
          />
          <div className="text-center sm:text-left flex-1">
            <h1 className="text-2xl font-bold">{profile?.name || user.email?.split('@')[0] || 'User'}</h1>
            <p className="text-green-100 mt-1">{user.email}</p>
            {profile?.location && (
              <p className="text-green-100 text-sm mt-2 flex items-center justify-center sm:justify-start gap-1">
                <FiMapPin size={14} />
                <span>{profile.location}</span>
              </p>
            )}
            <div className="flex flex-wrap justify-center sm:justify-start gap-4 mt-4">
              <div className="flex items-center gap-1 bg-white bg-opacity-20 rounded-full px-3 py-1">
                <FiShoppingBag size={14} />
                <span className="text-sm">{salesCount} {salesCount === 1 ? 'sale' : 'sales'}</span>
              </div>
              <div className="flex items-center gap-1 bg-white bg-opacity-20 rounded-full px-3 py-1">
                <FiHeart size={14} />
                <span className="text-sm">{favoritesCount} {favoritesCount === 1 ? 'favorite' : 'favorites'}</span>
              </div>
            </div>
          </div>
          <div className="sm:ml-auto">
            {!isEditing ? (
              <button
                onClick={() => setIsEditing(true)}
                className="bg-white text-green-600 px-4 py-2 rounded-lg hover:bg-gray-100 transition flex items-center gap-2 text-sm font-medium"
              >
                <FiEdit2 size={16} />
                <span>Edit Profile</span>
              </button>
            ) : (
              <button
                onClick={() => setIsEditing(false)}
                className="bg-gray-200 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-300 transition flex items-center gap-2 text-sm font-medium"
              >
                <FiX size={16} />
                <span>Cancel</span>
              </button>
            )}
          </div>
        </div>
      </div>
      
      {/* Profile Content */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Left Column - Stats */}
        <div className="space-y-4">
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
            <h3 className="font-semibold text-gray-800 mb-3">Member Since</h3>
            <p className="text-gray-600 text-sm">
              {new Date(memberSince).toLocaleDateString('en-PH', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              })}
            </p>
          </div>
          
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
            <h3 className="font-semibold text-gray-800 mb-3">Quick Links</h3>
            <div className="space-y-3">
              <Link 
                to="/my-listings" 
                className="flex items-center gap-3 text-gray-600 hover:text-green-600 transition group"
              >
                <FiShoppingBag size={18} className="group-hover:scale-110 transition" />
                <span>My Listings</span>
                <span className="text-xs text-gray-400 ml-auto">{userListings.length}</span>
              </Link>
              <Link 
                to="/favorites" 
                className="flex items-center gap-3 text-gray-600 hover:text-green-600 transition group"
              >
                <FiHeart size={18} className="group-hover:scale-110 transition" />
                <span>My Favorites</span>
                <span className="text-xs text-gray-400 ml-auto">{favoritesCount}</span>
              </Link>
            </div>
          </div>
        </div>
        
        {/* Right Column - Edit Form or View Info */}
        <div className="md:col-span-2">
          {isEditing ? (
            <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
              <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                <FiEdit2 size={18} className="text-green-600" />
                Edit Profile
              </h2>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    placeholder="Enter your name"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                  <input
                    type="email"
                    value={user.email}
                    disabled
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg bg-gray-50 text-gray-500"
                  />
                  <p className="text-xs text-gray-400 mt-1">Email cannot be changed</p>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    placeholder="09123456789"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
                  <input
                    type="text"
                    name="location"
                    value={formData.location}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    placeholder="e.g., Cebu City, Mandaue, Lapu-Lapu"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">Change Profile Picture</label>
                  <input
                    id="avatar-input"
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    disabled={uploading}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm disabled:bg-gray-100"
                  />
                  {uploading && (
                    <p className="text-sm text-blue-600 mt-2">Uploading image...</p>
                  )}
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Bio</label>
                  <textarea
                    name="bio"
                    rows="3"
                    value={formData.bio}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent resize-none"
                    placeholder="Tell buyers a bit about yourself..."
                  />
                </div>
                
                <div className="flex gap-3 pt-4">
                  <button 
                    type="submit" 
                    disabled={loading} 
                    className="flex-1 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition flex items-center justify-center gap-2 font-medium"
                  >
                    {loading ? (
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                    ) : (
                      <>
                        <FiSave size={16} />
                        Save Changes
                      </>
                    )}
                  </button>
                  <button 
                    type="button" 
                    onClick={handleLogout} 
                    className="px-6 py-2 border border-red-300 text-red-600 rounded-lg hover:bg-red-50 transition font-medium"
                  >
                    Logout
                  </button>
                </div>
              </form>
            </div>
          ) : (
            <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
              <h2 className="text-lg font-semibold text-gray-800 mb-4">Profile Information</h2>
              <div className="space-y-4">
                <div className="flex items-start gap-3 pb-3 border-b border-gray-100">
                  <FiUser className="text-gray-400 mt-1 flex-shrink-0" />
                  <div>
                    <p className="text-xs text-gray-400 uppercase tracking-wide">Full Name</p>
                    <p className="text-gray-800 font-medium">{profile?.name || 'Not set'}</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3 pb-3 border-b border-gray-100">
                  <FiMail className="text-gray-400 mt-1 flex-shrink-0" />
                  <div>
                    <p className="text-xs text-gray-400 uppercase tracking-wide">Email Address</p>
                    <p className="text-gray-800">{user.email}</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3 pb-3 border-b border-gray-100">
                  <FiPhone className="text-gray-400 mt-1 flex-shrink-0" />
                  <div>
                    <p className="text-xs text-gray-400 uppercase tracking-wide">Phone Number</p>
                    <p className="text-gray-800">{profile?.phone || 'Not set'}</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3 pb-3 border-b border-gray-100">
                  <FiMapPin className="text-gray-400 mt-1 flex-shrink-0" />
                  <div>
                    <p className="text-xs text-gray-400 uppercase tracking-wide">Location</p>
                    <p className="text-gray-800">{profile?.location || 'Not set'}</p>
                  </div>
                </div>
                
                {profile?.bio && (
                  <div className="pt-2">
                    <p className="text-xs text-gray-400 uppercase tracking-wide mb-2">Bio</p>
                    <p className="text-gray-600 text-sm leading-relaxed">{profile.bio}</p>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Profile;