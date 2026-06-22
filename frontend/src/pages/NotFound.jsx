import { Link } from 'react-router-dom';
import { Home, Frown } from 'lucide-react';

const NotFound = () => {
  return (
    <div className="page-wrapper animate-fade-in" style={{ 
      display: 'flex', 
      flexDirection: 'column', 
      alignItems: 'center', 
      justifyContent: 'center', 
      minHeight: '70vh',
      textAlign: 'center' 
    }}>
      <div style={{
        fontSize: '8rem',
        fontFamily: 'var(--font-heading)',
        fontWeight: 800,
        background: 'linear-gradient(135deg, var(--accent-primary) 0%, var(--accent-secondary) 100%)',
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent',
        lineHeight: 1,
        marginBottom: '1rem'
      }}>
        404
      </div>

      <Frown size={48} style={{ color: 'var(--text-muted)', marginBottom: '1.5rem' }} />

      <h2 style={{ fontSize: '1.75rem', color: 'var(--text-primary)', marginBottom: '0.75rem' }}>
        Page Not Found
      </h2>
      <p style={{ color: 'var(--text-secondary)', maxWidth: '400px', lineHeight: 1.6, marginBottom: '2.5rem' }}>
        The page you are looking for doesn't exist or has been moved. Let's get you back on track.
      </p>

      <Link to="/" className="btn btn-primary" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}>
        <Home size={18} />
        <span>Back to Home</span>
      </Link>
    </div>
  );
};

export default NotFound;
