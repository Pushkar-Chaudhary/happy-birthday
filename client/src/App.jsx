import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar.jsx';
import Home from './pages/Home.jsx';
import Create from './pages/Create.jsx';
import Wish from './pages/Wish.jsx';

function MainLayout() {
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/create" element={<Create />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </>
  );
}

export default function App() {
  return (
    <HashRouter>
      <Routes>
        {/* Full-screen immersive wish reveal */}
        <Route path="/w/:slug" element={<Wish />} />
        {/* Main application pages */}
        <Route path="/*" element={<MainLayout />} />
      </Routes>
    </HashRouter>
  );
}
