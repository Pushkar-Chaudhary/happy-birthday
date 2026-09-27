import { Link } from 'react-router-dom';
import Seo from '../components/Seo.jsx';

const sections = [
  {
    title: 'Privacy first',
    text:
      'We only collect the minimum information needed to create and manage a birthday surprise page: your name, email, password hash, and the message content you choose to share.',
  },
  {
    title: 'Secure session handling',
    text:
      'Authentication tokens are stored in secure, HttpOnly cookies instead of browser localStorage. This reduces the risk of token theft through scripts or browser extensions.',
  },
  {
    title: 'Your content stays yours',
    text:
      'Wish pages are personal. We do not sell user data, and we do not expose private birthday wishes to public listings beyond the page link you intentionally share.',
  },
  {
    title: 'Production-ready approach',
    text:
      'The app is built with HTTPS-ready configuration, rate limiting, CORS protection, and a simple deployment structure designed for a real public launch.',
  },
];

export default function Trust() {
  return (
    <main className="page" style={{ padding: '56px 24px 90px' }}>
      <Seo
        title="Privacy & Security — Wishly"
        description="Learn how Wishly protects personal data, secure sessions, and birthday surprise content."
      />

      <div className="container" style={{ maxWidth: 900 }}>
        <div className="glass anim-fade-up" style={{ padding: '40px 28px' }}>
          <div style={{ textAlign: 'center', marginBottom: 28 }}>
            <div className="badge badge-success" style={{ marginBottom: 14 }}>Secure by design</div>
            <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(2rem, 5vw, 3rem)', marginBottom: 10 }}>
              Privacy, security, and trust
            </h1>
            <p style={{ color: 'var(--text-muted)', maxWidth: 640, margin: '0 auto' }}>
              A birthday surprise should feel personal, safe, and easy to share. We keep the system lean, respectful, and built around thoughtful user trust.
            </p>
          </div>

          <div style={{ display: 'grid', gap: 18, marginTop: 28 }}>
            {sections.map((item) => (
              <div key={item.title} className="glass" style={{ padding: '20px 22px' }}>
                <h2 style={{ fontSize: '1.08rem', marginBottom: 8 }}>{item.title}</h2>
                <p style={{ color: 'var(--text-muted)', margin: 0, lineHeight: 1.7 }}>{item.text}</p>
              </div>
            ))}
          </div>

          <div style={{ borderTop: '1px solid var(--border)', marginTop: 30, paddingTop: 24 }}>
            <h3 style={{ marginBottom: 12 }}>Terms and conditions</h3>
            <p style={{ color: 'var(--text-muted)', lineHeight: 1.7 }}>
              Users are responsible for the content they post. Wishly is designed for personal, non-abusive, and respectful communication. We reserve the right to remove content that is harmful, abusive, spammy, or violates applicable laws.
            </p>
          </div>

          <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', marginTop: 28 }}>
            <Link to="/" className="btn btn-primary">Back home</Link>
            <Link to="/register" className="btn btn-secondary">Create an account</Link>
          </div>
        </div>
      </div>
    </main>
  );
}
