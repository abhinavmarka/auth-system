import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import { Users, Shield, Trash2, AlertCircle, AlertTriangle, CheckCircle2 } from 'lucide-react';

const AdminDashboard = () => {
  const { user: currentAdmin } = useAuth();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  
  // Deletion modal state
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await api.get('/api/admin/users');
      setUsers(response.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch user database.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleRoleToggle = async (userId, currentRole) => {
    setError('');
    setSuccess('');
    const newRole = currentRole === 'admin' ? 'user' : 'admin';

    try {
      const response = await api.put(`/api/admin/users/${userId}/role`, { role: newRole });
      
      // Update local state list
      setUsers(users.map((u) => (u.id === userId ? response.data : u)));
      setSuccess(`Successfully updated role for user ${response.data.email} to '${newRole}'.`);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to change user access role.');
    }
  };

  const handleDeleteClick = (userToDel) => {
    setError('');
    setSuccess('');
    setDeleteTarget(userToDel);
  };

  const handleConfirmDelete = async () => {
    if (!deleteTarget) return;
    setDeleteLoading(true);
    setError('');
    setSuccess('');

    try {
      await api.delete(`/api/admin/users/${deleteTarget.id}`);
      setUsers(users.filter((u) => u.id !== deleteTarget.id));
      setSuccess(`Successfully deleted user account ${deleteTarget.email}.`);
      setDeleteTarget(null);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to delete user.');
    } finally {
      setDeleteLoading(false);
    }
  };

  // Calculations
  const stats = {
    total: users.length,
    admins: users.filter((u) => u.role === 'admin').length,
    standards: users.filter((u) => u.role === 'user').length,
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '60vh' }}>
        <div className="spinner"></div>
      </div>
    );
  }

  return (
    <div className="page-wrapper animate-fade-in">
      <div style={{ marginBottom: '2.5rem' }}>
        <h1 style={{ fontSize: '2.25rem', marginBottom: '0.5rem', color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <Users style={{ color: 'var(--accent-cyan)' }} />
          <span>Admin Portal</span>
        </h1>
        <p style={{ color: 'var(--text-secondary)' }}>
          Manage user credentials, promote administrators, and delete user profiles.
        </p>
      </div>

      {error && (
        <div className="alert alert-error">
          <AlertCircle size={20} style={{ flexShrink: 0 }} />
          <span>{error}</span>
        </div>
      )}

      {success && (
        <div className="alert alert-success">
          <CheckCircle2 size={20} style={{ flexShrink: 0 }} />
          <span>{success}</span>
        </div>
      )}

      {/* Admin stats */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
        gap: '1.5rem',
        marginBottom: '2.5rem'
      }}>
        <div className="glass-panel" style={{ padding: '1.25rem', textAlign: 'center' }}>
          <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 600 }}>Total Accounts</p>
          <h2 style={{ fontSize: '2rem', color: 'var(--text-primary)', marginTop: '0.25rem' }}>{stats.total}</h2>
        </div>
        <div className="glass-panel" style={{ padding: '1.25rem', textAlign: 'center' }}>
          <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 600 }}>Administrators</p>
          <h2 style={{ fontSize: '2rem', color: 'var(--accent-cyan)', marginTop: '0.25rem' }}>{stats.admins}</h2>
        </div>
        <div className="glass-panel" style={{ padding: '1.25rem', textAlign: 'center' }}>
          <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 600 }}>Standard Users</p>
          <h2 style={{ fontSize: '2rem', color: 'var(--accent-primary)', marginTop: '0.25rem' }}>{stats.standards}</h2>
        </div>
      </div>

      {/* Users Database Table */}
      <div className="glass-panel" style={{ padding: '1.5rem' }}>
        <h2 style={{ fontSize: '1.25rem', marginBottom: '1.25rem', color: 'var(--text-primary)' }}>User Database</h2>
        
        <div className="table-container">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Registered Date</th>
                <th>Role Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((u) => (
                <tr key={u.id}>
                  <td style={{ fontWeight: 500, color: 'var(--text-primary)' }}>{u.name}</td>
                  <td>{u.email}</td>
                  <td>{formatDate(u.created_at)}</td>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <span className={`user-badge ${u.role === 'admin' ? 'admin' : ''}`}>
                        {u.role}
                      </span>
                      <button
                        onClick={() => handleRoleToggle(u.id, u.role)}
                        disabled={u.id === currentAdmin.id}
                        className="btn btn-secondary"
                        style={{ padding: '0.25rem 0.5rem', fontSize: '0.75rem', borderRadius: '4px' }}
                        title={u.id === currentAdmin.id ? 'You cannot toggle your own admin status' : 'Switch role'}
                      >
                        Change
                      </button>
                    </div>
                  </td>
                  <td>
                    <button
                      onClick={() => handleDeleteClick(u)}
                      disabled={u.id === currentAdmin.id}
                      className="btn btn-secondary"
                      style={{
                        padding: '0.4rem',
                        borderRadius: '4px',
                        color: u.id === currentAdmin.id ? 'var(--text-muted)' : 'var(--error)',
                        border: '1px solid transparent'
                      }}
                      title={u.id === currentAdmin.id ? 'You cannot delete yourself' : 'Delete user'}
                    >
                      <Trash2 size={16} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Delete User Confirmation overlay */}
      {deleteTarget && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0,0,0,0.7)',
          backdropFilter: 'blur(5px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000,
          padding: '1rem'
        }}>
          <div className="glass-panel" style={{
            maxWidth: '500px',
            width: '100%',
            borderColor: 'rgba(239, 68, 68, 0.2)',
            background: 'var(--bg-secondary)',
            textAlign: 'left'
          }}>
            <h3 style={{ fontSize: '1.35rem', color: '#fca5a5', display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
              <AlertTriangle style={{ color: 'var(--error)' }} />
              <span>Confirm Account Deletion</span>
            </h3>

            <p style={{ color: 'var(--text-secondary)', marginBottom: '1.5rem', lineHeight: 1.5, fontSize: '0.95rem' }}>
              Are you sure you want to permanently delete the account of <strong>{deleteTarget.name}</strong> ({deleteTarget.email})? This user will be immediately logged out and their records erased.
            </p>

            <div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end' }}>
              <button
                onClick={handleConfirmDelete}
                className="btn btn-danger"
                disabled={deleteLoading}
              >
                {deleteLoading ? 'Deleting...' : 'Delete Account'}
              </button>
              <button
                onClick={() => setDeleteTarget(null)}
                className="btn btn-secondary"
                disabled={deleteLoading}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
