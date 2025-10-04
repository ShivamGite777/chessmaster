import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuthStore } from '../store';
import { apiClient } from '../utils/api';
import { soundManager } from '../utils/sounds';

const RegisterPage: React.FC = () => {
  const navigate = useNavigate();
  const { login, setLoading } = useAuthStore();
  
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    agreeToTerms: false
  });
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState(0);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }

    // Calculate password strength
    if (name === 'password') {
      setPasswordStrength(calculatePasswordStrength(value));
    }
  };

  const calculatePasswordStrength = (password: string): number => {
    let strength = 0;
    if (password.length >= 8) strength += 1;
    if (/[a-z]/.test(password)) strength += 1;
    if (/[A-Z]/.test(password)) strength += 1;
    if (/[0-9]/.test(password)) strength += 1;
    if (/[^A-Za-z0-9]/.test(password)) strength += 1;
    return strength;
  };

  const getPasswordStrengthColor = (strength: number): string => {
    if (strength <= 2) return 'bg-danger';
    if (strength <= 3) return 'bg-yellow-500';
    return 'bg-success';
  };

  const getPasswordStrengthText = (strength: number): string => {
    if (strength <= 2) return 'Weak';
    if (strength <= 3) return 'Medium';
    return 'Strong';
  };

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};

    if (!formData.username) {
      newErrors.username = 'Username is required';
    } else if (formData.username.length < 3) {
      newErrors.username = 'Username must be at least 3 characters';
    } else if (!/^[a-zA-Z0-9_]+$/.test(formData.username)) {
      newErrors.username = 'Username can only contain letters, numbers, and underscores';
    }

    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters';
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password';
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    if (!formData.agreeToTerms) {
      newErrors.agreeToTerms = 'You must agree to the terms of service';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    soundManager.playClick();

    if (!validateForm()) return;

    setIsSubmitting(true);
    setLoading(true);

    try {
      const response = await apiClient.register({
        username: formData.username,
        email: formData.email,
        password: formData.password,
        confirmPassword: formData.confirmPassword
      });
      
      if (response.success && response.data) {
        localStorage.setItem('auth-token', response.data.token);
        login(response.data.user);
        navigate('/dashboard');
      } else {
        setErrors({ general: response.error || 'Registration failed' });
      }
    } catch (error: any) {
      setErrors({ 
        general: error.response?.data?.error || 'An error occurred during registration' 
      });
    } finally {
      setIsSubmitting(false);
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-dark-900 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        {/* Header */}
        <motion.div
          className="text-center"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <Link to="/" className="inline-block">
            <div className="w-16 h-16 bg-primary-500 rounded-xl flex items-center justify-center mx-auto mb-4">
              <span className="text-white font-bold text-2xl">♔</span>
            </div>
          </Link>
          <h2 className="text-3xl font-bold text-white">Create your account</h2>
          <p className="mt-2 text-gray-400">
            Join ChessMaster and start playing today
          </p>
        </motion.div>

        {/* Form */}
        <motion.form
          className="mt-8 space-y-6"
          onSubmit={handleSubmit}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.6 }}
        >
          <div className="glass-dark rounded-xl p-8 space-y-6">
            {/* General Error */}
            {errors.general && (
              <motion.div
                className="bg-danger/20 border border-danger/50 text-danger px-4 py-3 rounded-lg"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.2 }}
              >
                {errors.general}
              </motion.div>
            )}

            {/* Username Field */}
            <div>
              <label htmlFor="username" className="block text-sm font-medium text-gray-300 mb-2">
                Username
              </label>
              <input
                id="username"
                name="username"
                type="text"
                autoComplete="username"
                required
                className={`input-field ${errors.username ? 'border-danger focus:ring-danger' : ''}`}
                placeholder="Choose a username"
                value={formData.username}
                onChange={handleInputChange}
              />
              {errors.username && (
                <motion.p
                  className="mt-1 text-sm text-danger"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                >
                  {errors.username}
                </motion.p>
              )}
            </div>

            {/* Email Field */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-2">
                Email address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                className={`input-field ${errors.email ? 'border-danger focus:ring-danger' : ''}`}
                placeholder="Enter your email"
                value={formData.email}
                onChange={handleInputChange}
              />
              {errors.email && (
                <motion.p
                  className="mt-1 text-sm text-danger"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                >
                  {errors.email}
                </motion.p>
              )}
            </div>

            {/* Password Field */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-300 mb-2">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="new-password"
                required
                className={`input-field ${errors.password ? 'border-danger focus:ring-danger' : ''}`}
                placeholder="Create a password"
                value={formData.password}
                onChange={handleInputChange}
              />
              
              {/* Password Strength Indicator */}
              {formData.password && (
                <motion.div
                  className="mt-2"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                >
                  <div className="flex items-center space-x-2">
                    <div className="flex-1 bg-dark-700 rounded-full h-2">
                      <div
                        className={`h-2 rounded-full transition-all duration-300 ${getPasswordStrengthColor(passwordStrength)}`}
                        style={{ width: `${(passwordStrength / 5) * 100}%` }}
                      />
                    </div>
                    <span className={`text-xs font-medium ${
                      passwordStrength <= 2 ? 'text-danger' :
                      passwordStrength <= 3 ? 'text-yellow-500' : 'text-success'
                    }`}>
                      {getPasswordStrengthText(passwordStrength)}
                    </span>
                  </div>
                </motion.div>
              )}
              
              {errors.password && (
                <motion.p
                  className="mt-1 text-sm text-danger"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                >
                  {errors.password}
                </motion.p>
              )}
            </div>

            {/* Confirm Password Field */}
            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-300 mb-2">
                Confirm Password
              </label>
              <input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                autoComplete="new-password"
                required
                className={`input-field ${errors.confirmPassword ? 'border-danger focus:ring-danger' : ''}`}
                placeholder="Confirm your password"
                value={formData.confirmPassword}
                onChange={handleInputChange}
              />
              {errors.confirmPassword && (
                <motion.p
                  className="mt-1 text-sm text-danger"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                >
                  {errors.confirmPassword}
                </motion.p>
              )}
            </div>

            {/* Terms Agreement */}
            <div>
              <div className="flex items-start">
                <input
                  id="agreeToTerms"
                  name="agreeToTerms"
                  type="checkbox"
                  className="h-4 w-4 text-primary-500 focus:ring-primary-500 border-dark-600 rounded bg-dark-700 mt-1"
                  checked={formData.agreeToTerms}
                  onChange={handleInputChange}
                />
                <label htmlFor="agreeToTerms" className="ml-2 block text-sm text-gray-300">
                  I agree to the{' '}
                  <Link to="/terms" className="text-primary-400 hover:text-primary-300">
                    Terms of Service
                  </Link>{' '}
                  and{' '}
                  <Link to="/privacy" className="text-primary-400 hover:text-primary-300">
                    Privacy Policy
                  </Link>
                </label>
              </div>
              {errors.agreeToTerms && (
                <motion.p
                  className="mt-1 text-sm text-danger"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                >
                  {errors.agreeToTerms}
                </motion.p>
              )}
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? (
                <div className="flex items-center justify-center">
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                  Creating account...
                </div>
              ) : (
                'Create account'
              )}
            </button>
          </div>

          {/* Sign In Link */}
          <div className="text-center">
            <p className="text-gray-400">
              Already have an account?{' '}
              <Link
                to="/login"
                className="text-primary-400 hover:text-primary-300 font-medium transition-colors"
              >
                Sign in
              </Link>
            </p>
          </div>
        </motion.form>
      </div>
    </div>
  );
};

export default RegisterPage;