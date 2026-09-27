import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import { Cake, Sparkle } from './Icons.jsx';

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const { pathname } = useLocation();

  return (
    <nav className="navbar">
      <Link to="/" className="nav-logo">
        <Cake size={22} className="anim-float" />
        Wishly
      </Link>
      <div className="nav-actions">
        {user ? (
          <>
            <Link to="/dashboard" className="btn btn-ghost" style={{ color: pathname === '/dashboard' ? 'var(--primary)' : undefined }}>
              Dashboard
            </Link>
            <Link to="/create" className="btn btn-primary" style={{ padding: '9px 18px', fontSize: '.875rem' }}>
              <Sparkle size={16} /> New wish
            </Link>
            <button className="icon-btn" style={{ padding: '7px 12px' }} onClick={() => { logout(); navigate('/'); }} title="Log out">
              <span>{user.avatar}</span>
              <span style={{ maxWidth: 72, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{user.name.split(' ')[0]}</span>
            </button>
          </>
        ) : (
          <>
            <Link to="/login" className="btn btn-ghost">Log in</Link>
            <Link to="/register" className="btn btn-primary" style={{ padding: '9px 18px', fontSize: '.875rem' }}>Get started</Link>
          </>
        )}
      </div>
    </nav>
  );
}
