import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '../lib/supabase';

/* ============================================================
   SYNCHRO — Billing Data Hooks
   
   Comprehensive billing hooks for:
   - Dashboard statistics
   - Invoice management
   - Payment processing
   - Insurance claims
   - Procedure charges
   ============================================================ */

// ─── Dashboard Statistics ─────────────────────────────────
export const useBillingDashboard = () => {
  const today = new Date().toISOString().split('T')[0];
  return useQuery({
    queryKey: ['billing-dashboard', today],
    queryFn: async () => {
      // Get all invoices 
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

      // Get billing accounts
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

      if (error) throw error;
      return data || [];
    },
    refetchInterval: 15000,
  });
};

// ─── All Invoices ─────────────────────────────────────────
export const useInvoices = (statusFilter = null) => {
  return useQuery({
    queryKey: ['invoices', statusFilter],
    queryFn: async () => {
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
      if (error) throw error;
      return data || [];
    },
    refetchInterval: 15000,
  });
};

// ─── Single Invoice ──────────────────────────────────────
export const useInvoice = (invoiceId) => {
  return useQuery({
    queryKey: ['invoice', invoiceId],
    queryFn: async () => {
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

      if (error) throw error;
      return data;
    },
    enabled: !!invoiceId,
  });
};

// ─── All Payments ─────────────────────────────────────────
export const usePayments = () => {
  return useQuery({
    queryKey: ['payments'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('payments')
        .select(`
          *,
          invoice:invoices (invoice_number, total_amount, status,
            patient:patients (first_name, last_name, patient_code)
          )
        `)
        .order('payment_date', { ascending: false });

      if (error) throw error;
      return data || [];
    },
    refetchInterval: 15000,
  });
};

// ─── Record a Payment ─────────────────────────────────────
export const useRecordPayment = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ invoiceId, amount, method, reference }) => {
      // Insert payment
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

      // Get invoice to update status
      const { data: invoice } = await supabase
        .from('invoices')
        .select('total_amount, billing_account_id')
        .eq('id', invoiceId)
        .single();

      if (invoice) {
        // Get total payments for this invoice
        const { data: allPayments } = await supabase
          .from('payments')
          .select('amount')
          .eq('invoice_id', invoiceId)
          .eq('status', 'COMPLETED');

        const totalPaid = (allPayments || []).reduce((s, p) => s + (p.amount || 0), 0);
        const newStatus = totalPaid >= invoice.total_amount ? 'PAID' : 'PARTIALLY_PAID';

        await supabase
          .from('invoices')
          .update({ status: newStatus, paid_at: newStatus === 'PAID' ? new Date().toISOString() : null })
          .eq('id', invoiceId);

        // Update billing account
        if (invoice.billing_account_id) {
          const { data: account } = await supabase
            .from('billing_accounts')
            .select('paid_amount')
            .eq('id', invoice.billing_account_id)
            .single();

          if (account) {
            await supabase
              .from('billing_accounts')
              .update({ paid_amount: (account.paid_amount || 0) + amount })
              .eq('id', invoice.billing_account_id);
          }
        }
      }

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

      if (error) throw error;
      return data || [];
    },
    refetchInterval: 15000,
  });
};

// ─── Procedure Charge Catalog ─────────────────────────────
export const useProcedureCharges = () => {
  return useQuery({
    queryKey: ['procedure-charges'],
    queryFn: async () => {
      // Return default procedure charges
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
