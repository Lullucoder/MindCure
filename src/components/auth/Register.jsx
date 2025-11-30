/**
 * Register Component - With Icons
 * 
 * Clean, accessible registration form with properly aligned icons
 */

import { useEffect, useState, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Eye, EyeOff, Heart, AlertCircle, Loader2, Check, X, Mail, Lock, User } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

// Enhanced schema with strong password requirements
const registerSchema = z
  .object({
    firstName: z
      .string()
      .min(1, 'First name is required')
      .min(2, 'First name must be at least 2 characters')
      .max(50, 'First name must be less than 50 characters')
      .regex(/^[a-zA-Z\s-']+$/, 'First name can only contain letters'),
    lastName: z
      .string()
      .min(1, 'Last name is required')
      .min(2, 'Last name must be at least 2 characters')
      .max(50, 'Last name must be less than 50 characters')
      .regex(/^[a-zA-Z\s-']+$/, 'Last name can only contain letters'),
    email: z
      .string()
      .min(1, 'Email is required')
      .email('Please enter a valid email address'),
    password: z
      .string()
      .min(1, 'Password is required')
      .min(8, 'Password must be at least 8 characters')
      .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
      .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
      .regex(/[0-9]/, 'Password must contain at least one number')
      .regex(/[@$!%*?&]/, 'Password must contain at least one special character (@$!%*?&)'),
    confirmPassword: z
      .string()
      .min(1, 'Please confirm your password'),
    role: z.enum(['student', 'counselor'], {
      message: 'Please select a role'
    }),
    agreeToTerms: z
      .boolean()
      .refine((val) => val === true, 'You must agree to the terms and conditions')
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ['confirmPassword']
  });

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

// Password input with both left icon and right toggle
const PasswordInput = ({ 
  register: registerField, 
  id, 
  placeholder, 
  autoComplete, 
  hasError, 
  showPassword, 
  onToggle 
}) => (
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
      <Lock style={{ width: '18px', height: '18px' }} />
    </div>
    <input
      {...registerField}
      id={id}
      type={showPassword ? 'text' : 'password'}
      autoComplete={autoComplete}
      className={`auth-input auth-input-icon-both ${hasError ? 'auth-input-error' : ''}`}
      placeholder={placeholder}
    />
    <button
      type="button"
      onClick={onToggle}
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
);

// Password strength checker component
const PasswordStrengthIndicator = ({ password }) => {
  const requirements = useMemo(() => [
    { label: 'At least 8 characters', met: password.length >= 8 },
    { label: 'One uppercase letter', met: /[A-Z]/.test(password) },
    { label: 'One lowercase letter', met: /[a-z]/.test(password) },
    { label: 'One number', met: /[0-9]/.test(password) },
    { label: 'One special character (@$!%*?&)', met: /[@$!%*?&]/.test(password) },
  ], [password]);

  const strength = requirements.filter(r => r.met).length;
  const strengthLabel = strength <= 2 ? 'Weak' : strength <= 4 ? 'Medium' : 'Strong';
  const strengthColor = strength <= 2 ? 'bg-red-500' : strength <= 4 ? 'bg-yellow-500' : 'bg-green-500';

  if (!password) return null;

  return (
    <div className="password-strength">
      <div className="password-strength-bar">
        {[1, 2, 3, 4, 5].map((i) => (
          <div
            key={i}
            className={`password-strength-segment ${i <= strength ? strengthColor : 'bg-gray-200'}`}
          />
        ))}
      </div>
      <p className={`password-strength-label ${
        strength <= 2 ? 'text-red-600' : strength <= 4 ? 'text-yellow-600' : 'text-green-600'
      }`}>
        Password strength: {strengthLabel}
      </p>
      
      <div className="password-requirements">
        {requirements.map((req, idx) => (
          <div key={idx} className={`password-req-item ${req.met ? 'met' : ''}`}>
            {req.met ? (
              <Check className="h-3.5 w-3.5 text-green-500" />
            ) : (
              <X className="h-3.5 w-3.5 text-gray-400" />
            )}
            <span>{req.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

const Register = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const { signup, currentUser, authReady } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (authReady && currentUser) {
      navigate('/dashboard', { replace: true });
    }
  }, [authReady, currentUser, navigate]);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting }
  } = useForm({
    resolver: zodResolver(registerSchema),
    mode: 'onBlur'
  });

  const watchPassword = watch('password', '');

  const onSubmit = async (data) => {
    try {
      setError('');
      setIsLoading(true);
      await signup(data.email, data.password, {
        firstName: data.firstName,
        lastName: data.lastName,
        role: data.role
      });
      navigate('/dashboard');
    } catch (err) {
      const message = typeof err === 'string' ? err : err?.message || 'Failed to create account.';
      setError(message);
      console.error('Registration error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-container">
        {/* Header */}
        <div className="auth-header">
          <div className="auth-logo">
            <Heart className="h-8 w-8 text-white" />
          </div>
          <h1 className="auth-title">Create your account</h1>
          <p className="auth-subtitle">
            Start tracking your mental wellness journey today
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
              {/* Name Fields */}
              <div className="auth-field-row">
                <div className="auth-field">
                  <label htmlFor="firstName" className="auth-label">
                    First name
                  </label>
                  <InputWithIcon icon={User} hasError={errors.firstName}>
                    <input
                      {...register('firstName')}
                      id="firstName"
                      type="text"
                      autoComplete="given-name"
                      className={`auth-input auth-input-icon ${errors.firstName ? 'auth-input-error' : ''}`}
                      placeholder="First name"
                    />
                  </InputWithIcon>
                  {errors.firstName && (
                    <p className="auth-field-error">
                      <AlertCircle className="h-4 w-4" />
                      {errors.firstName.message}
                    </p>
                  )}
                </div>

                <div className="auth-field">
                  <label htmlFor="lastName" className="auth-label">
                    Last name
                  </label>
                  <InputWithIcon icon={User} hasError={errors.lastName}>
                    <input
                      {...register('lastName')}
                      id="lastName"
                      type="text"
                      autoComplete="family-name"
                      className={`auth-input auth-input-icon ${errors.lastName ? 'auth-input-error' : ''}`}
                      placeholder="Last name"
                    />
                  </InputWithIcon>
                  {errors.lastName && (
                    <p className="auth-field-error">
                      <AlertCircle className="h-4 w-4" />
                      {errors.lastName.message}
                    </p>
                  )}
                </div>
              </div>

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

              {/* Role Selection */}
              <div className="auth-field">
                <label htmlFor="role" className="auth-label">
                  I am a
                </label>
                <select
                  {...register('role')}
                  id="role"
                  className={`auth-input auth-select ${errors.role ? 'auth-input-error' : ''}`}
                >
                  <option value="">Select your role</option>
                  <option value="student">Student</option>
                  <option value="counselor">Mental Health Counselor</option>
                </select>
                {errors.role && (
                  <p className="auth-field-error">
                    <AlertCircle className="h-4 w-4" />
                    {errors.role.message}
                  </p>
                )}
              </div>

              {/* Password Field */}
              <div className="auth-field">
                <label htmlFor="password" className="auth-label">
                  Password
                </label>
                <PasswordInput
                  register={register('password')}
                  id="password"
                  placeholder="Create a strong password"
                  autoComplete="new-password"
                  hasError={errors.password}
                  showPassword={showPassword}
                  onToggle={() => setShowPassword((prev) => !prev)}
                />
                {errors.password && (
                  <p className="auth-field-error">
                    <AlertCircle className="h-4 w-4" />
                    {errors.password.message}
                  </p>
                )}
                <PasswordStrengthIndicator password={watchPassword} />
              </div>

              {/* Confirm Password Field */}
              <div className="auth-field">
                <label htmlFor="confirmPassword" className="auth-label">
                  Confirm password
                </label>
                <PasswordInput
                  register={register('confirmPassword')}
                  id="confirmPassword"
                  placeholder="Confirm your password"
                  autoComplete="new-password"
                  hasError={errors.confirmPassword}
                  showPassword={showConfirmPassword}
                  onToggle={() => setShowConfirmPassword((prev) => !prev)}
                />
                {errors.confirmPassword && (
                  <p className="auth-field-error">
                    <AlertCircle className="h-4 w-4" />
                    {errors.confirmPassword.message}
                  </p>
                )}
              </div>

              {/* Terms Checkbox */}
              <div className="auth-checkbox-wrapper">
                <input
                  {...register('agreeToTerms')}
                  id="agreeToTerms"
                  type="checkbox"
                  className="auth-checkbox"
                />
                <label htmlFor="agreeToTerms" className="auth-checkbox-label">
                  I agree to the{' '}
                  <Link to="/terms">Terms of Service</Link>{' '}
                  and{' '}
                  <Link to="/privacy">Privacy Policy</Link>
                </label>
              </div>
              {errors.agreeToTerms && (
                <p className="auth-field-error">
                  <AlertCircle className="h-4 w-4" />
                  {errors.agreeToTerms.message}
                </p>
              )}
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
                  <span>Creating account...</span>
                </>
              ) : (
                <span>Create account</span>
              )}
            </button>

            {/* Login Link */}
            <p className="auth-switch">
              Already have an account?{' '}
              <Link to="/login">Sign in here</Link>
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

export default Register;
