import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { FileText, Clock, CheckCircle, XCircle, Loader2 } from 'lucide-react';
import { getUserApplications } from '../services/dbService';

const Dashboard = () => {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({ total: 0, approved: 0, pending: 0 });

  useEffect(() => {
    const fetchData = async () => {
      try {
        // For demo purposes, we fetch all apps (in a real app, we'd filter by logged-in user)
        // Since we don't have Auth yet, let's just fetch all or use a dummy PAN if needed
        const data = await getUserApplications(null); // Passing null to fetch all for now
        setApplications(data);
        
        const total = data.reduce((acc, app) => acc + (parseFloat(app.loan_amount) || 0), 0);
        const approved = data
          .filter(app => app.lender_status === 'approved')
          .reduce((acc, app) => acc + (parseFloat(app.loan_amount) || 0), 0);
        const pending = data
          .filter(app => app.lender_status === 'pending')
          .reduce((acc, app) => acc + (parseFloat(app.loan_amount) || 0), 0);
        
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
      <div className="g-section">
        <h2 className="mb-md">Your Dashboard</h2>
        <p className="text-secondary mb-xl">Monitor your active loan applications and approval status.</p>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 'var(--g-spacing-lg)', marginBottom: 'var(--g-spacing-2xl)' }}>
          <div className="g-card-flat">
            <span className="text-secondary" style={{ fontSize: '0.8rem' }}>Total Applied</span>
            <h3 style={{ fontSize: '2rem' }}>₹{stats.total.toLocaleString()}</h3>
          </div>
          <div className="g-card-flat">
            <span className="text-secondary" style={{ fontSize: '0.8rem' }}>Approved</span>
            <h3 className="text-g-green" style={{ fontSize: '2rem' }}>₹{stats.approved.toLocaleString()}</h3>
          </div>
          <div className="g-card-flat">
            <span className="text-secondary" style={{ fontSize: '0.8rem' }}>Pending</span>
            <h3 className="text-g-blue" style={{ fontSize: '2rem' }}>₹{stats.pending.toLocaleString()}</h3>
          </div>
        </div>

        <h3 className="mb-md">Recent Applications</h3>
        <div className="g-card" style={{ padding: 0, overflow: 'hidden' }}>
          {loading ? (
            <div className="flex items-center justify-center p-xl">
              <Loader2 className="animate-spin text-g-blue" size={40} />
            </div>
          ) : applications.length === 0 ? (
            <div className="p-xl text-center text-secondary">No applications found.</div>
          ) : (
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead style={{ background: 'var(--g-bg-secondary)', borderBottom: '1px solid var(--g-border-light)' }}>
                <tr>
                  <th style={{ textAlign: 'left', padding: '1rem', color: 'var(--g-text-secondary)', fontWeight: 500 }}>Application ID</th>
                  <th style={{ textAlign: 'left', padding: '1rem', color: 'var(--g-text-secondary)', fontWeight: 500 }}>Amount</th>
                  <th style={{ textAlign: 'left', padding: '1rem', color: 'var(--g-text-secondary)', fontWeight: 500 }}>Business</th>
                  <th style={{ textAlign: 'left', padding: '1rem', color: 'var(--g-text-secondary)', fontWeight: 500 }}>Status</th>
                </tr>
              </thead>
              <tbody>
                {applications.map((app, index) => (
                  <tr key={app.id} style={{ borderBottom: index === applications.length - 1 ? 'none' : '1px solid var(--g-border-light)' }}>
                    <td style={{ padding: '1.25rem', fontWeight: 500 }}>{app.application_id}</td>
                    <td style={{ padding: '1.25rem' }}>₹{parseFloat(app.loan_amount).toLocaleString()}</td>
                    <td style={{ padding: '1.25rem', color: 'var(--g-text-secondary)' }}>{app.business_name}</td>
                    <td style={{ padding: '1.25rem' }}>
                      <div className="flex items-center gap-sm">
                        {app.lender_status === 'approved' && <CheckCircle size={16} className="text-g-green" />}
                        {app.lender_status === 'pending' && <Clock size={16} className="text-g-blue" />}
                        {app.lender_status === 'rejected' && <XCircle size={16} className="text-g-red" />}
                        <span className={`text-g-${app.lender_status === 'approved' ? 'green' : app.lender_status === 'pending' ? 'blue' : 'red'}`} style={{ fontWeight: 500, textTransform: 'capitalize' }}>
                          {app.lender_status}
                        </span>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
