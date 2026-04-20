import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, Loader2, AlertCircle, Building2, User, Landmark, Info, ArrowRight, ShieldCheck, FileCheck } from 'lucide-react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { saveLoanApplication } from '../services/dbService';

const LSP_API = 'http://localhost:8000/api/lsp';

const Apply = () => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    business_name: '',
    pan: '',
    loan_amount: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleConsent = async () => {
    setLoading(true);
    setError(null);
    try {
      const consentRes = await axios.post(`${LSP_API}/initiate-consent`, {
        user_id: formData.pan || 'user_123',
        data_types: ['bank_statement']
      });

      const applicationRes = await axios.post(`${LSP_API}/submit-application`, {
        ...formData,
        loan_amount: parseFloat(formData.loan_amount),
        consent_id: consentRes.data.consent_id
      });

      await saveLoanApplication({
        ...formData,
        application_id: applicationRes.data.application_id,
        lender_status: applicationRes.data.status,
        user_id: formData.pan || 'user_123'
      });

      setSuccess(true);
    } catch (err) {
      console.error(err);
      setError('Connection failed. Ensure the backend is running via run_ocen_all.bat');
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="g-container flex items-center justify-center" style={{ minHeight: '70vh' }}>
        <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="g-card text-center" style={{ maxWidth: 500 }}>
          <div style={{ background: 'rgba(52, 168, 83, 0.1)', color: 'var(--g-green)', width: 80, height: 80, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem' }}>
            <ShieldCheck size={48} />
          </div>
          <h2 className="mb-md">Success!</h2>
          <p className="text-secondary mb-xl">Your application is broadcasted to the OCEN network.</p>
          <Link to="/status" className="g-btn g-btn-primary w-full">View Dashboard</Link>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="g-container">
      <div style={{ maxWidth: 600, margin: '0 auto' }}>
        <AnimatePresence mode="wait">
          {step === 1 ? (
            <motion.div key="step1" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="g-card">
              <div className="flex items-center gap-md mb-xl">
                <div style={{ background: 'var(--g-blue-light)', color: 'var(--g-blue)', padding: 12, borderRadius: 16 }}><Building2 size={24} /></div>
                <div><h2 style={{ fontWeight: 600 }}>Business Details</h2><p className="text-secondary" style={{ fontSize: '0.85rem' }}>Step 1 of 2</p></div>
              </div>
              <div className="flex flex-col gap-lg">
                <div>
                  <label className="mb-sm block text-secondary" style={{ fontSize: '0.9rem', fontWeight: 500 }}>Entity Name</label>
                  <input name="business_name" className="g-input" placeholder="e.g. Acme Corp" onChange={handleInputChange} value={formData.business_name} />
                </div>
                <div>
                  <label className="mb-sm block text-secondary" style={{ fontSize: '0.9rem', fontWeight: 500 }}>Tax ID / PAN</label>
                  <input name="pan" className="g-input" placeholder="ABCDE1234F" onChange={handleInputChange} value={formData.pan} />
                </div>
                <div>
                  <label className="mb-sm block text-secondary" style={{ fontSize: '0.9rem', fontWeight: 500 }}>Required Amount (₹)</label>
                  <input name="loan_amount" type="number" className="g-input" placeholder="5,00,000" onChange={handleInputChange} value={formData.loan_amount} />
                </div>
                <button className="g-btn g-btn-primary mt-md" onClick={() => setStep(2)} disabled={!formData.business_name || !formData.pan || !formData.loan_amount}>
                  Continue <ArrowRight size={18} />
                </button>
              </div>
            </motion.div>
          ) : (
            <motion.div key="step2" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="g-card">
              <div className="flex items-center gap-md mb-xl">
                <div style={{ background: 'var(--g-green)', color: 'white', padding: 12, borderRadius: 16 }}><FileCheck size={24} /></div>
                <div><h2 style={{ fontWeight: 600 }}>Data Consent</h2><p className="text-secondary" style={{ fontSize: '0.85rem' }}>Final Step</p></div>
              </div>
              <div style={{ background: 'var(--g-blue-light)', padding: '1.5rem', borderRadius: '16px', marginBottom: '1.5rem' }}>
                <p style={{ fontSize: '0.9rem', lineHeight: 1.6 }} className="mb-md">Authorizing access via <strong>Account Aggregator (AA)</strong>:</p>
                <ul style={{ paddingLeft: '1.5rem', fontSize: '0.85rem' }} className="text-secondary flex flex-col gap-sm">
                  <li>Last 6 months of bank transactions</li>
                  <li>Account balance summary</li>
                  <li>KYC Verification details</li>
                </ul>
              </div>
              {error && <div style={{ background: 'rgba(234, 67, 53, 0.1)', padding: '1rem', borderRadius: '12px', marginBottom: '1.5rem', color: 'var(--g-red)', fontSize: '0.85rem' }} className="flex gap-sm items-center"><AlertCircle size={18} />{error}</div>}
              <div className="flex gap-md">
                <button className="g-btn g-btn-outline w-full" onClick={() => setStep(1)} disabled={loading}>Back</button>
                <button className="g-btn g-btn-primary w-full" onClick={handleConsent} disabled={loading}>{loading ? <Loader2 className="animate-spin" size={20} /> : 'Approve & Apply'}</button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default Apply;
