import { useState } from 'react';
import { useAuth } from '../context/AuthContext.jsx';
import { FLOWERS, WRAPPING, RIBBONS, THEMES, MESSAGE_TEMPLATES, MAX_FLOWERS } from '../constants.js';
import api from '../api.js';
import Bouquet, { FlowerMark } from '../components/Bouquet.jsx';
import Seo from '../components/Seo.jsx';
import { Copy, Check, Eye, WhatsApp, Sparkle } from '../components/Icons.jsx';

const STEPS = [
  { id: 1, title: "Who's the Birthday Star?", icon: '🎂' },
  { id: 2, title: 'Write Your Wish',           icon: '💌' },
  { id: 3, title: 'Design the Bouquet',         icon: '🌸' },
  { id: 4, title: 'Pick a Theme',               icon: '🎨' },
  { id: 5, title: 'Share the Magic',            icon: '✨' },
];

const defaultWish = {
  recipientName: '',
  senderName: '',
  message: '',
  theme: 'rose',
  bouquet: { flowers: { rose: 2, tulip: 1, daisy: 1 }, wrapping: 'kraft', ribbon: 'pink' },
};

// Step indicator bar
function StepBar({ current }) {
  return (
    <div className="step-bar" style={{ marginBottom: 40 }}>
      {STEPS.map((s, i) => (
        <div key={s.id} className="step-item" style={{ flex: i < STEPS.length - 1 ? '1' : '0' }}>
          <div className={`step-circle ${current === s.id ? 'active' : current > s.id ? 'done' : ''}`}>
            {current > s.id ? '✓' : s.id}
          </div>
          {i < STEPS.length - 1 && <div className={`step-line ${current > s.id ? 'done' : ''}`} />}
        </div>
      ))}
    </div>
  );
}

export default function Create() {
  const { user } = useAuth();
  const [step, setStep] = useState(1);
  const [wish, setWish] = useState({ ...defaultWish, senderName: user?.name || '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [result, setResult] = useState(null); // { slug }
  const [copied, setCopied] = useState(false);

  const update = (key, val) => setWish(w => ({ ...w, [key]: val }));
  const updateBouquet = (key, val) => setWish(w => ({ ...w, bouquet: { ...w.bouquet, [key]: val } }));

  const totalFlowers = Object.values(wish.bouquet.flowers).reduce((a, b) => a + b, 0);

  const addFlower = (type) => {
    if (totalFlowers >= MAX_FLOWERS) return;
    setWish(w => ({ ...w, bouquet: { ...w.bouquet, flowers: { ...w.bouquet.flowers, [type]: (w.bouquet.flowers[type] || 0) + 1 } } }));
  };
  const removeFlower = (type) => {
    const curr = wish.bouquet.flowers[type] || 0;
    if (curr === 0) return;
    setWish(w => ({ ...w, bouquet: { ...w.bouquet, flowers: { ...w.bouquet.flowers, [type]: curr - 1 } } }));
  };

  const next = () => {
    setError('');
    if (step === 1 && !wish.recipientName.trim()) { setError('Please enter the recipient\'s name.'); return; }
    if (step === 2 && !wish.message.trim()) { setError('Please write a birthday message.'); return; }
    setStep(s => s + 1);
  };

  const generate = async () => {
    setError(''); setLoading(true);
    try {
      const { data } = await api.post('/wishes', {
        recipientName: wish.recipientName,
        senderName: wish.senderName || user.name,
        senderAvatar: user.avatar,
        message: wish.message,
        theme: wish.theme,
        bouquet: wish.bouquet,
      });
      setResult(data);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create wish. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const copyLink = () => {
    const url = `${window.location.origin}/w/${result.slug}`;
    navigator.clipboard.writeText(url).then(() => { setCopied(true); setTimeout(() => setCopied(false), 2500); });
  };

  const wishLink = result ? `${window.location.origin}/w/${result.slug}` : '';

  return (
    <div className="page" style={{ padding: '48px 24px', maxWidth: 680, margin: '0 auto' }}>
      <Seo title="Create a wish — Wishly" description="Design a birthday letter, bouquet, and surprise page." />
      <div className="anim-fade-up">
        {/* Title */}
        <div style={{ textAlign: 'center', marginBottom: 36 }}>
          <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '2rem', marginBottom: 8 }}>
            {STEPS[step - 1].icon} {STEPS[step - 1].title}
          </h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Step {step} of {STEPS.length}</p>
        </div>

        <StepBar current={step} />

        {error && <div className="alert alert-error" style={{ marginBottom: 24 }}>{error}</div>}

        {/* ── STEP 1: Recipient ── */}
        {step === 1 && (
          <div className="glass" style={{ padding: '36px 32px' }}>
            <div className="form-group" style={{ marginBottom: 24 }}>
              <label className="form-label" htmlFor="recipient-name">Birthday Person's Name</label>
              <input
                id="recipient-name"
                className="form-input"
                placeholder="e.g. Pushkar, Priya, Alex…"
                value={wish.recipientName}
                onChange={e => update('recipientName', e.target.value)}
                style={{ fontSize: '1.1rem' }}
                autoFocus
              />
            </div>
            <div className="form-group">
              <label className="form-label" htmlFor="sender-name">Your Name (how they'll see you)</label>
              <input
                id="sender-name"
                className="form-input"
                placeholder="Your name"
                value={wish.senderName}
                onChange={e => update('senderName', e.target.value)}
              />
            </div>
          </div>
        )}

        {/* ── STEP 2: Message ── */}
        {step === 2 && (
          <div className="glass" style={{ padding: '36px 32px' }}>
            <div className="form-group" style={{ marginBottom: 20 }}>
              <label className="form-label" htmlFor="message">Your Birthday Message</label>
              <textarea
                id="message"
                className="form-input"
                placeholder="Write something from the heart…"
                value={wish.message}
                onChange={e => update('message', e.target.value)}
                style={{ minHeight: 140, fontSize: '0.98rem' }}
                maxLength={1000}
              />
              <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)', alignSelf: 'flex-end' }}>
                {wish.message.length}/1000
              </span>
            </div>

            {/* Templates */}
            <div>
              <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', marginBottom: 10, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                Or pick a template:
              </p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {MESSAGE_TEMPLATES.map((t, i) => (
                  <button
                    key={i}
                    onClick={() => update('message', t)}
                    style={{
                      textAlign: 'left', padding: '10px 14px', borderRadius: 10,
                      background: wish.message === t ? 'rgba(255,107,157,0.1)' : 'var(--glass)',
                      border: `1px solid ${wish.message === t ? 'rgba(255,107,157,0.3)' : 'var(--border)'}`,
                      color: 'var(--text-soft)', fontSize: '0.875rem', cursor: 'pointer',
                      transition: 'var(--transition)', lineHeight: 1.5,
                    }}
                    onMouseEnter={e => { if (wish.message !== t) e.currentTarget.style.borderColor = 'rgba(255,255,255,0.14)'; }}
                    onMouseLeave={e => { if (wish.message !== t) e.currentTarget.style.borderColor = 'var(--border)'; }}
                  >
                    {t}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ── STEP 3: Bouquet ── */}
        {step === 3 && (
          <div className="glass" style={{ padding: '36px 32px' }}>
            {/* Live preview */}
            <div style={{ marginBottom: 28, padding: '12px', background: 'rgba(255,255,255,0.02)', borderRadius: 14, border: '1px solid var(--border)' }}>
              <Bouquet bouquet={wish.bouquet} size={200} />
              <p style={{ textAlign: 'center', fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: 10 }}>
                {totalFlowers}/{MAX_FLOWERS} flowers
              </p>
            </div>

            {/* Flower picker */}
            <p className="form-label" style={{ marginBottom: 12 }}>Flowers</p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 28 }}>
              {Object.entries(FLOWERS).map(([key, f]) => (
                <div key={key} style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                  <FlowerMark type={key} />
                  <span style={{ flex: 1, fontSize: '0.9rem', fontWeight: 600 }}>{f.name}</span>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <button onClick={() => removeFlower(key)} disabled={!wish.bouquet.flowers[key]} style={{
                      width: 32, height: 32, borderRadius: '50%', border: '1px solid var(--border)',
                      background: 'var(--glass)', color: 'var(--text)', fontSize: '1.1rem',
                      cursor: wish.bouquet.flowers[key] ? 'pointer' : 'not-allowed', opacity: wish.bouquet.flowers[key] ? 1 : 0.3,
                      transition: 'var(--transition)', display: 'flex', alignItems: 'center', justifyContent: 'center',
                    }}>−</button>
                    <span style={{ width: 24, textAlign: 'center', fontWeight: 700, fontSize: '1rem' }}>
                      {wish.bouquet.flowers[key] || 0}
                    </span>
                    <button onClick={() => addFlower(key)} disabled={totalFlowers >= MAX_FLOWERS} style={{
                      width: 32, height: 32, borderRadius: '50%', border: '1px solid var(--border)',
                      background: 'var(--glass)', color: 'var(--text)', fontSize: '1.1rem',
                      cursor: totalFlowers < MAX_FLOWERS ? 'pointer' : 'not-allowed', opacity: totalFlowers < MAX_FLOWERS ? 1 : 0.3,
                      transition: 'var(--transition)', display: 'flex', alignItems: 'center', justifyContent: 'center',
                    }}>+</button>
                  </div>
                </div>
              ))}
            </div>

            {/* Wrapping */}
            <p className="form-label" style={{ marginBottom: 10 }}>Wrapping Paper</p>
            <div style={{ display: 'flex', gap: 10, marginBottom: 24, flexWrap: 'wrap' }}>
              {Object.entries(WRAPPING).map(([key, w]) => (
                <button key={key} onClick={() => updateBouquet('wrapping', key)} style={{
                  padding: '8px 16px', borderRadius: 'var(--radius-full)', fontSize: '0.875rem', fontWeight: 600,
                  border: `2px solid ${wish.bouquet.wrapping === key ? w.color : 'var(--border)'}`,
                  background: wish.bouquet.wrapping === key ? `${w.color}22` : 'var(--glass)',
                  color: wish.bouquet.wrapping === key ? w.color : 'var(--text-muted)',
                  cursor: 'pointer', transition: 'var(--transition)',
                  display: 'flex', alignItems: 'center', gap: 6,
                }}>
                  <span style={{ width: 12, height: 12, borderRadius: '50%', background: w.color, display: 'inline-block' }} />
                  {w.name}
                </button>
              ))}
            </div>

            {/* Ribbon */}
            <p className="form-label" style={{ marginBottom: 10 }}>Ribbon Colour</p>
            <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
              {Object.entries(RIBBONS).map(([key, r]) => (
                <button key={key} onClick={() => updateBouquet('ribbon', key)} style={{
                  width: 40, height: 40, borderRadius: '50%', background: r.color,
                  border: `3px solid ${wish.bouquet.ribbon === key ? '#fff' : 'transparent'}`,
                  boxShadow: wish.bouquet.ribbon === key ? `0 0 0 2px ${r.color}` : 'none',
                  cursor: 'pointer', transition: 'var(--transition)',
                }} title={r.name} />
              ))}
            </div>
          </div>
        )}

        {/* ── STEP 4: Theme ── */}
        {step === 4 && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 16 }}>
            {Object.entries(THEMES).map(([key, t]) => (
              <button
                key={key}
                onClick={() => update('theme', key)}
                style={{
                  padding: '28px 20px', borderRadius: 'var(--radius-lg)', cursor: 'pointer',
                  background: t.bg, border: `2px solid ${wish.theme === key ? t.accent : 'rgba(255,255,255,0.08)'}`,
                  boxShadow: wish.theme === key ? `0 0 0 4px ${t.glow}, 0 8px 32px rgba(0,0,0,0.4)` : '0 4px 16px rgba(0,0,0,0.3)',
                  transition: 'var(--transition)', textAlign: 'center',
                  transform: wish.theme === key ? 'scale(1.03)' : 'scale(1)',
                }}
              >
                <div style={{ fontSize: '2rem', marginBottom: 10 }}>{t.emoji}</div>
                <div style={{ color: t.accent, fontWeight: 700, fontSize: '0.95rem' }}>{t.name}</div>
                {wish.theme === key && <div style={{ marginTop: 8, fontSize: '0.75rem', color: t.accent, opacity: 0.8 }}>✓ Selected</div>}
              </button>
            ))}
          </div>
        )}

        {/* ── STEP 5: Generate ── */}
        {step === 5 && (
          <div className="glass" style={{ padding: '36px 32px', textAlign: 'center' }}>
            {!result ? (
              <>
                {/* Summary */}
                <div style={{ marginBottom: 32 }}>
                  <div style={{ fontSize: '3rem', marginBottom: 16, animation: 'float 3s ease-in-out infinite' }}>{THEMES[wish.theme].emoji}</div>
                  <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.5rem', marginBottom: 8 }}>
                    To: {wish.recipientName}
                  </h2>
                  <div className="badge badge-rose" style={{ margin: '8px auto', display: 'inline-flex' }}>{THEMES[wish.theme].name} Theme</div>
                  <p style={{ color: 'var(--text-soft)', fontSize: '0.9rem', marginTop: 12, lineHeight: 1.6, maxWidth: 400, margin: '12px auto 0' }}>
                    "{wish.message.slice(0, 100)}{wish.message.length > 100 ? '…' : ''}"
                  </p>
                </div>
                <div style={{ marginBottom: 28 }}>
                  <Bouquet bouquet={wish.bouquet} size={180} />
                </div>
                <button className="btn btn-primary" onClick={generate} disabled={loading} style={{ padding: '15px 44px', fontSize: '1.05rem', width: '100%' }}>
                  {loading
                    ? <><span className="spinner-sm" style={{ borderColor: 'rgba(255,255,255,0.3)', borderTopColor: '#fff' }} /> Saving…</>
                    : <><Sparkle size={18} /> Generate link</>}
                </button>
              </>
            ) : (
              /* Link generated! */
              <div className="anim-bounce-in">
                <div style={{ fontSize: '3.5rem', marginBottom: 16, animation: 'float 3s ease-in-out infinite' }}>🎉</div>
                <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.6rem', marginBottom: 8 }}>Your Wish is Ready!</h2>
                <p style={{ color: 'var(--text-muted)', marginBottom: 28 }}>Share this magic link with {wish.recipientName}:</p>

                <div style={{
                  display: 'flex', gap: 10, padding: '14px 16px', borderRadius: 'var(--radius)',
                  background: 'rgba(255,255,255,0.04)', border: '1px solid var(--border)', marginBottom: 20,
                }}>
                  <input readOnly value={wishLink} style={{
                    flex: 1, background: 'none', border: 'none', color: 'var(--primary)',
                    fontSize: '0.88rem', fontWeight: 600, outline: 'none', cursor: 'text',
                  }} />
                  <button className="btn btn-primary" onClick={copyLink} style={{ padding: '8px 18px', fontSize: '0.875rem', flexShrink: 0 }}>
                    {copied ? <><Check size={16} /> Copied</> : <><Copy size={16} /> Copy</>}
                  </button>
                </div>

                <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
                  <a href={wishLink} target="_blank" rel="noreferrer" className="btn btn-secondary" style={{ fontSize: '0.875rem' }}>
                    <Eye size={16} /> Preview
                  </a>
                  <a className="btn btn-secondary" style={{ fontSize: '0.875rem' }}
                    href={`https://wa.me/?text=${encodeURIComponent(`A birthday surprise for you: ${wishLink}`)}`}
                    target="_blank" rel="noreferrer">
                    <WhatsApp size={16} /> WhatsApp
                  </a>
                  <button className="btn btn-ghost" onClick={() => { setResult(null); setStep(1); setWish({ ...defaultWish, senderName: user?.name || '' }); }} style={{ fontSize: '0.875rem' }}>
                    + Create another
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Navigation buttons */}
        {step < 5 && (
          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 28, gap: 12 }}>
            {step > 1
              ? <button className="btn btn-secondary" onClick={() => setStep(s => s - 1)}>← Back</button>
              : <div />}
            <button className="btn btn-primary" onClick={next} style={{ minWidth: 140 }}>
              {step === 4 ? '✨ Preview →' : 'Next →'}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
