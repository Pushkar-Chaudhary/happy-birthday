import { useEffect, useState, useCallback } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Sparkles, Gift, Volume2, VolumeX, Heart } from 'lucide-react';
import { THEMES } from '../constants.js';
import Confetti from '../components/Confetti.jsx';
import Bouquet from '../components/Bouquet.jsx';
import Seo from '../components/Seo.jsx';
import RealisticCake from '../components/RealisticCake.jsx';
import { getWish } from '../wishStorage.js';
import { loadWish } from '../api.js';
import { useBirthdaySong } from '../hooks/useBirthdaySong.js';

export default function Wish() {
  const { slug } = useParams();
  const [wish, setWish] = useState(null);
  const [error, setError] = useState('');
  const [stage, setStage] = useState('envelope'); // 'envelope' -> 'letter' -> 'gift' -> 'reveal'
  const [openEnv, setOpenEnv] = useState(false);
  const [openGift, setOpenGift] = useState(false);
  const [confetti, setConfetti] = useState(false);
  const [blown, setBlown] = useState(false);
  const [cakeCut, setCakeCut] = useState(false);

  const {
    isPlaying,
    isMuted,
    playBirthdaySong,
    toggleMute,
  } = useBirthdaySong();

  useEffect(() => {
    let active = true;
    setWish(null);
    setError('');

    // Offline-created links contain the wish in the URL, so they need no API request.
    if (slug.length > 32) {
      const storedWish = getWish(slug);
      if (storedWish) {
        setWish(storedWish);
        return () => { active = false; };
      }
      setError('invalid');
      return () => { active = false; };
    }

    loadWish(slug).then((data) => {
      if (!data?.recipientName || !data?.message) throw new Error('The wish service returned incomplete data.');
      if (active) setWish(data);
    }).catch((loadError) => {
      const storedWish = getWish(slug);
      if (!active) return;
      if (storedWish) setWish(storedWish);
      else setError(loadError.status === 404 ? 'not-found' : 'unavailable');
    });
    return () => { active = false; };
  }, [slug]);

  const burst = useCallback(() => {
    setConfetti(false);
    setTimeout(() => setConfetti(true), 40);
    setTimeout(() => setConfetti(false), 5000);
  }, []);

  // Play birthday music as soon as letter opening is initiated by user gesture
  const openLetter = () => {
    setOpenEnv(true);
    playBirthdaySong();
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

  const handleBlow = () => {
    if (blown) return;
    setBlown(true);
    burst();
  };

  const handleCut = () => {
    if (cakeCut) return;
    setCakeCut(true);
    burst();
  };

  if (error) {
    return (
      <div className="center missing-page">
        <Seo title="Wish not found — Wishly" description="This birthday surprise is missing." />
        <h1>{error === 'not-found' ? 'We couldn’t find this surprise' : error === 'invalid' ? 'This link looks incomplete' : 'We can’t open this surprise right now'}</h1>
        <p style={{ color: 'var(--text-muted)' }}>
          {error === 'not-found'
            ? 'Ask the sender to check that they copied the whole link.'
            : error === 'invalid'
              ? 'Ask the sender to copy and send the full link again.'
              : 'Check your internet connection and try again.'}
        </p>
        {error === 'unavailable' && <button className="btn btn-secondary" type="button" onClick={() => window.location.reload()}>Try again</button>}
        <Link to="/" className="btn btn-primary">Create a surprise</Link>
      </div>
    );
  }

  if (!wish) {
    return (
      <div className="center loading-page">
        <div className="spinner" />
        <p style={{ color: 'var(--text-muted)' }}>Preparing your celebration…</p>
      </div>
    );
  }

  const theme = THEMES[wish.theme] || THEMES.rose;

  return (
    <div style={{ minHeight: '100vh', background: theme.bg, position: 'relative', overflow: 'hidden' }}>
      <Seo title={`Happy Birthday, ${wish.recipientName}!`} description={wish.message.slice(0, 160)} />
      <Confetti active={confetti} />

      {/* Floating Birthday Music Control Bar */}
      {openEnv && (
        <div className="floating-music-bar" title={isMuted ? 'Unmute music' : 'Mute music'}>
          <div className={`music-wave-bars ${isPlaying && !isMuted ? 'playing' : 'paused'}`}>
            <span className="music-wave-bar" />
            <span className="music-wave-bar" />
            <span className="music-wave-bar" />
            <span className="music-wave-bar" />
          </div>
          <span className="music-label">Birthday Music</span>
          <button
            type="button"
            className="music-toggle-btn"
            onClick={toggleMute}
            aria-label={isMuted ? 'Unmute audio' : 'Mute audio'}
          >
            {isMuted ? <VolumeX size={15} /> : <Volume2 size={15} />}
          </button>
        </div>
      )}

      <div className="center" style={{ minHeight: '100vh', padding: '48px 20px', flexDirection: 'column', textAlign: 'center' }}>
        {/* Stage 1: Wax-sealed Envelope */}
        {stage === 'envelope' && (
          <div className="anim-fade-up">
            <div className="envelope-badge">
              <span>A personal letter for you</span>
            </div>
            <div
              className={`envelope ${openEnv ? 'open' : ''}`}
              onClick={openLetter}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && openLetter()}
              aria-label="Open Birthday Letter"
            >
              <div className="envelope-body" />
              <div className="envelope-flap" />
              <div className="envelope-label">To: {wish.recipientName}</div>
              <div className="wax">
                <Heart size={14} fill="#fff" stroke="#fff" />
              </div>
            </div>
            <p className="envelope-hint" style={{ color: theme.accent }}>
              Tap the seal to open letter
            </p>
          </div>
        )}

        {/* Stage 2: Simple Heartfelt Note */}
        {stage === 'letter' && (
          <div className="anim-bounce-in" style={{ width: '100%', maxWidth: 540 }}>
            <div className="parchment" style={{ textAlign: 'left', padding: '36px 32px' }}>
              <p style={{ fontSize: '1.15rem', lineHeight: 1.7, fontStyle: 'italic', color: '#332014', margin: 0 }}>
                “{wish.message}”
              </p>
              <div className="sign" style={{ marginTop: 24, textAlign: 'right', fontWeight: 700, fontSize: '1.05rem', color: '#7c2d12' }}>
                — With love, {wish.senderName || 'Someone Special'}
              </div>
            </div>
            <button className="btn btn-gold" style={{ marginTop: 28, padding: '12px 26px' }} onClick={unwrap}>
              <Gift size={16} />
              <span>Unwrap your gift</span>
            </button>
          </div>
        )}

        {/* Stage 3: Gift Unwrapping */}
        {stage === 'gift' && (
          <div className={`gift ${openGift ? 'open' : ''}`}>
            <div className="gift-bow">
              <Gift size={28} strokeWidth={2} />
            </div>
            <div className="gift-lid" />
            <div className="gift-box" />
          </div>
        )}

        {/* Stage 4: Reveal Stage (Bouquet + Realistic 3D Cake & Candle Blowing & Cutting Knife) */}
        {stage === 'reveal' && (
          <div className="anim-fade-up" style={{ width: '100%', maxWidth: 680 }}>
            <div className="reveal-badge" style={{ background: theme.card, borderColor: theme.border, color: theme.accent }}>
              <span>Happy Birthday Celebration</span>
            </div>
            <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(2.2rem, 6vw, 3.6rem)', color: '#fff', margin: 0 }}>
              Happy Birthday,
            </h1>
            <h2 style={{ fontFamily: 'var(--font-cursive)', fontSize: 'clamp(2.8rem, 8vw, 4.8rem)', color: theme.accent, marginTop: 4, marginBottom: 16 }}>
              {wish.recipientName}
            </h2>

            {/* Hand-crafted Flower Bouquet */}
            <div style={{ marginBottom: 20 }}>
              <Bouquet bouquet={wish.bouquet} size={250} />
            </div>

            {/* Realistic 3D Birthday Cake with Mic-Blowing Candles and Draggable Knife */}
            <div style={{ margin: '16px 0 24px' }}>
              <RealisticCake
                blown={blown}
                cut={cakeCut}
                onBlow={handleBlow}
                onCut={handleCut}
                recipientName={wish.recipientName}
              />
            </div>

            <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap', marginTop: 12 }}>
              <button
                className="btn btn-primary"
                style={{ background: theme.accent, borderColor: theme.accent }}
                onClick={burst}
              >
                <Sparkles size={16} />
                <span>Celebrate again</span>
              </button>
              <Link to="/create" className="btn btn-secondary">
                Create a surprise for someone
              </Link>
            </div>

            <p style={{ marginTop: 40, opacity: 0.5, fontSize: '.8rem', color: '#fff' }}>
              Created with <Link to="/" style={{ color: theme.accent, fontWeight: 600 }}>Wishly</Link>
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
