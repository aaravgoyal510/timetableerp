import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export const Login: React.FC = () => {
  const [staff_id, setStaffId] = useState('');
  const [pin, setPin] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const id = parseInt(staff_id, 10);
      if (isNaN(id)) {
        setError('Please enter a valid Staff ID');
        setIsLoading(false);
        return;
      }

      await login(id, pin);
      navigate('/dashboard');
    } catch (err: any) {
      setError(err.message || 'Login failed. Please check your Staff ID and PIN.');
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-600 via-purple-500 to-blue-500">
      <div className="w-full max-w-md px-6">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="text-6xl mb-4">🎓</div>
          <h1 className="text-4xl font-bold text-white mb-2">
            ERP Timetable System
          </h1>
          <p className="text-purple-100">Manage your institution efficiently</p>
        </div>

        {/* Card */}
        <div className="bg-white rounded-2xl shadow-2xl p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">
            Sign In
          </h2>

          {error && (
            <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Staff ID Input */}
            <div>
              <label htmlFor="staff_id" className="block text-sm font-medium text-gray-700 mb-2">
                Staff ID
              </label>
              <input
                id="staff_id"
                type="text"
                value={staff_id}
                onChange={(e) => setStaffId(e.target.value)}
                placeholder="Enter your Staff ID"
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-purple-500 transition"
                disabled={isLoading}
              />
            </div>

            {/* PIN Input */}
            <div>
              <label htmlFor="pin" className="block text-sm font-medium text-gray-700 mb-2">
                PIN
              </label>
              <input
                id="pin"
                type="password"
                value={pin}
                onChange={(e) => setPin(e.target.value)}
                placeholder="Enter your PIN"
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-purple-500 transition"
                disabled={isLoading}
              />
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full mt-6 px-4 py-3 bg-gradient-to-r from-purple-600 to-purple-500 hover:from-purple-700 hover:to-purple-600 text-white rounded-lg font-medium transition shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>

          {/* Footer */}
          <div className="mt-6 text-center text-sm text-gray-600">
            <p>Use your staff credentials to access the system</p>
          </div>
        </div>

        {/* Demo Info */}
        <div className="mt-6 text-center text-sm bg-white/10 backdrop-blur-sm rounded-lg p-4">
          <p className="text-white mb-2">Demo Credentials:</p>
          <p className="font-mono text-white font-medium">Staff ID: 1 | PIN: 1234</p>
        </div>
      </div>
    </div>
  );
};

export default Login;
