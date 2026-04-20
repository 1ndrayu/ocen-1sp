import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldCheck } from 'lucide-react';

const Navbar = () => {
  return (
    <nav style={{
      borderBottom: '1px solid var(--g-border-light)',
      padding: 'var(--g-spacing-md) 0',
      background: 'rgba(255, 255, 255, 0.8)',
      backdropFilter: 'blur(10px)',
      position: 'sticky',
      top: 0,
      zIndex: 100
    }}>
      <div className="g-container flex justify-between items-center" style={{ padding: '0 var(--g-spacing-xl)' }}>
        <Link to="/" className="flex items-center gap-md" style={{ textDecoration: 'none' }}>
          <div className="bg-g-blue flex items-center justify-center" style={{ width: 40, height: 40, borderRadius: 'var(--g-radius-md)' }}>
            <ShieldCheck color="white" size={24} />
          </div>
          <h3 style={{ margin: 0 }}>OCEN<span className="text-g-blue">Portal</span></h3>
        </Link>
        
        <div className="flex gap-lg items-center">
          <Link to="/" className="text-secondary" style={{ textDecoration: 'none', fontWeight: 500 }}>Home</Link>
          <Link to="/apply" className="text-secondary" style={{ textDecoration: 'none', fontWeight: 500 }}>Apply</Link>
          <Link to="/status" className="text-secondary" style={{ textDecoration: 'none', fontWeight: 500 }}>Dashboard</Link>
          <Link to="/apply" className="g-btn g-btn-primary" style={{ padding: '0.5rem 1.25rem' }}>Get Started</Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
