import React, { useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import {
  LogIn,
  Mail,
  Lock,
  Eye,
  EyeOff,
  AlertCircle,
  Sparkles,
  ArrowRight,
  ShieldCheck,
} from 'lucide-react';
import './Auth.css';

export default function LoginPage() {
  const { login } = useAuth();
  const toast = useToast();
  const navigate = useNavigate();
  const location = useLocation();

  const from = (location.state as { from?: { pathname: string } })?.from?.pathname || '/admin';

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Field validation states
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({});

  const validate = () => {
    const newErrors: { email?: string; password?: string } = {};

    if (!email.trim()) {
      newErrors.email = 'Email address is required.';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      newErrors.email = 'Please enter a valid email address.';
    }

    if (!password) {
      newErrors.password = 'Password is required.';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    if (!validate()) return;

    setLoading(true);
    try {
      const res = await login({ email: email.trim(), password });
      toast.success(`Welcome back, ${res.fullName}!`);
      navigate(from, { replace: true });
    } catch (err: unknown) {
      const errorResponse = (err as { response?: { data?: { message?: string } } })?.response?.data;
      const message = errorResponse?.message || 'Invalid email or password. Please verify your credentials.';
      setErrorMsg(message);
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  const handleQuickFill = (demoEmail: string, demoPass: string) => {
    setEmail(demoEmail);
    setPassword(demoPass);
    setErrorMsg(null);
    setErrors({});
  };

  return (
    <div className="auth-page-wrapper">
      <div className="auth-card">
        <div className="auth-header">
          <div className="auth-badge">
            <ShieldCheck size={14} />
            <span>TaskTrack Security</span>
          </div>
          <h1 className="auth-title">Sign In</h1>
          <p className="auth-subtitle">
            Enter your credentials to access the protected management portal.
          </p>
        </div>

        {errorMsg && (
          <div className="auth-alert-error">
            <AlertCircle size={18} style={{ flexShrink: 0, marginTop: '2px' }} />
            <span>{errorMsg}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="auth-form" noValidate>
          {/* Email Field */}
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

          {/* Password Field */}
          <div className="auth-field">
            <label className="auth-label" htmlFor="password">
              Password
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
                autoComplete="current-password"
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

          {/* Submit Button */}
          <button type="submit" className="auth-submit-btn" disabled={loading}>
            {loading ? (
              <span>Authenticating...</span>
            ) : (
              <>
                <LogIn size={18} />
                <span>Sign In to Dashboard</span>
                <ArrowRight size={16} />
              </>
            )}
          </button>
        </form>

        {/* Quick Demo Credentials Box for Grader */}
        <div className="demo-credentials-box">
          <div className="demo-credentials-title">
            <Sparkles size={14} />
            <span>Grading Test Accounts (1-Click Fill)</span>
          </div>
          <div className="demo-credentials-btns">
            <button
              type="button"
              className="btn-demo-quick"
              onClick={() => handleQuickFill('admin@tasktrack.com', 'AdminPassword@123')}
            >
              <span className="demo-btn-role">Admin Account</span>
              <span className="demo-btn-email">admin@tasktrack.com</span>
            </button>
            <button
              type="button"
              className="btn-demo-quick"
              onClick={() => handleQuickFill('staff@tasktrack.com', 'StaffPassword@123')}
            >
              <span className="demo-btn-role">Staff Account</span>
              <span className="demo-btn-email">staff@tasktrack.com</span>
            </button>
          </div>
        </div>

        <div className="auth-footer">
          Don't have an account?
          <Link to="/register" className="auth-footer-link">
            Register as Staff
          </Link>
        </div>
      </div>
    </div>
  );
}
