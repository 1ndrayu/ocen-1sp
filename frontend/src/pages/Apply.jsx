import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, Loader2, AlertCircle, Building2, User, Landmark, Info } from 'lucide-react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { saveLoanApplication } from '../services/dbService';

const LSP_API = 'http://localhost:8000/api/lsp';

const Apply = () => {
  const [step, setStep] = useState(1); // 1: Info, 2: Consent, 3: Success
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [formData, setFormData] = useState({
    borrower_name: '',
    business_name: '',
    loan_amount: '',
    loan_purpose: '',
    pan: '',
    gstin: ''
  });
  const [result, setResult] = useState(null);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleApply = async (e) => {
    e.preventDefault();
    setStep(2); // Move to consent step
  };

  const handleConsent = async () => {
    setLoading(true);
    setError(null);
    try {
      // 1. Request Consent via LSP
      const consentRes = await axios.post(`${LSP_API}/initiate-consent`, {
        user_id: formData.pan || 'user_123',
        data_types: ['bank_statement']
      });
      
      // 2. Submit Loan Application
      const applicationRes = await axios.post(`${LSP_API}/submit-application`, {
        ...formData,
        loan_amount: parseFloat(formData.loan_amount),
        consent_id: consentRes.data.consent_id
      });

      // 3. Persist to Firebase
      await saveLoanApplication({
        ...formData,
        application_id: applicationRes.data.application_id,
        lender_status: applicationRes.data.status.lender_status,
        user_id: formData.pan // Using PAN as a simple user identifier
      });

      setResult(applicationRes.data);
      setStep(3);
    } catch (err) {
      setError('Failed to process application. Ensure backend services are running.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="g-container" style={{ maxWidth: 800 }}>
      <div className="g-section">
        <AnimatePresence mode="wait">
          {step === 1 && (
            <motion.div
              key="step1"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
            >
              <h2 className="mb-md">Loan Application</h2>
              <p className="text-secondary mb-md">Fill in your business details to get started with your credit application.</p>
              
              <form className="g-card flex flex-col gap-lg" onSubmit={handleApply}>
                <div className="flex flex-col gap-md">
                  <label style={{ fontWeight: 500, fontSize: '0.9rem' }}>Full Name</label>
                  <div style={{ position: 'relative' }}>
                    <User size={18} style={{ position: 'absolute', left: 12, top: 18, color: 'var(--g-text-disabled)' }} />
                    <input 
                      type="text" name="borrower_name" required className="g-input" 
                      placeholder="e.g. John Doe" style={{ paddingLeft: 40 }}
                      value={formData.borrower_name} onChange={handleChange}
                    />
                  </div>
                </div>

                <div className="flex flex-col gap-md">
                  <label style={{ fontWeight: 500, fontSize: '0.9rem' }}>Business Name</label>
                  <div style={{ position: 'relative' }}>
                    <Building2 size={18} style={{ position: 'absolute', left: 12, top: 18, color: 'var(--g-text-disabled)' }} />
                    <input 
                      type="text" name="business_name" required className="g-input" 
                      placeholder="e.g. Acme Corp" style={{ paddingLeft: 40 }}
                      value={formData.business_name} onChange={handleChange}
                    />
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--g-spacing-lg)' }}>
                  <div className="flex flex-col gap-md">
                    <label style={{ fontWeight: 500, fontSize: '0.9rem' }}>Loan Amount (₹)</label>
                    <input 
                      type="number" name="loan_amount" required className="g-input" 
                      placeholder="e.g. 50000" value={formData.loan_amount} onChange={handleChange}
                    />
                  </div>
                  <div className="flex flex-col gap-md">
                    <label style={{ fontWeight: 500, fontSize: '0.9rem' }}>PAN Number</label>
                    <input 
                      type="text" name="pan" required className="g-input" 
                      placeholder="ABCDE1234F" value={formData.pan} onChange={handleChange}
                    />
                  </div>
                </div>

                <div className="flex flex-col gap-md">
                  <label style={{ fontWeight: 500, fontSize: '0.9rem' }}>Purpose of Loan</label>
                  <textarea 
                    name="loan_purpose" required className="g-input" rows="3"
                    placeholder="Describe why you need the loan..."
                    value={formData.loan_purpose} onChange={handleChange}
                  />
                </div>

                <button type="submit" className="g-btn g-btn-primary w-full mt-md">
                  Continue to Consent
                </button>
              </form>
            </motion.div>
          )}

          {step === 2 && (
            <motion.div
              key="step2"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="g-card"
            >
              <div className="flex items-center gap-md mb-md">
                <div className="bg-g-blue" style={{ padding: 8, borderRadius: 'var(--g-radius-md)' }}>
                  <Landmark color="white" size={24} />
                </div>
                <h3>Data Sharing Consent</h3>
              </div>
              
              <p className="mb-md">To process your loan, we need to fetch your bank statements via the <strong>Account Aggregator (AA)</strong> network.</p>
              
              <div className="g-card-flat mb-md">
                <h4 className="mb-sm flex items-center gap-sm"><Info size={16} className="text-g-blue" /> What you're sharing:</h4>
                <ul style={{ paddingLeft: 'var(--g-spacing-lg)', fontSize: '0.9rem', color: 'var(--g-text-secondary)' }}>
                  <li>Last 6 months of bank transactions</li>
                  <li>Account balance summary</li>
                  <li>KYC Verification details</li>
                </ul>
              </div>

              <p className="text-secondary" style={{ fontSize: '0.85rem', marginBottom: 'var(--g-spacing-xl)' }}>
                By clicking 'Approve', you authorize the LSP to securely access this data for credit evaluation purposes only.
              </p>

              {error && (
                <div className="flex items-center gap-sm text-g-red mb-md" style={{ background: '#fef2f2', padding: 12, borderRadius: 8 }}>
                  <AlertCircle size={18} />
                  <span style={{ fontSize: '0.9rem' }}>{error}</span>
                </div>
              )}

              <div className="flex gap-lg">
                <button 
                  onClick={() => setStep(1)} 
                  className="g-btn g-btn-outline w-full"
                  disabled={loading}
                >
                  Back
                </button>
                <button 
                  onClick={handleConsent} 
                  className="g-btn g-btn-primary w-full"
                  disabled={loading}
                >
                  {loading ? <Loader2 className="animate-spin" /> : 'Approve & Apply'}
                </button>
              </div>
            </motion.div>
          )}

          {step === 3 && result && (
            <motion.div
              key="step3"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="g-card"
              style={{ textAlign: 'center', padding: 'var(--g-spacing-3xl)' }}
            >
              <div className="text-g-green mb-md flex justify-center">
                <CheckCircle2 size={80} />
              </div>
              <h2 className="mb-md">Application Submitted!</h2>
              <p className="text-secondary mb-xl">
                Your loan application has been successfully submitted to the lender. 
                Keep your application ID for tracking.
              </p>
              
              <div className="g-card-flat mb-xl" style={{ textAlign: 'left' }}>
                <div className="flex justify-between mb-sm">
                  <span className="text-secondary">Application ID:</span>
                  <span style={{ fontWeight: 600, fontFamily: 'monospace' }}>{result.application_id}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-secondary">Status:</span>
                  <span className={`text-g-${result.status.lender_status === 'approved' ? 'green' : 'red'}`} style={{ fontWeight: 600, textTransform: 'capitalize' }}>
                    {result.status.lender_status}
                  </span>
                </div>
              </div>

              <Link to="/status" className="g-btn g-btn-primary w-full">
                Go to Dashboard
              </Link>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default Apply;
