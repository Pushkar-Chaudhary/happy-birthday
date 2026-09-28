import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowUpRight, Copy, Heart, Sparkles, Trash2 } from 'lucide-react';
import Seo from '../components/Seo.jsx';
import { getMyWishes, removeMyWish } from '../wishStorage.js';

function wishUrl(slug) {
  return `${window.location.origin}/w/${slug}`;
}

function formatDate(value) {
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? 'Saved on this device' : `Created ${new Intl.DateTimeFormat(undefined, { dateStyle: 'medium' }).format(date)}`;
}

export default function MyWishes() {
  const [wishes, setWishes] = useState(getMyWishes);
  const [copiedSlug, setCopiedSlug] = useState('');

  const copyLink = async (slug) => {
    try {
      await navigator.clipboard.writeText(wishUrl(slug));
      setCopiedSlug(slug);
      setTimeout(() => setCopiedSlug(''), 1800);
    } catch {
      setCopiedSlug('');
    }
  };

  const removeWish = (slug) => {
    removeMyWish(slug);
    setWishes((saved) => saved.filter((wish) => wish.slug !== slug));
  };

  return (
    <main className="page my-wishes-page">
      <Seo title="My Wishes — Wishly" description="Find and share birthday surprises you created on this device." />
      <div className="container my-wishes-container">
        <header className="my-wishes-header">
          <span className="hero-badge"><Heart size={14} /> Your creations</span>
          <h1>My wishes</h1>
          <p>Birthday surprises saved in this browser.</p>
        </header>

        {wishes.length ? (
          <ul className="my-wishes-list">
            {wishes.map((wish) => (
              <li className="my-wish-card" key={wish.slug}>
                <div className="my-wish-details">
                  <h2>For {wish.recipientName}</h2>
                  <p>{formatDate(wish.createdAt)}</p>
                </div>
                <div className="my-wish-actions">
                  <Link className="btn btn-primary btn-sm" to={`/w/${wish.slug}`} target="_blank" rel="noreferrer">
                    Open <ArrowUpRight size={14} />
                  </Link>
                  <button className="btn btn-secondary btn-sm" type="button" onClick={() => copyLink(wish.slug)}>
                    <Copy size={14} /> {copiedSlug === wish.slug ? 'Copied' : 'Copy link'}
                  </button>
                  <button className="btn btn-ghost btn-sm my-wish-remove" type="button" onClick={() => removeWish(wish.slug)} aria-label={`Remove wish for ${wish.recipientName} from this device`}>
                    <Trash2 size={15} />
                  </button>
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <section className="my-wishes-empty">
            <Sparkles size={24} aria-hidden="true" />
            <h2>No wishes saved yet</h2>
            <p>Surprises you create here will appear in this list.</p>
            <Link to="/create" className="btn btn-primary"><Sparkles size={15} /> Create a surprise</Link>
          </section>
        )}
      </div>
    </main>
  );
}
