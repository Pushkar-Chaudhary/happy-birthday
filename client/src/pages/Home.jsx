import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import Seo from '../components/Seo.jsx';
import { useBirthdaySong } from '../hooks/useBirthdaySong.js';
import {
  Cake,
  Sparkle,
  Gift,
  Flower,
  LinkIcon,
  Eye,
  ShieldCheck,
  Rocket,
  Users,
  Star,
} from '../components/Icons.jsx';

const FEATURES = [
  { Icon: Flower, title: 'Hand-wrapped bouquets', desc: 'Realistic flower stacks, wrapped paper tones, and ribbons that feel handcrafted.' },
  { Icon: Gift, title: 'Sealed surprise', desc: 'A wax-sealed letter opens into a short heartfelt note before the gift reveal.' },
  { Icon: Cake, title: 'Blow the candles', desc: 'Each birthday page ends with a cake moment to tap, blow out, and celebrate again.' },
  { Icon: Sparkle, title: 'Five immersive themes', desc: 'Rose, Galaxy, Ocean, Forest, and Gold create a polished full-screen mood.' },
  { Icon: LinkIcon, title: 'Private share link', desc: 'Send one unique link by WhatsApp, Messenger, SMS, or anywhere you want.' },
  { Icon: Eye, title: 'View tracking', desc: 'See when they opened it without polluting SEO with fake pageviews.' },
];

const STATS = [
  { value: '100%', label: 'private and personal' },
  { value: '5', label: 'mood themes' },
  { value: '1', label: 'special link' },
];

const STEPS = [
  { n: '01', title: 'Create your account', desc: 'Set up a secure profile in just a minute.' },
  { n: '02', title: 'Design the surprise', desc: 'Add the recipient, message, bouquet, and style.' },
  { n: '03', title: 'Send the link', desc: 'Share it anywhere and let the reveal do the rest.' },
  { n: '04', title: 'Celebrate together', desc: 'Envelope, note, bouquet, and cake all in one experience.' },
];

const TRUST_POINTS = [
  { Icon: ShieldCheck, title: 'Safe & private', text: 'Only your audience gets the link, and the reveal stays focused on the moment.' },
  { Icon: Rocket, title: 'Fast to send', text: 'No app download, no clutter, and no slow setup. Just one link.' },
  { Icon: Users, title: 'Built for moments', text: 'Perfect for birthdays, appreciation posts, surprise drops, and heartfelt wishes.' },
];

export default function Home() {
  const { playBirthdaySong } = useBirthdaySong();

  useEffect(() => {
    playBirthdaySong();
  }, [playBirthdaySong]);

  return (
    <main className="page">
      <Seo title="Wishly — Birthday surprise pages" description="Create a private birthday page: wax-sealed letter, wrapped bouquet, and candles to blow. Share one link." />

      <section style={{ minHeight: 'calc(100vh - 68px)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center', padding: '72px 24px 56px' }}>
        <div className="badge badge-rose" style={{ marginBottom: 24 }}><Sparkle size={14} /> Birthday surprises, actually designed</div>

        <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(2.5rem, 6vw, 5rem)', lineHeight: 1.1, marginBottom: 20, maxWidth: 920 }}>
          A letter, a bouquet,<br />
          <em style={{ background: 'linear-gradient(135deg, #ff6b9d, #a78bfa, #fbbf24)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>and candles to blow</em>
        </h1>

        <p style={{ color: 'var(--text-soft)', maxWidth: 620, marginBottom: 34, fontSize: '1.06rem' }}>
          Build a premium birthday surprise page for the people you love. They open a sealed note, uncover a bouquet, and finish with a candle moment that feels personal and memorable.
        </p>

        <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', justifyContent: 'center', marginBottom: 32 }}>
          <Link to="/register" className="btn btn-primary"><Cake size={18} /> Create a wish</Link>
          <Link to="/login" className="btn btn-secondary">Log in</Link>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 14, width: '100%', maxWidth: 760 }}>
          {STATS.map((stat) => (
            <div key={stat.label} className="glass" style={{ padding: '18px 16px' }}>
              <div style={{ fontSize: '1.6rem', fontWeight: 800, color: 'var(--primary)', marginBottom: 6 }}>{stat.value}</div>
              <div style={{ color: 'var(--text-soft)', fontSize: '.8rem', letterSpacing: '.06em', textTransform: 'uppercase' }}>{stat.label}</div>
            </div>
          ))}
        </div>
      </section>

      <section style={{ padding: '42px 24px 80px' }}>
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: 32 }}>
            <div className="badge badge-violet" style={{ marginBottom: 14 }}><Star size={13} /> Made to feel premium</div>
            <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(1.8rem, 4vw, 2.7rem)' }}>A birthday reveal, designed to feel real</h2>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: 18 }}>
            {FEATURES.map((f) => (
              <div key={f.title} className="glass lift-card" style={{ padding: 24, minHeight: 200 }}>
                <div style={{ color: 'var(--primary)', marginBottom: 12 }}><f.Icon size={26} /></div>
                <h3 style={{ fontSize: '1.08rem', marginBottom: 8 }}>{f.title}</h3>
                <p style={{ color: 'var(--text-muted)', fontSize: '.93rem', margin: 0 }}>{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section style={{ padding: '0 24px 80px', borderTop: '1px solid var(--border)' }}>
        <div className="container" style={{ textAlign: 'center' }}>
          <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(1.8rem, 4vw, 2.6rem)', marginBottom: 40, marginTop: 62 }}>How the surprise flows</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(190px, 1fr))', gap: 22 }}>
            {STEPS.map((s) => (
              <div key={s.n} className="glass" style={{ padding: '28px 20px' }}>
                <div style={{ fontFamily: 'var(--font-display)', color: 'var(--primary)', fontSize: '1.5rem', marginBottom: 12 }}>{s.n}</div>
                <h3 style={{ fontSize: '1rem', marginBottom: 8 }}>{s.title}</h3>
                <p style={{ color: 'var(--text-muted)', fontSize: '.88rem', margin: 0 }}>{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section style={{ padding: '0 24px 80px' }}>
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: 30 }}>
            <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(1.8rem, 4vw, 2.6rem)' }}>Why people choose Wishly</h2>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 18 }}>
            {TRUST_POINTS.map((item) => (
              <div key={item.title} className="glass" style={{ padding: '24px 22px' }}>
                <div style={{ color: 'var(--primary)', marginBottom: 12 }}><item.Icon size={24} /></div>
                <h3 style={{ fontSize: '1.05rem', marginBottom: 8 }}>{item.title}</h3>
                <p style={{ color: 'var(--text-muted)', fontSize: '.9rem', margin: 0 }}>{item.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section style={{ padding: '0 24px 80px', textAlign: 'center' }}>
        <div className="glass" style={{ maxWidth: 620, margin: '0 auto', padding: '42px 28px' }}>
          <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '2rem', marginBottom: 12 }}>Someone’s birthday is soon</h2>
          <p style={{ color: 'var(--text-muted)', marginBottom: 24 }}>Create one meaningful surprise without overcomplicating the process.</p>
          <Link to="/register" className="btn btn-primary">Start free</Link>
        </div>
      </section>

      <footer style={{ padding: '26px 24px 34px', textAlign: 'center', borderTop: '1px solid var(--border)', color: 'var(--text-muted)', fontSize: '.85rem' }}>
        <p>© {new Date().getFullYear()} Wishly</p>
        <p style={{ marginTop: 8, display: 'flex', justifyContent: 'center', gap: 16, flexWrap: 'wrap' }}>
          <Link to="/privacy">Privacy</Link>
          <Link to="/terms">Terms</Link>
        </p>
      </footer>
    </main>
  );
}
