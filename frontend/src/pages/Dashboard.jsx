import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { ShieldCheck, User, Calendar, Clock, Code, Database, Eye } from 'lucide-react';

const Dashboard = () => {
  const { user } = useAuth();
  const [tokenInfo, setTokenInfo] = useState({ header: null, payload: null, signature: null });
  const [showToken, setShowToken] = useState(false);
  const rawToken = localStorage.getItem('token') || '';

  useEffect(() => {
    if (!rawToken) return;
    try {
      const parts = rawToken.split('.');
      if (parts.length === 3) {
        const decodedHeader = JSON.parse(atob(parts[0]));
        const decodedPayload = JSON.parse(atob(parts[1]));
        setTokenInfo({
          header: decodedHeader,
          payload: decodedPayload,
          signature: parts[2],
        });
      }
    } catch (e) {
      console.error('Error parsing JWT token details:', e);
    }
  }, [rawToken]);

  // Format date
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div className="page-wrapper animate-fade-in">
      <div style={{ marginBottom: '2.5rem' }}>
        <h1 style={{ fontSize: '2.25rem', marginBottom: '0.5rem', color: 'var(--text-primary)' }}>
          Welcome back, {user?.name}!
        </h1>
        <p style={{ color: 'var(--text-secondary)' }}>
          Here is your security dashboard overview and session details.
        </p>
      </div>

      {/* Profile Overview Stats */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
        gap: '1.5rem',
        marginBottom: '2.5rem'
      }}>
        {/* Card 1: Role */}
        <div className="glass-panel" style={{ padding: '1.5rem', display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
          <div style={{
            background: 'rgba(99, 102, 241, 0.1)',
            color: 'var(--accent-primary)',
            padding: '1rem',
            borderRadius: '12px'
          }}>
            <ShieldCheck size={28} />
          </div>
          <div>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 600 }}>Access Level</p>
            <h3 style={{ fontSize: '1.35rem', color: 'var(--text-primary)', textTransform: 'capitalize', marginTop: '0.2rem' }}>
              {user?.role}
            </h3>
          </div>
        </div>

        {/* Card 2: Email */}
        <div className="glass-panel" style={{ padding: '1.5rem', display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
          <div style={{
            background: 'rgba(6, 182, 212, 0.1)',
            color: 'var(--accent-cyan)',
            padding: '1rem',
            borderRadius: '12px'
          }}>
            <User size={28} />
          </div>
          <div style={{ minWidth: 0 }}>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 600 }}>Account Email</p>
            <h3 style={{
              fontSize: '1.1rem',
              color: 'var(--text-primary)',
              marginTop: '0.2rem',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap'
            }}>
              {user?.email}
            </h3>
          </div>
        </div>

        {/* Card 3: Date Created */}
        <div className="glass-panel" style={{ padding: '1.5rem', display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
          <div style={{
            background: 'rgba(16, 185, 129, 0.1)',
            color: 'var(--success)',
            padding: '1rem',
            borderRadius: '12px'
          }}>
            <Calendar size={28} />
          </div>
          <div>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 600 }}>Member Since</p>
            <h3 style={{ fontSize: '0.95rem', color: 'var(--text-primary)', marginTop: '0.2rem' }}>
              {formatDate(user?.created_at).split(' at ')[0]}
            </h3>
          </div>
        </div>
      </div>

      {/* Main Section Grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(450px, 1fr))',
        gap: '2rem'
      }}>
        {/* Panel 1: Security Summary */}
        <div className="glass-panel" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <h2 style={{ fontSize: '1.4rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Database size={20} className="nav-brand-icon" />
            <span>Account Security Status</span>
          </h2>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ color: 'var(--text-secondary)' }}>Database Record ID</span>
              <code style={{ background: 'var(--bg-tertiary)', padding: '0.2rem 0.5rem', borderRadius: '4px', fontSize: '0.8rem', color: 'var(--accent-cyan)' }}>
                {user?.id}
              </code>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ color: 'var(--text-secondary)' }}>Verification Status</span>
              <span style={{ color: 'var(--success)', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.25rem', fontSize: '0.95rem' }}>
                Active Session
              </span>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ color: 'var(--text-secondary)' }}>Last Profile Update</span>
              <span style={{ fontSize: '0.9rem', color: 'var(--text-primary)' }}>
                {formatDate(user?.updated_at)}
              </span>
            </div>

            <div style={{
              marginTop: '1rem',
              padding: '1rem',
              background: 'rgba(255, 255, 255, 0.02)',
              borderRadius: '8px',
              border: '1px dashed var(--border-color)'
            }}>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
                <strong>Security Alert:</strong> Make sure to update your password regularly in the settings. This session is secured using JSON Web Token (JWT) standards stored locally.
              </p>
            </div>
          </div>
        </div>

        {/* Panel 2: JWT claims inspector */}
        <div className="glass-panel" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.75rem' }}>
            <h2 style={{ fontSize: '1.4rem', display: 'flex', alignItems: 'center', gap: '0.5rem', margin: 0 }}>
              <Code size={20} style={{ color: 'var(--accent-secondary)' }} />
              <span>JWT Claims Inspector</span>
            </h2>
            <button
              onClick={() => setShowToken(!showToken)}
              className="btn btn-secondary"
              style={{ padding: '0.4rem 0.75rem', fontSize: '0.8rem', gap: '0.3rem' }}
            >
              <Eye size={14} />
              <span>{showToken ? 'Hide Payload' : 'Inspect'}</span>
            </button>
          </div>

          {showToken ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {/* Header */}
              <div>
                <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase', marginBottom: '0.3rem' }}>JWT Header (Algorithm & Token Type)</p>
                <pre style={{
                  background: 'rgba(239, 68, 68, 0.05)',
                  border: '1px solid rgba(239, 68, 68, 0.2)',
                  color: '#f87171',
                  padding: '0.75rem',
                  borderRadius: '6px',
                  fontSize: '0.8rem',
                  overflowX: 'auto',
                  fontFamily: 'monospace'
                }}>
                  {JSON.stringify(tokenInfo.header, null, 2)}
                </pre>
              </div>

              {/* Payload */}
              <div>
                <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase', marginBottom: '0.3rem' }}>JWT Payload (Claims)</p>
                <pre style={{
                  background: 'rgba(139, 92, 246, 0.05)',
                  border: '1px solid rgba(139, 92, 246, 0.2)',
                  color: '#c084fc',
                  padding: '0.75rem',
                  borderRadius: '6px',
                  fontSize: '0.8rem',
                  overflowX: 'auto',
                  fontFamily: 'monospace'
                }}>
                  {JSON.stringify(tokenInfo.payload, null, 2)}
                </pre>
              </div>

              {/* Signature Info */}
              <div>
                <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase', marginBottom: '0.3rem' }}>Cryptographic Signature Hash</p>
                <pre style={{
                  background: 'rgba(6, 182, 212, 0.05)',
                  border: '1px solid rgba(6, 182, 212, 0.2)',
                  color: '#22d3ee',
                  padding: '0.75rem',
                  borderRadius: '6px',
                  fontSize: '0.75rem',
                  overflowX: 'auto',
                  fontFamily: 'monospace',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap'
                }}>
                  {tokenInfo.signature ? `${tokenInfo.signature.substring(0, 30)}...` : 'Signature Hash'}
                </pre>
              </div>
            </div>
          ) : (
            <div style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              flex: 1,
              padding: '2rem',
              background: 'rgba(255, 255, 255, 0.01)',
              borderRadius: '8px',
              border: '1px dashed var(--border-color)',
              textAlign: 'center',
              color: 'var(--text-secondary)'
            }}>
              <Clock size={36} style={{ color: 'var(--text-muted)', marginBottom: '1rem' }} />
              <h4 style={{ color: 'var(--text-primary)', marginBottom: '0.5rem' }}>Claims Inspector Idle</h4>
              <p style={{ fontSize: '0.85rem', maxWidth: '300px', lineHeight: 1.4 }}>
                Click "Inspect" to unpack and view the cryptographically signed JWT details for this session.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
