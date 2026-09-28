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
} from 'lucide-react';
import { THEMES, MESSAGE_TEMPLATES } from '../constants.js';
import { FLOWERS, WRAPPING, RIBBONS, MAX_FLOWERS } from '../constants.js';
import { createWish } from '../api.js';
import Seo from '../components/Seo.jsx';
import Bouquet, { FlowerMark } from '../components/Bouquet.jsx';
import { saveWish } from '../wishStorage.js';

const STEPS = [
  { id: 1, title: 'Names', icon: User },
  { id: 2, title: 'Note', icon: Heart },
  { id: 3, title: 'Theme', icon: Palette },
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
        // Static hosts can rewrite missing API routes to index.html with a 200 response.
        // Treat a response without a wish slug as unavailable and use the browser fallback.
        if (!data?.slug) throw new Error('Wish API is unavailable.');
      }
      catch { data = saveWish(wish); }

      try {
        const saved = JSON.parse(localStorage.getItem('my_wishes') || '[]');
        const updated = [{ slug: data.slug, recipientName: data.recipientName, createdAt: new Date().toISOString() }, ...saved.filter(w => w.slug !== data.slug)].slice(0, 20);
        localStorage.setItem('my_wishes', JSON.stringify(updated));
      } catch {
        // ignore
      }

      setResult(data);
    } catch (err) {
      setError(err.message || 'Failed to create surprise. Please check your inputs.');
    } finally {
      setLoading(false);
    }
  };

  const surpriseUrl = result
    ? `${window.location.origin}${window.location.pathname}#/w/${result.slug}`
    : '';

  const copyToClipboard = () => {
    if (!surpriseUrl) return;
    navigator.clipboard.writeText(surpriseUrl)
      .then(() => {
        setCopied(true);
        setTimeout(() => setCopied(false), 2200);
      })
      .catch(() => setError('Could not copy the link. Please copy it from the field.'));
  };

  const shareWhatsApp = () => {
    const text = encodeURIComponent(`I made a birthday surprise for you! Open it here: ${surpriseUrl}`);
    window.open(`https://api.whatsapp.com/send?text=${text}`, '_blank');
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
                <span>{copied ? 'Copied' : 'Copy'}</span>
              </button>
            </div>

            {/* Action Buttons */}
            <div className="result-actions">
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
            <div className="stepper-nav">
              {STEPS.map((s) => {
                const IconComponent = s.icon;
                const isActive = step === s.id;
                const isCompleted = step > s.id;
                return (
                  <button
                    key={s.id}
                    type="button"
                    className={`stepper-item ${isActive ? 'active' : ''} ${isCompleted ? 'completed' : ''}`}
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
            </div>

            {error && <div className="alert-box error">{error}</div>}

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
                  <h2 className="step-heading">Write your heartfelt note</h2>
                  <p className="step-subtext">This note will appear inside the wax-sealed letter.</p>
                </div>

                <div className="form-group">
                  <textarea
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
                    <span>Choose Theme</span>
                    <ArrowRight size={15} />
                  </button>
                </div>
              </div>
            )}

            {/* Step 3: Theme Selection & Generate */}
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
                    className="btn btn-primary btn-lg"
                    disabled={loading}
                    onClick={handleGenerate}
                  >
                    {loading ? (
                      <span>Creating surprise...</span>
                    ) : (
                      <>
                        <Sparkles size={16} />
                        <span>Create Surprise Link</span>
                      </>
                    )}
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
