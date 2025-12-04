/**
 * Login Component - With Icons
 * 
 * Clean, accessible login form with properly aligned icons
 */

import { useEffect, useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Eye, EyeOff, Heart, AlertCircle, Loader2, Mail, Lock } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { loginSchema } from '../../utils/validators';

// Reusable input wrapper with icon
const InputWithIcon = ({ icon: Icon, children, hasError }) => (
  <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
    <div
      style={{
        position: 'absolute',
        left: '14px',
        top: '50%',
        transform: 'translateY(-50%)',
        pointerEvents: 'none',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: hasError ? '#f87171' : '#94a3b8',
        zIndex: 1,
      }}
    >
      <Icon style={{ width: '18px', height: '18px' }} />
    </div>
    {children}
  </div>
);

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
    mode: 'onBlur'
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
    <div className="auth-page">
      <div className="auth-container">
        {/* Header */}
        <div className="auth-header">
          <div className="auth-logo-container">
            <div className="auth-logo">
              <img src="/logo.png" alt="MindCure Logo" className="h-8 w-8 object-contain" />
            </div>
            <div className="auth-brand">
              <span className="auth-brand-name">MindCure</span>
              <span className="auth-brand-tagline">Mental Wellness</span>
            </div>
          </div>
          <h1 className="auth-title">Welcome back</h1>
          <p className="auth-subtitle">
            Sign in to continue your wellness journey
          </p>
        </div>

        {/* Form Card */}
        <div className="auth-card">
          <form onSubmit={handleSubmit(onSubmit)} noValidate>
            {/* Error Alert */}
            {error && (
              <div className="auth-error">
                <AlertCircle className="h-5 w-5 flex-shrink-0" />
                <p>{error}</p>
              </div>
            )}

            <div className="auth-form-fields">
              {/* Email Field */}
              <div className="auth-field">
                <label htmlFor="email" className="auth-label">
                  Email address
                </label>
                <InputWithIcon icon={Mail} hasError={errors.email}>
                  <input
                    {...register('email')}
                    id="email"
                    type="email"
                    autoComplete="email"
                    className={`auth-input auth-input-icon ${errors.email ? 'auth-input-error' : ''}`}
                    placeholder="you@example.com"
                  />
                </InputWithIcon>
                {errors.email && (
                  <p className="auth-field-error">
                    <AlertCircle className="h-4 w-4" />
                    {errors.email.message}
                  </p>
                )}
              </div>

              {/* Password Field */}
              <div className="auth-field">
                <label htmlFor="password" className="auth-label">
                  Password
                </label>
                <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                  <div
                    style={{
                      position: 'absolute',
                      left: '14px',
                      top: '50%',
                      transform: 'translateY(-50%)',
                      pointerEvents: 'none',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: errors.password ? '#f87171' : '#94a3b8',
                      zIndex: 1,
                    }}
                  >
                    <Lock style={{ width: '18px', height: '18px' }} />
                  </div>
                  <input
                    {...register('password')}
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    autoComplete="current-password"
                    className={`auth-input auth-input-icon-both ${errors.password ? 'auth-input-error' : ''}`}
                    placeholder="Enter your password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((prev) => !prev)}
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                    style={{
                      position: 'absolute',
                      right: '12px',
                      top: '50%',
                      transform: 'translateY(-50%)',
                      background: 'transparent',
                      border: 'none',
                      padding: '4px',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: '#64748b',
                      borderRadius: '6px',
                      transition: 'all 0.2s',
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.color = '#0ea5e9';
                      e.currentTarget.style.background = 'rgba(14, 165, 233, 0.1)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.color = '#64748b';
                      e.currentTarget.style.background = 'transparent';
                    }}
                  >
                    {showPassword ? (
                      <EyeOff style={{ width: '20px', height: '20px' }} />
                    ) : (
                      <Eye style={{ width: '20px', height: '20px' }} />
                    )}
                  </button>
                </div>
                {errors.password && (
                  <p className="auth-field-error">
                    <AlertCircle className="h-4 w-4" />
                    {errors.password.message}
                  </p>
                )}
              </div>
            </div>

            {/* Forgot Password Link */}
            <div className="auth-forgot">
              <Link to="/forgot-password">
                Forgot your password?
              </Link>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading || isSubmitting}
              className="auth-submit"
            >
              {isLoading ? (
                <>
                  <Loader2 className="h-5 w-5 animate-spin" />
                  <span>Signing in...</span>
                </>
              ) : (
                <span>Sign in</span>
              )}
            </button>

            {/* Register Link */}
            <p className="auth-switch">
              Don't have an account?{' '}
              <Link to="/register">Sign up for free</Link>
            </p>
          </form>
        </div>

        {/* Crisis Help */}
        <div className="auth-crisis">
          <p>
            Need immediate help?{' '}
            <a href="tel:14416">Call Tele-MANAS 14416</a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
