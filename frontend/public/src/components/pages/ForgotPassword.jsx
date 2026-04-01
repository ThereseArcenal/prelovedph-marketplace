import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import api from '../../utils/api';

const ForgotPassword = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e) => {
    setEmail(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email) {
      toast.error('Please enter your email');
      return;
    }

    setLoading(true);
    try {
      const response = await api.post('/auth/forgot-password', { email });
      if (response.data.success) {
        setSubmitted(true);
        toast.success(response.data.message);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to send reset email');
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 to-gray-100 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full">
          <div className="bg-white rounded-2xl shadow-xl p-8 text-center">
            {/* Success Icon */}
            <div className="mb-6">
              <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
                <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
            </div>

            <h2 className="text-2xl font-bold text-gray-900 mb-2">Check your email</h2>
            <p className="text-gray-600 mb-6">
              We've sent a password reset link to <strong>{email}</strong>.
              Please check your email and click the link to reset your password.
            </p>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
              <p className="text-sm text-blue-700">
                💡 <strong>Tip:</strong> If you don't see the email, check your spam folder.
              </p>
            </div>

            {/* Back to Login */}
            <div className="space-y-3">
              <button
                onClick={() => navigate('/login')}
                className="w-full flex justify-center py-3 px-4 border border-transparent
                         text-sm font-semibold rounded-xl text-white bg-green-600
                         hover:bg-green-700 focus:outline-none focus:ring-2
                         focus:ring-offset-2 focus:ring-green-500 transition duration-200"
              >
                Back to Login
              </button>
              <button
                onClick={() => setSubmitted(false)}
                className="w-full flex justify-center py-3 px-4 border border-gray-300
                         text-sm font-semibold rounded-xl text-gray-700 bg-white
                         hover:bg-gray-50 focus:outline-none focus:ring-2
                         focus:ring-offset-2 focus:ring-green-500 transition duration-200"
              >
                Try another email
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 to-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full">
        {/* Forgot Password Card */}
        <div className="bg-white rounded-2xl shadow-xl p-8">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="text-6xl mb-3">🔐</div>
            <h2 className="text-3xl font-bold text-gray-900">Forgot Password?</h2>
            <p className="mt-2 text-gray-500">
              No worries! We'll help you reset it.
            </p>
          </div>

          {/* Form */}
          <form className="space-y-6" onSubmit={handleSubmit}>
            {/* Email Field */}
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
                value={email}
                onChange={handleChange}
                disabled={loading}
                className="block w-full px-4 py-3 border border-gray-300 rounded-xl
                         placeholder-gray-400 focus:outline-none focus:ring-2
                         focus:ring-green-500 focus:border-transparent
                         disabled:opacity-50 disabled:cursor-not-allowed"
                placeholder="you@example.com"
              />
              <p className="mt-2 text-sm text-gray-600">
                Enter the email address associated with your account.
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
                'Send Reset Link'
              )}
            </button>

            {/* Back to Login */}
            <div className="text-center pt-4">
              <p className="text-sm text-gray-600">
                Remember your password?{' '}
                <Link to="/login" className="font-medium text-green-600 hover:text-green-500">
                  Back to login
                </Link>
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
