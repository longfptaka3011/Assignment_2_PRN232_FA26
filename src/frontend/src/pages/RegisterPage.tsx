import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import {
  UserPlus,
  User,
  Mail,
  Lock,
  Eye,
  EyeOff,
  AlertCircle,
  CheckCircle2,
  ArrowRight,
  Shield,
} from 'lucide-react';
import './Auth.css';

export default function RegisterPage() {
  const { register } = useAuth();
  const toast = useToast();
  const navigate = useNavigate();

  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  // Field validation errors
  const [errors, setErrors] = useState<{
    fullName?: string;
    email?: string;
    password?: string;
    confirmPassword?: string;
  }>({});

  const validate = () => {
    const newErrors: {
      fullName?: string;
      email?: string;
      password?: string;
      confirmPassword?: string;
    } = {};

    if (!fullName.trim()) {
      newErrors.fullName = 'Full Name is required.';
    } else if (fullName.trim().length < 2) {
      newErrors.fullName = 'Full Name must be at least 2 characters.';
    }

    if (!email.trim()) {
      newErrors.email = 'Email address is required.';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      newErrors.email = 'Please enter a valid email address.';
    }

    if (!password) {
      newErrors.password = 'Password is required.';
    } else if (password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters.';
    }

    if (!confirmPassword) {
      newErrors.confirmPassword = 'Confirmation password is required.';
    } else if (confirmPassword !== password) {
      newErrors.confirmPassword = 'Passwords do not match.';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setSuccessMsg(null);

    if (!validate()) return;

    setLoading(true);
    try {
      await register({
        fullName: fullName.trim(),
        email: email.trim(),
        password,
      });

      setSuccessMsg('Account registered successfully! Redirecting to sign in...');
      toast.success('Registration successful! Please sign in with your credentials.');

      setTimeout(() => {
        navigate('/login', { replace: true });
      }, 1500);
    } catch (err: unknown) {
      const errResponse = (err as { response?: { status?: number; data?: { message?: string } } })?.response;
      if (errResponse?.status === 409) {
        const msg = errResponse?.data?.message || 'An account with this email address already exists.';
        setErrorMsg(msg);
        toast.error(msg);
      } else {
        const msg = errResponse?.data?.message || 'Failed to complete registration. Please try again.';
        setErrorMsg(msg);
        toast.error(msg);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page-wrapper">
      <div className="auth-card">
        <div className="auth-header">
          <div className="auth-badge">
            <Shield size={14} />
            <span>Staff Onboarding</span>
          </div>
          <h1 className="auth-title">Create Account</h1>
          <p className="auth-subtitle">
            Register as a team staff member to collaborate on projects and tasks.
          </p>
        </div>

        {errorMsg && (
          <div className="auth-alert-error">
            <AlertCircle size={18} style={{ flexShrink: 0, marginTop: '2px' }} />
            <span>{errorMsg}</span>
          </div>
        )}

        {successMsg && (
          <div className="auth-alert-success">
            <CheckCircle2 size={18} style={{ flexShrink: 0, marginTop: '2px' }} />
            <span>{successMsg}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="auth-form" noValidate>
          {/* Full Name */}
          <div className="auth-field">
            <label className="auth-label" htmlFor="fullName">
              Full Name
            </label>
            <div className="auth-input-wrapper">
              <User size={16} className="auth-input-icon" />
              <input
                id="fullName"
                type="text"
                className={`auth-input ${errors.fullName ? 'has-error' : ''}`}
                placeholder="e.g. Tran Nguyen Bao Long"
                value={fullName}
                onChange={(e) => {
                  setFullName(e.target.value);
                  if (errors.fullName) setErrors((prev) => ({ ...prev, fullName: undefined }));
                }}
                disabled={loading}
              />
            </div>
            {errors.fullName && <span className="auth-field-error">{errors.fullName}</span>}
          </div>

          {/* Email */}
          <div className="auth-field">
            <label className="auth-label" htmlFor="email">
              Email Address
            </label>
            <div className="auth-input-wrapper">
              <Mail size={16} className="auth-input-icon" />
              <input
                id="email"
                type="email"
                className={`auth-input ${errors.email ? 'has-error' : ''}`}
                placeholder="you@domain.com"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  if (errors.email) setErrors((prev) => ({ ...prev, email: undefined }));
                }}
                disabled={loading}
                autoComplete="email"
              />
            </div>
            {errors.email && <span className="auth-field-error">{errors.email}</span>}
          </div>

          {/* Password */}
          <div className="auth-field">
            <label className="auth-label" htmlFor="password">
              Password (minimum 6 characters)
            </label>
            <div className="auth-input-wrapper">
              <Lock size={16} className="auth-input-icon" />
              <input
                id="password"
                type={showPassword ? 'text' : 'password'}
                className={`auth-input ${errors.password ? 'has-error' : ''}`}
                placeholder="••••••••••••"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  if (errors.password) setErrors((prev) => ({ ...prev, password: undefined }));
                }}
                disabled={loading}
                autoComplete="new-password"
              />
              <button
                type="button"
                className="auth-toggle-pwd-btn"
                onClick={() => setShowPassword(!showPassword)}
                title={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
            {errors.password && <span className="auth-field-error">{errors.password}</span>}
          </div>

          {/* Confirm Password */}
          <div className="auth-field">
            <label className="auth-label" htmlFor="confirmPassword">
              Confirm Password
            </label>
            <div className="auth-input-wrapper">
              <Lock size={16} className="auth-input-icon" />
              <input
                id="confirmPassword"
                type={showPassword ? 'text' : 'password'}
                className={`auth-input ${errors.confirmPassword ? 'has-error' : ''}`}
                placeholder="••••••••••••"
                value={confirmPassword}
                onChange={(e) => {
                  setConfirmPassword(e.target.value);
                  if (errors.confirmPassword) setErrors((prev) => ({ ...prev, confirmPassword: undefined }));
                }}
                disabled={loading}
                autoComplete="new-password"
              />
            </div>
            {errors.confirmPassword && (
              <span className="auth-field-error">{errors.confirmPassword}</span>
            )}
          </div>

          {/* Submit Button */}
          <button type="submit" className="auth-submit-btn" disabled={loading}>
            {loading ? (
              <span>Creating Staff Account...</span>
            ) : (
              <>
                <UserPlus size={18} />
                <span>Create Staff Account</span>
                <ArrowRight size={16} />
              </>
            )}
          </button>
        </form>

        <div className="auth-footer">
          Already have an account?
          <Link to="/login" className="auth-footer-link">
            Sign In
          </Link>
        </div>
      </div>
    </div>
  );
}
