import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import toast from 'react-hot-toast';
import api from '../../utils/api';

const ResetPassword = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [formData, setFormData] = useState({
    newPassword: '',
    confirmPassword: ''
  });
  const [loading, setLoading] = useState(false);
  const [validToken, setValidToken] = useState(true);

  useEffect(() => {
    // Check if token exists in URL
    const token = searchParams.get('token');
    const type = searchParams.get('type');

    if (!token || type !== 'recovery') {
      setValidToken(false);
      toast.error('Invalid or expired reset link');
    }
  }, [searchParams]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.newPassword.length < 6) {
      toast.error('Password must be at least 6 characters');
      return;
    }

    if (formData.newPassword !== formData.confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }

    setLoading(true);
    try {
      const token = searchParams.get('token');
      const email = searchParams.get('email') || '';

      const response = await api.post('/auth/reset-password', {
        email,
        newPassword: formData.newPassword,
        token
      });

      if (response.data.success) {
        toast.success('Password reset successfully!');
        setTimeout(() => navigate('/login'), 2000);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to reset password');
    } finally {
      setLoading(false);
    }
  };

  if (!validToken) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 to-gray-100 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full">
          <div className="bg-white rounded-2xl shadow-xl p-8 text-center">
            {/* Error Icon */}
            <div className="mb-6">
              <div className="mx-auto w-16 h-16 bg-red-100 rounded-full flex items-center justify-center">
                <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </div>
            </div>

            <h2 className="text-2xl font-bold text-gray-900 mb-2">Invalid Link</h2>
            <p className="text-gray-600 mb-6">
              This password reset link is invalid or has expired. Please request a new one.
            </p>

            <button
              onClick={() => navigate('/forgot-password')}
              className="w-full flex justify-center py-3 px-4 border border-transparent
                       text-sm font-semibold rounded-xl text-white bg-green-600
                       hover:bg-green-700 focus:outline-none focus:ring-2
                       focus:ring-offset-2 focus:ring-green-500 transition duration-200"
            >
              Request New Link
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 to-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full">
        {/* Reset Password Card */}
        <div className="bg-white rounded-2xl shadow-xl p-8">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="text-6xl mb-3">🔑</div>
            <h2 className="text-3xl font-bold text-gray-900">Reset Password</h2>
            <p className="mt-2 text-gray-500">
              Enter your new password below
            </p>
          </div>

          {/* Form */}
          <form className="space-y-6" onSubmit={handleSubmit}>
            {/* New Password Field */}
            <div>
              <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700 mb-2">
                New Password
              </label>
              <input
                id="newPassword"
                name="newPassword"
                type="password"
                autoComplete="new-password"
                required
                value={formData.newPassword}
                onChange={handleChange}
                disabled={loading}
                className="block w-full px-4 py-3 border border-gray-300 rounded-xl
                         placeholder-gray-400 focus:outline-none focus:ring-2
                         focus:ring-green-500 focus:border-transparent
                         disabled:opacity-50 disabled:cursor-not-allowed"
                placeholder="••••••••"
              />
              <p className="mt-1 text-xs text-gray-500">
                Must be at least 6 characters
              </p>
            </div>

            {/* Confirm Password Field */}
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
                disabled={loading}
                className="block w-full px-4 py-3 border border-gray-300 rounded-xl
                         placeholder-gray-400 focus:outline-none focus:ring-2
                         focus:ring-green-500 focus:border-transparent
                         disabled:opacity-50 disabled:cursor-not-allowed"
                placeholder="••••••••"
              />
            </div>

            {/* Password Requirements */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
              <p className="text-xs text-blue-700">
                ✓ At least 6 characters<br />
                ✓ Use a mix of letters and numbers for better security
              </p>
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
                       transition duration-200"
            >
              {loading ? (
                <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              ) : (
                'Reset Password'
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;
