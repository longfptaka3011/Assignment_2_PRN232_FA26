import React from 'react';
import { Navigate, useLocation, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { ShieldAlert, ArrowLeft } from 'lucide-react';

interface ProtectedRouteProps {
  children: React.ReactNode;
  adminOnly?: boolean;
}

export default function ProtectedRoute({ children, adminOnly = false }: ProtectedRouteProps) {
  const { token, user, isAdmin } = useAuth();
  const location = useLocation();

  if (!token) {
    // Redirect unauthenticated visitors to /login
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (adminOnly && !isAdmin && user) {
    // 403 Forbidden view for non-admins
    return (
      <div style={{ maxWidth: '600px', margin: '40px auto', padding: '24px' }}>
        <div className="glass-card" style={{ padding: '36px', textAlign: 'center', borderRadius: '16px' }}>
          <div
            style={{
              width: '64px',
              height: '64px',
              borderRadius: '50%',
              backgroundColor: 'rgba(239, 68, 68, 0.1)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 20px',
              color: '#ef4444',
            }}
          >
            <ShieldAlert size={32} />
          </div>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '8px' }}>
            403 — Access Forbidden
          </h2>
          <p style={{ color: 'var(--text-muted, #94a3b8)', marginBottom: '24px', lineHeight: 1.6 }}>
            You are logged in as <strong>{user.fullName}</strong> ({user.roleName} role).
            This management module requires <strong>System Administrator</strong> privileges.
          </p>
          <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
            <Link
              to="/admin"
              className="btn btn-primary"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                padding: '10px 20px',
                borderRadius: '8px',
                textDecoration: 'none',
              }}
            >
              <ArrowLeft size={16} />
              <span>Back to Admin Dashboard</span>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
