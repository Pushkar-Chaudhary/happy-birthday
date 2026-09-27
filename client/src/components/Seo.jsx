import { useEffect } from 'react';

export default function Seo({ title, description }) {
  useEffect(() => {
    if (title) document.title = title;
    const el = document.querySelector('meta[name="description"]');
    if (el && description) el.setAttribute('content', description);
  }, [title, description]);
  return null;
}
