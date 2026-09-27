import { Link } from 'react-router-dom';
import { Sparkles, Cake, Gift, ArrowRight, ShieldCheck, Zap, Music, Flame, Heart } from 'lucide-react';
import Seo from '../components/Seo.jsx';

const HIGHLIGHTS = [
  {
    icon: Music,
    title: 'Music on opening',
    desc: 'Birthday music begins as soon as the recipient taps the wax-sealed letter.',
  },
  {
    icon: Flame,
    title: 'Realistic candle blowing',
    desc: 'Blow directly into your microphone to extinguish the candles with smoke effects.',
  },
  {
    icon: Cake,
    title: 'Interactive cake knife',
    desc: 'Grab and move the knife across the cake to cut a realistic slice.',
  },
  {
    icon: ShieldCheck,
    title: 'Frictionless & secure',
    desc: 'No registration, no passwords. Input is strictly sanitized and private.',
  },
];

const STEPS = [
  { num: '01', title: 'Enter Names', desc: 'Add who the surprise is for and who it is from.' },
  { num: '02', title: 'Write Your Note', desc: 'Write a warm, personal birthday message.' },
  { num: '03', title: 'Pick a Theme', desc: 'Choose a tailored color palette and bouquet.' },
  { num: '04', title: 'Share & Celebrate', desc: 'Send the unique link and celebrate together.' },
];

export default function Home() {
  return (
    <main className="page home-page">
      <Seo
        title="Wishly — Minimal Birthday Surprise Pages"
        description="Create an elegant, private birthday surprise page: wax-sealed letter, music, realistic cake and candles. No sign up required."
      />

      {/* Hero Section */}
      <section className="hero-section">
        <div className="container hero-container">
          <div className="hero-badge">
            <Sparkles size={13} className="hero-badge-icon" />
            <span>Frictionless birthday surprises</span>
          </div>

          <h1 className="hero-heading">
            A heartfelt letter, birthday song,<br />
            <span className="hero-heading-gradient">and candles to blow.</span>
          </h1>

          <p className="hero-subheading">
            Craft a memorable birthday moment for someone special. They open a sealed letter, hear birthday music, blow out realistic candles with their mic, and slice the cake.
          </p>

          <div className="hero-actions">
            <Link to="/create" className="btn btn-primary btn-lg">
              <Sparkles size={16} />
              <span>Create a Surprise</span>
              <ArrowRight size={16} />
            </Link>
          </div>

          {/* Minimal Quick Step Flow */}
          <div className="steps-grid">
            {STEPS.map((s) => (
              <div key={s.num} className="step-card">
                <span className="step-num">{s.num}</span>
                <h3 className="step-title">{s.title}</h3>
                <p className="step-desc">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Feature Highlights */}
      <section className="features-section">
        <div className="container">
          <div className="section-header">
            <h2 className="section-title">Designed for real delight</h2>
            <p className="section-subtitle">Every interaction is built to feel thoughtful and responsive.</p>
          </div>

          <div className="features-grid">
            {HIGHLIGHTS.map((item) => (
              <div key={item.title} className="feature-card">
                <div className="feature-icon-wrap">
                  <item.icon size={20} strokeWidth={2} />
                </div>
                <h3 className="feature-title">{item.title}</h3>
                <p className="feature-desc">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Bottom Minimal CTA */}
      <section className="cta-section">
        <div className="container">
          <div className="cta-card">
            <h2 className="cta-title">Ready to celebrate someone?</h2>
            <p className="cta-desc">Takes under 60 seconds to create and share. Completely free.</p>
            <Link to="/create" className="btn btn-primary btn-md">
              <Cake size={16} />
              <span>Start Now</span>
            </Link>
          </div>
        </div>
      </section>

      <footer className="footer">
        <div className="container footer-inner">
          <span className="footer-brand">Wishly</span>
          <span className="footer-copy">Crafted for memorable celebrations</span>
        </div>
      </footer>
    </main>
  );
}
