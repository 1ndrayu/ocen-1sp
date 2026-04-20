import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Zap, Shield, BarChart3 } from 'lucide-react';
import { Link } from 'react-router-dom';

const Home = () => {
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] } }
  };

  return (
    <div className="g-container">
      <header className="g-section" style={{ textAlign: 'center', paddingBottom: 'var(--g-spacing-2xl)' }}>
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
        >
          <span className="bg-g-blue text-white" style={{ 
            padding: '4px 12px', 
            borderRadius: 'var(--g-radius-full)', 
            fontSize: '0.8rem', 
            fontWeight: 600,
            textTransform: 'uppercase',
            letterSpacing: '1px'
          }}>
            Powered by OCEN 1.0
          </span>
        </motion.div>
        
        <motion.h1 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.8 }}
          style={{ fontSize: '3.5rem', marginTop: 'var(--g-spacing-md)', marginBottom: 'var(--g-spacing-md)' }}
        >
          Instant Credit for <br />
          <span className="text-g-blue">Modern Businesses</span>
        </motion.h1>
        
        <motion.p 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.8 }}
          className="text-secondary" 
          style={{ maxWidth: 600, margin: '0 auto var(--g-spacing-xl)', fontSize: '1.2rem' }}
        >
          Seamless, paperless, and secure loan applications powered by the Open Credit Enablement Network.
        </motion.p>
        
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="flex gap-lg items-center" 
          style={{ justifyContent: 'center' }}
        >
          <Link to="/apply" className="g-btn g-btn-primary" style={{ gap: '10px' }}>
            Apply Now <ArrowRight size={18} />
          </Link>
          <Link to="/status" className="g-btn g-btn-outline">
            Track Application
          </Link>
        </motion.div>
      </header>

      <motion.section 
        variants={container}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true }}
        className="g-section" 
        style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 'var(--g-spacing-xl)' }}
      >
        <motion.div variants={item} className="g-card">
          <div className="text-g-blue mb-md"><Zap size={32} /></div>
          <h3>Lightning Fast</h3>
          <p className="text-secondary">Get loan approvals in minutes, not days. Our real-time evaluation engine processes applications instantly.</p>
        </motion.div>
        
        <motion.div variants={item} className="g-card">
          <div className="text-g-blue mb-md"><Shield size={32} /></div>
          <h3>Secure Data</h3>
          <p className="text-secondary">Your financial data is protected by industry-standard encryption and shared only with your explicit consent via AA.</p>
        </motion.div>
        
        <motion.div variants={item} className="g-card">
          <div className="text-g-blue mb-md"><BarChart3 size={32} /></div>
          <h3>Fair Pricing</h3>
          <p className="text-secondary">Benefit from competitive interest rates based on your actual business performance data.</p>
        </motion.div>
      </motion.section>

      <footer className="g-section" style={{ borderTop: '1px solid var(--g-border-light)', textAlign: 'center' }}>
        <p className="text-secondary" style={{ fontSize: '0.9rem' }}>
          © 2026 OCEN-1SP Portal. All rights reserved. Built with Google Aesthetic Design System.
        </p>
      </footer>
    </div>
  );
};

export default Home;
