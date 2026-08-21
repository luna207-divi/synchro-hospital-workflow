import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '../lib/supabase';

/* ============================================================
   SYNCHRO — Billing Data Hooks (Dual-Mode Realtime + Offline Fallback)
   ============================================================ */

const DEMO_BILLING_PATIENTS = [
  {
    id: 'b-1042',
    account_number: 'ACC-2026-1042',
    status: 'OPEN',
    total_amount: 145000,
    paid_amount: 75000,
    patient_due: 25000,
    insurance_due: 45000,
    created_at: new Date(Date.now() - 86400000 * 2).toISOString(),
    patient: {
      id: 'p-1042',
      patient_code: 'P-1042',
      first_name: 'Ananya',
      last_name: 'Rao',
      gender: 'Female',
      date_of_birth: '1988-04-12',
      insurance_provider: 'Star Health',
      insurance_policy_number: 'SH-99201-B',
      admission_status: 'ADMITTED',
      procedure: 'Laparoscopic Cholecystectomy',
      department: 'General Surgery'
    }
  },
  {
    id: 'b-1043',
    account_number: 'ACC-2026-1043',
    status: 'OPEN',
    total_amount: 280000,
    paid_amount: 120000,
    patient_due: 40000,
    insurance_due: 120000,
    created_at: new Date(Date.now() - 86400000 * 3).toISOString(),
    patient: {
      id: 'p-1043',
      patient_code: 'P-1043',
      first_name: 'Rahul',
      last_name: 'Shah',
      gender: 'Male',
      date_of_birth: '1975-09-24',
      insurance_provider: 'HDFC ERGO',
      insurance_policy_number: 'HE-88392-C',
      admission_status: 'PRE_OP',
      procedure: 'Total Hip Arthroplasty',
      department: 'Orthopedics'
    }
  },
  {
    id: 'b-1044',
    account_number: 'ACC-2026-1044',
    status: 'CLOSED',
    total_amount: 195000,
    paid_amount: 195000,
    patient_due: 0,
    insurance_due: 0,
    created_at: new Date(Date.now() - 86400000 * 5).toISOString(),
    patient: {
      id: 'p-1044',
      patient_code: 'P-1044',
      first_name: 'Meera',
      last_name: 'Chen',
      gender: 'Female',
      date_of_birth: '1992-11-05',
      insurance_provider: 'ICICI Lombard',
      insurance_policy_number: 'IL-77401-A',
      admission_status: 'DISCHARGED',
      procedure: 'ACL Reconstruction',
      department: 'Orthopedics'
    }
  },
  {
    id: 'b-1048',
    account_number: 'ACC-2026-1048',
    status: 'OPEN',
    total_amount: 420000,
    paid_amount: 200000,
    patient_due: 50000,
    insurance_due: 170000,
    created_at: new Date(Date.now() - 86400000 * 1).toISOString(),
    patient: {
      id: 'p-1048',
      patient_code: 'P-1048',
      first_name: 'Priya',
      last_name: 'Sharma',
      gender: 'Female',
      date_of_birth: '1981-02-18',
      insurance_provider: 'Max Bupa',
      insurance_policy_number: 'MB-10293-X',
      admission_status: 'ADMITTED',
      procedure: 'Coronary Artery Bypass (CABG)',
      department: 'Cardiology'
    }
  },
  {
    id: 'b-1099',
    account_number: 'ACC-2026-1099',
    status: 'OPEN',
    total_amount: 310000,
    paid_amount: 150000,
    patient_due: 15000,
    insurance_due: 145000,
    created_at: new Date(Date.now() - 86400000 * 4).toISOString(),
    patient: {
      id: 'p-1099',
      patient_code: 'P-1099',
      first_name: 'Arjun',
      last_name: 'Das',
      gender: 'Male',
      date_of_birth: '1985-07-30',
      insurance_provider: 'Bajaj Allianz',
      insurance_policy_number: 'BA-55102-Z',
      admission_status: 'EMERGENCY',
      procedure: 'Emergency Trauma Surgery',
      department: 'Trauma Surgery'
    }
  }
];

const DEMO_INVOICES = [
  {
    id: 'inv-101',
    invoice_number: 'INV-2026-001',
    total_amount: 145000,
    status: 'PARTIALLY_PAID',
    issued_at: new Date(Date.now() - 86400000 * 2).toISOString(),
    paid_at: null,
    patient_due: 25000,
    insurance_status: 'Verified',
    patient: {
      id: 'p-1042',
      patient_code: 'P-1042',
      first_name: 'Ananya',
      last_name: 'Rao',
      insurance_provider: 'Star Health',
      procedure: 'Laparoscopic Cholecystectomy'
    },
    billing_account: { account_number: 'ACC-2026-1042', status: 'OPEN' },
    breakdown: {
      hospitalCharges: 25000,
      otCharges: 45000,
      doctorCharges: 35000,
      roomCharges: 15000,
      pharmacy: 12000,
      diagnostics: 8000,
      cssd: 5000,
      grossBill: 145000,
      insuranceCoverage: 120000,
      discounts: 0,
      amountPaid: 75000,
      outstandingBalance: 70000
    }
  },
  {
    id: 'inv-102',
    invoice_number: 'INV-2026-002',
    total_amount: 280000,
    status: 'SENT',
    issued_at: new Date(Date.now() - 86400000 * 3).toISOString(),
    paid_at: null,
    patient_due: 40000,
    insurance_status: 'Claim Submitted',
    patient: {
      id: 'p-1043',
      patient_code: 'P-1043',
      first_name: 'Rahul',
      last_name: 'Shah',
      insurance_provider: 'HDFC ERGO',
      procedure: 'Total Hip Arthroplasty'
    },
    billing_account: { account_number: 'ACC-2026-1043', status: 'OPEN' },
    breakdown: {
      hospitalCharges: 40000,
      otCharges: 95000,
      doctorCharges: 70000,
      roomCharges: 30000,
      pharmacy: 25000,
      diagnostics: 12000,
      cssd: 8000,
      grossBill: 280000,
      insuranceCoverage: 240000,
      discounts: 0,
      amountPaid: 120000,
      outstandingBalance: 160000
    }
  },
  {
    id: 'inv-103',
    invoice_number: 'INV-2026-003',
    total_amount: 195000,
    status: 'PAID',
    issued_at: new Date(Date.now() - 86400000 * 5).toISOString(),
    paid_at: new Date(Date.now() - 86400000 * 1).toISOString(),
    patient_due: 0,
    insurance_status: 'Verified',
    patient: {
      id: 'p-1044',
      patient_code: 'P-1044',
      first_name: 'Meera',
      last_name: 'Chen',
      insurance_provider: 'ICICI Lombard',
      procedure: 'ACL Reconstruction'
    },
    billing_account: { account_number: 'ACC-2026-1044', status: 'CLOSED' },
    breakdown: {
      hospitalCharges: 30000,
      otCharges: 65000,
      doctorCharges: 50000,
      roomCharges: 20000,
      pharmacy: 16000,
      diagnostics: 9000,
      cssd: 5000,
      grossBill: 195000,
      insuranceCoverage: 195000,
      discounts: 0,
      amountPaid: 195000,
      outstandingBalance: 0
    }
  },
  {
    id: 'inv-104',
    invoice_number: 'INV-2026-004',
    total_amount: 420000,
    status: 'PARTIALLY_PAID',
    issued_at: new Date(Date.now() - 86400000 * 1).toISOString(),
    paid_at: null,
    patient_due: 50000,
    insurance_status: 'Under Review',
    patient: {
      id: 'p-1048',
      patient_code: 'P-1048',
      first_name: 'Priya',
      last_name: 'Sharma',
      insurance_provider: 'Max Bupa',
      procedure: 'Coronary Artery Bypass (CABG)'
    },
    billing_account: { account_number: 'ACC-2026-1048', status: 'OPEN' },
    breakdown: {
      hospitalCharges: 60000,
      otCharges: 140000,
      doctorCharges: 110000,
      roomCharges: 45000,
      pharmacy: 35000,
      diagnostics: 20000,
      cssd: 10000,
      grossBill: 420000,
      insuranceCoverage: 370000,
      discounts: 0,
      amountPaid: 200000,
      outstandingBalance: 220000
    }
  },
  {
    id: 'inv-105',
    invoice_number: 'INV-2026-005',
    total_amount: 310000,
    status: 'ISSUED',
    issued_at: new Date(Date.now() - 86400000 * 4).toISOString(),
    paid_at: null,
    patient_due: 15000,
    insurance_status: 'Verified',
    patient: {
      id: 'p-1099',
      patient_code: 'P-1099',
      first_name: 'Arjun',
      last_name: 'Das',
      insurance_provider: 'Bajaj Allianz',
      procedure: 'Emergency Trauma Surgery'
    },
    billing_account: { account_number: 'ACC-2026-1099', status: 'OPEN' },
    breakdown: {
      hospitalCharges: 45000,
      otCharges: 110000,
      doctorCharges: 85000,
      roomCharges: 30000,
      pharmacy: 22000,
      diagnostics: 12000,
      cssd: 6000,
      grossBill: 310000,
      insuranceCoverage: 295000,
      discounts: 0,
      amountPaid: 150000,
      outstandingBalance: 160000
    }
  }
];

const DEMO_PAYMENTS = [
  {
    id: 'pay-001',
    payment_date: new Date(Date.now() - 3600000 * 2).toISOString(),
    amount: 75000,
    payment_method: 'UPI',
    reference_number: 'UPI-9823019283',
    status: 'COMPLETED',
    invoice: {
      invoice_number: 'INV-2026-001',
      total_amount: 145000,
      status: 'PARTIALLY_PAID',
      patient: { first_name: 'Ananya', last_name: 'Rao', patient_code: 'P-1042' }
    }
  },
  {
    id: 'pay-002',
    payment_date: new Date(Date.now() - 3600000 * 5).toISOString(),
    amount: 120000,
    payment_method: 'INSURANCE',
    reference_number: 'CLM-HDFC-88392',
    status: 'COMPLETED',
    invoice: {
      invoice_number: 'INV-2026-002',
      total_amount: 280000,
      status: 'SENT',
      patient: { first_name: 'Rahul', last_name: 'Shah', patient_code: 'P-1043' }
    }
  },
  {
    id: 'pay-003',
    payment_date: new Date(Date.now() - 86400000 * 1).toISOString(),
    amount: 195000,
    payment_method: 'BANK_TRANSFER',
    reference_number: 'NEFT-ICICI-77401',
    status: 'COMPLETED',
    invoice: {
      invoice_number: 'INV-2026-003',
      total_amount: 195000,
      status: 'PAID',
      patient: { first_name: 'Meera', last_name: 'Chen', patient_code: 'P-1044' }
    }
  },
  {
    id: 'pay-004',
    payment_date: new Date(Date.now() - 86400000 * 1.5).toISOString(),
    amount: 200000,
    payment_method: 'CARD',
    reference_number: 'TXN-CARD-44210',
    status: 'COMPLETED',
    invoice: {
      invoice_number: 'INV-2026-004',
      total_amount: 420000,
      status: 'PARTIALLY_PAID',
      patient: { first_name: 'Priya', last_name: 'Sharma', patient_code: 'P-1048' }
    }
  },
  {
    id: 'pay-005',
    payment_date: new Date(Date.now() - 86400000 * 2.5).toISOString(),
    amount: 150000,
    payment_method: 'CASH',
    reference_number: 'RCPT-CASH-10029',
    status: 'COMPLETED',
    invoice: {
      invoice_number: 'INV-2026-005',
      total_amount: 310000,
      status: 'ISSUED',
      patient: { first_name: 'Arjun', last_name: 'Das', patient_code: 'P-1099' }
    }
  }
];

const DEMO_INSURANCE_CLAIMS = [
  {
    id: 'clm-01',
    invoice_number: 'INV-2026-001',
    policy_number: 'SH-99201-B',
    claim_amount: 120000,
    approved_amount: 120000,
    pending_amount: 0,
    submitted_date: '2026-08-19',
    approval_status: 'VERIFIED',
    patient: {
      first_name: 'Ananya',
      last_name: 'Rao',
      patient_code: 'P-1042',
      insurance_provider: 'Star Health',
      insurance_policy_number: 'SH-99201-B'
    }
  },
  {
    id: 'clm-02',
    invoice_number: 'INV-2026-002',
    policy_number: 'HE-88392-C',
    claim_amount: 240000,
    approved_amount: 120000,
    pending_amount: 120000,
    submitted_date: '2026-08-18',
    approval_status: 'CLAIM SUBMITTED',
    patient: {
      first_name: 'Rahul',
      last_name: 'Shah',
      patient_code: 'P-1043',
      insurance_provider: 'HDFC ERGO',
      insurance_policy_number: 'HE-88392-C'
    }
  },
  {
    id: 'clm-03',
    invoice_number: 'INV-2026-004',
    policy_number: 'MB-10293-X',
    claim_amount: 370000,
    approved_amount: 200000,
    pending_amount: 170000,
    submitted_date: '2026-08-20',
    approval_status: 'UNDER REVIEW',
    patient: {
      first_name: 'Priya',
      last_name: 'Sharma',
      patient_code: 'P-1048',
      insurance_provider: 'Max Bupa',
      insurance_policy_number: 'MB-10293-X'
    }
  },
  {
    id: 'clm-04',
    invoice_number: 'INV-2026-005',
    policy_number: 'BA-55102-Z',
    claim_amount: 295000,
    approved_amount: 150000,
    pending_amount: 145000,
    submitted_date: '2026-08-17',
    approval_status: 'PARTIALLY APPROVED',
    patient: {
      first_name: 'Arjun',
      last_name: 'Das',
      patient_code: 'P-1099',
      insurance_provider: 'Bajaj Allianz',
      insurance_policy_number: 'BA-55102-Z'
    }
  }
];

// ─── Dashboard Statistics ─────────────────────────────────
export const useBillingDashboard = () => {
  const today = new Date().toISOString().split('T')[0];
  return useQuery({
    queryKey: ['billing-dashboard', today],
    queryFn: async () => {
      if (!supabase) {
        return {
          stats: {
            totalRevenue: 842000,
            pendingRevenue: 1260000,
            todayRevenue: 842000,
            insuranceClaimValue: 1840000,
            totalInvoices: 248,
            pendingInvoices: 18,
            paidInvoices: 196,
            partialInvoices: 24,
            insuranceProcessing: 18,
            todayInvoices: 32,
            openAccounts: 248
          }
        };
      }
      const { data: invoices } = await supabase
        .from('invoices')
        .select('id, status, total_amount, issued_at, paid_at');

      const allInvoices = invoices || [];
      const todayInvoices = allInvoices.filter(i => i.issued_at?.startsWith(today));
      const pending = allInvoices.filter(i => i.status === 'ISSUED' || i.status === 'OVERDUE');
      const paid = allInvoices.filter(i => i.status === 'PAID');
      const partial = allInvoices.filter(i => i.status === 'PARTIALLY_PAID');
      const processing = allInvoices.filter(i => i.status === 'SENT');

      const totalRevenue = paid.reduce((s, i) => s + (i.total_amount || 0), 0);
      const pendingRevenue = pending.reduce((s, i) => s + (i.total_amount || 0), 0);
      const todayRevenue = todayInvoices.filter(i => i.status === 'PAID').reduce((s, i) => s + (i.total_amount || 0), 0);

      const { data: accounts } = await supabase
        .from('billing_accounts')
        .select('id, status, total_amount, paid_amount')
        .eq('status', 'OPEN');

      return {
        stats: {
          totalRevenue,
          pendingRevenue,
          todayRevenue,
          totalInvoices: allInvoices.length,
          pendingInvoices: pending.length,
          paidInvoices: paid.length,
          partialInvoices: partial.length,
          insuranceProcessing: processing.length,
          todayInvoices: todayInvoices.length,
          openAccounts: (accounts || []).length,
        },
      };
    },
    refetchInterval: 20000,
  });
};

// ─── Patients with billing accounts ───────────────────────
export const useBillingPatients = () => {
  return useQuery({
    queryKey: ['billing-patients'],
    queryFn: async () => {
      if (!supabase) return DEMO_BILLING_PATIENTS;
      const { data, error } = await supabase
        .from('billing_accounts')
        .select(`
          *,
          patient:patients (
            id, patient_code, first_name, last_name, gender, date_of_birth,
            insurance_provider, insurance_policy_number, admission_status
          )
        `)
        .order('created_at', { ascending: false });

      if (error) return DEMO_BILLING_PATIENTS;
      return data || DEMO_BILLING_PATIENTS;
    },
    refetchInterval: 15000,
  });
};

// ─── All Invoices ─────────────────────────────────────────
export const useInvoices = (statusFilter = null) => {
  return useQuery({
    queryKey: ['invoices', statusFilter],
    queryFn: async () => {
      if (!supabase) return DEMO_INVOICES;
      let query = supabase
        .from('invoices')
        .select(`
          *,
          patient:patients (id, patient_code, first_name, last_name, insurance_provider),
          billing_account:billing_accounts (account_number, status)
        `)
        .order('issued_at', { ascending: false });

      if (statusFilter) {
        query = query.eq('status', statusFilter);
      }

      const { data, error } = await query;
      if (error) return DEMO_INVOICES;
      return data || DEMO_INVOICES;
    },
    refetchInterval: 15000,
  });
};

// ─── Single Invoice ──────────────────────────────────────
export const useInvoice = (invoiceId) => {
  return useQuery({
    queryKey: ['invoice', invoiceId],
    queryFn: async () => {
      if (!supabase) {
        return DEMO_INVOICES.find(i => i.id === invoiceId) || DEMO_INVOICES[0];
      }
      const { data, error } = await supabase
        .from('invoices')
        .select(`
          *,
          patient:patients (*),
          billing_account:billing_accounts (*),
          payments:payments (*)
        `)
        .eq('id', invoiceId)
        .single();

      if (error) return DEMO_INVOICES[0];
      return data || DEMO_INVOICES[0];
    },
    enabled: !!invoiceId,
  });
};

// ─── All Payments ─────────────────────────────────────────
export const usePayments = () => {
  return useQuery({
    queryKey: ['payments'],
    queryFn: async () => {
      if (!supabase) return DEMO_PAYMENTS;
      const { data, error } = await supabase
        .from('payments')
        .select(`
          *,
          invoice:invoices (invoice_number, total_amount, status,
            patient:patients (first_name, last_name, patient_code)
          )
        `)
        .order('payment_date', { ascending: false });

      if (error) return DEMO_PAYMENTS;
      return data || DEMO_PAYMENTS;
    },
    refetchInterval: 15000,
  });
};

// ─── Record a Payment ─────────────────────────────────────
export const useRecordPayment = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ invoiceId, amount, method, reference }) => {
      if (!supabase) {
        const newPayment = {
          id: `pay-${Date.now()}`,
          payment_date: new Date().toISOString(),
          amount: amount,
          payment_method: method,
          reference_number: reference || `REF-${Math.floor(10000 + Math.random() * 90000)}`,
          status: 'COMPLETED',
          invoice: {
            invoice_number: 'INV-2026-001',
            total_amount: 145000,
            status: 'PAID',
            patient: { first_name: 'Ananya', last_name: 'Rao', patient_code: 'P-1042' }
          }
        };
        DEMO_PAYMENTS.unshift(newPayment);
        return newPayment;
      }

      const { data: payment, error: payError } = await supabase
        .from('payments')
        .insert([{
          invoice_id: invoiceId,
          amount,
          payment_method: method,
          reference_number: reference,
          payment_date: new Date().toISOString(),
          status: 'COMPLETED',
        }])
        .select()
        .single();

      if (payError) throw payError;
      return payment;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['invoices'] });
      queryClient.invalidateQueries({ queryKey: ['payments'] });
      queryClient.invalidateQueries({ queryKey: ['billing-patients'] });
      queryClient.invalidateQueries({ queryKey: ['billing-dashboard'] });
    },
  });
};

// ─── Update Invoice Status ────────────────────────────────
export const useUpdateInvoiceStatus = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ invoiceId, status }) => {
      if (!supabase) return { id: invoiceId, status };
      const { data, error } = await supabase
        .from('invoices')
        .update({ status })
        .eq('id', invoiceId)
        .select()
        .single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['invoices'] });
      queryClient.invalidateQueries({ queryKey: ['billing-dashboard'] });
    },
  });
};

// ─── Insurance Claims ─────────────────────────────────────
export const useInsuranceClaims = () => {
  return useQuery({
    queryKey: ['insurance-claims'],
    queryFn: async () => {
      if (!supabase) return DEMO_INSURANCE_CLAIMS;
      const { data, error } = await supabase
        .from('invoices')
        .select(`
          *,
          patient:patients (
            first_name, last_name, patient_code,
            insurance_provider, insurance_policy_number
          )
        `)
        .eq('status', 'SENT')
        .order('issued_at', { ascending: false });

      if (error) return DEMO_INSURANCE_CLAIMS;
      return data || DEMO_INSURANCE_CLAIMS;
    },
    refetchInterval: 15000,
  });
};

// ─── Procedure Charge Catalog ─────────────────────────────
export const useProcedureCharges = () => {
  return useQuery({
    queryKey: ['procedure-charges'],
    queryFn: async () => {
      return [
        { id: 1, name: 'OT Charges (Standard)', base_price: 45000, category: 'Operating Theatre' },
        { id: 2, name: 'OT Charges (Major)', base_price: 85000, category: 'Operating Theatre' },
        { id: 3, name: 'Surgeon Fee (Standard)', base_price: 25000, category: 'Surgeon' },
        { id: 4, name: 'Surgeon Fee (Senior)', base_price: 50000, category: 'Surgeon' },
        { id: 5, name: 'Anesthesia', base_price: 12000, category: 'Anesthesia' },
        { id: 6, name: 'Post-Op Recovery', base_price: 8000, category: 'Recovery' },
        { id: 7, name: 'ICU per day', base_price: 25000, category: 'Ward' },
        { id: 8, name: 'General Ward per day', base_price: 5000, category: 'Ward' },
        { id: 9, name: 'Private Room per day', base_price: 12000, category: 'Ward' },
        { id: 10, name: 'Lab Investigation (Basic)', base_price: 2500, category: 'Diagnostic' },
        { id: 11, name: 'Lab Investigation (Advanced)', base_price: 8000, category: 'Diagnostic' },
        { id: 12, name: 'Radiology (X-Ray)', base_price: 1200, category: 'Diagnostic' },
        { id: 13, name: 'Radiology (CT Scan)', base_price: 15000, category: 'Diagnostic' },
        { id: 14, name: 'Radiology (MRI)', base_price: 22000, category: 'Diagnostic' },
        { id: 15, name: 'Pharmacy (per prescription)', base_price: 0, category: 'Pharmacy' },
      ];
    },
    staleTime: 300000,
  });
};
