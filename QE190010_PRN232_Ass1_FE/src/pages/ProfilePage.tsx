import { useAuth } from '../context/AuthContext';
import {
  Mail,
  Shield,
  KeyRound,
  LogOut,
  CheckCircle2,
} from 'lucide-react';
import './Auth.css';

export default function ProfilePage() {
  const { user, logout } = useAuth();

  if (!user) return null;

  return (
    <div className="auth-page-wrapper" style={{ minHeight: 'auto', padding: '40px 16px' }}>
      <div className="auth-card" style={{ maxWidth: '560px' }}>
        <div className="auth-header">
          <div
            style={{
              width: '72px',
              height: '72px',
              borderRadius: '50%',
              backgroundColor: user.role === 1 ? 'rgba(99, 102, 241, 0.2)' : 'rgba(16, 185, 129, 0.2)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 16px',
              color: user.role === 1 ? '#818cf8' : '#34d399',
              fontSize: '1.75rem',
              fontWeight: 700,
            }}
          >
            {user.fullName.charAt(0).toUpperCase()}
          </div>
          <h1 className="auth-title">{user.fullName}</h1>
          <p className="auth-subtitle">{user.email}</p>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', marginBottom: '28px' }}>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '12px 16px',
              borderRadius: '10px',
              background: 'var(--surface-input, rgba(15, 23, 42, 0.6))',
              border: '1px solid var(--border-color, rgba(255, 255, 255, 0.08))',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <Shield size={18} style={{ color: '#818cf8' }} />
              <span style={{ fontSize: '0.875rem', fontWeight: 600 }}>Assigned Role</span>
            </div>
            <span
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '4px',
                padding: '3px 10px',
                borderRadius: '9999px',
                fontSize: '0.75rem',
                fontWeight: 700,
                background: user.role === 1 ? 'rgba(99, 102, 241, 0.2)' : 'rgba(16, 185, 129, 0.2)',
                color: user.role === 1 ? '#818cf8' : '#34d399',
              }}
            >
              <CheckCircle2 size={12} />
              <span>{user.roleName} ({user.role === 1 ? 'Admin' : 'Staff'})</span>
            </span>
          </div>

          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '12px 16px',
              borderRadius: '10px',
              background: 'var(--surface-input, rgba(15, 23, 42, 0.6))',
              border: '1px solid var(--border-color, rgba(255, 255, 255, 0.08))',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <KeyRound size={18} style={{ color: '#38bdf8' }} />
              <span style={{ fontSize: '0.875rem', fontWeight: 600 }}>System Account ID</span>
            </div>
            <span style={{ fontSize: '0.875rem', color: 'var(--text-muted, #94a3b8)', fontWeight: 600 }}>
              #{user.accountId}
            </span>
          </div>

          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '12px 16px',
              borderRadius: '10px',
              background: 'var(--surface-input, rgba(15, 23, 42, 0.6))',
              border: '1px solid var(--border-color, rgba(255, 255, 255, 0.08))',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <Mail size={18} style={{ color: '#10b981' }} />
              <span style={{ fontSize: '0.875rem', fontWeight: 600 }}>Verified Email</span>
            </div>
            <span style={{ fontSize: '0.875rem', color: 'var(--text-secondary, #cbd5e1)' }}>
              {user.email}
            </span>
          </div>
        </div>

        <button
          type="button"
          onClick={logout}
          style={{
            width: '100%',
            padding: '12px',
            borderRadius: '10px',
            background: 'rgba(239, 68, 68, 0.15)',
            border: '1px solid rgba(239, 68, 68, 0.3)',
            color: '#f87171',
            fontWeight: 600,
            fontSize: '0.9rem',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px',
            transition: 'all 0.2s ease',
          }}
        >
          <LogOut size={16} />
          <span>Sign Out of Account</span>
        </button>
      </div>
    </div>
  );
}
