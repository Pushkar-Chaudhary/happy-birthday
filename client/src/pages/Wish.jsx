import { useEffect, useState, useCallback, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import { THEMES } from '../constants.js';
import Confetti from '../components/Confetti.jsx';
import Bouquet from '../components/Bouquet.jsx';
import Seo from '../components/Seo.jsx';
import { Sparkle, Gift } from '../components/Icons.jsx';
import api from '../api.js';
import { useBirthdaySong } from '../hooks/useBirthdaySong.js';

function BirthdayCake({ blown, cut, onCut, micStatus }) {
  const frostingTone = blown ? '#f1e2b8' : '#f9d9e7';

  return (
    <div className="cake-stage">
      <div className={`cake-scene ${blown ? 'blown' : ''} ${cut ? 'cut' : ''}`} aria-live="polite">
        <svg viewBox="0 0 220 180" role="img" aria-label="Birthday cake">
          <ellipse cx="110" cy="150" rx="82" ry="14" fill="rgba(255,255,255,0.16)" />
          <path d="M52 146h116c10 0 16 9 16 17v7c0 5-4 9-9 9H45c-5 0-9-4-9-9v-7c0-8 6-17 16-17Z" fill="#e0e7ff" opacity="0.18" />
          <g>
            <path d="M58 96h104c9 0 16 7 16 16v18c0 14-11 26-26 26H68c-14 0-26-12-26-26v-18c0-9 7-16 16-16Z" fill="#fde68a" />
            <path d="M42 110h136v14H42z" fill={frostingTone} />
            <path d="M58 76h104v18H58z" fill="#ff9bb5" />
            <path d="M52 84c8-10 18-15 28-15 10 0 18 5 28 15 8-10 18-15 28-15s20 5 28 15 21 15 29 15v10H52V84Z" fill="#fff3c4" opacity="0.9" />
            <path d="M68 42h12v34H68z" fill="#f8fafc" />
            <path d="M91 42h12v34H91z" fill="#f8fafc" />
            <path d="M114 42h12v34h-12z" fill="#f8fafc" />
            <path d="M137 42h12v34h-12z" fill="#f8fafc" />
            {[64, 96, 128, 160].map((x) => (
              <g key={x}>
                <rect x={x - 4} y="25" width="8" height="23" rx="4" fill="#f8fafc" />
                <ellipse className="flame" cx={x} cy="17" rx="7" ry="13" fill="#fbbf24" />
              </g>
            ))}
            <g className="cake-cut">
              <path d="M108 110c9 5 20 8 32 8 16 0 29-6 38-18-3 18-20 33-41 33-12 0-24-6-29-23Z" fill="#f9d7b6" opacity="0.95" />
              <path d="M112 111c8 4 17 7 27 7 11 0 21-4 29-9" stroke="#fff7ed" strokeWidth="3" strokeLinecap="round" />
            </g>
          </g>
          <path d="M40 155h140" stroke="#facc15" strokeWidth="6" strokeLinecap="round" opacity="0.65" />
        </svg>
      </div>

      {blown && !cut && (
        <button type="button" className="knife-button" onClick={onCut} aria-label="Cut the cake">
          <span aria-hidden="true">🔪</span> Cut the cake
        </button>
      )}

      <div className="mic-status">
        {cut
          ? 'The cake is ready. Happy Birthday!'
          : blown
            ? 'The candles are out. Cut the cake and celebrate.'
            : micStatus === 'granted'
              ? 'Blow into the microphone to extinguish the candles.'
              : micStatus === 'denied'
                ? 'Microphone was blocked. Please allow mic access so the candles can be blown out.'
                : micStatus === 'unsupported'
                  ? 'This browser cannot use the microphone in this tab.'
                  : 'Checking microphone access...'}
      </div>
    </div>
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
  const [cakeCut, setCakeCut] = useState(false);
  const [micStatus, setMicStatus] = useState('waiting');
  const streamRef = useRef(null);
  const audioContextRef = useRef(null);
  const animationFrameRef = useRef(null);
  const lastBlowRef = useRef(0);
  const { playBirthdaySong } = useBirthdaySong();

  useEffect(() => {
    api.get(`/wishes/${slug}`)
      .then((res) => setWish(res.data))
      .catch(() => setError(true));
  }, [slug]);

  useEffect(() => {
    playBirthdaySong();
  }, [playBirthdaySong]);

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

  useEffect(() => {
    if (stage !== 'reveal' || blown) return undefined;

    let cancelled = false;

    const setupMic = async () => {
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        setMicStatus('unsupported');
        return;
      }

      try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        if (cancelled) {
          stream.getTracks().forEach((track) => track.stop());
          return;
        }

        streamRef.current = stream;

        const AudioCtor = window.AudioContext || window.webkitAudioContext;
        if (!AudioCtor) {
          setMicStatus('unsupported');
          return;
        }

        const audioContext = new AudioCtor();
        audioContextRef.current = audioContext;

        const analyser = audioContext.createAnalyser();
        analyser.fftSize = 2048;
        const source = audioContext.createMediaStreamSource(stream);
        source.connect(analyser);

        const buffer = new Uint8Array(analyser.fftSize);

        const checkLevel = () => {
          if (cancelled) return;

          analyser.getByteTimeDomainData(buffer);

          let total = 0;
          for (const value of buffer) {
            const normalized = (value - 128) / 128;
            total += normalized * normalized;
          }

          const rms = Math.sqrt(total / buffer.length);

          if (rms > 0.22 && Date.now() - lastBlowRef.current > 250) {
            lastBlowRef.current = Date.now();
            setMicStatus('blown');
            setBlown(true);
            burst();
            return;
          }

          if (rms > 0.08) {
            setMicStatus('granted');
          }

          animationFrameRef.current = requestAnimationFrame(checkLevel);
        };

        setMicStatus('granted');
        checkLevel();
      } catch {
        setMicStatus('denied');
      }
    };

    setupMic();

    return () => {
      cancelled = true;
      if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current);
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop());
        streamRef.current = null;
      }
      if (audioContextRef.current) {
        audioContextRef.current.close().catch(() => {});
        audioContextRef.current = null;
      }
    };
  }, [stage, blown, burst]);

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
              <BirthdayCake blown={blown} cut={cakeCut} onCut={() => setCakeCut(true)} micStatus={micStatus} />
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