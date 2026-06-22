import { useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { KeyRound, LayoutDashboard, User, Settings, ShieldCheck, LogOut, Menu, X } from 'lucide-react';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    setMobileMenuOpen(false);
    navigate('/');
  };

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  return (
    <nav className="navbar">
      <Link to="/" className="nav-brand" onClick={() => setMobileMenuOpen(false)}>
        <KeyRound className="nav-brand-icon" size={24} />
        <span>SecureAuth</span>
      </Link>

      {/* Desktop Navigation Links */}
      <div className="nav-links" style={{ display: 'none' }}>
        {/* We use CSS media queries in a inline style helper or standard index.css, let's keep standard flex structure */}
      </div>

      {/* Modern Desktop Links */}
      <div className="desktop-nav nav-links" style={{ display: 'flex', alignItems: 'center' }}>
        {user ? (
          <>
            <NavLink
              to="/dashboard"
              className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')}
            >
              <LayoutDashboard size={18} />
              <span>Dashboard</span>
            </NavLink>
            
            <NavLink
              to="/settings"
              className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')}
            >
              <Settings size={18} />
              <span>Settings</span>
            </NavLink>

            {user.role === 'admin' && (
              <NavLink
                to="/admin"
                className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')}
              >
                <ShieldCheck size={18} />
                <span>Admin Panel</span>
              </NavLink>
            )}

            <div className="nav-user">
              <span className={`user-badge ${user.role === 'admin' ? 'admin' : ''}`}>
                {user.role}
              </span>
              <span className="user-name" style={{ fontWeight: 500, fontSize: '0.95rem' }}>
                {user.name}
              </span>
              <button onClick={handleLogout} className="btn btn-secondary" style={{ padding: '0.5rem 1rem', display: 'flex', gap: '0.4rem', fontSize: '0.85rem' }}>
                <LogOut size={14} />
                <span>Logout</span>
              </button>
            </div>
          </>
        ) : (
          <>
            <Link to="/login" className="nav-link">Log In</Link>
            <Link to="/register" className="btn btn-primary" style={{ padding: '0.5rem 1.25rem' }}>Sign Up</Link>
          </>
        )}
      </div>

      {/* Mobile Menu Button */}
      <button className="mobile-menu-btn" onClick={toggleMobileMenu} style={{ display: 'none', background: 'none', border: 'none', color: 'var(--text-primary)', cursor: 'pointer' }}>
        {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      {/* Inject custom media styles inline to make Navbar fully responsive without extra CSS files */}
      <style>{`
        .desktop-nav {
          display: flex;
        }
        .mobile-menu-btn {
          display: none !important;
        }
        .mobile-nav-panel {
          display: none;
        }
        @media (max-width: 768px) {
          .desktop-nav {
            display: none !important;
          }
          .mobile-menu-btn {
            display: block !important;
          }
          .mobile-nav-panel {
            display: flex;
            flex-direction: column;
            position: absolute;
            top: 70px;
            left: 0;
            right: 0;
            background: var(--bg-secondary);
            border-bottom: 1px solid var(--border-color);
            padding: 1.5rem;
            gap: 1.25rem;
            z-index: 99;
            backdrop-filter: var(--glass-blur);
          }
          .mobile-nav-panel .nav-link {
            padding: 0.5rem 0;
          }
          .mobile-nav-user {
            border-top: 1px solid var(--border-color);
            padding-top: 1rem;
            display: flex;
            flex-direction: column;
            gap: 0.75rem;
          }
        }
      `}</style>

      {/* Mobile Navigation Panel */}
      {mobileMenuOpen && (
        <div className="mobile-nav-panel animate-fade-in">
          {user ? (
            <>
              <NavLink
                to="/dashboard"
                onClick={() => setMobileMenuOpen(false)}
                className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')}
              >
                <LayoutDashboard size={18} />
                <span>Dashboard</span>
              </NavLink>
              
              <NavLink
                to="/settings"
                onClick={() => setMobileMenuOpen(false)}
                className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')}
              >
                <Settings size={18} />
                <span>Settings</span>
              </NavLink>

              {user.role === 'admin' && (
                <NavLink
                  to="/admin"
                  onClick={() => setMobileMenuOpen(false)}
                  className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')}
                >
                  <ShieldCheck size={18} />
                  <span>Admin Panel</span>
                </NavLink>
              )}

              <div className="mobile-nav-user">
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <span className="user-name" style={{ fontWeight: 500 }}>{user.name}</span>
                  <span className={`user-badge ${user.role === 'admin' ? 'admin' : ''}`}>{user.role}</span>
                </div>
                <button onClick={handleLogout} className="btn btn-secondary" style={{ width: '100%', justifyContent: 'center' }}>
                  <LogOut size={16} />
                  <span>Logout</span>
                </button>
              </div>
            </>
          ) : (
            <>
              <Link to="/login" onClick={() => setMobileMenuOpen(false)} className="nav-link" style={{ justifyContent: 'center' }}>Log In</Link>
              <Link to="/register" onClick={() => setMobileMenuOpen(false)} className="btn btn-primary" style={{ justifyContent: 'center' }}>Sign Up</Link>
            </>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;
