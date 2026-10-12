import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { departmentApi, projectApi, taskApi, tagApi, accountApi } from '../services/api';
import {
  ShieldCheck,
  Building2,
  FolderKanban,
  CheckSquare,
  Tag,
  Users,
  ArrowRight,
  PlusCircle,
  KeyRound,
  ExternalLink,
} from 'lucide-react';
import { StatCard } from '../components/ui/StatCard';
import './Dashboard.css';

export default function AdminDashboard() {
  const { user, isAdmin } = useAuth();
  const [stats, setStats] = useState({
    departments: 0,
    projects: 0,
    tasks: 0,
    tags: 0,
    accounts: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    async function loadStats() {
      try {
        const [depts, projs, tsks, tgs] = await Promise.all([
          departmentApi.getAll().catch(() => []),
          projectApi.getAll().catch(() => []),
          taskApi.getAll().catch(() => []),
          tagApi.getAll().catch(() => []),
        ]);

        let accCount = 0;
        if (isAdmin) {
          try {
            const accs = await accountApi.getAll();
            accCount = accs.length;
          } catch {
            // Non-admin will not fetch accounts
          }
        }

        if (isMounted) {
          setStats({
            departments: depts.length,
            projects: projs.length,
            tasks: tsks.length,
            tags: tgs.length,
            accounts: accCount,
          });
        }
      } catch (err) {
        console.error('Failed to load dashboard stats', err);
      } finally {
        if (isMounted) setLoading(false);
      }
    }

    loadStats();
    return () => {
      isMounted = false;
    };
  }, [isAdmin]);

  const managementModules = [
    {
      title: 'Department Management',
      desc: 'Create, modify organizational divisions, and configure operational team parameters.',
      path: '/admin/departments',
      count: stats.departments,
      unit: 'Teams',
      icon: Building2,
      color: '#3b82f6',
      badge: 'Protected',
    },
    {
      title: 'Project Management',
      desc: 'Track strategic project lifecycles, assign departmental ownership, and schedule deliverables.',
      path: '/admin/projects',
      count: stats.projects,
      unit: 'Projects',
      icon: FolderKanban,
      color: '#6366f1',
      badge: 'Protected',
    },
    {
      title: 'Task Management',
      desc: 'Orchestrate tasks with Kanban & table workflows, priority matrices, and multi-tag categorizations.',
      path: '/admin/tasks',
      count: stats.tasks,
      unit: 'Tasks',
      icon: CheckSquare,
      color: '#10b981',
      badge: 'Protected',
    },
    {
      title: 'Tag Taxonomy',
      desc: 'Define custom color-coded label taxonomies for streamlined multi-dimensional task filtering.',
      path: '/admin/tags',
      count: stats.tags,
      unit: 'Tags',
      icon: Tag,
      color: '#f59e0b',
      badge: 'Protected',
    },
    {
      title: 'User Accounts & Roles',
      desc: 'Manage authenticated system credentials, elevate privileges, and audit active user workloads.',
      path: '/admin/accounts',
      count: isAdmin ? stats.accounts : 'Admin Only',
      unit: isAdmin ? 'Accounts' : '',
      icon: Users,
      color: '#ec4899',
      badge: 'Admin Only',
      adminOnly: true,
    },
  ];

  return (
    <div className="dashboard-container animate-fade-in" style={{ maxWidth: '1200px' }}>
      {/* Top Banner / Welcome Card */}
      <div className="glass-card" style={{ padding: '28px 32px', marginBottom: '28px', borderRadius: '16px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
              <div
                style={{
                  padding: '6px',
                  borderRadius: '8px',
                  background: 'rgba(99, 102, 241, 0.15)',
                  color: '#818cf8',
                  display: 'flex',
                }}
              >
                <ShieldCheck size={20} />
              </div>
              <span
                style={{
                  fontSize: '0.8rem',
                  fontWeight: 700,
                  textTransform: 'uppercase',
                  letterSpacing: '0.05em',
                  color: '#818cf8',
                }}
              >
                Authenticated Management Hub
              </span>
            </div>
            <h1 style={{ fontSize: '1.85rem', fontWeight: 700, margin: '4px 0 8px' }}>
              Welcome back, {user?.fullName}!
            </h1>
            <p style={{ color: 'var(--text-muted, #94a3b8)', margin: 0, fontSize: '0.95rem' }}>
              You are signed in with <strong>{user?.email}</strong> as{' '}
              <span
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  padding: '2px 8px',
                  borderRadius: '9999px',
                  fontSize: '0.75rem',
                  fontWeight: 700,
                  background: user?.role === 1 ? 'rgba(99, 102, 241, 0.2)' : 'rgba(16, 185, 129, 0.2)',
                  color: user?.role === 1 ? '#818cf8' : '#34d399',
                  border: user?.role === 1 ? '1px solid rgba(99, 102, 241, 0.4)' : '1px solid rgba(16, 185, 129, 0.4)',
                }}
              >
                {user?.roleName || (user?.role === 1 ? 'Admin' : 'Staff')}
              </span>
              . Write operations (Create, Edit, Delete) are authorized.
            </p>
          </div>

          <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
            <Link
              to="/admin/tasks"
              className="btn btn-primary"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                padding: '10px 18px',
                borderRadius: '10px',
                textDecoration: 'none',
                fontWeight: 600,
                fontSize: '0.9rem',
              }}
            >
              <PlusCircle size={16} />
              <span>Manage Tasks</span>
            </Link>
            {isAdmin && (
              <Link
                to="/admin/accounts"
                className="btn btn-secondary"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '10px 18px',
                  borderRadius: '10px',
                  textDecoration: 'none',
                  fontWeight: 600,
                  fontSize: '0.9rem',
                }}
              >
                <KeyRound size={16} />
                <span>User Accounts</span>
              </Link>
            )}
          </div>
        </div>
      </div>

      {/* Summary Stat Cards */}
      <div className="stats-grid" style={{ marginBottom: '32px' }}>
        <StatCard
          title="Active Departments"
          value={loading ? '...' : stats.departments}
          icon={<Building2 size={24} />}
          colorScheme="cyan"
          trend={{ value: 'Full Access', isPositive: true }}
        />
        <StatCard
          title="Tracked Projects"
          value={loading ? '...' : stats.projects}
          icon={<FolderKanban size={24} />}
          colorScheme="purple"
          trend={{ value: 'Write Enabled', isPositive: true }}
        />
        <StatCard
          title="Managed Tasks"
          value={loading ? '...' : stats.tasks}
          icon={<CheckSquare size={24} />}
          colorScheme="emerald"
          trend={{ value: 'Active Tasks', isPositive: true }}
        />
        <StatCard
          title="Taxonomy Tags"
          value={loading ? '...' : stats.tags}
          icon={<Tag size={24} />}
          colorScheme="amber"
          trend={{ value: 'Classification', isPositive: true }}
        />
      </div>

      {/* Protected Management Section Grid */}
      <div style={{ marginBottom: '20px' }}>
        <h2 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '6px' }}>
          Management Modules & Data Access
        </h2>
        <p style={{ color: 'var(--text-muted, #94a3b8)', fontSize: '0.875rem', marginBottom: '18px' }}>
          Protected administrative interfaces for entities management with dialog-driven mutations.
        </p>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
            gap: '18px',
          }}
        >
          {managementModules.map((mod) => {
            const Icon = mod.icon;
            const isAccessible = !mod.adminOnly || isAdmin;

            return (
              <div
                key={mod.title}
                className="glass-card"
                style={{
                  padding: '24px',
                  borderRadius: '14px',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  border: mod.adminOnly ? '1px solid rgba(236, 72, 153, 0.3)' : undefined,
                  opacity: isAccessible ? 1 : 0.7,
                }}
              >
                <div>
                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'flex-start',
                      marginBottom: '14px',
                    }}
                  >
                    <div
                      style={{
                        width: '42px',
                        height: '42px',
                        borderRadius: '10px',
                        backgroundColor: `${mod.color}18`,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: mod.color,
                      }}
                    >
                      <Icon size={22} />
                    </div>

                    <span
                      style={{
                        padding: '3px 8px',
                        borderRadius: '6px',
                        fontSize: '0.7rem',
                        fontWeight: 700,
                        textTransform: 'uppercase',
                        background: mod.adminOnly ? 'rgba(236, 72, 153, 0.15)' : 'rgba(99, 102, 241, 0.15)',
                        color: mod.adminOnly ? '#f472b6' : '#818cf8',
                      }}
                    >
                      {mod.badge}
                    </span>
                  </div>

                  <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '6px' }}>
                    {mod.title}
                  </h3>
                  <p
                    style={{
                      color: 'var(--text-muted, #94a3b8)',
                      fontSize: '0.85rem',
                      lineHeight: 1.5,
                      marginBottom: '16px',
                    }}
                  >
                    {mod.desc}
                  </p>
                </div>

                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    paddingTop: '14px',
                    borderTop: '1px solid var(--border-color, rgba(255, 255, 255, 0.08))',
                  }}
                >
                  <span style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-secondary, #cbd5e1)' }}>
                    {typeof mod.count === 'number' ? `${mod.count} ${mod.unit}` : mod.count}
                  </span>

                  {isAccessible ? (
                    <Link
                      to={mod.path}
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '6px',
                        fontSize: '0.85rem',
                        fontWeight: 600,
                        color: mod.color,
                        textDecoration: 'none',
                      }}
                    >
                      <span>Open Workspace</span>
                      <ArrowRight size={14} />
                    </Link>
                  ) : (
                    <span style={{ fontSize: '0.8rem', color: '#f472b6', fontWeight: 600 }}>
                      Restricted to Admin
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Public vs Admin Navigation Helper */}
      <div
        className="glass-card"
        style={{
          padding: '20px 24px',
          borderRadius: '14px',
          marginTop: '28px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '14px',
        }}
      >
        <div>
          <h4 style={{ fontSize: '0.95rem', fontWeight: 700, margin: '0 0 4px' }}>
            Looking for Public Read-Only Views?
          </h4>
          <p style={{ color: 'var(--text-muted, #94a3b8)', fontSize: '0.85rem', margin: 0 }}>
            Public consumers can view projects, teams, tasks, and the search hub without signing in.
          </p>
        </div>
        <div style={{ display: 'flex', gap: '10px' }}>
          <Link
            to="/"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              fontSize: '0.85rem',
              color: '#818cf8',
              fontWeight: 600,
              textDecoration: 'none',
            }}
          >
            <span>Public Home</span>
            <ExternalLink size={14} />
          </Link>
          <Link
            to="/search"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              fontSize: '0.85rem',
              color: '#818cf8',
              fontWeight: 600,
              textDecoration: 'none',
            }}
          >
            <span>Search Hub</span>
            <ExternalLink size={14} />
          </Link>
        </div>
      </div>
    </div>
  );
}
