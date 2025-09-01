import React, { useState, useEffect } from 'react';
import { User, Mail, CreditCard, Key, Trash2 } from 'lucide-react';
import { useSelector } from 'react-redux';
import { updateUserData } from '../../utils/api';
import toast from 'react-hot-toast';

export default function Settings() {
  const user = useSelector((state: any) => state.user.authUserDetails);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  // Refresh user data when component mounts
  useEffect(() => {
    if (user) {
      updateUserData().catch(console.error);
    }
  }, []);

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-white">Loading...</div>
      </div>
    );
  }

  const handlePasswordUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword === confirmPassword) {
      // TODO: Implement password update API call
      
      toast.success('Password updated successfully!');
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } else {
      toast.error('New passwords do not match');
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">Settings</h1>
        <p className="text-gray-400">
          Manage your account settings and preferences
        </p>
      </div>

      <div className="space-y-8">
        {/* Profile Information */}
        <div className="bg-white/5 backdrop-blur-md rounded-xl border border-blue-500/20 p-8">
          <h2 className="text-xl font-semibold text-white mb-6 flex items-center">
            <User className="h-5 w-5 text-blue-400 mr-2" />
            Profile Information
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Name</label>
              <div className="px-4 py-3 bg-white/10 border border-gray-600 rounded-lg text-white">
                {user.profile.name}
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Email</label>
              <div className="px-4 py-3 bg-white/10 border border-gray-600 rounded-lg text-white flex items-center">
                <Mail className="h-4 w-4 text-gray-400 mr-2" />
                {user.profile.email}
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Plan</label>
              <div className="px-4 py-3 bg-white/10 border border-gray-600 rounded-lg text-white flex items-center">
                <CreditCard className="h-4 w-4 text-gray-400 mr-2" />
                {user.plan.currentPlan}
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Requests Left</label>
              <div className="px-4 py-3 bg-white/10 border border-gray-600 rounded-lg text-white">
                {user.plan.requestsLeft.toLocaleString()}
              </div>
            </div>
            
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-300 mb-2">Member Since</label>
              <div className="px-4 py-3 bg-white/10 border border-gray-600 rounded-lg text-white">
                {formatDate(user.profile.memberSince)}
              </div>
            </div>
          </div>
        </div>

        {/* Password Update */}
        <div className="bg-white/5 backdrop-blur-md rounded-xl border border-blue-500/20 p-8">
          <h2 className="text-xl font-semibold text-white mb-6 flex items-center">
            <Key className="h-5 w-5 text-blue-400 mr-2" />
            Update Password
          </h2>
          
          <form onSubmit={handlePasswordUpdate} className="space-y-4 max-w-md">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Current Password
              </label>
              <input
                type="password"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                className="w-full px-4 py-3 bg-white/10 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors"
                placeholder="Enter current password"
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                New Password
              </label>
              <input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="w-full px-4 py-3 bg-white/10 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors"
                placeholder="Enter new password"
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Confirm New Password
              </label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full px-4 py-3 bg-white/10 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors"
                placeholder="Confirm new password"
                required
              />
            </div>
            
            <button
              type="submit"
              disabled={newPassword !== confirmPassword || !newPassword}
              className="px-6 py-3 bg-gradient-to-r from-blue-600 to-cyan-600 text-white font-semibold rounded-lg hover:from-blue-500 hover:to-cyan-500 transition-all shadow-lg hover:shadow-blue-500/25 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Update Password
            </button>
          </form>
        </div>

        {/* Danger Zone */}
        <div className="bg-red-500/5 backdrop-blur-md rounded-xl border border-red-500/20 p-8">
          <h2 className="text-xl font-semibold text-red-400 mb-6 flex items-center">
            <Trash2 className="h-5 w-5 mr-2" />
            Danger Zone
          </h2>
          
          <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-4 mb-4">
            <p className="text-red-300 text-sm">
              <strong>Warning:</strong> This action is irreversible. All your bots, data, and API keys will be permanently deleted.
            </p>
          </div>
          
          <button
            onClick={() => setShowDeleteConfirm(true)}
            className="px-6 py-3 bg-red-600 text-white font-semibold rounded-lg hover:bg-red-700 transition-colors"
          >
            Delete Account
          </button>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-gray-900 rounded-xl border border-red-500/30 p-6 max-w-md mx-4">
            <h3 className="text-lg font-semibold text-white mb-4">Delete Account</h3>
            <p className="text-gray-300 mb-6">
              Are you absolutely sure? This will permanently delete your account, all bots, and cannot be undone.
            </p>
            <div className="flex space-x-3">
              <button
                onClick={() => setShowDeleteConfirm(false)}
                className="flex-1 px-4 py-2 bg-gray-700 text-gray-300 rounded-lg hover:bg-gray-600 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  // TODO: Implement account deletion API call
                  console.log('Account deleted');
                  toast.success('Account deleted successfully');
                  setShowDeleteConfirm(false);
                }}
                className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
              >
                Delete Forever
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}