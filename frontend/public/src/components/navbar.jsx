import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  FiMenu, FiX, FiUser, FiLogOut, FiPlusCircle, FiHome,
  FiInfo, FiShoppingBag, FiHeart, FiMessageCircle
} from 'react-icons/fi';

const Navbar = () => {
  const { user, profile, logout, unreadCount } = useAuth();
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const handleLogout = () => {
    logout();
    setIsMenuOpen(false);
    setIsDropdownOpen(false);
    navigate('/');
  };

  const navLinks = [
    { to: '/', label: 'Home', icon: FiHome },
    { to: '/listings', label: 'Browse', icon: FiShoppingBag },
    { to: '/about', label: 'About', icon: FiInfo },
  ];

  return (
    <nav className="bg-white shadow-md sticky top-0 z-50 border-b border-slate-200">
      <div className="container-custom">
        <div className="flex justify-between items-center h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2 group">
            <span className="text-3xl animate-bounce-slow">♻️</span>
            <span className="text-2xl font-bold bg-gradient-to-r from-emerald-500 to-emerald-700 bg-clip-text text-transparent group-hover:from-emerald-600 group-hover:to-emerald-800 transition duration-300">
              PrelovedPH
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {navLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className="text-slate-600 hover:text-emerald-600 transition-colors flex items-center space-x-1 font-medium"
              >
                <link.icon size={18} />
                <span>{link.label}</span>
              </Link>
            ))}

            {user ? (
              <div className="relative flex items-center space-x-4 border-l border-slate-200 pl-8">
                {/* Sell Item Button - Only for sellers */}
                {profile?.role === 'seller' && (
                  <Link
                    to="/create-listing"
                    className="btn-primary-sm flex items-center space-x-1"
                  >
                    <FiPlusCircle size={18} />
                    <span>Sell Item</span>
                  </Link>
                )}

                {/* Messages Icon */}
                <Link to="/messages" className="relative text-slate-600 hover:text-emerald-600 transition-colors">
                  <FiMessageCircle size={20} />
                  {unreadCount > 0 && (
                    <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold">
                      {unreadCount > 9 ? '9+' : unreadCount}
                    </span>
                  )}
                </Link>

                {/* User Dropdown */}
                <button
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  className="flex items-center space-x-2 focus:outline-none hover:opacity-75 transition-opacity"
                >
                  <img
                    src={profile?.avatar_url || 'https://via.placeholder.com/150'}
                    alt={profile?.name || 'User'}
                    className="w-10 h-10 rounded-full object-cover border-2 border-emerald-500"
                  />
                  <span className="text-slate-700 font-medium">{profile?.name?.split(' ')[0]}</span>
                </button>

                {isDropdownOpen && (
                  <div className="absolute right-0 mt-56 w-48 bg-white rounded-xl shadow-xl py-2 z-50 border border-slate-200 animate-scale-in">
                    <Link
                      to="/profile"
                      className="flex items-center space-x-2 px-4 py-3 text-slate-700 hover:bg-emerald-50 hover:text-emerald-600 transition-colors"
                      onClick={() => setIsDropdownOpen(false)}
                    >
                      <FiUser size={18} />
                      <span>My Profile</span>
                    </Link>
                    {/* My Listings - Only for sellers */}
                    {profile?.role === 'seller' && (
                      <Link
                        to="/my-listings"
                        className="flex items-center space-x-2 px-4 py-3 text-slate-700 hover:bg-emerald-50 hover:text-emerald-600 transition-colors"
                        onClick={() => setIsDropdownOpen(false)}
                      >
                        <FiShoppingBag size={18} />
                        <span>My Listings</span>
                      </Link>
                    )}
                    <Link
                      to="/favorites"
                      className="flex items-center space-x-2 px-4 py-3 text-slate-700 hover:bg-emerald-50 hover:text-emerald-600 transition-colors"
                      onClick={() => setIsDropdownOpen(false)}
                    >
                      <FiHeart size={18} />
                      <span>Favorites</span>
                    </Link>
                    <hr className="my-2 border-slate-200" />
                    <button
                      onClick={handleLogout}
                      className="flex items-center space-x-2 w-full px-4 py-3 text-red-600 hover:bg-red-50 transition-colors"
                    >
                      <FiLogOut size={18} />
                      <span>Logout</span>
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center space-x-3 border-l border-slate-200 pl-8">
                <Link to="/login" className="text-slate-600 hover:text-emerald-600 transition font-medium">
                  Login
                </Link>
                <Link
                  to="/register"
                  className="btn-primary-sm"
                >
                  Sign Up
                </Link>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center space-x-3">
            {user && (
              <Link to="/messages" className="relative">
                <FiMessageCircle size={20} className="text-slate-600" />
                {unreadCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                    {unreadCount}
                  </span>
                )}
              </Link>
            )}
            <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="text-slate-600">
              {isMenuOpen ? <FiX size={24} /> : <FiMenu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isMenuOpen && (
        <div className="md:hidden bg-white border-t border-slate-200 animate-slide-in-down">
          <div className="container-custom px-4 py-4 space-y-2">
            {navLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className="flex items-center space-x-2 py-3 text-slate-600 hover:text-emerald-600 hover:bg-emerald-50 px-3 rounded-lg transition-colors font-medium"
                onClick={() => setIsMenuOpen(false)}
              >
                <link.icon size={18} />
                <span>{link.label}</span>
              </Link>
            ))}

            {user ? (
              <>
                {/* Sell Item - Only for sellers */}
                {profile?.role === 'seller' && (
                  <Link
                    to="/create-listing"
                    className="flex items-center space-x-2 py-3 text-emerald-600 hover:bg-emerald-50 px-3 rounded-lg transition-colors font-medium"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <FiPlusCircle size={18} />
                    <span>Sell Item</span>
                  </Link>
                )}
                <Link
                  to="/profile"
                  className="flex items-center space-x-2 py-3 text-slate-600 hover:text-emerald-600 hover:bg-emerald-50 px-3 rounded-lg transition-colors font-medium"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <FiUser size={18} />
                  <span>Profile</span>
                </Link>
                {/* My Listings - Only for sellers */}
                {profile?.role === 'seller' && (
                  <Link
                    to="/my-listings"
                    className="flex items-center space-x-2 py-3 text-slate-600 hover:text-emerald-600 hover:bg-emerald-50 px-3 rounded-lg transition-colors font-medium"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <FiShoppingBag size={18} />
                    <span>My Listings</span>
                  </Link>
                )}
                <button
                  onClick={handleLogout}
                  className="flex items-center space-x-2 w-full py-3 text-red-600 hover:bg-red-50 px-3 rounded-lg transition-colors font-medium"
                >
                  <FiLogOut size={18} />
                  <span>Logout</span>
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="block py-3 px-3 text-slate-600 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors font-medium"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="block py-3 px-3 text-emerald-600 font-bold bg-emerald-50 rounded-lg hover:bg-emerald-100 transition-colors"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Sign Up
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
