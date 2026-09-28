import { lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar.jsx';
import Home from './pages/Home.jsx';
import MyWishes from './pages/MyWishes.jsx';

const Wish = lazy(() => import('./pages/Wish.jsx'));
const Create = lazy(() => import('./pages/Create.jsx'));

function MainLayout() {
  return (
    <>
      <Navbar />
      <Suspense fallback={<div className="center loading-page"><div className="spinner" /><p>Loading…</p></div>}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/create" element={<Create />} />
          <Route path="/my-wishes" element={<MyWishes />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Suspense>
    </>
  );
}

export default function App() {
  if (window.location.hash.startsWith('#/')) {
    const legacyPath = window.location.hash.slice(1);
    const basePath = window.location.pathname.replace(/\/$/, '');
    window.history.replaceState(null, '', `${basePath}${legacyPath}${window.location.search}`);
  }

  return (
    <BrowserRouter>
      <Routes>
        {/* Full-screen immersive wish reveal */}
        <Route path="/w/:slug" element={<Suspense fallback={<div className="center loading-page"><div className="spinner" /><p>Preparing your celebration…</p></div>}><Wish /></Suspense>} />
        {/* Main application pages */}
        <Route path="/*" element={<MainLayout />} />
      </Routes>
    </BrowserRouter>
  );
}
