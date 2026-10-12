import React, { useState, useEffect } from 'react';
import { NavLink, Link, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  CheckSquare,
  FolderKanban,
  Users,
  Tag,
  Search,
  Plus,
  Bell,
  HelpCircle,
  ChevronDown,
  Sun,
  Moon,
  Menu,
  X,
  ChevronLeft,
  ChevronRight,
  ShieldCheck,
  Shield,
  Building2,
  LogOut,
  LogIn,
  UserPlus,
  Sparkles,
  User as UserIcon,
} from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';
import { CommandPalette } from './ui/CommandPalette';
import './Layout.css';

interface LayoutProps {
  children: React.ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [cmdOpen, setCmdOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const { theme, toggleTheme } = useTheme();
  const { user, isAuthenticated, isAdmin, logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setCmdOpen((prev) => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Close user menu on outside click
  useEffect(() => {
    const handleDocClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (!target.closest('.topbar-user-dropdown-wrapper')) {
        setUserMenuOpen(false);
      }
    };
    if (userMenuOpen) {
      document.addEventListener('click', handleDocClick);
    }
    return () => document.removeEventListener('click', handleDocClick);
  }, [userMenuOpen]);

  // Public navigation links
  const publicNavItems = [
    { path: '/', label: 'Overview', icon: LayoutDashboard },
    { path: '/tasks', label: 'Tasks', icon: CheckSquare },
    { path: '/projects', label: 'Projects', icon: FolderKanban },
    { path: '/departments', label: 'Teams', icon: Building2 },
    { path: '/tags', label: 'Tags', icon: Tag },
    { path: '/search', label: 'Search Hub', icon: Search },
  ];

  // Protected admin management navigation links
  const adminNavItems = [
    { path: '/admin', label: 'Dashboard', icon: ShieldCheck, exact: true },
    { path: '/admin/departments', label: 'Manage Teams', icon: Building2 },
    { path: '/admin/projects', label: 'Manage Projects', icon: FolderKanban },
    { path: '/admin/tasks', label: 'Manage Tasks', icon: CheckSquare },
    { path: '/admin/tags', label: 'Manage Tags', icon: Tag },
  ];

  if (isAdmin) {
    adminNavItems.push({
      path: '/admin/accounts',
      label: 'Accounts',
      icon: Users,
    });
  }

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <div className={`app-layout ${collapsed ? 'sidebar-collapsed' : ''}`}>
      {/* Mobile Backdrop */}
      {mobileOpen && (
        <div className="mobile-backdrop" onClick={() => setMobileOpen(false)} />
      )}

      {/* Modern Sidebar Navigation */}
      <aside className={`app-sidebar ${mobileOpen ? 'mobile-open' : ''}`}>
        {/* Sidebar Header with Brand */}
        <div className="sidebar-header">
          <Link to="/" className="brand-logo" onClick={() => setMobileOpen(false)}>
            <div className="brand-mark">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <rect x="3" y="3" width="7" height="7" rx="2" fill="currentColor" />
                <rect x="14" y="3" width="7" height="7" rx="2" fill="currentColor" opacity="0.6" />
                <rect x="3" y="14" width="7" height="7" rx="2" fill="currentColor" opacity="0.6" />
                <rect x="14" y="14" width="7" height="7" rx="2" fill="#4f46e5" />
              </svg>
            </div>
            {!collapsed && (
              <div className="brand-text">
                <span className="brand-title">TASKTRACK</span>
                <span className="brand-subtitle">QE190010 • ASSIGNMENT 2</span>
              </div>
            )}
          </Link>

          <button
            className="sidebar-toggle-btn desktop-only"
            onClick={() => setCollapsed(!collapsed)}
            aria-label="Toggle sidebar"
            title={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          >
            {collapsed ? <ChevronRight size={15} /> : <ChevronLeft size={15} />}
          </button>

          <button
            className="sidebar-close-btn mobile-only"
            onClick={() => setMobileOpen(false)}
            aria-label="Close sidebar"
          >
            <X size={18} />
          </button>
        </div>

        {/* Sidebar Navigation */}
        <nav className="sidebar-nav" style={{ overflowY: 'auto' }}>
          {/* Public section header */}
          {!collapsed && (
            <div
              style={{
                fontSize: '0.65rem',
                fontWeight: 700,
                textTransform: 'uppercase',
                letterSpacing: '0.08em',
                color: 'var(--text-muted, #94a3b8)',
                padding: '12px 16px 6px',
              }}
            >
              Public Views
            </div>
          )}

          {publicNavItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.label}
                to={item.path}
                onClick={() => setMobileOpen(false)}
                className={({ isActive }) =>
                  `nav-item-link ${isActive ? 'nav-item-active' : ''}`
                }
                title={collapsed ? item.label : undefined}
                end={item.path === '/'}
              >
                <div className="nav-item-icon">
                  <Icon size={18} strokeWidth={2} />
                </div>
                {!collapsed && <span className="nav-item-label">{item.label}</span>}
              </NavLink>
            );
          })}

          {/* Protected Management Section */}
          {isAuthenticated && (
            <>
              {!collapsed && (
                <div
                  style={{
                    fontSize: '0.65rem',
                    fontWeight: 700,
                    textTransform: 'uppercase',
                    letterSpacing: '0.08em',
                    color: '#818cf8',
                    padding: '16px 16px 6px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                  }}
                >
                  <Shield size={11} />
                  <span>Protected Admin</span>
                </div>
              )}

              {adminNavItems.map((item) => {
                const Icon = item.icon;
                return (
                  <NavLink
                    key={item.path}
                    to={item.path}
                    onClick={() => setMobileOpen(false)}
                    className={({ isActive }) =>
                      `nav-item-link ${isActive ? 'nav-item-active' : ''}`
                    }
                    title={collapsed ? item.label : undefined}
                    end={item.exact}
                  >
                    <div className="nav-item-icon" style={{ color: '#818cf8' }}>
                      <Icon size={18} strokeWidth={2} />
                    </div>
                    {!collapsed && (
                      <span className="nav-item-label" style={{ fontWeight: 600 }}>
                        {item.label}
                      </span>
                    )}
                  </NavLink>
                );
              })}
            </>
          )}
        </nav>

        {/* Sidebar Footer with Theme Toggle & User Session */}
        <div className="sidebar-footer">
          {/* Quick theme & shortcuts bar */}
          <div className="sidebar-utility-row">
            <button
              className="utility-btn"
              onClick={toggleTheme}
              title={`Switch to ${theme === 'dark' ? 'Light' : 'Dark'} mode`}
            >
              {theme === 'dark' ? <Sun size={16} className="text-amber-400" /> : <Moon size={16} />}
              {!collapsed && <span>{theme === 'dark' ? 'Light' : 'Dark'}</span>}
            </button>
            <button
              className="utility-btn"
              onClick={() => setCmdOpen(true)}
              title="Command Palette (Ctrl+K)"
            >
              <Sparkles size={16} />
              {!collapsed && <span>Search</span>}
            </button>
          </div>

          {/* User Profile or Guest Login Options */}
          {isAuthenticated && user ? (
            <div className="sidebar-user-profile">
              <div className="user-avatar-wrapper">
                <div
                  style={{
                    width: '32px',
                    height: '32px',
                    borderRadius: '50%',
                    background: user.role === 1 ? 'linear-gradient(135deg, #6366f1, #8b5cf6)' : 'linear-gradient(135deg, #10b981, #059669)',
                    color: '#fff',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontWeight: 700,
                    fontSize: '0.85rem',
                  }}
                >
                  {user.fullName.charAt(0).toUpperCase()}
                </div>
                <span className="user-status-dot online" />
              </div>

              {!collapsed && (
                <div className="user-info">
                  <span className="user-name" title={user.fullName}>
                    {user.fullName}
                  </span>
                  <span
                    style={{
                      fontSize: '0.7rem',
                      fontWeight: 700,
                      color: user.role === 1 ? '#818cf8' : '#34d399',
                    }}
                  >
                    {user.roleName} (#{user.accountId})
                  </span>
                </div>
              )}

              {!collapsed && (
                <button
                  className="user-more-btn"
                  onClick={handleLogout}
                  title="Sign Out"
                  style={{ color: '#ef4444' }}
                >
                  <LogOut size={16} />
                </button>
              )}
            </div>
          ) : (
            !collapsed && (
              <div style={{ display: 'flex', gap: '6px', padding: '6px 0' }}>
                <Link
                  to="/login"
                  className="btn btn-primary"
                  style={{
                    flex: 1,
                    padding: '8px 10px',
                    fontSize: '0.8rem',
                    textAlign: 'center',
                    textDecoration: 'none',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '4px',
                    borderRadius: '8px',
                  }}
                >
                  <LogIn size={13} />
                  <span>Login</span>
                </Link>
                <Link
                  to="/register"
                  className="btn btn-secondary"
                  style={{
                    flex: 1,
                    padding: '8px 10px',
                    fontSize: '0.8rem',
                    textAlign: 'center',
                    textDecoration: 'none',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '4px',
                    borderRadius: '8px',
                  }}
                >
                  <UserPlus size={13} />
                  <span>Register</span>
                </Link>
              </div>
            )
          )}
        </div>
      </aside>

      {/* Main App Canvas */}
      <div className="app-main-wrapper">
        {/* Top Header Bar */}
        <header className="app-topbar">
          <div className="topbar-left">
            <button
              className="menu-hamburger-btn mobile-only"
              onClick={() => setMobileOpen(true)}
              aria-label="Open navigation"
            >
              <Menu size={20} />
            </button>
          </div>

          {/* Right Header Navigation & Actions */}
          <div className="topbar-right">
            {/* Global Search Input */}
            <div className="header-search-bar" onClick={() => setCmdOpen(true)}>
              <Search size={15} className="search-bar-icon" />
              <input
                type="text"
                placeholder="Search tasks, projects..."
                readOnly
                className="search-bar-input"
              />
              <span className="search-kbd-badge">⌘K</span>
            </div>

            {/* Quick Action: New Project / Manage */}
            <Link
              to={isAuthenticated ? '/admin/projects' : '/login'}
              className="btn-new-project"
            >
              <Plus size={15} strokeWidth={2.5} />
              <span>{isAuthenticated ? 'Admin Projects' : 'Sign in to Manage'}</span>
            </Link>

            {/* Notification Bell */}
            <button className="topbar-icon-btn notification-btn" title="Notifications">
              <Bell size={17} />
              <span className="notification-indicator" />
            </button>

            {/* Help / Guide */}
            <button className="topbar-icon-btn" title="PRN232 Assignment 2 Help">
              <HelpCircle size={17} />
            </button>

            {/* User Session Dropdown or Sign In Button */}
            {isAuthenticated && user ? (
              <div className="topbar-user-dropdown-wrapper" style={{ position: 'relative' }}>
                <div
                  className="topbar-user-dropdown"
                  onClick={() => setUserMenuOpen(!userMenuOpen)}
                  style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px' }}
                >
                  <div
                    style={{
                      width: '32px',
                      height: '32px',
                      borderRadius: '50%',
                      background: user.role === 1 ? 'linear-gradient(135deg, #6366f1, #8b5cf6)' : 'linear-gradient(135deg, #10b981, #059669)',
                      color: '#fff',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontWeight: 700,
                      fontSize: '0.8rem',
                    }}
                  >
                    {user.fullName.charAt(0).toUpperCase()}
                  </div>
                  <span style={{ fontSize: '0.85rem', fontWeight: 600, maxWidth: '120px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {user.fullName}
                  </span>
                  <ChevronDown size={14} className="dropdown-arrow" />
                </div>

                {/* Dropdown Menu */}
                {userMenuOpen && (
                  <div
                    className="glass-card"
                    style={{
                      position: 'absolute',
                      right: 0,
                      top: '42px',
                      width: '220px',
                      padding: '8px',
                      borderRadius: '12px',
                      boxShadow: '0 10px 25px rgba(0,0,0,0.3)',
                      zIndex: 200,
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '4px',
                    }}
                  >
                    <div style={{ padding: '8px 12px', borderBottom: '1px solid var(--border-color, rgba(255,255,255,0.1))' }}>
                      <div style={{ fontWeight: 700, fontSize: '0.85rem' }}>{user.fullName}</div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-muted, #94a3b8)' }}>{user.email}</div>
                      <div
                        style={{
                          fontSize: '0.7rem',
                          fontWeight: 700,
                          color: user.role === 1 ? '#818cf8' : '#34d399',
                          marginTop: '2px',
                        }}
                      >
                        {user.roleName} Privilege
                      </div>
                    </div>

                    <Link
                      to="/admin"
                      onClick={() => setUserMenuOpen(false)}
                      style={{
                        padding: '8px 12px',
                        borderRadius: '6px',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        fontSize: '0.85rem',
                        color: 'var(--text-primary)',
                        textDecoration: 'none',
                      }}
                    >
                      <ShieldCheck size={15} style={{ color: '#818cf8' }} />
                      <span>Admin Hub</span>
                    </Link>

                    <Link
                      to="/profile"
                      onClick={() => setUserMenuOpen(false)}
                      style={{
                        padding: '8px 12px',
                        borderRadius: '6px',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        fontSize: '0.85rem',
                        color: 'var(--text-primary)',
                        textDecoration: 'none',
                      }}
                    >
                      <UserIcon size={15} style={{ color: '#38bdf8' }} />
                      <span>My Profile</span>
                    </Link>

                    {isAdmin && (
                      <Link
                        to="/admin/accounts"
                        onClick={() => setUserMenuOpen(false)}
                        style={{
                          padding: '8px 12px',
                          borderRadius: '6px',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '8px',
                          fontSize: '0.85rem',
                          color: 'var(--text-primary)',
                          textDecoration: 'none',
                        }}
                      >
                        <Users size={15} style={{ color: '#ec4899' }} />
                        <span>Manage Accounts</span>
                      </Link>
                    )}

                    <button
                      onClick={() => {
                        setUserMenuOpen(false);
                        handleLogout();
                      }}
                      style={{
                        padding: '8px 12px',
                        borderRadius: '6px',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        fontSize: '0.85rem',
                        color: '#ef4444',
                        background: 'transparent',
                        border: 'none',
                        cursor: 'pointer',
                        width: '100%',
                        textAlign: 'left',
                      }}
                    >
                      <LogOut size={15} />
                      <span>Sign Out</span>
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                <Link
                  to="/login"
                  className="btn btn-primary"
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '6px',
                    padding: '7px 14px',
                    fontSize: '0.825rem',
                    textDecoration: 'none',
                    borderRadius: '8px',
                    fontWeight: 600,
                  }}
                >
                  <LogIn size={14} />
                  <span>Sign In</span>
                </Link>
                <Link
                  to="/register"
                  className="btn btn-secondary"
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '6px',
                    padding: '7px 14px',
                    fontSize: '0.825rem',
                    textDecoration: 'none',
                    borderRadius: '8px',
                    fontWeight: 600,
                  }}
                >
                  <UserPlus size={14} />
                  <span>Register</span>
                </Link>
              </div>
            )}
          </div>
        </header>

        {/* Page Content Viewport */}
        <main className="app-main-content animate-fade-in">
          <div className="main-content-inner">{children}</div>
        </main>
      </div>

      {/* Global Command Palette */}
      <CommandPalette isOpen={cmdOpen} onClose={() => setCmdOpen(false)} />
    </div>
  );
}
