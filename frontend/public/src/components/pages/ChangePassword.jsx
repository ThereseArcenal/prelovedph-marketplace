import React, { useState } from 'react';
import toast from 'react-hot-toast';
import api from '../../utils/api';

const ChangePassword = () => {
  const [formData, setFormData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const resetForm = () => {
    setFormData({
      currentPassword: '',
      newPassword: '',
      confirmPassword: ''
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validation
    if (!formData.currentPassword) {
      toast.error('Please enter your current password');
      return;
    }

    if (formData.newPassword.length < 6) {
      toast.error('New password must be at least 6 characters');
      return;
    }

    if (formData.newPassword !== formData.confirmPassword) {
      toast.error('New passwords do not match');
      return;
    }

    if (formData.currentPassword === formData.newPassword) {
      toast.error('New password must be different from current password');
      return;
    }

    setLoading(true);
    try {
      const response = await api.post('/auth/change-password', {
        currentPassword: formData.currentPassword,
        newPassword: formData.newPassword
      });

      if (response.data.success) {
        toast.success('Password changed successfully!');
        resetForm();
        setShowForm(false);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to change password');
    } finally {
      setLoading(false);
    }
  };

  if (!showForm) {
    return (
      <div className="bg-white rounded-lg border border-gray-200 p-6 mb-6">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">Security</h3>
            <p className="text-sm text-gray-600 mt-1">Manage your password and account security</p>
          </div>
          <button
            onClick={() => setShowForm(true)}
            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700
                     transition duration-200 font-medium text-sm"
          >
            Change Password
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6 mb-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-900">Change Password</h3>
        <button
          onClick={() => {
            setShowForm(false);
            resetForm();
          }}
          className="text-gray-400 hover:text-gray-600"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Current Password */}
        <div>
          <label htmlFor="currentPassword" className="block text-sm font-medium text-gray-700 mb-2">
            Current Password
          </label>
          <input
            id="currentPassword"
            name="currentPassword"
            type="password"
            autoComplete="current-password"
            required
            value={formData.currentPassword}
            onChange={handleChange}
            disabled={loading}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg
                     placeholder-gray-400 focus:outline-none focus:ring-2
                     focus:ring-green-500 focus:border-transparent
                     disabled:opacity-50 disabled:cursor-not-allowed"
            placeholder="••••••••"
          />
        </div>

        {/* New Password */}
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
            className="w-full px-4 py-2 border border-gray-300 rounded-lg
                     placeholder-gray-400 focus:outline-none focus:ring-2
                     focus:ring-green-500 focus:border-transparent
                     disabled:opacity-50 disabled:cursor-not-allowed"
            placeholder="••••••••"
          />
          <p className="mt-1 text-xs text-gray-500">
            Must be at least 6 characters
          </p>
        </div>

        {/* Confirm Password */}
        <div>
          <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-2">
            Confirm New Password
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
            className="w-full px-4 py-2 border border-gray-300 rounded-lg
                     placeholder-gray-400 focus:outline-none focus:ring-2
                     focus:ring-green-500 focus:border-transparent
                     disabled:opacity-50 disabled:cursor-not-allowed"
            placeholder="••••••••"
          />
        </div>

        {/* Info Box */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
          <p className="text-xs text-blue-700">
            💡 <strong>Security Tip:</strong> Use a strong password with a mix of letters, numbers, and special characters.
          </p>
        </div>

        {/* Buttons */}
        <div className="flex gap-3 pt-4">
          <button
            type="submit"
            disabled={loading}
            className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg
                     hover:bg-green-700 focus:outline-none focus:ring-2
                     focus:ring-offset-2 focus:ring-green-500
                     disabled:opacity-50 disabled:cursor-not-allowed
                     transition duration-200 font-medium"
          >
            {loading ? (
              <svg className="animate-spin h-5 w-5 text-white mx-auto" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            ) : (
              'Change Password'
            )}
          </button>
          <button
            type="button"
            onClick={() => {
              setShowForm(false);
              resetForm();
            }}
            disabled={loading}
            className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg
                     hover:bg-gray-50 focus:outline-none focus:ring-2
                     focus:ring-offset-2 focus:ring-green-500
                     disabled:opacity-50 disabled:cursor-not-allowed
                     transition duration-200 font-medium"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default ChangePassword;
