import React from 'react';
import { Routes, Route, Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Shield, Zap, Globe, Lock } from 'lucide-react';
import Apply from './pages/Apply';
import Dashboard from './pages/Dashboard';

const Navbar = () => {
  const location = useLocation();
  return (
    <nav className="g-nav">
      <div className="flex items-center gap-sm">
        <div style={{ background: 'var(--g-blue)', color: 'white', padding: 8, borderRadius: 12 }}>
          <Shield size={20} />
        </div>
        <span style={{ fontWeight: 600, fontSize: '1.2rem', letterSpacing: '-0.5px' }}>OCEN Portal</span>
      </div>
      <div className="flex gap-md">
        <Link to="/" className={`nav-link ${location.pathname === '/' ? 'active' : ''}`}>Home</Link>
        <Link to="/apply" className={`nav-link ${location.pathname === '/apply' ? 'active' : ''}`}>Apply</Link>
        <Link to="/status" className={`nav-link ${location.pathname === '/status' ? 'active' : ''}`}>Dashboard</Link>
      </div>
      <Link to="/apply" className="g-btn g-btn-primary" style={{ padding: '0.6rem 1.5rem' }}>
        Get Started
      </Link>
    </nav>
  );
};

const Home = () => (
  <div className="g-container">
    <div className="flex flex-col items-center text-center" style={{ padding: '8rem 0' }}>
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        style={{ background: 'var(--g-blue-light)', color: 'var(--g-blue)', padding: '0.5rem 1.5rem', borderRadius: 100, fontSize: '0.9rem', fontWeight: 600, marginBottom: '2rem' }}
      >
        Next-Generation Lending Infrastructure
      </motion.div>
      <motion.h1 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        style={{ fontSize: '4.5rem', fontWeight: 700, lineHeight: 1.1, marginBottom: '1.5rem', letterSpacing: '-2px' }}
      >
        Lending at the speed of <span className="text-g-blue">Internet.</span>
      </motion.h1>
      <motion.p 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="text-secondary" 
        style={{ fontSize: '1.25rem', maxWidth: 600, marginBottom: '3rem' }}
      >
        Empowering MSMEs with frictionless credit via the Open Credit Enablement Network. 
        Secure, instant, and fully digital.
      </motion.p>
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="flex gap-lg"
      >
        <Link to="/apply" className="g-btn g-btn-primary" style={{ padding: '1.2rem 2.5rem', fontSize: '1.1rem' }}>
          Start Application <Zap size={20} />
        </Link>
        <Link to="/status" className="g-btn g-btn-outline" style={{ padding: '1.2rem 2.5rem', fontSize: '1.1rem' }}>
          Track Status
        </Link>
      </motion.div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '3rem', marginTop: '8rem', width: '100%' }}>
        {[
          { icon: <Lock />, title: 'Zero Friction', desc: 'Consent-based data sharing via AA network.' },
          { icon: <Globe />, title: 'Hyper Local', desc: 'Built for the Indian credit ecosystem.' },
          { icon: <Shield />, title: 'Bank Grade', desc: 'Secure encryption and verifiable credentials.' }
        ].map((item, i) => (
          <motion.div 
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 + (i * 0.1) }}
            className="text-left"
          >
            <div className="text-g-blue mb-md">{item.icon}</div>
            <h3 className="mb-sm">{item.title}</h3>
            <p className="text-secondary" style={{ fontSize: '0.95rem' }}>{item.desc}</p>
          </motion.div>
        ))}
      </div>
    </div>
  </div>
);

function App() {
  return (
    <div className="App">
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/apply" element={<Apply />} />
        <Route path="/status" element={<Dashboard />} />
      </Routes>
    </div>
  );
}

export default App;
