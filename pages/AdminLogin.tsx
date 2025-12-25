import React, { useState } from 'react';
import { Eye, EyeOff, Lock, Mail, AlertTriangle, ArrowRight, CheckCircle, WifiOff, HelpCircle } from 'lucide-react';
// @ts-ignore - bypassing broken framer-motion types in this environment
import { motion as framerMotion, AnimatePresence } from 'framer-motion';
const motion = framerMotion as any;
import { supabase } from '../services/supabaseClient.ts';
import { useNavigate } from '../services/dataService.ts';

const AdminLogin = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    if (error) setError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    setSuccessMessage(null);

    try {
      if (!formData.email || !formData.password) {
        throw new Error('Please enter both email and password.');
      }

      // Explicitly sign out before attempting to sign in to clear stale sessions
      await supabase.auth.signOut();

      const { data, error: authError } = await supabase.auth.signInWithPassword({
        email: formData.email,
        password: formData.password,
      });

      if (authError) {
        if (authError.message === 'Invalid login credentials') {
          throw new Error('Invalid email or password.');
        }
        throw authError;
      }

      if (data.user) {
        setSuccessMessage('Login successful! Redirecting...');
        setTimeout(() => navigate('/admin/dashboard'), 1000);
      }

    } catch (err: any) {
      console.error('Auth Process Error:', err);
      let message = err.message || 'Authentication failed.';
      if (message.includes('Failed to fetch')) {
        message = 'Unable to connect to the server. Please check your internet connection.';
      }
      setError(message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 pt-24 pb-12 bg-warm-white">
      <div className="w-full max-w-md">
        
        {/* Error/Success Messages */}
        <AnimatePresence>
          {error && (
            <motion.div 
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="bg-red-50 border border-red-200 rounded-xl p-4 mb-4 flex items-start gap-3 shadow-sm"
            >
              {error.includes('connect') ? <WifiOff className="text-red-600 flex-shrink-0" size={20} /> : <AlertTriangle className="text-red-600 flex-shrink-0" size={20} />}
              <div className="flex-1">
                 <p className="text-sm text-red-700 mt-0.5 leading-snug font-medium text-left">{error}</p>
              </div>
            </motion.div>
          )}

          {successMessage && (
            <motion.div 
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="bg-green-50 border border-green-200 rounded-xl p-4 mb-4 flex items-start gap-3 shadow-sm"
            >
              <CheckCircle className="text-green-600 flex-shrink-0" size={20} />
              <p className="text-sm text-green-700 mt-0.5 text-left">{successMessage}</p>
            </motion.div>
          )}
        </AnimatePresence>

        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden"
        >
          <div className="bg-deep-green p-8 text-center relative transition-all duration-300">
            <h1 className="font-serif text-3xl text-white mb-2">
              Only Admin Login
            </h1>
            <p className="text-sage-green text-sm">
              Please sign in to access the dashboard
            </p>
          </div>

          <div className="p-8">
            <form onSubmit={handleSubmit} className="space-y-5">
              
              <div className="space-y-1 text-left">
                <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider ml-1">Email Address</label>
                <div className="relative group">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-sage-green transition-colors" size={18} />
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full pl-11 pr-4 py-3 bg-gray-50 border border-gray-300 rounded-xl focus:ring-2 focus:ring-sage-green focus:border-transparent outline-none transition-all text-gray-800 placeholder-gray-400"
                    placeholder="name@example.com"
                    required
                  />
                </div>
              </div>

              <div className="space-y-1 text-left">
                <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider ml-1">Password</label>
                <div className="relative group">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-sage-green transition-colors" size={18} />
                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    className="w-full pl-11 pr-12 py-3 bg-gray-50 border border-gray-300 rounded-xl focus:ring-2 focus:ring-sage-green focus:border-transparent outline-none transition-all text-gray-800 placeholder-gray-400"
                    placeholder="Enter your password"
                    minLength={6}
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 focus:outline-none"
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-deep-green text-white py-3.5 rounded-xl font-medium hover:bg-opacity-90 transition-all flex justify-center items-center gap-2 shadow-lg shadow-deep-green/20 mt-4 disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                ) : (
                  <>
                    Sign In <ArrowRight size={18} />
                  </>
                )}
              </button>
            </form>
            
            <div className="text-center mt-6">
              <a href="mailto:meraki.yoga.healing@gmail.com" className="text-xs text-gray-400 hover:text-sage-green transition-colors flex items-center justify-center gap-1">
                  <HelpCircle size={12} /> Need help? Contact Support
              </a>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default AdminLogin;