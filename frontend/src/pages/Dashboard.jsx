import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { CheckCircle, Loader2, ArrowUpRight, Wallet, Activity, CreditCard } from 'lucide-react';
import { getUserApplications } from '../services/dbService';

const Dashboard = () => {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({ total: 0, approved: 0, pending: 0 });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getUserApplications(null);
        setApplications(data);
        const total = data.reduce((acc, app) => acc + (parseFloat(app.loan_amount) || 0), 0);
        const approved = data.filter(app => app.lender_status === 'approved').reduce((acc, app) => acc + (parseFloat(app.loan_amount) || 0), 0);
        const pending = data.filter(app => app.lender_status === 'pending').reduce((acc, app) => acc + (parseFloat(app.loan_amount) || 0), 0);
        setStats({ total, approved, pending });
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  return (
    <div className="g-container">
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="mb-xl">
        <h1 style={{ fontSize: '2.5rem', fontWeight: 600, marginBottom: '0.5rem' }}>Overview</h1>
        <p className="text-secondary">Track your financial applications and credit health.</p>
      </motion.div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '2rem', marginBottom: '3rem' }}>
        <div className="g-card" style={{ background: 'linear-gradient(135deg, #1a73e8, #1557b0)', color: 'white' }}>
          <div className="flex justify-between items-center mb-md"><Wallet size={24} /><ArrowUpRight size={20} style={{ opacity: 0.7 }} /></div>
          <span style={{ opacity: 0.9, fontSize: '0.9rem' }}>Total Credit Requested</span>
          <h2 style={{ fontSize: '2.2rem', marginTop: '0.5rem' }}>₹{stats.total.toLocaleString()}</h2>
        </div>
        <div className="g-card">
          <div className="flex justify-between items-center mb-md"><div style={{ color: 'var(--g-green)', background: 'rgba(52, 168, 83, 0.1)', padding: 8, borderRadius: 12 }}><CheckCircle size={24} /></div></div>
          <span className="text-secondary" style={{ fontSize: '0.9rem' }}>Approved Limit</span>
          <h2 className="text-g-green" style={{ fontSize: '2.2rem', marginTop: '0.5rem' }}>₹{stats.approved.toLocaleString()}</h2>
        </div>
        <div className="g-card">
          <div className="flex justify-between items-center mb-md"><div style={{ color: 'var(--g-blue)', background: 'rgba(26, 115, 232, 0.1)', padding: 8, borderRadius: 12 }}><Activity size={24} /></div></div>
          <span className="text-secondary" style={{ fontSize: '0.9rem' }}>In Process</span>
          <h2 className="text-g-blue" style={{ fontSize: '2.2rem', marginTop: '0.5rem' }}>₹{stats.pending.toLocaleString()}</h2>
        </div>
      </div>

      <div className="g-card" style={{ padding: 0, overflow: 'hidden' }}>
        <div style={{ padding: '1.5rem 2.5rem', borderBottom: '1px solid var(--g-border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h3 style={{ fontWeight: 600 }}>Active Applications</h3>
        </div>
        {loading ? (
          <div className="flex items-center justify-center p-xl"><Loader2 className="animate-spin text-g-blue" size={40} /></div>
        ) : applications.length === 0 ? (
          <div className="p-xl text-center text-secondary">No applications found.</div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ textAlign: 'left', borderBottom: '1px solid var(--g-border)' }}>
                  <th style={{ padding: '1.25rem 2.5rem', color: 'var(--g-text-secondary)', fontWeight: 500, fontSize: '0.85rem' }}>LENDER / APP ID</th>
                  <th style={{ padding: '1.25rem', color: 'var(--g-text-secondary)', fontWeight: 500, fontSize: '0.85rem' }}>AMOUNT</th>
                  <th style={{ padding: '1.25rem 2.5rem', color: 'var(--g-text-secondary)', fontWeight: 500, fontSize: '0.85rem' }}>STATUS</th>
                </tr>
              </thead>
              <tbody>
                {applications.map((app, index) => (
                  <tr key={app.id} style={{ borderBottom: index === applications.length - 1 ? 'none' : '1px solid var(--g-border)' }}>
                    <td style={{ padding: '1.5rem 2.5rem' }}>
                      <div className="flex items-center gap-md">
                        <div style={{ background: 'var(--g-blue-light)', color: 'var(--g-blue)', padding: 10, borderRadius: 12 }}><CreditCard size={18} /></div>
                        <div><div style={{ fontWeight: 600, fontSize: '0.95rem' }}>Google Capital</div><div style={{ fontSize: '0.75rem', color: 'var(--g-text-secondary)', fontFamily: 'monospace' }}>{app.application_id}</div></div>
                      </div>
                    </td>
                    <td style={{ padding: '1.5rem 1.25rem', fontWeight: 600 }}>₹{parseFloat(app.loan_amount).toLocaleString()}</td>
                    <td style={{ padding: '1.5rem 2.5rem' }}>
                      <span style={{ padding: '6px 12px', borderRadius: '100px', fontSize: '0.8rem', fontWeight: 600, background: app.lender_status === 'approved' ? 'rgba(52, 168, 83, 0.1)' : 'rgba(26, 115, 232, 0.1)', color: app.lender_status === 'approved' ? 'var(--g-green)' : 'var(--g-blue)' }}>{app.lender_status}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
