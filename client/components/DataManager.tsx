'use client';

import { useState } from 'react';
import { signOut } from 'next-auth/react';
import { clearAllData, getAllUsers, getUserFromLocalStorage } from '@/utils/localStorage';
import { Trash2, RefreshCw, Users, Database, AlertTriangle } from 'lucide-react';

interface DataManagerProps {
  showTitle?: boolean;
  compact?: boolean;
}

export function DataManager({ showTitle = true, compact = false }: DataManagerProps) {
  const [isClearing, setIsClearing] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const currentUser = getUserFromLocalStorage();
  const allUsers = getAllUsers();

  const handleClearAllData = async () => {
    setIsClearing(true);
    try {
      // Clear localStorage data
      clearAllData();
      
      // Sign out to clear session cookies
      await signOut({ redirect: false });
      
      // Show success message
      alert('✅ All data cleared successfully! Redirecting to home page...');
      
      // Redirect to home and refresh
      window.location.href = '/';
    } catch (error) {
      console.error('Error clearing data:', error);
      alert('❌ Error clearing data. Please try again.');
    } finally {
      setIsClearing(false);
      setShowConfirm(false);
    }
  };

  const handleQuickClear = () => {
    setShowConfirm(true);
  };

  if (compact) {
    return (
      <div className="space-y-2">
        {!showConfirm ? (
          <button
            onClick={handleQuickClear}
            disabled={isClearing}
            className="inline-flex items-center gap-2 px-3 py-2 text-sm font-medium text-red-600 bg-red-50 border border-red-200 rounded-lg hover:bg-red-100 transition-colors duration-200 disabled:opacity-50"
          >
            <Trash2 className="h-4 w-4" />
            {isClearing ? 'Clearing...' : 'Clear All Data'}
          </button>
        ) : (
          <div className="space-y-2">
            <div className="text-sm text-red-700 font-medium">
              ⚠️ This will delete all users and reset everything!
            </div>
            <div className="flex gap-2">
              <button
                onClick={handleClearAllData}
                disabled={isClearing}
                className="inline-flex items-center gap-1 px-3 py-2 text-sm font-medium text-white bg-red-600 rounded-lg hover:bg-red-700 transition-colors duration-200"
              >
                <Trash2 className="h-3 w-3" />
                {isClearing ? 'Clearing...' : 'Yes, Clear All'}
              </button>
              <button
                onClick={() => setShowConfirm(false)}
                className="px-3 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors duration-200"
              >
                Cancel
              </button>
            </div>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6 space-y-4">
      {showTitle && (
        <div className="flex items-center gap-2">
          <Database className="h-5 w-5 text-gray-600" />
          <h3 className="text-lg font-semibold text-gray-900">Data Management</h3>
        </div>
      )}

      {/* Current Status */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm">
        <div className="flex items-center gap-2">
          <Users className="h-4 w-4 text-blue-600" />
          <span className="text-gray-600">Registered Users:</span>
          <span className="font-semibold">{allUsers.length}</span>
        </div>
        <div className="flex items-center gap-2">
          <Database className="h-4 w-4 text-green-600" />
          <span className="text-gray-600">Current User:</span>
          <span className="font-semibold">
            {currentUser ? currentUser.email : 'None'}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <RefreshCw className="h-4 w-4 text-purple-600" />
          <span className="text-gray-600">Storage:</span>
          <span className="font-semibold">localStorage</span>
        </div>
      </div>

      {/* Warning */}
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
        <div className="flex items-start gap-3">
          <AlertTriangle className="h-5 w-5 text-yellow-600 flex-shrink-0 mt-0.5" />
          <div className="text-sm">
            <h4 className="font-medium text-yellow-800 mb-1">
              Clear All Data
            </h4>
            <p className="text-yellow-700">
              This will permanently delete all registered users, clear your current session,
              and reset the authentication system. You'll be logged out and redirected to the home page.
            </p>
          </div>
        </div>
      </div>

      {/* Actions */}
      {!showConfirm ? (
        <div className="flex gap-3">
          <button
            onClick={handleQuickClear}
            disabled={isClearing}
            className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-red-600 bg-red-50 border border-red-200 rounded-lg hover:bg-red-100 transition-colors duration-200 disabled:opacity-50"
          >
            <Trash2 className="h-4 w-4" />
            {isClearing ? 'Processing...' : 'Clear All Data'}
          </button>
          
          <button
            onClick={() => window.location.reload()}
            className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-600 bg-gray-50 border border-gray-200 rounded-lg hover:bg-gray-100 transition-colors duration-200"
          >
            <RefreshCw className="h-4 w-4" />
            Refresh Page
          </button>
        </div>
      ) : (
        <div className="space-y-3">
          <div className="text-sm font-medium text-red-700">
            ⚠️ Are you absolutely sure? This action cannot be undone!
          </div>
          <div className="flex gap-3">
            <button
              onClick={handleClearAllData}
              disabled={isClearing}
              className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-lg hover:bg-red-700 transition-colors duration-200 disabled:opacity-50"
            >
              <Trash2 className="h-4 w-4" />
              {isClearing ? 'Clearing All Data...' : 'Yes, Delete Everything'}
            </button>
            <button
              onClick={() => setShowConfirm(false)}
              disabled={isClearing}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 border border-gray-200 rounded-lg hover:bg-gray-200 transition-colors duration-200"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Quick Stats */}
      {allUsers.length > 0 && (
        <div className="pt-4 border-t border-gray-200">
          <div className="text-xs text-gray-500 space-y-1">
            <p>Last registered: {allUsers[allUsers.length - 1]?.email}</p>
            <p>Created: {new Date(allUsers[allUsers.length - 1]?.createdAt).toLocaleString()}</p>
          </div>
        </div>
      )}
    </div>
  );
} 