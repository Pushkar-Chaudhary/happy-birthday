import { useEffect, useState, useCallback } from 'react';
import { useParams, Link } from 'react-router-dom';
import { THEMES } from '../constants.js';
import Confetti from '../components/Confetti.jsx';
import Bouquet from '../components/Bouquet.jsx';
import Seo from '../components/Seo.jsx';
import { Sparkle, Gift } from '../components/Icons.jsx';
import api from '../api.js';

function BirthdayCake({ blown, onBlow }) {
  return (
    <button type="button" className={`cake-scene ${blown ? 'blown' : ''}`} onClick={onBlow} aria-label="Blow out the candles">
      <svg viewBox="0 0 140 120">
        {[42, 70, 98].map((x) => (
          <g key={x}>
            <rect x={x - 3} y="28" width="6" height="22" rx="2" fill="#f8fafc" />
            <ellipse className="flame" cx={x} cy="20" rx="5" ry="10" fill="#fbbf24" />
          </g>
        ))}
        <path d="M18 58h104v10H18z" fill="#ff8fa3" />
        <path d="M22 68h96v36c0 6-8 10-48 10s-48-4-48-10z" fill="#fde68a" />
        <path d="M22 86h96" stroke="#f59e0b" strokeWidth="3" />
      </svg>
      <span style={{ display: 'block', fontSize: '.8rem', color: 'inherit', opacity: .75 }}>
        {blown ? 'Make a wish' : 'Tap to blow the candles'}
      </span>
    </button>
  );
}

export default function Wish() {
  const { slug } = useParams();
  const [wish, setWish] = useState(null);
  const [error, setError] = useState(false);
  const [stage, setStage] = useState('envelope');
  const [openEnv, setOpenEnv] = useState(false);
  const [openGift, setOpenGift] = useState(false);
  const [confetti, setConfetti] = useState(false);
  const [blown, setBlown] = useState(false);

  useEffect(() => {
    api.get(`/wishes/${slug}`)
      .then((res) => setWish(res.data))
      .catch(() => setError(true));
  }, [slug]);

  const burst = useCallback(() => {
    setConfetti(false);
    setTimeout(() => setConfetti(true), 40);
    setTimeout(() => setConfetti(false), 4500);
  }, []);

  const openLetter = () => {
    setOpenEnv(true);
    setTimeout(() => setStage('letter'), 650);
  };

  const unwrap = () => {
    setStage('gift');
    setTimeout(() => setOpenGift(true), 80);
    setTimeout(() => {
      setStage('reveal');
      burst();
    }, 900);
  };

  if (error) {
    return (
      <div className="center" style={{ minHeight: '100vh', flexDirection: 'column', gap: 16, padding: 24, textAlign: 'center' }}>
        <Seo title="Wish not found — Wishly" description="This birthday surprise is missing." />
        <h1>This wish has gone missing</h1>
        <p style={{ color: 'var(--text-muted)' }}>The link may be wrong, or the sender deleted it.</p>
        <Link to="/" className="btn btn-primary">Create your own</Link>
      </div>
    );
  }

  if (!wish) {
    return (
      <div className="center" style={{ minHeight: '100vh', flexDirection: 'column', gap: 16 }}>
        <div className="spinner" />
        <p style={{ color: 'var(--text-muted)' }}>Preparing your surprise…</p>
      </div>
    );
  }

  const theme = THEMES[wish.theme] || THEMES.rose;

  return (
    <div style={{ minHeight: '100vh', background: theme.bg, position: 'relative', overflow: 'hidden' }}>
      <Seo title={`Happy Birthday, ${wish.recipientName}!`} description={wish.message.slice(0, 160)} />
      <Confetti active={confetti} />

      <div className="center" style={{ minHeight: '100vh', padding: '48px 20px', flexDirection: 'column', textAlign: 'center' }}>
        {stage === 'envelope' && (
          <div className="anim-fade-up">
            <p className="badge badge-gold" style={{ marginBottom: 22 }}>A letter arrived for you</p>
            <div className={`envelope ${openEnv ? 'open' : ''}`} onClick={openLetter} role="button" tabIndex={0} onKeyDown={(e) => e.key === 'Enter' && openLetter()}>
              <div className="envelope-body" />
              <div className="envelope-flap" />
              <div className="envelope-label">To: {wish.recipientName}</div>
              <div className="wax">♥</div>
            </div>
            <p style={{ marginTop: 22, color: theme.accent, fontWeight: 600 }}>Tap the wax seal</p>
          </div>
        )}

        {stage === 'letter' && (
          <div className="anim-bounce-in" style={{ width: '100%' }}>
            <div className="parchment">
              <p>“{wish.message}”</p>
              <div className="sign">— {wish.senderName} {wish.senderAvatar}</div>
            </div>
            <button className="btn btn-gold" style={{ marginTop: 28 }} onClick={unwrap}>
              <Gift size={18} /> Unwrap your gift
            </button>
          </div>
        )}

        {stage === 'gift' && (
          <div className={`gift ${openGift ? 'open' : ''}`}>
            <div className="gift-bow">🎀</div>
            <div className="gift-lid" />
            <div className="gift-box" />
          </div>
        )}

        {stage === 'reveal' && (
          <div className="anim-fade-up" style={{ width: '100%', maxWidth: 640 }}>
            <p className="badge" style={{ background: theme.card, border: `1px solid ${theme.border}`, color: theme.accent, marginBottom: 16 }}>Happy Birthday</p>
            <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(2rem, 6vw, 3.4rem)', color: '#fff' }}>
              Happy Birthday,
            </h1>
            <h2 style={{ fontFamily: 'var(--font-cursive)', fontSize: 'clamp(2.6rem, 8vw, 4.6rem)', color: theme.accent, marginBottom: 12 }}>
              {wish.recipientName}
            </h2>
            <Bouquet bouquet={wish.bouquet} size={240} />
            <div style={{ margin: '28px 0 8px' }}>
              <BirthdayCake blown={blown} onBlow={() => { setBlown(true); burst(); }} />
            </div>
            <button className="btn btn-primary" style={{ background: theme.accent, marginTop: 8 }} onClick={burst}>
              <Sparkle size={18} /> Celebrate again
            </button>
            <p style={{ marginTop: 36, opacity: .5, fontSize: '.8rem', color: '#fff' }}>
              Made on <Link to="/" style={{ color: theme.accent, fontWeight: 700 }}>Wishly</Link>
            </p>
          </div>
        )}
      </div>
    </div>
  );
}