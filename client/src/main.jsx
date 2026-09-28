import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import './styles/globals.css';

class StartupErrorBoundary extends React.Component {
  state = { error: null };

  static getDerivedStateFromError(error) {
    return { error };
  }

  componentDidCatch(error, info) {
    console.error('Wishly render failed:', error, info.componentStack);
  }

  render() {
    if (this.state.error) {
      return (
        <main style={{ minHeight: '100vh', padding: 32, background: '#080b14', color: '#f8fafc', fontFamily: 'sans-serif' }}>
          <h1>Wishly could not start</h1>
          <p>The app hit a startup error. Please share this message with support:</p>
          <pre style={{ whiteSpace: 'pre-wrap', color: '#ff9cae' }}>
            {String(this.state.error.message || this.state.error)}
          </pre>
        </main>
      );
    }
    return this.props.children;
  }
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <StartupErrorBoundary>
      <App />
    </StartupErrorBoundary>
  </React.StrictMode>
);
