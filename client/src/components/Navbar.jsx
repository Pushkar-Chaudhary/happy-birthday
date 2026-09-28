import { Link, useLocation } from 'react-router-dom';
import { Cake, Heart, Sparkles } from 'lucide-react';

export default function Navbar() {
  const { pathname } = useLocation();

  return (
    <header className="navbar">
      <div className="container nav-inner">
        <Link to="/" className="nav-logo" aria-label="Wishly Home">
          <span className="nav-logo-icon">
            <Cake size={18} strokeWidth={2.2} />
          </span>
          <span className="nav-logo-text">Wishly</span>
        </Link>
        <nav className="nav-actions" aria-label="Main navigation">
          <Link to="/my-wishes" className="nav-link" aria-label="My wishes" title="My wishes">
            <Heart size={15} aria-hidden="true" />
            <span>My wishes</span>
          </Link>
          {pathname !== '/create' && (
            <Link to="/create" className="btn btn-primary btn-sm" aria-label="Create a surprise">
              <Sparkles size={14} />
              <span>Create Surprise</span>
            </Link>
          )}
        </nav>
      </div>
    </header>
  );
}
