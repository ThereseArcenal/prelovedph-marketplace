import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const Register = () => {
  const navigate = useNavigate();
  const { register } = useAuth();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'buyer', // default role
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    // Clear error for this field
    if (errors[e.target.name]) {
      setErrors({ ...errors, [e.target.name]: '' });
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    if (!formData.role) {
      newErrors.role = 'Please select a role';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    setLoading(true);
    const result = await register(formData.name, formData.email, formData.password, formData.role);
    setLoading(false);

    if (result.success) {
      navigate('/login');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 to-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full">
        {/* Register Card */}
        <div className="bg-white rounded-2xl shadow-xl p-8">
          {/* Logo */}
          <div className="text-center mb-8">
            <div className="text-6xl mb-3">♻️</div>
            <h2 className="text-3xl font-bold text-gray-900">Create Account</h2>
            <p className="mt-2 text-gray-500">
              Join the <span className="text-green-600 font-medium">PrelovedPH</span> community
            </p>
          </div>
          
          {/* Form */}
          <form className="space-y-5" onSubmit={handleSubmit}>
            {/* Name */}
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                Full Name
              </label>
              <input
                id="name"
                name="name"
                type="text"
                autoComplete="name"
                required
                value={formData.name}
                onChange={handleChange}
                className={`block w-full px-4 py-3 border rounded-xl 
                         placeholder-gray-400 focus:outline-none focus:ring-2 
                         focus:ring-green-500 focus:border-transparent
                         ${errors.name ? 'border-red-500' : 'border-gray-300'}`}
                
              />
              {errors.name && (
                <p className="mt-1 text-xs text-red-500">{errors.name}</p>
              )}
            </div>
            
            {/* Email */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                Email Address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                value={formData.email}
                onChange={handleChange}
                className={`block w-full px-4 py-3 border rounded-xl
                         placeholder-gray-400 focus:outline-none focus:ring-2
                         focus:ring-green-500 focus:border-transparent
                         ${errors.email ? 'border-red-500' : 'border-gray-300'}`}
                placeholder="you@example.com"
              />
              {errors.email && (
                <p className="mt-1 text-xs text-red-500">{errors.email}</p>
              )}
            </div>

            {/* Role Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                I am a...
              </label>
              <div className="space-y-2">
                <div className="flex items-center p-4 border-2 rounded-xl cursor-pointer transition"
                     style={{borderColor: formData.role === 'buyer' ? 'rgb(22, 163, 74)' : 'rgb(209, 213, 219)'}}
                     onClick={() => setFormData({ ...formData, role: 'buyer' })}>
                  <input
                    type="radio"
                    id="buyer"
                    name="role"
                    value="buyer"
                    checked={formData.role === 'buyer'}
                    onChange={handleChange}
                    className="w-4 h-4 text-green-600 cursor-pointer"
                  />
                  <label htmlFor="buyer" className="ml-3 flex-1 cursor-pointer">
                    <span className="font-medium text-gray-900">Buyer</span>
                    <p className="text-xs text-gray-500">Browse and purchase preloved items</p>
                  </label>
                </div>

                <div className="flex items-center p-4 border-2 rounded-xl cursor-pointer transition"
                     style={{borderColor: formData.role === 'seller' ? 'rgb(22, 163, 74)' : 'rgb(209, 213, 219)'}}
                     onClick={() => setFormData({ ...formData, role: 'seller' })}>
                  <input
                    type="radio"
                    id="seller"
                    name="role"
                    value="seller"
                    checked={formData.role === 'seller'}
                    onChange={handleChange}
                    className="w-4 h-4 text-green-600 cursor-pointer"
                  />
                  <label htmlFor="seller" className="ml-3 flex-1 cursor-pointer">
                    <span className="font-medium text-gray-900">Seller</span>
                    <p className="text-xs text-gray-500">List and sell your preloved items</p>
                  </label>
                </div>
              </div>
              {errors.role && (
                <p className="mt-2 text-xs text-red-500">{errors.role}</p>
              )}
            </div>

            {/* Password */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="new-password"
                required
                value={formData.password}
                onChange={handleChange}
                className={`block w-full px-4 py-3 border rounded-xl 
                         placeholder-gray-400 focus:outline-none focus:ring-2 
                         focus:ring-green-500 focus:border-transparent
                         ${errors.password ? 'border-red-500' : 'border-gray-300'}`}
                placeholder="••••••••"
              />
              {errors.password && (
                <p className="mt-1 text-xs text-red-500">{errors.password}</p>
              )}
            </div>
            
            {/* Confirm Password */}
            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-2">
                Confirm Password
              </label>
              <input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                autoComplete="new-password"
                required
                value={formData.confirmPassword}
                onChange={handleChange}
                className={`block w-full px-4 py-3 border rounded-xl 
                         placeholder-gray-400 focus:outline-none focus:ring-2 
                         focus:ring-green-500 focus:border-transparent
                         ${errors.confirmPassword ? 'border-red-500' : 'border-gray-300'}`}
                placeholder="••••••••"
              />
              {errors.confirmPassword && (
                <p className="mt-1 text-xs text-red-500">{errors.confirmPassword}</p>
              )}
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full flex justify-center py-3 px-4 border border-transparent 
                       text-sm font-semibold rounded-xl text-white bg-green-600 
                       hover:bg-green-700 focus:outline-none focus:ring-2 
                       focus:ring-offset-2 focus:ring-green-500 
                       disabled:opacity-50 disabled:cursor-not-allowed
                       transition duration-200 mt-6"
            >
              {loading ? (
                <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              ) : (
                'Sign up'
              )}
            </button>
            
            {/* Sign In Link */}
            <div className="text-center pt-4">
              <p className="text-sm text-gray-600">
                Already have an account?{' '}
                <Link to="/login" className="font-medium text-green-600 hover:text-green-500">
                  Sign in
                </Link>
              </p>
            </div>
            
            {/* Terms */}
            <p className="text-xs text-gray-400 text-center pt-2">
              By signing up, you agree to our{' '}
              <a href="#" className="text-green-600 hover:text-green-500">Terms of Service</a>
              {' '}and{' '}
              <a href="#" className="text-green-600 hover:text-green-500">Privacy Policy</a>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Register;