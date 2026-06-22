import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Shield, Key, Lock, Cpu, Database, Users } from 'lucide-react';

const Landing = () => {
  const { user } = useAuth();

  return (
    <div className="page-wrapper animate-fade-in" style={{ padding: '4rem 1.5rem', textAlign: 'center' }}>
      {/* Hero Section */}
      <div style={{ maxWidth: '800px', margin: '0 auto 4rem auto' }}>
        <div style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '0.5rem',
          background: 'rgba(99, 102, 241, 0.1)',
          border: '1px solid var(--border-color-glow)',
          padding: '0.5rem 1rem',
          borderRadius: '30px',
          color: 'var(--accent-primary)',
          fontSize: '0.85rem',
          fontWeight: 600,
          textTransform: 'uppercase',
          letterSpacing: '0.05em',
          marginBottom: '1.5rem'
        }}>
          <Shield size={14} />
          <span>PostgreSQL & JWT Secured</span>
        </div>
        
        <h1 style={{
          fontSize: 'clamp(2.5rem, 5vw, 4rem)',
          lineHeight: 1.1,
          marginBottom: '1.5rem',
          background: 'linear-gradient(135deg, #ffffff 0%, var(--text-secondary) 50%, var(--accent-cyan) 100%)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          fontFamily: 'var(--font-heading)',
          fontWeight: 800
        }}>
          Enterprise-Grade User Authentication System
        </h1>
        
        <p style={{
          fontSize: 'clamp(1rem, 2vw, 1.2rem)',
          color: 'var(--text-secondary)',
          lineHeight: 1.6,
          marginBottom: '2.5rem',
          maxWidth: '640px',
          marginInline: 'auto'
        }}>
          A robust, secure full-stack authentication dashboard. Features JSON Web Tokens, bcrypt password hashing, React guards, and PostgreSQL storage.
        </p>

        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
          {user ? (
            <Link to="/dashboard" className="btn btn-primary">
              Go to Dashboard
            </Link>
          ) : (
            <>
              <Link to="/login" className="btn btn-secondary" style={{ padding: '0.875rem 2.25rem' }}>
                Log In
              </Link>
              <Link to="/register" className="btn btn-primary" style={{ padding: '0.875rem 2.25rem' }}>
                Get Started
              </Link>
            </>
          )}
        </div>
      </div>

      {/* Feature Cards Grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
        gap: '2rem',
        maxWidth: '1100px',
        margin: '0 auto'
      }}>
        {/* Card 1 */}
        <div className="glass-panel" style={{ textAlign: 'left', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div style={{
            background: 'rgba(6, 182, 212, 0.1)',
            width: '48px',
            height: '48px',
            borderRadius: '12px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'var(--accent-cyan)'
          }}>
            <Lock size={24} />
          </div>
          <h3 style={{ fontSize: '1.25rem', color: 'var(--text-primary)' }}>Cryptographic Security</h3>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', lineHeight: 1.5 }}>
            Passwords are salted and cryptographically hashed using **bcrypt** before database storage, protecting user credentials at rest.
          </p>
        </div>

        {/* Card 2 */}
        <div className="glass-panel" style={{ textAlign: 'left', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div style={{
            background: 'rgba(99, 102, 241, 0.1)',
            width: '48px',
            height: '48px',
            borderRadius: '12px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'var(--accent-primary)'
          }}>
            <Key size={24} />
          </div>
          <h3 style={{ fontSize: '1.25rem', color: 'var(--text-primary)' }}>JSON Web Tokens</h3>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', lineHeight: 1.5 }}>
            Sessions are managed client-side with secure, self-contained **JWT access tokens** automatically transmitted in HTTP Authorization headers.
          </p>
        </div>

        {/* Card 3 */}
        <div className="glass-panel" style={{ textAlign: 'left', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div style={{
            background: 'rgba(139, 92, 246, 0.1)',
            width: '48px',
            height: '48px',
            borderRadius: '12px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'var(--accent-secondary)'
          }}>
            <Users size={24} />
          </div>
          <h3 style={{ fontSize: '1.25rem', color: 'var(--text-primary)' }}>Role-Based Access</h3>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', lineHeight: 1.5 }}>
            Built-in hierarchy with user and admin access controls, featuring user lists, role switching, and account pruning in the Admin Dashboard.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Landing;
