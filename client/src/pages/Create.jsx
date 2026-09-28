import { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  User,
  Heart,
  Palette,
  Sparkles,
  Copy,
  Check,
  ExternalLink,
  Send,
  ArrowRight,
  ArrowLeft,
  Eye,
  ImageDown,
} from 'lucide-react';
import { THEMES, MESSAGE_TEMPLATES } from '../constants.js';
import { FLOWERS, WRAPPING, RIBBONS, MAX_FLOWERS } from '../constants.js';
import { createWish } from '../api.js';
import Seo from '../components/Seo.jsx';
import Bouquet, { FlowerMark } from '../components/Bouquet.jsx';
import { rememberWish, saveWish } from '../wishStorage.js';
import { shareWishCard } from '../shareCard.js';

const STEPS = [
  { id: 1, title: 'Names', icon: User },
  { id: 2, title: 'Message', icon: Heart },
  { id: 3, title: 'Flowers', icon: Palette },
  { id: 4, title: 'Review', icon: Eye },
];

export default function Create() {
  const [step, setStep] = useState(1);
  const [recipientName, setRecipientName] = useState('');
  const [senderName, setSenderName] = useState(() => localStorage.getItem('wishly_sender_name') || '');
  const [message, setMessage] = useState('');
  const [theme, setTheme] = useState('rose');
  const [bouquet, setBouquet] = useState({ wrapping: 'kraft', ribbon: 'pink', flowers: { rose: 4, tulip: 3, daisy: 2 } });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [result, setResult] = useState(null);
  const [linkStorage, setLinkStorage] = useState('');
  const [copied, setCopied] = useState(false);

  const handleNext = () => {
    setError('');
    if (step === 1) {
      if (!recipientName.trim()) {
        setError("Please enter the recipient's name.");
        return;
      }
      if (!senderName.trim()) {
        setError('Please enter your name.');
        return;
      }
      localStorage.setItem('wishly_sender_name', senderName.trim());
      setStep(2);
    } else if (step === 2) {
      if (!message.trim()) {
        setError('Please enter a birthday message.');
        return;
      }
      setStep(3);
    } else if (step === 3) {
      setStep(4);
    }
  };

  const handleGenerate = async () => {
    setError('');
    setLoading(true);
    try {
      const wish = {
        recipientName: recipientName.trim(),
        senderName: senderName.trim(),
        message: message.trim(),
        theme,
        bouquet,
      };
      let data;
      try {
        data = await createWish(wish);
        // Some static hosts return index.html with status 200 for an unhandled API path.
        if (!data?.slug) throw new Error('The wish API did not return a link.');
        setLinkStorage('database');
      } catch {
        // Keep cross-device links usable if the API or database is not configured.
        data = saveWish(wish);
        setLinkStorage('portable');
      }

      rememberWish(data);

      setResult(data);
    } catch (err) {
      setError(err.message || 'Failed to create surprise. Please check your inputs.');
    } finally {
      setLoading(false);
    }
  };

  const surpriseUrl = result
    ? `${window.location.origin}/w/${result.slug}`
    : '';
  const isLocalPreview = ['localhost', '127.0.0.1', '::1'].includes(window.location.hostname);

  const copyToClipboard = () => {
    if (!surpriseUrl) return;
    navigator.clipboard.writeText(surpriseUrl)
      .then(() => {
        setError('');
        setCopied(true);
        setTimeout(() => setCopied(false), 2200);
      })
      .catch(() => setError('Could not copy the link. Please copy it from the field.'));
  };

  const shareWhatsApp = () => {
    const text = encodeURIComponent(`I made a birthday surprise for you! Open it here: ${surpriseUrl}`);
    window.open(`https://api.whatsapp.com/send?text=${text}`, '_blank');
  };

  const shareImage = async () => {
    try {
      await shareWishCard({ recipientName: result.recipientName, message, theme, url: surpriseUrl });
    } catch (err) {
      if (err.name !== 'AbortError') setError('Could not create the share image. Please try again.');
    }
  };

  return (
    <div className="page create-page">
      <Seo
        title="Create a Surprise — Wishly"
        description="Craft a personalized birthday surprise page in seconds."
      />

      <div className="container create-container">
        {/* If result is ready */}
        {result ? (
          <div className="result-card anim-fade-up">
            <div className="result-badge">
              <Check size={14} />
              <span>Surprise Ready</span>
            </div>

            <h1 className="result-title">
              Surprise created for {result.recipientName}
            </h1>
            <p className="result-subtitle">
              Send this link. Your note, custom bouquet, music, candles, and cake will be waiting.
            </p>
            {linkStorage === 'portable' && (
              <div className="alert-box info" role="status">
                This link works across devices. The database service did not respond, so the wish is carried in the link itself.
              </div>
            )}
            {isLocalPreview && (
              <div className="alert-box info" role="status">
                This is a preview link from this computer. Deploy the app to a public website before sharing it with others.
              </div>
            )}
            {error && <div className="alert-box error" role="alert">{error}</div>}

            {/* Link Box */}
            <div className="link-box">
              <input
                type="text"
                readOnly
                value={surpriseUrl}
                className="link-input"
                aria-label="Surprise Link"
              />
              <button
                type="button"
                className="btn btn-secondary btn-copy"
                onClick={copyToClipboard}
              >
                {copied ? <Check size={15} /> : <Copy size={15} />}
                <span aria-live="polite">{copied ? 'Copied' : 'Copy'}</span>
              </button>
            </div>

            {/* Action Buttons */}
            <div className="result-actions">
              <button
                type="button"
                className="btn btn-secondary"
                onClick={shareImage}
              >
                <ImageDown size={15} />
                <span>Share image</span>
              </button>
              <button
                type="button"
                className="btn btn-whatsapp"
                onClick={shareWhatsApp}
              >
                <Send size={15} />
                <span>Share on WhatsApp</span>
              </button>
              <Link
                to={`/w/${result.slug}`}
                target="_blank"
                rel="noreferrer"
                className="btn btn-primary"
              >
                <span>Open Preview</span>
                <ExternalLink size={15} />
              </Link>
            </div>

            <div className="result-footer">
              <button
                type="button"
                className="btn btn-ghost btn-sm"
                onClick={() => {
                  setResult(null);
                  setStep(1);
                  setRecipientName('');
                  setMessage('');
                }}
              >
                Create another surprise
              </button>
            </div>
          </div>
        ) : (
          <div className="create-card anim-fade-up">
            {/* Step Indicator Header */}
            <nav className="stepper-nav" aria-label="Surprise creation steps">
              {STEPS.map((s) => {
                const IconComponent = s.icon;
                const isActive = step === s.id;
                const isCompleted = step > s.id;
                return (
                  <button
                    key={s.id}
                    type="button"
                    className={`stepper-item ${isActive ? 'active' : ''} ${isCompleted ? 'completed' : ''}`}
                    aria-current={isActive ? 'step' : undefined}
                    onClick={() => {
                      if (s.id < step) setStep(s.id);
                    }}
                    disabled={s.id > step}
                  >
                    <div className="stepper-icon-wrap">
                      {isCompleted ? <Check size={14} /> : <IconComponent size={14} />}
                    </div>
                    <span className="stepper-label">{s.title}</span>
                  </button>
                );
              })}
            </nav>

            {error && <div className="alert-box error" role="alert">{error}</div>}

            {/* Step 1: Names */}
            {step === 1 && (
              <div className="step-content">
                <div className="step-header">
                  <h2 className="step-heading">Who is this surprise for?</h2>
                  <p className="step-subtext">Add the recipient’s name and how you want your name to appear.</p>
                </div>

                <div className="form-group">
                  <label htmlFor="recipient-input" className="form-label">
                    Birthday Person's Name
                  </label>
                  <input
                    id="recipient-input"
                    type="text"
                    maxLength={60}
                    autoFocus
                    placeholder="e.g. Maya, Jordan, Priya..."
                    value={recipientName}
                    onChange={(e) => setRecipientName(e.target.value)}
                    className="form-input text-lg"
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="sender-input" className="form-label">
                    Your Name (Sender)
                  </label>
                  <input
                    id="sender-input"
                    type="text"
                    maxLength={60}
                    placeholder="e.g. Alex"
                    value={senderName}
                    onChange={(e) => setSenderName(e.target.value)}
                    className="form-input"
                  />
                </div>

                <div className="step-footer">
                  <div />
                  <button
                    type="button"
                    className="btn btn-primary"
                    onClick={handleNext}
                  >
                    <span>Continue</span>
                    <ArrowRight size={15} />
                  </button>
                </div>
              </div>
            )}

            {/* Step 2: Note / Message */}
            {step === 2 && (
              <div className="step-content">
                <div className="step-header">
                  <h2 className="step-heading">Write a birthday message</h2>
                  <p className="step-subtext">This note will appear inside the wax-sealed letter.</p>
                </div>

                <div className="form-group">
                  <label htmlFor="message-input" className="form-label">Your birthday message</label>
                  <textarea
                    id="message-input"
                    rows={5}
                    maxLength={1000}
                    placeholder="Write something warm and meaningful from the heart..."
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    className="form-input form-textarea"
                  />
                  <div className="char-count">
                    {message.length} / 1000
                  </div>
                </div>

                {/* Clean quick inspiration chips */}
                <div className="templates-section">
                  <span className="templates-label">Quick inspiration:</span>
                  <div className="templates-chips">
                    {MESSAGE_TEMPLATES.map((tmpl, idx) => (
                      <button
                        key={idx}
                        type="button"
                        className="template-chip"
                        onClick={() => setMessage(tmpl)}
                      >
                        {tmpl.slice(0, 48)}...
                      </button>
                    ))}
                  </div>
                </div>

                <div className="step-footer">
                  <button
                    type="button"
                    className="btn btn-ghost"
                    onClick={() => setStep(1)}
                  >
                    <ArrowLeft size={15} />
                    <span>Back</span>
                  </button>
                  <button
                    type="button"
                    className="btn btn-primary"
                    onClick={handleNext}
                  >
                    <span>Choose flowers</span>
                    <ArrowRight size={15} />
                  </button>
                </div>
              </div>
            )}

            {/* Step 3: Theme Selection */}
            {step === 3 && (
              <div className="step-content">
                <div className="step-header">
                  <h2 className="step-heading">Build a flower bouquet</h2>
                  <p className="step-subtext">Choose up to {MAX_FLOWERS} flowers, plus wrapping and ribbon.</p>
                </div>

                <div className="bouquet-builder">
                  <div className="bouquet-builder-preview"><Bouquet bouquet={bouquet} size={190} /><span>{Object.values(bouquet.flowers).reduce((a, b) => a + b, 0)} / {MAX_FLOWERS} flowers</span></div>
                  <div className="bouquet-controls">
                    <h3>Pick your flowers</h3>
                    {Object.entries(FLOWERS).map(([key, flower]) => {
                      const count = bouquet.flowers[key] || 0;
                      const total = Object.values(bouquet.flowers).reduce((a, b) => a + b, 0);
                      return <div className="flower-choice" key={key}><FlowerMark type={key} /><span>{flower.name}</span><button type="button" aria-label={`Remove ${flower.name}`} disabled={!count} onClick={() => setBouquet(b => ({ ...b, flowers: { ...b.flowers, [key]: Math.max(0, (b.flowers[key] || 0) - 1) } }))}>−</button><strong>{count}</strong><button type="button" aria-label={`Add ${flower.name}`} disabled={total >= MAX_FLOWERS} onClick={() => setBouquet(b => ({ ...b, flowers: { ...b.flowers, [key]: (b.flowers[key] || 0) + 1 } }))}>+</button></div>;
                    })}
                    <label className="form-label">Wrapping<select className="form-input" value={bouquet.wrapping} onChange={e => setBouquet(b => ({ ...b, wrapping: e.target.value }))}>{Object.entries(WRAPPING).map(([key, value]) => <option key={key} value={key}>{value.name}</option>)}</select></label>
                    <label className="form-label">Ribbon<select className="form-input" value={bouquet.ribbon} onChange={e => setBouquet(b => ({ ...b, ribbon: e.target.value }))}>{Object.entries(RIBBONS).map(([key, value]) => <option key={key} value={key}>{value.name}</option>)}</select></label>
                  </div>
                </div>

                <div className="themes-grid">
                  {Object.entries(THEMES).map(([key, t]) => {
                    const isSelected = theme === key;
                    return (
                      <button
                        key={key}
                        type="button"
                        className={`theme-card ${isSelected ? 'selected' : ''}`}
                        onClick={() => setTheme(key)}
                      >
                        <div
                          className="theme-card-preview"
                          style={{ background: t.bg }}
                        >
                          <div
                            className="theme-card-dot"
                            style={{ background: t.accent }}
                          />
                        </div>
                        <div className="theme-card-info">
                          <span className="theme-card-name">{t.name}</span>
                          {isSelected && <Check size={14} className="theme-check-icon" />}
                        </div>
                      </button>
                    );
                  })}
                </div>

                <div className="step-footer">
                  <button
                    type="button"
                    className="btn btn-ghost"
                    onClick={() => setStep(2)}
                  >
                    <ArrowLeft size={15} />
                    <span>Back</span>
                  </button>
                  <button
                    type="button"
                    className="btn btn-primary"
                    onClick={handleNext}
                  >
                    <span>Review surprise</span>
                    <ArrowRight size={15} />
                  </button>
                </div>
              </div>
            )}

            {step === 4 && (
              <div className="step-content">
                <div className="step-header">
                  <h2 className="step-heading">Review your surprise</h2>
                  <p className="step-subtext">Check the details before creating the shareable link.</p>
                </div>

                <article className="wish-review" aria-label="Birthday surprise preview">
                  <div className="wish-review-heading">
                    <div>
                      <span className="wish-review-kicker">A birthday surprise for</span>
                      <h3>{recipientName.trim()}</h3>
                    </div>
                    <span className="wish-review-theme" style={{ color: THEMES[theme].accent }}>{THEMES[theme].name}</span>
                  </div>
                  <blockquote>{message.trim()}</blockquote>
                  <p className="wish-review-signature">With love, {senderName.trim()}</p>
                  <div className="wish-review-bouquet">
                    <Bouquet bouquet={bouquet} size={156} />
                    <span>Your custom bouquet</span>
                  </div>
                </article>

                <div className="step-footer">
                  <button type="button" className="btn btn-ghost" onClick={() => setStep(3)}>
                    <ArrowLeft size={15} />
                    <span>Edit details</span>
                  </button>
                  <button type="button" className="btn btn-primary btn-lg" disabled={loading} onClick={handleGenerate}>
                    {loading ? <span>Creating surprise...</span> : <><Sparkles size={16} /><span>Create Surprise Link</span></>}
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
