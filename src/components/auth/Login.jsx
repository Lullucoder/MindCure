/**
 * Login Component
 * 
 * Features:
 * - Form validation with react-hook-form + zod
 * - Password visibility toggle
 * - Loading state handling
 * - Error display with icons
 * - Redirect after successful login
 * - Accessible form elements
 */

import { useEffect, useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Eye, EyeOff, Heart, Mail, Lock, AlertCircle, Loader2 } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { loginSchema } from '../../utils/validators';

const Login = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const { signin, currentUser, authReady } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const from = location.state?.from?.pathname || '/dashboard';

  useEffect(() => {
    if (authReady && currentUser) {
      navigate(from, { replace: true });
    }
  }, [authReady, currentUser, from, navigate]);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting }
  } = useForm({
    resolver: zodResolver(loginSchema),
    mode: 'onBlur' // Validate on blur for real-time feedback
  });

  const onSubmit = async (data) => {
    try {
      setError('');
      setIsLoading(true);
      await signin(data.email, data.password);
      navigate(from, { replace: true });
    } catch (err) {
      const message = typeof err === 'string' ? err : err?.message || 'Failed to sign in.';
      setError(message);
      console.error('Login error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-secondary-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex justify-center items-center mb-4">
            <div className="p-3 bg-primary-100 rounded-full">
              <Heart className="h-10 w-10 text-primary-600" />
            </div>
          </div>
          <h1 className="text-3xl font-bold text-gray-900">Welcome back</h1>
          <p className="mt-2 text-gray-600">
            Sign in to continue your wellness journey
          </p>
        </div>

        {/* Form Card */}
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <form onSubmit={handleSubmit(onSubmit)} noValidate>
            {/* Error Alert */}
            {error && (
              <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start gap-3" role="alert">
                <AlertCircle className="h-5 w-5 text-red-500 flex-shrink-0 mt-0.5" />
                <p className="text-sm text-red-700">{error}</p>
              </div>
            )}

            <div className="space-y-5">
              {/* Email Field */}
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                  Email address
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Mail className={`h-5 w-5 ${errors.email ? 'text-red-400' : 'text-gray-400'}`} />
                  </div>
                  <input
                    {...register('email')}
                    id="email"
                    type="email"
                    autoComplete="email"
                    className={`input-field pl-10 ${errors.email ? 'border-red-300 focus:border-red-500 focus:ring-red-500' : ''}`}
                    placeholder="Email address"
                    aria-invalid={errors.email ? 'true' : 'false'}
                    aria-describedby={errors.email ? 'email-error' : undefined}
                  />
                </div>
                {errors.email && (
                  <p id="email-error" className="mt-1.5 text-sm text-red-600 flex items-center gap-1" role="alert">
                    <AlertCircle className="h-4 w-4" />
                    {errors.email.message}
                  </p>
                )}
              </div>

              {/* Password Field */}
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                  Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock className={`h-5 w-5 ${errors.password ? 'text-red-400' : 'text-gray-400'}`} />
                  </div>
                  <input
                    {...register('password')}
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    autoComplete="current-password"
                    className={`input-field pl-10 pr-10 ${errors.password ? 'border-red-300 focus:border-red-500 focus:ring-red-500' : ''}`}
                    placeholder="Enter your password"
                    aria-invalid={errors.password ? 'true' : 'false'}
                    aria-describedby={errors.password ? 'password-error' : undefined}
                  />
                  <button
                    type="button"
                    className="absolute inset-y-0 right-0 pr-3 flex items-center hover:text-gray-600 transition-colors"
                    onClick={() => setShowPassword((prev) => !prev)}
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                  >
                    {showPassword ? (
                      <EyeOff className="h-5 w-5 text-gray-400" />
                    ) : (
                      <Eye className="h-5 w-5 text-gray-400" />
                    )}
                  </button>
                </div>
                {errors.password && (
                  <p id="password-error" className="mt-1.5 text-sm text-red-600 flex items-center gap-1" role="alert">
                    <AlertCircle className="h-4 w-4" />
                    {errors.password.message}
                  </p>
                )}
              </div>
            </div>

            {/* Forgot Password Link */}
            <div className="mt-4 text-right">
              <Link
                to="/forgot-password"
                className="text-sm font-medium text-primary-600 hover:text-primary-500 transition-colors"
              >
                Forgot your password?
              </Link>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading || isSubmitting}
              className="mt-6 btn-primary w-full flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <>
                  <Loader2 className="h-5 w-5 animate-spin" />
                  Signing in...
                </>
              ) : (
                'Sign in'
              )}
            </button>

            {/* Register Link */}
            <p className="mt-6 text-center text-sm text-gray-600">
              Don't have an account?{' '}
              <Link
                to="/register"
                className="font-semibold text-primary-600 hover:text-primary-500 transition-colors"
              >
                Sign up for free
              </Link>
            </p>
          </form>
        </div>

        {/* Crisis Help */}
        <div className="mt-8 text-center">
          <p className="text-sm text-gray-500">
            Need immediate help?{' '}
            <a
              href="tel:14416"
              className="font-semibold text-red-600 hover:text-red-500 transition-colors"
            >
              Call Tele-MANAS 14416
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
