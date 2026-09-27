import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext.jsx';
import Navbar from './components/Navbar.jsx';
import ProtectedRoute from './components/ProtectedRoute.jsx';
import Home from './pages/Home.jsx';
import Login from './pages/Login.jsx';
import Register from './pages/Register.jsx';
import Create from './pages/Create.jsx';
import Dashboard from './pages/Dashboard.jsx';
import Wish from './pages/Wish.jsx';
import Trust from './pages/Trust.jsx';

function MainLayout() {
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/create" element={<ProtectedRoute><Create /></ProtectedRoute>} />
        <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
        <Route path="/privacy" element={<Trust />} />
        <Route path="/terms" element={<Trust />} />
        <Route path="*" element={
          <div className="center" style={{ textAlign: 'center', padding: '100px 24px', flexDirection: 'column', gap: 12 }}>
            <h1>Page not found</h1>
            <Link to="/" className="btn btn-primary">Home</Link>
          </div>
        } />
      </Routes>
    </>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Full-screen wish reveal — no navbar */}
          <Route path="/w/:slug" element={<Wish />} />
          {/* Everything else gets the navbar */}
          <Route path="/*" element={<MainLayout />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
