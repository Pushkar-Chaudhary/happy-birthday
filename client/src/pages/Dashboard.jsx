import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { THEMES } from '../constants.js';
import api from '../api.js';
import Seo from '../components/Seo.jsx';
import { Copy, Check, Eye, Trash, Sparkle } from '../components/Icons.jsx';

function PasswordCard() {
  const [form, setForm] = useState({ currentPassword: '', newPassword: '', confirmPassword: '' });
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    setError('');

    if (form.newPassword.length < 6) {
      setError('New password must be at least 6 characters.');
      return;
    }

    if (form.newPassword !== form.confirmPassword) {
      setError('New passwords do not match.');
      return;
    }

    setLoading(true);
    try {
      const { data } = await api.put('/auth/change-password', {
        currentPassword: form.currentPassword,
        newPassword: form.newPassword,
      });
      setMessage(data.message || 'Password updated successfully.');
      setForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
    } catch (err) {
      setError(err.response?.data?.message || 'Could not update the password.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="glass" style={{ padding: '24px 22px', marginBottom: 24 }}>
      <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.45rem', marginBottom: 12 }}>Change password</h2>
      {error && <div className="alert alert-error" style={{ marginBottom: 16 }}>{error}</div>}
      {message && <div className="alert" style={{ marginBottom: 16, background: 'rgba(74,222,128,0.1)', border: '1px solid rgba(74,222,128,0.25)', color: '#bbf7d0' }}>{message}</div>}
      <form onSubmit={handleSubmit} style={{ display: 'grid', gap: 14 }}>
        <div className="form-group">
          <label className="form-label" htmlFor="current-password">Current password</label>
          <input id="current-password" type="password" className="form-input" value={form.currentPassword} onChange={e => setForm(f => ({ ...f, currentPassword: e.target.value }))} required autoComplete="current-password" />
        </div>
        <div className="form-group">
          <label className="form-label" htmlFor="new-password">New password</label>
          <input id="new-password" type="password" className="form-input" value={form.newPassword} onChange={e => setForm(f => ({ ...f, newPassword: e.target.value }))} required autoComplete="new-password" />
        </div>
        <div className="form-group">
          <label className="form-label" htmlFor="confirm-new-password">Confirm new password</label>
          <input id="confirm-new-password" type="password" className="form-input" value={form.confirmPassword} onChange={e => setForm(f => ({ ...f, confirmPassword: e.target.value }))} required autoComplete="new-password" />
        </div>
        <button type="submit" className="btn btn-primary" disabled={loading} style={{ width: 'fit-content', padding: '12px 20px' }}>
          {loading ? 'Updating…' : 'Update password'}
        </button>
      </form>
    </div>
  );
}

function WishCard({ wish, onDelete }) {
  const theme = THEMES[wish.theme] || THEMES.rose;
  const date = new Date(wish.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  const [copying, setCopying] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const copyLink = () => {
    const url = `${window.location.origin}/w/${wish.slug}`;
    navigator.clipboard.writeText(url).then(() => { setCopying(true); setTimeout(() => setCopying(false), 2000); });
  };

  const handleDelete = async () => {
    if (!confirm(`Delete wish for "${wish.recipientName}"? This cannot be undone.`)) return;
    setDeleting(true);
    try {
      await api.delete(`/wishes/${wish._id}`);
      onDelete(wish._id);
    } catch { setDeleting(false); }
  };

  return (
    <div className="glass lift-card" style={{
      padding: '22px 24px',
      borderLeft: `3px solid ${theme.accent}`,
    }}>
      <div style={{ display: 'flex', alignItems: 'flex-start', gap: 14, flexWrap: 'wrap' }}>
        {/* Theme icon */}
        <div style={{
          width: 48, height: 48, borderRadius: 12, flexShrink: 0,
          background: theme.bg, display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: '1.4rem', border: `1px solid ${theme.border}`,
        }}>
          {theme.emoji}
        </div>

        {/* Info */}
        <div style={{ flex: 1, minWidth: 160 }}>
          <h3 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: 4 }}>
            🎂 {wish.recipientName}
          </h3>
          <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', marginBottom: 6 }}>
            {date} · {theme.name} theme
          </p>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-soft)', lineHeight: 1.5 }}>
            "{wish.message.slice(0, 80)}{wish.message.length > 80 ? '…' : ''}"
          </p>
        </div>

        {/* Views badge */}
        <div style={{ textAlign: 'center', flexShrink: 0 }}>
          <div style={{ fontSize: '1.2rem', fontWeight: 800, color: theme.accent }}>{wish.views}</div>
          <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', fontWeight: 600 }}>VIEWS</div>
        </div>
      </div>

      {/* Actions */}
      <div style={{ display: 'flex', gap: 10, marginTop: 18, flexWrap: 'wrap' }}>
        <button className="btn btn-primary" onClick={copyLink} style={{ padding: '8px 18px', fontSize: '0.835rem', flex: 1 }}>
          {copying ? <><Check size={15} /> Copied</> : <><Copy size={15} /> Copy link</>}
        </button>
        <a href={`/w/${wish.slug}`} target="_blank" rel="noreferrer"
          className="btn btn-secondary" style={{ padding: '8px 18px', fontSize: '0.835rem' }}>
          <Eye size={15} /> View
        </a>
        <button className="btn btn-ghost" onClick={handleDelete} disabled={deleting}
          style={{ color: deleting ? 'var(--text-muted)' : '#f87171', fontSize: '0.835rem' }}>
          <Trash size={16} />
        </button>
      </div>
    </div>
  );
}

export default function Dashboard() {
  const [wishes, setWishes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/wishes/mine')
      .then(res => setWishes(res.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const onDelete = (id) => setWishes(w => w.filter(x => x._id !== id));

  if (loading) return (
    <div className="center" style={{ height: '80vh' }}><div className="spinner" /></div>
  );

  return (
    <div className="page" style={{ padding: '48px 24px', maxWidth: 760, margin: '0 auto' }}>
      <Seo title="My wishes — Wishly" description="Manage the birthday pages you have sent." />
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 16, marginBottom: 40 }}>
        <div>
          <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '1.9rem', marginBottom: 6 }}>My Wishes</h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
            {wishes.length} wish{wishes.length !== 1 ? 'es' : ''} sent so far
          </p>
        </div>
        <Link to="/create" className="btn btn-primary" style={{ padding: '11px 24px' }}>
          <Sparkle size={16} /> New wish
        </Link>
      </div>

      <PasswordCard />

      {/* Stats row */}
      {wishes.length > 0 && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 14, marginBottom: 36 }}>
          {[
            { label: 'Total Wishes', value: wishes.length, icon: '🎂' },
            { label: 'Total Views', value: wishes.reduce((a, w) => a + w.views, 0), icon: '👁' },
            { label: 'Most Viewed', value: Math.max(...wishes.map(w => w.views)), icon: '🌟' },
          ].map(s => (
            <div key={s.label} className="glass" style={{ padding: '18px 20px', textAlign: 'center' }}>
              <div style={{ fontSize: '1.4rem', marginBottom: 6 }}>{s.icon}</div>
              <div style={{ fontSize: '1.6rem', fontWeight: 800, color: 'var(--primary)' }}>{s.value}</div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 600, marginTop: 2 }}>{s.label.toUpperCase()}</div>
            </div>
          ))}
        </div>
      )}

      {/* Wish list */}
      {wishes.length === 0 ? (
        <div className="glass center" style={{ padding: '72px 32px', flexDirection: 'column', textAlign: 'center', gap: 16 }}>
          <div style={{ fontSize: '4rem', animation: 'float 3s ease-in-out infinite' }}>🎂</div>
          <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.5rem' }}>No wishes yet</h2>
          <p style={{ color: 'var(--text-muted)', maxWidth: 340, lineHeight: 1.6 }}>
            Create your first birthday wish and make someone's day magical!
          </p>
          <Link to="/create" className="btn btn-primary" style={{ marginTop: 8 }}>🌸 Create First Wish</Link>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {wishes.map(w => <WishCard key={w._id} wish={w} onDelete={onDelete} />)}
        </div>
      )}
    </div>
  );
}
