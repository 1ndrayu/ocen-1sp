import React, { useState, useEffect } from 'react';
import { motion, useScroll, useSpring } from 'framer-motion';
import { Shield, Zap, Globe, Lock, Building2, FileCheck, ArrowRight, Wallet, CheckCircle, Activity, CreditCard, Loader2 } from 'lucide-react';
import Apply from './pages/Apply';
import Dashboard from './pages/Dashboard';

const App = () => {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  const scrollTo = (id) => {
    const el = document.getElementById(id);
    el?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="App">
      <div className="bg-aura" />
      
      {/* Progress Bar */}
      <motion.div style={{ scaleX, position: 'fixed', top: 0, left: 0, right: 0, height: 6, background: 'var(--g-blue)', transformOrigin: '0%', zIndex: 3000 }} />

      {/* Floating Nav */}
      <nav className="g-nav">
        <div className="flex items-center gap-md" onClick={() => scrollTo('hero')} style={{ cursor: 'pointer' }}>
          <div style={{ background: 'var(--g-blue)', color: 'white', padding: 8, borderRadius: 12 }}><Shield size={20} /></div>
          <span style={{ fontWeight: 800, fontSize: '1.2rem', letterSpacing: '-1px' }}>OCEN</span>
        </div>
        <div className="flex gap-lg items-center">
          <button onClick={() => scrollTo('hero')} className="nav-link" style={{ background: 'none', border: 'none', cursor: 'pointer', fontWeight: 600 }}>Home</button>
          <button onClick={() => scrollTo('apply')} className="nav-link" style={{ background: 'none', border: 'none', cursor: 'pointer', fontWeight: 600 }}>Apply</button>
          <button onClick={() => scrollTo('dashboard')} className="nav-link" style={{ background: 'none', border: 'none', cursor: 'pointer', fontWeight: 600 }}>Dashboard</button>
          <button onClick={() => scrollTo('apply')} className="g-btn g-btn-primary" style={{ padding: '0.6rem 1.5rem', fontSize: '0.9rem' }}>Get Started</button>
        </div>
      </nav>

      {/* Section 1: Hero */}
      <section id="hero" className="section">
        <div className="g-container flex flex-col items-center text-center">
          <motion.div initial={{ opacity: 0, scale: 0.8 }} whileInView={{ opacity: 1, scale: 1 }} className="float" style={{ background: 'var(--g-blue-surface)', color: 'var(--g-blue)', padding: '0.6rem 1.8rem', borderRadius: 100, fontSize: '0.9rem', fontWeight: 800, marginBottom: '2.5rem', border: '1px solid rgba(26,115,232,0.2)' }}>
            THE FUTURE OF MSME LENDING
          </motion.div>
          <motion.h1 initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} style={{ fontSize: '5rem', fontWeight: 800, lineHeight: 1, marginBottom: '2rem', letterSpacing: '-4px' }}>
            Credit at the <br/><span className="text-gradient-blue">Speed of Light.</span>
          </motion.h1>
          <motion.p initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="text-secondary" style={{ fontSize: '1.4rem', maxWidth: 700, marginBottom: '4rem', fontWeight: 500 }}>
            No paperwork. No delays. Just pure digital lending infrastructure for the next billion users.
          </motion.p>
          <div className="flex gap-lg">
            <button onClick={() => scrollTo('apply')} className="g-btn g-btn-primary" style={{ padding: '1.5rem 3rem', fontSize: '1.2rem' }}>Get Started <Zap fill="currentColor" /></button>
            <button onClick={() => scrollTo('dashboard')} className="g-btn g-btn-outline" style={{ padding: '1.5rem 3rem', fontSize: '1.2rem' }}>Check Status</button>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '3rem', marginTop: '10rem', width: '100%' }}>
            <motion.div whileHover={{ y: -10 }} className="g-card g-card-blue text-left" style={{ padding: '2rem' }}>
              <div style={{ color: 'var(--g-blue)', marginBottom: '1rem' }}><Lock size={32} /></div>
              <h3 style={{ fontSize: '1.2rem', marginBottom: '0.5rem' }}>Bank-Level Security</h3>
              <p className="text-secondary" style={{ fontSize: '0.9rem' }}>End-to-end encrypted data exchange via the AA network.</p>
            </motion.div>
            <motion.div whileHover={{ y: -10 }} className="g-card g-card-green text-left" style={{ padding: '2rem' }}>
              <div style={{ color: 'var(--g-green)', marginBottom: '1rem' }}><Globe size={32} /></div>
              <h3 style={{ fontSize: '1.2rem', marginBottom: '0.5rem' }}>Hyper-Scalable</h3>
              <p className="text-secondary" style={{ fontSize: '0.9rem' }}>Built on open protocols to reach every corner of the economy.</p>
            </motion.div>
            <motion.div whileHover={{ y: -10 }} className="g-card g-card-yellow text-left" style={{ padding: '2rem' }}>
              <div style={{ color: 'var(--g-yellow)', marginBottom: '1rem' }}><Zap size={32} /></div>
              <h3 style={{ fontSize: '1.2rem', marginBottom: '0.5rem' }}>Instant Approval</h3>
              <p className="text-secondary" style={{ fontSize: '0.9rem' }}>Real-time credit assessment using alternative data sources.</p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Section 2: Apply */}
      <section id="apply" className="section" style={{ background: 'rgba(255,255,255,0.4)' }}>
        <div className="g-container">
          <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
            <h2 style={{ fontSize: '3.5rem', fontWeight: 800, letterSpacing: '-2px' }}>Start Your <span className="text-gradient-blue">Journey</span></h2>
            <p className="text-secondary">Complete your application in under 2 minutes.</p>
          </div>
          <Apply />
        </div>
      </section>

      {/* Section 3: Dashboard */}
      <section id="dashboard" className="section">
        <div className="g-container">
          <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
            <h2 style={{ fontSize: '3.5rem', fontWeight: 800, letterSpacing: '-2px' }}>Your <span className="text-gradient-green">Insights</span></h2>
            <p className="text-secondary">Real-time tracking of your credit and applications.</p>
          </div>
          <Dashboard />
        </div>
      </section>

      {/* Footer */}
      <footer style={{ padding: '4rem', textAlign: 'center', borderTop: '1px solid var(--g-border)' }}>
        <p className="text-secondary" style={{ fontSize: '0.9rem' }}>© 2026 OCEN Unified Portal. Built with Google-inspired design principles.</p>
      </footer>
    </div>
  );
}

export default App;
