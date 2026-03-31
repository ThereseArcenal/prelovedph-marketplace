import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { FiUser, FiPhone, FiMapPin, FiMail, FiEdit2, FiShoppingBag, FiHeart } from 'react-icons/fi';

const Profile = () => {
  const { user, profile, updateProfile, logout } = useAuth();
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: profile?.name || '',
    phone: profile?.phone || '',
    location: profile?.location || '',
    avatar_url: profile?.avatar_url || '',
    bio: profile?.bio || '',
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const result = await updateProfile(formData);
    setLoading(false);
    if (result.success) {
      setIsEditing(false);
    }
  };

  if (!user) {
    navigate('/login');
    return null;
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
      {/* Profile Header */}
      <div className="bg-gradient-to-r from-green-600 to-green-500 rounded-2xl p-8 text-white mb-8">
        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
          <img
            src={profile?.avatar_url || 'https://via.placeholder.com/120'}
            alt={profile?.name}
            className="w-28 h-28 rounded-full border-4 border-white shadow-lg object-cover"
          />
          <div className="text-center sm:text-left">
            <h1 className="text-2xl font-bold">{profile?.name || user.email}</h1>
            <p className="text-green-100 mt-1">{user.email}</p>
            {profile?.location && (
              <p className="text-green-100 text-sm mt-2 flex items-center justify-center sm:justify-start space-x-1">
                <FiMapPin size={14} />
                <span>{profile.location}</span>
              </p>
            )}
            <div className="flex flex-wrap justify-center sm:justify-start gap-4 mt-4">
              <div className="flex items-center space-x-1 bg-white bg-opacity-20 rounded-full px-3 py-1">
                <FiShoppingBag size={14} />
                <span className="text-sm">0 sales</span>
              </div>
              <div className="flex items-center space-x-1 bg-white bg-opacity-20 rounded-full px-3 py-1">
                <FiHeart size={14} />
                <span className="text-sm">0 favorites</span>
              </div>
            </div>
          </div>
          <div className="sm:ml-auto">
            {!isEditing ? (
              <button
                onClick={() => setIsEditing(true)}
                className="bg-white text-green-600 px-4 py-2 rounded-lg hover:bg-gray-100 transition flex items-center space-x-2"
              >
                <FiEdit2 size={16} />
                <span>Edit Profile</span>
              </button>
            ) : (
              <button
                onClick={() => setIsEditing(false)}
                className="bg-gray-200 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-300 transition"
              >
                Cancel
              </button>
            )}
          </div>
        </div>
      </div>
      
      {/* Profile Content */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Left Column - Stats */}
        <div className="space-y-4">
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h3 className="font-semibold text-gray-800 mb-3">Member Since</h3>
            <p className="text-gray-600">
              {new Date(user.created_at).toLocaleDateString('en-PH', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              })}
            </p>
          </div>
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h3 className="font-semibold text-gray-800 mb-3">Quick Links</h3>
            <div className="space-y-2">
              <Link to="/my-listings" className="flex items-center space-x-2 text-gray-600 hover:text-green-600">
                <FiShoppingBag />
                <span>My Listings</span>
              </Link>
              <Link to="/favorites" className="flex items-center space-x-2 text-gray-600 hover:text-green-600">
                <FiHeart />
                <span>My Favorites</span>
              </Link>
            </div>
          </div>
        </div>
        
        {/* Right Column - Edit Form or View Info */}
        <div className="md:col-span-2">
          {isEditing ? (
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h2 className="text-lg font-semibold text-gray-800 mb-4">Edit Profile</h2>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className="input-field"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                  <input
                    type="email"
                    value={user.email}
                    disabled
                    className="input-field bg-gray-100"
                  />
                  <p className="text-xs text-gray-400 mt-1">Email cannot be changed</p>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    className="input-field"
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
                    className="input-field"
                    placeholder="Cebu City, Mandaue, etc."
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Avatar URL</label>
                  <input
                    type="url"
                    name="avatar_url"
                    value={formData.avatar_url}
                    onChange={handleChange}
                    className="input-field"
                    placeholder="https://..."
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Bio</label>
                  <textarea
                    name="bio"
                    rows="3"
                    value={formData.bio}
                    onChange={handleChange}
                    className="input-field resize-none"
                    placeholder="Tell buyers a bit about yourself..."
                  />
                </div>
                
                <div className="flex space-x-3 pt-4">
                  <button type="submit" disabled={loading} className="btn-primary flex-1">
                    {loading ? 'Saving...' : 'Save Changes'}
                  </button>
                  <button type="button" onClick={logout} className="btn-secondary">
                    Logout
                  </button>
                </div>
              </form>
            </div>
          ) : (
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h2 className="text-lg font-semibold text-gray-800 mb-4">Profile Information</h2>
              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <FiUser className="text-gray-400 mt-1" />
                  <div>
                    <p className="text-sm text-gray-500">Name</p>
                    <p className="text-gray-800">{profile?.name || 'Not set'}</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <FiMail className="text-gray-400 mt-1" />
                  <div>
                    <p className="text-sm text-gray-500">Email</p>
                    <p className="text-gray-800">{user.email}</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <FiPhone className="text-gray-400 mt-1" />
                  <div>
                    <p className="text-sm text-gray-500">Phone</p>
                    <p className="text-gray-800">{profile?.phone || 'Not set'}</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <FiMapPin className="text-gray-400 mt-1" />
                  <div>
                    <p className="text-sm text-gray-500">Location</p>
                    <p className="text-gray-800">{profile?.location || 'Not set'}</p>
                  </div>
                </div>
                {profile?.bio && (
                  <div className="pt-2 border-t border-gray-100">
                    <p className="text-sm text-gray-500 mb-1">Bio</p>
                    <p className="text-gray-800">{profile.bio}</p>
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