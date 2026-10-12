import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { accountApi } from '../services/api';
import type { SystemAccount, UpdateAccountDto } from '../types';
import {
  Users,
  Search,
  Edit2,
  Trash2,
  Shield,
  ShieldCheck,
  ShieldAlert,
  CheckCircle2,
  Layers,
  X,
  AlertTriangle,
  RefreshCw,
} from 'lucide-react';
import { Modal } from '../components/ui/Modal';
import { Skeleton } from '../components/ui/Skeleton';
import { EmptyState } from '../components/ui/EmptyState';
import './DepartmentList.css';

export default function AccountList() {
  const { user: currentUser } = useAuth();
  const toast = useToast();

  const [accounts, setAccounts] = useState<SystemAccount[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  // Modals
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingAccount, setEditingAccount] = useState<SystemAccount | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Form State for update
  const [editFormData, setEditFormData] = useState<UpdateAccountDto>({
    fullName: '',
    role: 0,
  });

  // Delete State
  const [accountToDelete, setAccountToDelete] = useState<SystemAccount | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState<string | null>(null);

  const fetchAccounts = useCallback(async () => {
    try {
      setLoading(true);
      const data = await accountApi.getAll();
      setAccounts(data);
    } catch (err: unknown) {
      console.error(err);
      toast.error('Failed to load system accounts.');
    } finally {
      setLoading(false);
    }
  }, [toast]);

  useEffect(() => {
    fetchAccounts();
  }, [fetchAccounts]);

  const filteredAccounts = accounts.filter((acc) => {
    const term = searchTerm.toLowerCase();
    return (
      acc.fullName.toLowerCase().includes(term) ||
      acc.email.toLowerCase().includes(term) ||
      acc.roleName.toLowerCase().includes(term)
    );
  });

  const handleOpenEdit = (acc: SystemAccount) => {
    setEditingAccount(acc);
    setEditFormData({
      fullName: acc.fullName,
      role: acc.role,
    });
    setShowEditModal(true);
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingAccount) return;

    if (!editFormData.fullName.trim()) {
      toast.error('Full Name cannot be empty.');
      return;
    }

    setIsSubmitting(true);
    try {
      const updated = await accountApi.update(editingAccount.accountId, editFormData);
      toast.success(`Account for ${updated.fullName} updated successfully!`);
      setShowEditModal(false);
      setEditingAccount(null);
      await fetchAccounts();
    } catch (err: unknown) {
      const msg = (err as { response?: { data?: { message?: string } } })?.response?.data?.message
        || 'Failed to update account.';
      toast.error(msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleOpenDelete = (acc: SystemAccount) => {
    setDeleteError(null);
    setAccountToDelete(acc);
  };

  const handleConfirmDelete = async () => {
    if (!accountToDelete) return;

    if (accountToDelete.accountId === currentUser?.accountId) {
      toast.error('You cannot delete your own logged-in account.');
      setAccountToDelete(null);
      return;
    }

    setIsDeleting(true);
    setDeleteError(null);
    try {
      await accountApi.delete(accountToDelete.accountId);
      toast.success(`Account "${accountToDelete.fullName}" was deleted successfully.`);
      setAccountToDelete(null);
      await fetchAccounts();
    } catch (err: unknown) {
      const msg = (err as { response?: { data?: { message?: string } } })?.response?.data?.message
        || 'Cannot delete this account. If the account has created any tasks, deletion is rejected.';
      setDeleteError(msg);
      toast.error(msg);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="dept-page-container animate-fade-in" style={{ maxWidth: '1200px' }}>
      {/* Top Banner */}
      <div className="glass-card dept-hero-card">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
              <span
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '4px',
                  padding: '2px 8px',
                  borderRadius: '6px',
                  fontSize: '0.75rem',
                  fontWeight: 700,
                  background: 'rgba(236, 72, 153, 0.15)',
                  color: '#f472b6',
                  textTransform: 'uppercase',
                }}
              >
                <Shield size={12} />
                Admin Only Module
              </span>
            </div>
            <h1 className="dept-title">System Account Management</h1>
            <p className="dept-desc">
              Audit registered users, update permissions & roles (Admin / Staff), and enforce task retention policies.
            </p>
          </div>

          <button
            type="button"
            className="btn btn-secondary"
            onClick={fetchAccounts}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              padding: '8px 14px',
              borderRadius: '8px',
              fontSize: '0.85rem',
            }}
          >
            <RefreshCw size={14} />
            <span>Refresh List</span>
          </button>
        </div>

        {/* Search input */}
        <div className="dept-search-wrapper" style={{ marginTop: '20px' }}>
          <Search size={16} className="search-icon" />
          <input
            type="text"
            placeholder="Search by name, email, or role..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="dept-search-input"
          />
          {searchTerm && (
            <button
              className="clear-search-btn"
              onClick={() => setSearchTerm('')}
              aria-label="Clear search"
            >
              <X size={14} />
            </button>
          )}
        </div>
      </div>

      {/* Table view */}
      <div className="glass-card" style={{ padding: '0', borderRadius: '16px', overflow: 'hidden' }}>
        {loading ? (
          <div style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <Skeleton height="44px" />
            <Skeleton height="44px" />
            <Skeleton height="44px" />
            <Skeleton height="44px" />
          </div>
        ) : filteredAccounts.length === 0 ? (
          <div style={{ padding: '40px 20px' }}>
            <EmptyState
              title="No Accounts Found"
              description={searchTerm ? `No users matched "${searchTerm}".` : 'No system accounts registered yet.'}
              icon={<Users size={32} />}
            />
          </div>
        ) : (
          <div className="table-responsive">
            <table className="dept-table">
              <thead>
                <tr>
                  <th style={{ width: '70px' }}>ID</th>
                  <th>Full Name</th>
                  <th>Email</th>
                  <th style={{ width: '130px' }}>Role</th>
                  <th style={{ width: '120px' }}>Created Tasks</th>
                  <th style={{ width: '150px' }}>Registered Date</th>
                  <th style={{ width: '120px', textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredAccounts.map((acc) => {
                  const isCurrent = acc.accountId === currentUser?.accountId;
                  return (
                    <tr key={acc.accountId}>
                      <td>
                        <span style={{ fontWeight: 600, color: 'var(--text-muted, #94a3b8)' }}>
                          #{acc.accountId}
                        </span>
                      </td>
                      <td>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <span style={{ fontWeight: 600, color: 'var(--text-primary, #f8fafc)' }}>
                            {acc.fullName}
                          </span>
                          {isCurrent && (
                            <span
                              style={{
                                padding: '2px 6px',
                                borderRadius: '4px',
                                fontSize: '0.65rem',
                                fontWeight: 700,
                                background: 'rgba(99, 102, 241, 0.2)',
                                color: '#818cf8',
                              }}
                            >
                              YOU
                            </span>
                          )}
                        </div>
                      </td>
                      <td>
                        <span style={{ color: 'var(--text-secondary, #cbd5e1)', fontSize: '0.875rem' }}>
                          {acc.email}
                        </span>
                      </td>
                      <td>
                        <span
                          style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '5px',
                            padding: '3px 10px',
                            borderRadius: '9999px',
                            fontSize: '0.75rem',
                            fontWeight: 700,
                            background:
                              acc.role === 1 ? 'rgba(99, 102, 241, 0.15)' : 'rgba(16, 185, 129, 0.15)',
                            color: acc.role === 1 ? '#818cf8' : '#34d399',
                            border:
                              acc.role === 1
                                ? '1px solid rgba(99, 102, 241, 0.3)'
                                : '1px solid rgba(16, 185, 129, 0.3)',
                          }}
                        >
                          {acc.role === 1 ? <ShieldCheck size={12} /> : <CheckCircle2 size={12} />}
                          <span>{acc.roleName}</span>
                        </span>
                      </td>
                      <td>
                        <span
                          style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '4px',
                            fontSize: '0.85rem',
                            color: acc.createdTasksCount > 0 ? '#38bdf8' : 'var(--text-muted, #94a3b8)',
                            fontWeight: 600,
                          }}
                        >
                          <Layers size={13} />
                          <span>{acc.createdTasksCount} {acc.createdTasksCount === 1 ? 'task' : 'tasks'}</span>
                        </span>
                      </td>
                      <td>
                        <span style={{ color: 'var(--text-muted, #94a3b8)', fontSize: '0.825rem' }}>
                          {new Date(acc.createdDate).toLocaleDateString()}
                        </span>
                      </td>
                      <td>
                        <div style={{ display: 'flex', gap: '6px', justifyContent: 'flex-end' }}>
                          <button
                            type="button"
                            className="dept-action-btn edit-btn"
                            title="Edit Account Name & Role"
                            onClick={() => handleOpenEdit(acc)}
                          >
                            <Edit2 size={14} />
                          </button>
                          <button
                            type="button"
                            className="dept-action-btn delete-btn"
                            title={isCurrent ? 'Cannot delete self' : 'Delete Account'}
                            disabled={isCurrent}
                            onClick={() => handleOpenDelete(acc)}
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Edit Account Modal */}
      <Modal
        isOpen={showEditModal}
        title={`Edit Account: ${editingAccount?.email}`}
        onClose={() => {
          if (!isSubmitting) setShowEditModal(false);
        }}
      >
        <form onSubmit={handleUpdate} className="dept-modal-form">
          <div className="modal-field">
            <label className="modal-label" htmlFor="edit-fullName">
              Full Name
            </label>
            <input
              id="edit-fullName"
              type="text"
              required
              className="modal-input"
              value={editFormData.fullName}
              onChange={(e) => setEditFormData({ ...editFormData, fullName: e.target.value })}
              disabled={isSubmitting}
            />
          </div>

          <div className="modal-field">
            <label className="modal-label" htmlFor="edit-role">
              User Role Privilege
            </label>
            <select
              id="edit-role"
              className="modal-input"
              value={editFormData.role}
              onChange={(e) => setEditFormData({ ...editFormData, role: Number(e.target.value) })}
              disabled={isSubmitting}
            >
              <option value={0}>Staff (Role 0 — Read/Write standard resources)</option>
              <option value={1}>Admin (Role 1 — Full system administrative access)</option>
            </select>
            <p style={{ fontSize: '0.75rem', color: 'var(--text-muted, #94a3b8)', marginTop: '4px' }}>
              Admins possess write permissions to user credentials and system accounts management.
            </p>
          </div>

          <div className="modal-actions" style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end', marginTop: '20px' }}>
            <button
              type="button"
              className="btn btn-secondary"
              onClick={() => setShowEditModal(false)}
              disabled={isSubmitting}
            >
              Cancel
            </button>
            <button type="submit" className="btn btn-primary" disabled={isSubmitting}>
              {isSubmitting ? 'Saving Changes...' : 'Save Changes'}
            </button>
          </div>
        </form>
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={!!accountToDelete}
        title="Confirm Account Deletion"
        onClose={() => {
          if (!isDeleting) setAccountToDelete(null);
        }}
      >
        <div style={{ padding: '6px 0' }}>
          <div
            style={{
              display: 'flex',
              alignItems: 'flex-start',
              gap: '12px',
              padding: '12px 14px',
              borderRadius: '10px',
              background: 'rgba(239, 68, 68, 0.12)',
              border: '1px solid rgba(239, 68, 68, 0.3)',
              color: '#f87171',
              marginBottom: '16px',
            }}
          >
            <AlertTriangle size={20} style={{ flexShrink: 0, marginTop: '2px' }} />
            <div style={{ fontSize: '0.85rem', lineHeight: 1.5 }}>
              <strong>Notice:</strong> As required by Assignment 2 rules, an account cannot be deleted if it has created any tasks.
            </div>
          </div>

          <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary, #cbd5e1)', marginBottom: '8px' }}>
            Are you sure you want to delete the account for:
          </p>
          <div
            style={{
              padding: '12px',
              borderRadius: '8px',
              background: 'var(--surface-input, rgba(15, 23, 42, 0.6))',
              marginBottom: '16px',
              fontSize: '0.875rem',
            }}
          >
            <div><strong>Name:</strong> {accountToDelete?.fullName}</div>
            <div><strong>Email:</strong> {accountToDelete?.email}</div>
            <div><strong>Role:</strong> {accountToDelete?.roleName}</div>
            <div><strong>Tasks Created:</strong> {accountToDelete?.createdTasksCount || 0}</div>
          </div>

          {deleteError && (
            <div
              style={{
                display: 'flex',
                alignItems: 'flex-start',
                gap: '8px',
                padding: '10px 12px',
                borderRadius: '8px',
                background: 'rgba(239, 68, 68, 0.15)',
                color: '#f87171',
                fontSize: '0.825rem',
                marginBottom: '16px',
              }}
            >
              <ShieldAlert size={16} style={{ flexShrink: 0, marginTop: '2px' }} />
              <span>{deleteError}</span>
            </div>
          )}

          <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end', marginTop: '20px' }}>
            <button
              type="button"
              className="btn btn-secondary"
              onClick={() => setAccountToDelete(null)}
              disabled={isDeleting}
            >
              Cancel
            </button>
            <button
              type="button"
              className="btn btn-danger"
              style={{ backgroundColor: '#ef4444', color: '#fff', border: 'none' }}
              onClick={handleConfirmDelete}
              disabled={isDeleting}
            >
              {isDeleting ? 'Deleting...' : 'Delete Account'}
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
