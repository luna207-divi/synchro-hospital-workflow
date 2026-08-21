import React, { useState, useEffect, useMemo } from 'react';
import { 
  DollarSign, FileText, CreditCard, Shield, Activity, 
  Search, Plus, Eye, CheckCircle2, AlertTriangle, XCircle, 
  Clock, ArrowUpRight, TrendingUp, Users, Loader, RefreshCw,
  Printer, ArrowRight, Download, Check
} from 'lucide-react';
import { 
  useBillingDashboard, 
  useBillingPatients, 
  useInvoices, 
  useInvoice, 
  usePayments, 
  useRecordPayment, 
  useUpdateInvoiceStatus, 
  useInsuranceClaims, 
  useProcedureCharges 
} from '../../hooks/useBilling';
import { useRealtimeSubscription } from '../../hooks/useRealtimeSubscription';
import './BillingPortal.css';

/* ============================================================
   SYNCHRO — Billing / Financial Command Workspace
   
   Route: /billing
   Contains tabs for:
     1. DASHBOARD — Revenue stats, summary KPIs, recent billing alerts
     2. PATIENTS — Financial profiles and active open billing accounts
     3. INVOICES — Detailed invoice list, itemization, and status tracking
     4. PAYMENTS — Processing terminal to receive copays, insurance payments
     5. INSURANCE — Claims management for INSURANCE_PROCESSING status
     6. PROCEDURES — Reference catalog of standardized procedure billing charges
   ============================================================ */

export const BillingPortal = () => {
  const [activeTab, setActiveTab] = useState('DASHBOARD');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedInvoiceId, setSelectedInvoiceId] = useState(null);
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);

  // Form states for payment recording
  const [paymentAmount, setPaymentAmount] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('CREDIT_CARD');
  const [paymentReference, setPaymentReference] = useState('');
  const [paymentError, setPaymentError] = useState('');
  const [paymentSuccess, setPaymentSuccess] = useState(false);

  // Live Database Hooks
  const { data: dashboardData, isLoading: loadingDashboard } = useBillingDashboard();
  const { data: billingPatients = [], isLoading: loadingPatients } = useBillingPatients();
  const { data: invoices = [], isLoading: loadingInvoices } = useInvoices();
  const { data: payments = [], isLoading: loadingPayments } = usePayments();
  const { data: insuranceClaims = [], isLoading: loadingInsurance } = useInsuranceClaims();
  const { data: procedureCharges = [], isLoading: loadingProcedures } = useProcedureCharges();

  // Selected Invoice Detail Hook
  const { data: selectedInvoice, isLoading: loadingSelectedInvoice } = useInvoice(selectedInvoiceId);

  // Mutation Hooks
  const recordPaymentMutation = useRecordPayment();
  const updateInvoiceStatusMutation = useUpdateInvoiceStatus();

  // Realtime Subscriptions
  useRealtimeSubscription('billing_accounts', ['billing-patients', 'billing-dashboard']);
  useRealtimeSubscription('invoices', ['invoices', 'billing-dashboard', 'insurance-claims']);
  useRealtimeSubscription('payments', ['payments', 'billing-dashboard']);

  // Scroll reveal observer
  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
        }
      });
    }, { threshold: 0.1 });

    const elements = document.querySelectorAll('.scroll-reveal');
    elements.forEach(el => observer.observe(el));

    return () => observer.disconnect();
  }, [activeTab, invoices, billingPatients, payments, insuranceClaims]);

  const stats = dashboardData?.stats || {
    totalRevenue: 0,
    pendingRevenue: 0,
    todayRevenue: 0,
    totalInvoices: 0,
    pendingInvoices: 0,
    paidInvoices: 0,
    partialInvoices: 0,
    insuranceProcessing: 0,
    todayInvoices: 0,
    openAccounts: 0
  };

  // Filtered Patients list
  const filteredPatients = useMemo(() => {
    if (!searchQuery) return billingPatients;
    const q = searchQuery.toLowerCase();
    return billingPatients.filter(p => {
      const patient = p.patient || {};
      const fullName = `${patient.first_name || ''} ${patient.last_name || ''}`.toLowerCase();
      const code = (patient.patient_code || '').toLowerCase();
      return fullName.includes(q) || code.includes(q);
    });
  }, [billingPatients, searchQuery]);

  // Filtered Invoices list
  const filteredInvoices = useMemo(() => {
    if (!searchQuery) return invoices;
    const q = searchQuery.toLowerCase();
    return invoices.filter(i => {
      const patient = i.patient || {};
      const fullName = `${patient.first_name || ''} ${patient.last_name || ''}`.toLowerCase();
      const code = (patient.patient_code || '').toLowerCase();
      const invNum = (i.invoice_number || '').toLowerCase();
      return fullName.includes(q) || code.includes(q) || invNum.includes(q);
    });
  }, [invoices, searchQuery]);

  // Handle Payment Submit
  const handleRecordPaymentSubmit = async (e) => {
    e.preventDefault();
    if (!selectedInvoiceId) return;
    setPaymentError('');
    setPaymentSuccess(false);

    const amountNum = parseFloat(paymentAmount);
    if (isNaN(amountNum) || amountNum <= 0) {
      setPaymentError('Please enter a valid payment amount.');
      return;
    }

    try {
      await recordPaymentMutation.mutateAsync({
        invoiceId: selectedInvoiceId,
        amount: amountNum,
        method: paymentMethod,
        reference: paymentReference
      });
      setPaymentSuccess(true);
      setPaymentAmount('');
      setPaymentReference('');
      setTimeout(() => {
        setIsPaymentModalOpen(false);
        setPaymentSuccess(false);
      }, 1500);
    } catch (err) {
      setPaymentError(err.message || 'Failed to record payment.');
    }
  };

  const handleUpdateStatus = async (invoiceId, newStatus) => {
    try {
      await updateInvoiceStatusMutation.mutateAsync({
        invoiceId,
        status: newStatus
      });
    } catch (err) {
      console.error('Failed to update invoice status:', err);
    }
  };

  const getStatusBadge = (status) => {
    const map = {
      'ISSUED': { label: 'Issued', class: 'badge-amber', Icon: Clock },
      'PAID': { label: 'Paid', class: 'badge-green', Icon: CheckCircle2 },
      'PARTIALLY_PAID': { label: 'Partial', class: 'badge-cyan', Icon: Activity },
      'SENT': { label: 'Insurance Processing', class: 'badge-purple', Icon: Shield },
      'OVERDUE': { label: 'Overdue', class: 'badge-red', Icon: AlertTriangle },
      'CANCELLED': { label: 'Cancelled', class: 'badge-grey', Icon: XCircle }
    };
    const info = map[status] || { label: status, class: 'badge-grey', Icon: Clock };
    const Icon = info.Icon;
    return (
      <span className={`billing-badge ${info.class}`}>
        <Icon size={12} />
        <span>{info.label}</span>
      </span>
    );
  };

  const todayStr = new Date().toLocaleDateString('en-GB', { 
    weekday: 'long', day: 'numeric', month: 'long' 
  });

  return (
    <div className="billing-portal">
      {/* ── Header ────────────────────────────────────────────── */}
      <div className="billing-header">
        <div className="billing-title-block">
          <h1 className="billing-portal-title">Financial & Billing Portal</h1>
          <p className="billing-portal-sub">Hospital financial telemetry, payment settlements, and insurance claims.</p>
        </div>
        <div className="billing-meta-block">
          <span className="billing-date">{todayStr}</span>
          <div className="billing-sync-badge">
            <span className="sync-dot" />
            <span className="sync-label">Realtime DB Sync</span>
          </div>
        </div>
      </div>

      {/* ── Internal Tabs Menu ────────────────────────────────── */}
      <div className="billing-tabs-container">
        <div className="billing-tabs-list">
          {[
            { id: 'DASHBOARD', label: 'Financial Overview', Icon: TrendingUp },
            { id: 'PATIENTS', label: 'Patient Accounts', Icon: Users },
            { id: 'INVOICES', label: 'Invoices & Ledger', Icon: FileText },
            { id: 'PAYMENTS', label: 'Payment Processing', Icon: CreditCard },
            { id: 'INSURANCE', label: 'Insurance Claims', Icon: Shield },
            { id: 'PROCEDURES', label: 'Billing Catalog', Icon: Activity }
          ].map(tab => {
            const Icon = tab.Icon;
            return (
              <button
                key={tab.id}
                className={`billing-tab-btn ${activeTab === tab.id ? 'active' : ''}`}
                onClick={() => {
                  setActiveTab(tab.id);
                  setSearchQuery('');
                }}
              >
                <Icon size={16} />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* ── 1. DASHBOARD VIEW ─────────────────────────────────── */}
      {activeTab === 'DASHBOARD' && (
        <div className="billing-dashboard-view">
          <div className="billing-kpi-grid">
            <div className="kpi-card scroll-reveal">
              <div className="kpi-card-header">
                <span className="kpi-label">Today's Settlements</span>
                <div className="kpi-icon-wrapper cyan">
                  <TrendingUp size={20} />
                </div>
              </div>
              <span className="kpi-value">₹{stats.todayRevenue.toLocaleString('en-IN')}</span>
              <div className="kpi-footer">
                <span className="kpi-trend positive">+{stats.todayInvoices} bills today</span>
              </div>
            </div>

            <div className="kpi-card scroll-reveal">
              <div className="kpi-card-header">
                <span className="kpi-label">Total Realized Revenue</span>
                <div className="kpi-icon-wrapper green">
                  <DollarSign size={20} />
                </div>
              </div>
              <span className="kpi-value">₹{stats.totalRevenue.toLocaleString('en-IN')}</span>
              <div className="kpi-footer">
                <span className="kpi-trend positive">Realized cash / bank transfers</span>
              </div>
            </div>

            <div className="kpi-card scroll-reveal">
              <div className="kpi-card-header">
                <span className="kpi-label">Pending Outstandings</span>
                <div className="kpi-icon-wrapper amber">
                  <Clock size={20} />
                </div>
              </div>
              <span className="kpi-value">₹{stats.pendingRevenue.toLocaleString('en-IN')}</span>
              <div className="kpi-footer">
                <span className="kpi-trend warning">{stats.pendingInvoices} invoices awaiting settlement</span>
              </div>
            </div>

            <div className="kpi-card scroll-reveal">
              <div className="kpi-card-header">
                <span className="kpi-label">Insurance Processing</span>
                <div className="kpi-icon-wrapper purple">
                  <Shield size={20} />
                </div>
              </div>
              <span className="kpi-value">{stats.insuranceProcessing} Claims</span>
              <div className="kpi-footer">
                <span className="kpi-trend neutral">Pre-authorization & claims pipeline</span>
              </div>
            </div>
          </div>

          <div className="billing-dashboard-grid scroll-reveal">
            {/* Recent Billing Events / Activity */}
            <div className="dashboard-widget">
              <div className="widget-header">
                <h3 className="widget-title">Recent Invoices</h3>
                <button className="widget-action-btn" onClick={() => setActiveTab('INVOICES')}>
                  View Ledger <ArrowRight size={14} />
                </button>
              </div>
              <div className="widget-content">
                <table className="billing-table">
                  <thead>
                    <tr>
                      <th>Inv Number</th>
                      <th>Patient</th>
                      <th>Issue Date</th>
                      <th>Total Amount</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {invoices.slice(0, 5).map(inv => (
                      <tr key={inv.id}>
                        <td className="font-mono text-navy font-bold">{inv.invoice_number}</td>
                        <td>
                          {inv.patient ? `${inv.patient.first_name} ${inv.patient.last_name}` : 'Unknown'}
                        </td>
                        <td>{new Date(inv.issued_at).toLocaleDateString('en-GB')}</td>
                        <td className="font-semibold">₹{inv.total_amount?.toLocaleString('en-IN')}</td>
                        <td>{getStatusBadge(inv.status)}</td>
                      </tr>
                    ))}
                    {invoices.length === 0 && (
                      <tr>
                        <td colSpan="5" className="text-center text-secondary">No invoices issued yet.</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Quick Insurance Stats & Claim Status */}
            <div className="dashboard-widget">
              <div className="widget-header">
                <h3 className="widget-title">Pending Insurance Pre-Auths</h3>
                <button className="widget-action-btn" onClick={() => setActiveTab('INSURANCE')}>
                  View Claims <ArrowRight size={14} />
                </button>
              </div>
              <div className="widget-content">
                <table className="billing-table">
                  <thead>
                    <tr>
                      <th>Patient</th>
                      <th>Provider</th>
                      <th>Claim Amount</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {insuranceClaims.slice(0, 5).map(claim => (
                      <tr key={claim.id}>
                        <td>
                          <div className="patient-cell">
                            <span className="p-name">{claim.patient?.first_name} {claim.patient?.last_name}</span>
                            <span className="p-code">{claim.patient?.patient_code}</span>
                          </div>
                        </td>
                        <td>{claim.patient?.insurance_provider || '—'}</td>
                        <td className="font-semibold">₹{claim.total_amount?.toLocaleString('en-IN')}</td>
                        <td>
                          <div className="row-actions">
                            <button className="action-btn-green" onClick={() => handleUpdateStatus(claim.id, 'PAID')}>
                              Approve
                            </button>
                            <button className="action-btn-red" onClick={() => handleUpdateStatus(claim.id, 'OVERDUE')}>
                              Deny
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                    {insuranceClaims.length === 0 && (
                      <tr>
                        <td colSpan="4" className="text-center text-secondary">No insurance claims in queue.</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── 2. PATIENT ACCOUNTS VIEW ─────────────────────────── */}
      {activeTab === 'PATIENTS' && (
        <div className="billing-patients-view">
          <div className="search-bar-container scroll-reveal">
            <Search className="search-icon" size={18} />
            <input
              type="text"
              placeholder="Search patients by name or patient ID..."
              className="billing-search-input"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <div className="patient-accounts-grid scroll-reveal">
            {filteredPatients.map(acc => {
              const patient = acc.patient || {};
              const pendingBalance = (acc.total_amount || 0) - (acc.paid_amount || 0);

              return (
                <div key={acc.id} className="patient-account-card">
                  <div className="card-top">
                    <div className="patient-name-block">
                      <h3 className="patient-name">{patient.first_name} {patient.last_name}</h3>
                      <span className="patient-id font-mono">{patient.patient_code}</span>
                    </div>
                    <span className={`status-pill ${acc.status === 'OPEN' ? 'open' : 'settled'}`}>
                      {acc.status}
                    </span>
                  </div>

                  <div className="card-financials">
                    <div className="financial-row">
                      <span className="f-label">Total Billed</span>
                      <span className="f-val">₹{acc.total_amount?.toLocaleString('en-IN') || 0}</span>
                    </div>
                    <div className="financial-row">
                      <span className="f-label">Total Settled</span>
                      <span className="f-val text-green">₹{acc.paid_amount?.toLocaleString('en-IN') || 0}</span>
                    </div>
                    <div className="financial-row divider">
                      <span className="f-label font-bold">Outstanding Balance</span>
                      <span className={`f-val font-bold ${pendingBalance > 0 ? 'text-red' : 'text-green'}`}>
                        ₹{pendingBalance.toLocaleString('en-IN')}
                      </span>
                    </div>
                  </div>

                  <div className="card-insurance">
                    <span className="ins-label">Insurance Provider:</span>
                    <span className="ins-val">{patient.insurance_provider || 'Not Covered / Self-Pay'}</span>
                  </div>

                  <div className="card-actions">
                    <button 
                      className="card-action-btn primary"
                      onClick={() => {
                        setSelectedInvoiceId(null);
                        // Find an invoice for this patient
                        const patInvoice = invoices.find(inv => inv.patient_id === patient.id);
                        if (patInvoice) {
                          setSelectedInvoiceId(patInvoice.id);
                          setIsDetailModalOpen(true);
                        } else {
                          alert('No invoice found for this patient account.');
                        }
                      }}
                    >
                      <Eye size={14} /> View Ledger Detail
                    </button>
                  </div>
                </div>
              );
            })}

            {filteredPatients.length === 0 && (
              <div className="empty-state scroll-reveal col-span-3">
                <Users size={48} />
                <p>No billing profiles match your search.</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ── 3. INVOICES VIEW ─────────────────────────────────── */}
      {activeTab === 'INVOICES' && (
        <div className="billing-invoices-view">
          <div className="search-bar-container scroll-reveal">
            <Search className="search-icon" size={18} />
            <input
              type="text"
              placeholder="Search invoices by number, patient name, or patient ID..."
              className="billing-search-input"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <div className="invoices-list-wrapper scroll-reveal">
            <table className="billing-table">
              <thead>
                <tr>
                  <th>Invoice Number</th>
                  <th>Patient</th>
                  <th>Insurance</th>
                  <th>Total Amount</th>
                  <th>Due Date</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredInvoices.map(inv => (
                  <tr key={inv.id}>
                    <td className="font-mono text-navy font-bold">{inv.invoice_number}</td>
                    <td>
                      <div className="patient-cell">
                        <span className="p-name">{inv.patient?.first_name} {inv.patient?.last_name}</span>
                        <span className="p-code">{inv.patient?.patient_code}</span>
                      </div>
                    </td>
                    <td>{inv.patient?.insurance_provider || 'Self-Pay'}</td>
                    <td className="font-semibold">₹{inv.total_amount?.toLocaleString('en-IN')}</td>
                    <td>{new Date(inv.due_date).toLocaleDateString('en-GB')}</td>
                    <td>{getStatusBadge(inv.status)}</td>
                    <td>
                      <div className="row-actions">
                        <button 
                          className="action-btn-blue icon-only" 
                          title="View Invoice Detail"
                          onClick={() => {
                            setSelectedInvoiceId(inv.id);
                            setIsDetailModalOpen(true);
                          }}
                        >
                          <Eye size={14} />
                        </button>
                        {inv.status !== 'PAID' && (
                          <button 
                            className="action-btn-green"
                            onClick={() => {
                              setSelectedInvoiceId(inv.id);
                              setPaymentAmount((inv.total_amount - (inv.payments?.reduce((s, p) => s + p.amount, 0) || 0)).toString());
                              setIsPaymentModalOpen(true);
                            }}
                          >
                            Collect Copay
                          </button>
                        )}
                        {inv.status === 'ISSUED' && inv.patient?.insurance_provider && (
                          <button 
                            className="action-btn-purple"
                            onClick={() => handleUpdateStatus(inv.id, 'SENT')}
                          >
                            Submit Claim
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
                {filteredInvoices.length === 0 && (
                  <tr>
                    <td colSpan="7" className="text-center text-secondary py-8">No invoices match your search.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ── 4. PAYMENTS VIEW ─────────────────────────────────── */}
      {activeTab === 'PAYMENTS' && (
        <div className="billing-payments-view scroll-reveal">
          <div className="payments-flex-layout">
            {/* Quick Record Payment Panel */}
            <div className="payment-terminal-widget">
              <h3 className="panel-title">Copay & Billing Terminal</h3>
              <p className="panel-desc">Directly receive and log surgical settlements, diagnostic fees, and bed charges.</p>
              
              <form onSubmit={handleRecordPaymentSubmit} className="terminal-form">
                <div className="form-group">
                  <label>Select Invoice</label>
                  <select 
                    className="billing-select"
                    value={selectedInvoiceId || ''} 
                    onChange={(e) => {
                      const id = e.target.value;
                      setSelectedInvoiceId(id);
                      const inv = invoices.find(i => i.id === id);
                      if (inv) {
                        setPaymentAmount(inv.total_amount.toString());
                      }
                    }}
                    required
                  >
                    <option value="" disabled>-- Select Unpaid Invoice --</option>
                    {invoices.filter(i => i.status !== 'PAID').map(inv => (
                      <option key={inv.id} value={inv.id}>
                        {inv.invoice_number} - {inv.patient?.first_name} {inv.patient?.last_name} (₹{inv.total_amount})
                      </option>
                    ))}
                  </select>
                </div>

                <div className="form-group">
                  <label>Amount (₹)</label>
                  <input
                    type="number"
                    className="billing-input"
                    placeholder="Enter amount to receive..."
                    value={paymentAmount}
                    onChange={(e) => setPaymentAmount(e.target.value)}
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Payment Method</label>
                  <select 
                    className="billing-select"
                    value={paymentMethod}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                  >
                    <option value="CREDIT_CARD">Credit / Debit Card</option>
                    <option value="CASH">Cash</option>
                    <option value="BANK_TRANSFER">Bank Transfer (UPI / IMPS)</option>
                    <option value="INSURANCE">Insurance Settlement</option>
                  </select>
                </div>

                <div className="form-group">
                  <label>Reference / Txn ID</label>
                  <input
                    type="text"
                    className="billing-input"
                    placeholder="UPI Txn ID or Receipt Code..."
                    value={paymentReference}
                    onChange={(e) => setPaymentReference(e.target.value)}
                  />
                </div>

                {paymentError && <div className="terminal-error">{paymentError}</div>}
                {paymentSuccess && <div className="terminal-success">✓ Payment processed successfully!</div>}

                <button 
                  type="submit" 
                  className="terminal-btn-submit"
                  disabled={recordPaymentMutation.isPending || !selectedInvoiceId}
                >
                  {recordPaymentMutation.isPending ? 'Processing...' : 'Settle Invoice Balance'}
                </button>
              </form>
            </div>

            {/* Historical Payment Logs */}
            <div className="payments-log-widget">
              <h3 className="panel-title">Settlement Logs</h3>
              <div className="payments-log-list">
                {payments.map(pay => (
                  <div key={pay.id} className="payment-log-card">
                    <div className="log-card-left">
                      <div className="payment-method-icon">
                        <CreditCard size={16} />
                      </div>
                      <div className="payment-log-details">
                        <span className="log-number">₹{pay.amount?.toLocaleString('en-IN')}</span>
                        <span className="log-meta">
                          {pay.payment_method?.replace(/_/g, ' ')} · Ref: {pay.reference_number || 'None'}
                        </span>
                      </div>
                    </div>
                    <div className="log-card-right">
                      <span className="log-inv font-mono">{pay.invoice?.invoice_number}</span>
                      <span className="log-time">{new Date(pay.payment_date).toLocaleDateString('en-GB')}</span>
                    </div>
                  </div>
                ))}

                {payments.length === 0 && (
                  <div className="empty-state">
                    <CreditCard size={32} />
                    <p>No payments recorded yet.</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── 5. INSURANCE VIEW ────────────────────────────────── */}
      {activeTab === 'INSURANCE' && (
        <div className="billing-insurance-view scroll-reveal">
          <div className="billing-alerts-bar">
            <Shield size={18} />
            <span>All invoices listed here are pending insurance pre-authorization validation or payout authorization.</span>
          </div>

          <div className="insurance-claims-table-wrapper">
            <table className="billing-table">
              <thead>
                <tr>
                  <th>Patient</th>
                  <th>Policy Details</th>
                  <th>Provider</th>
                  <th>Claim Total</th>
                  <th>Date Submitted</th>
                  <th>Validation Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {insuranceClaims.map(claim => (
                  <tr key={claim.id}>
                    <td>
                      <div className="patient-cell">
                        <span className="p-name">{claim.patient?.first_name} {claim.patient?.last_name}</span>
                        <span className="p-code">{claim.patient?.patient_code}</span>
                      </div>
                    </td>
                    <td className="font-mono">{claim.patient?.insurance_policy_number || '—'}</td>
                    <td>{claim.patient?.insurance_provider || '—'}</td>
                    <td className="font-semibold text-purple-700">₹{claim.total_amount?.toLocaleString('en-IN')}</td>
                    <td>{new Date(claim.issued_at).toLocaleDateString('en-GB')}</td>
                    <td>
                      <span className="billing-badge badge-purple">
                        <Shield size={12} />
                        <span>Awaiting Co-Pay</span>
                      </span>
                    </td>
                    <td>
                      <div className="row-actions">
                        <button 
                          className="action-btn-green" 
                          onClick={() => handleUpdateStatus(claim.id, 'PAID')}
                        >
                          Settle Claim (Approve)
                        </button>
                        <button 
                          className="action-btn-red" 
                          onClick={() => handleUpdateStatus(claim.id, 'OVERDUE')}
                        >
                          Reject Pre-Auth
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
                {insuranceClaims.length === 0 && (
                  <tr>
                    <td colSpan="7" className="text-center text-secondary py-8">No insurance claims in processing.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ── 6. PROCEDURES VIEW ───────────────────────────────── */}
      {activeTab === 'PROCEDURES' && (
        <div className="billing-procedures-view scroll-reveal">
          <div className="catalog-header-bar">
            <h3 className="catalog-title">Standardized Billing Catalog</h3>
            <p className="catalog-subtitle">Base rates for operating theatres, surgical fees, recovery, diagnostics, and wards.</p>
          </div>

          <div className="procedures-grid">
            {procedureCharges.map(charge => (
              <div key={charge.id} className="procedure-catalog-card">
                <span className="charge-cat">{charge.category}</span>
                <h4 className="charge-name">{charge.name}</h4>
                <div className="charge-price-row">
                  <span className="price-label">Base Cost</span>
                  <span className="price-val">₹{charge.base_price?.toLocaleString('en-IN')}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── Invoice Detail Modal ─────────────────────────────── */}
      {isDetailModalOpen && selectedInvoice && (
        <div className="billing-modal-backdrop">
          <div className="billing-invoice-modal-card">
            <div className="modal-header">
              <div className="modal-header-title">
                <FileText size={20} className="text-cyan" />
                <h3>Invoice Details: {selectedInvoice.invoice_number}</h3>
              </div>
              <button className="modal-close-btn" onClick={() => setIsDetailModalOpen(false)}>×</button>
            </div>

            <div className="modal-body">
              <div className="invoice-meta-info">
                <div className="info-col">
                  <strong>Patient Info:</strong>
                  <span>{selectedInvoice.patient?.first_name} {selectedInvoice.patient?.last_name}</span>
                  <span className="font-mono text-xs">{selectedInvoice.patient?.patient_code}</span>
                  <span>Insurance: {selectedInvoice.patient?.insurance_provider || 'Self-Pay'}</span>
                </div>
                <div className="info-col">
                  <strong>Ledger Info:</strong>
                  <span>Billing Account: {selectedInvoice.billing_account?.account_number}</span>
                  <span>Issued At: {new Date(selectedInvoice.issued_at).toLocaleString('en-GB')}</span>
                  <span>Status: {selectedInvoice.status}</span>
                </div>
              </div>

              <div className="invoice-line-items-section">
                <h4>Line Items Breakdown</h4>
                <table className="line-items-table">
                  <thead>
                    <tr>
                      <th>Description</th>
                      <th>Quantity</th>
                      <th>Unit Price</th>
                      <th>Total</th>
                    </tr>
                  </thead>
                  <tbody>
                    {(selectedInvoice.line_items || []).map((item, idx) => (
                      <tr key={idx}>
                        <td>{item.description}</td>
                        <td>{item.quantity}</td>
                        <td>₹{item.unit_price?.toLocaleString('en-IN')}</td>
                        <td>₹{item.total?.toLocaleString('en-IN')}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="invoice-total-summary">
                <div className="total-row">
                  <span>Subtotal:</span>
                  <span>₹{selectedInvoice.subtotal?.toLocaleString('en-IN')}</span>
                </div>
                <div className="total-row">
                  <span>Tax & Levies:</span>
                  <span>₹{selectedInvoice.tax_amount?.toLocaleString('en-IN')}</span>
                </div>
                <div className="total-row main">
                  <span>Grand Total:</span>
                  <span>₹{selectedInvoice.total_amount?.toLocaleString('en-IN')}</span>
                </div>
              </div>

              {selectedInvoice.payments && selectedInvoice.payments.length > 0 && (
                <div className="invoice-payments-section">
                  <h4>Recorded Payments Log</h4>
                  <div className="payments-mini-list">
                    {selectedInvoice.payments.map((p, idx) => (
                      <div key={idx} className="payment-mini-item">
                        <span>₹{p.amount?.toLocaleString('en-IN')} via {p.payment_method?.replace(/_/g, ' ')}</span>
                        <span className="text-secondary font-mono text-xs">Ref: {p.reference_number || 'N/A'}</span>
                        <span className="text-secondary">{new Date(p.payment_date).toLocaleDateString('en-GB')}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="modal-footer">
              <button className="billing-btn-sec" onClick={() => window.print()}>
                <Printer size={14} /> Print Invoice
              </button>
              <button 
                className="billing-btn-pri" 
                onClick={() => {
                  setIsDetailModalOpen(false);
                  setIsPaymentModalOpen(true);
                }}
                disabled={selectedInvoice.status === 'PAID'}
              >
                Settle / Collect Copay
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Settle Balance Modal ─────────────────────────────── */}
      {isPaymentModalOpen && (
        <div className="billing-modal-backdrop">
          <div className="billing-payment-modal-card">
            <div className="modal-header">
              <h3>Collect Copay / Settle Balance</h3>
              <button className="modal-close-btn" onClick={() => setIsPaymentModalOpen(false)}>×</button>
            </div>

            <div className="modal-body">
              <form onSubmit={handleRecordPaymentSubmit}>
                <div className="form-group">
                  <label>Amount to Collect (₹)</label>
                  <input
                    type="number"
                    className="billing-input"
                    value={paymentAmount}
                    onChange={(e) => setPaymentAmount(e.target.value)}
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Payment Mode</label>
                  <select 
                    className="billing-select"
                    value={paymentMethod}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                  >
                    <option value="CREDIT_CARD">Credit / Debit Card</option>
                    <option value="CASH">Cash</option>
                    <option value="BANK_TRANSFER">Bank Transfer (UPI / NetBanking)</option>
                    <option value="INSURANCE">Insurance Claim Settlement</option>
                  </select>
                </div>

                <div className="form-group">
                  <label>Receipt Reference / Auth Code</label>
                  <input
                    type="text"
                    className="billing-input"
                    placeholder="Enter UPI Txn ID, Card Approval reference..."
                    value={paymentReference}
                    onChange={(e) => setPaymentReference(e.target.value)}
                  />
                </div>

                {paymentError && <div className="terminal-error">{paymentError}</div>}
                {paymentSuccess && <div className="terminal-success">✓ Payment processed successfully!</div>}

                <div className="modal-footer-btns">
                  <button type="button" className="billing-btn-sec" onClick={() => setIsPaymentModalOpen(false)}>Cancel</button>
                  <button type="submit" className="billing-btn-pri" disabled={recordPaymentMutation.isPending}>
                    {recordPaymentMutation.isPending ? 'Processing...' : 'Approve & Clear Balance'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
export default BillingPortal;
