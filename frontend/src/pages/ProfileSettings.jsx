import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import { User, Mail, Lock, Trash2, AlertTriangle, AlertCircle, ShieldAlert } from 'lucide-react';

const ProfileSettings = () => {
  const { user, updateUser, logout } = useAuth();
  const navigate = useNavigate();

  // Profile Form States
  const [name, setName] = useState(user?.name || '');
  const [email, setEmail] = useState(user?.email || '');
  const [profileLoading, setProfileLoading] = useState(false);
  const [profileError, setProfileError] = useState('');
  const [profileSuccess, setProfileSuccess] = useState('');

  // Password Form States
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');
  const [passwordLoading, setPasswordLoading] = useState(false);
  const [passwordError, setPasswordError] = useState('');
  const [passwordSuccess, setPasswordSuccess] = useState('');

  // Delete Account States
  const [deleteConfirmText, setDeleteConfirmText] = useState('');
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [deleteError, setDeleteError] = useState('');
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);

  // Profile Form Handler
  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setProfileError('');
    setProfileSuccess('');
    setProfileLoading(true);

    if (!name || !email) {
      setProfileError('Name and email are required.');
      setProfileLoading(false);
      return;
    }

    try {
      const response = await api.put('/api/auth/profile', { name, email });
      updateUser(response.data);
      setProfileSuccess('Profile details updated successfully!');
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to update profile details.';
      setProfileError(message);
    } finally {
      setProfileLoading(false);
    }
  };

  // Password Form Handler
  const handleUpdatePassword = async (e) => {
    e.preventDefault();
    setPasswordError('');
    setPasswordSuccess('');
    setPasswordLoading(true);

    if (!currentPassword || !newPassword || !confirmNewPassword) {
      setPasswordError('Please fill in all password fields.');
      setPasswordLoading(false);
      return;
    }

    if (newPassword.length < 6) {
      setPasswordError('New password must be at least 6 characters.');
      setPasswordLoading(false);
      return;
    }

    if (newPassword !== confirmNewPassword) {
      setPasswordError('New passwords do not match.');
      setPasswordLoading(false);
      return;
    }

    try {
      await api.put('/api/auth/change-password', { currentPassword, newPassword });
      setPasswordSuccess('Password changed successfully!');
      setCurrentPassword('');
      setNewPassword('');
      setConfirmNewPassword('');
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to change password.';
      setPasswordError(message);
    } finally {
      setPasswordLoading(false);
    }
  };

  // Delete Account Handler
  const handleDeleteAccount = async (e) => {
    e.preventDefault();
    setDeleteError('');
    setDeleteLoading(true);

    if (deleteConfirmText !== 'DELETE') {
      setDeleteError('Please type DELETE to confirm.');
      setDeleteLoading(false);
      return;
    }

    try {
      await api.delete('/api/auth/account');
      logout();
      navigate('/');
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to delete account.';
      setDeleteError(message);
      setDeleteLoading(false);
    }
  };

  return (
    <div className="page-wrapper animate-fade-in">
      <div style={{ marginBottom: '2.5rem' }}>
        <h1 style={{ fontSize: '2.25rem', marginBottom: '0.5rem', color: 'var(--text-primary)' }}>
          Profile Settings
        </h1>
        <p style={{ color: 'var(--text-secondary)' }}>
          Manage your account profile details, change passwords, or delete your account.
        </p>
      </div>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(450px, 1fr))',
        gap: '2.5rem'
      }}>
        {/* Section 1: Update Profile Details */}
        <div className="glass-panel" style={{ height: 'fit-content' }}>
          <h2 style={{ fontSize: '1.4rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.75rem', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <User size={20} className="nav-brand-icon" />
            <span>Update Details</span>
          </h2>

          {profileError && (
            <div className="alert alert-error">
              <AlertCircle size={20} style={{ flexShrink: 0 }} />
              <span>{profileError}</span>
            </div>
          )}

          {profileSuccess && (
            <div className="alert alert-success">
              <AlertCircle size={20} style={{ flexShrink: 0 }} />
              <span>{profileSuccess}</span>
            </div>
          )}

          <form onSubmit={handleUpdateProfile}>
            <div className="form-group">
              <label className="form-label" htmlFor="profile-name">Full Name</label>
              <div className="input-container">
                <input
                  type="text"
                  id="profile-name"
                  className="form-input"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  disabled={profileLoading}
                  required
                />
                <User className="input-icon" size={18} />
              </div>
            </div>

            <div className="form-group" style={{ marginBottom: '2rem' }}>
              <label className="form-label" htmlFor="profile-email">Email Address</label>
              <div className="input-container">
                <input
                  type="email"
                  id="profile-email"
                  className="form-input"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={profileLoading}
                  required
                />
                <Mail className="input-icon" size={18} />
              </div>
            </div>

            <button
              type="submit"
              className="btn btn-primary"
              disabled={profileLoading}
            >
              {profileLoading ? 'Saving...' : 'Save Changes'}
            </button>
          </form>
        </div>

        {/* Section 2: Change Password */}
        <div className="glass-panel" style={{ height: 'fit-content' }}>
          <h2 style={{ fontSize: '1.4rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.75rem', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Lock size={20} style={{ color: 'var(--accent-secondary)' }} />
            <span>Change Password</span>
          </h2>

          {passwordError && (
            <div className="alert alert-error">
              <AlertCircle size={20} style={{ flexShrink: 0 }} />
              <span>{passwordError}</span>
            </div>
          )}

          {passwordSuccess && (
            <div className="alert alert-success">
              <AlertCircle size={20} style={{ flexShrink: 0 }} />
              <span>{passwordSuccess}</span>
            </div>
          )}

          <form onSubmit={handleUpdatePassword}>
            <div className="form-group">
              <label className="form-label" htmlFor="current-pass">Current Password</label>
              <div className="input-container">
                <input
                  type="password"
                  id="current-pass"
                  className="form-input"
                  placeholder="••••••••"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  disabled={passwordLoading}
                  required
                />
                <Lock className="input-icon" size={18} />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="new-pass">New Password</label>
              <div className="input-container">
                <input
                  type="password"
                  id="new-pass"
                  className="form-input"
                  placeholder="••••••••"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  disabled={passwordLoading}
                  required
                />
                <Lock className="input-icon" size={18} />
              </div>
            </div>

            <div className="form-group" style={{ marginBottom: '2rem' }}>
              <label className="form-label" htmlFor="confirm-new-pass">Confirm New Password</label>
              <div className="input-container">
                <input
                  type="password"
                  id="confirm-new-pass"
                  className="form-input"
                  placeholder="••••••••"
                  value={confirmNewPassword}
                  onChange={(e) => setConfirmNewPassword(e.target.value)}
                  disabled={passwordLoading}
                  required
                />
                <Lock className="input-icon" size={18} />
              </div>
            </div>

            <button
              type="submit"
              className="btn btn-primary"
              disabled={passwordLoading}
            >
              {passwordLoading ? 'Updating...' : 'Update Password'}
            </button>
          </form>
        </div>
      </div>

      {/* Section 3: Danger Zone Account Deletion */}
      <div className="glass-panel" style={{
        marginTop: '2.5rem',
        borderColor: 'rgba(239, 68, 68, 0.25)',
        background: 'rgba(239, 68, 68, 0.02)'
      }}>
        <h2 style={{ fontSize: '1.4rem', borderBottom: '1px solid rgba(239, 68, 68, 0.15)', paddingBottom: '0.75rem', marginBottom: '1.5rem', color: '#fca5a5', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <ShieldAlert size={22} style={{ color: 'var(--error)' }} />
          <span>Danger Zone</span>
        </h2>

        {!showDeleteConfirmation ? (
          <div>
            <p style={{ color: 'var(--text-secondary)', marginBottom: '1.5rem', fontSize: '0.95rem', lineHeight: 1.5 }}>
              Deleting your account is permanent. Once completed, your database records, profile information, and authentication credentials will be erased and cannot be recovered.
            </p>
            <button
              type="button"
              className="btn btn-danger"
              onClick={() => setShowDeleteConfirmation(true)}
              style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}
            >
              <Trash2 size={16} />
              <span>Delete My Account</span>
            </button>
          </div>
        ) : (
          <div>
            <div className="alert alert-error" style={{ borderLeft: '4px solid var(--error)' }}>
              <AlertTriangle size={24} style={{ flexShrink: 0 }} />
              <div>
                <strong>Warning:</strong> You are about to initiate account deletion. This process is immediate and irreversible.
              </div>
            </div>

            {deleteError && (
              <div className="alert alert-error">
                <AlertCircle size={20} />
                <span>{deleteError}</span>
              </div>
            )}

            <form onSubmit={handleDeleteAccount} style={{ maxWidth: '400px' }}>
              <div className="form-group" style={{ marginBottom: '1.5rem' }}>
                <label className="form-label" htmlFor="delete-confirm">
                  To confirm, type <strong style={{ color: 'var(--text-primary)' }}>DELETE</strong> below:
                </label>
                <input
                  type="text"
                  id="delete-confirm"
                  className="form-input"
                  style={{ paddingLeft: '1rem' }}
                  placeholder="Type DELETE"
                  value={deleteConfirmText}
                  onChange={(e) => setDeleteConfirmText(e.target.value)}
                  disabled={deleteLoading}
                  required
                />
              </div>

              <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                <button
                  type="submit"
                  className="btn btn-danger"
                  disabled={deleteLoading || deleteConfirmText !== 'DELETE'}
                >
                  {deleteLoading ? 'Processing...' : 'Permanently Delete'}
                </button>
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => {
                    setShowDeleteConfirmation(false);
                    setDeleteConfirmText('');
                    setDeleteError('');
                  }}
                  disabled={deleteLoading}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProfileSettings;
