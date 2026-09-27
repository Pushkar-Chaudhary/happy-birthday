import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import { AVATARS } from '../constants.js';
import api from '../api.js';
import Seo from '../components/Seo.jsx';

export default function Register() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', email: '', password: '', avatar: '🎁' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (form.password.length < 6) { setError('Password must be at least 6 characters'); return; }
    setLoading(true);
    try {
      const { data } = await api.post('/auth/register', form);
      login(data.user);
      navigate('/create');
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page center" style={{ minHeight: 'calc(100vh - 68px)', padding: '40px 24px' }}>
      <Seo title="Create account — Wishly" description="Join Wishly and send a birthday surprise page." />
      <div className="glass anim-fade-up" style={{ width: '100%', maxWidth: 480, padding: '44px 40px' }}>
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: 32 }}>
          <div style={{ fontSize: '2.8rem', marginBottom: 12, animation: 'float 3s ease-in-out infinite' }}>🎉</div>
          <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '1.9rem', marginBottom: 8 }}>Join Wishly</h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Start creating magical birthday surprises</p>
        </div>

        {error && <div className="alert alert-error" style={{ marginBottom: 24 }}>{error}</div>}

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          <div className="form-group">
            <label className="form-label" htmlFor="reg-name">Your Name</label>
            <input
              id="reg-name"
              type="text"
              className="form-input"
              placeholder="e.g. Aarav Sharma"
              value={form.name}
              onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
              required
              autoComplete="name"
            />
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="reg-email">Email Address</label>
            <input
              id="reg-email"
              type="email"
              className="form-input"
              placeholder="you@example.com"
              value={form.email}
              onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
              required
              autoComplete="email"
            />
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="reg-password">Password</label>
            <input
              id="reg-password"
              type="password"
              className="form-input"
              placeholder="At least 6 characters"
              value={form.password}
              onChange={e => setForm(f => ({ ...f, password: e.target.value }))}
              required
              autoComplete="new-password"
            />
          </div>

          {/* Avatar picker */}
          <div className="form-group">
            <label className="form-label">Pick Your Avatar</label>
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
              {AVATARS.map(av => (
                <button
                  key={av}
                  type="button"
                  onClick={() => setForm(f => ({ ...f, avatar: av }))}
                  style={{
                    width: 44, height: 44, borderRadius: 10, fontSize: '1.4rem',
                    border: `2px solid ${form.avatar === av ? 'var(--primary)' : 'var(--border)'}`,
                    background: form.avatar === av ? 'rgba(255,107,157,0.1)' : 'var(--glass)',
                    cursor: 'pointer', transition: 'var(--transition)',
                    boxShadow: form.avatar === av ? '0 0 0 3px rgba(255,107,157,0.15)' : 'none',
                  }}
                >{av}</button>
              ))}
            </div>
          </div>

          <button
            type="submit"
            className="btn btn-primary"
            disabled={loading}
            style={{ width: '100%', padding: '14px', fontSize: '1rem', marginTop: 4 }}
          >
            {loading ? <><span className="spinner-sm" style={{ borderColor:'rgba(255,255,255,0.3)', borderTopColor:'#fff' }} /> Creating account…</> : '🎂 Create My Account'}
          </button>
        </form>

        <p style={{ textAlign: 'center', marginTop: 28, color: 'var(--text-muted)', fontSize: '0.9rem' }}>
          Already have an account?{' '}
          <Link to="/login" style={{ color: 'var(--primary)', fontWeight: 600 }}>Sign in</Link>
        </p>
      </div>
    </div>
  );
}
