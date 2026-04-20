import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { CheckCircle, Loader2, ArrowUpRight, Wallet, Activity, CreditCard, TrendingUp } from 'lucide-react';
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
      } catch (err) { console.error(err); }
      finally { setLoading(false); }
    };
    fetchData();
  }, []);

  return (
    <div className="g-container">
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2.5rem', marginBottom: '4rem' }}>
        <motion.div whileHover={{ y: -8 }} className="g-card g-card-blue" style={{ padding: '2rem' }}>
          <div className="flex justify-between items-center mb-xl">
            <div style={{ background: 'var(--g-blue-surface)', color: 'var(--g-blue)', padding: 12, borderRadius: 16 }}><TrendingUp size={24} /></div>
            <div className="text-g-blue" style={{ fontWeight: 800, fontSize: '0.8rem' }}>+12% vs LY</div>
          </div>
          <span className="text-secondary" style={{ fontWeight: 600, fontSize: '0.9rem' }}>TOTAL CREDIT LIMIT</span>
          <h2 style={{ fontSize: '2.8rem', fontWeight: 800, marginTop: '0.5rem', letterSpacing: '-1px' }}>₹{stats.total.toLocaleString()}</h2>
        </motion.div>
        
        <motion.div whileHover={{ y: -8 }} className="g-card g-card-green" style={{ padding: '2rem' }}>
          <div className="flex justify-between items-center mb-xl">
            <div style={{ background: 'var(--g-green-surface)', color: 'var(--g-green)', padding: 12, borderRadius: 16 }}><CheckCircle size={24} /></div>
            <div className="text-g-green" style={{ fontWeight: 800, fontSize: '0.8rem' }}>ACTIVE</div>
          </div>
          <span className="text-secondary" style={{ fontWeight: 600, fontSize: '0.9rem' }}>APPROVED AMOUNT</span>
          <h2 className="text-g-green" style={{ fontSize: '2.8rem', fontWeight: 800, marginTop: '0.5rem', letterSpacing: '-1px' }}>₹{stats.approved.toLocaleString()}</h2>
        </motion.div>

        <motion.div whileHover={{ y: -8 }} className="g-card g-card-yellow" style={{ padding: '2rem' }}>
          <div className="flex justify-between items-center mb-xl">
            <div style={{ background: 'var(--g-yellow-surface)', color: 'var(--g-yellow)', padding: 12, borderRadius: 16 }}><Activity size={24} /></div>
            <div className="text-g-yellow" style={{ fontWeight: 800, fontSize: '0.8rem' }}>PROCESSING</div>
          </div>
          <span className="text-secondary" style={{ fontWeight: 600, fontSize: '0.9rem' }}>PENDING REVIEW</span>
          <h2 className="text-g-yellow" style={{ fontSize: '2.8rem', fontWeight: 800, marginTop: '0.5rem', letterSpacing: '-1px' }}>₹{stats.pending.toLocaleString()}</h2>
        </motion.div>
      </div>

      <div className="g-card" style={{ padding: 0, overflow: 'hidden', borderTop: 'none' }}>
        <div style={{ padding: '2rem 3rem', borderBottom: '1px solid var(--g-border)', background: 'rgba(255,255,255,0.3)' }}>
          <h3 style={{ fontWeight: 800, fontSize: '1.2rem' }}>Application History</h3>
        </div>
        {loading ? (
          <div className="flex items-center justify-center p-xl"><Loader2 className="animate-spin text-g-blue" size={40} /></div>
        ) : applications.length === 0 ? (
          <div className="p-xl text-center text-secondary">No data available yet. Start an application above!</div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ textAlign: 'left', background: 'rgba(0,0,0,0.02)' }}>
                  <th style={{ padding: '1.5rem 3rem', color: 'var(--g-text-secondary)', fontWeight: 700, fontSize: '0.8rem', letterSpacing: '1px' }}>LENDER DETAILS</th>
                  <th style={{ padding: '1.5rem', color: 'var(--g-text-secondary)', fontWeight: 700, fontSize: '0.8rem', letterSpacing: '1px' }}>LOAN AMOUNT</th>
                  <th style={{ padding: '1.5rem 3rem', color: 'var(--g-text-secondary)', fontWeight: 700, fontSize: '0.8rem', letterSpacing: '1px' }}>CURRENT STATUS</th>
                </tr>
              </thead>
              <tbody>
                {applications.map((app, index) => (
                  <tr key={app.id} style={{ borderBottom: index === applications.length - 1 ? 'none' : '1px solid var(--g-border)' }}>
                    <td style={{ padding: '2rem 3rem' }}>
                      <div className="flex items-center gap-md">
                        <div style={{ background: 'var(--g-blue-surface)', color: 'var(--g-blue)', padding: 12, borderRadius: 12 }}><CreditCard size={20} /></div>
                        <div><div style={{ fontWeight: 800, fontSize: '1rem' }}>Google Capital</div><div style={{ fontSize: '0.75rem', color: 'var(--g-text-secondary)', fontFamily: 'monospace', fontWeight: 600 }}>{app.application_id}</div></div>
                      </div>
                    </td>
                    <td style={{ padding: '2rem 1.5rem', fontWeight: 800, fontSize: '1.1rem' }}>₹{parseFloat(app.loan_amount).toLocaleString()}</td>
                    <td style={{ padding: '2rem 3rem' }}>
                      <span style={{ 
                        padding: '8px 16px', 
                        borderRadius: '100px', 
                        fontSize: '0.75rem', 
                        fontWeight: 800, 
                        textTransform: 'uppercase',
                        background: app.lender_status === 'approved' ? 'var(--g-green-surface)' : 'var(--g-blue-surface)', 
                        color: app.lender_status === 'approved' ? 'var(--g-green)' : 'var(--g-blue)',
                        border: `1px solid ${app.lender_status === 'approved' ? 'rgba(52,168,83,0.2)' : 'rgba(26,115,232,0.2)'}`
                      }}>{app.lender_status}</span>
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
